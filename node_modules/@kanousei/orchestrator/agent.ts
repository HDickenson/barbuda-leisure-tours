/**
 * Claude AI Orchestrator for WordPress to Next.js Migration
 *
 * This orchestrator uses Claude's tool calling to coordinate the entire
 * website cloning pipeline with quality checks at each stage.
 *
 * @packageDocumentation
 */

import 'dotenv/config';
import { config } from 'dotenv';
import { resolve } from 'path';

// Ensure .env is loaded from project root
config({ path: resolve(process.cwd(), '../../.env') });
import Anthropic from '@anthropic-ai/sdk';
import { crawlSite } from '@kanousei/crawler';
import { stashAssets, coverageForSite } from '@kanousei/asset-pipeline';
import { generateDesignSystem } from '@kanousei/design-system';
import { synthPages } from '@kanousei/page-synth';
import { verifyPreview } from '@kanousei/verifier';
import type {
  CrawlResult,
  AssetResult,
  Coverage,
  DesignSystem,
  SynthResult,
  VerificationReport,
  CloneResult
} from '@kanousei/types';
import {
  urlSchema,
  crawlResultSchema,
  assetResultSchema,
  coverageSchema,
  designSystemSchema,
  synthResultSchema,
  verificationReportSchema
} from '@kanousei/validation';

// ============================================================================
// Configuration & Initialization
// ============================================================================

/**
 * Validate required environment variables
 */
function validateEnv() {
  const required = ['SCOUT_WORKER_URL'];
  const missing = required.filter(key => !process.env[key]);

  if (missing.length > 0) {
    throw new Error(`Missing required environment variables: ${missing.join(', ')}`);
  }

  // Authentication handled by Claude Code when running in that environment
  if (process.env.CLAUDECODE) {
    console.log('✅ Running inside Claude Code - using built-in authentication');
  } else if (!process.env.CLAUDE_CODE_OAUTH_TOKEN && !process.env.ANTHROPIC_API_KEY) {
    throw new Error('Missing required environment variable: CLAUDE_CODE_OAUTH_TOKEN or ANTHROPIC_API_KEY');
  }
}

validateEnv();

/**
 * Initialize Anthropic client
 * Uses built-in auth in Claude Code, otherwise requires explicit API key
 */
const anthropic = new Anthropic({
  apiKey: process.env.CLAUDE_CODE_OAUTH_TOKEN || process.env.ANTHROPIC_API_KEY || undefined
});

/**
 * Claude model to use (your subscription model)
 */
const CLAUDE_MODEL = 'claude-sonnet-4-20250514';

/**
 * Maximum conversation turns to prevent infinite loops
 */
const MAX_TURNS = 20;

// ============================================================================
// Tool Definitions for Claude
// ============================================================================

/**
 * Tools available to Claude for the cloning pipeline
 */
const tools: Anthropic.Tool[] = [
  {
    name: 'scout',
    description: `Crawl a website to discover all pages, assets, and structure.

    This tool:
    - Discovers all pages via links and sitemap
    - Extracts all assets (images, CSS, JS, fonts)
    - Stores HTML in R2 for later processing
    - Returns a siteId for subsequent operations

    Quality checks:
    - Validates URL format
    - Ensures pages were discovered
    - Reports any crawl errors`,
    input_schema: {
      type: 'object',
      properties: {
        url: {
          type: 'string',
          description: 'The website URL to crawl (must be valid HTTP/HTTPS URL)'
        }
      },
      required: ['url']
    }
  },
  {
    name: 'download_assets',
    description: `Download all assets discovered during scouting.

    This tool:
    - Downloads images, CSS, JS, fonts from discovered pages
    - Optimizes images (WebP conversion)
    - Stores assets in R2
    - Tracks download coverage percentage

    Quality checks:
    - Ensures 85%+ coverage before proceeding
    - Reports failed downloads
    - Validates asset integrity`,
    input_schema: {
      type: 'object',
      properties: {
        siteId: {
          type: 'string',
          description: 'The site ID from scout operation'
        }
      },
      required: ['siteId']
    }
  },
  {
    name: 'check_coverage',
    description: `Check asset download coverage percentage.

    Returns:
    - Coverage percentage (0-1)
    - Total assets discovered
    - Assets successfully downloaded

    Use this to verify 85%+ coverage before proceeding to design extraction.`,
    input_schema: {
      type: 'object',
      properties: {
        siteId: {
          type: 'string',
          description: 'The site ID to check coverage for'
        }
      },
      required: ['siteId']
    }
  },
  {
    name: 'extract_design_system',
    description: `Analyze the website and extract design system tokens.

    This tool:
    - Parses CSS from all pages
    - Extracts colors, typography, spacing, shadows
    - Uses Claude Vision API to analyze screenshots for pixel-perfect measurements
    - Detects animations and transitions
    - Identifies reusable component patterns

    Quality checks:
    - Validates all colors are valid hex codes
    - Ensures fonts are available
    - Verifies animation timing values
    - Checks component pattern frequency`,
    input_schema: {
      type: 'object',
      properties: {
        siteId: {
          type: 'string',
          description: 'The site ID to extract design system from'
        }
      },
      required: ['siteId']
    }
  },
  {
    name: 'synthesize_pages',
    description: `Generate Next.js pages and components from extracted design system.

    This tool:
    - Generates TypeScript components using shadcn/ui patterns
    - Creates page routes matching original URLs
    - Converts animations to Framer Motion
    - Builds utilities (carousels, modals, etc.)
    - Generates proper TypeScript types

    Quality checks:
    - TypeScript compilation validation
    - Component naming conventions
    - Import path verification
    - Animation prop validation`,
    input_schema: {
      type: 'object',
      properties: {
        siteId: {
          type: 'string',
          description: 'The site ID to generate pages for'
        }
      },
      required: ['siteId']
    }
  },
  {
    name: 'verify_build',
    description: `Verify the generated Next.js site matches the original.

    This tool:
    - Builds the Next.js site
    - Takes screenshots of all pages
    - Compares screenshots with originals (visual regression)
    - Checks all internal links
    - Runs performance tests
    - Scans for accessibility issues

    Quality checks:
    - Build must succeed
    - Visual diff < 5% per page
    - No broken links (404s)
    - Lighthouse scores > 90
    - No critical A11y issues`,
    input_schema: {
      type: 'object',
      properties: {
        siteId: {
          type: 'string',
          description: 'The site ID to verify'
        }
      },
      required: ['siteId']
    }
  }
];

// ============================================================================
// Tool Execution with Validation
// ============================================================================

/**
 * Execute a tool with input validation and error handling
 */
async function executeTool(
  toolName: string,
  input: any
): Promise<{ result: any; error?: string }> {
  const startTime = Date.now();

  try {
    console.log(`\n🔧 Executing: ${toolName}`);
    console.log(`📥 Input:`, JSON.stringify(input, null, 2));

    let result: any;

    switch (toolName) {
      case 'scout': {
        // Validate URL
        const parseResult = urlSchema.safeParse(input.url);
        if (!parseResult.success) {
          return {
            result: null,
            error: `Invalid URL: ${parseResult.error.message}`
          };
        }

        // Execute crawl
        result = await crawlSite(input.url);

        // Validate result
        const validation = crawlResultSchema.safeParse(result);
        if (!validation.success) {
          return {
            result,
            error: `Invalid crawl result: ${validation.error.message}`
          };
        }

        // Quality check: ensure pages were discovered
        if (result.pages.length === 0 && result.metrics.pageCount === 0) {
          return {
            result,
            error: 'No pages discovered. Check if URL is accessible and robots.txt allows crawling.'
          };
        }

        break;
      }

      case 'download_assets': {
        result = await stashAssets(input.siteId);

        // Validate result
        const validation = assetResultSchema.safeParse(result);
        if (!validation.success) {
          return {
            result,
            error: `Invalid asset result: ${validation.error.message}`
          };
        }

        // Quality check: warn if many failures
        const failureRate = result.failed / result.total;
        if (failureRate > 0.3) {
          return {
            result,
            error: `High failure rate (${(failureRate * 100).toFixed(1)}%). Network issues or protected assets.`
          };
        }

        break;
      }

      case 'check_coverage': {
        result = await coverageForSite(input.siteId);

        // Validate result
        const validation = coverageSchema.safeParse(result);
        if (!validation.success) {
          return {
            result,
            error: `Invalid coverage result: ${validation.error.message}`
          };
        }

        // Quality check: warn if coverage too low
        if (result.coverage < 0.85) {
          return {
            result,
            error: `Coverage too low (${(result.coverage * 100).toFixed(1)}%). Need 85%+ to proceed with design extraction.`
          };
        }

        break;
      }

      case 'extract_design_system': {
        result = await generateDesignSystem(input.siteId);

        // Validate result
        const validation = designSystemSchema.safeParse(result);
        if (!validation.success) {
          return {
            result,
            error: `Invalid design system: ${validation.error.message}`
          };
        }

        // Quality check: ensure tokens were extracted
        if (Object.keys(result.tokens.colors).length < 3) {
          return {
            result,
            error: 'Too few colors extracted. Design analysis may be incomplete.'
          };
        }

        break;
      }

      case 'synthesize_pages': {
        result = await synthPages(input.siteId);

        // Validate result
        const validation = synthResultSchema.safeParse(result);
        if (!validation.success) {
          return {
            result,
            error: `Invalid synth result: ${validation.error.message}`
          };
        }

        // Quality check: ensure files were generated
        if (result.files.length === 0) {
          return {
            result,
            error: 'No files generated. Component synthesis failed.'
          };
        }

        break;
      }

      case 'verify_build': {
        result = await verifyPreview(input.siteId);

        // Validate result
        const validation = verificationReportSchema.safeParse(result);
        if (!validation.success) {
          return {
            result,
            error: `Invalid verification result: ${validation.error.message}`
          };
        }

        // Quality check: report failures
        if (!result.passed) {
          const issues = [];
          if (!result.visualDiff.passed) issues.push('visual diff failed');
          if (!result.linkReport.ok) issues.push(`${result.linkReport.broken.length} broken links`);
          if (!result.a11y.ok) issues.push(`${result.a11y.issues.length} A11y issues`);

          return {
            result,
            error: `Verification failed: ${issues.join(', ')}`
          };
        }

        break;
      }

      default:
        return {
          result: null,
          error: `Unknown tool: ${toolName}`
        };
    }

    const duration = Date.now() - startTime;
    console.log(`✅ Success (${duration}ms)`);
    console.log(`📤 Result:`, JSON.stringify(result, null, 2));

    return { result };

  } catch (error: any) {
    const duration = Date.now() - startTime;
    console.error(`❌ Error (${duration}ms):`, error.message);

    return {
      result: null,
      error: `Tool execution failed: ${error.message}`
    };
  }
}

// ============================================================================
// Main Orchestration Loop
// ============================================================================

/**
 * Clone a website using Claude AI orchestration
 *
 * @param url - Website URL to clone
 * @returns Complete clone result with all stage outputs
 */
export async function cloneWebsite(url: string): Promise<CloneResult> {
  const pipelineStart = Date.now();

  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║  WordPress → Next.js Migration Pipeline (Claude AI)   ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  console.log(`🎯 Target: ${url}\n`);

  // Validate URL before starting
  const urlValidation = urlSchema.safeParse(url);
  if (!urlValidation.success) {
    throw new Error(`Invalid URL: ${urlValidation.error.message}`);
  }

  // Initialize conversation with Claude
  const messages: Anthropic.MessageParam[] = [
    {
      role: 'user',
      content: `Clone this website to Next.js with pixel-perfect design replication: ${url}

Execute the complete pipeline in order:

1. **Scout**: Crawl the website to discover all pages and assets
2. **Download**: Download all discovered assets (must reach 85%+ coverage)
3. **Design**: Extract design system (colors, typography, spacing, animations)
4. **Synthesize**: Generate Next.js TypeScript components and pages
5. **Verify**: Build and verify the site matches the original

Quality requirements:
- All pages must be discovered
- 85%+ asset coverage required
- Design tokens must be comprehensive
- TypeScript must compile without errors
- Visual diff < 5% per page
- No broken links
- Performance scores > 90

Execute each step, check quality gates, and report progress. If any step fails quality checks, stop and report the issue.`
    }
  ];

  let siteId = '';
  let continueLoop = true;
  let turnCount = 0;

  // Store results from each stage
  let crawlResult: CrawlResult | null = null;
  let assetResult: AssetResult | null = null;
  let designSystem: DesignSystem | null = null;
  let synthResult: SynthResult | null = null;
  let verificationReport: VerificationReport | null = null;

  const errors: string[] = [];

  // Main conversation loop
  while (continueLoop && turnCount < MAX_TURNS) {
    turnCount++;

    console.log(`\n═══ Turn ${turnCount}/${MAX_TURNS} ═══\n`);

    try {
      // Call Claude with tools
      const response = await anthropic.messages.create({
        model: CLAUDE_MODEL,
        max_tokens: 4096,
        tools,
        messages
      });

      console.log(`🤖 Claude: ${response.stop_reason}`);

      // Add assistant response to conversation
      messages.push({
        role: 'assistant',
        content: response.content
      });

      // Handle tool use
      if (response.stop_reason === 'tool_use') {
        const toolResults: Anthropic.ToolResultBlockParam[] = [];

        // Execute all tool calls in this turn
        for (const block of response.content) {
          if (block.type === 'tool_use') {
            const { result, error } = await executeTool(block.name, block.input);

            // Store results for final output
            if (result) {
              if (block.name === 'scout') {
                crawlResult = result;
                siteId = result.siteId;
              } else if (block.name === 'download_assets') {
                assetResult = result;
              } else if (block.name === 'extract_design_system') {
                designSystem = result;
              } else if (block.name === 'synthesize_pages') {
                synthResult = result;
              } else if (block.name === 'verify_build') {
                verificationReport = result;
              }
            }

            // Add error to tracking
            if (error) {
              errors.push(`${block.name}: ${error}`);
            }

            // Send result back to Claude
            toolResults.push({
              type: 'tool_result',
              tool_use_id: block.id,
              content: error
                ? JSON.stringify({ error, result })
                : JSON.stringify(result),
              is_error: !!error
            });
          }
        }

        // Continue conversation with tool results
        messages.push({
          role: 'user',
          content: toolResults
        });

      } else if (response.stop_reason === 'end_turn') {
        // Claude finished the task
        console.log('\n✅ Pipeline completed!\n');

        // Extract final summary from Claude
        for (const block of response.content) {
          if (block.type === 'text') {
            console.log('📋 Summary:');
            console.log(block.text);
            console.log();
          }
        }

        continueLoop = false;

      } else if (response.stop_reason === 'max_tokens') {
        console.log('\n⚠️  Hit token limit, wrapping up...');
        continueLoop = false;
        errors.push('Hit maximum token limit');

      } else {
        console.log(`\n⚠️  Unexpected stop reason: ${response.stop_reason}`);
        continueLoop = false;
        errors.push(`Unexpected stop reason: ${response.stop_reason}`);
      }

    } catch (error: any) {
      console.error('\n❌ Pipeline error:', error.message);
      errors.push(`Pipeline error: ${error.message}`);
      continueLoop = false;
    }
  }

  if (turnCount >= MAX_TURNS) {
    console.log('\n⚠️  Hit maximum turns, stopping...');
    errors.push('Hit maximum conversation turns');
  }

  const duration = Date.now() - pipelineStart;

  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║                 Pipeline Complete                      ║');
  console.log('╚════════════════════════════════════════════════════════╝');
  console.log(`\n⏱️  Total time: ${(duration / 1000).toFixed(1)}s`);
  console.log(`🔄 Turns: ${turnCount}`);
  console.log(`📝 Errors: ${errors.length}\n`);

  // Build final result
  const success = errors.length === 0 && verificationReport?.passed === true;

  const result: CloneResult = {
    siteId,
    success,
    crawl: crawlResult || { siteId, pages: [], assets: [], metrics: { pageCount: 0, assetCount: 0, duration: 0, errors: 0 } },
    assets: assetResult || { siteId, total: 0, downloaded: 0, failed: 0, duration: 0 },
    designSystem: designSystem || {
      siteId,
      tokens: {
        colors: { primary: '#000', background: '#fff', foreground: '#000' },
        typography: { fontFamily: [], fontSize: [], fontWeight: [], lineHeight: [] },
        spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
        shadows: [],
        borderRadius: [],
        animations: []
      },
      components: [],
      timestamp: new Date().toISOString()
    },
    synthesis: synthResult || { siteId, pages: 0, components: 0, files: [], duration: 0 },
    verification: verificationReport || {
      siteId,
      passed: false,
      visualDiff: { passed: false, pages: [] },
      linkReport: { ok: false, total: 0, broken: [] },
      responsiveReport: { ok: false },
      perf: { regression: 0 },
      a11y: { ok: false, issues: [] },
      timestamp: new Date().toISOString()
    },
    duration,
    errors: errors.length > 0 ? errors : undefined
  };

  return result;
}

// ============================================================================
// CLI Entry Point
// ============================================================================

/**
 * Run from command line
 */
const isMainModule = import.meta.url.endsWith('agent.ts') &&
                      (process.argv[1]?.includes('agent') || !process.argv[1]);

if (isMainModule) {
  (async () => {
    const targetUrl = process.env.TARGET_URL || process.argv[2];

    if (!targetUrl) {
      console.error('❌ Error: No URL provided');
      console.error('Usage: tsx agent.ts <url>');
      console.error('   or: TARGET_URL=<url> tsx agent.ts');
      process.exit(1);
    }

    try {
      const result = await cloneWebsite(targetUrl);

      // Write result to file
      const fs = await import('fs/promises');
      const outputPath = `./results/${result.siteId}-result.json`;
      await fs.mkdir('./results', { recursive: true });
      await fs.writeFile(outputPath, JSON.stringify(result, null, 2));

      console.log(`\n💾 Result saved to: ${outputPath}`);

      // Exit with appropriate code
      process.exit(result.success ? 0 : 1);

    } catch (error: any) {
      console.error('\n❌ Fatal error:', error.message);
      process.exit(1);
    }
  })();
}

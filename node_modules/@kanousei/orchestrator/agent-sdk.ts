/**
 * Claude Agent SDK Orchestrator for WordPress to Next.js Migration
 *
 * Uses Claude Agent SDK with OAuth authentication from Claude Code subscription
 *
 * @packageDocumentation
 */

import 'dotenv/config';
import { config } from 'dotenv';
import { resolve } from 'path';

// Load .env from project root
config({ path: resolve(process.cwd(), '../../.env') });
import { query, tool, createSdkMcpServer } from '@anthropic-ai/claude-agent-sdk';
import { z } from 'zod';
import { crawlSite } from '@kanousei/crawler';
import { stashAssets, coverageForSite } from '@kanousei/asset-pipeline';
import { generateDesignSystem } from '@kanousei/design-system';
import { synthPages } from '@kanousei/page-synth';
import { verifyPreview } from '@kanousei/verifier';
import type { CloneResult } from '@kanousei/types';
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

  // Authentication is handled automatically by Claude Agent SDK when running in Claude Code
  if (process.env.CLAUDECODE) {
    console.log('✅ Running inside Claude Code - using built-in authentication');
  } else if (process.env.CLAUDE_CODE_OAUTH_TOKEN) {
    console.log('✅ Using Claude Code OAuth token');
  } else if (process.env.ANTHROPIC_API_KEY) {
    console.log('✅ Using Anthropic API key');
  } else {
    console.log('⚠️  No explicit auth configured - relying on SDK default authentication');
  }
}

validateEnv();

// ============================================================================
// Tool Definitions using Claude Agent SDK
// ============================================================================

/**
 * Scout tool - Crawl website and discover pages/assets
 */
const scoutTool = tool(
  'scout',
  `Crawl a website to discover all pages, assets, and structure.

This tool will:
- Discover all pages via links and sitemap
- Extract all assets (images, CSS, JS, fonts)
- Store HTML in R2 for later processing
- Return a siteId for subsequent operations

Quality checks:
- Validates URL format
- Ensures pages were discovered
- Reports any crawl errors`,
  {
    url: z.string().url().describe('The website URL to crawl (must be valid HTTP/HTTPS URL)')
  },
  async ({ url }) => {
    console.log(`\n🔧 Executing: scout`);
    console.log(`📥 Input: ${url}`);

    // Validate URL
    const parseResult = urlSchema.safeParse(url);
    if (!parseResult.success) {
      return {
        content: [{
          type: 'text',
          text: `Error: Invalid URL - ${parseResult.error.message}`
        }],
        isError: true
      };
    }

    try {
      // Execute crawl
      const result = await crawlSite(url);

      // Validate result
      const validation = crawlResultSchema.safeParse(result);
      if (!validation.success) {
        return {
          content: [{
            type: 'text',
            text: `Error: Invalid crawl result - ${validation.error.message}`
          }],
          isError: true
        };
      }

      // Quality check
      if (result.pages.length === 0 && result.metrics.pageCount === 0) {
        return {
          content: [{
            type: 'text',
            text: 'Error: No pages discovered. Check if URL is accessible and robots.txt allows crawling.'
          }],
          isError: true
        };
      }

      console.log(`✅ Crawled ${result.metrics.pageCount} pages, found ${result.metrics.assetCount} assets`);

      return {
        content: [{
          type: 'text',
          text: `Successfully crawled website!\n\nResults:\n- Site ID: ${result.siteId}\n- Pages discovered: ${result.metrics.pageCount}\n- Assets found: ${result.metrics.assetCount}\n- Duration: ${(result.metrics.duration / 1000).toFixed(1)}s\n\nReady to proceed with asset download.`
        }]
      };
    } catch (error: any) {
      console.error(`❌ Error:`, error.message);
      return {
        content: [{
          type: 'text',
          text: `Error: ${error.message}`
        }],
        isError: true
      };
    }
  }
);

/**
 * Download assets tool
 */
const downloadAssetsTool = tool(
  'download_assets',
  `Download all assets discovered during scouting.

This tool will:
- Download images, CSS, JS, fonts from discovered pages
- Optimize images (WebP conversion)
- Store assets in R2
- Track download coverage percentage

Quality checks:
- Ensures 85%+ coverage before proceeding
- Reports failed downloads
- Validates asset integrity`,
  {
    siteId: z.string().describe('The site ID from scout operation')
  },
  async ({ siteId }) => {
    console.log(`\n🔧 Executing: download_assets`);
    console.log(`📥 Input: ${siteId}`);

    try {
      const result = await stashAssets(siteId);

      // Validate result
      const validation = assetResultSchema.safeParse(result);
      if (!validation.success) {
        return {
          content: [{
            type: 'text',
            text: `Error: Invalid asset result - ${validation.error.message}`
          }],
          isError: true
        };
      }

      // Quality check
      const failureRate = result.failed / result.total;
      if (failureRate > 0.3) {
        return {
          content: [{
            type: 'text',
            text: `Warning: High failure rate (${(failureRate * 100).toFixed(1)}%). Network issues or protected assets.`
          }]
        };
      }

      console.log(`✅ Downloaded ${result.downloaded}/${result.total} assets`);

      return {
        content: [{
          type: 'text',
          text: `Successfully downloaded assets!\n\nResults:\n- Total assets: ${result.total}\n- Downloaded: ${result.downloaded}\n- Failed: ${result.failed}\n- Coverage: ${((result.downloaded / result.total) * 100).toFixed(1)}%\n- Duration: ${(result.duration / 1000).toFixed(1)}s\n\nReady to check coverage.`
        }]
      };
    } catch (error: any) {
      console.error(`❌ Error:`, error.message);
      return {
        content: [{
          type: 'text',
          text: `Error: ${error.message}`
        }],
        isError: true
      };
    }
  }
);

/**
 * Check coverage tool
 */
const checkCoverageTool = tool(
  'check_coverage',
  `Check asset download coverage percentage.

Returns:
- Coverage percentage (0-1)
- Total assets discovered
- Assets successfully downloaded

Use this to verify 85%+ coverage before proceeding to design extraction.`,
  {
    siteId: z.string().describe('The site ID to check coverage for')
  },
  async ({ siteId }) => {
    console.log(`\n🔧 Executing: check_coverage`);
    console.log(`📥 Input: ${siteId}`);

    try {
      const result = await coverageForSite(siteId);

      // Validate result
      const validation = coverageSchema.safeParse(result);
      if (!validation.success) {
        return {
          content: [{
            type: 'text',
            text: `Error: Invalid coverage result - ${validation.error.message}`
          }],
          isError: true
        };
      }

      // Quality check
      if (result.coverage < 0.85) {
        return {
          content: [{
            type: 'text',
            text: `Coverage too low: ${(result.coverage * 100).toFixed(1)}%\n\nNeed 85%+ coverage to proceed with design extraction. Some assets may have failed to download.`
          }],
          isError: true
        };
      }

      console.log(`✅ Coverage: ${(result.coverage * 100).toFixed(1)}%`);

      return {
        content: [{
          type: 'text',
          text: `Coverage check passed!\n\nResults:\n- Coverage: ${(result.coverage * 100).toFixed(1)}%\n- Total assets: ${result.total}\n- Downloaded: ${result.downloaded}\n\nReady to proceed with design system extraction.`
        }]
      };
    } catch (error: any) {
      console.error(`❌ Error:`, error.message);
      return {
        content: [{
          type: 'text',
          text: `Error: ${error.message}`
        }],
        isError: true
      };
    }
  }
);

/**
 * Extract design system tool
 */
const extractDesignSystemTool = tool(
  'extract_design_system',
  `Analyze the website and extract design system tokens.

This tool will:
- Parse CSS from all pages
- Extract colors, typography, spacing, shadows
- Use Claude Vision API to analyze screenshots for pixel-perfect measurements
- Detect animations and transitions
- Identify reusable component patterns

Quality checks:
- Validates all colors are valid hex codes
- Ensures fonts are available
- Verifies animation timing values
- Checks component pattern frequency`,
  {
    siteId: z.string().describe('The site ID to extract design system from')
  },
  async ({ siteId }) => {
    console.log(`\n🔧 Executing: extract_design_system`);
    console.log(`📥 Input: ${siteId}`);

    try {
      const result = await generateDesignSystem(siteId);

      // Validate result
      const validation = designSystemSchema.safeParse(result);
      if (!validation.success) {
        return {
          content: [{
            type: 'text',
            text: `Error: Invalid design system - ${validation.error.message}`
          }],
          isError: true
        };
      }

      // Quality check
      if (Object.keys(result.tokens.colors).length < 3) {
        return {
          content: [{
            type: 'text',
            text: 'Warning: Too few colors extracted. Design analysis may be incomplete.'
          }]
        };
      }

      console.log(`✅ Extracted ${Object.keys(result.tokens.colors).length} colors, ${result.components.length} components`);

      return {
        content: [{
          type: 'text',
          text: `Successfully extracted design system!\n\nResults:\n- Colors: ${Object.keys(result.tokens.colors).length}\n- Font families: ${result.tokens.typography.fontFamily.length}\n- Spacing values: ${Object.keys(result.tokens.spacing).length}\n- Animations: ${result.tokens.animations.length}\n- Component patterns: ${result.components.length}\n\nReady to synthesize pages.`
        }]
      };
    } catch (error: any) {
      console.error(`❌ Error:`, error.message);
      return {
        content: [{
          type: 'text',
          text: `Error: ${error.message}`
        }],
        isError: true
      };
    }
  }
);

/**
 * Synthesize pages tool
 */
const synthesizePagesTool = tool(
  'synthesize_pages',
  `Generate Next.js pages and components from extracted design system.

This tool will:
- Generate TypeScript components using shadcn/ui patterns
- Create page routes matching original URLs
- Convert animations to Framer Motion
- Build utilities (carousels, modals, etc.)
- Generate proper TypeScript types

Quality checks:
- TypeScript compilation validation
- Component naming conventions
- Import path verification
- Animation prop validation`,
  {
    siteId: z.string().describe('The site ID to generate pages for')
  },
  async ({ siteId }) => {
    console.log(`\n🔧 Executing: synthesize_pages`);
    console.log(`📥 Input: ${siteId}`);

    try {
      const result = await synthPages(siteId);

      // Validate result
      const validation = synthResultSchema.safeParse(result);
      if (!validation.success) {
        return {
          content: [{
            type: 'text',
            text: `Error: Invalid synth result - ${validation.error.message}`
          }],
          isError: true
        };
      }

      // Quality check
      if (result.files.length === 0) {
        return {
          content: [{
            type: 'text',
            text: 'Error: No files generated. Component synthesis failed.'
          }],
          isError: true
        };
      }

      console.log(`✅ Generated ${result.pages} pages, ${result.components} components`);

      return {
        content: [{
          type: 'text',
          text: `Successfully synthesized pages!\n\nResults:\n- Pages generated: ${result.pages}\n- Components created: ${result.components}\n- Files written: ${result.files.length}\n- Duration: ${(result.duration / 1000).toFixed(1)}s\n\nReady to verify build.`
        }]
      };
    } catch (error: any) {
      console.error(`❌ Error:`, error.message);
      return {
        content: [{
          type: 'text',
          text: `Error: ${error.message}`
        }],
        isError: true
      };
    }
  }
);

/**
 * Verify build tool
 */
const verifyBuildTool = tool(
  'verify_build',
  `Verify the generated Next.js site matches the original.

This tool will:
- Build the Next.js site
- Take screenshots of all pages
- Compare screenshots with originals (visual regression)
- Check all internal links
- Run performance tests
- Scan for accessibility issues

Quality checks:
- Build must succeed
- Visual diff < 5% per page
- No broken links (404s)
- Lighthouse scores > 90
- No critical A11y issues`,
  {
    siteId: z.string().describe('The site ID to verify')
  },
  async ({ siteId }) => {
    console.log(`\n🔧 Executing: verify_build`);
    console.log(`📥 Input: ${siteId}`);

    try {
      const result = await verifyPreview(siteId);

      // Validate result
      const validation = verificationReportSchema.safeParse(result);
      if (!validation.success) {
        return {
          content: [{
            type: 'text',
            text: `Error: Invalid verification result - ${validation.error.message}`
          }],
          isError: true
        };
      }

      // Quality check
      if (!result.passed) {
        const issues = [];
        if (!result.visualDiff.passed) issues.push('visual diff failed');
        if (!result.linkReport.ok) issues.push(`${result.linkReport.broken.length} broken links`);
        if (!result.a11y.ok) issues.push(`${result.a11y.issues.length} A11y issues`);

        return {
          content: [{
            type: 'text',
            text: `Verification failed:\n\n${issues.map(i => `- ${i}`).join('\n')}\n\nPlease review the issues and fix them.`
          }],
          isError: true
        };
      }

      console.log(`✅ Verification passed!`);

      return {
        content: [{
          type: 'text',
          text: `✅ Verification successful!\n\nAll quality checks passed:\n- Visual regression: < 5% difference\n- Links: No broken links\n- Performance: Above 90\n- Accessibility: No critical issues\n\n🎉 Site migration complete!`
        }]
      };
    } catch (error: any) {
      console.error(`❌ Error:`, error.message);
      return {
        content: [{
          type: 'text',
          text: `Error: ${error.message}`
        }],
        isError: true
      };
    }
  }
);

// ============================================================================
// Create MCP Server with Tools
// ============================================================================

/**
 * MCP server with all migration tools
 */
const mcpServer = createSdkMcpServer({
  name: 'website-migration',
  version: '1.0.0',
  tools: [
    scoutTool,
    downloadAssetsTool,
    checkCoverageTool,
    extractDesignSystemTool,
    synthesizePagesTool,
    verifyBuildTool
  ]
});

// ============================================================================
// Main Orchestration with Claude Agent SDK
// ============================================================================

/**
 * Clone a website using Claude Agent SDK
 *
 * @param url - Website URL to clone
 * @returns Complete clone result with all stage outputs
 */
export async function cloneWebsite(url: string): Promise<void> {
  const pipelineStart = Date.now();

  console.log('\n╔════════════════════════════════════════════════════════╗');
  console.log('║  WordPress → Next.js Migration (Claude Agent SDK)     ║');
  console.log('╚════════════════════════════════════════════════════════╝\n');
  console.log(`🎯 Target: ${url}\n`);

  // Validate URL before starting
  const urlValidation = urlSchema.safeParse(url);
  if (!urlValidation.success) {
    throw new Error(`Invalid URL: ${urlValidation.error.message}`);
  }

  try {
    // Create query with direct tools (no MCP wrapper)
    const queryInstance = query({
      prompt: `Clone this website to Next.js with pixel-perfect design replication: ${url}

Execute the complete pipeline in order:

1. **scout**: Crawl the website to discover all pages and assets
2. **download_assets**: Download all discovered assets (must reach 85%+ coverage)
3. **check_coverage**: Verify 85%+ asset coverage
4. **extract_design_system**: Extract design system (colors, typography, spacing, animations)
5. **synthesize_pages**: Generate Next.js TypeScript components and pages
6. **verify_build**: Build and verify the site matches the original

Quality requirements:
- All pages must be discovered
- 85%+ asset coverage required
- Design tokens must be comprehensive
- TypeScript must compile without errors
- Visual diff < 5% per page
- No broken links
- Performance scores > 90

Execute each tool in order, check quality gates, and report progress. If any step fails quality checks, stop and report the issue clearly.

Start by using the 'scout' tool with the URL: ${url}`,
      options: {
        tools: [
          scoutTool,
          downloadAssetsTool,
          checkCoverageTool,
          extractDesignSystemTool,
          synthesizePagesTool,
          verifyBuildTool
        ]
      }
    });

    // Stream the response
    console.log('\n🤖 Claude Agent is working...\n');

    for await (const message of queryInstance) {
      if (message.type === 'assistant') {
        // Log assistant messages
        const apiMessage = message.message;
        for (const block of apiMessage.content) {
          if (block.type === 'text') {
            console.log(`\n💬 Claude: ${block.text}\n`);
          } else if (block.type === 'tool_use') {
            console.log(`\n🔧 Using tool: ${block.name}`);
          }
        }
      } else if (message.type === 'result') {
        // Final result
        console.log('\n✅ Pipeline completed!\n');
        console.log(`\n⏱️  Duration: ${(message.duration_ms / 1000).toFixed(1)}s`);
        console.log(`💰 Cost: $${message.total_cost_usd.toFixed(4)}`);
        console.log(`🔄 Turns: ${message.num_turns}`);
        console.log(`📋 Success: ${!message.is_error}`);
      }
    }

    const duration = Date.now() - pipelineStart;

    console.log('\n╔════════════════════════════════════════════════════════╗');
    console.log('║                 Pipeline Complete                      ║');
    console.log('╚════════════════════════════════════════════════════════╝');
    console.log(`\n⏱️  Total time: ${(duration / 1000).toFixed(1)}s\n`);

  } catch (error: any) {
    console.error('\n❌ Pipeline error:', error.message);
    throw error;
  }
}

// ============================================================================
// CLI Entry Point
// ============================================================================

/**
 * Run from command line
 */
// Check if this file is being run directly
const isMainModule = import.meta.url.endsWith('agent-sdk.ts') &&
                      (process.argv[1]?.includes('agent-sdk') || !process.argv[1]);

if (isMainModule) {
  (async () => {
    const targetUrl = process.env.TARGET_URL || process.argv[2];

    if (!targetUrl) {
      console.error('❌ Error: No URL provided');
      console.error('Usage: tsx agent-sdk.ts <url>');
      console.error('   or: TARGET_URL=<url> tsx agent-sdk.ts');
      process.exit(1);
    }

    try {
      await cloneWebsite(targetUrl);
      process.exit(0);
    } catch (error: any) {
      console.error('\n❌ Fatal error:', error.message);
      process.exit(1);
    }
  })();
}

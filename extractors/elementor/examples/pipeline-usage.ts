/**
 * Example: Using the Extraction Pipeline
 * Demonstrates how to use the complete end-to-end extraction pipeline
 */

import { createLogger } from '../src/core/Logger';
import { createExtractionPipeline } from '../src/pipeline/ExtractionPipeline';
import { ReportGenerator, generateSummaryText } from '../src/reporting/ReportGenerator';
import type { WordPressConfig } from '../src/api/WordPressClient';
import type { ExtractionConfig } from '../src/models';

/**
 * Example 1: Extract a single page
 */
async function extractSinglePage() {
  console.log('=== Example 1: Extract Single Page ===\n');

  // Setup logger
  const logger = createLogger('info');

  // Configure WordPress connection
  const wordpressConfig: WordPressConfig = {
    baseUrl: 'https://example.com',
    auth: {
      type: 'basic',
      username: 'admin',
      password: 'application-password-here',
    },
    timeout: 30000,
    retries: 3,
  };

  // Configure extraction settings
  const extractionConfig: ExtractionConfig = {
    connectorType: 'rest-api',
    sourceUrl: 'https://example.com',
    continueOnError: true,
    validateSchemas: true,
    extractGlobalStyles: false,
    includeProWidgets: true,
  };

  // Create pipeline
  const pipeline = createExtractionPipeline(
    {
      wordpress: wordpressConfig,
      extraction: extractionConfig,
      batchSize: 5,
      parallel: true,
    },
    logger,
  );

  try {
    // Extract single page
    const result = await pipeline.extractPage(123);

    if (result.page) {
      console.log(`✓ Successfully extracted page: ${result.page.title}`);
      console.log(`  - Sections: ${result.page.sections.length}`);
      console.log(`  - Duration: ${result.duration}ms`);
      console.log(`  - Issues: ${result.issues.length}`);
    } else {
      console.log('✗ Failed to extract page');
      for (const issue of result.issues) {
        console.log(`  - [${issue.severity}] ${issue.message}`);
      }
    }
  } catch (error) {
    console.error('Extraction failed:', error);
  }
}

/**
 * Example 2: Extract multiple pages with progress tracking
 */
async function extractMultiplePages() {
  console.log('\n=== Example 2: Extract Multiple Pages ===\n');

  const logger = createLogger('info');

  const wordpressConfig: WordPressConfig = {
    baseUrl: 'https://example.com',
    auth: {
      type: 'app-password',
      username: 'admin',
      password: 'xxxx xxxx xxxx xxxx xxxx xxxx',
    },
  };

  const extractionConfig: ExtractionConfig = {
    connectorType: 'rest-api',
    sourceUrl: 'https://example.com',
    continueOnError: true,
    validateSchemas: true,
    extractGlobalStyles: true,
    includeProWidgets: true,
  };

  // Create pipeline with progress callback
  const pipeline = createExtractionPipeline(
    {
      wordpress: wordpressConfig,
      extraction: extractionConfig,
      batchSize: 3,
      parallel: true,
      onProgress: (progress) => {
        console.log(
          `[${progress.percentage}%] ${progress.message} (${progress.current}/${progress.total})`,
        );
      },
    },
    logger,
  );

  // Register event listeners
  pipeline.on('page-extracted', (data: unknown) => {
    console.log('Page extracted:', data);
  });

  pipeline.on('error', (data: unknown) => {
    console.error('Error occurred:', data);
  });

  try {
    // Extract published pages only
    const report = await pipeline.extractPages({
      status: 'publish',
      includeElementorOnly: true,
    });

    // Display summary
    console.log('\n' + generateSummaryText(report));

    // Save reports in multiple formats
    await ReportGenerator.writeReport(
      report,
      './output/extraction-report.json',
      'json',
    );
    await ReportGenerator.writeReport(
      report,
      './output/extraction-report.md',
      'md',
    );
    await ReportGenerator.writeReport(
      report,
      './output/extraction-report.html',
      'html',
    );

    console.log('\nReports saved to ./output/');
  } catch (error) {
    console.error('Extraction failed:', error);
  }
}

/**
 * Example 3: Extract all Elementor pages
 */
async function extractAllPages() {
  console.log('\n=== Example 3: Extract All Elementor Pages ===\n');

  const logger = createLogger('debug', './logs/extraction.log');

  const wordpressConfig: WordPressConfig = {
    baseUrl: 'https://example.com',
    auth: {
      type: 'jwt',
      token: 'your-jwt-token-here',
    },
    timeout: 60000, // 60 seconds for large sites
    retries: 5,
  };

  const extractionConfig: ExtractionConfig = {
    connectorType: 'rest-api',
    sourceUrl: 'https://example.com',
    continueOnError: true,
    validateSchemas: true,
    extractGlobalStyles: true,
    includeProWidgets: true,
  };

  const pipeline = createExtractionPipeline(
    {
      wordpress: wordpressConfig,
      extraction: extractionConfig,
      batchSize: 10, // Process 10 pages in parallel
      parallel: true,
    },
    logger,
  );

  try {
    // Extract all Elementor pages
    const report = await pipeline.extractAll();

    console.log(generateSummaryText(report));

    // Save detailed HTML report
    await ReportGenerator.writeReport(
      report,
      './output/full-extraction-report.html',
      'html',
      {
        includeStackTraces: true,
        groupIssuesBy: 'category',
      },
    );

    console.log('\nDetailed report saved to ./output/full-extraction-report.html');

    // Check quality threshold
    if (report.coverage.coveragePercentage < 80) {
      console.warn(
        '\n⚠️  Warning: Coverage is below 80%. Review recommendations:',
      );
      for (const rec of report.recommendations ?? []) {
        console.log(`   - ${rec}`);
      }
    }
  } catch (error) {
    console.error('Extraction failed:', error);
  }
}

/**
 * Example 4: Extract specific pages by slug
 */
async function extractBySlug() {
  console.log('\n=== Example 4: Extract Pages by Slug ===\n');

  const logger = createLogger('info');

  const wordpressConfig: WordPressConfig = {
    baseUrl: 'https://example.com',
  };

  const extractionConfig: ExtractionConfig = {
    connectorType: 'rest-api',
    sourceUrl: 'https://example.com',
    continueOnError: false,
    validateSchemas: true,
    extractGlobalStyles: false,
    includeProWidgets: false,
  };

  const pipeline = createExtractionPipeline(
    {
      wordpress: wordpressConfig,
      extraction: extractionConfig,
    },
    logger,
  );

  try {
    // Extract pages by slug
    const report = await pipeline.extractPages({
      slug: 'about-us',
      status: 'publish',
    });

    console.log(generateSummaryText(report));

    // Generate markdown report to console
    const markdown = ReportGenerator.toMarkdown(report, {
      includeSummaryOnly: true,
    });
    console.log('\n' + markdown);
  } catch (error) {
    console.error('Extraction failed:', error);
  }
}

/**
 * Example 5: Custom error handling and reporting
 */
async function customErrorHandling() {
  console.log('\n=== Example 5: Custom Error Handling ===\n');

  const logger = createLogger('info');

  const wordpressConfig: WordPressConfig = {
    baseUrl: 'https://example.com',
    auth: {
      type: 'basic',
      username: 'admin',
      password: 'password',
    },
  };

  const extractionConfig: ExtractionConfig = {
    connectorType: 'rest-api',
    sourceUrl: 'https://example.com',
    continueOnError: true, // Continue even if some pages fail
    validateSchemas: true,
    extractGlobalStyles: true,
    includeProWidgets: true,
  };

  const pipeline = createExtractionPipeline(
    {
      wordpress: wordpressConfig,
      extraction: extractionConfig,
    },
    logger,
  );

  // Track extraction progress
  let totalPages = 0;
  let successfulPages = 0;
  let failedPages = 0;

  pipeline.on('page-extracted', (data: unknown) => {
    const pageData = data as { success: boolean };
    totalPages++;
    if (pageData.success) {
      successfulPages++;
    } else {
      failedPages++;
    }
  });

  pipeline.on('error', (data: unknown) => {
    const errorData = data as { pageId?: number; error: Error };
    console.error(`Error extracting page ${errorData.pageId}:`, errorData.error.message);
  });

  try {
    const report = await pipeline.extractPages({
      status: 'any',
      includeElementorOnly: true,
    });

    console.log(`\nExtraction complete:`);
    console.log(`  Total: ${totalPages}`);
    console.log(`  Successful: ${successfulPages}`);
    console.log(`  Failed: ${failedPages}`);
    console.log(`  Coverage: ${report.coverage.coveragePercentage}%`);

    // Save report with error details
    await ReportGenerator.writeReport(
      report,
      './output/error-report.md',
      'md',
      {
        includeStackTraces: true,
        groupIssuesBy: 'severity',
      },
    );

    console.log('\nError report saved to ./output/error-report.md');
  } catch (error) {
    console.error('Critical extraction failure:', error);
  }
}

// Main execution
async function main() {
  console.log('Elementor Extraction Pipeline Examples\n');
  console.log('Note: Update WordPress URLs and credentials before running\n');

  // Uncomment to run examples:
  // await extractSinglePage();
  // await extractMultiplePages();
  // await extractAllPages();
  // await extractBySlug();
  // await customErrorHandling();

  console.log('\nExamples completed. Uncomment functions in main() to run.');
}

// Run if executed directly
if (import.meta.url === `file://${process.argv[1]}`) {
  main().catch(console.error);
}

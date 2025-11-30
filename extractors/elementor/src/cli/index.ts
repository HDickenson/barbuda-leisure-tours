#!/usr/bin/env node
/**
 * Elementor Extractor CLI
 * Production-ready command-line interface for extracting Elementor data
 */

import { Command } from 'commander';
import { promises as fs } from 'fs';
import { join } from 'path';
import {
  mergeConfig,
  validateConfig,
  createLogger,
  type ExtractorConfig,
} from '../core';
import { ExtractionEngine } from '../core/ExtractionEngine';
import { ReportGenerator } from '../reporting/ReportGenerator';
import { loadConfigFile, saveConfigFile, mergeConfigWithArgs } from './config';
import {
  formatSummaryTable,
  formatError,
  formatSuccess,
  formatWarning,
  formatInfo,
  createSpinner,
} from './formatter';

const VERSION = '1.0.0';

const program = new Command();

/**
 * Main CLI program setup
 */
program
  .name('elementor-extract')
  .description('Extract Elementor page builder data from WordPress sites for conversion to Next.js')
  .version(VERSION, '-v, --version', 'Output the current version')
  .helpOption('-h, --help', 'Display help for command');

/**
 * Extract command group
 */
const extractCommand = program
  .command('extract')
  .description('Extract Elementor data from WordPress');

/**
 * Extract single page by ID
 */
extractCommand
  .command('page <id>')
  .description('Extract a single page by ID')
  .option('--url <url>', 'WordPress site URL (required)')
  .option('--auth-type <type>', 'Authentication type: basic, app-password, jwt', 'app-password')
  .option('--username <username>', 'WordPress username')
  .option('--password <password>', 'WordPress password or application password')
  .option('--token <token>', 'JWT token (if using jwt auth)')
  .option('-o, --output <path>', 'Output directory', './output')
  .option('--format <format>', 'Report format: json, md, html, all', 'json')
  .option('--verbose', 'Enable verbose logging')
  .option('--validate-only', 'Only validate, do not extract')
  .option('--config <file>', 'Load configuration from file')
  .action(async (pageId: string, options) => {
    try {
      const spinner = createSpinner();
      const config = await buildConfig(options);

      spinner.start('Connecting to WordPress...');
      const engine = new ExtractionEngine(config, createLogger(config.logLevel, config.logFile));

      const connected = await engine.testConnection();
      if (!connected) {
        spinner.fail('Failed to connect to WordPress');
        process.exit(1);
      }
      spinner.succeed('Connected to WordPress');

      if (options.validateOnly) {
        spinner.info('Validation-only mode enabled');
        process.exit(0);
      }

      spinner.start(`Extracting page ${pageId}...`);
      const result = await engine.extractPage(parseInt(pageId, 10));

      if (!result.success) {
        spinner.fail(`Failed to extract page ${pageId}`);
        console.error(formatError(result.error || 'Unknown error'));
        process.exit(1);
      }

      spinner.succeed(`Extracted page ${pageId}`);

      // Save results
      await saveResults([result], config, options.format);

      console.log(formatSuccess(`Page ${pageId} extracted successfully`));
      process.exit(0);
    } catch (error) {
      console.error(formatError(error instanceof Error ? error.message : String(error)));
      process.exit(1);
    }
  });

/**
 * Extract page by slug
 */
extractCommand
  .command('slug <slug>')
  .description('Extract a page by slug')
  .option('--url <url>', 'WordPress site URL (required)')
  .option('--auth-type <type>', 'Authentication type: basic, app-password, jwt', 'app-password')
  .option('--username <username>', 'WordPress username')
  .option('--password <password>', 'WordPress password or application password')
  .option('--token <token>', 'JWT token (if using jwt auth)')
  .option('-o, --output <path>', 'Output directory', './output')
  .option('--format <format>', 'Report format: json, md, html, all', 'json')
  .option('--verbose', 'Enable verbose logging')
  .option('--config <file>', 'Load configuration from file')
  .action(async (slug: string, options) => {
    try {
      const spinner = createSpinner();
      const config = await buildConfig(options);

      spinner.start('Connecting to WordPress...');
      const engine = new ExtractionEngine(config, createLogger(config.logLevel, config.logFile));

      const connected = await engine.testConnection();
      if (!connected) {
        spinner.fail('Failed to connect to WordPress');
        process.exit(1);
      }
      spinner.succeed('Connected to WordPress');

      spinner.start(`Extracting page with slug '${slug}'...`);

      // Note: This requires implementing slug lookup in the connector
      // For now, we'll show a message
      spinner.fail('Slug extraction not yet implemented');
      console.log(formatWarning('Please use page ID instead. Slug lookup will be added in a future version.'));

      process.exit(1);
    } catch (error) {
      console.error(formatError(error instanceof Error ? error.message : String(error)));
      process.exit(1);
    }
  });

/**
 * Extract all pages
 */
extractCommand
  .command('all')
  .description('Extract all Elementor pages')
  .option('--url <url>', 'WordPress site URL (required)')
  .option('--auth-type <type>', 'Authentication type: basic, app-password, jwt', 'app-password')
  .option('--username <username>', 'WordPress username')
  .option('--password <password>', 'WordPress password or application password')
  .option('--token <token>', 'JWT token (if using jwt auth)')
  .option('-o, --output <path>', 'Output directory', './output')
  .option('--format <format>', 'Report format: json, md, html, all', 'json')
  .option('--parallel', 'Enable parallel processing')
  .option('--batch-size <size>', 'Batch size for parallel processing', '5')
  .option('--verbose', 'Enable verbose logging')
  .option('--validate-only', 'Only validate, do not extract')
  .option('--config <file>', 'Load configuration from file')
  .action(async (options) => {
    try {
      const spinner = createSpinner();
      const config = await buildConfig(options);

      spinner.start('Connecting to WordPress...');
      const logger = createLogger(config.logLevel, config.logFile);
      const engine = new ExtractionEngine(config, logger);

      const connected = await engine.testConnection();
      if (!connected) {
        spinner.fail('Failed to connect to WordPress');
        process.exit(1);
      }
      spinner.succeed('Connected to WordPress');

      if (options.validateOnly) {
        spinner.info('Validation-only mode enabled');
        process.exit(0);
      }

      spinner.start('Extracting all pages...');
      const startTime = Date.now();

      const results = await engine.extractAllPages();

      const duration = Date.now() - startTime;
      const successCount = results.filter(r => r.success).length;

      spinner.succeed(`Extracted ${successCount}/${results.length} pages in ${formatDuration(duration)}`);

      // Generate and save report
      const report = engine.generateReport(results);

      // Save results
      await saveResults(results, config, options.format, report);

      // Display summary table
      console.log('\n' + formatSummaryTable(report));

      const exitCode = report.status === 'failed' ? 2 : report.status === 'partial' ? 1 : 0;
      process.exit(exitCode);
    } catch (error) {
      console.error(formatError(error instanceof Error ? error.message : String(error)));
      process.exit(1);
    }
  });

/**
 * Extract multiple pages by IDs
 */
extractCommand
  .command('batch <ids...>')
  .description('Extract multiple pages by IDs (space-separated)')
  .option('--url <url>', 'WordPress site URL (required)')
  .option('--auth-type <type>', 'Authentication type: basic, app-password, jwt', 'app-password')
  .option('--username <username>', 'WordPress username')
  .option('--password <password>', 'WordPress password or application password')
  .option('--token <token>', 'JWT token (if using jwt auth)')
  .option('-o, --output <path>', 'Output directory', './output')
  .option('--format <format>', 'Report format: json, md, html, all', 'json')
  .option('--parallel', 'Enable parallel processing')
  .option('--batch-size <size>', 'Batch size for parallel processing', '5')
  .option('--verbose', 'Enable verbose logging')
  .option('--config <file>', 'Load configuration from file')
  .action(async (ids: string[], options) => {
    try {
      const spinner = createSpinner();
      const config = await buildConfig(options);

      spinner.start('Connecting to WordPress...');
      const logger = createLogger(config.logLevel, config.logFile);
      const engine = new ExtractionEngine(config, logger);

      const connected = await engine.testConnection();
      if (!connected) {
        spinner.fail('Failed to connect to WordPress');
        process.exit(1);
      }
      spinner.succeed('Connected to WordPress');

      const pageIds = ids.map(id => parseInt(id, 10)).filter(id => !isNaN(id));

      if (pageIds.length === 0) {
        console.error(formatError('No valid page IDs provided'));
        process.exit(1);
      }

      console.log(formatInfo(`Extracting ${pageIds.length} pages...`));

      const startTime = Date.now();
      const results = [];

      for (let i = 0; i < pageIds.length; i++) {
        const pageId = pageIds[i];
        if (pageId === undefined) continue;

        spinner.start(`Extracting page ${pageId} (${i + 1}/${pageIds.length})...`);
        const result = await engine.extractPage(pageId);
        results.push(result);

        if (result.success) {
          spinner.succeed(`Extracted page ${pageId}`);
        } else {
          spinner.fail(`Failed to extract page ${pageId}: ${result.error}`);
        }
      }

      const duration = Date.now() - startTime;
      const successCount = results.filter(r => r.success).length;

      console.log(formatSuccess(`\nExtracted ${successCount}/${results.length} pages in ${formatDuration(duration)}`));

      // Generate and save report
      const report = engine.generateReport(results);

      // Save results
      await saveResults(results, config, options.format, report);

      // Display summary table
      console.log('\n' + formatSummaryTable(report));

      const exitCode = report.status === 'failed' ? 2 : report.status === 'partial' ? 1 : 0;
      process.exit(exitCode);
    } catch (error) {
      console.error(formatError(error instanceof Error ? error.message : String(error)));
      process.exit(1);
    }
  });

/**
 * Config command
 */
program
  .command('config')
  .description('Manage configuration files')
  .option('--init', 'Initialize a new config file')
  .option('--validate <file>', 'Validate a config file')
  .option('-o, --output <path>', 'Output path for config file', './elementor-extract.config.json')
  .action(async (options) => {
    try {
      if (options.init) {
        const defaultConfig = mergeConfig({});
        await saveConfigFile(defaultConfig, options.output as string);
        console.log(formatSuccess(`Configuration file created: ${options.output}`));
        console.log(formatInfo('Edit this file to customize your extraction settings'));
      } else if (options.validate) {
        const spinner = createSpinner();
        spinner.start('Validating configuration...');

        const partialConfig = await loadConfigFile(options.validate);
        const config = mergeConfig(partialConfig);
        validateConfig(config);

        spinner.succeed('Configuration is valid');
      } else {
        console.log(formatWarning('Please specify --init or --validate'));
        console.log(formatInfo('Examples:'));
        console.log('  elementor-extract config --init');
        console.log('  elementor-extract config --validate config.json');
      }
    } catch (error) {
      console.error(formatError(error instanceof Error ? error.message : String(error)));
      process.exit(1);
    }
  });

/**
 * Test connection command
 */
program
  .command('test')
  .description('Test connection to WordPress')
  .option('--url <url>', 'WordPress site URL (required)')
  .option('--auth-type <type>', 'Authentication type: basic, app-password, jwt', 'app-password')
  .option('--username <username>', 'WordPress username')
  .option('--password <password>', 'WordPress password or application password')
  .option('--token <token>', 'JWT token (if using jwt auth)')
  .option('--config <file>', 'Load configuration from file')
  .action(async (options) => {
    try {
      const spinner = createSpinner();
      const config = await buildConfig(options);

      spinner.start('Testing connection to WordPress...');
      const logger = createLogger(config.logLevel, config.logFile);
      const engine = new ExtractionEngine(config, logger);

      const connected = await engine.testConnection();

      if (connected) {
        spinner.succeed('Connection successful');
        console.log(formatSuccess('WordPress is accessible and authentication is working'));
        process.exit(0);
      } else {
        spinner.fail('Connection failed');
        console.log(formatError('Could not connect to WordPress. Check your URL and credentials.'));
        process.exit(1);
      }
    } catch (error) {
      console.error(formatError(error instanceof Error ? error.message : String(error)));
      process.exit(1);
    }
  });

/**
 * Helper: Build configuration from options
 */
async function buildConfig(options: any): Promise<ExtractorConfig> {
  let config: Partial<ExtractorConfig> = {};

  // Load from config file if provided
  if (options.config) {
    config = await loadConfigFile(options.config);
  }

  // Merge with CLI arguments
  config = mergeConfigWithArgs(config, options);

  // Merge with defaults and validate
  const finalConfig = mergeConfig(config);
  validateConfig(finalConfig);

  return finalConfig;
}

/**
 * Helper: Save extraction results
 */
async function saveResults(
  results: any[],
  config: ExtractorConfig,
  format: string,
  report?: any,
): Promise<void> {
  const spinner = createSpinner();
  spinner.start('Saving results...');

  // Ensure output directory exists
  await fs.mkdir(config.output.directory, { recursive: true });

  // Save individual page files
  for (const result of results) {
    if (result.page) {
      const filename = `page-${result.page.id}.json`;
      const filepath = join(config.output.directory, filename);

      const content = config.output.format === 'json-pretty'
        ? JSON.stringify(result.page, null, 2)
        : JSON.stringify(result.page);

      await fs.writeFile(filepath, content, 'utf-8');
    }
  }

  // Save reports if requested
  if (report && config.output.includeReport) {
    const formats = format === 'all' ? ['json', 'md', 'html'] : [format];

    for (const fmt of formats) {
      let outputPath: string;

      switch (fmt) {
        case 'json':
          outputPath = join(config.output.directory, 'extraction-report.json');
          await ReportGenerator.writeReport(report, outputPath, 'json');
          break;
        case 'md':
          outputPath = join(config.output.directory, 'extraction-report.md');
          await ReportGenerator.writeReport(report, outputPath, 'md');
          break;
        case 'html':
          outputPath = join(config.output.directory, 'extraction-report.html');
          await ReportGenerator.writeReport(report, outputPath, 'html');
          break;
      }
    }
  }

  spinner.succeed(`Results saved to ${config.output.directory}`);
}

/**
 * Helper: Format duration
 */
function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;

  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}

// Parse and execute
program.parse();

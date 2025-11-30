/**
 * Extraction Pipeline
 * Orchestrates the end-to-end extraction process from WordPress to ElementorPage
 */

import type { Logger } from 'winston';
import type { WordPressConfig, FetchOptions } from '../api/WordPressClient';
import { WordPressClient, createWordPressClient } from '../api/WordPressClient';
import { transformToElementorPage } from '../parsers/ElementorTransformer';
import { Validator, createValidator } from '../core/Validator';
import type {
  ElementorPage,
  ExtractionReport,
  ExtractionConfig,
  ExtractionIssue,
  WidgetCoverage,
} from '../models';

/**
 * Configuration for the extraction pipeline
 */
export interface PipelineConfig {
  wordpress: WordPressConfig;
  extraction: ExtractionConfig;
  batchSize?: number; // Number of pages to process in parallel (default: 5)
  parallel?: boolean; // Enable parallel processing (default: true)
  onProgress?: (progress: ProgressEvent) => void; // Progress callback
}

/**
 * Result of extracting a single page
 */
export interface ExtractionResult {
  page: ElementorPage | null;
  issues: ExtractionIssue[];
  duration: number;
  success: boolean;
}

/**
 * Progress event emitted during extraction
 */
export interface ProgressEvent {
  type: 'started' | 'page-fetched' | 'page-transformed' | 'page-validated' | 'page-completed' | 'completed' | 'error';
  pageId?: number;
  pageTitle?: string;
  current: number;
  total: number;
  percentage: number;
  message: string;
}

/**
 * Event handler function type
 */
export type EventHandler = (data: unknown) => void;

/**
 * Extraction Pipeline
 * Coordinates fetching, transforming, and validating Elementor data
 */
export class ExtractionPipeline {
  private config: PipelineConfig;
  private client: WordPressClient;
  private validator: Validator;
  private logger: Logger | undefined;
  private eventHandlers: Map<string, EventHandler[]> = new Map();
  private extractorVersion = '1.0.0'; // Should match package.json version

  constructor(config: PipelineConfig, logger?: Logger) {
    this.config = {
      ...config,
      batchSize: config.batchSize ?? 5,
      parallel: config.parallel ?? true,
    };
    this.logger = logger;
    this.client = createWordPressClient(config.wordpress, logger);
    this.validator = createValidator(logger);

    this.logger?.info('ExtractionPipeline initialized', {
      batchSize: this.config.batchSize,
      parallel: this.config.parallel,
    });
  }

  /**
   * Extract a single page by ID
   * @param pageId WordPress post ID
   * @returns Extraction result
   */
  async extractPage(pageId: number): Promise<ExtractionResult> {
    this.logger?.info('Extracting page', { pageId });
    const startTime = Date.now();
    const issues: ExtractionIssue[] = [];

    try {
      // Fetch page data
      this.emit('page-fetched', { pageId });
      const rawData = await this.client.fetchPage(pageId);

      if (!rawData) {
        const issue: ExtractionIssue = {
          severity: 'error',
          category: 'connector-error',
          message: `Page ${pageId} not found`,
          timestamp: new Date().toISOString(),
        };
        issues.push(issue);

        return {
          page: null,
          issues,
          duration: Date.now() - startTime,
          success: false,
        };
      }

      // Transform data
      this.emit('page-transformed', { pageId, title: rawData.title });
      const page = transformToElementorPage(
        rawData,
        this.extractorVersion,
        this.logger,
      );

      if (!page) {
        const issue: ExtractionIssue = {
          severity: 'error',
          category: 'parsing-error',
          message: `Failed to transform page ${pageId}`,
          timestamp: new Date().toISOString(),
        };
        issues.push(issue);

        return {
          page: null,
          issues,
          duration: Date.now() - startTime,
          success: false,
        };
      }

      // Validate if enabled
      if (this.config.extraction.validateSchemas) {
        this.emit('page-validated', { pageId });
        const validationResult = this.validator.validatePage(page);

        if (!validationResult.valid) {
          const validationIssues = this.validator.toExtractionIssues(
            validationResult,
            pageId,
          );
          issues.push(...validationIssues);

          if (validationIssues.some((i) => i.severity === 'error')) {
            this.logger?.warn('Page validation failed', {
              pageId,
              errorCount: validationIssues.filter((i) => i.severity === 'error').length,
            });

            if (!this.config.extraction.continueOnError) {
              return {
                page: null,
                issues,
                duration: Date.now() - startTime,
                success: false,
              };
            }
          }
        }

        // Validate structure
        const structureIssues = this.validator.validateStructure(page);
        issues.push(...structureIssues);
      }

      const duration = Date.now() - startTime;
      this.emit('page-completed', { pageId, duration });

      return {
        page,
        issues,
        duration,
        success: true,
      };
    } catch (error) {
      this.logger?.error('Page extraction failed', {
        pageId,
        error: error instanceof Error ? error.message : String(error),
      });

      const issue: ExtractionIssue = {
        severity: 'error',
        category: 'connector-error',
        message: `Extraction failed: ${error instanceof Error ? error.message : String(error)}`,
        timestamp: new Date().toISOString(),
      };

      if (error instanceof Error && error.stack) {
        issue.stackTrace = error.stack;
      }

      issues.push(issue);

      this.emit('error', { pageId, error });

      return {
        page: null,
        issues,
        duration: Date.now() - startTime,
        success: false,
      };
    }
  }

  /**
   * Extract multiple pages matching filter criteria
   * @param filter Fetch options to filter pages
   * @returns Complete extraction report
   */
  async extractPages(filter: FetchOptions = {}): Promise<ExtractionReport> {
    this.logger?.info('Extracting pages', filter);
    const startTime = Date.now();

    const report = this.createEmptyReport(startTime);

    try {
      // Fetch pages
      this.emit('started', { message: 'Fetching pages from WordPress' });
      const pages = await this.client.fetchPages(filter);

      if (pages.length === 0) {
        this.logger?.warn('No pages found matching filter', filter);
        report.status = 'failed';
        report.statusMessage = 'No pages found matching filter criteria';
        this.finalizeReport(report, startTime);
        return report;
      }

      this.logger?.info(`Found ${pages.length} pages to extract`);

      // Extract pages
      const results = await this.extractBatch(pages.map((p) => p.id));

      // Aggregate results into report
      this.aggregateResults(report, results);

      // Finalize report
      this.finalizeReport(report, startTime);

      this.emit('completed', {
        total: pages.length,
        successful: results.filter((r) => r.success).length,
      });

      return report;
    } catch (error) {
      this.logger?.error('Batch extraction failed', {
        error: error instanceof Error ? error.message : String(error),
      });

      report.status = 'failed';
      report.statusMessage = `Batch extraction failed: ${error instanceof Error ? error.message : String(error)}`;

      const issue: ExtractionIssue = {
        severity: 'error',
        category: 'connector-error',
        message: report.statusMessage,
        timestamp: new Date().toISOString(),
      };

      if (error instanceof Error && error.stack) {
        issue.stackTrace = error.stack;
      }

      report.issues.push(issue);
      report.errorCount++;

      this.finalizeReport(report, startTime);

      this.emit('error', { error });

      return report;
    }
  }

  /**
   * Extract all Elementor pages from WordPress site
   * @returns Complete extraction report
   */
  async extractAll(): Promise<ExtractionReport> {
    this.logger?.info('Extracting all Elementor pages');

    return this.extractPages({
      status: 'any',
      includeElementorOnly: true,
    });
  }

  /**
   * Register an event handler
   * @param event Event type
   * @param handler Handler function
   */
  on(
    event: 'progress' | 'page-extracted' | 'error' | 'started' | 'completed',
    handler: EventHandler,
  ): void {
    if (!this.eventHandlers.has(event)) {
      this.eventHandlers.set(event, []);
    }
    this.eventHandlers.get(event)!.push(handler);
  }

  /**
   * Emit an event to all registered handlers
   */
  private emit(event: string, data: unknown): void {
    const handlers = this.eventHandlers.get(event);
    if (handlers) {
      for (const handler of handlers) {
        try {
          handler(data);
        } catch (error) {
          this.logger?.error('Event handler error', {
            event,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }
    }

    // Also emit to progress callback if configured
    if (this.config.onProgress && typeof data === 'object' && data !== null) {
      try {
        this.config.onProgress(data as ProgressEvent);
      } catch (error) {
        this.logger?.error('Progress callback error', {
          error: error instanceof Error ? error.message : String(error),
        });
      }
    }
  }

  /**
   * Extract a batch of pages
   */
  private async extractBatch(
    pageIds: number[],
  ): Promise<ExtractionResult[]> {
    if (!this.config.parallel) {
      // Sequential processing
      const results: ExtractionResult[] = [];
      for (let i = 0; i < pageIds.length; i++) {
        const pageId = pageIds[i];
        if (pageId === undefined) continue;
        this.emitProgress(i + 1, pageIds.length, `Extracting page ${pageId}`);
        const result = await this.extractPage(pageId);
        results.push(result);
      }
      return results;
    }

    // Parallel processing with batch size limit
    const results: ExtractionResult[] = [];
    const batchSize = this.config.batchSize ?? 5;

    for (let i = 0; i < pageIds.length; i += batchSize) {
      const batch = pageIds.slice(i, i + batchSize);
      this.emitProgress(
        i + batch.length,
        pageIds.length,
        `Processing batch ${Math.floor(i / batchSize) + 1}`,
      );

      const batchResults = await Promise.all(
        batch.map((pageId) => this.extractPage(pageId)),
      );

      results.push(...batchResults);
    }

    return results;
  }

  /**
   * Emit a progress event
   */
  private emitProgress(current: number, total: number, message: string): void {
    const progress: ProgressEvent = {
      type: 'started',
      current,
      total,
      percentage: Math.round((current / total) * 100),
      message,
    };

    this.emit('progress', progress);
  }

  /**
   * Create an empty extraction report
   */
  private createEmptyReport(startTime: number): ExtractionReport {
    return {
      reportVersion: '1.0.0',
      generatedAt: new Date().toISOString(),
      extractorVersion: this.extractorVersion,
      config: this.config.extraction,
      status: 'success',
      statusMessage: 'Extraction in progress',
      coverage: {
        totalWidgets: 0,
        extractedWidgets: 0,
        failedWidgets: 0,
        coveragePercentage: 0,
        widgetTypes: {},
      },
      performance: {
        extractionStartTime: new Date(startTime).toISOString(),
        extractionEndTime: new Date().toISOString(),
        durationMs: 0,
        durationHuman: '0s',
        timings: {},
      },
      issues: [],
      errorCount: 0,
      warningCount: 0,
      infoCount: 0,
      source: {},
      recommendations: [],
    };
  }

  /**
   * Aggregate extraction results into a report
   */
  private aggregateResults(
    report: ExtractionReport,
    results: ExtractionResult[],
  ): void {
    const successfulResults = results.filter((r) => r.success);
    const failedResults = results.filter((r) => !r.success);

    // Update status
    if (failedResults.length === results.length) {
      report.status = 'failed';
      report.statusMessage = 'All pages failed to extract';
    } else if (failedResults.length > 0) {
      report.status = 'partial';
      report.statusMessage = `${successfulResults.length} of ${results.length} pages extracted successfully`;
    } else {
      report.status = 'success';
      report.statusMessage = `All ${results.length} pages extracted successfully`;
    }

    // Aggregate issues
    for (const result of results) {
      report.issues.push(...result.issues);
      report.errorCount += result.issues.filter((i) => i.severity === 'error').length;
      report.warningCount += result.issues.filter((i) => i.severity === 'warning').length;
      report.infoCount += result.issues.filter((i) => i.severity === 'info').length;
    }

    // Calculate widget coverage
    this.calculateCoverage(report, successfulResults);

    // Add recommendations
    this.generateRecommendations(report);
  }

  /**
   * Calculate widget coverage statistics
   */
  private calculateCoverage(
    report: ExtractionReport,
    results: ExtractionResult[],
  ): void {
    const coverage: WidgetCoverage = {
      totalWidgets: 0,
      extractedWidgets: 0,
      failedWidgets: 0,
      coveragePercentage: 0,
      widgetTypes: {},
    };

    for (const result of results) {
      if (!result.page) continue;

      for (const section of result.page.sections) {
        for (const column of section.columns) {
          for (const widget of column.widgets) {
            coverage.totalWidgets++;

            const widgetType = widget.widgetType;
            if (!coverage.widgetTypes[widgetType]) {
              coverage.widgetTypes[widgetType] = {
                count: 0,
                extracted: 0,
                failed: 0,
              };
            }

            coverage.widgetTypes[widgetType].count++;

            // Determine if widget was extracted successfully
            const widgetIssues = result.issues.filter(
              (i) => i.widgetId === widget.id && i.severity === 'error',
            );

            if (widgetIssues.length === 0) {
              coverage.extractedWidgets++;
              coverage.widgetTypes[widgetType].extracted++;
            } else {
              coverage.failedWidgets++;
              coverage.widgetTypes[widgetType].failed++;
            }
          }
        }
      }
    }

    if (coverage.totalWidgets > 0) {
      coverage.coveragePercentage = Math.round(
        (coverage.extractedWidgets / coverage.totalWidgets) * 100,
      );
    }

    report.coverage = coverage;
  }

  /**
   * Generate recommendations based on extraction results
   */
  private generateRecommendations(report: ExtractionReport): void {
    const recommendations: string[] = [];

    // Check coverage
    if (report.coverage.coveragePercentage < 80) {
      recommendations.push(
        `Widget coverage is ${report.coverage.coveragePercentage}%. Consider adding support for missing widget types.`,
      );
    }

    // Check for unsupported widgets
    const unsupportedIssues = report.issues.filter(
      (i) => i.category === 'missing-widget' || i.category === 'unsupported-feature',
    );
    if (unsupportedIssues.length > 0) {
      const widgetTypes = new Set(
        unsupportedIssues.map((i) => i.widgetType).filter(Boolean),
      );
      recommendations.push(
        `Found ${widgetTypes.size} unsupported widget types: ${Array.from(widgetTypes).join(', ')}`,
      );
    }

    // Check for validation errors
    if (report.errorCount > 0) {
      recommendations.push(
        `${report.errorCount} validation errors found. Review error details and update extractors.`,
      );
    }

    report.recommendations = recommendations;
  }

  /**
   * Finalize report with performance metrics
   */
  private finalizeReport(report: ExtractionReport, startTime: number): void {
    const endTime = Date.now();
    const durationMs = endTime - startTime;

    report.performance.extractionEndTime = new Date(endTime).toISOString();
    report.performance.durationMs = durationMs;
    report.performance.durationHuman = this.formatDuration(durationMs);

    this.logger?.info('Extraction completed', {
      status: report.status,
      duration: report.performance.durationHuman,
      coverage: `${report.coverage.coveragePercentage}%`,
      errors: report.errorCount,
      warnings: report.warningCount,
    });
  }

  /**
   * Format duration in human-readable format
   */
  private formatDuration(ms: number): string {
    if (ms < 1000) {
      return `${ms}ms`;
    }

    const seconds = Math.floor(ms / 1000);
    if (seconds < 60) {
      return `${seconds}s`;
    }

    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}m ${remainingSeconds}s`;
  }
}

/**
 * Create an extraction pipeline instance
 * @param config Pipeline configuration
 * @param logger Optional logger
 * @returns Extraction pipeline instance
 */
export function createExtractionPipeline(
  config: PipelineConfig,
  logger?: Logger,
): ExtractionPipeline {
  return new ExtractionPipeline(config, logger);
}

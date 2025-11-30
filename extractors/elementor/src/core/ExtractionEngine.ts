/**
 * Extraction Engine
 * Orchestrates the extraction process from WordPress to typed models
 */

import type { Logger } from 'winston';
import type { ExtractorConfig } from './Config';
import type { ElementorPage, ExtractionReport } from '../models';
import { RestApiConnector } from '../connectors/RestApiConnector';
import {
  parseElementorData,
  parseElementorSettings,
  transformToElementorPage,
} from '../parsers';
import { createValidator } from './Validator';
import type { Validator } from './Validator';

/**
 * Extraction result for a single page
 */
export interface PageExtractionResult {
  success: boolean;
  page?: ElementorPage;
  error?: string;
}

/**
 * Extraction Engine
 * Main orchestrator for extracting Elementor data
 */
export class ExtractionEngine {
  private config: ExtractorConfig;
  private logger: Logger;
  private connector: RestApiConnector;
  private validator: Validator;

  constructor(config: ExtractorConfig, logger: Logger) {
    this.config = config;
    this.logger = logger;
    this.validator = createValidator(logger);

    // Initialize connector based on config
    if (config.connector === 'rest-api' && config.restApi) {
      this.connector = new RestApiConnector(config.restApi, logger);
    } else {
      throw new Error(`Connector ${config.connector} not yet implemented`);
    }

    this.logger.info('ExtractionEngine initialized', {
      connector: config.connector,
    });
  }

  /**
   * Extract a single page by ID
   * @param pageId WordPress page ID
   * @returns Extraction result
   */
  async extractPage(pageId: number): Promise<PageExtractionResult> {
    try {
      this.logger.info(`Starting extraction for page ${pageId}`);

      // Fetch page data
      const wpPost = await this.connector.fetchPage(pageId);
      if (!wpPost) {
        return {
          success: false,
          error: `Failed to fetch page ${pageId}`,
        };
      }

      // Fetch Elementor data
      const rawElementorData = await this.connector.fetchElementorData(pageId);
      if (!rawElementorData) {
        return {
          success: false,
          error: `No Elementor data found for page ${pageId}`,
        };
      }

      // Parse Elementor data
      const elementorData = parseElementorData(rawElementorData, this.logger);
      if (!elementorData) {
        return {
          success: false,
          error: `Failed to parse Elementor data for page ${pageId}`,
        };
      }

      // Fetch page settings
      const rawSettings = await this.connector.fetchPageSettings(pageId);
      const elementorSettings = parseElementorSettings(
        rawSettings || {},
        this.logger,
      );

      // Get Elementor version from meta
      const elementorVersion =
        (wpPost.meta._elementor_version as string) || 'unknown';
      const elementorProVersion = wpPost.meta._elementor_pro_version as
        | string
        | undefined;

      // Build transformation input
      const transformInput: {
        id: number;
        title: string;
        url: string;
        slug: string;
        status: string;
        modified: string;
        elementorData: unknown[];
        elementorSettings: Record<string, unknown>;
        elementorVersion: string;
        elementorProVersion?: string;
      } = {
        id: wpPost.id,
        title: wpPost.title.rendered,
        url: wpPost.link,
        slug: wpPost.slug,
        status: wpPost.status,
        modified: wpPost.modified,
        elementorData,
        elementorSettings: elementorSettings || {},
        elementorVersion,
      };

      if (elementorProVersion) {
        transformInput.elementorProVersion = elementorProVersion;
      }

      // Transform to typed model
      const page = transformToElementorPage(
        transformInput,
        this.getExtractorVersion(),
        this.logger,
      );

      if (!page) {
        return {
          success: false,
          error: `Failed to transform page ${pageId}`,
        };
      }

      // Validate page if schema validation is enabled
      if (this.config.extraction.validateSchemas) {
        const validationResult = this.validator.validatePage(page);

        if (!validationResult.valid) {
          this.logger.warn(`Page ${pageId} validation failed`, {
            errorCount: validationResult.errors.length,
          });

          // Return error if validation is strict, otherwise continue with warning
          if (!this.config.extraction.continueOnError) {
            return {
              success: false,
              error: `Page validation failed with ${validationResult.errors.length} errors`,
            };
          }
        }

        // Run structure validation
        const structureIssues = this.validator.validateStructure(page);
        if (structureIssues.length > 0) {
          this.logger.debug(`Found ${structureIssues.length} structure issues`, {
            pageId,
          });
        }
      }

      this.logger.info(`Successfully extracted page ${pageId}`, {
        sections: page.sections.length,
        widgets: this.countWidgets(page),
      });

      return {
        success: true,
        page,
      };
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error(`Extraction failed for page ${pageId}`, {
        error: errorMessage,
      });

      return {
        success: false,
        error: errorMessage,
      };
    }
  }

  /**
   * Extract all pages with Elementor data
   * @returns Array of extraction results
   */
  async extractAllPages(): Promise<PageExtractionResult[]> {
    try {
      this.logger.info('Starting extraction for all pages');

      // Fetch all pages
      const pages = await this.connector.fetchAllPages();
      this.logger.info(`Found ${pages.length} pages with Elementor data`);

      // Extract each page
      const results: PageExtractionResult[] = [];
      for (const wpPost of pages) {
        const result = await this.extractPage(wpPost.id);
        results.push(result);

        // Stop if not continuing on error
        if (!result.success && !this.config.extraction.continueOnError) {
          this.logger.warn('Stopping extraction due to error');
          break;
        }
      }

      const successCount = results.filter((r) => r.success).length;
      this.logger.info(`Extraction complete: ${successCount}/${pages.length} successful`);

      return results;
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : String(error);
      this.logger.error('Extraction failed', { error: errorMessage });
      throw error;
    }
  }

  /**
   * Generate extraction report
   * @param results Extraction results
   * @returns Extraction report
   */
  generateReport(results: PageExtractionResult[]): ExtractionReport {
    const startTime = new Date().toISOString();
    const endTime = new Date().toISOString();

    const totalPages = results.length;
    const successfulPages = results.filter((r) => r.success).length;
    const failedPages = totalPages - successfulPages;

    // Count widgets
    let totalWidgets = 0;
    let extractedWidgets = 0;

    for (const result of results) {
      if (result.page) {
        const widgetCount = this.countWidgets(result.page);
        totalWidgets += widgetCount;
        extractedWidgets += widgetCount;
      }
    }

    const report: ExtractionReport = {
      reportVersion: '1.0.0',
      generatedAt: new Date().toISOString(),
      extractorVersion: this.getExtractorVersion(),
      config: {
        connectorType: this.config.connector,
        continueOnError: this.config.extraction.continueOnError,
        validateSchemas: this.config.extraction.validateSchemas,
        extractGlobalStyles: this.config.extraction.extractGlobalStyles,
        includeProWidgets: this.config.extraction.includeProWidgets,
      },
      status: failedPages === 0 ? 'success' : failedPages === totalPages ? 'failed' : 'partial',
      statusMessage: `Extracted ${successfulPages}/${totalPages} pages successfully`,
      coverage: {
        totalWidgets,
        extractedWidgets,
        failedWidgets: totalWidgets - extractedWidgets,
        coveragePercentage: totalWidgets > 0 ? (extractedWidgets / totalWidgets) * 100 : 0,
        widgetTypes: {},
      },
      performance: {
        extractionStartTime: startTime,
        extractionEndTime: endTime,
        durationMs: new Date(endTime).getTime() - new Date(startTime).getTime(),
        durationHuman: this.formatDuration(
          new Date(endTime).getTime() - new Date(startTime).getTime(),
        ),
        timings: {},
      },
      issues: [],
      errorCount: failedPages,
      warningCount: 0,
      infoCount: 0,
      source: {},
    };

    return report;
  }

  /**
   * Test connection to WordPress
   * @returns true if connection successful
   */
  async testConnection(): Promise<boolean> {
    try {
      this.logger.info('Testing connection to WordPress');
      const result = await this.connector.testConnection();

      if (result) {
        this.logger.info('Connection test successful');
      } else {
        this.logger.error('Connection test failed');
      }

      return result;
    } catch (error) {
      this.logger.error('Connection test failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  /**
   * Count total widgets in a page
   */
  private countWidgets(page: ElementorPage): number {
    let count = 0;
    for (const section of page.sections) {
      for (const column of section.columns) {
        count += column.widgets.length;
      }
    }
    return count;
  }

  /**
   * Get extractor version
   */
  private getExtractorVersion(): string {
    return '1.0.0'; // TODO: Read from package.json
  }

  /**
   * Format duration in milliseconds to human-readable string
   */
  private formatDuration(ms: number): string {
    if (ms < 1000) {
      return `${ms}ms`;
    } else if (ms < 60000) {
      return `${(ms / 1000).toFixed(1)}s`;
    } else {
      const minutes = Math.floor(ms / 60000);
      const seconds = Math.floor((ms % 60000) / 1000);
      return `${minutes}m ${seconds}s`;
    }
  }
}

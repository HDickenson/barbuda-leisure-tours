/**
 * ExtractionReport model
 * Quality metrics, issues, and metadata about the extraction process
 */

/**
 * Severity levels for extraction issues
 */
export type IssueSeverity = 'error' | 'warning' | 'info';

/**
 * Issue categories for classification
 */
export type IssueCategory =
  | 'missing-widget' // Widget type not yet supported
  | 'parsing-error' // Failed to parse widget data
  | 'incomplete-data' // Partial extraction due to missing fields
  | 'unsupported-feature' // Feature exists but not yet implemented
  | 'validation-error' // Data failed schema validation
  | 'connector-error' // WordPress API/database connection issue
  | 'performance'; // Performance-related issue

/**
 * Individual extraction issue
 */
export interface ExtractionIssue {
  severity: IssueSeverity;
  category: IssueCategory;
  message: string;
  widgetId?: string; // If issue relates to specific widget
  widgetType?: string;
  sectionId?: string; // If issue relates to specific section
  location?: string; // Human-readable location (e.g., "Section 2, Column 1, Widget 3")
  timestamp: string; // ISO 8601 timestamp
  stackTrace?: string; // For error-level issues
}

/**
 * Widget coverage statistics
 */
export interface WidgetCoverage {
  totalWidgets: number;
  extractedWidgets: number;
  failedWidgets: number;
  coveragePercentage: number; // 0-100

  // Breakdown by widget type
  widgetTypes: {
    [widgetType: string]: {
      count: number;
      extracted: number;
      failed: number;
    };
  };
}

/**
 * Performance metrics
 */
export interface PerformanceMetrics {
  extractionStartTime: string; // ISO 8601
  extractionEndTime: string; // ISO 8601
  durationMs: number;
  durationHuman: string; // e.g., "2.5s", "1m 30s"

  // Performance breakdown
  timings: {
    connection?: number; // Time to connect to WordPress
    dataFetch?: number; // Time to fetch page data
    parsing?: number; // Time to parse and transform data
    validation?: number; // Time to validate against schemas
    reporting?: number; // Time to generate reports
  };

  // Memory usage (if available)
  memoryUsage?: {
    peakMB: number;
    averageMB: number;
  };
}

/**
 * Extraction configuration used
 */
export interface ExtractionConfig {
  connectorType: 'rest-api' | 'wp-cli' | 'mysql';
  sourceUrl?: string; // WordPress site URL
  pageId?: number;
  pageUrl?: string;
  continueOnError: boolean;
  validateSchemas: boolean;
  extractGlobalStyles: boolean;
  includeProWidgets: boolean;
}

/**
 * Complete extraction report
 * Tracks quality, issues, and metadata for the extraction
 */
export interface ExtractionReport {
  // Report metadata
  reportVersion: string; // Report schema version
  generatedAt: string; // ISO 8601 timestamp
  extractorVersion: string; // Version of @barbuda/elementor-extractor

  // Extraction configuration
  config: ExtractionConfig;

  // Overall status
  status: 'success' | 'partial' | 'failed';
  statusMessage: string;

  // Quality metrics
  coverage: WidgetCoverage;
  performance: PerformanceMetrics;

  // Issues encountered
  issues: ExtractionIssue[];
  errorCount: number;
  warningCount: number;
  infoCount: number;

  // Source metadata
  source: {
    wordPressVersion?: string;
    elementorVersion?: string;
    elementorProVersion?: string;
    phpVersion?: string;
    activeTheme?: string;
    activePlugins?: string[];
  };

  // Recommendations for improving extraction
  recommendations?: string[];

  // Constitution compliance (for validation)
  constitutionCompliance?: {
    deterministicConversion: boolean; // Principle I
    pixelPerfectFidelity: boolean; // Principle II
    comprehensiveCapture: boolean; // Principle III
    notes?: string;
  };
}

/**
 * Summary statistics for the report
 * Useful for quick overview in CLI output
 */
export interface ReportSummary {
  status: 'success' | 'partial' | 'failed';
  totalWidgets: number;
  extractedWidgets: number;
  failedWidgets: number;
  coveragePercentage: number;
  durationMs: number;
  errorCount: number;
  warningCount: number;
}

/**
 * Generate a summary from a full report
 */
export function generateReportSummary(report: ExtractionReport): ReportSummary {
  return {
    status: report.status,
    totalWidgets: report.coverage.totalWidgets,
    extractedWidgets: report.coverage.extractedWidgets,
    failedWidgets: report.coverage.failedWidgets,
    coveragePercentage: report.coverage.coveragePercentage,
    durationMs: report.performance.durationMs,
    errorCount: report.errorCount,
    warningCount: report.warningCount,
  };
}

/**
 * Helper to add an issue to the report
 */
export function addIssue(
  report: ExtractionReport,
  issue: ExtractionIssue,
): ExtractionReport {
  report.issues.push(issue);

  // Update counters
  if (issue.severity === 'error') report.errorCount++;
  else if (issue.severity === 'warning') report.warningCount++;
  else if (issue.severity === 'info') report.infoCount++;

  // Update status if needed
  if (issue.severity === 'error' && report.status === 'success') {
    report.status = 'partial';
  }

  return report;
}

/**
 * Helper to determine if extraction meets quality threshold
 * @param report Extraction report
 * @param minCoverage Minimum acceptable coverage percentage (default 80%)
 * @returns true if extraction meets quality standards
 */
export function meetsQualityThreshold(
  report: ExtractionReport,
  minCoverage: number = 80,
): boolean {
  return (
    report.coverage.coveragePercentage >= minCoverage &&
    report.errorCount === 0 &&
    report.status !== 'failed'
  );
}

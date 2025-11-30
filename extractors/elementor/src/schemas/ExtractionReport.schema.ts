/**
 * Zod schemas for extraction reporting
 */

import { z } from 'zod';

/**
 * Issue severity schema
 */
export const IssueSeveritySchema = z.enum(['error', 'warning', 'info']);

/**
 * Issue category schema
 */
export const IssueCategorySchema = z.enum([
  'missing-widget',
  'parsing-error',
  'incomplete-data',
  'unsupported-feature',
  'validation-error',
  'connector-error',
  'performance',
]);

/**
 * Extraction issue schema
 */
export const ExtractionIssueSchema = z.object({
  severity: IssueSeveritySchema,
  category: IssueCategorySchema,
  message: z.string(),
  widgetId: z.string().optional(),
  widgetType: z.string().optional(),
  sectionId: z.string().optional(),
  location: z.string().optional(),
  timestamp: z.string(),
  stackTrace: z.string().optional(),
});

/**
 * Widget coverage statistics schema
 */
export const WidgetCoverageSchema = z.object({
  totalWidgets: z.number(),
  extractedWidgets: z.number(),
  failedWidgets: z.number(),
  coveragePercentage: z.number().min(0).max(100),
  widgetTypes: z.record(
    z.object({
      count: z.number(),
      extracted: z.number(),
      failed: z.number(),
    }),
  ),
});

/**
 * Performance metrics schema
 */
export const PerformanceMetricsSchema = z.object({
  extractionStartTime: z.string(),
  extractionEndTime: z.string(),
  durationMs: z.number(),
  durationHuman: z.string(),
  timings: z.object({
    connection: z.number().optional(),
    dataFetch: z.number().optional(),
    parsing: z.number().optional(),
    validation: z.number().optional(),
    reporting: z.number().optional(),
  }),
  memoryUsage: z
    .object({
      peakMB: z.number(),
      averageMB: z.number(),
    })
    .optional(),
});

/**
 * Extraction configuration schema
 */
export const ExtractionConfigSchema = z.object({
  connectorType: z.enum(['rest-api', 'wp-cli', 'mysql']),
  sourceUrl: z.string().optional(),
  pageId: z.number().optional(),
  pageUrl: z.string().optional(),
  continueOnError: z.boolean(),
  validateSchemas: z.boolean(),
  extractGlobalStyles: z.boolean(),
  includeProWidgets: z.boolean(),
});

/**
 * Extraction report schema
 */
export const ExtractionReportSchema = z.object({
  // Report metadata
  reportVersion: z.string(),
  generatedAt: z.string(),
  extractorVersion: z.string(),

  // Extraction configuration
  config: ExtractionConfigSchema,

  // Overall status
  status: z.enum(['success', 'partial', 'failed']),
  statusMessage: z.string(),

  // Quality metrics
  coverage: WidgetCoverageSchema,
  performance: PerformanceMetricsSchema,

  // Issues encountered
  issues: z.array(ExtractionIssueSchema),
  errorCount: z.number(),
  warningCount: z.number(),
  infoCount: z.number(),

  // Source metadata
  source: z.object({
    wordPressVersion: z.string().optional(),
    elementorVersion: z.string().optional(),
    elementorProVersion: z.string().optional(),
    phpVersion: z.string().optional(),
    activeTheme: z.string().optional(),
    activePlugins: z.array(z.string()).optional(),
  }),

  // Recommendations
  recommendations: z.array(z.string()).optional(),

  // Constitution compliance
  constitutionCompliance: z
    .object({
      deterministicConversion: z.boolean(),
      pixelPerfectFidelity: z.boolean(),
      comprehensiveCapture: z.boolean(),
      notes: z.string().optional(),
    })
    .optional(),
});

/**
 * Report summary schema
 */
export const ReportSummarySchema = z.object({
  status: z.enum(['success', 'partial', 'failed']),
  totalWidgets: z.number(),
  extractedWidgets: z.number(),
  failedWidgets: z.number(),
  coveragePercentage: z.number().min(0).max(100),
  durationMs: z.number(),
  errorCount: z.number(),
  warningCount: z.number(),
});

/**
 * Elementor Page Builder Extractor
 *
 * Main entry point for the extraction library.
 * This file exports the public API for programmatic use.
 */

// Core
export type {
  ExtractorConfig,
  ConnectorType,
  LogLevel,
  RestApiConfig,
  ExtractionOptions,
  OutputConfig,
} from './core';
export {
  mergeConfig,
  validateConfig,
  createLogger,
  DEFAULT_CONFIG,
} from './core';
export { ExtractionEngine } from './core/ExtractionEngine';

// Models (public interfaces)
export type {
  ElementorPage,
  ElementorSection,
  ElementorColumn,
  ElementorWidget,
  WidgetContent,
  WidgetStyle,
  WidgetAnimation,
  WidgetAdvanced,
  GlobalStyle,
  ExtractionReport,
  ExtractionIssue,
  WidgetCoverage,
  PerformanceMetrics,
} from './models';

// Helper functions
export {
  isWidgetType,
  resolveGlobalColor,
  resolveGlobalTypography,
  generateReportSummary,
  addIssue,
  meetsQualityThreshold,
} from './models';

// Connectors
export { RestApiConnector, type WpPost } from './connectors';

// Parsers
export {
  parsePhpSerialized,
  parseElementorData,
  parseElementorSettings,
  transformToElementorPage,
} from './parsers';

// Schemas (for validation)
export * from './schemas';

// Version
export const VERSION = '1.0.0';

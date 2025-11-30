/**
 * Models index
 * Central export for all Elementor data models
 */

// Core hierarchy models
export type { ElementorPage, PageSettings } from './ElementorPage';
export type { ElementorSection } from './ElementorSection';
export type { ElementorColumn } from './ElementorColumn';
export type {
  ElementorWidget,
  WidgetResponsive,
} from './ElementorWidget';

// Widget-related models
export type {
  WidgetContent,
  HeadingContent,
  TextEditorContent,
  ImageContent,
  ButtonContent,
  VideoContent,
  IconContent,
  SpacerContent,
  DividerContent,
  GoogleMapsContent,
  GalleryContent,
  AccordionContent,
  TabsContent,
  ProgressBarContent,
  CounterContent,
  SocialIconsContent,
  FormContent,
} from './WidgetContent';
export type { WidgetStyle } from './WidgetStyle';
export type { WidgetAnimation } from './WidgetAnimation';
export type {
  WidgetAdvanced,
  ConditionalDisplay,
} from './WidgetAdvanced';

// Global styles
export type {
  GlobalStyle,
  GlobalColors,
  GlobalTypography,
  GlobalButton,
  GlobalImage,
  GlobalLayout,
  GlobalCustomCSS,
} from './GlobalStyle';

// Extraction reporting
export type {
  ExtractionReport,
  ExtractionIssue,
  ExtractionConfig,
  WidgetCoverage,
  PerformanceMetrics,
  ReportSummary,
  IssueSeverity,
  IssueCategory,
} from './ExtractionReport';

// Common types
export type {
  SpacingValue,
  SizeValue,
  BorderSettings,
  BorderRadiusValue,
  ShadowSettings,
  TypographySettings,
  BackgroundSettings,
  AnimationType,
  EasingFunction,
} from './types';

// Helper functions
export { isWidgetType } from './ElementorWidget';
export {
  resolveGlobalColor,
  resolveGlobalTypography,
} from './GlobalStyle';
export {
  generateReportSummary,
  addIssue,
  meetsQualityThreshold,
} from './ExtractionReport';

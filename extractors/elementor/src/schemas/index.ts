/**
 * Schemas index
 * Central export for all Zod validation schemas
 */

// Common type schemas
export {
  SpacingValueSchema,
  SizeValueSchema,
  BorderRadiusValueSchema,
  BorderSettingsSchema,
  ShadowSettingsSchema,
  TypographySettingsSchema,
  BackgroundSettingsSchema,
  AnimationTypeSchema,
  EasingFunctionSchema,
} from './types.schema';

// Widget content schemas
export {
  WidgetContentSchema,
  HeadingContentSchema,
  TextEditorContentSchema,
  ImageContentSchema,
  ButtonContentSchema,
  FormContentSchema,
} from './WidgetContent.schema';

// Widget-related schemas
export {
  WidgetAnimationSchema,
  WidgetStyleSchema,
  ConditionalDisplaySchema,
  WidgetAdvancedSchema,
  WidgetResponsiveSchema,
  ElementorWidgetSchema,
} from './Widget.schema';

// Structure schemas
export { ElementorColumnSchema, ElementorSectionSchema } from './Structure.schema';

// Page schemas
export { PageSettingsSchema, ElementorPageSchema } from './Page.schema';

// Global style schemas
export {
  GlobalColorsSchema,
  GlobalTypographySchema,
  GlobalButtonSchema,
  GlobalImageSchema,
  GlobalLayoutSchema,
  GlobalCustomCSSSchema,
  GlobalStyleSchema,
} from './GlobalStyle.schema';

// Extraction report schemas
export {
  IssueSeveritySchema,
  IssueCategorySchema,
  ExtractionIssueSchema,
  WidgetCoverageSchema,
  PerformanceMetricsSchema,
  ExtractionConfigSchema,
  ExtractionReportSchema,
  ReportSummarySchema,
} from './ExtractionReport.schema';

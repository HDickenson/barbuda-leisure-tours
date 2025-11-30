/**
 * WidgetStyle model
 * Style configuration for Elementor widgets
 */

import type {
  BackgroundSettings,
  BorderRadiusValue,
  BorderSettings,
  ShadowSettings,
  SpacingValue,
  TypographySettings,
} from './types';

/**
 * Widget style configuration
 */
export interface WidgetStyle {
  // Typography
  typography?: TypographySettings;

  // Colors
  color?: string; // Text color
  backgroundColor?: string;

  // Spacing
  padding?: SpacingValue;
  margin?: SpacingValue;

  // Border
  border?: BorderSettings;
  borderRadius?: BorderRadiusValue;

  // Shadow
  boxShadow?: ShadowSettings;
  textShadow?: ShadowSettings;

  // Background (for widgets that support it)
  background?: BackgroundSettings;

  // Widget-specific styles (extensible)
  [key: string]: unknown;

  // Global style references
  globalStyleRefs?: string[]; // e.g., ['primary-color', 'heading-font']
}

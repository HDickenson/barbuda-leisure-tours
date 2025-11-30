/**
 * GlobalStyle model
 * Site-wide design system tokens and global styling configuration
 */

import type { TypographySettings, SizeValue } from './types';

/**
 * Global color palette
 * Defines site-wide color tokens that can be referenced by widgets
 */
export interface GlobalColors {
  primary?: string;
  secondary?: string;
  text?: string;
  accent?: string;
  [key: string]: string | undefined; // Custom colors
}

/**
 * Global typography presets
 * Defines site-wide typography tokens (heading styles, body text, etc.)
 */
export interface GlobalTypography {
  primary?: TypographySettings;
  secondary?: TypographySettings;
  text?: TypographySettings;
  accent?: TypographySettings;
  [key: string]: TypographySettings | undefined; // Custom typography
}

/**
 * Global button styles
 * Defines site-wide button presets
 */
export interface GlobalButton {
  typography?: TypographySettings;
  textColor?: string;
  backgroundColor?: string;
  borderRadius?: SizeValue;
  padding?: {
    top: number;
    right: number;
    bottom: number;
    left: number;
    unit: 'px' | 'em' | 'rem';
  };
}

/**
 * Global image settings
 * Site-wide defaults for images
 */
export interface GlobalImage {
  defaultImageSize: 'thumbnail' | 'medium' | 'large' | 'full';
  lightbox: boolean;
  lazyLoad: boolean;
}

/**
 * Page layout settings
 * Site-wide layout configuration
 */
export interface GlobalLayout {
  contentWidth: number; // in pixels
  contentWidthUnit: 'px' | '%';
  stretchedSectionWidth: number; // in pixels
  pageTitle: boolean; // Show page title globally
  responsiveBreakpoints: {
    mobile: number; // e.g., 767px
    mobileLandscape?: number; // e.g., 880px
    tablet: number; // e.g., 1024px
  };
}

/**
 * Global custom CSS
 * Site-wide custom CSS that applies to all Elementor pages
 */
export interface GlobalCustomCSS {
  desktop?: string;
  tablet?: string;
  mobile?: string;
}

/**
 * Site-wide Elementor global styles
 * Design system tokens and global configuration
 */
export interface GlobalStyle {
  // Design tokens
  colors?: GlobalColors;
  typography?: GlobalTypography;

  // Component presets
  buttons?: {
    primary?: GlobalButton;
    secondary?: GlobalButton;
    [key: string]: GlobalButton | undefined;
  };

  // Media defaults
  images?: GlobalImage;

  // Layout configuration
  layout?: GlobalLayout;

  // Custom CSS
  customCSS?: GlobalCustomCSS;

  // Theme style (if using Elementor Hello theme)
  themeStyle?: {
    defaultGenericFonts?: string;
    siteLogoWidth?: number;
    viewport?: {
      tablet: number;
      mobile: number;
    };
  };

  // Raw Elementor system settings (for future extensibility)
  rawSystemSettings?: Record<string, unknown>;
}

/**
 * Helper function to resolve a global style reference
 * Used when a widget references a global color or typography preset
 *
 * @example
 * const color = resolveGlobalColor(globalStyle, 'primary')
 * // Returns the actual hex color value
 */
export function resolveGlobalColor(
  globalStyle: GlobalStyle | undefined,
  colorKey: string,
): string | undefined {
  return globalStyle?.colors?.[colorKey];
}

/**
 * Helper function to resolve a global typography reference
 */
export function resolveGlobalTypography(
  globalStyle: GlobalStyle | undefined,
  typographyKey: string,
): TypographySettings | undefined {
  return globalStyle?.typography?.[typographyKey];
}

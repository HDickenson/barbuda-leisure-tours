/**
 * ElementorSection model
 * Top-level container in Elementor hierarchy
 */

import type {
  BackgroundSettings,
  BorderRadiusValue,
  BorderSettings,
  ShadowSettings,
  SpacingValue,
} from './types';
import type { ElementorColumn } from './ElementorColumn';

/**
 * Elementor section (top-level container)
 */
export interface ElementorSection {
  id: string;
  elType: 'section';

  // Layout settings
  contentPosition: 'default' | 'top' | 'middle' | 'bottom';
  stretchSection: 'no' | 'full-width' | 'stretch-section';
  heightType: 'default' | 'fit-to-screen' | 'min-height';
  customHeight?: number;

  // Gap between columns
  gap: 'default' | 'no' | 'narrow' | 'extended' | 'wide' | 'wider';

  // Background
  background: BackgroundSettings;

  // Structure
  structure: string; // e.g., "50_50" for 2 equal columns
  columns: ElementorColumn[];

  // Styling
  padding?: SpacingValue;
  margin?: SpacingValue;
  border?: BorderSettings;
  borderRadius?: BorderRadiusValue;
  boxShadow?: ShadowSettings;

  // Advanced
  cssClasses?: string;
  cssId?: string;
  zIndex?: number;

  // Responsive settings (mobile/tablet overrides)
  responsive?: {
    mobile?: Partial<Omit<ElementorSection, 'id' | 'elType' | 'columns' | 'responsive'>>;
    tablet?: Partial<Omit<ElementorSection, 'id' | 'elType' | 'columns' | 'responsive'>>;
  };
}

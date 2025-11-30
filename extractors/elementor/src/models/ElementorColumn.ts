/**
 * ElementorColumn model
 * Container within sections that holds widgets
 */

import type {
  BackgroundSettings,
  BorderRadiusValue,
  BorderSettings,
  SpacingValue,
} from './types';
import type { ElementorWidget } from './ElementorWidget';

/**
 * Elementor column (container within sections)
 */
export interface ElementorColumn {
  id: string;
  elType: 'column';

  // Layout
  width: number; // Percentage (0-100) or custom value
  widthUnit: '%' | 'px';

  // Content alignment
  contentPosition: 'default' | 'top' | 'center' | 'bottom';
  spaceBetween?: number; // Gap between widgets in pixels

  // Background
  background: BackgroundSettings;

  // Structure
  widgets: ElementorWidget[];

  // Styling
  padding?: SpacingValue;
  margin?: SpacingValue;
  border?: BorderSettings;
  borderRadius?: BorderRadiusValue;

  // Advanced
  cssClasses?: string;
  cssId?: string;

  // Responsive settings
  responsive?: {
    mobile?: Partial<Omit<ElementorColumn, 'id' | 'elType' | 'widgets' | 'responsive'>>;
    tablet?: Partial<Omit<ElementorColumn, 'id' | 'elType' | 'widgets' | 'responsive'>>;
  };
}

/**
 * WidgetAdvanced model
 * Advanced settings for Elementor widgets
 */

import type { SizeValue } from './types';
import type { WidgetAnimation } from './WidgetAnimation';

/**
 * Conditional display rules
 */
export interface ConditionalDisplay {
  enabled: boolean;
  conditions: Array<{
    type: 'device' | 'user-role' | 'custom';
    operator: 'is' | 'is-not' | 'contains' | 'starts-with' | 'ends-with';
    value: string | string[];
  }>;
  logic: 'and' | 'or';
}

/**
 * Widget advanced settings
 */
export interface WidgetAdvanced {
  // Positioning
  position?: 'default' | 'absolute' | 'fixed';
  offset?: {
    x: SizeValue;
    y: SizeValue;
  };
  zIndex?: number;

  // Animations
  animation?: WidgetAnimation;

  // Visibility
  conditionalDisplay?: ConditionalDisplay;

  // Custom attributes
  cssClasses?: string;
  cssId?: string;
  customAttributes?: Array<{
    key: string;
    value: string;
  }>;

  // Scrolling effects (Elementor Pro)
  scrollingEffects?: {
    vertical?: {
      translateY?: { from: number; to: number };
      opacity?: { from: number; to: number };
      blur?: { from: number; to: number };
      scale?: { from: number; to: number };
    };
    horizontal?: {
      translateX?: { from: number; to: number };
    };
    transparency?: {
      opacity?: { from: number; to: number };
    };
  };
}

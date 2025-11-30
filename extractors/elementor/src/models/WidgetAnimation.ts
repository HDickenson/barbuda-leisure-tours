/**
 * WidgetAnimation model
 * Animation configuration for Elementor widgets
 */

import type { AnimationType, EasingFunction } from './types';

/**
 * Widget animation configuration
 */
export interface WidgetAnimation {
  type: AnimationType;
  duration: number; // In milliseconds
  delay: number; // In milliseconds
  easing?: EasingFunction;
  trigger: 'viewport' | 'page-load' | 'hover' | 'click';
}

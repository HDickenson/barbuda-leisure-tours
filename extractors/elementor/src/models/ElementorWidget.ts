/**
 * ElementorWidget model
 * Core widget entity that ties together content, style, and advanced settings
 */

import type { WidgetContent } from './WidgetContent';
import type { WidgetStyle } from './WidgetStyle';
import type { WidgetAdvanced } from './WidgetAdvanced';

/**
 * Responsive overrides for widget settings
 * Mobile and tablet can override style and advanced settings
 */
export interface WidgetResponsive {
  mobile?: {
    style?: Partial<WidgetStyle>;
    advanced?: Partial<WidgetAdvanced>;
  };
  tablet?: {
    style?: Partial<WidgetStyle>;
    advanced?: Partial<WidgetAdvanced>;
  };
}

/**
 * Core Elementor widget model
 * Represents any widget type (heading, text-editor, image, button, form, etc.)
 */
export interface ElementorWidget {
  // Identity
  id: string;
  elType: 'widget';
  widgetType: string; // e.g., 'heading', 'text-editor', 'image', 'button', 'form'

  // Content (widget-specific)
  content: WidgetContent;

  // Styling (visual appearance)
  style: WidgetStyle;

  // Advanced settings (positioning, animations, conditional logic)
  advanced: WidgetAdvanced;

  // Responsive overrides
  responsive?: WidgetResponsive;

  // Widget metadata
  isInner?: boolean; // True if widget is inside an inner section
  defaultRendered?: boolean; // Elementor rendering flag

  // Custom data for third-party addons
  customData?: Record<string, unknown>;
}

/**
 * Type guard to check if a widget is of a specific type
 * Useful for type narrowing when processing widgets
 *
 * @example
 * if (isWidgetType(widget, 'heading')) {
 *   // widget.content is now typed as HeadingContent
 * }
 */
export function isWidgetType<T extends string>(
  widget: ElementorWidget,
  type: T,
): widget is ElementorWidget & { widgetType: T } {
  return widget.widgetType === type;
}

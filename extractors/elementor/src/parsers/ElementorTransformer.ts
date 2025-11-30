/**
 * Elementor data transformer
 * Transforms raw Elementor data into typed models
 */

import type { Logger } from 'winston';
import type {
  ElementorPage,
  ElementorSection,
  ElementorColumn,
  ElementorWidget,
  PageSettings,
  WidgetContent,
  WidgetStyle,
  WidgetAdvanced,
} from '../models';
import { extractWidgetContent as extractContent } from '../extractors/widgets';

/**
 * Transform raw WordPress/Elementor data into typed ElementorPage
 * @param rawData Raw data from WordPress (post + meta)
 * @param extractorVersion Version of the extractor
 * @param logger Optional logger
 * @returns Typed ElementorPage or null if transformation fails
 */
export function transformToElementorPage(
  rawData: {
    id: number;
    title: string;
    url: string;
    slug: string;
    status: string;
    modified: string;
    elementorData: unknown[];
    elementorSettings: Record<string, unknown>;
    elementorVersion: string;
    elementorProVersion?: string;
  },
  extractorVersion: string,
  logger?: Logger,
): ElementorPage | null {
  try {
    // Transform sections
    const sections: ElementorSection[] = [];
    for (const rawSection of rawData.elementorData) {
      if (!isRawSection(rawSection)) {
        logger?.warn('Skipping invalid section data', { rawSection });
        continue;
      }

      const section = transformToSection(rawSection, logger);
      if (section) {
        sections.push(section);
      }
    }

    // Transform page settings
    const pageSettings = transformToPageSettings(rawData.elementorSettings, logger);

    // Build page
    const page: ElementorPage = {
      id: rawData.id,
      title: rawData.title,
      url: rawData.url,
      slug: rawData.slug,
      status: normalizeStatus(rawData.status),
      lastModified: rawData.modified,
      elementorVersion: rawData.elementorVersion,
      ...(rawData.elementorProVersion && { elementorProVersion: rawData.elementorProVersion }),
      editMode: 'builder',
      templateType: 'page',
      sections,
      pageSettings,
      extractedAt: new Date().toISOString(),
      extractorVersion,
    };

    return page;
  } catch (error) {
    logger?.error('Failed to transform to ElementorPage', {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

/**
 * Transform raw section data to ElementorSection
 */
function transformToSection(
  rawSection: Record<string, unknown>,
  logger?: Logger,
): ElementorSection | null {
  try {
    const elements = (rawSection.elements as unknown[]) || [];
    const columns: ElementorColumn[] = [];

    for (const rawColumn of elements) {
      if (!isRawColumn(rawColumn)) {
        logger?.warn('Skipping invalid column data');
        continue;
      }

      const column = transformToColumn(rawColumn, logger);
      if (column) {
        columns.push(column);
      }
    }

    const settings = (rawSection.settings as Record<string, unknown>) || {};

    const section = {
      id: String(rawSection.id || generateId()),
      elType: 'section' as const,
      contentPosition: normalizeContentPosition(settings.content_position),
      stretchSection: normalizeStretchSection(settings.stretch_section),
      heightType: normalizeHeightType(settings.height),
      ...(typeof settings.custom_height === 'number' && { customHeight: settings.custom_height }),
      gap: normalizeGap(settings.gap),
      background: extractBackground(settings),
      structure: String(rawSection.structure || columns.length > 0 ? `${columns.length}0` : '100'),
      columns,
      ...(extractSpacing(settings.padding) && { padding: extractSpacing(settings.padding) }),
      ...(extractSpacing(settings.margin) && { margin: extractSpacing(settings.margin) }),
      ...(extractBorder(settings) && { border: extractBorder(settings) }),
      ...(extractBorderRadius(settings.border_radius) && { borderRadius: extractBorderRadius(settings.border_radius) }),
      ...(extractShadow(settings.box_shadow) && { boxShadow: extractShadow(settings.box_shadow) }),
      ...(typeof settings.css_classes === 'string' && { cssClasses: settings.css_classes }),
      ...(typeof settings._element_id === 'string' && { cssId: settings._element_id }),
      ...(typeof settings.z_index === 'number' && { zIndex: settings.z_index }),
      ...(extractResponsive(settings) && { responsive: extractResponsive(settings) }),
    } as ElementorSection;

    return section;
  } catch (error) {
    logger?.error('Failed to transform section', {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

/**
 * Transform raw column data to ElementorColumn
 */
function transformToColumn(
  rawColumn: Record<string, unknown>,
  logger?: Logger,
): ElementorColumn | null {
  try {
    const elements = (rawColumn.elements as unknown[]) || [];
    const widgets: ElementorWidget[] = [];

    for (const rawWidget of elements) {
      if (!isRawWidget(rawWidget)) {
        logger?.warn('Skipping invalid widget data');
        continue;
      }

      const widget = transformToWidget(rawWidget, logger);
      if (widget) {
        widgets.push(widget);
      }
    }

    const settings = (rawColumn.settings as Record<string, unknown>) || {};

    const column = {
      id: String(rawColumn.id || generateId()),
      elType: 'column' as const,
      width: typeof settings._column_size === 'number' ? settings._column_size : 100,
      widthUnit: '%' as const,
      contentPosition: normalizeContentPosition(settings.content_position),
      ...(typeof settings.space_between === 'number' && { spaceBetween: settings.space_between }),
      background: extractBackground(settings),
      widgets,
      ...(extractSpacing(settings.padding) && { padding: extractSpacing(settings.padding) }),
      ...(extractSpacing(settings.margin) && { margin: extractSpacing(settings.margin) }),
      ...(extractBorder(settings) && { border: extractBorder(settings) }),
      ...(extractBorderRadius(settings.border_radius) && { borderRadius: extractBorderRadius(settings.border_radius) }),
      ...(typeof settings.css_classes === 'string' && { cssClasses: settings.css_classes }),
      ...(typeof settings._element_id === 'string' && { cssId: settings._element_id }),
      ...(extractResponsive(settings) && { responsive: extractResponsive(settings) }),
    } as ElementorColumn;

    return column;
  } catch (error) {
    logger?.error('Failed to transform column', {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

/**
 * Transform raw widget data to ElementorWidget
 */
function transformToWidget(
  rawWidget: Record<string, unknown>,
  logger?: Logger,
): ElementorWidget | null {
  try {
    const widgetType = String(rawWidget.widgetType || 'unknown');
    const settings = (rawWidget.settings as Record<string, unknown>) || {};

    const widget: ElementorWidget = {
      id: String(rawWidget.id || generateId()),
      elType: 'widget',
      widgetType,
      content: extractWidgetContent(widgetType, settings, logger),
      style: extractWidgetStyle(settings),
      advanced: extractWidgetAdvanced(settings),
      responsive: extractResponsive(settings),
      isInner: Boolean(rawWidget.isInner),
      defaultRendered: Boolean(rawWidget.defaultRendered),
    };

    return widget;
  } catch (error) {
    logger?.error('Failed to transform widget', {
      error: error instanceof Error ? error.message : String(error),
      widgetType: rawWidget.widgetType,
    });
    return null;
  }
}

// Helper functions for extraction and normalization

function transformToPageSettings(
  rawSettings: Record<string, unknown>,
  _logger?: Logger,
): PageSettings {
  return {
    pageLayout: normalizePageLayout(rawSettings.template),
    contentWidth: typeof rawSettings.content_width === 'number' ? rawSettings.content_width : 1140,
    ...(typeof rawSettings.post_title === 'string' && { metaTitle: rawSettings.post_title }),
    ...(typeof rawSettings.post_excerpt === 'string' && { metaDescription: rawSettings.post_excerpt }),
    ...(typeof rawSettings.custom_css === 'string' && { customCss: rawSettings.custom_css }),
    ...rawSettings,
  };
}

function extractWidgetContent(
  widgetType: string,
  settings: Record<string, unknown>,
  logger?: Logger,
): WidgetContent {
  // Use dedicated widget extractor if available
  try {
    return extractContent(widgetType, settings);
  } catch (error) {
    logger?.warn(`Failed to extract ${widgetType} widget content`, {
      error: error instanceof Error ? error.message : String(error),
    });
    // Fallback to raw settings
    return settings as WidgetContent;
  }
}

function extractWidgetStyle(settings: Record<string, unknown>): WidgetStyle {
  const style: WidgetStyle = {};
  if (typeof settings._color === 'string') style.color = settings._color;
  if (typeof settings._background_color === 'string') style.backgroundColor = settings._background_color;
  const padding = extractSpacing(settings._padding);
  if (padding) style.padding = padding;
  const margin = extractSpacing(settings._margin);
  if (margin) style.margin = margin;
  const border = extractBorder(typeof settings._border === 'object' && settings._border !== null ? settings._border as Record<string, unknown> : {});
  if (border) style.border = border;
  const borderRadius = extractBorderRadius(settings._border_radius);
  if (borderRadius) style.borderRadius = borderRadius;
  return style;
}

function extractWidgetAdvanced(settings: Record<string, unknown>): WidgetAdvanced {
  const advanced: WidgetAdvanced = {};
  if (typeof settings._css_classes === 'string') advanced.cssClasses = settings._css_classes;
  if (typeof settings._element_id === 'string') advanced.cssId = settings._element_id;
  if (typeof settings._z_index === 'number') advanced.zIndex = settings._z_index;
  return advanced;
}

function extractBackground(settings: Record<string, unknown>): any {
  return {
    type: settings.background_background || 'none',
    color: settings.background_color,
    image: settings.background_image,
  };
}

function extractSpacing(value: unknown): any {
  if (typeof value === 'object' && value !== null) {
    return value;
  }
  return undefined;
}

function extractBorder(settings: Record<string, unknown>): any {
  if (settings.border_border) {
    return {
      type: settings.border_border,
      width: settings.border_width,
      color: settings.border_color,
    };
  }
  return undefined;
}

function extractBorderRadius(value: unknown): any {
  if (typeof value === 'object' && value !== null) {
    return value;
  }
  return undefined;
}

function extractShadow(value: unknown): any {
  if (typeof value === 'object' && value !== null) {
    return value;
  }
  return undefined;
}

function extractResponsive(_settings: Record<string, unknown>): any {
  return undefined; // TODO: Extract responsive settings
}

// Type guards

function isRawSection(data: unknown): data is Record<string, unknown> {
  return typeof data === 'object' && data !== null &&
    ((data as any).elType === 'section' || (data as any).elType === 'container');
}

function isRawColumn(data: unknown): data is Record<string, unknown> {
  return typeof data === 'object' && data !== null &&
    ((data as any).elType === 'column' || (data as any).elType === 'container');
}

function isRawWidget(data: unknown): data is Record<string, unknown> {
  return typeof data === 'object' && data !== null && (data as any).elType === 'widget';
}

// Normalizers

function normalizeStatus(status: string): 'publish' | 'draft' | 'pending' | 'private' {
  const normalized = status.toLowerCase();
  if (['publish', 'draft', 'pending', 'private'].includes(normalized)) {
    return normalized as 'publish' | 'draft' | 'pending' | 'private';
  }
  return 'draft';
}

function normalizePageLayout(template: unknown): 'default' | 'elementor_header_footer' | 'elementor_canvas' {
  if (template === 'elementor_header_footer' || template === 'elementor_canvas') {
    return template;
  }
  return 'default';
}

function normalizeContentPosition(value: unknown): any {
  return value || 'default';
}

function normalizeStretchSection(value: unknown): any {
  return value || 'no';
}

function normalizeHeightType(value: unknown): any {
  return value || 'default';
}

function normalizeGap(value: unknown): any {
  return value || 'default';
}

// Utilities

let idCounter = 0;
function generateId(): string {
  return `gen-${Date.now()}-${++idCounter}`;
}

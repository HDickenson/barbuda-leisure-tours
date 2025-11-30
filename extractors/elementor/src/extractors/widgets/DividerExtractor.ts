/**
 * Divider Widget Extractor
 * Extracts content from Elementor divider widgets
 */

import type { DividerContent } from '../../models';

/**
 * Extract divider widget content from Elementor settings
 * @param settings Raw Elementor widget settings
 * @returns Typed divider content
 */
export function extractDividerContent(
  settings: Record<string, unknown>,
): DividerContent {
  // Extract style
  const style = normalizeStyle(settings.style);

  // Extract weight (thickness)
  const weight = extractNumber(settings.weight, 1);

  // Extract color
  const color = settings.color ? String(settings.color) : undefined;

  // Extract width (percentage)
  const width = extractNumber(settings.width, 100);

  // Extract gap (spacing)
  const gap = extractNumber(settings.gap, 15);

  // Extract alignment
  const align = normalizeAlign(settings.align);

  // Extract icon if present
  const icon = extractIcon(settings);

  const content: DividerContent = {
    style,
    weight,
    width,
    gap,
    align,
  };

  if (color) content.color = color;
  if (icon) content.icon = icon;

  return content;
}

/**
 * Normalize divider style
 */
function normalizeStyle(
  style: unknown,
): 'solid' | 'double' | 'dotted' | 'dashed' {
  const styleStr = String(style || 'solid').toLowerCase();

  const validStyles = ['solid', 'double', 'dotted', 'dashed'];
  if (validStyles.includes(styleStr)) {
    return styleStr as 'solid' | 'double' | 'dotted' | 'dashed';
  }

  return 'solid';
}

/**
 * Normalize alignment
 */
function normalizeAlign(align: unknown): 'left' | 'center' | 'right' {
  const alignStr = String(align || 'center').toLowerCase();

  const validAligns = ['left', 'center', 'right'];
  if (validAligns.includes(alignStr)) {
    return alignStr as 'left' | 'center' | 'right';
  }

  return 'center';
}

/**
 * Extract icon configuration
 */
function extractIcon(
  settings: Record<string, unknown>,
): { value: string; library: 'solid' | 'regular' | 'brands' | 'custom' } | undefined {
  // Check if icon is enabled
  if (!settings.insert_icon || settings.insert_icon === 'no') {
    return undefined;
  }

  // Check for selected icon
  const selectedIcon = settings.selected_icon;
  if (selectedIcon && typeof selectedIcon === 'object') {
    const iconData = selectedIcon as Record<string, unknown>;
    const value = String(iconData.value || '');
    if (value) {
      const library = normalizeIconLibrary(iconData.library);
      return { value, library };
    }
  }

  // Check for legacy icon field
  const legacyIcon = settings.icon;
  if (typeof legacyIcon === 'string' && legacyIcon) {
    return {
      value: legacyIcon,
      library: 'solid',
    };
  }

  return undefined;
}

/**
 * Normalize icon library
 */
function normalizeIconLibrary(
  library: unknown,
): 'solid' | 'regular' | 'brands' | 'custom' {
  const libraryStr = String(library || '').toLowerCase();

  const validLibraries = ['solid', 'regular', 'brands'];
  if (validLibraries.includes(libraryStr)) {
    return libraryStr as 'solid' | 'regular' | 'brands';
  }

  return 'custom';
}

/**
 * Extract numeric value with default
 */
function extractNumber(value: unknown, defaultValue: number): number {
  if (typeof value === 'number') {
    return value;
  }

  if (typeof value === 'object' && value !== null) {
    const obj = value as Record<string, unknown>;
    if (typeof obj.size === 'number') {
      return obj.size;
    }
    if (typeof obj.size === 'string') {
      const parsed = parseFloat(obj.size);
      if (!isNaN(parsed)) {
        return parsed;
      }
    }
  }

  if (typeof value === 'string') {
    const parsed = parseFloat(value);
    if (!isNaN(parsed)) {
      return parsed;
    }
  }

  return defaultValue;
}

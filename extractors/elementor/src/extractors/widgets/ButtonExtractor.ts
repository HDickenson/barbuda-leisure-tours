/**
 * Button Widget Extractor
 * Extracts content from Elementor button widgets
 */

import type { ButtonContent } from '../../models';

/**
 * Extract button widget content from Elementor settings
 * @param settings Raw Elementor widget settings
 * @returns Typed button content
 */
export function extractButtonContent(
  settings: Record<string, unknown>,
): ButtonContent {
  // Extract button text
  const text = String(settings.text || 'Click here');

  // Extract link
  const link = extractLink(settings.link);

  // Extract size
  const size = normalizeSize(settings.size);

  // Extract icon
  const icon = extractIcon(settings);

  // Extract icon alignment
  const iconAlign = normalizeIconAlign(settings.icon_align);

  const content: ButtonContent = {
    text,
    link: link || { url: '', isExternal: false, nofollow: false },
    size,
    iconAlign,
  };

  if (icon) {
    content.icon = icon;
  }

  return content;
}

/**
 * Extract link object from Elementor link settings
 */
function extractLink(
  linkData: unknown,
): { url: string; isExternal: boolean; nofollow: boolean } | undefined {
  if (!linkData || typeof linkData !== 'object') {
    return undefined;
  }

  const link = linkData as Record<string, unknown>;

  const url = String(link.url || '').trim();

  return {
    url,
    isExternal: Boolean(link.is_external),
    nofollow: Boolean(link.nofollow),
  };
}

/**
 * Normalize button size
 */
function normalizeSize(size: unknown): 'xs' | 'sm' | 'md' | 'lg' | 'xl' {
  const sizeStr = String(size || 'md').toLowerCase();

  const validSizes = ['xs', 'sm', 'md', 'lg', 'xl'];
  if (validSizes.includes(sizeStr)) {
    return sizeStr as 'xs' | 'sm' | 'md' | 'lg' | 'xl';
  }

  return 'md'; // Default
}

/**
 * Extract icon configuration
 */
function extractIcon(
  settings: Record<string, unknown>,
): { value: string; library: 'solid' | 'regular' | 'brands' | 'custom' } | undefined {
  // Check for selected icon
  const selectedIcon = settings.selected_icon;
  if (!selectedIcon || typeof selectedIcon !== 'object') {
    return undefined;
  }

  const iconData = selectedIcon as Record<string, unknown>;

  // Get icon value (could be icon class or SVG)
  const value = String(iconData.value || '');
  if (!value) {
    return undefined;
  }

  // Determine library
  const library = normalizeIconLibrary(iconData.library);

  return {
    value,
    library,
  };
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

  return 'custom'; // Default for unknown libraries
}

/**
 * Normalize icon alignment
 */
function normalizeIconAlign(align: unknown): 'left' | 'right' {
  const alignStr = String(align || 'left').toLowerCase();

  if (alignStr === 'right') {
    return 'right';
  }

  return 'left'; // Default
}

/**
 * Icon Widget Extractor
 * Extracts content from Elementor icon widgets
 */

import type { IconContent } from '../../models';

/**
 * Extract icon widget content from Elementor settings
 * @param settings Raw Elementor widget settings
 * @returns Typed icon content
 */
export function extractIconContent(
  settings: Record<string, unknown>,
): IconContent {
  // Extract icon
  const icon = extractIcon(settings);

  if (!icon) {
    // Fallback icon if none specified
    return {
      icon: {
        value: 'fas fa-star',
        library: 'solid',
      },
      view: 'default',
      shape: 'circle',
    };
  }

  // Extract link
  const link = extractLink(settings.link);

  // Extract view and shape
  const view = normalizeView(settings.view);
  const shape = normalizeShape(settings.shape);

  // Extract colors
  const primaryColor = settings.primary_color ? String(settings.primary_color) : undefined;
  const secondaryColor = settings.secondary_color ? String(settings.secondary_color) : undefined;

  // Extract size and rotation
  const size = typeof settings.size === 'number' ? settings.size : undefined;
  const rotate = typeof settings.rotate === 'number' ? settings.rotate : undefined;

  // Extract hover animation
  const hoverAnimation = settings.hover_animation ? String(settings.hover_animation) : undefined;

  const content: IconContent = {
    icon,
    view,
    shape,
  };

  if (link) content.link = link;
  if (primaryColor) content.primaryColor = primaryColor;
  if (secondaryColor) content.secondaryColor = secondaryColor;
  if (size !== undefined) content.size = size;
  if (rotate !== undefined) content.rotate = rotate;
  if (hoverAnimation) content.hoverAnimation = hoverAnimation;

  return content;
}

/**
 * Extract icon configuration
 */
function extractIcon(
  settings: Record<string, unknown>,
): { value: string; library: 'solid' | 'regular' | 'brands' | 'custom' } | undefined {
  // Check for selected icon (newer Elementor versions)
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
 * Extract link object
 */
function extractLink(
  linkData: unknown,
): { url: string; isExternal: boolean; nofollow: boolean } | undefined {
  if (!linkData || typeof linkData !== 'object') {
    return undefined;
  }

  const link = linkData as Record<string, unknown>;

  const url = String(link.url || '').trim();
  if (!url) {
    return undefined;
  }

  return {
    url,
    isExternal: normalizeBoolean(link.is_external),
    nofollow: normalizeBoolean(link.nofollow),
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

  return 'custom';
}

/**
 * Normalize icon view
 */
function normalizeView(view: unknown): 'default' | 'stacked' | 'framed' {
  const viewStr = String(view || 'default').toLowerCase();

  const validViews = ['default', 'stacked', 'framed'];
  if (validViews.includes(viewStr)) {
    return viewStr as 'default' | 'stacked' | 'framed';
  }

  return 'default';
}

/**
 * Normalize icon shape
 */
function normalizeShape(shape: unknown): 'circle' | 'square' {
  const shapeStr = String(shape || 'circle').toLowerCase();

  if (shapeStr === 'square') {
    return 'square';
  }

  return 'circle';
}

/**
 * Normalize boolean values
 */
function normalizeBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value;
  }
  const strValue = String(value || 'no').toLowerCase();
  return strValue === 'yes' || strValue === 'true' || strValue === '1';
}

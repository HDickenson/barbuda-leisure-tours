/**
 * Social Icons Widget Extractor
 * Extracts content from Elementor social icons widgets
 */

import type { SocialIconsContent } from '../../models';

/**
 * Extract social icons widget content from Elementor settings
 * @param settings Raw Elementor widget settings
 * @returns Typed social icons content
 */
export function extractSocialIconsContent(
  settings: Record<string, unknown>,
): SocialIconsContent {
  // Extract social icons array
  const icons = extractSocialIcons(settings.social_icon_list);

  // Extract shape
  const shape = normalizeShape(settings.shape);

  // Extract view
  const view = normalizeView(settings.view);

  // Extract size
  const size = normalizeSize(settings.size);

  // Extract alignment
  const align = normalizeAlign(settings.align);

  return {
    icons,
    shape,
    view,
    size,
    align,
  };
}

/**
 * Extract social icons array
 */
function extractSocialIcons(
  iconsData: unknown,
): Array<{
  network: string;
  url: string;
  label?: string;
}> {
  if (!Array.isArray(iconsData)) {
    return [];
  }

  return iconsData
    .filter((item): item is Record<string, unknown> => {
      return item && typeof item === 'object' && 'social' in item;
    })
    .map((icon) => {
      const result: {
        network: string;
        url: string;
        label?: string;
      } = {
        network: String(icon.social || ''),
        url: extractUrl(icon.link),
      };

      // Extract optional label
      if (icon.label) {
        result.label = String(icon.label);
      }

      return result;
    });
}

/**
 * Extract URL from link object or string
 */
function extractUrl(linkData: unknown): string {
  if (typeof linkData === 'string') {
    return linkData;
  }

  if (linkData && typeof linkData === 'object') {
    const link = linkData as Record<string, unknown>;
    return String(link.url || '');
  }

  return '';
}

/**
 * Normalize shape value
 */
function normalizeShape(shape: unknown): 'square' | 'circle' | 'rounded' {
  const shapeStr = String(shape || 'square').toLowerCase();

  const validShapes = ['square', 'circle', 'rounded'];
  if (validShapes.includes(shapeStr)) {
    return shapeStr as 'square' | 'circle' | 'rounded';
  }

  return 'square'; // Default
}

/**
 * Normalize view value
 */
function normalizeView(view: unknown): 'default' | 'stacked' | 'framed' {
  const viewStr = String(view || 'default').toLowerCase();

  const validViews = ['default', 'stacked', 'framed'];
  if (validViews.includes(viewStr)) {
    return viewStr as 'default' | 'stacked' | 'framed';
  }

  return 'default'; // Default
}

/**
 * Normalize size value
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
 * Normalize alignment value
 */
function normalizeAlign(align: unknown): 'left' | 'center' | 'right' | 'justify' {
  const alignStr = String(align || 'left').toLowerCase();

  const validAligns = ['left', 'center', 'right', 'justify'];
  if (validAligns.includes(alignStr)) {
    return alignStr as 'left' | 'center' | 'right' | 'justify';
  }

  return 'left'; // Default
}

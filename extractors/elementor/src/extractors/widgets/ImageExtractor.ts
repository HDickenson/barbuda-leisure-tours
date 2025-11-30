/**
 * Image Widget Extractor
 * Extracts content from Elementor image widgets
 */

import type { ImageContent } from '../../models';

/**
 * Extract image widget content from Elementor settings
 * @param settings Raw Elementor widget settings
 * @returns Typed image content
 */
export function extractImageContent(
  settings: Record<string, unknown>,
): ImageContent {
  // Extract image data
  const imageData = extractImageData(settings.image);

  // Extract image size
  const imageSize = normalizeImageSize(settings.image_size);

  // Extract caption
  const caption = settings.caption ? String(settings.caption) : undefined;

  // Extract link
  const link = extractLink(settings.link);

  // Extract lightbox setting
  const openLightbox = normalizeOpenLightbox(settings.open_lightbox);

  const content: ImageContent = {
    image: imageData,
    imageSize,
    openLightbox,
  };

  if (caption) {
    content.caption = caption;
  }

  if (link) {
    content.link = link;
  }

  return content;
}

/**
 * Extract image data (URL, ID, alt text)
 */
function extractImageData(
  imageData: unknown,
): { url: string; id?: number; alt: string } {
  if (!imageData || typeof imageData !== 'object') {
    return {
      url: '',
      alt: '',
    };
  }

  const image = imageData as Record<string, unknown>;

  const result: { url: string; id?: number; alt: string } = {
    url: String(image.url || ''),
    alt: String(image.alt || ''),
  };

  if (typeof image.id === 'number') {
    result.id = image.id;
  } else if (image.id) {
    const parsed = parseInt(String(image.id), 10);
    if (!isNaN(parsed)) {
      result.id = parsed;
    }
  }

  return result;
}

/**
 * Normalize image size value
 */
function normalizeImageSize(
  size: unknown,
): 'thumbnail' | 'medium' | 'medium_large' | 'large' | 'full' | 'custom' {
  const sizeStr = String(size || 'full').toLowerCase();

  const validSizes = ['thumbnail', 'medium', 'medium_large', 'large', 'full', 'custom'];
  if (validSizes.includes(sizeStr)) {
    return sizeStr as 'thumbnail' | 'medium' | 'medium_large' | 'large' | 'full' | 'custom';
  }

  return 'full'; // Default
}

/**
 * Normalize open lightbox value (yes/no to boolean)
 */
function normalizeOpenLightbox(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  const strValue = String(value || 'no').toLowerCase();
  return strValue === 'yes' || strValue === 'true' || strValue === '1';
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

  // Check if URL exists and is not empty
  const url = String(link.url || '').trim();
  if (!url) {
    return undefined;
  }

  return {
    url,
    isExternal: Boolean(link.is_external),
    nofollow: Boolean(link.nofollow),
  };
}

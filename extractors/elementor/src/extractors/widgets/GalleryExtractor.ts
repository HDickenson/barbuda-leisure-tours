/**
 * Gallery Widget Extractor
 * Extracts content from Elementor gallery widgets
 */

import type { GalleryContent } from '../../models';

/**
 * Extract gallery widget content from Elementor settings
 * @param settings Raw Elementor widget settings
 * @returns Typed gallery content
 */
export function extractGalleryContent(
  settings: Record<string, unknown>,
): GalleryContent {
  // Extract images array
  const images = extractImages(settings.gallery);

  // Extract columns (desktop, tablet, mobile)
  const columns = extractNumber(settings.gallery_columns, 4) ?? 4;
  const columnsTablet = extractNumber(settings.gallery_columns_tablet, undefined);
  const columnsMobile = extractNumber(settings.gallery_columns_mobile, undefined);

  // Extract gap (spacing between images)
  const gap = extractNumber(settings.gap, 10) ?? 10;
  const gapTablet = extractNumber(settings.gap_tablet, undefined);
  const gapMobile = extractNumber(settings.gap_mobile, undefined);

  // Extract aspect ratio
  const aspectRatio = normalizeAspectRatio(settings.aspect_ratio);

  // Extract link behavior
  const linkTo = normalizeLinkTo(settings.link_to);

  // Extract random order flag
  const randomOrder = settings.order_by === 'rand' ? true : undefined;

  // Extract lazy load setting
  const lazyLoad = normalizeBoolean(settings.lazyload, true);

  const content: GalleryContent = {
    images,
    columns,
    gap,
    aspectRatio,
    linkTo,
    lazyLoad,
  };

  if (columnsTablet !== undefined) content.columnsTablet = columnsTablet;
  if (columnsMobile !== undefined) content.columnsMobile = columnsMobile;
  if (gapTablet !== undefined) content.gapTablet = gapTablet;
  if (gapMobile !== undefined) content.gapMobile = gapMobile;
  if (randomOrder !== undefined) content.randomOrder = randomOrder;

  return content;
}

/**
 * Extract images array from gallery data
 */
function extractImages(
  galleryData: unknown,
): Array<{
  url: string;
  id?: number;
  alt: string;
  title?: string;
  description?: string;
}> {
  if (!Array.isArray(galleryData)) {
    return [];
  }

  return galleryData
    .filter((item): item is Record<string, unknown> => {
      return item && typeof item === 'object' && 'url' in item;
    })
    .map((image) => {
      const result: {
        url: string;
        id?: number;
        alt: string;
        title?: string;
        description?: string;
      } = {
        url: String(image.url || ''),
        alt: String(image.alt || ''),
      };

      // Extract optional ID
      if (typeof image.id === 'number') {
        result.id = image.id;
      } else if (image.id) {
        const parsed = parseInt(String(image.id), 10);
        if (!isNaN(parsed)) {
          result.id = parsed;
        }
      }

      // Extract optional title and description
      if (image.title) {
        result.title = String(image.title);
      }
      if (image.description) {
        result.description = String(image.description);
      }

      return result;
    });
}

/**
 * Normalize aspect ratio
 */
function normalizeAspectRatio(
  ratio: unknown,
): '1:1' | '3:2' | '4:3' | '9:16' | '16:9' | '21:9' | 'custom' {
  const ratioStr = String(ratio || '16:9');

  const validRatios = ['1:1', '3:2', '4:3', '9:16', '16:9', '21:9', 'custom'];
  if (validRatios.includes(ratioStr)) {
    return ratioStr as '1:1' | '3:2' | '4:3' | '9:16' | '16:9' | '21:9' | 'custom';
  }

  return '16:9'; // Default
}

/**
 * Normalize link behavior
 */
function normalizeLinkTo(value: unknown): 'none' | 'file' | 'custom' {
  const linkToStr = String(value || 'none').toLowerCase();

  const validValues = ['none', 'file', 'custom'];
  if (validValues.includes(linkToStr)) {
    return linkToStr as 'none' | 'file' | 'custom';
  }

  return 'none'; // Default
}

/**
 * Extract number from value with optional default
 */
function extractNumber(value: unknown, defaultValue: number | undefined): number | undefined {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }

  if (typeof value === 'number') {
    return value;
  }

  const parsed = parseFloat(String(value));
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Normalize boolean values with optional default
 */
function normalizeBoolean(value: unknown, defaultValue = false): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (value === undefined || value === null) {
    return defaultValue;
  }

  const strValue = String(value).toLowerCase();
  return strValue === 'yes' || strValue === 'true' || strValue === '1';
}

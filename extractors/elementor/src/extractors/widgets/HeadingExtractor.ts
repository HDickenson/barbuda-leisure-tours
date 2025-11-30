/**
 * Heading Widget Extractor
 * Extracts content from Elementor heading widgets
 */

import type { HeadingContent } from '../../models';

/**
 * Extract heading widget content from Elementor settings
 * @param settings Raw Elementor widget settings
 * @returns Typed heading content
 */
export function extractHeadingContent(
  settings: Record<string, unknown>,
): HeadingContent {
  // Extract title
  const title = String(settings.title || '');

  // Extract HTML tag (default: h2)
  const htmlTag = normalizeHtmlTag(settings.header_size);

  // Extract link if present
  const link = extractLink(settings.link);

  const content: HeadingContent = {
    title,
    htmlTag,
  };

  if (link) {
    content.link = link;
  }

  return content;
}

/**
 * Normalize HTML tag to valid heading tag
 */
function normalizeHtmlTag(
  tag: unknown,
): 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span' | 'p' {
  const tagStr = String(tag || 'h2').toLowerCase();

  const validTags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'span', 'p'];
  if (validTags.includes(tagStr)) {
    return tagStr as 'h1' | 'h2' | 'h3' | 'h4' | 'h5' | 'h6' | 'div' | 'span' | 'p';
  }

  return 'h2'; // Default
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
    isExternal: normalizeBoolean(link.is_external),
    nofollow: normalizeBoolean(link.nofollow),
  };
}

/**
 * Normalize various truthy/falsy values to boolean
 */
function normalizeBoolean(value: unknown): boolean {
  if (typeof value === 'boolean') {
    return value;
  }
  const strValue = String(value || 'no').toLowerCase();
  return strValue === 'yes' || strValue === 'true' || strValue === '1';
}

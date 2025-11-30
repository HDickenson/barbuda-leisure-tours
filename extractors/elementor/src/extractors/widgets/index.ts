/**
 * Widget extractors index
 * Central registry for all widget content extractors
 */

import type { WidgetContent } from '../../models';
import { extractHeadingContent } from './HeadingExtractor';
import { extractImageContent } from './ImageExtractor';
import { extractTextEditorContent } from './TextEditorExtractor';
import { extractButtonContent } from './ButtonExtractor';
import { extractVideoContent } from './VideoExtractor';
import { extractIconContent } from './IconExtractor';
import { extractSpacerContent } from './SpacerExtractor';
import { extractDividerContent } from './DividerExtractor';
import { extractGoogleMapsContent } from './GoogleMapsExtractor';
import { extractGalleryContent } from './GalleryExtractor';
import { extractAccordionContent } from './AccordionExtractor';
import { extractTabsContent } from './TabsExtractor';
import { extractProgressBarContent } from './ProgressBarExtractor';
import { extractCounterContent } from './CounterExtractor';
import { extractSocialIconsContent } from './SocialIconsExtractor';

/**
 * Widget extractor function type
 */
export type WidgetExtractor = (
  settings: Record<string, unknown>,
) => WidgetContent;

/**
 * Registry of widget extractors by widget type
 */
export const WIDGET_EXTRACTORS: Record<string, WidgetExtractor> = {
  heading: extractHeadingContent,
  image: extractImageContent,
  'text-editor': extractTextEditorContent,
  button: extractButtonContent,
  video: extractVideoContent,
  icon: extractIconContent,
  spacer: extractSpacerContent,
  divider: extractDividerContent,
  'google_maps': extractGoogleMapsContent,
  gallery: extractGalleryContent,
  'image-gallery': extractGalleryContent, // Alternative name
  accordion: extractAccordionContent,
  toggle: extractAccordionContent, // Accordion alternative
  tabs: extractTabsContent,
  progress: extractProgressBarContent,
  'progress-bar': extractProgressBarContent, // Alternative name
  counter: extractCounterContent,
  'social-icons': extractSocialIconsContent,
};

/**
 * Extract widget content based on widget type
 * Falls back to returning raw settings if no extractor found
 *
 * @param widgetType Elementor widget type (e.g., 'heading', 'image')
 * @param settings Raw widget settings from Elementor
 * @returns Typed widget content or raw settings
 */
export function extractWidgetContent(
  widgetType: string,
  settings: Record<string, unknown>,
): WidgetContent {
  const extractor = WIDGET_EXTRACTORS[widgetType];

  if (extractor) {
    return extractor(settings);
  }

  // Fallback: return raw settings for unknown widget types
  return settings as WidgetContent;
}

/**
 * Check if a widget type has a dedicated extractor
 */
export function hasExtractor(widgetType: string): boolean {
  return widgetType in WIDGET_EXTRACTORS;
}

/**
 * Get list of supported widget types
 */
export function getSupportedWidgetTypes(): string[] {
  return Object.keys(WIDGET_EXTRACTORS);
}

// Re-export individual extractors for testing
export { extractHeadingContent } from './HeadingExtractor';
export { extractImageContent } from './ImageExtractor';
export { extractTextEditorContent } from './TextEditorExtractor';
export { extractButtonContent } from './ButtonExtractor';
export { extractVideoContent } from './VideoExtractor';
export { extractIconContent } from './IconExtractor';
export { extractSpacerContent } from './SpacerExtractor';
export { extractDividerContent } from './DividerExtractor';
export { extractGoogleMapsContent } from './GoogleMapsExtractor';
export { extractGalleryContent } from './GalleryExtractor';
export { extractAccordionContent } from './AccordionExtractor';
export { extractTabsContent } from './TabsExtractor';
export { extractProgressBarContent } from './ProgressBarExtractor';
export { extractCounterContent } from './CounterExtractor';
export { extractSocialIconsContent } from './SocialIconsExtractor';

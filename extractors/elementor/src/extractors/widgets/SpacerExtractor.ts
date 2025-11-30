/**
 * Spacer Widget Extractor
 * Extracts content from Elementor spacer widgets
 */

import type { SpacerContent } from '../../models';

/**
 * Extract spacer widget content from Elementor settings
 * @param settings Raw Elementor widget settings
 * @returns Typed spacer content
 */
export function extractSpacerContent(
  settings: Record<string, unknown>,
): SpacerContent {
  // Extract space (height) settings
  const space = extractSpace(settings.space, 50) ?? 50; // Default to 50 for main space
  const spaceTablet = extractSpace(settings.space_tablet); // No default for responsive overrides
  const spaceMobile = extractSpace(settings.space_mobile); // No default for responsive overrides

  const content: SpacerContent = {
    space,
  };

  if (spaceTablet !== undefined) {
    content.spaceTablet = spaceTablet;
  }

  if (spaceMobile !== undefined) {
    content.spaceMobile = spaceMobile;
  }

  return content;
}

/**
 * Extract space value (height in pixels)
 * Returns undefined if no valid value is provided (used for responsive overrides)
 */
function extractSpace(spaceData: unknown, defaultValue?: number): number | undefined {
  // Check if it's a direct number
  if (typeof spaceData === 'number') {
    return spaceData;
  }

  // Check if it's an object with size property (responsive control)
  if (typeof spaceData === 'object' && spaceData !== null) {
    const spaceObj = spaceData as Record<string, unknown>;
    if (typeof spaceObj.size === 'number') {
      return spaceObj.size;
    }
    // Try parsing as string
    if (typeof spaceObj.size === 'string') {
      const parsed = parseInt(spaceObj.size, 10);
      if (!isNaN(parsed)) {
        return parsed;
      }
    }
  }

  // Try parsing as string
  if (typeof spaceData === 'string') {
    const parsed = parseInt(spaceData, 10);
    if (!isNaN(parsed)) {
      return parsed;
    }
  }

  // Return default value if provided, otherwise undefined
  return defaultValue;
}

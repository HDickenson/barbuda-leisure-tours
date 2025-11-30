/**
 * Counter Widget Extractor
 * Extracts content from Elementor counter widgets
 */

import type { CounterContent } from '../../models';

/**
 * Extract counter widget content from Elementor settings
 * @param settings Raw Elementor widget settings
 * @returns Typed counter content
 */
export function extractCounterContent(
  settings: Record<string, unknown>,
): CounterContent {
  // Extract starting and ending numbers
  const startingNumber = extractNumber(settings.starting_number, 0);
  const endingNumber = extractNumber(settings.ending_number, 100);

  // Extract prefix and suffix
  const prefix = settings.prefix ? String(settings.prefix) : undefined;
  const suffix = settings.suffix ? String(settings.suffix) : undefined;

  // Extract animation duration (in milliseconds)
  const animationDuration = extractNumber(settings.duration, 2000);

  // Extract thousand separator
  const thousandSeparator = extractThousandSeparator(settings.thousand_separator);

  // Extract title
  const title = settings.title ? String(settings.title) : undefined;

  const content: CounterContent = {
    startingNumber,
    endingNumber,
    animationDuration,
    thousandSeparator,
  };

  if (prefix) content.prefix = prefix;
  if (suffix) content.suffix = suffix;
  if (title) content.title = title;

  return content;
}

/**
 * Extract thousand separator
 */
function extractThousandSeparator(value: unknown): string {
  if (!value) {
    return ','; // Default comma separator
  }

  const separator = String(value);

  // Common separators
  if (separator === 'yes' || separator === 'true') {
    return ',';
  }

  if (separator === 'no' || separator === 'false') {
    return '';
  }

  // If a specific character is provided, use it
  return separator;
}

/**
 * Extract number from value with default
 */
function extractNumber(value: unknown, defaultValue: number): number {
  if (value === undefined || value === null || value === '') {
    return defaultValue;
  }

  if (typeof value === 'number') {
    return value;
  }

  const parsed = parseFloat(String(value));
  return isNaN(parsed) ? defaultValue : parsed;
}

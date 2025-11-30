/**
 * Progress Bar Widget Extractor
 * Extracts content from Elementor progress bar widgets
 */

import type { ProgressBarContent } from '../../models';

/**
 * Extract progress bar widget content from Elementor settings
 * @param settings Raw Elementor widget settings
 * @returns Typed progress bar content
 */
export function extractProgressBarContent(
  settings: Record<string, unknown>,
): ProgressBarContent {
  // Extract title
  const title = String(settings.title || '');

  // Extract percentage (0-100)
  const percentageRaw = extractNumber(settings.percent, 50);
  const percentage = Math.min(100, Math.max(0, percentageRaw)); // Clamp to 0-100

  // Extract display percentage flag
  const displayPercentage = normalizeBoolean(settings.display_percentage, true);

  // Extract inner text
  const innerText = settings.inner_text ? String(settings.inner_text) : undefined;

  // Extract bar type
  const barType = normalizeBarType(settings.type);

  // Extract colors
  const barColor = settings.progress_color ? String(settings.progress_color) : undefined;
  const barBackgroundColor = settings.bar_bg_color ? String(settings.bar_bg_color) : undefined;

  // Extract animation duration (in milliseconds)
  const animationDuration = extractNumber(settings.animation_duration, 1000);

  const content: ProgressBarContent = {
    title,
    percentage,
    displayPercentage,
    barType,
    animationDuration,
  };

  if (innerText) content.innerText = innerText;
  if (barColor) content.barColor = barColor;
  if (barBackgroundColor) content.barBackgroundColor = barBackgroundColor;

  return content;
}

/**
 * Normalize bar type
 */
function normalizeBarType(type: unknown): 'linear' | 'circular' {
  const typeStr = String(type || 'linear').toLowerCase();

  const validTypes = ['linear', 'circular'];
  if (validTypes.includes(typeStr)) {
    return typeStr as 'linear' | 'circular';
  }

  return 'linear'; // Default
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

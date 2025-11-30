/**
 * Accordion Widget Extractor
 * Extracts content from Elementor accordion widgets
 */

import type { AccordionContent } from '../../models';

/**
 * Extract accordion widget content from Elementor settings
 * @param settings Raw Elementor widget settings
 * @returns Typed accordion content
 */
export function extractAccordionContent(
  settings: Record<string, unknown>,
): AccordionContent {
  // Extract accordion items
  const items = extractAccordionItems(settings.tabs);

  // Extract default active item index
  const defaultActive = extractNumber(settings.default_active, undefined);

  // Extract multiple open setting
  const multipleOpen = normalizeBoolean(settings.multiple_open);

  // Extract icon settings
  const icon = extractIconSettings(settings);

  const content: AccordionContent = {
    items,
    multipleOpen,
  };

  if (defaultActive !== undefined) content.defaultActive = defaultActive;
  if (icon) content.icon = icon;

  return content;
}

/**
 * Extract accordion items from tabs data
 */
function extractAccordionItems(
  tabsData: unknown,
): Array<{
  id: string;
  title: string;
  content: string;
}> {
  if (!Array.isArray(tabsData)) {
    return [];
  }

  return tabsData
    .filter((item): item is Record<string, unknown> => {
      return item && typeof item === 'object';
    })
    .map((item, index) => {
      return {
        id: item._id ? String(item._id) : `item-${index}`,
        title: String(item.tab_title || ''),
        content: String(item.tab_content || ''),
      };
    });
}

/**
 * Extract icon settings for active/inactive states
 */
function extractIconSettings(
  settings: Record<string, unknown>,
): { active: string; inactive: string } | undefined {
  const selectedIcon = settings.selected_icon as Record<string, unknown> | undefined;
  const selectedActiveIcon = settings.selected_active_icon as Record<string, unknown> | undefined;

  // Check if icons are configured
  const inactiveIcon = selectedIcon?.value ? String(selectedIcon.value) : undefined;
  const activeIcon = selectedActiveIcon?.value ? String(selectedActiveIcon.value) : undefined;

  if (!inactiveIcon && !activeIcon) {
    return undefined;
  }

  return {
    active: activeIcon || inactiveIcon || '',
    inactive: inactiveIcon || activeIcon || '',
  };
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

  const parsed = parseInt(String(value), 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

/**
 * Normalize boolean values
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

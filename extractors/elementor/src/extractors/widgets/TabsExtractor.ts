/**
 * Tabs Widget Extractor
 * Extracts content from Elementor tabs widgets
 */

import type { TabsContent } from '../../models';

/**
 * Extract tabs widget content from Elementor settings
 * @param settings Raw Elementor widget settings
 * @returns Typed tabs content
 */
export function extractTabsContent(
  settings: Record<string, unknown>,
): TabsContent {
  // Extract tabs array
  const tabs = extractTabItems(settings.tabs);

  // Extract default active tab index (default to 1)
  const defaultActive = extractNumber(settings.active_tab, 1);

  // Extract icon settings
  const icon = extractIconSettings(settings);

  const content: TabsContent = {
    tabs,
    defaultActive,
  };

  if (icon) content.icon = icon;

  return content;
}

/**
 * Extract tab items from tabs data
 */
function extractTabItems(
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
        id: item._id ? String(item._id) : `tab-${index}`,
        title: String(item.tab_title || ''),
        content: String(item.tab_content || ''),
      };
    });
}

/**
 * Extract icon settings
 */
function extractIconSettings(
  settings: Record<string, unknown>,
): { value: string; library: 'solid' | 'regular' | 'brands' | 'custom' } | undefined {
  const selectedIcon = settings.selected_icon as Record<string, unknown> | undefined;

  if (!selectedIcon || !selectedIcon.value) {
    return undefined;
  }

  const iconValue = String(selectedIcon.value);
  const library = normalizeIconLibrary(selectedIcon.library);

  return {
    value: iconValue,
    library,
  };
}

/**
 * Normalize icon library value
 */
function normalizeIconLibrary(
  library: unknown,
): 'solid' | 'regular' | 'brands' | 'custom' {
  const libStr = String(library || 'solid').toLowerCase();

  const validLibraries = ['solid', 'regular', 'brands', 'custom'];
  if (validLibraries.includes(libStr)) {
    return libStr as 'solid' | 'regular' | 'brands' | 'custom';
  }

  return 'solid'; // Default
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

  const parsed = parseInt(String(value), 10);
  return isNaN(parsed) ? defaultValue : parsed;
}

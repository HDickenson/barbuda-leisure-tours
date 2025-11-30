/**
 * Text Editor Widget Extractor
 * Extracts content from Elementor text editor widgets
 */

import type { TextEditorContent } from '../../models';

/**
 * Extract text editor widget content from Elementor settings
 * @param settings Raw Elementor widget settings
 * @returns Typed text editor content
 */
export function extractTextEditorContent(
  settings: Record<string, unknown>,
): TextEditorContent {
  // Extract HTML content
  const editor = String(settings.editor || '');

  // Extract drop cap setting
  const dropCap = normalizeDropCap(settings.drop_cap);

  // Extract columns settings
  const columnsCount =
    typeof settings.text_columns === 'number'
      ? settings.text_columns
      : undefined;

  const columnGap =
    typeof settings.column_gap === 'number' ? settings.column_gap : undefined;

  const content: TextEditorContent = {
    editor,
  };

  if (dropCap) {
    content.dropCap = dropCap;
  }

  if (columnsCount !== undefined) {
    content.columnsCount = columnsCount;
  }

  if (columnGap !== undefined) {
    content.columnGap = columnGap;
  }

  return content;
}

/**
 * Normalize drop cap value to boolean
 */
function normalizeDropCap(value: unknown): boolean | undefined {
  if (!value) {
    return undefined;
  }

  const strValue = String(value).toLowerCase();

  if (strValue === 'yes' || strValue === 'true' || strValue === '1') {
    return true;
  }

  if (strValue === 'no' || strValue === 'false' || strValue === '0') {
    return false;
  }

  return undefined;
}

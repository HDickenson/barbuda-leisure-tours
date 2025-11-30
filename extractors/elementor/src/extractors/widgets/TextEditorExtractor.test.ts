import { describe, it, expect } from 'vitest';
import { extractTextEditorContent } from './TextEditorExtractor';

describe('TextEditorExtractor', () => {
  it('should extract basic text editor content', () => {
    const settings = {
      editor: '<p>Hello World</p>',
    };
    const result = extractTextEditorContent(settings);
    expect(result.editor).toBe('<p>Hello World</p>');
    expect(result.dropCap).toBeUndefined();
    expect(result.columnsCount).toBeUndefined();
    expect(result.columnGap).toBeUndefined();
  });

  it('should extract text editor with drop cap', () => {
    const settings = {
      editor: '<p>Lorem ipsum dolor sit amet</p>',
      drop_cap: 'yes',
    };
    const result = extractTextEditorContent(settings);
    expect(result.editor).toBe('<p>Lorem ipsum dolor sit amet</p>');
    expect(result.dropCap).toBe(true);
  });

  it('should extract text editor with columns', () => {
    const settings = {
      editor: '<p>Multi-column text content here</p>',
      text_columns: 2,
      column_gap: 20,
    };
    const result = extractTextEditorContent(settings);
    expect(result.columnsCount).toBe(2);
    expect(result.columnGap).toBe(20);
  });

  it('should handle all drop cap variations', () => {
    const truthyValues = ['yes', 'true', '1', true];
    for (const value of truthyValues) {
      const settings = {
        editor: '<p>Test</p>',
        drop_cap: value,
      };
      const result = extractTextEditorContent(settings);
      expect(result.dropCap).toBe(true);
    }

    const falsyValues = ['no', 'false', '0', false];
    for (const value of falsyValues) {
      const settings = {
        editor: '<p>Test</p>',
        drop_cap: value,
      };
      const result = extractTextEditorContent(settings);
      expect(result.dropCap).toBeUndefined();
    }
  });

  it('should handle missing editor content', () => {
    const settings = {};
    const result = extractTextEditorContent(settings);
    expect(result.editor).toBe('');
  });

  it('should ignore invalid column count', () => {
    const settings = {
      editor: '<p>Test</p>',
      text_columns: 'invalid',
    };
    const result = extractTextEditorContent(settings);
    expect(result.columnsCount).toBeUndefined();
  });

  it('should ignore invalid column gap', () => {
    const settings = {
      editor: '<p>Test</p>',
      text_columns: 2,
      column_gap: 'invalid',
    };
    const result = extractTextEditorContent(settings);
    expect(result.columnsCount).toBe(2);
    expect(result.columnGap).toBeUndefined();
  });
});

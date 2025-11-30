import { describe, it, expect } from 'vitest';
import { extractWidgetContent, hasExtractor, WIDGET_EXTRACTORS } from './index';
import type { HeadingContent, ImageContent, TextEditorContent, ButtonContent } from '../../models';

describe('Widget Extractor Registry', () => {
  it('should have extractors for core widget types', () => {
    expect(WIDGET_EXTRACTORS).toHaveProperty('heading');
    expect(WIDGET_EXTRACTORS).toHaveProperty('image');
    expect(WIDGET_EXTRACTORS).toHaveProperty('text-editor');
    expect(WIDGET_EXTRACTORS).toHaveProperty('button');
  });

  it('should detect if extractor exists', () => {
    expect(hasExtractor('heading')).toBe(true);
    expect(hasExtractor('image')).toBe(true);
    expect(hasExtractor('text-editor')).toBe(true);
    expect(hasExtractor('button')).toBe(true);
    expect(hasExtractor('unknown-widget')).toBe(false);
  });

  it('should extract heading widget content', () => {
    const settings = {
      title: 'Test Heading',
      header_size: 'h1',
    };
    const result = extractWidgetContent('heading', settings) as HeadingContent;
    expect(result.title).toBe('Test Heading');
    expect(result.htmlTag).toBe('h1');
  });

  it('should extract image widget content', () => {
    const settings = {
      image: {
        url: 'https://example.com/image.jpg',
        id: 123,
      },
      image_size: 'full',
      open_lightbox: 'yes',
    };
    const result = extractWidgetContent('image', settings) as ImageContent;
    expect(result.image.url).toBe('https://example.com/image.jpg');
    expect(result.openLightbox).toBe(true);
  });

  it('should extract text editor widget content', () => {
    const settings = {
      editor: '<p>Rich text content</p>',
      drop_cap: 'yes',
    };
    const result = extractWidgetContent('text-editor', settings) as TextEditorContent;
    expect(result.editor).toBe('<p>Rich text content</p>');
    expect(result.dropCap).toBe(true);
  });

  it('should extract button widget content', () => {
    const settings = {
      text: 'Click Me',
      link: {
        url: 'https://example.com',
        is_external: true,
        nofollow: false,
      },
      size: 'lg',
      icon_align: 'left',
    };
    const result = extractWidgetContent('button', settings) as ButtonContent;
    expect(result.text).toBe('Click Me');
    expect(result.size).toBe('lg');
  });

  it('should fallback to raw settings for unknown widget type', () => {
    const settings = {
      customField1: 'value1',
      customField2: 123,
    };
    const result = extractWidgetContent('unknown-widget', settings);
    expect(result).toEqual(settings);
  });

  it('should handle empty settings', () => {
    const settings = {};
    const result = extractWidgetContent('heading', settings) as HeadingContent;
    expect(result.title).toBe('');
    expect(result.htmlTag).toBe('h2'); // Default
  });
});

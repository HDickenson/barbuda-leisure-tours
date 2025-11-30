import { describe, it, expect } from 'vitest';
import { extractHeadingContent } from './HeadingExtractor';

describe('HeadingExtractor', () => {
  it('should extract basic heading with title and tag', () => {
    const settings = {
      title: 'Hello World',
      header_size: 'h1',
    };
    const result = extractHeadingContent(settings);
    expect(result.title).toBe('Hello World');
    expect(result.htmlTag).toBe('h1');
    expect(result.link).toBeUndefined();
  });

  it('should extract heading with link', () => {
    const settings = {
      title: 'Click me',
      header_size: 'h2',
      link: {
        url: 'https://example.com',
        is_external: 'yes',
        nofollow: 'no',
      },
    };
    const result = extractHeadingContent(settings);
    expect(result.title).toBe('Click me');
    expect(result.htmlTag).toBe('h2');
    expect(result.link).toEqual({
      url: 'https://example.com',
      isExternal: true,
      nofollow: false,
    });
  });

  it('should handle missing title', () => {
    const settings = {
      header_size: 'h3',
    };
    const result = extractHeadingContent(settings);
    expect(result.title).toBe('');
    expect(result.htmlTag).toBe('h3');
  });

  it('should normalize invalid html tag to h2', () => {
    const settings = {
      title: 'Test',
      header_size: 'invalid',
    };
    const result = extractHeadingContent(settings);
    expect(result.htmlTag).toBe('h2');
  });

  it('should handle all valid html tags', () => {
    const tags = ['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'span', 'p'];
    for (const tag of tags) {
      const settings = {
        title: 'Test',
        header_size: tag,
      };
      const result = extractHeadingContent(settings);
      expect(result.htmlTag).toBe(tag);
    }
  });

  it('should handle empty link object', () => {
    const settings = {
      title: 'Test',
      header_size: 'h2',
      link: {},
    };
    const result = extractHeadingContent(settings);
    expect(result.link).toBeUndefined();
  });
});

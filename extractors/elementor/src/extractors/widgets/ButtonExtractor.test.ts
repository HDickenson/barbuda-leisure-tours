import { describe, it, expect } from 'vitest';
import { extractButtonContent } from './ButtonExtractor';

describe('ButtonExtractor', () => {
  it('should extract basic button', () => {
    const settings = {
      text: 'Click Here',
      link: {
        url: 'https://example.com',
        is_external: false,
        nofollow: false,
      },
      size: 'md',
      icon_align: 'right',
    };
    const result = extractButtonContent(settings);
    expect(result.text).toBe('Click Here');
    expect(result.link.url).toBe('https://example.com');
    expect(result.size).toBe('md');
    expect(result.iconAlign).toBe('right');
    expect(result.icon).toBeUndefined();
  });

  it('should extract button with icon', () => {
    const settings = {
      text: 'Download',
      link: {
        url: 'https://example.com/file.pdf',
        is_external: true,
        nofollow: false,
      },
      size: 'lg',
      selected_icon: {
        value: 'fas fa-download',
        library: 'solid',
      },
      icon_align: 'left',
    };
    const result = extractButtonContent(settings);
    expect(result.icon).toEqual({
      value: 'fas fa-download',
      library: 'solid',
    });
    expect(result.iconAlign).toBe('left');
  });

  it('should handle all valid sizes', () => {
    const sizes = ['xs', 'sm', 'md', 'lg', 'xl'];
    for (const size of sizes) {
      const settings = {
        text: 'Test',
        link: { url: 'test', is_external: false, nofollow: false },
        size,
        icon_align: 'left',
      };
      const result = extractButtonContent(settings);
      expect(result.size).toBe(size);
    }
  });

  it('should normalize invalid size to md', () => {
    const settings = {
      text: 'Test',
      link: { url: 'test', is_external: false, nofollow: false },
      size: 'invalid',
      icon_align: 'left',
    };
    const result = extractButtonContent(settings);
    expect(result.size).toBe('md');
  });

  it('should handle all icon alignments', () => {
    const aligns = ['left', 'right'];
    for (const align of aligns) {
      const settings = {
        text: 'Test',
        link: { url: 'test', is_external: false, nofollow: false },
        size: 'md',
        icon_align: align,
      };
      const result = extractButtonContent(settings);
      expect(result.iconAlign).toBe(align);
    }
  });

  it('should normalize invalid icon align to left', () => {
    const settings = {
      text: 'Test',
      link: { url: 'test', is_external: false, nofollow: false },
      size: 'md',
      icon_align: 'invalid',
    };
    const result = extractButtonContent(settings);
    expect(result.iconAlign).toBe('left');
  });

  it('should use default text when missing', () => {
    const settings = {
      link: { url: 'test', is_external: false, nofollow: false },
      size: 'md',
      icon_align: 'left',
    };
    const result = extractButtonContent(settings);
    expect(result.text).toBe('Click here');
  });

  it('should provide default link when missing', () => {
    const settings = {
      text: 'Test',
      size: 'md',
      icon_align: 'left',
    };
    const result = extractButtonContent(settings);
    expect(result.link).toEqual({
      url: '',
      isExternal: false,
      nofollow: false,
    });
  });

  it('should handle all icon libraries', () => {
    const libraries = ['solid', 'regular', 'brands'];
    for (const library of libraries) {
      const settings = {
        text: 'Test',
        link: { url: 'test', is_external: false, nofollow: false },
        size: 'md',
        selected_icon: {
          value: 'test-icon',
          library,
        },
        icon_align: 'left',
      };
      const result = extractButtonContent(settings);
      expect(result.icon?.library).toBe(library);
    }
  });

  it('should normalize invalid icon library to custom', () => {
    const settings = {
      text: 'Test',
      link: { url: 'test', is_external: false, nofollow: false },
      size: 'md',
      selected_icon: {
        value: 'test-icon',
        library: 'invalid',
      },
      icon_align: 'left',
    };
    const result = extractButtonContent(settings);
    expect(result.icon?.library).toBe('custom');
  });

  it('should ignore icon without value', () => {
    const settings = {
      text: 'Test',
      link: { url: 'test', is_external: false, nofollow: false },
      size: 'md',
      selected_icon: {
        library: 'solid',
      },
      icon_align: 'left',
    };
    const result = extractButtonContent(settings);
    expect(result.icon).toBeUndefined();
  });
});

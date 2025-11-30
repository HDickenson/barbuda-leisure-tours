import { describe, it, expect } from 'vitest';
import { extractIconContent } from './IconExtractor';

describe('IconExtractor', () => {
  it('should extract basic icon', () => {
    const settings = {
      selected_icon: {
        value: 'fas fa-star',
        library: 'solid',
      },
      view: 'default',
      shape: 'circle',
    };
    const result = extractIconContent(settings);
    expect(result.icon.value).toBe('fas fa-star');
    expect(result.icon.library).toBe('solid');
    expect(result.view).toBe('default');
    expect(result.shape).toBe('circle');
  });

  it('should extract icon with link', () => {
    const settings = {
      selected_icon: {
        value: 'fas fa-home',
        library: 'solid',
      },
      link: {
        url: 'https://example.com',
        is_external: true,
        nofollow: false,
      },
      view: 'stacked',
      shape: 'square',
    };
    const result = extractIconContent(settings);
    expect(result.link).toEqual({
      url: 'https://example.com',
      isExternal: true,
      nofollow: false,
    });
    expect(result.view).toBe('stacked');
    expect(result.shape).toBe('square');
  });

  it('should extract icon with colors', () => {
    const settings = {
      selected_icon: {
        value: 'fas fa-heart',
        library: 'solid',
      },
      primary_color: '#ff0000',
      secondary_color: '#ffffff',
      view: 'framed',
      shape: 'circle',
    };
    const result = extractIconContent(settings);
    expect(result.primaryColor).toBe('#ff0000');
    expect(result.secondaryColor).toBe('#ffffff');
    expect(result.view).toBe('framed');
  });

  it('should extract icon with size and rotation', () => {
    const settings = {
      selected_icon: {
        value: 'fas fa-cog',
        library: 'solid',
      },
      size: 64,
      rotate: 45,
      view: 'default',
      shape: 'circle',
    };
    const result = extractIconContent(settings);
    expect(result.size).toBe(64);
    expect(result.rotate).toBe(45);
  });

  it('should extract icon with hover animation', () => {
    const settings = {
      selected_icon: {
        value: 'fas fa-arrow-right',
        library: 'solid',
      },
      hover_animation: 'pulse',
      view: 'default',
      shape: 'circle',
    };
    const result = extractIconContent(settings);
    expect(result.hoverAnimation).toBe('pulse');
  });

  it('should handle all icon libraries', () => {
    const libraries = ['solid', 'regular', 'brands'];
    for (const library of libraries) {
      const settings = {
        selected_icon: {
          value: 'test-icon',
          library,
        },
        view: 'default',
        shape: 'circle',
      };
      const result = extractIconContent(settings);
      expect(result.icon.library).toBe(library);
    }
  });

  it('should normalize invalid library to custom', () => {
    const settings = {
      selected_icon: {
        value: 'custom-icon',
        library: 'invalid',
      },
      view: 'default',
      shape: 'circle',
    };
    const result = extractIconContent(settings);
    expect(result.icon.library).toBe('custom');
  });

  it('should handle all view types', () => {
    const views = ['default', 'stacked', 'framed'];
    for (const view of views) {
      const settings = {
        selected_icon: {
          value: 'fas fa-star',
          library: 'solid',
        },
        view,
        shape: 'circle',
      };
      const result = extractIconContent(settings);
      expect(result.view).toBe(view);
    }
  });

  it('should handle both shape types', () => {
    const shapes = ['circle', 'square'];
    for (const shape of shapes) {
      const settings = {
        selected_icon: {
          value: 'fas fa-star',
          library: 'solid',
        },
        view: 'default',
        shape,
      };
      const result = extractIconContent(settings);
      expect(result.shape).toBe(shape);
    }
  });

  it('should handle legacy icon field', () => {
    const settings = {
      icon: 'fas fa-star',
      view: 'default',
      shape: 'circle',
    };
    const result = extractIconContent(settings);
    expect(result.icon.value).toBe('fas fa-star');
    expect(result.icon.library).toBe('solid');
  });

  it('should provide fallback icon when none specified', () => {
    const settings = {
      view: 'default',
      shape: 'circle',
    };
    const result = extractIconContent(settings);
    expect(result.icon.value).toBe('fas fa-star');
    expect(result.icon.library).toBe('solid');
  });
});

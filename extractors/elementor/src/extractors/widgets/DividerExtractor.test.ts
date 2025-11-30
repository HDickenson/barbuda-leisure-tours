import { describe, it, expect } from 'vitest';
import { extractDividerContent } from './DividerExtractor';

describe('DividerExtractor', () => {
  it('should extract basic divider', () => {
    const settings = {
      style: 'solid',
      weight: 1,
      width: 100,
      gap: 15,
      align: 'center',
    };
    const result = extractDividerContent(settings);
    expect(result.style).toBe('solid');
    expect(result.weight).toBe(1);
    expect(result.width).toBe(100);
    expect(result.gap).toBe(15);
    expect(result.align).toBe('center');
    expect(result.color).toBeUndefined();
    expect(result.icon).toBeUndefined();
  });

  it('should extract divider with color', () => {
    const settings = {
      style: 'double',
      weight: 2,
      color: '#000000',
      width: 80,
      gap: 20,
      align: 'left',
    };
    const result = extractDividerContent(settings);
    expect(result.color).toBe('#000000');
    expect(result.style).toBe('double');
    expect(result.align).toBe('left');
  });

  it('should extract divider with icon', () => {
    const settings = {
      style: 'solid',
      weight: 1,
      width: 100,
      gap: 15,
      align: 'center',
      insert_icon: 'yes',
      selected_icon: {
        value: 'fas fa-star',
        library: 'solid',
      },
    };
    const result = extractDividerContent(settings);
    expect(result.icon).toEqual({
      value: 'fas fa-star',
      library: 'solid',
    });
  });

  it('should not extract icon when insert_icon is no', () => {
    const settings = {
      style: 'solid',
      weight: 1,
      width: 100,
      gap: 15,
      align: 'center',
      insert_icon: 'no',
      selected_icon: {
        value: 'fas fa-star',
        library: 'solid',
      },
    };
    const result = extractDividerContent(settings);
    expect(result.icon).toBeUndefined();
  });

  it('should handle all divider styles', () => {
    const styles = ['solid', 'double', 'dotted', 'dashed'];
    for (const style of styles) {
      const settings = {
        style,
        weight: 1,
        width: 100,
        gap: 15,
        align: 'center',
      };
      const result = extractDividerContent(settings);
      expect(result.style).toBe(style);
    }
  });

  it('should handle all alignment options', () => {
    const aligns = ['left', 'center', 'right'];
    for (const align of aligns) {
      const settings = {
        style: 'solid',
        weight: 1,
        width: 100,
        gap: 15,
        align,
      };
      const result = extractDividerContent(settings);
      expect(result.align).toBe(align);
    }
  });

  it('should extract weight from responsive object', () => {
    const settings = {
      style: 'solid',
      weight: { size: 3 },
      width: { size: 90 },
      gap: { size: 25 },
      align: 'center',
    };
    const result = extractDividerContent(settings);
    expect(result.weight).toBe(3);
    expect(result.width).toBe(90);
    expect(result.gap).toBe(25);
  });

  it('should use default values when not specified', () => {
    const settings = {};
    const result = extractDividerContent(settings);
    expect(result.style).toBe('solid');
    expect(result.weight).toBe(1);
    expect(result.width).toBe(100);
    expect(result.gap).toBe(15);
    expect(result.align).toBe('center');
  });

  it('should handle legacy icon field', () => {
    const settings = {
      style: 'solid',
      weight: 1,
      width: 100,
      gap: 15,
      align: 'center',
      insert_icon: 'yes',
      icon: 'fas fa-heart',
    };
    const result = extractDividerContent(settings);
    expect(result.icon).toEqual({
      value: 'fas fa-heart',
      library: 'solid',
    });
  });

  it('should normalize invalid style to solid', () => {
    const settings = {
      style: 'invalid',
      weight: 1,
      width: 100,
      gap: 15,
      align: 'center',
    };
    const result = extractDividerContent(settings);
    expect(result.style).toBe('solid');
  });
});

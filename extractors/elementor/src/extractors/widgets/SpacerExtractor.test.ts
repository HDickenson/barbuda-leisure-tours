import { describe, it, expect } from 'vitest';
import { extractSpacerContent } from './SpacerExtractor';

describe('SpacerExtractor', () => {
  it('should extract basic spacer with direct number', () => {
    const settings = {
      space: 50,
    };
    const result = extractSpacerContent(settings);
    expect(result.space).toBe(50);
    expect(result.spaceTablet).toBeUndefined();
    expect(result.spaceMobile).toBeUndefined();
  });

  it('should extract spacer with responsive object', () => {
    const settings = {
      space: { size: 100 },
      space_tablet: { size: 75 },
      space_mobile: { size: 50 },
    };
    const result = extractSpacerContent(settings);
    expect(result.space).toBe(100);
    expect(result.spaceTablet).toBe(75);
    expect(result.spaceMobile).toBe(50);
  });

  it('should extract spacer with string values', () => {
    const settings = {
      space: '80',
      space_tablet: '60',
      space_mobile: '40',
    };
    const result = extractSpacerContent(settings);
    expect(result.space).toBe(80);
    expect(result.spaceTablet).toBe(60);
    expect(result.spaceMobile).toBe(40);
  });

  it('should handle mixed value types', () => {
    const settings = {
      space: 100,
      space_tablet: { size: 75 },
      space_mobile: '50',
    };
    const result = extractSpacerContent(settings);
    expect(result.space).toBe(100);
    expect(result.spaceTablet).toBe(75);
    expect(result.spaceMobile).toBe(50);
  });

  it('should use default when value is invalid', () => {
    const settings = {
      space: 'invalid',
    };
    const result = extractSpacerContent(settings);
    expect(result.space).toBe(50); // Default
  });

  it('should handle empty settings', () => {
    const settings = {};
    const result = extractSpacerContent(settings);
    expect(result.space).toBe(50); // Default
  });

  it('should handle string size in responsive object', () => {
    const settings = {
      space: { size: '120' },
    };
    const result = extractSpacerContent(settings);
    expect(result.space).toBe(120);
  });

  it('should not include undefined responsive values', () => {
    const settings = {
      space: 100,
    };
    const result = extractSpacerContent(settings);
    expect('spaceTablet' in result).toBe(false);
    expect('spaceMobile' in result).toBe(false);
  });
});

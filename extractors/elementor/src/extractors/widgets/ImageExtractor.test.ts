import { describe, it, expect } from 'vitest';
import { extractImageContent } from './ImageExtractor';

describe('ImageExtractor', () => {
  it('should extract basic image', () => {
    const settings = {
      image: {
        url: 'https://example.com/image.jpg',
        id: 123,
      },
      image_size: 'full',
      open_lightbox: 'no',
    };
    const result = extractImageContent(settings);
    expect(result.image.url).toBe('https://example.com/image.jpg');
    expect(result.image.id).toBe(123);
    expect(result.imageSize).toBe('full');
    expect(result.openLightbox).toBe(false);
    expect(result.caption).toBeUndefined();
    expect(result.link).toBeUndefined();
  });

  it('should extract image with caption', () => {
    const settings = {
      image: {
        url: 'https://example.com/photo.jpg',
        id: 456,
      },
      image_size: 'medium',
      caption: 'A beautiful photo',
      open_lightbox: 'yes',
    };
    const result = extractImageContent(settings);
    expect(result.caption).toBe('A beautiful photo');
    expect(result.openLightbox).toBe(true);
  });

  it('should extract image with link', () => {
    const settings = {
      image: {
        url: 'https://example.com/banner.jpg',
        id: 789,
      },
      image_size: 'large',
      link: {
        url: 'https://example.com/page',
        is_external: false,
        nofollow: true,
      },
      open_lightbox: 'no',
    };
    const result = extractImageContent(settings);
    expect(result.link).toEqual({
      url: 'https://example.com/page',
      isExternal: false,
      nofollow: true,
    });
  });

  it('should handle all valid image sizes', () => {
    const sizes = ['thumbnail', 'medium', 'medium_large', 'large', 'full', 'custom'];
    for (const size of sizes) {
      const settings = {
        image: { url: 'test.jpg', id: 1 },
        image_size: size,
        open_lightbox: 'no',
      };
      const result = extractImageContent(settings);
      expect(result.imageSize).toBe(size);
    }
  });

  it('should normalize invalid image size to full', () => {
    const settings = {
      image: { url: 'test.jpg', id: 1 },
      image_size: 'invalid',
      open_lightbox: 'no',
    };
    const result = extractImageContent(settings);
    expect(result.imageSize).toBe('full');
  });

  it('should normalize lightbox boolean variations', () => {
    const truthyValues = ['yes', 'true', '1', true];
    for (const value of truthyValues) {
      const settings = {
        image: { url: 'test.jpg', id: 1 },
        image_size: 'full',
        open_lightbox: value,
      };
      const result = extractImageContent(settings);
      expect(result.openLightbox).toBe(true);
    }

    const falsyValues = ['no', 'false', '0', false];
    for (const value of falsyValues) {
      const settings = {
        image: { url: 'test.jpg', id: 1 },
        image_size: 'full',
        open_lightbox: value,
      };
      const result = extractImageContent(settings);
      expect(result.openLightbox).toBe(false);
    }
  });

  it('should handle missing image data', () => {
    const settings = {
      image_size: 'full',
      open_lightbox: 'no',
    };
    const result = extractImageContent(settings);
    expect(result.image.url).toBe('');
    expect(result.image.id).toBeUndefined();
  });
});

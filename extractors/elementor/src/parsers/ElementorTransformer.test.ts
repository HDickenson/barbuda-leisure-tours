/**
 * Tests for Elementor data transformer
 */

import { describe, it, expect } from 'vitest';
import { transformToElementorPage } from './ElementorTransformer';

describe('ElementorTransformer', () => {
  describe('transformToElementorPage', () => {
    it('should transform basic page data', () => {
      const rawData = {
        id: 123,
        title: 'Test Page',
        url: 'https://example.com/test-page',
        slug: 'test-page',
        status: 'publish',
        modified: '2024-01-15T10:30:00Z',
        elementorData: [],
        elementorSettings: {
          template: 'default',
          content_width: 1140,
        },
        elementorVersion: '3.18.0',
      };

      const result = transformToElementorPage(rawData, '1.0.0');

      expect(result).not.toBeNull();
      expect(result?.id).toBe(123);
      expect(result?.title).toBe('Test Page');
      expect(result?.url).toBe('https://example.com/test-page');
      expect(result?.slug).toBe('test-page');
      expect(result?.status).toBe('publish');
      expect(result?.elementorVersion).toBe('3.18.0');
      expect(result?.extractorVersion).toBe('1.0.0');
      expect(result?.sections).toEqual([]);
    });

    it('should handle Elementor Pro version', () => {
      const rawData = {
        id: 123,
        title: 'Test Page',
        url: 'https://example.com/test-page',
        slug: 'test-page',
        status: 'publish',
        modified: '2024-01-15T10:30:00Z',
        elementorData: [],
        elementorSettings: {},
        elementorVersion: '3.18.0',
        elementorProVersion: '3.18.0',
      };

      const result = transformToElementorPage(rawData, '1.0.0');

      expect(result).not.toBeNull();
      expect(result?.elementorProVersion).toBe('3.18.0');
    });

    it('should transform page with sections', () => {
      const rawData = {
        id: 123,
        title: 'Test Page',
        url: 'https://example.com/test-page',
        slug: 'test-page',
        status: 'publish',
        modified: '2024-01-15T10:30:00Z',
        elementorData: [
          {
            id: 'section1',
            elType: 'section',
            settings: {
              content_position: 'top',
              gap: 'default',
            },
            elements: [
              {
                id: 'column1',
                elType: 'column',
                settings: {
                  _column_size: 50,
                },
                elements: [
                  {
                    id: 'widget1',
                    elType: 'widget',
                    widgetType: 'heading',
                    settings: {
                      title: 'Hello World',
                    },
                  },
                ],
              },
            ],
          },
        ],
        elementorSettings: {
          template: 'default',
        },
        elementorVersion: '3.18.0',
      };

      const result = transformToElementorPage(rawData, '1.0.0');

      expect(result).not.toBeNull();
      expect(result?.sections).toHaveLength(1);
      expect(result?.sections[0].id).toBe('section1');
      expect(result?.sections[0].columns).toHaveLength(1);
      expect(result?.sections[0].columns[0].id).toBe('column1');
      expect(result?.sections[0].columns[0].widgets).toHaveLength(1);
      expect(result?.sections[0].columns[0].widgets[0].widgetType).toBe('heading');
    });

    it('should normalize status values', () => {
      const statusTests = [
        { input: 'publish', expected: 'publish' },
        { input: 'PUBLISH', expected: 'publish' },
        { input: 'draft', expected: 'draft' },
        { input: 'pending', expected: 'pending' },
        { input: 'private', expected: 'private' },
        { input: 'invalid', expected: 'draft' },
      ];

      statusTests.forEach(({ input, expected }) => {
        const rawData = {
          id: 123,
          title: 'Test',
          url: 'https://example.com/test',
          slug: 'test',
          status: input,
          modified: '2024-01-15T10:30:00Z',
          elementorData: [],
          elementorSettings: {},
          elementorVersion: '3.18.0',
        };

        const result = transformToElementorPage(rawData, '1.0.0');
        expect(result?.status).toBe(expected);
      });
    });

    it('should skip invalid sections', () => {
      const rawData = {
        id: 123,
        title: 'Test Page',
        url: 'https://example.com/test-page',
        slug: 'test-page',
        status: 'publish',
        modified: '2024-01-15T10:30:00Z',
        elementorData: [
          { id: 'section1', elType: 'section', elements: [] },
          { id: 'invalid', elType: 'widget' }, // Invalid - not a section
          { id: 'section2', elType: 'section', elements: [] },
        ],
        elementorSettings: {},
        elementorVersion: '3.18.0',
      };

      const result = transformToElementorPage(rawData, '1.0.0');

      expect(result).not.toBeNull();
      expect(result?.sections).toHaveLength(2);
      expect(result?.sections[0].id).toBe('section1');
      expect(result?.sections[1].id).toBe('section2');
    });

    it('should handle extraction metadata', () => {
      const rawData = {
        id: 123,
        title: 'Test Page',
        url: 'https://example.com/test-page',
        slug: 'test-page',
        status: 'publish',
        modified: '2024-01-15T10:30:00Z',
        elementorData: [],
        elementorSettings: {},
        elementorVersion: '3.18.0',
      };

      const result = transformToElementorPage(rawData, '1.0.0');

      expect(result).not.toBeNull();
      expect(result?.extractorVersion).toBe('1.0.0');
      expect(result?.extractedAt).toBeDefined();
      expect(result?.editMode).toBe('builder');
      expect(result?.templateType).toBe('page');
    });
  });
});

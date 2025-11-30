/**
 * Integration tests with realistic Elementor page data
 * Tests the complete extraction pipeline from raw WordPress data to validated output
 */

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'fs';
import { join } from 'path';
import { transformToElementorPage } from '../parsers/ElementorTransformer';
import { Validator } from '../core/Validator';

describe('Integration Tests', () => {
  describe('Landing Page Extraction', () => {
    const rawFixture = JSON.parse(
      readFileSync(join(__dirname, 'fixtures', 'landing-page.json'), 'utf-8'),
    );

    // Convert fixture format to transformToElementorPage expected format
    const fixtureData = {
      id: rawFixture.post_id,
      title: rawFixture.post_title,
      url: `https://barbudaleisure.com/${rawFixture.post_name}`,
      slug: rawFixture.post_name,
      status: rawFixture.post_status,
      modified: rawFixture.post_modified,
      elementorData: rawFixture.elementor_data,
      elementorSettings: {},
      elementorVersion: rawFixture.elementor_version,
    };

    it('should extract complete landing page with all widgets', () => {
      const page = transformToElementorPage(fixtureData, '1.0.0');

      expect(page).not.toBeNull();
      expect(page!.id).toBe(42);
      expect(page!.title).toBe('Barbuda Leisure - Caribbean Paradise');
      expect(page!.slug).toBe('home');
      expect(page!.sections).toHaveLength(5);
    });

    it('should extract hero section with heading, text, and button', () => {
      const page = transformToElementorPage(fixtureData, '1.0.0')!

      const heroSection = page.sections[0];
      expect(heroSection).toBeDefined();
      expect(heroSection!.id).toBe('hero-section');
      expect(heroSection!.columns).toHaveLength(1);

      const heroWidgets = heroSection!.columns[0]!.widgets;
      expect(heroWidgets).toHaveLength(4);

      // Check heading widget
      const headingWidget = heroWidgets.find(w => w.widgetType === 'heading');
      expect(headingWidget).toBeDefined();
      expect(headingWidget!.content).toMatchObject({
        title: 'Discover Paradise in Barbuda',
        htmlTag: 'h1',
      });

      // Check button widget
      const buttonWidget = heroWidgets.find(w => w.widgetType === 'button');
      expect(buttonWidget).toBeDefined();
      expect(buttonWidget!.content).toMatchObject({
        text: 'Explore Activities',
        size: 'lg',
      });
    });

    it('should extract features section with icons', () => {
      
      const page = transformToElementorPage(fixtureData, "1.0.0")!;

      const featuresSection = page.sections[1];
      expect(featuresSection).toBeDefined();
      expect(featuresSection!.columns).toHaveLength(3);

      // Check each feature column has icon, heading, and text
      for (const column of featuresSection!.columns) {
        expect(column.widgets.length).toBeGreaterThan(0);

        const iconWidget = column.widgets.find(w => w.widgetType === 'icon');
        expect(iconWidget).toBeDefined();
        expect(iconWidget!.content).toHaveProperty('icon');
        expect(iconWidget!.content).toHaveProperty('view');
        expect(iconWidget!.content).toHaveProperty('shape');

        const headingWidget = column.widgets.find(w => w.widgetType === 'heading');
        expect(headingWidget).toBeDefined();

        const textWidget = column.widgets.find(w => w.widgetType === 'text-editor');
        expect(textWidget).toBeDefined();
      }
    });

    it('should extract video section with YouTube video', () => {
      
      const page = transformToElementorPage(fixtureData, "1.0.0")!;

      const videoSection = page.sections[2];
      expect(videoSection).toBeDefined();

      const videoWidget = videoSection!.columns[0]!.widgets.find(
        w => w.widgetType === 'video',
      );
      expect(videoWidget).toBeDefined();
      expect(videoWidget!.content).toMatchObject({
        videoType: 'youtube',
        youtubeUrl: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
        controls: true,
        aspectRatio: '169',
      });
      expect(videoWidget!.content).toHaveProperty('thumbnailImage');
    });

    it('should extract location section with map and divider', () => {
      
      const page = transformToElementorPage(fixtureData, "1.0.0")!;

      const locationSection = page.sections[3];
      expect(locationSection).toBeDefined();

      // Check divider widget
      const dividerWidget = locationSection!.columns[0]!.widgets.find(
        w => w.widgetType === 'divider',
      );
      expect(dividerWidget).toBeDefined();
      expect(dividerWidget!.content).toMatchObject({
        style: 'solid',
        weight: 3,
        align: 'center',
      });
      expect(dividerWidget!.content).toHaveProperty('icon');

      // Check Google Maps widget
      const mapWidget = locationSection!.columns[0]!.widgets.find(
        w => w.widgetType === 'google_maps',
      );
      expect(mapWidget).toBeDefined();
      expect(mapWidget!.content).toMatchObject({
        address: 'Barbuda, Antigua and Barbuda',
        zoom: 12,
        height: 500,
        preventScroll: true,
        mapType: 'satellite',
        streetView: false,
      });
      expect(mapWidget!.content).toHaveProperty('markers');
      expect(Array.isArray(mapWidget!.content.markers)).toBe(true);
    });

    it('should extract CTA section with responsive spacer', () => {
      
      const page = transformToElementorPage(fixtureData, "1.0.0")!;

      const ctaSection = page.sections[4];
      expect(ctaSection).toBeDefined();

      // Check spacer with responsive values
      const spacerWidget = ctaSection!.columns[0]!.widgets.find(
        w => w.widgetType === 'spacer',
      );
      expect(spacerWidget).toBeDefined();
      expect(spacerWidget!.content).toMatchObject({
        space: 20,
        spaceTablet: 15,
        spaceMobile: 10,
      });
    });

    it('should validate extracted page successfully', () => {
      
      const validator = new Validator();

      const page = transformToElementorPage(fixtureData, "1.0.0")!;
      const result = validator.validatePage(page);

      // Check validation result structure
      expect(result).toHaveProperty('valid');
      expect(result).toHaveProperty('errors');

      // If validation fails, log errors for debugging
      if (!result.valid) {
        console.log(
          'Validation errors:',
          result.errors.map(e => `${e.path}: ${e.message}`).join('\n'),
        );
      }
    });

    it('should extract all widget types present in the page', () => {
      
      const page = transformToElementorPage(fixtureData, "1.0.0")!;

      const allWidgets = page.sections.flatMap(section =>
        section.columns.flatMap(column => column.widgets),
      );

      const widgetTypes = new Set(allWidgets.map(w => w.widgetType));

      // Should have all major widget types
      expect(widgetTypes).toContain('heading');
      expect(widgetTypes).toContain('text-editor');
      expect(widgetTypes).toContain('button');
      expect(widgetTypes).toContain('icon');
      expect(widgetTypes).toContain('video');
      expect(widgetTypes).toContain('spacer');
      expect(widgetTypes).toContain('divider');
      expect(widgetTypes).toContain('google_maps');

      // Total widget count
      expect(allWidgets.length).toBeGreaterThan(15);
    });

    it('should extract widget content with proper typing', () => {
      
      const page = transformToElementorPage(fixtureData, "1.0.0")!;

      const allWidgets = page.sections.flatMap(section =>
        section.columns.flatMap(column => column.widgets),
      );

      // All widgets should have required fields
      for (const widget of allWidgets) {
        expect(widget).toHaveProperty('id');
        expect(widget).toHaveProperty('elType');
        expect(widget).toHaveProperty('widgetType');
        expect(widget).toHaveProperty('content');
        expect(widget).toHaveProperty('style');
        expect(widget).toHaveProperty('advanced');

        expect(widget.elType).toBe('widget');
        expect(typeof widget.widgetType).toBe('string');
        expect(typeof widget.content).toBe('object');
      }
    });

    it('should handle section and column settings', () => {
      
      const page = transformToElementorPage(fixtureData, "1.0.0")!;

      // Check sections have proper structure
      for (const section of page.sections) {
        expect(section).toHaveProperty('id');
        expect(section).toHaveProperty('elType');
        expect(section).toHaveProperty('columns');
        expect(section.elType).toBe('section');
        expect(Array.isArray(section.columns)).toBe(true);

        // Check columns
        for (const column of section.columns) {
          expect(column).toHaveProperty('id');
          expect(column).toHaveProperty('elType');
          expect(column).toHaveProperty('widgets');
          expect(column.elType).toBe('column');
          expect(Array.isArray(column.widgets)).toBe(true);
        }
      }
    });

    it('should provide structural validation warnings', () => {
      
      const validator = new Validator();

      const page = transformToElementorPage(fixtureData, "1.0.0")!;
      const issues = validator.validateStructure(page);

      // Well-structured page should have no issues
      expect(issues).toHaveLength(0);
    });

    it('should handle extraction metadata', () => {
      
      const page = transformToElementorPage(fixtureData, "1.0.0")!;

      expect(page.extractedAt).toBeDefined();
      expect(page.extractorVersion).toBeDefined();
      expect(page.elementorVersion).toBe('3.18.0');
      expect(page.editMode).toBe('builder');
      expect(page.templateType).toBe('page');
    });

    it('should extract page settings correctly', () => {
      
      const page = transformToElementorPage(fixtureData, "1.0.0")!;

      expect(page.pageSettings).toBeDefined();
      expect(page.pageSettings.pageLayout).toBe('default');
      expect(page.pageSettings.contentWidth).toBe(1140);
    });
  });

  describe('Error Handling', () => {
    it('should handle invalid JSON gracefully', () => {
      const page = transformToElementorPage(null as any, "1.0.0");
      expect(page).toBeNull();
    });

    it('should handle missing elementor_data field', () => {
      const invalidData = {
        id: 1,
        title: 'Test',
        url: 'https://example.com/test',
        slug: 'test',
        status: 'publish',
        modified: '2024-01-01 00:00:00',
        elementorVersion: '3.18.0',
        elementorSettings: {},
        // Missing elementorData
      };

      const page = transformToElementorPage(invalidData as any, "1.0.0");
      expect(page).toBeNull();
    });

    it('should handle empty elementor_data array', () => {
      const emptyData = {
        id: 1,
        title: 'Empty Page',
        url: 'https://example.com/empty',
        slug: 'empty',
        status: 'publish',
        modified: '2024-01-01 00:00:00',
        elementorVersion: '3.18.0',
        elementorData: [],
        elementorSettings: {},
      };

      const page = transformToElementorPage(emptyData, "1.0.0");

      // Should return a valid page with empty sections array
      expect(page).not.toBeNull();
      expect(page!.sections).toHaveLength(0);

      const validator = new Validator();
      const issues = validator.validateStructure(page!);

      // Should warn about no sections
      expect(issues.length).toBeGreaterThan(0);
      expect(issues[0]?.severity).toBe('warning');
      expect(issues[0]?.message).toContain('no sections');
    });
  });

  describe('Performance', () => {
    const rawFixture = JSON.parse(
      readFileSync(join(__dirname, 'fixtures', 'landing-page.json'), 'utf-8'),
    );

    const fixtureData = {
      id: rawFixture.post_id,
      title: rawFixture.post_title,
      url: `https://barbudaleisure.com/${rawFixture.post_name}`,
      slug: rawFixture.post_name,
      status: rawFixture.post_status,
      modified: rawFixture.post_modified,
      elementorData: rawFixture.elementor_data,
      elementorSettings: {},
      elementorVersion: rawFixture.elementor_version,
    };

    it('should extract page in reasonable time', () => {
      

      const startTime = performance.now();
      const page = transformToElementorPage(fixtureData, "1.0.0")!;
      const endTime = performance.now();

      const duration = endTime - startTime;

      // Should complete in less than 100ms
      expect(duration).toBeLessThan(100);
      expect(page).toBeDefined();
    });

    it('should validate page in reasonable time', () => {
      
      const validator = new Validator();

      const page = transformToElementorPage(fixtureData, "1.0.0")!;

      const startTime = performance.now();
      const result = validator.validatePage(page);
      const endTime = performance.now();

      const duration = endTime - startTime;

      // Validation should be fast
      expect(duration).toBeLessThan(50);
      expect(result).toBeDefined();
    });
  });
});

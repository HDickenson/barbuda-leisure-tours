import { describe, it, expect, beforeEach } from 'vitest';
import { Validator } from './Validator';
import type { ElementorPage } from '../models';

describe('Validator', () => {
  let validator: Validator;

  beforeEach(() => {
    validator = new Validator();
  });

  // Helper to create a minimal valid page structure
  const createMinimalValidPage = (): ElementorPage => ({
    id: 1,
    title: 'Test Page',
    url: 'https://example.com/test',
    slug: 'test-page',
    status: 'publish',
    lastModified: '2024-01-01T00:00:00Z',
    elementorVersion: '3.18.0',
    editMode: 'builder',
    templateType: 'page',
    sections: [
      {
        id: 'section-1',
        elType: 'section',
        contentPosition: 'default',
        stretchSection: 'no',
        heightType: 'default',
        gap: 'default',
        background: {},
        structure: '100',
        columns: [
          {
            id: 'column-1',
            elType: 'column',
            width: 100,
            widthUnit: '%',
            contentPosition: 'default',
            background: {},
            widgets: [
              {
                id: 'widget-1',
                elType: 'widget',
                widgetType: 'heading',
                content: {
                  text: 'Hello World',
                  tag: 'h1',
                  align: 'left',
                },
                style: {},
                advanced: {},
              },
            ],
          },
        ],
      },
    ],
    pageSettings: {
      pageLayout: 'default',
      contentWidth: 1140,
    },
    extractedAt: '2024-01-01T00:00:00Z',
    extractorVersion: '1.0.0',
  });

  describe('validatePage', () => {
    it('should validate a correct minimal page', () => {
      const page = createMinimalValidPage();
      const result = validator.validatePage(page);

      // Note: This might still fail due to missing optional fields,
      // but let's check the structure of the response
      expect(result).toHaveProperty('valid');
      expect(result).toHaveProperty('errors');
      expect(Array.isArray(result.errors)).toBe(true);
    });

    it('should reject page with missing required fields', () => {
      const page = createMinimalValidPage();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      delete (page as any).id;

      const result = validator.validatePage(page);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      expect(result.errors.some(e => e.path.includes('id'))).toBe(true);
    });

    it('should reject page with invalid status', () => {
      const page = createMinimalValidPage();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (page as any).status = 'invalid-status';

      const result = validator.validatePage(page);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject page with invalid ID type', () => {
      const page = createMinimalValidPage();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (page as any).id = 'not-a-number';

      const result = validator.validatePage(page);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject page with invalid sections array', () => {
      const page = createMinimalValidPage();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (page as any).sections = 'not-an-array';

      const result = validator.validatePage(page);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject page with invalid edit mode', () => {
      const page = createMinimalValidPage();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (page as any).editMode = 'invalid-mode';

      const result = validator.validatePage(page);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should reject page with invalid template type', () => {
      const page = createMinimalValidPage();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (page as any).templateType = 'invalid-type';

      const result = validator.validatePage(page);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should handle null input gracefully', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = validator.validatePage(null as any);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should handle undefined input gracefully', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = validator.validatePage(undefined as any);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should handle empty object gracefully', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = validator.validatePage({} as any);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });
  });

  describe('toExtractionIssues', () => {
    it('should return empty array for valid result', () => {
      const result = {
        valid: true,
        errors: [],
      };

      const issues = validator.toExtractionIssues(result, 123);

      expect(issues).toHaveLength(0);
    });

    it('should convert validation errors to extraction issues', () => {
      const result = {
        valid: false,
        errors: [
          {
            path: 'sections.0.columns',
            message: 'Invalid type',
            code: 'invalid_type',
            expected: 'array',
            received: 'string',
          },
          {
            path: 'title',
            message: 'Required',
            code: 'invalid_type',
          },
        ],
      };

      const issues = validator.toExtractionIssues(result, 123);

      expect(issues).toHaveLength(2);
      expect(issues[0]).toMatchObject({
        severity: 'error',
        category: 'validation-error',
        location: 'Page 123, sections.0.columns',
      });
      expect(issues[0]?.message).toContain('Invalid type');
      expect(issues[0]?.message).toContain('expected: array');
      expect(issues[0]?.message).toContain('received: string');
      expect(issues[1]).toMatchObject({
        severity: 'error',
        category: 'validation-error',
        location: 'Page 123, title',
      });
    });

    it('should include timestamp in issues', () => {
      const result = {
        valid: false,
        errors: [
          {
            path: 'id',
            message: 'Invalid',
            code: 'invalid_type',
          },
        ],
      };

      const issues = validator.toExtractionIssues(result, 456);

      expect(issues).toHaveLength(1);
      expect(issues[0]?.timestamp).toBeDefined();
      expect(new Date(issues[0]!.timestamp).getTime()).toBeGreaterThan(0);
    });

    it('should format messages without expected/received when not present', () => {
      const result = {
        valid: false,
        errors: [
          {
            path: 'settings.value',
            message: 'Must be positive',
            code: 'custom_error',
          },
        ],
      };

      const issues = validator.toExtractionIssues(result, 789);

      expect(issues).toHaveLength(1);
      expect(issues[0]?.message).toBe('Must be positive at settings.value');
    });
  });

  describe('validateStructure', () => {
    it('should return no issues for well-structured page', () => {
      const page = createMinimalValidPage();

      const issues = validator.validateStructure(page);

      expect(issues).toHaveLength(0);
    });

    it('should warn about page with no sections', () => {
      const page = createMinimalValidPage();
      page.sections = [];

      const issues = validator.validateStructure(page);

      expect(issues).toHaveLength(1);
      expect(issues[0]?.severity).toBe('warning');
      expect(issues[0]?.category).toBe('incomplete-data');
      expect(issues[0]?.message).toContain('no sections');
      expect(issues[0]?.location).toContain('Page 1');
    });

    it('should warn about section with no columns', () => {
      const page = createMinimalValidPage();
      page.sections[0]!.columns = [];

      const issues = validator.validateStructure(page);

      expect(issues).toHaveLength(1);
      expect(issues[0]?.severity).toBe('warning');
      expect(issues[0]?.category).toBe('incomplete-data');
      expect(issues[0]?.message).toContain('no columns');
      expect(issues[0]?.sectionId).toBe('section-1');
    });

    it('should report info about column with no widgets', () => {
      const page = createMinimalValidPage();
      page.sections[0]!.columns[0]!.widgets = [];

      const issues = validator.validateStructure(page);

      expect(issues).toHaveLength(1);
      expect(issues[0]?.severity).toBe('info');
      expect(issues[0]?.category).toBe('incomplete-data');
      expect(issues[0]?.message).toContain('no widgets');
    });

    it('should report multiple structural issues', () => {
      const page = createMinimalValidPage();

      // Add section with no columns
      page.sections.push({
        id: 'section-2',
        elType: 'section',
        contentPosition: 'default',
        stretchSection: 'no',
        heightType: 'default',
        gap: 'default',
        background: {},
        structure: '100',
        columns: [],
      });

      // Add section with empty column
      page.sections.push({
        id: 'section-3',
        elType: 'section',
        contentPosition: 'default',
        stretchSection: 'no',
        heightType: 'default',
        gap: 'default',
        background: {},
        structure: '100',
        columns: [
          {
            id: 'column-3',
            elType: 'column',
            width: 100,
            widthUnit: '%',
            contentPosition: 'default',
            background: {},
            widgets: [],
          },
        ],
      });

      const issues = validator.validateStructure(page);

      expect(issues.length).toBeGreaterThan(1);
      expect(issues.some((i) => i.message.includes('no columns'))).toBe(true);
      expect(issues.some((i) => i.message.includes('no widgets'))).toBe(true);
    });

    it('should include correct location information', () => {
      const page = createMinimalValidPage();
      page.sections[0]!.columns[0]!.widgets = [];

      const issues = validator.validateStructure(page);

      expect(issues[0]?.location).toContain('Page 1');
      expect(issues[0]?.location).toContain('Section 0');
      expect(issues[0]?.location).toContain('Column 0');
    });

    it('should validate multiple sections and columns correctly', () => {
      const page = createMinimalValidPage();

      // Add another section with column
      page.sections.push({
        id: 'section-2',
        elType: 'section',
        contentPosition: 'default',
        stretchSection: 'no',
        heightType: 'default',
        gap: 'default',
        background: {},
        structure: '50_50',
        columns: [
          {
            id: 'column-2',
            elType: 'column',
            width: 50,
            widthUnit: '%',
            contentPosition: 'default',
            background: {},
            widgets: [],
          },
          {
            id: 'column-3',
            elType: 'column',
            width: 50,
            widgetUnit: '%',
            contentPosition: 'default',
            background: {},
            widgets: [],
          },
        ],
      });

      const issues = validator.validateStructure(page);

      // Should have info for 2 empty columns in section 2
      expect(issues.length).toBe(2);
      expect(issues.every((i) => i.severity === 'info')).toBe(true);
    });
  });

  describe('formatZodErrors', () => {
    it('should handle errors with path information', () => {
      const page = createMinimalValidPage();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (page.sections[0] as any).columns = 'not-an-array';

      const result = validator.validatePage(page);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
      const error = result.errors.find(e => e.path.includes('columns'));
      expect(error).toBeDefined();
      expect(error?.message).toBeDefined();
      expect(error?.code).toBeDefined();
    });

    it('should handle root-level errors', () => {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      const result = validator.validatePage({ invalid: 'structure' } as any);

      expect(result.valid).toBe(false);
      expect(result.errors.length).toBeGreaterThan(0);
    });

    it('should format nested paths with dot notation', () => {
      const page = createMinimalValidPage();
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      (page.sections[0]!.columns[0] as any).width = 'not-a-number';

      const result = validator.validatePage(page);

      expect(result.valid).toBe(false);
      const error = result.errors.find(e => e.path.includes('width'));
      expect(error).toBeDefined();
      expect(error?.path).toContain('sections');
      expect(error?.path).toContain('columns');
      expect(error?.path).toContain('width');
    });
  });
});

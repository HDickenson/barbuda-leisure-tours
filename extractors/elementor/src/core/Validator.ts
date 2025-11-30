/**
 * Validator
 * Validates extracted Elementor data against Zod schemas
 */

import type { Logger } from 'winston';
import type { ElementorPage } from '../models';
import type { ExtractionIssue } from '../models';
import { ElementorPageSchema } from '../schemas';

/**
 * Validation result for a single entity
 */
export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validation error details
 */
export interface ValidationError {
  path: string;
  message: string;
  code: string;
  expected?: string;
  received?: string;
}

/**
 * Validator class for Elementor data
 */
export class Validator {
  private logger: Logger | undefined;

  constructor(logger?: Logger) {
    this.logger = logger;
  }

  /**
   * Validate a complete ElementorPage
   * @param page The page to validate
   * @returns Validation result with any errors found
   */
  validatePage(page: ElementorPage): ValidationResult {
    try {
      const result = ElementorPageSchema.safeParse(page);

      if (result.success) {
        this.logger?.debug('Page validation passed', { pageId: page.id });
        return {
          valid: true,
          errors: [],
        };
      }

      // Extract validation errors
      const errors = this.formatZodErrors(result.error);
      this.logger?.warn('Page validation failed', {
        pageId: page.id,
        errorCount: errors.length,
        errors,
      });

      return {
        valid: false,
        errors,
      };
    } catch (error) {
      this.logger?.error('Validation error', {
        error: error instanceof Error ? error.message : String(error),
      });

      return {
        valid: false,
        errors: [
          {
            path: 'root',
            message: 'Validation failed with exception',
            code: 'validation_exception',
          },
        ],
      };
    }
  }

  /**
   * Convert validation result to extraction issues
   * @param result Validation result
   * @param pageId Page ID for context
   * @returns Array of extraction issues
   */
  toExtractionIssues(result: ValidationResult, pageId: number): ExtractionIssue[] {
    if (result.valid) {
      return [];
    }

    return result.errors.map((error) => ({
      severity: 'error' as const,
      category: 'validation-error' as const,
      message: `${error.message} at ${error.path}${error.expected ? ` (expected: ${error.expected})` : ''}${error.received ? ` (received: ${error.received})` : ''}`,
      location: `Page ${pageId}, ${error.path}`,
      timestamp: new Date().toISOString(),
    }));
  }

  /**
   * Validate page structure (sections, columns, widgets)
   * @param page The page to validate
   * @returns Validation issues found
   */
  validateStructure(page: ElementorPage): ExtractionIssue[] {
    const issues: ExtractionIssue[] = [];

    // Check for empty sections
    if (page.sections.length === 0) {
      issues.push({
        severity: 'warning',
        category: 'incomplete-data',
        message: 'Page has no sections',
        location: `Page ${page.id}`,
        timestamp: new Date().toISOString(),
      });
    }

    // Validate sections
    for (const [sectionIndex, section] of page.sections.entries()) {
      // Check for empty columns
      if (section.columns.length === 0) {
        issues.push({
          severity: 'warning',
          category: 'incomplete-data',
          message: `Section ${sectionIndex} has no columns`,
          sectionId: section.id,
          location: `Page ${page.id}, Section ${sectionIndex}`,
          timestamp: new Date().toISOString(),
        });
      }

      // Validate columns
      for (const [columnIndex, column] of section.columns.entries()) {
        // Check for empty widgets
        if (column.widgets.length === 0) {
          issues.push({
            severity: 'info',
            category: 'incomplete-data',
            message: `Column ${columnIndex} in section ${sectionIndex} has no widgets`,
            sectionId: section.id,
            location: `Page ${page.id}, Section ${sectionIndex}, Column ${columnIndex}`,
            timestamp: new Date().toISOString(),
          });
        }
      }
    }

    return issues;
  }

  /**
   * Format Zod errors into our validation error format
   */
  private formatZodErrors(zodError: { issues: Array<{ path: (string | number)[]; message: string; code: string; expected?: unknown; received?: unknown }> }): ValidationError[] {
    return zodError.issues.map((issue) => ({
      path: issue.path.join('.') || 'root',
      message: issue.message,
      code: issue.code,
      ...(issue.expected !== undefined && { expected: String(issue.expected) }),
      ...(issue.received !== undefined && { received: String(issue.received) }),
    }));
  }
}

/**
 * Create a validator instance
 */
export function createValidator(logger?: Logger): Validator {
  return new Validator(logger);
}

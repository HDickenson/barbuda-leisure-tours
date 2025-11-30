/**
 * Tests for ExtractionReport model helpers
 */

import { describe, it, expect } from 'vitest';
import {
  generateReportSummary,
  addIssue,
  meetsQualityThreshold,
} from './ExtractionReport';
import type { ExtractionReport, ExtractionIssue } from './ExtractionReport';

describe('ExtractionReport', () => {
  const createBaseReport = (): ExtractionReport => ({
    reportVersion: '1.0.0',
    generatedAt: '2024-01-15T10:30:00Z',
    extractorVersion: '1.0.0',
    config: {
      connectorType: 'rest-api',
      continueOnError: true,
      validateSchemas: true,
      extractGlobalStyles: true,
      includeProWidgets: true,
    },
    status: 'success',
    statusMessage: 'Extraction completed successfully',
    coverage: {
      totalWidgets: 100,
      extractedWidgets: 100,
      failedWidgets: 0,
      coveragePercentage: 100,
      widgetTypes: {
        heading: { count: 10, extracted: 10, failed: 0 },
        'text-editor': { count: 20, extracted: 20, failed: 0 },
      },
    },
    performance: {
      extractionStartTime: '2024-01-15T10:30:00Z',
      extractionEndTime: '2024-01-15T10:30:05Z',
      durationMs: 5000,
      durationHuman: '5s',
      timings: {
        connection: 1000,
        dataFetch: 2000,
        parsing: 1500,
        validation: 500,
      },
    },
    issues: [],
    errorCount: 0,
    warningCount: 0,
    infoCount: 0,
    source: {
      wordPressVersion: '6.4.2',
      elementorVersion: '3.18.0',
    },
  });

  describe('generateReportSummary', () => {
    it('should generate summary from full report', () => {
      const report = createBaseReport();
      const summary = generateReportSummary(report);

      expect(summary.status).toBe('success');
      expect(summary.totalWidgets).toBe(100);
      expect(summary.extractedWidgets).toBe(100);
      expect(summary.failedWidgets).toBe(0);
      expect(summary.coveragePercentage).toBe(100);
      expect(summary.durationMs).toBe(5000);
      expect(summary.errorCount).toBe(0);
      expect(summary.warningCount).toBe(0);
    });

    it('should handle partial extraction in summary', () => {
      const report = createBaseReport();
      report.status = 'partial';
      report.coverage.extractedWidgets = 80;
      report.coverage.failedWidgets = 20;
      report.coverage.coveragePercentage = 80;
      report.errorCount = 5;
      report.warningCount = 10;

      const summary = generateReportSummary(report);

      expect(summary.status).toBe('partial');
      expect(summary.extractedWidgets).toBe(80);
      expect(summary.failedWidgets).toBe(20);
      expect(summary.coveragePercentage).toBe(80);
      expect(summary.errorCount).toBe(5);
      expect(summary.warningCount).toBe(10);
    });
  });

  describe('addIssue', () => {
    it('should add error issue and update counters', () => {
      const report = createBaseReport();
      const issue: ExtractionIssue = {
        severity: 'error',
        category: 'parsing-error',
        message: 'Failed to parse widget',
        widgetId: 'widget1',
        timestamp: '2024-01-15T10:30:01Z',
      };

      const updated = addIssue(report, issue);

      expect(updated.issues).toHaveLength(1);
      expect(updated.issues[0]).toEqual(issue);
      expect(updated.errorCount).toBe(1);
      expect(updated.warningCount).toBe(0);
      expect(updated.infoCount).toBe(0);
    });

    it('should change status to partial on error', () => {
      const report = createBaseReport();
      const issue: ExtractionIssue = {
        severity: 'error',
        category: 'parsing-error',
        message: 'Failed to parse widget',
        timestamp: '2024-01-15T10:30:01Z',
      };

      const updated = addIssue(report, issue);

      expect(updated.status).toBe('partial');
    });

    it('should add warning issue without changing status', () => {
      const report = createBaseReport();
      const issue: ExtractionIssue = {
        severity: 'warning',
        category: 'incomplete-data',
        message: 'Missing optional field',
        timestamp: '2024-01-15T10:30:01Z',
      };

      const updated = addIssue(report, issue);

      expect(updated.warningCount).toBe(1);
      expect(updated.status).toBe('success');
    });

    it('should add info issue', () => {
      const report = createBaseReport();
      const issue: ExtractionIssue = {
        severity: 'info',
        category: 'performance',
        message: 'Extraction took longer than expected',
        timestamp: '2024-01-15T10:30:01Z',
      };

      const updated = addIssue(report, issue);

      expect(updated.infoCount).toBe(1);
    });

    it('should handle multiple issues', () => {
      let report = createBaseReport();

      const error: ExtractionIssue = {
        severity: 'error',
        category: 'parsing-error',
        message: 'Error 1',
        timestamp: '2024-01-15T10:30:01Z',
      };

      const warning: ExtractionIssue = {
        severity: 'warning',
        category: 'incomplete-data',
        message: 'Warning 1',
        timestamp: '2024-01-15T10:30:02Z',
      };

      report = addIssue(report, error);
      report = addIssue(report, warning);
      report = addIssue(report, error);

      expect(report.issues).toHaveLength(3);
      expect(report.errorCount).toBe(2);
      expect(report.warningCount).toBe(1);
    });
  });

  describe('meetsQualityThreshold', () => {
    it('should return true for perfect extraction', () => {
      const report = createBaseReport();
      expect(meetsQualityThreshold(report)).toBe(true);
    });

    it('should return true for extraction meeting threshold', () => {
      const report = createBaseReport();
      report.coverage.extractedWidgets = 85;
      report.coverage.failedWidgets = 15;
      report.coverage.coveragePercentage = 85;

      expect(meetsQualityThreshold(report, 80)).toBe(true);
    });

    it('should return false for extraction below threshold', () => {
      const report = createBaseReport();
      report.coverage.extractedWidgets = 75;
      report.coverage.failedWidgets = 25;
      report.coverage.coveragePercentage = 75;

      expect(meetsQualityThreshold(report, 80)).toBe(false);
    });

    it('should return false if status is failed', () => {
      const report = createBaseReport();
      report.status = 'failed';

      expect(meetsQualityThreshold(report)).toBe(false);
    });

    it('should return false if there are errors', () => {
      const report = createBaseReport();
      report.errorCount = 1;

      expect(meetsQualityThreshold(report)).toBe(false);
    });

    it('should use default threshold of 80%', () => {
      const report = createBaseReport();
      report.coverage.extractedWidgets = 79;
      report.coverage.failedWidgets = 21;
      report.coverage.coveragePercentage = 79;

      expect(meetsQualityThreshold(report)).toBe(false);
    });

    it('should allow custom threshold', () => {
      const report = createBaseReport();
      report.coverage.extractedWidgets = 95;
      report.coverage.failedWidgets = 5;
      report.coverage.coveragePercentage = 95;

      expect(meetsQualityThreshold(report, 90)).toBe(true);
      expect(meetsQualityThreshold(report, 96)).toBe(false);
    });
  });
});

/**
 * Report Generator
 * Formats and exports extraction reports in multiple formats
 */

import { promises as fs } from 'fs';
import { dirname } from 'path';
import type {
  ExtractionReport,
  ExtractionIssue,
} from '../models/ExtractionReport';

/**
 * Report output format
 */
export type ReportFormat = 'json' | 'md' | 'html';

/**
 * Report generation options
 */
export interface ReportOptions {
  includeStackTraces?: boolean; // Include stack traces in output (default: false for md/html)
  colorize?: boolean; // Use ANSI colors in markdown output (default: false)
  includeSummaryOnly?: boolean; // Only include summary, not detailed issues (default: false)
  groupIssuesBy?: 'severity' | 'category' | 'page'; // How to group issues (default: 'severity')
}

/**
 * Report Generator
 * Transforms extraction reports into various output formats
 */
export class ReportGenerator {
  /**
   * Convert report to JSON string
   * @param report Extraction report
   * @param pretty Pretty print JSON (default: true)
   * @returns JSON string
   */
  static toJSON(report: ExtractionReport, pretty: boolean = true): string {
    return pretty
      ? JSON.stringify(report, null, 2)
      : JSON.stringify(report);
  }

  /**
   * Convert report to Markdown format
   * @param report Extraction report
   * @param options Report options
   * @returns Markdown string
   */
  static toMarkdown(
    report: ExtractionReport,
    options: ReportOptions = {},
  ): string {
    const lines: string[] = [];

    // Title and metadata
    lines.push('# Elementor Extraction Report\n');
    lines.push(`**Status:** ${this.formatStatus(report.status)}`);
    lines.push(`**Generated:** ${new Date(report.generatedAt).toLocaleString()}`);
    lines.push(`**Duration:** ${report.performance.durationHuman}`);
    lines.push(`**Extractor Version:** ${report.extractorVersion}\n`);

    // Summary
    lines.push('## Summary\n');
    lines.push(report.statusMessage + '\n');

    // Coverage statistics
    lines.push('### Widget Coverage\n');
    lines.push('| Metric | Value |');
    lines.push('|--------|-------|');
    lines.push(`| Total Widgets | ${report.coverage.totalWidgets} |`);
    lines.push(`| Extracted | ${report.coverage.extractedWidgets} |`);
    lines.push(`| Failed | ${report.coverage.failedWidgets} |`);
    lines.push(`| Coverage | ${report.coverage.coveragePercentage}% |`);
    lines.push('');

    // Issue counts
    lines.push('### Issues\n');
    lines.push('| Severity | Count |');
    lines.push('|----------|-------|');
    lines.push(`| Errors | ${report.errorCount} |`);
    lines.push(`| Warnings | ${report.warningCount} |`);
    lines.push(`| Info | ${report.infoCount} |`);
    lines.push('');

    // Widget types breakdown
    if (Object.keys(report.coverage.widgetTypes).length > 0) {
      lines.push('### Widget Types\n');
      lines.push('| Widget Type | Count | Extracted | Failed |');
      lines.push('|-------------|-------|-----------|--------|');

      const sortedTypes = Object.entries(report.coverage.widgetTypes).sort(
        ([, a], [, b]) => b.count - a.count,
      );

      for (const [type, stats] of sortedTypes) {
        lines.push(
          `| ${type} | ${stats.count} | ${stats.extracted} | ${stats.failed} |`,
        );
      }
      lines.push('');
    }

    // Configuration
    lines.push('## Configuration\n');
    lines.push('| Setting | Value |');
    lines.push('|---------|-------|');
    lines.push(`| Connector | ${report.config.connectorType} |`);
    lines.push(`| Validate Schemas | ${report.config.validateSchemas} |`);
    lines.push(`| Continue on Error | ${report.config.continueOnError} |`);
    lines.push(`| Extract Global Styles | ${report.config.extractGlobalStyles} |`);
    lines.push(`| Include Pro Widgets | ${report.config.includeProWidgets} |`);
    if (report.config.sourceUrl) {
      lines.push(`| Source URL | ${report.config.sourceUrl} |`);
    }
    lines.push('');

    // Source metadata
    if (Object.keys(report.source).length > 0) {
      lines.push('## Source Information\n');
      lines.push('| Property | Value |');
      lines.push('|----------|-------|');
      if (report.source.wordPressVersion) {
        lines.push(`| WordPress Version | ${report.source.wordPressVersion} |`);
      }
      if (report.source.elementorVersion) {
        lines.push(`| Elementor Version | ${report.source.elementorVersion} |`);
      }
      if (report.source.elementorProVersion) {
        lines.push(`| Elementor Pro Version | ${report.source.elementorProVersion} |`);
      }
      if (report.source.phpVersion) {
        lines.push(`| PHP Version | ${report.source.phpVersion} |`);
      }
      if (report.source.activeTheme) {
        lines.push(`| Active Theme | ${report.source.activeTheme} |`);
      }
      lines.push('');
    }

    // Recommendations
    if (report.recommendations && report.recommendations.length > 0) {
      lines.push('## Recommendations\n');
      for (const rec of report.recommendations) {
        lines.push(`- ${rec}`);
      }
      lines.push('');
    }

    // Detailed issues
    if (!options.includeSummaryOnly && report.issues.length > 0) {
      lines.push('## Issues Detail\n');
      const groupedIssues = this.groupIssues(
        report.issues,
        options.groupIssuesBy || 'severity',
      );

      for (const [group, issues] of Object.entries(groupedIssues)) {
        lines.push(`### ${this.formatGroupName(group, options.groupIssuesBy || 'severity')}\n`);

        for (const issue of issues) {
          lines.push(
            `- **[${issue.severity.toUpperCase()}]** ${issue.message}`,
          );
          if (issue.location) {
            lines.push(`  - Location: ${issue.location}`);
          }
          if (issue.widgetType) {
            lines.push(`  - Widget Type: ${issue.widgetType}`);
          }
          if (issue.timestamp) {
            lines.push(
              `  - Time: ${new Date(issue.timestamp).toLocaleString()}`,
            );
          }
          if (options.includeStackTraces && issue.stackTrace) {
            lines.push(`  - Stack Trace:\n\`\`\`\n${issue.stackTrace}\n\`\`\``);
          }
          lines.push('');
        }
      }
    }

    // Performance metrics
    lines.push('## Performance\n');
    lines.push('| Metric | Value |');
    lines.push('|--------|-------|');
    lines.push(`| Duration | ${report.performance.durationHuman} |`);
    lines.push(`| Start Time | ${new Date(report.performance.extractionStartTime).toLocaleString()} |`);
    lines.push(`| End Time | ${new Date(report.performance.extractionEndTime).toLocaleString()} |`);

    if (report.performance.timings) {
      if (report.performance.timings.connection) {
        lines.push(`| Connection | ${report.performance.timings.connection}ms |`);
      }
      if (report.performance.timings.dataFetch) {
        lines.push(`| Data Fetch | ${report.performance.timings.dataFetch}ms |`);
      }
      if (report.performance.timings.parsing) {
        lines.push(`| Parsing | ${report.performance.timings.parsing}ms |`);
      }
      if (report.performance.timings.validation) {
        lines.push(`| Validation | ${report.performance.timings.validation}ms |`);
      }
    }

    if (report.performance.memoryUsage) {
      lines.push(`| Peak Memory | ${report.performance.memoryUsage.peakMB} MB |`);
      lines.push(`| Average Memory | ${report.performance.memoryUsage.averageMB} MB |`);
    }
    lines.push('');

    return lines.join('\n');
  }

  /**
   * Convert report to HTML format
   * @param report Extraction report
   * @param options Report options
   * @returns HTML string
   */
  static toHTML(
    report: ExtractionReport,
    options: ReportOptions = {},
  ): string {
    const coverageColor = this.getCoverageColor(
      report.coverage.coveragePercentage,
    );

    let html = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Elementor Extraction Report</title>
    <style>
        * {
            margin: 0;
            padding: 0;
            box-sizing: border-box;
        }

        body {
            font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, sans-serif;
            line-height: 1.6;
            color: #333;
            background: #f5f5f5;
            padding: 20px;
        }

        .container {
            max-width: 1200px;
            margin: 0 auto;
            background: white;
            padding: 40px;
            border-radius: 8px;
            box-shadow: 0 2px 4px rgba(0,0,0,0.1);
        }

        h1 {
            color: #2c3e50;
            margin-bottom: 20px;
            border-bottom: 3px solid #3498db;
            padding-bottom: 10px;
        }

        h2 {
            color: #34495e;
            margin-top: 30px;
            margin-bottom: 15px;
            font-size: 24px;
        }

        h3 {
            color: #7f8c8d;
            margin-top: 20px;
            margin-bottom: 10px;
            font-size: 18px;
        }

        .metadata {
            display: grid;
            grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
            gap: 15px;
            margin-bottom: 30px;
        }

        .metadata-item {
            padding: 15px;
            background: #ecf0f1;
            border-radius: 5px;
        }

        .metadata-label {
            font-weight: bold;
            color: #7f8c8d;
            font-size: 12px;
            text-transform: uppercase;
            margin-bottom: 5px;
        }

        .metadata-value {
            font-size: 18px;
            color: #2c3e50;
        }

        .status {
            display: inline-block;
            padding: 5px 15px;
            border-radius: 20px;
            color: white;
            font-weight: bold;
        }

        .status-success { background: #27ae60; }
        .status-partial { background: #f39c12; }
        .status-failed { background: #e74c3c; }

        .progress-bar {
            width: 100%;
            height: 30px;
            background: #ecf0f1;
            border-radius: 15px;
            overflow: hidden;
            margin: 10px 0;
        }

        .progress-fill {
            height: 100%;
            background: linear-gradient(to right, #3498db, #2ecc71);
            transition: width 0.3s ease;
            display: flex;
            align-items: center;
            justify-content: center;
            color: white;
            font-weight: bold;
        }

        table {
            width: 100%;
            border-collapse: collapse;
            margin: 15px 0;
        }

        th, td {
            padding: 12px;
            text-align: left;
            border-bottom: 1px solid #ecf0f1;
        }

        th {
            background: #34495e;
            color: white;
            font-weight: bold;
        }

        tr:hover {
            background: #f8f9fa;
        }

        .issue {
            margin: 10px 0;
            padding: 15px;
            border-left: 4px solid;
            border-radius: 4px;
            background: #f8f9fa;
        }

        .issue-error {
            border-left-color: #e74c3c;
            background: #fdecea;
        }

        .issue-warning {
            border-left-color: #f39c12;
            background: #fef5e7;
        }

        .issue-info {
            border-left-color: #3498db;
            background: #eaf2f8;
        }

        .issue-header {
            font-weight: bold;
            margin-bottom: 5px;
        }

        .issue-meta {
            font-size: 12px;
            color: #7f8c8d;
            margin-top: 5px;
        }

        .badge {
            display: inline-block;
            padding: 3px 8px;
            border-radius: 3px;
            font-size: 11px;
            font-weight: bold;
            text-transform: uppercase;
        }

        .badge-error { background: #e74c3c; color: white; }
        .badge-warning { background: #f39c12; color: white; }
        .badge-info { background: #3498db; color: white; }

        .recommendations {
            background: #e8f4f8;
            border-left: 4px solid #3498db;
            padding: 15px;
            margin: 15px 0;
        }

        .recommendations ul {
            margin-left: 20px;
        }

        .recommendations li {
            margin: 8px 0;
        }

        .chart-container {
            margin: 20px 0;
        }

        code {
            background: #f4f4f4;
            padding: 2px 6px;
            border-radius: 3px;
            font-family: 'Courier New', monospace;
        }

        pre {
            background: #2c3e50;
            color: #ecf0f1;
            padding: 15px;
            border-radius: 5px;
            overflow-x: auto;
        }
    </style>
</head>
<body>
    <div class="container">
        <h1>Elementor Extraction Report</h1>

        <div class="metadata">
            <div class="metadata-item">
                <div class="metadata-label">Status</div>
                <div class="metadata-value">
                    <span class="status status-${report.status}">${report.status.toUpperCase()}</span>
                </div>
            </div>
            <div class="metadata-item">
                <div class="metadata-label">Duration</div>
                <div class="metadata-value">${report.performance.durationHuman}</div>
            </div>
            <div class="metadata-item">
                <div class="metadata-label">Generated</div>
                <div class="metadata-value">${new Date(report.generatedAt).toLocaleString()}</div>
            </div>
            <div class="metadata-item">
                <div class="metadata-label">Extractor Version</div>
                <div class="metadata-value">${report.extractorVersion}</div>
            </div>
        </div>

        <h2>Summary</h2>
        <p>${report.statusMessage}</p>

        <h2>Widget Coverage</h2>
        <div class="progress-bar">
            <div class="progress-fill" style="width: ${report.coverage.coveragePercentage}%; background: ${coverageColor}">
                ${report.coverage.coveragePercentage}%
            </div>
        </div>

        <table>
            <tr>
                <th>Metric</th>
                <th>Value</th>
            </tr>
            <tr>
                <td>Total Widgets</td>
                <td>${report.coverage.totalWidgets}</td>
            </tr>
            <tr>
                <td>Extracted</td>
                <td>${report.coverage.extractedWidgets}</td>
            </tr>
            <tr>
                <td>Failed</td>
                <td>${report.coverage.failedWidgets}</td>
            </tr>
        </table>

        <h2>Issues</h2>
        <table>
            <tr>
                <th>Severity</th>
                <th>Count</th>
            </tr>
            <tr>
                <td><span class="badge badge-error">Errors</span></td>
                <td>${report.errorCount}</td>
            </tr>
            <tr>
                <td><span class="badge badge-warning">Warnings</span></td>
                <td>${report.warningCount}</td>
            </tr>
            <tr>
                <td><span class="badge badge-info">Info</span></td>
                <td>${report.infoCount}</td>
            </tr>
        </table>`;

    // Widget types table
    if (Object.keys(report.coverage.widgetTypes).length > 0) {
      html += `
        <h3>Widget Types</h3>
        <table>
            <tr>
                <th>Widget Type</th>
                <th>Count</th>
                <th>Extracted</th>
                <th>Failed</th>
            </tr>`;

      const sortedTypes = Object.entries(report.coverage.widgetTypes).sort(
        ([, a], [, b]) => b.count - a.count,
      );

      for (const [type, stats] of sortedTypes) {
        html += `
            <tr>
                <td><code>${type}</code></td>
                <td>${stats.count}</td>
                <td>${stats.extracted}</td>
                <td>${stats.failed}</td>
            </tr>`;
      }

      html += `
        </table>`;
    }

    // Recommendations
    if (report.recommendations && report.recommendations.length > 0) {
      html += `
        <h2>Recommendations</h2>
        <div class="recommendations">
            <ul>`;

      for (const rec of report.recommendations) {
        html += `<li>${this.escapeHtml(rec)}</li>`;
      }

      html += `
            </ul>
        </div>`;
    }

    // Detailed issues
    if (!options.includeSummaryOnly && report.issues.length > 0) {
      html += `<h2>Issues Detail</h2>`;

      const groupedIssues = this.groupIssues(
        report.issues,
        options.groupIssuesBy || 'severity',
      );

      for (const [group, issues] of Object.entries(groupedIssues)) {
        html += `<h3>${this.formatGroupName(group, options.groupIssuesBy || 'severity')}</h3>`;

        for (const issue of issues) {
          const issueClass = `issue issue-${issue.severity}`;
          html += `
            <div class="${issueClass}">
                <div class="issue-header">
                    <span class="badge badge-${issue.severity}">${issue.severity.toUpperCase()}</span>
                    ${this.escapeHtml(issue.message)}
                </div>`;

          if (issue.location || issue.widgetType || issue.timestamp) {
            html += `<div class="issue-meta">`;
            if (issue.location) {
              html += `Location: ${this.escapeHtml(issue.location)} | `;
            }
            if (issue.widgetType) {
              html += `Widget: <code>${this.escapeHtml(issue.widgetType)}</code> | `;
            }
            if (issue.timestamp) {
              html += `Time: ${new Date(issue.timestamp).toLocaleString()}`;
            }
            html += `</div>`;
          }

          if (options.includeStackTraces && issue.stackTrace) {
            html += `<pre>${this.escapeHtml(issue.stackTrace)}</pre>`;
          }

          html += `</div>`;
        }
      }
    }

    // Configuration
    html += `
        <h2>Configuration</h2>
        <table>
            <tr>
                <th>Setting</th>
                <th>Value</th>
            </tr>
            <tr>
                <td>Connector Type</td>
                <td><code>${report.config.connectorType}</code></td>
            </tr>
            <tr>
                <td>Validate Schemas</td>
                <td>${report.config.validateSchemas ? 'Yes' : 'No'}</td>
            </tr>
            <tr>
                <td>Continue on Error</td>
                <td>${report.config.continueOnError ? 'Yes' : 'No'}</td>
            </tr>
            <tr>
                <td>Extract Global Styles</td>
                <td>${report.config.extractGlobalStyles ? 'Yes' : 'No'}</td>
            </tr>
            <tr>
                <td>Include Pro Widgets</td>
                <td>${report.config.includeProWidgets ? 'Yes' : 'No'}</td>
            </tr>`;

    if (report.config.sourceUrl) {
      const escapedUrl = this.escapeHtml(report.config.sourceUrl);
      html += `
            <tr>
                <td>Source URL</td>
                <td><a href="${report.config.sourceUrl}" target="_blank">${escapedUrl}</a></td>
            </tr>`;
    }

    html += `
        </table>`;

    // Performance
    html += `
        <h2>Performance</h2>
        <table>
            <tr>
                <th>Metric</th>
                <th>Value</th>
            </tr>
            <tr>
                <td>Duration</td>
                <td>${report.performance.durationHuman}</td>
            </tr>
            <tr>
                <td>Start Time</td>
                <td>${new Date(report.performance.extractionStartTime).toLocaleString()}</td>
            </tr>
            <tr>
                <td>End Time</td>
                <td>${new Date(report.performance.extractionEndTime).toLocaleString()}</td>
            </tr>`;

    if (report.performance.timings) {
      if (report.performance.timings.connection) {
        html += `<tr><td>Connection Time</td><td>${report.performance.timings.connection}ms</td></tr>`;
      }
      if (report.performance.timings.dataFetch) {
        html += `<tr><td>Data Fetch Time</td><td>${report.performance.timings.dataFetch}ms</td></tr>`;
      }
      if (report.performance.timings.parsing) {
        html += `<tr><td>Parsing Time</td><td>${report.performance.timings.parsing}ms</td></tr>`;
      }
      if (report.performance.timings.validation) {
        html += `<tr><td>Validation Time</td><td>${report.performance.timings.validation}ms</td></tr>`;
      }
    }

    html += `
        </table>
    </div>
</body>
</html>`;

    return html;
  }

  /**
   * Write report to file system
   * @param report Extraction report
   * @param outputPath Output file path
   * @param format Output format (default: inferred from file extension)
   * @param options Report options
   */
  static async writeReport(
    report: ExtractionReport,
    outputPath: string,
    format?: ReportFormat,
    options: ReportOptions = {},
  ): Promise<void> {
    // Infer format from extension if not provided
    let finalFormat: ReportFormat = format ?? 'md';
    if (!format) {
      if (outputPath.endsWith('.json')) {
        finalFormat = 'json';
      } else if (outputPath.endsWith('.html')) {
        finalFormat = 'html';
      } else {
        finalFormat = 'md';
      }
    }

    // Generate content
    let content: string;
    switch (finalFormat) {
      case 'json':
        content = this.toJSON(report);
        break;
      case 'html':
        content = this.toHTML(report, options);
        break;
      case 'md':
      default:
        content = this.toMarkdown(report, options);
        break;
    }

    // Ensure directory exists
    const dir = dirname(outputPath);
    await fs.mkdir(dir, { recursive: true });

    // Write file
    await fs.writeFile(outputPath, content, 'utf-8');
  }

  /**
   * Group issues by severity, category, or page
   */
  private static groupIssues(
    issues: ExtractionIssue[],
    groupBy: 'severity' | 'category' | 'page',
  ): Record<string, ExtractionIssue[]> {
    const grouped: Record<string, ExtractionIssue[]> = {};

    for (const issue of issues) {
      let key: string;

      switch (groupBy) {
        case 'severity':
          key = issue.severity;
          break;
        case 'category':
          key = issue.category;
          break;
        case 'page':
          key = issue.location ?? 'Unknown';
          break;
        default:
          key = 'other';
      }

      if (!grouped[key]) {
        grouped[key] = [];
      }

      const group = grouped[key];
      if (group) {
        group.push(issue);
      }
    }

    return grouped;
  }

  /**
   * Format group name for display
   */
  private static formatGroupName(
    group: string,
    groupBy: 'severity' | 'category' | 'page',
  ): string {
    switch (groupBy) {
      case 'severity':
        return `${group.charAt(0).toUpperCase() + group.slice(1)} Issues`;
      case 'category':
        return group
          .split('-')
          .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      case 'page':
        return group;
      default:
        return group;
    }
  }

  /**
   * Format status badge
   */
  private static formatStatus(status: string): string {
    return status.toUpperCase();
  }

  /**
   * Get coverage color based on percentage
   */
  private static getCoverageColor(percentage: number): string {
    if (percentage >= 80) return '#27ae60';
    if (percentage >= 60) return '#f39c12';
    return '#e74c3c';
  }

  /**
   * Escape HTML special characters
   */
  private static escapeHtml(text: string): string {
    const map: Record<string, string> = {
      '&': '&amp;',
      '<': '&lt;',
      '>': '&gt;',
      '"': '&quot;',
      "'": '&#039;',
    };
    return text.replace(/[&<>"']/g, (char) => map[char] ?? char);
  }
}

/**
 * Generate a summary report string for CLI output
 * @param report Extraction report
 * @returns Formatted summary string
 */
export function generateSummaryText(report: ExtractionReport): string {
  const lines: string[] = [];

  lines.push('='.repeat(60));
  lines.push('EXTRACTION SUMMARY');
  lines.push('='.repeat(60));
  lines.push('');
  lines.push(`Status: ${report.status.toUpperCase()}`);
  lines.push(`Message: ${report.statusMessage}`);
  lines.push(`Duration: ${report.performance.durationHuman}`);
  lines.push('');
  lines.push('Widget Coverage:');
  lines.push(`  Total: ${report.coverage.totalWidgets}`);
  lines.push(`  Extracted: ${report.coverage.extractedWidgets}`);
  lines.push(`  Failed: ${report.coverage.failedWidgets}`);
  lines.push(`  Coverage: ${report.coverage.coveragePercentage}%`);
  lines.push('');
  lines.push('Issues:');
  lines.push(`  Errors: ${report.errorCount}`);
  lines.push(`  Warnings: ${report.warningCount}`);
  lines.push(`  Info: ${report.infoCount}`);
  lines.push('');
  lines.push('='.repeat(60));

  return lines.join('\n');
}

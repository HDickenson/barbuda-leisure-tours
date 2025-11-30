/**
 * CLI Output Formatter
 * Provides colored console output, progress indicators, and formatted tables
 */

import type { ExtractionReport } from '../models/ExtractionReport';

/**
 * ANSI color codes for terminal output
 * Uses standard ANSI escape sequences for cross-platform compatibility
 */
export const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',

  // Foreground colors
  black: '\x1b[30m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
  white: '\x1b[37m',
  gray: '\x1b[90m',

  // Background colors
  bgRed: '\x1b[41m',
  bgGreen: '\x1b[42m',
  bgYellow: '\x1b[43m',
  bgBlue: '\x1b[44m',
  bgMagenta: '\x1b[45m',
  bgCyan: '\x1b[46m',
  bgWhite: '\x1b[47m',
};

/**
 * Spinner characters for animations
 */
const SPINNER_FRAMES = ['⠋', '⠙', '⠹', '⠸', '⠼', '⠴', '⠦', '⠧', '⠇', '⠏'];

/**
 * Check if colors should be enabled
 * Respects NO_COLOR and CI environment variables
 */
function shouldUseColors(): boolean {
  if (process.env.NO_COLOR) return false;
  if (process.env.CI === 'true') return false;

  // Check if stdout is a TTY
  return process.stdout.isTTY ?? false;
}

/**
 * Apply color to text if colors are enabled
 */
function colorize(text: string, color: string): string {
  return shouldUseColors() ? `${color}${text}${colors.reset}` : text;
}

/**
 * Formatter class for managing output state
 */
export class Formatter {
  private useColors: boolean;

  constructor() {
    this.useColors = shouldUseColors();
  }

  /**
   * Enable or disable colors
   */
  setColors(enabled: boolean): void {
    this.useColors = enabled;
  }

  /**
   * Format text with color
   */
  color(text: string, color: string): string {
    return this.useColors ? `${color}${text}${colors.reset}` : text;
  }

  /**
   * Format bold text
   */
  bold(text: string): string {
    return this.color(text, colors.bold);
  }

  /**
   * Format dim text
   */
  dim(text: string): string {
    return this.color(text, colors.dim);
  }
}

/**
 * Create a new formatter instance
 */
export function createFormatter(): Formatter {
  return new Formatter();
}

/**
 * Format success message (green)
 */
export function formatSuccess(message: string): string {
  return colorize(`✓ ${message}`, colors.green);
}

/**
 * Format error message (red)
 */
export function formatError(message: string): string {
  return colorize(`✗ ${message}`, colors.red);
}

/**
 * Format warning message (yellow)
 */
export function formatWarning(message: string): string {
  return colorize(`⚠ ${message}`, colors.yellow);
}

/**
 * Format info message (blue)
 */
export function formatInfo(message: string): string {
  return colorize(`ℹ ${message}`, colors.blue);
}

/**
 * Spinner class for long-running operations
 */
export class Spinner {
  private intervalId: NodeJS.Timeout | null = null;
  private frameIndex = 0;
  private text = '';
  private isSpinning = false;

  /**
   * Start the spinner with a message
   */
  start(text: string): void {
    if (!shouldUseColors()) {
      console.log(`${text}...`);
      return;
    }

    this.text = text;
    this.isSpinning = true;
    this.frameIndex = 0;

    // Hide cursor
    process.stdout.write('\x1B[?25l');

    this.intervalId = setInterval(() => {
      this.render();
    }, 80);
  }

  /**
   * Stop the spinner with success message
   */
  succeed(text?: string): void {
    this.stop();
    if (text || this.text) {
      console.log(formatSuccess(text || this.text));
    }
  }

  /**
   * Stop the spinner with failure message
   */
  fail(text?: string): void {
    this.stop();
    if (text || this.text) {
      console.log(formatError(text || this.text));
    }
  }

  /**
   * Stop the spinner with warning message
   */
  warn(text?: string): void {
    this.stop();
    if (text || this.text) {
      console.log(formatWarning(text || this.text));
    }
  }

  /**
   * Stop the spinner with info message
   */
  info(text?: string): void {
    this.stop();
    if (text || this.text) {
      console.log(formatInfo(text || this.text));
    }
  }

  /**
   * Update the spinner text
   */
  updateText(text: string): void {
    this.text = text;
    if (this.isSpinning) {
      this.render();
    }
  }

  /**
   * Stop the spinner without message
   */
  private stop(): void {
    if (this.intervalId) {
      clearInterval(this.intervalId);
      this.intervalId = null;
    }

    if (this.isSpinning && shouldUseColors()) {
      // Clear line and show cursor
      process.stdout.write('\r\x1B[K\x1B[?25h');
    }

    this.isSpinning = false;
  }

  /**
   * Render the current frame
   */
  private render(): void {
    if (!this.isSpinning || !shouldUseColors()) return;

    const frame = SPINNER_FRAMES[this.frameIndex];
    const spinner = colorize(frame || '⠋', colors.cyan);

    process.stdout.write(`\r${spinner} ${this.text}`);

    this.frameIndex = (this.frameIndex + 1) % SPINNER_FRAMES.length;
  }
}

/**
 * Create a new spinner instance
 */
export function createSpinner(): Spinner {
  return new Spinner();
}

/**
 * Progress bar for batch operations
 */
export interface ProgressBarOptions {
  total: number;
  width?: number;
  complete?: string;
  incomplete?: string;
}

/**
 * Create a progress bar
 */
export class ProgressBar {
  private total: number;
  private current = 0;
  private width: number;
  private complete: string;
  private incomplete: string;

  constructor(options: ProgressBarOptions) {
    this.total = options.total;
    this.width = options.width || 40;
    this.complete = options.complete || '█';
    this.incomplete = options.incomplete || '░';
  }

  /**
   * Update progress
   */
  update(current: number, text?: string): void {
    this.current = Math.min(current, this.total);
    this.render(text);
  }

  /**
   * Increment progress by 1
   */
  tick(text?: string): void {
    this.update(this.current + 1, text);
  }

  /**
   * Render the progress bar
   */
  private render(text?: string): void {
    if (!shouldUseColors()) {
      console.log(`Progress: ${this.current}/${this.total}${text ? ` - ${text}` : ''}`);
      return;
    }

    const percent = this.total > 0 ? this.current / this.total : 0;
    const completeWidth = Math.floor(percent * this.width);
    const incompleteWidth = this.width - completeWidth;

    const bar =
      colorize(this.complete.repeat(completeWidth), colors.green) +
      colorize(this.incomplete.repeat(incompleteWidth), colors.gray);

    const percentage = `${(percent * 100).toFixed(1)}%`.padStart(6);
    const counter = `${this.current}/${this.total}`.padStart(10);

    const line = `${bar} ${percentage} ${counter}${text ? ` - ${text}` : ''}`;

    process.stdout.write(`\r${line}`);

    // Move to next line when complete
    if (this.current === this.total) {
      process.stdout.write('\n');
    }
  }
}

/**
 * Create a progress bar
 */
export function createProgressBar(options: ProgressBarOptions): ProgressBar {
  return new ProgressBar(options);
}

/**
 * Format progress information
 */
export function formatProgress(current: number, total: number, text?: string): string {
  const percent = total > 0 ? ((current / total) * 100).toFixed(1) : '0.0';
  const base = `[${current}/${total}] ${percent}%`;
  return text ? `${base} - ${text}` : base;
}

/**
 * Format a table for console output
 */
export interface TableColumn {
  header: string;
  key: string;
  width?: number;
  align?: 'left' | 'right' | 'center';
  color?: string;
}

/**
 * Format table data as aligned columns
 */
export function formatTable(
  data: Record<string, any>[],
  columns: TableColumn[],
): string {
  const lines: string[] = [];

  // Calculate column widths
  const widths = columns.map(col => {
    const headerWidth = col.header.length;
    const dataWidth = Math.max(
      ...data.map(row => String(row[col.key] ?? '').length)
    );
    return col.width || Math.max(headerWidth, dataWidth);
  });

  // Format header
  const header = columns
    .map((col, i) => {
      const width = widths[i] ?? col.header.length;
      return col.header.padEnd(width);
    })
    .join('  ');

  lines.push(colorize(header, colors.bold));
  lines.push(colorize('─'.repeat(header.length), colors.dim));

  // Format rows
  for (const row of data) {
    const line = columns
      .map((col, i) => {
        const width = widths[i] ?? 0;
        const value = String(row[col.key] ?? '');
        const aligned = col.align === 'right'
          ? value.padStart(width)
          : value.padEnd(width);

        return col.color ? colorize(aligned, col.color) : aligned;
      })
      .join('  ');

    lines.push(line);
  }

  return lines.join('\n');
}

/**
 * Format summary table from extraction report
 */
export function formatSummaryTable(report: ExtractionReport): string {
  const lines: string[] = [];

  // Title
  lines.push(colorize('═'.repeat(60), colors.cyan));
  lines.push(colorize('  EXTRACTION SUMMARY', `${colors.bold}${colors.cyan}`));
  lines.push(colorize('═'.repeat(60), colors.cyan));
  lines.push('');

  // Status
  const statusColor =
    report.status === 'success' ? colors.green :
    report.status === 'partial' ? colors.yellow :
    colors.red;

  lines.push(`${colorize('Status:', colors.bold)} ${colorize(report.status.toUpperCase(), statusColor)}`);
  lines.push(`${colorize('Message:', colors.bold)} ${report.statusMessage}`);
  lines.push(`${colorize('Duration:', colors.bold)} ${report.performance.durationHuman}`);
  lines.push('');

  // Coverage
  lines.push(colorize('Widget Coverage:', `${colors.bold}${colors.cyan}`));

  const coverageData = [
    { label: 'Total Widgets', value: report.coverage.totalWidgets },
    { label: 'Extracted', value: report.coverage.extractedWidgets },
    { label: 'Failed', value: report.coverage.failedWidgets },
    { label: 'Coverage', value: `${report.coverage.coveragePercentage.toFixed(1)}%` },
  ];

  for (const item of coverageData) {
    const valueColor =
      item.label === 'Failed' ? colors.red :
      item.label === 'Extracted' ? colors.green :
      colors.white;

    lines.push(`  ${item.label.padEnd(20)} ${colorize(String(item.value), valueColor)}`);
  }
  lines.push('');

  // Issues
  lines.push(colorize('Issues:', `${colors.bold}${colors.cyan}`));

  const issuesData = [
    { label: 'Errors', value: report.errorCount, color: colors.red },
    { label: 'Warnings', value: report.warningCount, color: colors.yellow },
    { label: 'Info', value: report.infoCount, color: colors.blue },
  ];

  for (const item of issuesData) {
    lines.push(`  ${item.label.padEnd(20)} ${colorize(String(item.value), item.color)}`);
  }
  lines.push('');

  // Widget types (top 5)
  if (Object.keys(report.coverage.widgetTypes).length > 0) {
    lines.push(colorize('Top Widget Types:', `${colors.bold}${colors.cyan}`));

    const sortedTypes = Object.entries(report.coverage.widgetTypes)
      .sort(([, a], [, b]) => b.count - a.count)
      .slice(0, 5);

    for (const [type, stats] of sortedTypes) {
      const coverage = stats.count > 0
        ? ((stats.extracted / stats.count) * 100).toFixed(0)
        : '0';

      lines.push(`  ${type.padEnd(20)} ${String(stats.count).padStart(4)} (${coverage}%)`);
    }
    lines.push('');
  }

  // Footer
  lines.push(colorize('═'.repeat(60), colors.cyan));

  return lines.join('\n');
}

/**
 * Format a simple box around text
 */
export function formatBox(text: string, color?: string): string {
  const lines = text.split('\n');
  const maxLength = Math.max(...lines.map(l => l.length));
  const width = maxLength + 4;

  const top = '┌' + '─'.repeat(width - 2) + '┐';
  const bottom = '└' + '─'.repeat(width - 2) + '┘';

  const boxLines = [
    top,
    ...lines.map(line => `│ ${line.padEnd(maxLength)} │`),
    bottom,
  ];

  const boxText = boxLines.join('\n');
  return color ? colorize(boxText, color) : boxText;
}

/**
 * Format a list with bullets
 */
export function formatList(items: string[], bullet = '•'): string {
  return items.map(item => `  ${bullet} ${item}`).join('\n');
}

/**
 * Clear the console
 */
export function clearConsole(): void {
  if (shouldUseColors()) {
    process.stdout.write('\x1Bc');
  }
}

/**
 * Format bytes to human-readable size
 */
export function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 B';

  const k = 1024;
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return `${(bytes / Math.pow(k, i)).toFixed(2)} ${sizes[i]}`;
}

/**
 * Format duration in milliseconds
 */
export function formatDuration(ms: number): string {
  if (ms < 1000) return `${ms}ms`;
  if (ms < 60000) return `${(ms / 1000).toFixed(1)}s`;

  const minutes = Math.floor(ms / 60000);
  const seconds = Math.floor((ms % 60000) / 1000);
  return `${minutes}m ${seconds}s`;
}

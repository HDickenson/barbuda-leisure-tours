# Elementor Extractor Usage Guide

## Installation

```bash
npm install
npm run build
```

## CLI Usage

### Extract all pages

```bash
npm run cli extract -- \
  --url https://example.com \
  --username admin \
  --password "xxxx xxxx xxxx xxxx" \
  --output ./output/extractions
```

### Extract specific page

```bash
npm run cli extract -- \
  --url https://example.com \
  --username admin \
  --password "xxxx xxxx xxxx xxxx" \
  --page 123 \
  --output ./output/extractions
```

### Using a config file

```bash
# Generate default config
npm run cli config -- --output elementor.config.json

# Edit the config file, then use it
npm run cli extract -- --config elementor.config.json
```

### Validate config

```bash
npm run cli config -- --validate elementor.config.json
```

## Programmatic Usage

```typescript
import {
  ExtractionEngine,
  mergeConfig,
  validateConfig,
  createLogger,
} from '@barbuda/elementor-extractor';

// Create configuration
const config = mergeConfig({
  connector: 'rest-api',
  restApi: {
    baseUrl: 'https://example.com',
    username: 'admin',
    applicationPassword: 'xxxx xxxx xxxx xxxx',
  },
  extraction: {
    continueOnError: true,
    validateSchemas: true,
    extractGlobalStyles: true,
    includeProWidgets: true,
  },
  output: {
    directory: './output/extractions',
    format: 'json-pretty',
    includeReport: true,
    reportFormat: 'both',
  },
  logLevel: 'info',
});

// Validate configuration
validateConfig(config);

// Create logger
const logger = createLogger(config.logLevel);

// Create extraction engine
const engine = new ExtractionEngine(config, logger);

// Test connection
const connected = await engine.testConnection();
if (!connected) {
  throw new Error('Failed to connect to WordPress');
}

// Extract a single page
const result = await engine.extractPage(123);
if (result.success && result.page) {
  console.log(`Extracted page: ${result.page.title}`);
  console.log(`Sections: ${result.page.sections.length}`);
}

// Extract all pages
const results = await engine.extractAllPages();
console.log(`Extracted ${results.length} pages`);

// Generate report
const report = engine.generateReport(results);
console.log(`Coverage: ${report.coverage.coveragePercentage.toFixed(1)}%`);
```

## Configuration Options

### Connector Types

- `rest-api` - WordPress REST API (recommended, most portable)
- `wp-cli` - WP-CLI command-line tool (not yet implemented)
- `mysql` - Direct MySQL database access (not yet implemented)

### REST API Configuration

```typescript
{
  restApi: {
    baseUrl: string;         // WordPress site URL
    username?: string;       // WordPress username
    password?: string;       // Basic auth password
    applicationPassword?: string;  // Application password (recommended)
    timeout?: number;        // Request timeout in ms (default: 30000)
  }
}
```

### Extraction Options

```typescript
{
  extraction: {
    continueOnError: boolean;      // Continue on widget errors (default: true)
    validateSchemas: boolean;      // Validate with Zod schemas (default: true)
    extractGlobalStyles: boolean;  // Extract site-wide styles (default: true)
    includeProWidgets: boolean;    // Include Elementor Pro widgets (default: true)
    batchSize?: number;            // Widget batch size (default: 50)
    maxMemoryMB?: number;          // Max memory in MB (default: 512)
    pageIds?: number[];            // Specific page IDs (default: all)
    widgetTypes?: string[];        // Specific widget types (default: all)
  }
}
```

### Output Configuration

```typescript
{
  output: {
    directory: string;                    // Output directory path
    format: 'json' | 'json-pretty';      // JSON format
    includeReport: boolean;               // Include extraction report
    reportFormat: 'json' | 'markdown' | 'both';  // Report format
  }
}
```

## Output Structure

```
output/extractions/
├── page-123.json           # Extracted page data
├── page-456.json
├── extraction-report.json  # Extraction report (JSON)
└── extraction-report.md    # Extraction report (Markdown)
```

## Exit Codes

- `0` - Success
- `1` - General error
- `2` - Partial or failed extraction
- `3` - Validation error (not yet used)

## Examples

See the `examples/` directory for complete usage examples.

# CLI Interface Contract: Elementor Extractor

**Feature**: 001-elementor-extractor
**Date**: 2025-11-13
**Type**: Command-Line Interface

---

## Overview

The Elementor extractor exposes a CLI for extracting WordPress/Elementor data. This document defines the command structure, arguments, options, and expected behaviors.

---

## Installation & Usage

```bash
# Install globally
npm install -g @barbuda/elementor-extractor

# Or use via npx
npx @barbuda/elementor-extractor extract --help
```

---

## Commands

### `extract`

Extract Elementor data from a WordPress site.

```bash
elementor-extractor extract [options]
```

**Options**:

| Option | Alias | Type | Required | Default | Description |
|--------|-------|------|----------|---------|-------------|
| `--url` | `-u` | string | Yes | - | WordPress site URL (e.g., https://example.com) |
| `--connector` | `-c` | enum | No | `rest-api` | Data access method: `rest-api`, `wp-cli`, `database` |
| `--output` | `-o` | string | No | `./elementor-export.json` | Output file path for extracted JSON |
| `--pages` | `-p` | string[] | No | All pages | Specific page IDs or slugs to extract (comma-separated) |
| `--include-drafts` | | boolean | No | `false` | Include draft pages in extraction |
| `--verbose` | `-v` | boolean | No | `false` | Enable verbose logging |
| `--report` | `-r` | string | No | `./extraction-report.md` | Path for Markdown extraction report |
| `--auth` | `-a` | string | No | - | Authentication credentials (format depends on connector) |
| `--timeout` | `-t` | number | No | `30000` | Request timeout in milliseconds |
| `--batch-size` | `-b` | number | No | `50` | Number of widgets to process per batch |
| `--fail-fast` | | boolean | No | `false` | Stop extraction on first widget failure |
| `--validate` | | boolean | No | `true` | Run schema validation on extracted data |

**Auth Formats**:
- **REST API**: `--auth "username:password"` or `--auth "Bearer token"`
- **WP-CLI**: `--auth "/path/to/wp-cli"` (path to WP-CLI binary)
- **Database**: `--auth "host:port:user:password:database"`

**Examples**:

```bash
# Extract using REST API (default)
elementor-extractor extract --url https://example.com --output my-site.json

# Extract specific pages only
elementor-extractor extract -u https://example.com -p "home,about,contact"

# Extract using WP-CLI with verbose logging
elementor-extractor extract -u https://example.com -c wp-cli -v

# Extract with direct database access
elementor-extractor extract -u https://example.com -c database -a "localhost:3306:wpuser:pass:wp_db"

# Extract including drafts, no validation
elementor-extractor extract -u https://example.com --include-drafts --validate=false
```

**Exit Codes**:
- `0`: Success - all pages extracted without errors
- `1`: Partial success - some widgets failed (see report for details)
- `2`: Fatal error - extraction could not complete
- `3`: Validation error - extracted data failed schema validation

**Output**:

Success example:
```
✓ Connected to WordPress site: https://example.com (v6.4)
✓ Found Elementor v3.18.0
✓ Discovered 15 pages with Elementor content

Extracting pages [━━━━━━━━━━━━━━━━━━━━] 100% | 15/15 pages

✓ Extracted 15 pages, 127 sections, 384 columns, 1,247 widgets
✓ Validation passed (100% completeness)
✓ Output written to: ./elementor-export.json
✓ Report written to: ./extraction-report.md

Completed in 18.3s
```

Partial failure example:
```
⚠ Warning: 3 widgets failed to extract
✓ Extracted 14/15 pages successfully
✗ Page "Contact" (ID: 42) - 3 widgets failed
  - Widget heading:abc123 - Unknown widget type "custom-heading-pro"
  - Widget form:def456 - Missing required field "form_fields"
  - Widget slider:ghi789 - Invalid image URL

⚠ Output written to: ./elementor-export.json (partial data)
⚠ See report for details: ./extraction-report.md

Completed in 21.7s (exit code 1)
```

---

### `validate`

Validate extracted JSON against schema (without re-extracting).

```bash
elementor-extractor validate [options]
```

**Options**:

| Option | Alias | Type | Required | Default | Description |
|--------|-------|------|----------|---------|-------------|
| `--input` | `-i` | string | Yes | - | Path to extracted JSON file |
| `--schema` | `-s` | string | No | Built-in | Path to custom Zod schema file |
| `--strict` | | boolean | No | `false` | Enable strict validation (no unknown properties) |
| `--report` | `-r` | string | No | `./validation-report.md` | Path for validation report |

**Examples**:

```bash
# Validate extracted data
elementor-extractor validate -i my-site.json

# Validate with strict mode
elementor-extractor validate -i my-site.json --strict

# Validate with custom schema
elementor-extractor validate -i my-site.json -s ./custom-schema.ts
```

**Exit Codes**:
- `0`: Valid - all data passes schema validation
- `1`: Invalid - validation errors found
- `2`: Fatal error - cannot read input file or schema

---

### `list-widgets`

List all supported Elementor widget types.

```bash
elementor-extractor list-widgets [options]
```

**Options**:

| Option | Alias | Type | Required | Default | Description |
|--------|-------|------|----------|---------|-------------|
| `--pro` | | boolean | No | `false` | Show only Pro widgets |
| `--free` | | boolean | No | `false` | Show only Free widgets |
| `--format` | `-f` | enum | No | `table` | Output format: `table`, `json`, `csv` |

**Examples**:

```bash
# List all widgets
elementor-extractor list-widgets

# List only Pro widgets as JSON
elementor-extractor list-widgets --pro -f json
```

**Output** (table format):
```
Elementor Free Widgets (15):
┌─────────────────┬──────────────────────────────────────┬─────────┐
│ Widget Type     │ Description                          │ Support │
├─────────────────┼──────────────────────────────────────┼─────────┤
│ heading         │ Text headings (H1-H6)                │ ✓ Full  │
│ text-editor     │ Rich text content                    │ ✓ Full  │
│ image           │ Image widget                         │ ✓ Full  │
│ button          │ Call-to-action buttons               │ ✓ Full  │
│ spacer          │ Vertical spacing                     │ ✓ Full  │
│ divider         │ Horizontal dividers                  │ ✓ Full  │
│ video           │ Video embeds                         │ ✓ Full  │
│ ...             │ ...                                  │ ...     │
└─────────────────┴──────────────────────────────────────┴─────────┘

Elementor Pro Widgets (20):
┌─────────────────┬──────────────────────────────────────┬─────────┐
│ Widget Type     │ Description                          │ Support │
├─────────────────┼──────────────────────────────────────┼─────────┤
│ form            │ Contact/lead forms                   │ ✓ Full  │
│ posts           │ WordPress posts grid                 │ ✓ Full  │
│ portfolio       │ Portfolio/gallery                    │ ⚠ Partial│
│ slider          │ Advanced slider                      │ ✓ Full  │
│ ...             │ ...                                  │ ...     │
└─────────────────┴──────────────────────────────────────┴─────────┘
```

---

### `config`

Manage extractor configuration.

```bash
elementor-extractor config [action] [options]
```

**Actions**:
- `init`: Create a configuration file
- `get <key>`: Get configuration value
- `set <key> <value>`: Set configuration value
- `list`: List all configuration values

**Examples**:

```bash
# Create default config file (.elementor-extractor.json)
elementor-extractor config init

# Set default connector
elementor-extractor config set connector wp-cli

# Get current timeout setting
elementor-extractor config get timeout

# List all config
elementor-extractor config list
```

**Configuration File** (`.elementor-extractor.json`):
```json
{
  "connector": "rest-api",
  "timeout": 30000,
  "batchSize": 50,
  "validate": true,
  "verbose": false,
  "failFast": false,
  "auth": {
    "rest-api": "username:password",
    "wp-cli": "/usr/local/bin/wp",
    "database": null
  }
}
```

---

## Global Options

These options work with all commands:

| Option | Alias | Description |
|--------|-------|-------------|
| `--help` | `-h` | Show help for command |
| `--version` | `-V` | Show extractor version |
| `--config` | | Path to custom config file |
| `--no-color` | | Disable colored output |
| `--quiet` | `-q` | Suppress all output except errors |

---

## Environment Variables

The CLI respects these environment variables:

| Variable | Description | Example |
|----------|-------------|---------|
| `ELEMENTOR_EXTRACTOR_CONNECTOR` | Default connector | `rest-api` |
| `ELEMENTOR_EXTRACTOR_TIMEOUT` | Default timeout (ms) | `30000` |
| `ELEMENTOR_EXTRACTOR_AUTH` | Default auth credentials | `username:password` |
| `ELEMENTOR_EXTRACTOR_VERBOSE` | Enable verbose logging | `true` |
| `NO_COLOR` | Disable colored output | `1` |

---

## JSON Output Schema

The `--output` file follows this structure:

```json
{
  "version": "1.0.0",
  "extractedAt": "2025-11-13T10:30:00Z",
  "source": {
    "site": "https://example.com",
    "wordPressVersion": "6.4",
    "elementorVersion": "3.18.0",
    "elementorProVersion": "3.18.1"
  },
  "pages": [
    {
      "id": 123,
      "title": "Home",
      "url": "https://example.com/",
      "sections": [ /* ... */ ]
    }
  ],
  "globalStyles": [ /* ... */ ],
  "report": {
    "stats": { /* ... */ },
    "results": { /* ... */ },
    "failures": [ /* ... */ ]
  }
}
```

See [data-model.md](../data-model.md) for complete schema.

---

## Markdown Report Schema

The `--report` file follows this structure:

````markdown
# Elementor Extraction Report

**Date**: 2025-11-13T10:30:00Z
**Site**: https://example.com
**Duration**: 18.3s

## Summary

- **Pages Extracted**: 15/15 (100%)
- **Total Widgets**: 1,247
- **Failed Widgets**: 0
- **Validation**: ✓ PASSED (100% completeness)

## Statistics

| Metric | Count |
|--------|-------|
| Sections | 127 |
| Columns | 384 |
| Widgets | 1,247 |

### Widget Type Breakdown

| Widget Type | Count | Status |
|-------------|-------|--------|
| heading | 143 | ✓ |
| text-editor | 256 | ✓ |
| image | 198 | ✓ |
| button | 87 | ✓ |
| ... | ... | ... |

## Pages

### ✓ Home (ID: 123)
- **URL**: https://example.com/
- **Widgets**: 89
- **Status**: Success

### ✓ About (ID: 124)
- **URL**: https://example.com/about
- **Widgets**: 67
- **Status**: Success

## Failures

_None_

## Environment

- **Extractor Version**: 1.0.0
- **Node.js**: v20.10.0
- **Connector**: rest-api
- **WordPress**: 6.4
- **Elementor**: 3.18.0
````

---

## Error Handling

### Common Errors

**Connection Errors**:
```
✗ Error: Cannot connect to WordPress site
  URL: https://example.com
  Reason: Connection refused (ECONNREFUSED)

Suggestions:
- Check if the site is accessible
- Verify URL is correct (include https://)
- Check firewall/network settings
```

**Authentication Errors**:
```
✗ Error: Authentication failed
  Connector: rest-api
  Reason: Invalid credentials (HTTP 401)

Suggestions:
- Verify username and password are correct
- Check if REST API is enabled on WordPress
- Try generating an application password
```

**Data Errors**:
```
✗ Error: Invalid Elementor data
  Page ID: 123
  Reason: Cannot unserialize post meta '_elementor_data'

Suggestions:
- Page may be corrupted in WordPress
- Try re-saving the page in Elementor editor
- Check WordPress database integrity
```

---

## Programmatic API

The extractor can also be used as a library:

```typescript
import { ElementorExtractor } from '@barbuda/elementor-extractor';

const extractor = new ElementorExtractor({
  url: 'https://example.com',
  connector: 'rest-api',
  auth: 'username:password',
});

const result = await extractor.extract({
  pages: ['home', 'about'],
  includeDrafts: false,
});

console.log(result.pages.length); // 2
console.log(result.report.stats.totalWidgets); // 156

// Save to file
await extractor.saveToFile('./output.json');
await extractor.saveReport('./report.md');
```

See TypeScript API documentation for complete reference.

---

## Testing the CLI

Example test scenarios:

```bash
# Test with sample WordPress site
elementor-extractor extract -u https://demo.elementor.com -o demo-export.json -v

# Test validation only
elementor-extractor validate -i demo-export.json --strict

# Test widget listing
elementor-extractor list-widgets --format json > widgets.json
```

---

## Version History

- **v1.0.0** (2025-11-13): Initial CLI interface

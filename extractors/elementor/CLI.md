# Elementor Extractor CLI

Command-line interface for extracting Elementor page builder data from WordPress sites.

## Installation

### Global Installation

```bash
npm install -g @barbuda/elementor-extractor
```

### Local Installation

```bash
npm install @barbuda/elementor-extractor
```

Then use via npx:

```bash
npx elementor-extract --help
```

### From Source

```bash
cd extractors/elementor
npm install
npm run build
npm link

# Now you can use globally
elementor-extract --help
```

## Quick Start

### Extract a Single Page

```bash
elementor-extract extract page 42 \
  --url https://example.com \
  --username admin \
  --password your-app-password
```

### Extract All Pages

```bash
elementor-extract extract all \
  --url https://example.com \
  --username admin \
  --password your-app-password \
  --output ./my-extractions
```

### Using a Config File

```bash
# Create a config file
elementor-extract config --init -o my-config.json

# Edit my-config.json with your settings

# Use the config file
elementor-extract extract all --config my-config.json
```

## Commands

### `extract page <id>`

Extract a single page by ID.

**Arguments:**
- `<id>` - WordPress page ID

**Options:**
- `--url <url>` - WordPress site URL (required)
- `--auth-type <type>` - Authentication type: `basic`, `app-password`, `jwt` (default: `app-password`)
- `--username <username>` - WordPress username
- `--password <password>` - WordPress password or application password
- `--token <token>` - JWT token (if using jwt auth)
- `-o, --output <path>` - Output directory (default: `./output`)
- `--format <format>` - Report format: `json`, `md`, `html`, `all` (default: `json`)
- `--verbose` - Enable verbose logging
- `--validate-only` - Only validate, don't extract
- `--config <file>` - Load configuration from file

**Example:**
```bash
elementor-extract extract page 42 \
  --url https://mysite.com \
  --username admin \
  --password xxxx-xxxx-xxxx-xxxx \
  --output ./output \
  --format html
```

### `extract slug <slug>`

Extract a page by slug (URL slug).

**Note:** Slug extraction is planned for a future release. Currently, please use page ID instead.

**Arguments:**
- `<slug>` - Page slug

**Options:** Same as `extract page`

### `extract all`

Extract all Elementor pages from the WordPress site.

**Options:**
- `--url <url>` - WordPress site URL (required)
- `--auth-type <type>` - Authentication type: `basic`, `app-password`, `jwt` (default: `app-password`)
- `--username <username>` - WordPress username
- `--password <password>` - WordPress password or application password
- `--token <token>` - JWT token (if using jwt auth)
- `-o, --output <path>` - Output directory (default: `./output`)
- `--format <format>` - Report format: `json`, `md`, `html`, `all` (default: `json`)
- `--parallel` - Enable parallel processing (planned feature)
- `--batch-size <size>` - Batch size for parallel processing (default: `5`)
- `--verbose` - Enable verbose logging
- `--validate-only` - Only validate, don't extract
- `--config <file>` - Load configuration from file

**Example:**
```bash
elementor-extract extract all \
  --url https://mysite.com \
  --username admin \
  --password xxxx-xxxx-xxxx-xxxx \
  --format all \
  --output ./all-pages
```

### `extract batch <ids...>`

Extract multiple pages by IDs (space-separated).

**Arguments:**
- `<ids...>` - Space-separated list of page IDs

**Options:** Same as `extract all`

**Example:**
```bash
elementor-extract extract batch 42 43 44 45 \
  --url https://mysite.com \
  --username admin \
  --password xxxx-xxxx-xxxx-xxxx
```

### `config`

Manage configuration files.

**Options:**
- `--init` - Initialize a new config file
- `--validate <file>` - Validate a config file
- `-o, --output <path>` - Output path for config file (default: `./elementor-extract.config.json`)

**Examples:**

Create a new config file:
```bash
elementor-extract config --init
```

Create config with custom name:
```bash
elementor-extract config --init -o production.config.json
```

Validate a config file:
```bash
elementor-extract config --validate my-config.json
```

### `test`

Test connection to WordPress.

**Options:**
- `--url <url>` - WordPress site URL (required)
- `--auth-type <type>` - Authentication type
- `--username <username>` - WordPress username
- `--password <password>` - WordPress password
- `--token <token>` - JWT token
- `--config <file>` - Load configuration from file

**Example:**
```bash
elementor-extract test \
  --url https://mysite.com \
  --username admin \
  --password xxxx-xxxx-xxxx-xxxx
```

### Global Options

- `-v, --version` - Output the current version
- `-h, --help` - Display help for command

## Configuration

### Config File Format

Configuration files use JSON format. See `config.example.json` for a complete example.

```json
{
  "connector": "rest-api",
  "restApi": {
    "baseUrl": "https://example.com",
    "username": "admin",
    "applicationPassword": "xxxx-xxxx-xxxx-xxxx"
  },
  "extraction": {
    "continueOnError": true,
    "validateSchemas": true,
    "extractGlobalStyles": true,
    "includeProWidgets": true,
    "batchSize": 50,
    "maxMemoryMB": 512
  },
  "output": {
    "directory": "./output/extractions",
    "format": "json-pretty",
    "includeReport": true,
    "reportFormat": "both"
  },
  "logLevel": "info"
}
```

### Configuration Precedence

Configuration is merged in the following order (later takes precedence):

1. Default values
2. Configuration file (if provided)
3. Environment variables
4. Command-line arguments

### Environment Variables

You can use environment variables to configure the extractor:

```bash
# WordPress Connection
export ELEMENTOR_WP_URL=https://example.com
export ELEMENTOR_WP_USERNAME=admin
export ELEMENTOR_WP_PASSWORD=xxxx-xxxx-xxxx-xxxx

# Output Settings
export ELEMENTOR_OUTPUT_DIR=./output

# Logging
export ELEMENTOR_LOG_LEVEL=info
export ELEMENTOR_LOG_FILE=./logs/extractor.log

# Extraction Options
export ELEMENTOR_CONTINUE_ON_ERROR=true
export ELEMENTOR_VALIDATE_SCHEMAS=true
```

See `.env.example` for a complete list.

## Authentication

### Application Password (Recommended)

WordPress Application Passwords are the recommended authentication method.

1. In WordPress admin, go to Users > Your Profile
2. Scroll down to "Application Passwords"
3. Enter a name (e.g., "Elementor Extractor")
4. Click "Add New Application Password"
5. Copy the generated password (format: `xxxx xxxx xxxx xxxx`)
6. Use this password with `--auth-type app-password`

```bash
elementor-extract extract all \
  --url https://mysite.com \
  --username admin \
  --password "xxxx xxxx xxxx xxxx" \
  --auth-type app-password
```

### Basic Authentication

Basic authentication uses your regular WordPress password.

```bash
elementor-extract extract all \
  --url https://mysite.com \
  --username admin \
  --password your-wordpress-password \
  --auth-type basic
```

### JWT (Planned)

JWT authentication will be supported in a future release.

## Output Formats

### JSON (Default)

Machine-readable JSON format.

```bash
--format json
```

Output:
- `page-{id}.json` - Individual page data
- `extraction-report.json` - Extraction report

### Markdown

Human-readable markdown reports.

```bash
--format md
```

Output:
- `page-{id}.json` - Individual page data
- `extraction-report.md` - Extraction report

### HTML

Styled HTML reports.

```bash
--format html
```

Output:
- `page-{id}.json` - Individual page data
- `extraction-report.html` - Extraction report

### All Formats

Generate all report formats.

```bash
--format all
```

Output:
- `page-{id}.json` - Individual page data
- `extraction-report.json` - JSON report
- `extraction-report.md` - Markdown report
- `extraction-report.html` - HTML report

## Exit Codes

The CLI uses the following exit codes:

- `0` - Success (all pages extracted successfully)
- `1` - Partial success (some pages failed)
- `2` - Failure (all pages failed or critical error)

This makes it easy to use in CI/CD pipelines:

```bash
#!/bin/bash
elementor-extract extract all --config production.json

if [ $? -eq 0 ]; then
  echo "Extraction successful"
  # Continue with next steps
else
  echo "Extraction failed"
  exit 1
fi
```

## Progress Indicators

The CLI provides visual feedback during extraction:

### Spinner

Long-running operations show a spinner:

```
⠋ Connecting to WordPress...
⠙ Extracting all pages...
```

### Progress Information

Batch operations show progress:

```
✓ Connected to WordPress
Extracting page 42 (1/5)...
✓ Extracted page 42
Extracting page 43 (2/5)...
✓ Extracted page 43
...
✓ Extracted 5/5 pages in 12.3s
```

### Summary Tables

After extraction, a summary table is displayed:

```
════════════════════════════════════════════════════════════
  EXTRACTION SUMMARY
════════════════════════════════════════════════════════════

Status: SUCCESS
Message: Extracted 5/5 pages successfully
Duration: 12.3s

Widget Coverage:
  Total Widgets       42
  Extracted           40
  Failed              2
  Coverage            95.2%

Issues:
  Errors              0
  Warnings            2
  Info                5

Top Widget Types:
  heading             15 (100%)
  image               10 (100%)
  text-editor         8 (87%)
  button              5 (100%)
  divider             4 (100%)

════════════════════════════════════════════════════════════
```

## Verbose Mode

Enable verbose logging with `--verbose`:

```bash
elementor-extract extract all --verbose --config my-config.json
```

This outputs detailed debug information useful for troubleshooting.

## CI/CD Usage

### GitHub Actions

```yaml
name: Extract Elementor Data

on:
  schedule:
    - cron: '0 2 * * *'  # Daily at 2 AM
  workflow_dispatch:

jobs:
  extract:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3

      - uses: actions/setup-node@v3
        with:
          node-version: '20'

      - name: Install Elementor Extractor
        run: npm install -g @barbuda/elementor-extractor

      - name: Extract Data
        env:
          ELEMENTOR_WP_URL: ${{ secrets.WP_URL }}
          ELEMENTOR_WP_USERNAME: ${{ secrets.WP_USERNAME }}
          ELEMENTOR_WP_PASSWORD: ${{ secrets.WP_PASSWORD }}
        run: |
          elementor-extract extract all \
            --output ./extracted-data \
            --format all

      - name: Upload Artifacts
        uses: actions/upload-artifact@v3
        with:
          name: elementor-data
          path: ./extracted-data
```

### Docker

```dockerfile
FROM node:20-alpine

# Install extractor
RUN npm install -g @barbuda/elementor-extractor

# Copy config
COPY config.json /app/config.json

WORKDIR /app

# Run extraction
CMD ["elementor-extract", "extract", "all", "--config", "/app/config.json"]
```

## Troubleshooting

### Connection Failures

If you get connection errors:

1. Test the connection first:
   ```bash
   elementor-extract test --url https://mysite.com --username admin --password xxxx
   ```

2. Check your WordPress URL is correct (include https://)

3. Verify your credentials are correct

4. Ensure WordPress REST API is enabled

### Authentication Errors

If you get authentication errors:

1. Make sure you're using Application Passwords (recommended)
2. Check your username is correct
3. Verify the password doesn't have extra spaces
4. Try regenerating the application password

### Memory Issues

If you run out of memory on large sites:

1. Reduce batch size: `--batch-size 10`
2. Increase max memory in config:
   ```json
   {
     "extraction": {
       "maxMemoryMB": 1024
     }
   }
   ```

### Validation Failures

If validation fails:

1. Use `--verbose` to see detailed errors
2. Disable validation temporarily: Set `validateSchemas: false` in config
3. Check the extraction report for specific issues

## Examples

### Production Extraction

```bash
# Create production config
elementor-extract config --init -o production.json

# Edit production.json with your settings

# Run extraction
elementor-extract extract all \
  --config production.json \
  --format all \
  --output ./production-data
```

### Development/Testing

```bash
# Extract single page for testing
elementor-extract extract page 42 \
  --url https://staging.mysite.com \
  --username admin \
  --password xxxx \
  --verbose \
  --output ./test-data
```

### Scheduled Extraction

Create a cron job to extract daily:

```bash
# Add to crontab
0 2 * * * /usr/local/bin/elementor-extract extract all --config /path/to/config.json --output /path/to/output
```

## Support

For issues, questions, or contributions:

- GitHub: https://github.com/barbuda/elementor-extractor
- Documentation: https://barbuda.dev/docs/elementor-extractor
- Issues: https://github.com/barbuda/elementor-extractor/issues

## License

MIT License - see LICENSE file for details.

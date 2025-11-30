# Quick Start Guide

## Installation

```bash
cd extractors/elementor
npm install
npm run build
```

## Test the CLI

```bash
# Show help
node dist/cli/index.js --help

# Show version
node dist/cli/index.js --version

# Test connection
node dist/cli/index.js test \
  --url https://your-wordpress-site.com \
  --username admin \
  --password your-app-password
```

## Extract a Single Page

```bash
node dist/cli/index.js extract page 42 \
  --url https://your-wordpress-site.com \
  --username admin \
  --password your-app-password \
  --output ./my-output
```

## Extract All Pages

```bash
node dist/cli/index.js extract all \
  --url https://your-wordpress-site.com \
  --username admin \
  --password your-app-password \
  --output ./my-output \
  --format all
```

## Using a Config File

1. Generate a config file:
```bash
node dist/cli/index.js config --init -o my-config.json
```

2. Edit `my-config.json` with your settings:
```json
{
  "connector": "rest-api",
  "restApi": {
    "baseUrl": "https://your-wordpress-site.com",
    "username": "admin",
    "applicationPassword": "your-app-password"
  },
  "extraction": {
    "continueOnError": true,
    "validateSchemas": true,
    "extractGlobalStyles": true,
    "includeProWidgets": true
  },
  "output": {
    "directory": "./output",
    "format": "json-pretty",
    "includeReport": true,
    "reportFormat": "both"
  },
  "logLevel": "info"
}
```

3. Run extraction with config:
```bash
node dist/cli/index.js extract all --config my-config.json
```

## Install Globally (Optional)

```bash
npm link

# Now you can use it anywhere:
elementor-extract --help
elementor-extract extract all --config my-config.json
```

## Output

After extraction, you'll find:

- `output/page-{id}.json` - Individual page data
- `output/extraction-report.json` - JSON report
- `output/extraction-report.md` - Markdown report
- `output/extraction-report.html` - HTML report (if format is 'all' or 'html')

## Getting WordPress Application Password

1. Log into WordPress admin
2. Go to **Users → Your Profile**
3. Scroll down to **Application Passwords**
4. Enter a name (e.g., "Elementor Extractor")
5. Click **Add New Application Password**
6. Copy the generated password (format: `xxxx xxxx xxxx xxxx`)
7. Use this password in your CLI commands or config file

## Common Commands

```bash
# Extract specific pages
node dist/cli/index.js extract batch 42 43 44 --config my-config.json

# Extract with verbose logging
node dist/cli/index.js extract all --config my-config.json --verbose

# Validate config file
node dist/cli/index.js config --validate my-config.json

# Test connection only
node dist/cli/index.js test --config my-config.json
```

## Next Steps

See [CLI.md](./CLI.md) for complete documentation.

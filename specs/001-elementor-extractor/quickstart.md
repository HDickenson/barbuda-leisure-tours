# Quickstart Guide: Elementor Page Builder Extractor

**Feature**: 001-elementor-extractor
**Date**: 2025-11-13
**Purpose**: Get started with the Elementor extractor in under 5 minutes

---

## Prerequisites

- **Node.js**: 20 LTS or higher
- **WordPress Site**: With Elementor installed (3.0+)
- **Access**: One of the following:
  - WordPress REST API access (username/password or application password)
  - SSH access to WordPress server (for WP-CLI)
  - Direct MySQL database access

---

## Quick Start (3 Steps)

### Step 1: Install

```bash
npm install -g @barbuda/elementor-extractor
```

### Step 2: Extract

```bash
elementor-extractor extract --url https://your-wordpress-site.com --output my-site.json
```

You'll be prompted for WordPress credentials if not provided.

### Step 3: Verify

```bash
elementor-extractor validate --input my-site.json
```

Done! Your Elementor data is now in `my-site.json`.

---

## Installation Methods

### Global Installation (Recommended)

```bash
npm install -g @barbuda/elementor-extractor
```

Provides the `elementor-extractor` command globally.

### Local Project Installation

```bash
npm install @barbuda/elementor-extractor --save-dev
```

Use via `npx`:
```bash
npx elementor-extractor extract --url https://example.com
```

### From Source (Development)

```bash
git clone https://github.com/barbuda/elementor-extractor.git
cd elementor-extractor
npm install
npm run build
npm link
```

---

## First Extraction

### Using REST API (Most Common)

```bash
elementor-extractor extract \
  --url https://example.com \
  --auth "admin:your-password" \
  --output my-site.json \
  --report extraction-report.md
```

**Tip**: Use WordPress Application Passwords for better security:
1. Go to WordPress Admin → Users → Profile
2. Scroll to "Application Passwords"
3. Generate new password for "Elementor Extractor"
4. Use generated password in `--auth`

### Using WP-CLI (Server Environments)

```bash
elementor-extractor extract \
  --url https://example.com \
  --connector wp-cli \
  --auth "/usr/local/bin/wp" \
  --output my-site.json
```

### Using Direct Database (Advanced)

```bash
elementor-extractor extract \
  --url https://example.com \
  --connector database \
  --auth "localhost:3306:wpuser:password:wp_database" \
  --output my-site.json
```

---

## Common Scenarios

### Extract Specific Pages Only

```bash
elementor-extractor extract \
  --url https://example.com \
  --pages "home,about,contact,services" \
  --output selected-pages.json
```

### Extract with Verbose Logging

```bash
elementor-extractor extract \
  --url https://example.com \
  --verbose \
  --output my-site.json
```

Useful for debugging connection issues or understanding what's being extracted.

### Extract Including Draft Pages

```bash
elementor-extractor extract \
  --url https://example.com \
  --include-drafts \
  --output with-drafts.json
```

### Extract Large Site (200+ widgets per page)

```bash
elementor-extractor extract \
  --url https://example.com \
  --batch-size 50 \
  --timeout 60000 \
  --output large-site.json
```

---

## Configuration File (Optional)

Create `.elementor-extractor.json` in your project root to avoid repeating options:

```json
{
  "connector": "rest-api",
  "timeout": 30000,
  "batchSize": 50,
  "validate": true,
  "verbose": false,
  "auth": {
    "rest-api": "admin:your-app-password"
  }
}
```

Then run simply:
```bash
elementor-extractor extract --url https://example.com
```

Generate config interactively:
```bash
elementor-extractor config init
```

---

## Understanding the Output

### JSON Structure

The extracted `my-site.json` contains:

```json
{
  "version": "1.0.0",
  "extractedAt": "2025-11-13T10:30:00Z",
  "source": {
    "site": "https://example.com",
    "wordPressVersion": "6.4",
    "elementorVersion": "3.18.0"
  },
  "pages": [
    {
      "id": 123,
      "title": "Home",
      "sections": [
        {
          "columns": [
            {
              "widgets": [
                {
                  "widgetType": "heading",
                  "content": { "title": "Welcome" }
                }
              ]
            }
          ]
        }
      ]
    }
  ],
  "globalStyles": [ /* ... */ ],
  "report": { /* extraction statistics */ }
}
```

### Extraction Report

The `extraction-report.md` provides:
- Summary statistics (pages, widgets, sections)
- Widget type breakdown
- Success/failure details
- Performance metrics
- Warnings and errors

Example:
```markdown
# Elementor Extraction Report

**Pages Extracted**: 15/15 (100%)
**Total Widgets**: 1,247
**Duration**: 18.3s

## Widget Type Breakdown
- heading: 143
- text-editor: 256
- image: 198
```

---

## Validation

### Validate Extracted Data

```bash
elementor-extractor validate --input my-site.json
```

Output:
```
✓ Schema validation passed
✓ All pages valid
✓ All widgets valid
✓ Completeness: 100%

No issues found.
```

### Strict Validation

```bash
elementor-extractor validate --input my-site.json --strict
```

Strict mode rejects any unknown properties (useful for ensuring data quality).

---

## Troubleshooting

### Connection Issues

**Problem**: `Cannot connect to WordPress site`

**Solutions**:
1. Check URL is correct (include `https://`)
2. Verify site is accessible: `curl https://example.com`
3. Check firewall rules
4. Try adding `/wp-json` to test REST API: `curl https://example.com/wp-json`

### Authentication Issues

**Problem**: `Authentication failed (HTTP 401)`

**Solutions**:
1. Verify credentials are correct
2. Check if REST API is enabled in WordPress
3. Try generating an Application Password
4. Check if your user has admin/editor permissions

### Elementor Not Found

**Problem**: `No Elementor data found on site`

**Solutions**:
1. Verify Elementor plugin is installed and activated
2. Check if pages actually use Elementor (not WordPress block editor)
3. Try specifying page IDs directly: `--pages "123,456"`

### Extraction Timeouts

**Problem**: `Request timeout exceeded`

**Solutions**:
1. Increase timeout: `--timeout 60000` (60 seconds)
2. Reduce batch size: `--batch-size 25`
3. Extract specific pages instead of all: `--pages "home,about"`

### Partial Extraction Failures

**Problem**: `3 widgets failed to extract`

**What it means**: Most of the site extracted successfully, but a few widgets failed (likely custom or deprecated widgets).

**Action**: Check the extraction report for details:
```bash
cat extraction-report.md
```

The report will show which widgets failed and why.

---

## Next Steps

### 1. Inspect Extracted Data

```bash
# View summary
jq '.report.stats' my-site.json

# List all pages
jq '.pages[] | {id, title, url}' my-site.json

# Count widgets by type
jq '.report.stats.widgetTypeBreakdown' my-site.json
```

### 2. Transform to Next.js (Downstream)

The extracted JSON is input for the Next.js transformer component (separate feature):

```bash
# Next step in pipeline (not part of this extractor)
nextjs-transformer transform --input my-site.json --output nextjs-app/
```

### 3. Compare Visual Fidelity (Downstream)

Use visual regression testing to verify pixel-perfect conversion:

```bash
# Visual validation (not part of this extractor)
visual-validator compare \
  --source https://example.com \
  --generated ./nextjs-app \
  --report visual-diff.html
```

---

## Sample WordPress Sites for Testing

Test the extractor against these public Elementor demo sites:

1. **Elementor Official Demo**: https://demo.elementor.com
2. **Astra Theme Demos**: https://demos.wpastra.com/
3. **OceanWP Demos**: https://oceanwp.org/demos/

Example:
```bash
elementor-extractor extract --url https://demo.elementor.com --output demo-test.json
```

---

## Development Setup (For Contributors)

### Clone and Build

```bash
git clone https://github.com/barbuda/elementor-extractor.git
cd elementor-extractor
npm install
npm run build
```

### Run Tests

```bash
# Unit tests
npm run test:unit

# Integration tests (requires Docker)
npm run test:integration

# All tests
npm test
```

### Local WordPress for Testing

Use Docker to spin up a local WordPress with Elementor:

```bash
# Start WordPress + Elementor
npm run test:wordpress:start

# Extract from local WordPress
elementor-extractor extract --url http://localhost:8080 --output test-local.json

# Stop WordPress
npm run test:wordpress:stop
```

---

## Performance Benchmarks

Expected extraction times (on average hardware):

| Pages | Widgets | Time | Memory |
|-------|---------|------|--------|
| 1 | 10 | <2s | <100MB |
| 10 | 100 | <10s | <200MB |
| 50 | 500 | <30s | <300MB |
| 100 | 1000 | <60s | <400MB |
| 200 | 2000 | <120s | <512MB |

**Note**: Times assume reasonable network latency and WordPress server performance.

---

## FAQ

### Q: Does this work with Elementor Free or do I need Pro?

**A**: Works with both Elementor Free and Pro. Pro widgets require Pro to be installed on the WordPress site.

### Q: Will this modify my WordPress site?

**A**: No, the extractor is read-only. It does not modify any WordPress data.

### Q: What Elementor version is supported?

**A**: Elementor 3.0+ is supported. Older versions may work but are untested.

### Q: Can I extract from multiple sites in batch?

**A**: Yes, write a shell script:
```bash
#!/bin/bash
sites=("site1.com" "site2.com" "site3.com")
for site in "${sites[@]}"; do
  elementor-extractor extract --url "https://$site" --output "$site.json"
done
```

### Q: Does this extract WordPress content or only Elementor?

**A**: Only Elementor page builder data. WordPress posts, pages without Elementor, and other content are not extracted.

### Q: Can I use this in CI/CD?

**A**: Yes, the CLI is designed for automation. Use `--quiet` mode and check exit codes.

---

## Support

- **Documentation**: [Full API docs](https://github.com/barbuda/elementor-extractor/docs)
- **Issues**: [GitHub Issues](https://github.com/barbuda/elementor-extractor/issues)
- **Discussions**: [GitHub Discussions](https://github.com/barbuda/elementor-extractor/discussions)

---

## Version

This quickstart is for **v1.0.0** of the Elementor extractor.

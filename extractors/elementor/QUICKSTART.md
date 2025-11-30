# Quick Start Guide

Get started with the Elementor Extractor in 5 minutes!

## 1. Install Dependencies

```bash
cd extractors/elementor
npm install
```

## 2. Build the Project

```bash
npm run build
```

## 3. Extract Your First Page

### Option A: Using CLI (Easiest)

```bash
npm run cli extract -- \
  --url https://your-wordpress-site.com \
  --username your-username \
  --password "xxxx xxxx xxxx xxxx" \
  --page 123 \
  --output ./output/extractions
```

Replace:
- `https://your-wordpress-site.com` - Your WordPress site URL
- `your-username` - Your WordPress username
- `xxxx xxxx xxxx xxxx` - Your WordPress Application Password ([How to create](https://make.wordpress.org/core/2020/11/05/application-passwords-integration-guide/))
- `123` - The page ID you want to extract

### Option B: Using Config File

```bash
# Generate default config
npm run cli config -- --output elementor.config.json

# Edit elementor.config.json with your site details

# Run extraction
npm run cli extract -- --config elementor.config.json
```

### Option C: Programmatically

```typescript
import { ExtractionEngine, mergeConfig, createLogger } from '@barbuda/elementor-extractor';

const config = mergeConfig({
  connector: 'rest-api',
  restApi: {
    baseUrl: 'https://your-wordpress-site.com',
    username: 'your-username',
    applicationPassword: 'xxxx xxxx xxxx xxxx',
  },
  output: {
    directory: './output/extractions',
    format: 'json-pretty',
    includeReport: true,
    reportFormat: 'both',
  },
  logLevel: 'info',
});

const logger = createLogger(config.logLevel);
const engine = new ExtractionEngine(config, logger);

// Extract page 123
const result = await engine.extractPage(123);

if (result.success && result.page) {
  console.log(`✓ Extracted: ${result.page.title}`);
  console.log(`  Sections: ${result.page.sections.length}`);

  // Save to file
  await fs.writeFile(
    `./output/page-${result.page.id}.json`,
    JSON.stringify(result.page, null, 2)
  );
}
```

## 4. View the Results

Check the `output/extractions/` directory for:

- `page-123.json` - Extracted page data
- `extraction-report.json` - Quality metrics
- `extraction-report.md` - Human-readable report

## 5. Next Steps

### Extract All Pages

```bash
npm run cli extract -- \
  --url https://your-wordpress-site.com \
  --username your-username \
  --password "xxxx xxxx xxxx xxxx" \
  --output ./output/extractions
```

This will extract all pages that use Elementor.

### Run Tests

```bash
npm test
```

### Customize Configuration

Edit `elementor.config.json` to:
- Change output format
- Enable/disable schema validation
- Configure batch sizes
- Set log levels
- And more!

See [USAGE.md](USAGE.md) for complete configuration options.

## Common Issues

### "Failed to connect to WordPress"
- Check your site URL (should include `https://`)
- Verify your username and password
- Ensure REST API is enabled on your WordPress site
- Check if the site is accessible from your network

### "No Elementor data found"
- Verify the page ID is correct
- Ensure the page uses Elementor (not Classic Editor)
- Check if Elementor is installed and activated

### "Authentication failed"
- Use Application Passwords (not your regular password)
- Create application password: WordPress Admin → Users → Profile → Application Passwords
- Make sure you copy the password correctly (includes spaces)

## Need Help?

- Read the [USAGE.md](USAGE.md) for detailed documentation
- Check [PROJECT_SUMMARY.md](PROJECT_SUMMARY.md) for architecture details
- Review the test files for usage examples
- See the specification in `../../specs/001-elementor-extractor/`

## Success Checklist

- [x] Dependencies installed (`npm install`)
- [x] Project builds (`npm run build`)
- [x] Tests pass (`npm test`)
- [x] WordPress Application Password created
- [x] First page extracted successfully
- [x] Output files generated in `output/extractions/`

🎉 **You're all set!** Start extracting Elementor pages and converting them to Next.js!

---

🤖 Generated with [Claude Code](https://claude.com/claude-code)

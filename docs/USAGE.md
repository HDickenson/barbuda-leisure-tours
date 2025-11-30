# Usage Guide - WordPress to Next.js Migration Pipeline

## Overview

This pipeline uses **Claude AI** (your subscription) to orchestrate a complete WordPress to Next.js migration with pixel-perfect design replication.

## Prerequisites

1. **Claude API Key** - From your Claude Code subscription
2. **Cloudflare Account** - For R2 storage and Workers
3. **Node.js 18+** and **pnpm**

## Setup

### 1. Environment Configuration

Update `.env` with your credentials:

```bash
# REQUIRED
ANTHROPIC_API_KEY=sk-ant-...              # Your Claude subscription key
SCOUT_WORKER_URL=https://...              # Your deployed Scout Worker URL

# Cloudflare (for asset storage)
CF_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET=clonerbuc7

# Target website
TARGET_URL=https://www.example.com/
```

### 2. Install Dependencies

```bash
pnpm install
```

### 3. Deploy Scout Worker (One-time)

```bash
# Login to Cloudflare
pnpm worker:login

# Create KV namespace
pnpm worker:kv

# Create R2 bucket
pnpm worker:r2

# Deploy worker
pnpm worker:deploy
```

Update `SCOUT_WORKER_URL` in `.env` with the deployed URL.

## Running the Pipeline

### Basic Usage

```bash
# Use TARGET_URL from .env
cd apps/orchestrator
pnpm dev

# Or specify URL directly
pnpm dev https://www.barbudaleisure.com/
```

### What Happens

The pipeline executes these stages automatically:

1. **Scout** (30-60s)
   - Crawls all pages via links and sitemap
   - Discovers assets (images, CSS, JS, fonts)
   - Stores HTML in Cloudflare R2

2. **Download Assets** (1-2 min)
   - Downloads all discovered assets
   - Optimizes images to WebP
   - Stores in R2
   - Must reach 85%+ coverage

3. **Extract Design System** (30-45s)
   - Parses CSS from all pages
   - Extracts colors, typography, spacing
   - **Uses Claude Vision API** to analyze screenshots
   - Detects animations and transitions
   - Identifies component patterns

4. **Synthesize Pages** (1-2 min)
   - Generates Next.js TypeScript components
   - Creates page routes
   - Converts animations to Framer Motion
   - Builds utilities (carousels, modals, etc.)

5. **Verify Build** (30-60s)
   - Builds Next.js site
   - Screenshots all pages
   - Visual regression comparison
   - Link validation
   - Performance testing

### Output

Results are saved to `./results/{siteId}-result.json`:

```json
{
  "siteId": "aHR0cHM6Ly",
  "success": true,
  "crawl": { ... },
  "assets": { ... },
  "designSystem": { ... },
  "synthesis": { ... },
  "verification": { ... },
  "duration": 245000,
  "errors": []
}
```

## Quality Gates

The pipeline enforces these requirements:

| Stage | Requirement | Action if Failed |
|-------|-------------|------------------|
| Scout | Pages discovered | Stop, report error |
| Download | 85%+ coverage | Stop, wait for retry |
| Design | 3+ colors extracted | Stop, report error |
| Synthesize | Files generated | Stop, report error |
| Verify | Visual diff < 5% | Report, mark as failed |
| Verify | No broken links | Report, mark as failed |
| Verify | Performance > 90 | Report, mark as failed |

## Cost Estimate

For an 11-page site:

- **Claude API**: $0 (included in your subscription!)
- **Cloudflare Workers**: $0 (free tier)
- **Cloudflare R2**: $0 (free tier, minimal storage)

**Total: $0** 🎉

## Troubleshooting

### Error: "Missing ANTHROPIC_API_KEY"

Add your Claude API key to `.env`:

```bash
ANTHROPIC_API_KEY=sk-ant-your-key-here
```

Get your key from: https://console.anthropic.com/

### Error: "Missing SCOUT_WORKER_URL"

Deploy the Scout Worker first:

```bash
pnpm worker:deploy
```

Then update `.env` with the deployed URL.

### Coverage < 85%

Some assets failed to download. Common causes:

- **Protected assets** - Behind authentication
- **CORS issues** - Assets served from different domain
- **404s** - Broken links on original site

Check `failures` array in asset result for details.

### Visual Diff Failed

The generated site doesn't match the original. Common causes:

- **Fonts not loaded** - Check font availability
- **Animations disabled** - Timing or easing mismatch
- **Dynamic content** - JavaScript-generated content

Review `visualDiff.pages` for per-page differences.

### Build Failed

TypeScript compilation errors. Check:

- Generated component syntax
- Missing imports
- Type errors in props

Check `synthesis.warnings` for details.

## Advanced Usage

### Custom Configuration

Pass configuration to specific stages:

```typescript
import { cloneWebsite } from './agent';

const result = await cloneWebsite('https://example.com', {
  crawler: {
    maxPages: 50,
    delay: 1000  // ms between requests
  },
  design: {
    useVision: true,  // Enable Claude Vision
    extractAnimations: true
  },
  synthesis: {
    componentLibrary: 'shadcn',
    animationLibrary: 'framer-motion'
  },
  verification: {
    visualThreshold: 0.03,  // 3% diff allowed
    checkPerformance: true
  }
});
```

### Running Individual Stages

```typescript
import { crawlSite } from '@kanousei/crawler';
import { generateDesignSystem } from '@kanousei/design-system';

// Just crawl
const { siteId } = await crawlSite('https://example.com');

// Just design extraction (requires existing siteId)
const design = await generateDesignSystem(siteId);
```

### Monitoring Progress

Watch the console output for real-time progress:

```
╔════════════════════════════════════════════════════════╗
║  WordPress → Next.js Migration Pipeline (Claude AI)   ║
╚════════════════════════════════════════════════════════╝

🎯 Target: https://www.barbudaleisure.com/

═══ Turn 1/20 ═══

🤖 Claude: tool_use

🔧 Executing: scout
📥 Input: {
  "url": "https://www.barbudaleisure.com/"
}
✅ Success (2341ms)
📤 Result: { "siteId": "aHR0cHM6Ly...", "pages": [...], ... }
```

## Next Steps

After successful pipeline execution:

1. **Review generated files** in `apps/web/`
2. **Test locally**:
   ```bash
   cd apps/web
   pnpm dev
   ```
3. **Fix any issues** reported in verification
4. **Deploy to Vercel**:
   ```bash
   vercel deploy
   ```

## Architecture

See [ARCHITECTURE.md](./ARCHITECTURE.md) for detailed system design and data flow.

## Support

- **Issues**: https://github.com/kanousei/n8n-web-replicate/issues
- **Docs**: This directory
- **Architecture**: [ARCHITECTURE.md](./ARCHITECTURE.md)

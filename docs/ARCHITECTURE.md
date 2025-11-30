# WordPress to Next.js Migration Pipeline Architecture

## Overview

This system clones WordPress websites to Next.js with pixel-perfect design replication using Claude AI for orchestration and analysis.

## System Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                    Claude Orchestrator                       │
│  (apps/orchestrator) - Central AI controller with tool use  │
└────────┬────────────────┬──────────────┬───────────────────┘
         │                │              │
         ▼                ▼              ▼
    ┌────────┐      ┌──────────┐   ┌─────────┐
    │ Scout  │      │ Designer │   │ Builder │
    │ Worker │      │ Package  │   │ Package │
    └────┬───┘      └─────┬────┘   └────┬────┘
         │                │              │
         ▼                ▼              ▼
    ┌─────────────────────────────────────┐
    │      Cloudflare Infrastructure       │
    │   KV (state) + R2 (storage)         │
    └─────────────────────────────────────┘
                     │
                     ▼
            ┌────────────────┐
            │  Next.js Site   │
            │ (apps/web)      │
            └────────────────┘
```

## Data Flow

### Phase 1: Discovery (Scout)
```
User URL → Scout Worker → Crawl Pages → Extract Links/Assets → Store in R2
                ↓
         Update KV Frontier
                ↓
         Return siteId
```

**Outputs:**
- `{siteId}/pages/{encoded-url}.html` (R2) - Raw HTML pages
- `{siteId}/assets/{hash}.{ext}` (R2) - Downloaded assets
- `{siteId}:visited:{url}` (KV) - Visited pages tracker
- `{siteId}:frontier:{url}` (KV) - URLs to crawl

### Phase 2: Asset Collection
```
siteId → List Pages from R2 → Extract Asset URLs → Download → Store in R2
                                      ↓
                              Calculate Coverage
                                      ↓
                             Return download stats
```

**Outputs:**
- `{siteId}/assets/manifest.json` (R2) - Asset inventory
- Coverage metrics (memory)

### Phase 3: Design Analysis
```
siteId → Read HTML/CSS from R2 → Parse Styles → Extract Tokens
                ↓                                     ↓
         Screenshot Pages                    Claude Vision API
                ↓                                     ↓
         Analyze Design ←─────────────────────────────┘
                ↓
    Generate Design System JSON
```

**Outputs:**
- `{siteId}/design-system/tokens.json` (R2) - Design tokens
- `{siteId}/design-system/components.json` (R2) - Component patterns
- `{siteId}/design-system/animations.json` (R2) - Animation specs

### Phase 4: Component Generation
```
Design System + HTML Pages → Detect Patterns → Generate Components
                                    ↓
                            Claude Code Generation
                                    ↓
                         Next.js TypeScript Files
```

**Outputs:**
- `apps/web/components/ui/*.tsx` - shadcn/ui components
- `apps/web/components/sections/*.tsx` - Page sections
- `apps/web/app/**/*.tsx` - Pages and routes

### Phase 5: Verification
```
Generated Site → Build → Screenshot → Compare → Visual Diff
                   ↓          ↓           ↓
              Link Check   Perf Test   A11y Scan
                   ↓          ↓           ↓
                Quality Report Summary
```

**Outputs:**
- `{siteId}/verification/report.json` (R2) - Quality report
- Pass/fail status

## Component Responsibilities

### Scout Worker (Cloudflare Worker)
**Location:** `workers/scout/src/index.ts`

**Endpoints:**
- `POST /scout/start` - Initialize crawl, return siteId
- `POST /scout/step` - Process N pages from frontier
- `GET /health` - Health check

**Dependencies:**
- Cloudflare KV (state management)
- Cloudflare R2 (page storage)

**Quality Checks:**
- Validate URL format (Zod schema)
- Respect robots.txt
- Rate limiting (1 req/sec)
- CPU time < 10ms (free tier)

### Crawler Package
**Location:** `packages/crawler/src/index.ts`

**Function:** `crawlSite(url: string): Promise<CrawlResult>`

**Responsibilities:**
- Call Scout Worker `/scout/start`
- Poll `/scout/step` until frontier empty
- Return crawl summary

**Quality Checks:**
- Worker URL validation
- Response schema validation
- Timeout handling (30s max)
- Error retry (3 attempts)

### Asset Pipeline Package
**Location:** `packages/asset-pipeline/src/index.ts`

**Functions:**
- `stashAssets(siteId: string): Promise<AssetResult>`
- `coverageForSite(siteId: string): Promise<Coverage>`

**Responsibilities:**
- List all pages from R2
- Extract asset URLs (images, CSS, JS, fonts)
- Download and optimize assets
- Track coverage percentage

**Quality Checks:**
- R2 connection validation
- File type validation
- Image optimization (WebP conversion)
- Asset deduplication (hash-based)

### Design System Package
**Location:** `packages/design-system/src/index.ts`

**Function:** `generateDesignSystem(siteId: string): Promise<DesignSystem>`

**Responsibilities:**
- Parse CSS from R2 pages
- Extract design tokens (colors, typography, spacing)
- Analyze screenshots with Claude Vision
- Detect animation patterns
- Generate tokens.json

**Quality Checks:**
- CSS parsing error handling
- Color format normalization (hex)
- Font availability check
- Animation easing validation

### Page Synth Package
**Location:** `packages/page-synth/src/index.ts`

**Function:** `synthPages(siteId: string): Promise<SynthResult>`

**Responsibilities:**
- Read design system from R2
- Analyze HTML patterns
- Generate Next.js components with Claude
- Create page routes
- Generate Framer Motion animations

**Quality Checks:**
- TypeScript compilation validation
- Component naming conventions
- Import path verification
- Animation prop validation

### Verifier Package
**Location:** `packages/verifier/src/index.ts`

**Function:** `verifyPreview(siteId: string): Promise<VerificationReport>`

**Responsibilities:**
- Build Next.js site
- Screenshot generated pages
- Visual regression comparison
- Link validation
- Performance testing

**Quality Checks:**
- Build success verification
- Screenshot capture validation
- Pixel difference threshold (< 5%)
- Link status codes (no 404s)
- Lighthouse scores (> 90)

### Orchestrator (Claude AI)
**Location:** `apps/orchestrator/agent.ts`

**Function:** `cloneWebsite(url: string): Promise<CloneResult>`

**Responsibilities:**
- Coordinate all stages
- Handle tool execution
- Manage error recovery
- Make intelligent decisions
- Report progress

**Quality Checks:**
- Tool execution validation
- Error propagation
- Progress tracking
- Timeout management (30 min max)

## Data Schemas

### CrawlResult
```typescript
{
  siteId: string;          // Unique site identifier
  pages: string[];         // Array of page URLs
  assets: string[];        // Array of asset URLs
  metrics: {
    pageCount: number;
    assetCount: number;
    duration: number;      // ms
  }
}
```

### DesignSystem
```typescript
{
  siteId: string;
  tokens: {
    colors: {
      primary: string;     // hex
      secondary: string;
      background: string;
      foreground: string;
      // ... more colors
    };
    typography: {
      fontFamily: string[];
      fontSize: number[];  // px values
      fontWeight: number[];
      lineHeight: number[];
    };
    spacing: {
      xs: number;          // px
      sm: number;
      md: number;
      lg: number;
      xl: number;
    };
    shadows: string[];     // CSS shadow values
    borderRadius: number[];
    animations: Animation[];
  };
  components: ComponentPattern[];
}
```

### Animation
```typescript
{
  name: string;
  type: 'transition' | 'keyframe' | 'scroll';
  trigger?: 'hover' | 'focus' | 'scroll' | 'mount';
  properties: string[];    // CSS properties
  duration: number;        // ms
  easing: string;          // CSS easing function
  delay?: number;          // ms
}
```

### ComponentPattern
```typescript
{
  id: string;
  type: string;            // 'button' | 'card' | 'hero' | etc.
  frequency: number;       // Times used
  htmlPattern: string;     // Sample HTML
  cssClasses: string[];
  props: {
    name: string;
    type: string;          // TypeScript type
    required: boolean;
  }[];
}
```

## Environment Variables

```bash
# Required
ANTHROPIC_API_KEY=sk-ant-...     # Claude API key
SCOUT_WORKER_URL=https://...     # Scout Worker URL
CLOUDFLARE_ACCOUNT_ID=...        # For R2 access
CLOUDFLARE_R2_ACCESS_KEY_ID=...
CLOUDFLARE_R2_SECRET_ACCESS_KEY=...

# Optional
TARGET_URL=https://...           # Default site to clone
LOG_LEVEL=info                   # debug | info | warn | error
MAX_PAGES=100                    # Max pages to crawl
SCREENSHOT_DELAY=2000            # ms to wait for page load
```

## Error Handling Strategy

### Levels
1. **Validation Errors** - Bad input, fail fast
2. **Network Errors** - Retry with exponential backoff
3. **API Errors** - Retry with rate limit handling
4. **Processing Errors** - Log, continue with degraded output
5. **Fatal Errors** - Stop pipeline, report failure

### Retry Strategy
```typescript
maxRetries: 3
baseDelay: 1000ms
backoff: exponential (2x)
jitter: ±500ms
```

## Performance Targets

| Metric | Target | Current |
|--------|--------|---------|
| Crawl speed | 1 page/sec | TBD |
| Design extraction | < 30s | TBD |
| Component generation | < 60s | TBD |
| Full pipeline (11 pages) | < 5 min | TBD |
| Claude API cost | < $5 | TBD |

## Quality Gates

Each stage must pass these checks before proceeding:

1. **Scout**: All pages discovered, no 404s
2. **Assets**: 85%+ coverage, all critical assets downloaded
3. **Design**: Valid tokens.json, all colors/fonts extracted
4. **Synth**: TypeScript compiles, all pages generated
5. **Verify**: Build succeeds, visual diff < 5%, no broken links

## Next Steps

1. Implement types package (`packages/types`)
2. Add Zod validation schemas
3. Implement R2 client wrapper
4. Build Claude orchestrator
5. Enhance each package with quality checks
6. Add comprehensive logging
7. Create integration tests

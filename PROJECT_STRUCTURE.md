# Barbuda Leisure Tours - Project Structure

## Root Level (Essential Files Only)
- `package.json` - NPM dependencies and scripts
- `package-lock.json` - Locked dependency versions
- `tsconfig.json` - TypeScript configuration
- `pnpm-workspace.yaml` - PNPM monorepo configuration
- `pnpm-lock.yaml` - PNPM lock file
- `Dockerfile` - Container configuration
- `README.md` - Main project documentation

## Directory Structure

### `/app` & `/apps` - Application Code
- Main Next.js application
- Page routes and components
- API endpoints

### `/barbuda-local` - Local Next.js Project
- Standalone Next.js application
- Built pages and development server
- Local testing environment

### `/config` - Configuration Files
- `vercel.json` - Vercel deployment configuration
- `turbo.json` - Turbo monorepo build configuration
- `.mcp.json` - MCP server configuration

### `/data` - Raw Data & Extraction
- HTML snapshots
- JSON extraction outputs
- Analysis reports
- Slideshow mappings

### `/docs` - Documentation
- Development guides
- API documentation
- Architecture documentation

### `/extractors` - Content Extraction Tools
- **Scripts**: Complete, comprehensive, deep, deterministic, enhanced, full-page, puppeteer extractors
- **Output**: Extraction results organized by method
  - `/output/chrome-extraction/` - Chrome DevTools extraction
  - `/output/complete-extraction/` - Complete page extraction
  - `/output/comprehensive/` - Comprehensive design extraction
  - `/output/deep-extraction/` - Deep HTML structure extraction
  - `/output/deterministic/` - Deterministic CSS and section extraction
  - `/output/full-page-extraction/` - Full page HTML extraction
  - `/output/puppeteer-extraction/` - Puppeteer browser automation extraction

### `/generated-site` - Generated Next.js Application
- Auto-generated React components
- Generated pages from extracted data
- Analysis scripts

### `/infra` - Infrastructure & DevOps
- Deployment configurations
- CI/CD pipelines
- Environment setup scripts

### `/packages` - Monorepo Packages
- Shared libraries
- Reusable components
- Utility modules

### `/scripts` - Build & Utility Scripts
- Build automation
- Content processing
- Testing utilities

### `/specs` - Specification Files
- Feature specifications
- Implementation specs
- Requirements documentation

### `/transformers` - Data Transformation Tools
- **`/vercel-nextjs/`** - Next.js transformer
  - **`/output/data/`** - Transformed page data (JSON)
    - `about-us.json`
    - `our-tours.json`
    - `our-blog.json`
    - `reviews.json`
    - `terms-and-conditions.json`
    - `refund_returns.json`
    - And other page data files
  - **`/output/pages/`** - Generated React components (TSX)
  - TypeScript transformer source code

### `/workers` - Edge Workers
- Cloudflare Workers
- Edge function handlers

### `/archive` - Historical & Old Data (Archived)
- **`/deployment/`** - Deployment documentation and reports
  - DEPLOYMENT_FAILURE_ANALYSIS.md
  - DEPLOYMENT_READY.md
  - DEPLOYMENT_SUCCESS.md
  - VERCEL_* guides and fixes
- **`/documentation/`** - Design and analysis documentation
  - DESIGN_SPECIFICATION.md
  - PIXEL_PERFECT_IMPLEMENTATION.md
  - QC_REPORT.md
  - README.DEV.md
- **`/screenshots/`** - Test and comparison screenshots
  - homepage-* screenshots
  - wordpress comparison screenshots
  - test screenshots
- **`/analysis/`** - Analysis outputs
  - css-output.css
  - Extraction analysis reports

## Data Flow

1. **Extraction**: Extractors pull data from WordPress site
   - Stored in `/extractors/output/`
2. **Transformation**: Transformers convert data to Next.js format
   - Stored in `/transformers/vercel-nextjs/output/`
3. **Generation**: Next.js components generated from transformed data
   - Output to `/generated-site/` or `/barbuda-local/`

## Key Generated Outputs

### Tour Data
- **Location**: `/transformers/vercel-nextjs/output/data/our-tours.json`
- **Content**: 4 tour packages with images, descriptions, and links
- **Component**: `/transformers/vercel-nextjs/output/pages/our-tours.tsx`

### Blog Data
- **Location**: `/transformers/vercel-nextjs/output/data/our-blog.json`
- **Content**: Blog section structure and content
- **Component**: `/transformers/vercel-nextjs/output/pages/our-blog.tsx`

### Other Pages
- About Us, Reviews, FAQ, Terms & Conditions, Refund/Returns
- Each has matching `.json` data and `.tsx` component files

## .gitignore Coverage
- `node_modules/` - Dependencies
- `.next/` - Build artifacts
- Build outputs
- Environment files

## Development Workflow
1. Extract content from WordPress using tools in `/extractors/`
2. Transform data using tools in `/transformers/`
3. Generate Next.js application in `/barbuda-local/`
4. Build and deploy from root directory

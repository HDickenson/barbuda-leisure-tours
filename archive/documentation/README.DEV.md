# Development Guide

This guide covers local development, testing, and contributing to the project.

## Prerequisites

- Node.js 18+ and pnpm 9+
- Cloudflare account with wrangler CLI configured
- Claude Code OAuth token

## Local Setup

```bash
# Install dependencies
pnpm install

# Setup environment
cp .env.example .env
# Edit .env with your credentials

# Run TypeScript checks
pnpm -w -r exec tsc --noEmit

# Build all packages
pnpm run build
```

## Development Workflow

### Testing the Scout Worker Locally

```bash
# Start local development server
cd infra/cloudflare
wrangler dev

# In another terminal, test endpoints
curl http://localhost:8787/health
curl -X POST http://localhost:8787/scout/start \
  -H "Content-Type: application/json" \
  -d '{"url":"https://example.com"}'
```

### Running the Orchestrator

```bash
# Run with TARGET_URL from .env
pnpm run full

# Run with specific URL
pnpm run full --url=https://example.com

# Or run directly with tsx
TARGET_URL=https://example.com tsx apps/orchestrator/agent.ts
```

### TypeScript Checks

```bash
# Check all packages
pnpm -w -r exec tsc --noEmit

# Check specific package
cd packages/crawler
pnpm exec tsc --noEmit
```

## Docker Development (Optional)

For reproducible builds using Podman/Docker:

```bash
# Build container
podman build -t n8n-replicate-dev .

# Run checks in container
podman run --rm -it -v ${PWD}:/workspace -w /workspace n8n-replicate-dev
```

Note: The Dockerfile is meant for CI and local parity. It does not run the application.
Use Miniflare or Cloudflare Wrangler to run worker smoke tests locally.

## Project Structure

```
n8n-web-replicate/
├── apps/
│   ├── orchestrator/          # Claude AI orchestrator
│   │   ├── agent.ts          # Main orchestration logic
│   │   └── package.json
│   └── next-website/         # Generated Next.js site
├── workers/
│   └── scout/                # Cloudflare Worker
│       ├── src/index.ts      # Worker entry point
│       └── package.json
├── packages/
│   ├── crawler/              # Calls scout worker
│   ├── asset-pipeline/       # Asset download (stub)
│   ├── design-system/        # Design token extraction (stub)
│   ├── page-synth/           # Page generation (stub)
│   ├── verifier/             # Verification (stub)
│   ├── types/                # Shared TypeScript types
│   └── validation/           # Zod schemas
└── scripts/
    └── run.ts                # Pipeline runner
```

## Debugging

### Worker Logs

```bash
# Tail worker logs
wrangler tail
```

### Common Issues

**Worker deployment fails:**
- Check `CLOUDFLARE_ACCOUNT_ID` in .env
- Ensure you're logged in: `wrangler login`
- Verify KV namespace exists: `wrangler kv namespace list`

**Orchestrator fails immediately:**
- Check `CLAUDE_CODE_OAUTH_TOKEN` is valid
- Verify `SCOUT_WORKER_URL` is accessible
- Test worker health: `curl $SCOUT_WORKER_URL/health`

**TypeScript errors:**
- Rebuild packages: `pnpm run build`
- Check tsconfig includes correct files

## Architecture Notes

### Scout Worker
- 10ms CPU time per request (free tier limit)
- Process in small batches
- Uses naive regex-based extraction (no DOM parser)
- Stores HTML in R2, tracks URLs in KV

### Orchestrator
- Uses Claude's tool calling API
- Executes pipeline stages autonomously
- Validates outputs with Zod schemas
- Enforces quality gates at each stage

### Pipeline Packages
Currently stubbed implementations that return mock data. See individual package READMEs for details.

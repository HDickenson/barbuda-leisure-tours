# Kanousei WP → Next.js Agent (FREE-PLAN SAFE)

An AI-powered pipeline that clones WordPress sites into Next.js applications using Claude AI orchestration.

This repo uses **only features available on free plans**:
- Cloudflare Workers Free (100k req/day, 10ms CPU per request)
- Workers KV Free (limited ops/day)
- R2 Free (10GB storage, 1M Class A / 10M Class B ops/mo)
- Vercel Hobby for preview deploys (optional)

**No Browser Rendering by default.** You can enable it later if you need JS-heavy rendering.

## Quick Start

```bash
# 1. Install dependencies
pnpm install

# 2. Setup environment
cp .env.example .env
# Edit .env with your Cloudflare account ID

# 3. Login to Cloudflare
wrangler login

# 4. Deploy the scout worker
wrangler deploy --config infra/cloudflare/wrangler.toml
# Copy the worker URL to SCOUT_WORKER_URL in .env

# 5. Run the pipeline (inside Claude Code)
cd apps/orchestrator
tsx agent-sdk.ts
# When prompted, grant permission for MCP tools
```

## Running Inside Claude Code

This project is designed to run inside **Claude Code** (VS Code extension). The Agent SDK uses Claude Code's built-in authentication automatically - **no API key needed!**

When you run the orchestration, Claude will ask for permission to use the MCP server tools. This is a security feature - simply **grant permission** when prompted.

## How It Works

The orchestrator uses Claude Agent SDK to coordinate a multi-stage pipeline:

1. **Scout**: Crawl website to discover pages and assets
2. **Download**: Download assets with 85%+ coverage target
3. **Design**: Extract design system (colors, typography, spacing)
4. **Synthesize**: Generate Next.js TypeScript components
5. **Verify**: Build and verify the cloned site

Each stage has quality gates that must pass before proceeding.

## Environment Variables

Required in `.env`:
- `CLOUDFLARE_ACCOUNT_ID` - From `wrangler login` output
- `SCOUT_WORKER_URL` - Your deployed worker URL
- `TARGET_URL` - Website to clone

Optional:
- `VERCEL_TOKEN` - For deploying generated site to Vercel
- `VERCEL_PROJECT` - Your Vercel project name

## Available Commands

```bash
# Run orchestration (inside Claude Code)
cd apps/orchestrator
tsx agent-sdk.ts                 # Uses TARGET_URL from .env
tsx agent-sdk.ts https://example.com  # Specify URL directly

# Worker management
wrangler deploy --config infra/cloudflare/wrangler.toml
wrangler r2 bucket list
wrangler kv namespace list

# Development
pnpm run build                   # Build all packages
pnpm run lint                    # Run linters
```

## Project Structure

- `apps/orchestrator/` - Claude Agent SDK orchestrator
  - `agent-sdk.ts` - Main orchestration with MCP server integration
- `workers/scout/` - Cloudflare Worker for crawling
- `packages/` - Pipeline packages (crawler, asset-pipeline, design-system, etc.)
- `infra/cloudflare/` - Worker configuration

## Free Tier Limits

Designed to work within Cloudflare's free tier:
- Workers: 100,000 requests/day
- R2: 10GB storage
- KV: 100,000 read ops/day, 1,000 write ops/day

## Troubleshooting

**MCP Permission Denied**:
- Grant permission when Claude asks
- This is a security feature of the Agent SDK

**Worker not accessible**:
- Check `SCOUT_WORKER_URL` in .env
- Test: `curl $SCOUT_WORKER_URL/health`

**No URL provided**:
- Set `TARGET_URL` in .env
- Or pass URL as argument: `tsx agent-sdk.ts https://example.com`

## Development

See [README.DEV.md](README.DEV.md) for development setup and guidelines.

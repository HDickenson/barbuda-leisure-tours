// apps/orchestrator/agent.ts
import 'dotenv/config';
import { Agent, tool } from '@openai/agents'; // Agents SDK (TS)
import { invokeTool, SiteIdSchema } from './toolInvoker';
import { OpenAI } from 'openai';                     // Responses API client
import { z } from 'zod';

// --- external deps (you'll implement these in packages/*) ---
import { crawlSite } from '@kanousei/crawler';
import { stashAssets, coverageForSite } from '@kanousei/asset-pipeline';
import { generateDesignSystem } from '@kanousei/design-system';
import { synthPages } from '@kanousei/page-synth';
import { verifyPreview } from '@kanousei/verifier';

const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY! });

export const agent = new Agent({
  name: 'WP→Next Cloner',
  instructions: 'Scouts a WordPress site and converts it to Next.js for Vercel.',
  model: 'gpt-5-thinking', // planning/reasoning model
  tools: [
    tool({
      name: 'scout',
      description: 'Crawl a site and capture DOM, assets, metrics per page.',
      parameters: z.object({ url: z.string() }),
      execute: async ({ url }) => await crawlSite(url)
    }),
    tool({
      name: 'download',
      description: 'Download and dedupe all assets to Cloudflare R2 for a site.',
      parameters: z.object({ siteId: z.string() }),
      execute: async ({ siteId }) => await stashAssets(siteId)
    }),
    tool({
      name: 'designSystem',
      description: 'Analyze CSS, fonts, logos and emit shadcn + atomic tokens + brand guide.',
      parameters: z.object({ siteId: z.string() }),
      execute: async ({ siteId }) => await generateDesignSystem(siteId)
    }),
    tool({
      name: 'synthesize',
      description: 'Create Next.js pages/sections/functions per template.',
      parameters: z.object({ siteId: z.string() }),
      execute: async ({ siteId }) => await synthPages(siteId)
    }),
    tool({
      name: 'verify',
      description: 'Test links, breakpoints, performance, a11y; loop back issues.',
      parameters: z.object({ siteId: z.string() }),
      execute: async ({ siteId }) => await verifyPreview(siteId)
    }),
  ],
});

// sugar: a single "ask" that orchestrates the 5 steps with the 85% gate + parallelism
export async function runFullPipeline(url: string) {
  const scout = await invokeTool(agent, 'scout', { url });
  // tool implementations may return different shapes; support either { result: { siteId } } or { siteId }
  const start = (scout && scout.result) ? scout.result : scout;
  const parsed = SiteIdSchema.parse(start);
  const { siteId } = parsed; // your crawler returns a stable siteId
  const dl = await invokeTool(agent, 'download', { siteId });

  const { coverage } = await coverageForSite(siteId);
  if (coverage >= 0.85) {
  await invokeTool(agent, 'designSystem', { siteId });
  await invokeTool(agent, 'synthesize', { siteId });
  return await invokeTool(agent, 'verify', { siteId });
  } else {
    // queue a watcher to re-run when coverage crosses 85%
    return { siteId, status: 'waiting_for_assets', coverage };
  }
}

// public "ask" entry
export async function ask(cmd: string, payload: any) {
  switch (cmd) {
  case 'full-pipeline': return runFullPipeline(payload.url);
  case 'scout':         return invokeTool(agent, 'scout', payload);
  case 'download':      return invokeTool(agent, 'download', payload);
  case 'design-system': return invokeTool(agent, 'designSystem', payload);
  case 'synthesize':    return invokeTool(agent, 'synthesize', payload);
  case 'verify':        return invokeTool(agent, 'verify', payload);
    default: throw new Error(`Unknown ask: ${cmd}`);
  }
}

/// <reference types="@cloudflare/workers-types" />
import { z } from 'zod';

export interface Env {
  R2: R2Bucket;
  KV: KVNamespace;
}

const UA = "KanouseiScoutFree/1.0 (+https://kanousei.tech)";

// Simple helpers
const enc = new TextEncoder();
function key(...parts: string[]) { return parts.join(":"); }

export default {
  async fetch(req: Request, env: Env): Promise<Response> {
    const url = new URL(req.url);
    if (req.method === "POST" && url.pathname === "/scout/start") {
      const body = await req.json();
      const StartSchema = z.object({ url: z.string().url() });
      const parsed = StartSchema.safeParse(body);
      if (!parsed.success) return json({ error: "invalid body", details: parsed.error.format() }, 400);
      const { url: target } = parsed.data;
      const siteId = btoa(target).replace(/[^a-zA-Z0-9]/g, "").slice(0, 10);

      // Store state in R2 instead of KV to avoid write limits
      const seeds = [target, new URL("/sitemap.xml", target).href];
      const state = {
        root: target,
        frontier: seeds,
        visited: [] as string[]
      };
      await env.R2.put(`${siteId}/state.json`, JSON.stringify(state));
      return json({ ok: true, siteId });
    }

    if (req.method === "POST" && url.pathname === "/scout/step") {
      try {
        const body2 = await req.json();
        const StepSchema = z.object({ siteId: z.string(), limit: z.number().optional() });
        const parsed2 = StepSchema.safeParse(body2);
        if (!parsed2.success) return json({ error: "invalid body", details: parsed2.error.format() }, 400);
        const { siteId, limit = 10 } = parsed2.data;

        // Load state from R2
        const stateObj = await env.R2.get(`${siteId}/state.json`);
        if (!stateObj) return json({ error: "unknown site" }, 404);
        const state = JSON.parse(await stateObj.text());

        let processed = 0;
        const errors: string[] = [];
        const newFrontier: string[] = [];

        // Process up to `limit` URLs from frontier
        const toProcess = state.frontier.slice(0, limit);
        state.frontier = state.frontier.slice(limit);

        for (const urlStr of toProcess) {
          // Skip non-HTML resources by extension
          if (urlStr.match(/\.(css|js|json|xml|jpg|jpeg|png|gif|webp|svg|woff|woff2|ttf|ico)(\?|$)/i)) {
            continue;
          }

          // skip if visited
          if (state.visited.includes(urlStr)) continue;
          state.visited.push(urlStr);
          processed++;

          try {
            const res = await fetch(urlStr, { headers: { "User-Agent": UA } });
            if (!res.ok) {
              errors.push(`HTTP ${res.status} for ${urlStr}`);
              continue;
            }

            // Check if response is HTML
            const contentType = res.headers.get('content-type') || '';
            if (!contentType.includes('text/html')) {
              continue; // Skip non-HTML responses
            }

            const html = await res.text();

            // Safe hex encoding for URL
            const urlHash = Array.from(enc.encode(urlStr))
              .map(b => b.toString(16).padStart(2, '0'))
              .join('')
              .slice(0, 32);

            await env.R2.put(`${siteId}/pages/${urlHash}.html`, html, {
              httpMetadata: { contentType: "text/html" },
              customMetadata: { url: urlStr }
            });

            // Extract only href links (pages), not src (assets)
            const links = [...html.matchAll(/href=["']([^"']+)["']/gi)].map(m => m[1]);
            const abs = (u: string) => {
              try { return new URL(u, state.root).href; } catch { return ""; }
            };
            const candidates = links
              .map(abs)
              .filter(u => u && u.startsWith(new URL(state.root).origin))
              .filter(u => !state.visited.includes(u) && !state.frontier.includes(u) && !newFrontier.includes(u))
              .filter(u => !u.match(/\.(css|js|json|xml|jpg|jpeg|png|gif|webp|svg|woff|woff2|ttf|ico|pdf)(\?|$)/i)); // Filter out asset URLs

            newFrontier.push(...candidates);
          } catch (err: any) {
            errors.push(`Error processing ${urlStr}: ${err.message}`);
          }
        }

        // Update frontier with new URLs
        state.frontier.push(...newFrontier);

        // Save state back to R2
        await env.R2.put(`${siteId}/state.json`, JSON.stringify(state));

        return json({
          ok: true,
          siteId,
          processed,
          remaining: state.frontier.length,
          totalVisited: state.visited.length,
          errors: errors.length > 0 ? errors.slice(0, 5) : undefined
        });
      } catch (err: any) {
        return json({ error: "step failed", message: err.message, stack: err.stack }, 500);
      }
    }

    if (url.pathname === "/health") return new Response("ok");
    return new Response("not found", { status: 404 });
  }
};

function json(data: any, status = 200) {
  return new Response(JSON.stringify(data), { status, headers: { "content-type": "application/json" } });
}

import * as http from 'http';
import { writeFile } from 'fs/promises';
import { dirname } from 'path';
import { mkdir } from 'fs/promises';

type Req = http.IncomingMessage & { url?: string; method?: string };
type Res = http.ServerResponse;

export async function startLocalScout(port = 3001, baseDir = 'data/scout') {
  // ensure base dirs
  await mkdir(baseDir, { recursive: true });

  const server = http.createServer(async (req: Req, res: Res) => {
    if (!req.url) { res.writeHead(404); return res.end('not found'); }
    if (req.method !== 'POST') { res.writeHead(405); return res.end(); }
    const chunks: Uint8Array[] = [];
    for await (const chunk of req) chunks.push(chunk as Uint8Array);
    const body = JSON.parse(Buffer.concat(chunks).toString() || '{}');

    if (req.url === '/scout/start') {
      const target = body.url || '';
      if (!target) { res.writeHead(400, { 'content-type': 'application/json' }); res.end(JSON.stringify({ error: 'missing url' })); return; }
      const siteId = Buffer.from(target).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 10);
      // write a simple root file to simulate page capture
      const pagePath = `${baseDir}/${siteId}-home.html`;
      await writeFile(pagePath, `<html><body><h1>Fetched ${target}</h1></body></html>`);
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ ok: true, siteId }));
      return;
    }

    if (req.url === '/scout/step') {
      const siteId = body.siteId || 'unknown';
      // simulate processing
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ ok: true, siteId, processed: 1, remaining: 0 }));
      return;
    }

    res.writeHead(404).end();
  });

  return new Promise<http.Server>((resolve) => {
    server.listen(port, () => resolve(server));
  });
}

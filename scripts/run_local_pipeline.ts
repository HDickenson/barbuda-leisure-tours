import 'dotenv/config';
import * as http from 'http';

type Req = http.IncomingMessage & { url?: string; method?: string };
type Res = http.ServerResponse;

// Start a tiny mock scout worker that responds to /scout/start and /scout/step
function startMockScout(port = 3001) {
  const server = http.createServer(async (req: Req, res: Res) => {
    if (!req.url) return res.end('not found');
    if (req.method !== 'POST') { res.writeHead(405); return res.end(); }
    const chunks: Uint8Array[] = [];
    for await (const chunk of req) chunks.push(chunk as Uint8Array);
    const body = JSON.parse(Buffer.concat(chunks).toString() || '{}');

    if (req.url === '/scout/start') {
      const target = body.url || '';
      if (!target) {
        res.writeHead(400, { 'content-type': 'application/json' });
        res.end(JSON.stringify({ error: 'missing url' }));
        return;
      }
      const siteId = Buffer.from(target).toString('base64').replace(/[^a-zA-Z0-9]/g, '').slice(0, 10);
      // respond with a simple siteId
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ ok: true, siteId }));
      return;
    }

    if (req.url === '/scout/step') {
      // pretend we processed some pages
      res.writeHead(200, { 'content-type': 'application/json' });
      res.end(JSON.stringify({ ok: true, processed: 0, remaining: 0 }));
      return;
    }

    res.writeHead(404).end();
  });
  return new Promise<http.Server>((resolve) => {
    server.listen(port, () => resolve(server));
  });
}

async function run() {
  const port = 3001;
  const server = await startMockScout(port);
  console.log('Mock scout worker running at http://localhost:' + port);

  // set SCOUT_WORKER_URL for packages/crawler
  process.env.SCOUT_WORKER_URL = `http://localhost:${port}`;

  // call the orchestrator
  const { ask } = await import('../app/orchestrator/agent');

  try {
    console.log('Calling scout tool for https://www.barbudaleisure.com/ ...');
    const scoutRes = await ask('scout', { url: 'https://www.barbudaleisure.com/' });
    console.log('Scout returned:', JSON.stringify(scoutRes, null, 2));
    console.log('Running full pipeline...');
    const result = await ask('full-pipeline', { url: 'https://www.barbudaleisure.com/' });
    console.log('Pipeline result:', JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('Pipeline failed:', err);
  } finally {
    server.close();
    process.exit(0);
  }
}

run();

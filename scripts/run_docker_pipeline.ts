import 'dotenv/config';
import { startLocalScout } from './local_scout_server';

async function run() {
  const port = 3001;
  const server = await startLocalScout(port, 'data/scout');
  console.log('Local scout started at http://localhost:' + port);

  process.env.SCOUT_WORKER_URL = `http://localhost:${port}`;

  try {
    const { ask } = await import('../app/orchestrator/agent');
    console.log('Starting full pipeline run...');
    const result = await ask('full-pipeline', { url: process.env.TARGET_URL || 'https://www.barbudaleisure.com/' });
    console.log('Pipeline finished:', JSON.stringify(result, null, 2));
  } catch (err) {
    console.error('Pipeline error:', err);
  } finally {
    server.close();
    process.exit(0);
  }
}

run();

import 'dotenv/config';

// Simple test to see if agent-sdk loads
console.log('Loading agent-sdk...');
console.log('TARGET_URL:', process.env.TARGET_URL);
console.log('SCOUT_WORKER_URL:', process.env.SCOUT_WORKER_URL);
console.log('CLAUDECODE:', process.env.CLAUDECODE);

import('../apps/orchestrator/agent-sdk').then(() => {
  console.log('Agent SDK loaded successfully');
}).catch(err => {
  console.error('Failed to load agent-sdk:', err.message);
  process.exit(1);
});

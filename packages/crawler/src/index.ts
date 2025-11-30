import axios from 'axios';

export async function crawlSite(url: string) {
  const worker = process.env.SCOUT_WORKER_URL;
  if (!worker) throw new Error("SCOUT_WORKER_URL missing (.env)");

  // 1) start
  const { data: start } = await axios.post(`${worker.replace(/\/$/, '')}/scout/start`, { url });

  // validate start response
  const { siteId } = start;
  if (!siteId || typeof siteId !== 'string') {
    throw new Error('Invalid response from scout worker - missing siteId');
  }

  console.log(`✅ Scout started, siteId: ${siteId}`);

  // 2) step a few times to avoid long single invocations (free plan CPU limit)
  for (let i=0;i<5;i++) {
    await axios.post(`${worker.replace(/\/$/, '')}/scout/step`, { siteId, limit: 10 });
    console.log(`   Step ${i+1}/5 complete`);
  }

  return {
    siteId,
    pages: [],
    assets: [],
    metrics: { pageCount: 0, assetCount: 0, duration: 0, errors: 0 }
  };
}

export async function crawlSite(url) {
    const worker = process.env.SCOUT_WORKER_URL;
    if (!worker)
        throw new Error("SCOUT_WORKER_URL missing (.env)");
    // 1) start
    const start = await fetch(worker.replace(/\/$/, '') + '/scout/start', {
        method: 'POST', headers: { 'content-type': 'application/json' },
        body: JSON.stringify({ url })
    }).then(r => r.json());
    // validate start response
    try {
        const { siteId } = start;
        if (!siteId || typeof siteId !== 'string')
            throw new Error('invalid start response');
        // use siteId
    }
    catch (err) {
        throw new Error('Invalid response from scout worker: ' + err.message);
    }
    const siteId = start.siteId;
    // 2) step a few times to avoid long single invocations (free plan CPU limit)
    for (let i = 0; i < 5; i++) {
        await fetch(worker.replace(/\/$/, '') + '/scout/step', {
            method: 'POST', headers: { 'content-type': 'application/json' },
            body: JSON.stringify({ siteId, limit: 10 })
        });
    }
    return { siteId, pages: [], metrics: {} };
}

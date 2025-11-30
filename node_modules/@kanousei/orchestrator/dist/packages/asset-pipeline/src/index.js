let coverageMap = new Map();
export async function stashAssets(siteId) {
    // Stub: mark 90/100 assets done
    const total = 100, downloaded = 90;
    coverageMap.set(siteId, { total, downloaded });
    return { siteId, total, downloaded };
}
export async function coverageForSite(siteId) {
    const row = coverageMap.get(siteId) || { total: 0, downloaded: 0 };
    const coverage = row.total ? row.downloaded / row.total : 0;
    return { siteId, coverage };
}

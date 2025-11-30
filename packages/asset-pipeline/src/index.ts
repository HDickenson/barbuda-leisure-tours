import { exec } from 'child_process';
import { promisify } from 'util';
import { writeFile, mkdir, readdir } from 'fs/promises';
import { join } from 'path';

const execAsync = promisify(exec);
let coverageMap = new Map<string, {total:number, downloaded:number}>();

async function downloadFromR2(bucket: string, remotePath: string, localPath: string): Promise<void> {
  const { stdout, stderr } = await execAsync(
    `wrangler r2 object get ${bucket}/${remotePath} --remote --file "${localPath}"`
  );
  if (stderr && !stderr.includes('Download complete')) {
    throw new Error(stderr);
  }
}

export async function stashAssets(siteId: string) {
  console.log(`📦 Downloading pages from R2 for ${siteId}...`);

  // Create output directory
  const outputDir = join('data', siteId, 'pages');
  await mkdir(outputDir, { recursive: true });

  // Get state.json to find all pages
  const stateFile = join('data', siteId, 'state.json');
  await mkdir(join('data', siteId), { recursive: true });

  try {
    await downloadFromR2('clone-staging', `${siteId}/state.json`, stateFile);
    const stateContent = await import('fs').then(fs => fs.promises.readFile(stateFile, 'utf-8'));
    const state = JSON.parse(stateContent);

    console.log(`📄 Found ${state.visited.length} visited pages in state`);

    // Download each visited page from R2
    let downloaded = 0;
    for (let i = 0; i < state.visited.length; i++) {
      const url = state.visited[i];

      // Generate same hash as worker uses
      const enc = new TextEncoder();
      const urlHash = Array.from(enc.encode(url))
        .map(b => b.toString(16).padStart(2, '0'))
        .join('')
        .slice(0, 32);

      const remotePath = `${siteId}/pages/${urlHash}.html`;
      const localPath = join(outputDir, `${urlHash}.html`);

      try {
        await downloadFromR2('clone-staging', remotePath, localPath);
        downloaded++;

        if (downloaded % 5 === 0) {
          console.log(`   Downloaded ${downloaded}/${state.visited.length} pages...`);
        }
      } catch (err: any) {
        console.warn(`   ⚠️  Failed to download ${url}: ${err.message}`);
      }
    }

    console.log(`✅ Downloaded ${downloaded}/${state.visited.length} pages to ${outputDir}`);

    const total = state.visited.length;
    coverageMap.set(siteId, { total, downloaded });
    return { siteId, total, downloaded };
  } catch (err: any) {
    console.error(`❌ Failed to download from R2: ${err.message}`);
    throw err;
  }
}

export async function coverageForSite(siteId: string) {
  const row = coverageMap.get(siteId) || { total: 0, downloaded: 0 };
  const coverage = row.total ? row.downloaded / row.total : 0;
  return { siteId, coverage };
}

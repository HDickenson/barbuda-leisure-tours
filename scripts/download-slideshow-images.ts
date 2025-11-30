#!/usr/bin/env tsx

/**
 * Download Slideshow Images
 *
 * Downloads all slideshow background images identified during reconstruction
 * and saves them locally to /public/images/slideshow/
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import axios from 'axios';

const IMAGE_LIST_FILE = 'data/slideshow-images.json';
const OUTPUT_DIR = 'generated-site/public/images/slideshow';

interface DownloadResult {
  url: string;
  filename: string;
  success: boolean;
  size?: number;
  error?: string;
}

async function downloadImage(url: string, outputPath: string): Promise<DownloadResult> {
  const filename = path.basename(new URL(url).pathname);

  try {
    console.log(`   Downloading: ${filename}...`);

    const response = await axios.get(url, {
      responseType: 'arraybuffer',
      timeout: 30000
    });

    await fs.writeFile(outputPath, response.data);

    const stats = await fs.stat(outputPath);
    const sizeKB = (stats.size / 1024).toFixed(1);

    console.log(`   ✅ Saved: ${filename} (${sizeKB} KB)`);

    return {
      url,
      filename,
      success: true,
      size: stats.size
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`   ❌ Failed: ${filename} - ${errorMessage}`);

    return {
      url,
      filename,
      success: false,
      error: errorMessage
    };
  }
}

async function main() {
  console.log('\n📥 Slideshow Image Downloader\n');
  console.log('='.repeat(80) + '\n');

  // Read image list
  console.log('📄 Reading image list...');
  const imageListContent = await fs.readFile(IMAGE_LIST_FILE, 'utf-8');
  const imageUrls: string[] = JSON.parse(imageListContent);

  console.log(`   Found ${imageUrls.length} images to download\n`);

  // Create output directory
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  console.log(`📁 Output directory: ${OUTPUT_DIR}\n`);

  // Download all images
  console.log('📥 Downloading images...\n');
  const results: DownloadResult[] = [];

  for (const url of imageUrls) {
    const filename = path.basename(new URL(url).pathname);
    const outputPath = path.join(OUTPUT_DIR, filename);

    const result = await downloadImage(url, outputPath);
    results.push(result);
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 Download Summary\n');

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`✅ Successful: ${successful.length}/${results.length}`);
  console.log(`❌ Failed: ${failed.length}/${results.length}`);

  if (successful.length > 0) {
    const totalSize = successful.reduce((sum, r) => sum + (r.size || 0), 0);
    const totalMB = (totalSize / (1024 * 1024)).toFixed(2);
    console.log(`📦 Total Size: ${totalMB} MB`);
  }

  if (failed.length > 0) {
    console.log('\n⚠️  Failed Downloads:');
    failed.forEach(f => {
      console.log(`  - ${f.filename}`);
      console.log(`    URL: ${f.url}`);
      console.log(`    Error: ${f.error}`);
    });
  }

  // Update image paths in components
  console.log('\n🔄 Updating image paths in components...');

  // Generate path mapping
  const pathMapping: Record<string, string> = {};
  successful.forEach(r => {
    pathMapping[r.url] = `/images/slideshow/${r.filename}`;
  });

  await fs.writeFile(
    'data/slideshow-image-mapping.json',
    JSON.stringify(pathMapping, null, 2)
  );

  console.log(`   ✅ Path mapping saved: data/slideshow-image-mapping.json`);
  console.log(`   ℹ️  Update your components to use local paths`);

  console.log('\n' + '='.repeat(80));

  if (failed.length === 0) {
    console.log('✅ All images downloaded successfully!\n');
  } else {
    console.log('⚠️  Some images failed to download. Please review errors above.\n');
    process.exit(1);
  }
}

main().catch(error => {
  console.error('\n❌ Download failed:', error);
  process.exit(1);
});

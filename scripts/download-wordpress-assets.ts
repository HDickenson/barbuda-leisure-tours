#!/usr/bin/env tsx

/**
 * Download WordPress Assets for Replica Pages
 *
 * This script downloads all external CSS and JavaScript files referenced
 * in the WordPress replica pages and saves them locally to /public/css/ and /public/js/
 *
 * This completes the missing CSS extraction step from the Elementor parser workflow.
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import puppeteer from 'puppeteer';

const WORDPRESS_BASE_URL = 'https://www.barbudaleisure.com';
const PROJECT_ROOT = path.join(__dirname, '..');
const PUBLIC_DIR = path.join(PROJECT_ROOT, 'generated-site', 'public');
const CSS_DIR = path.join(PUBLIC_DIR, 'css');
const JS_DIR = path.join(PUBLIC_DIR, 'js');

// CSS files to download
const CSS_FILES = [
  {
    url: '/wp-content/plugins/elementor/assets/css/frontend.min.css',
    local: 'css/elementor/frontend.min.css'
  },
  {
    url: '/wp-content/uploads/elementor/css/post-1229.css',
    local: 'css/elementor/post-1229.css'
  },
  {
    url: '/wp-content/uploads/elementor/css/post-186.css',
    local: 'css/elementor/post-186.css'
  },
  {
    url: '/wp-content/uploads/elementor/css/post-85.css',
    local: 'css/elementor/post-85.css'
  },
  {
    url: '/wp-content/plugins/elementor/assets/lib/font-awesome/css/font-awesome.min.css',
    local: 'css/fontawesome/font-awesome.min.css'
  },
  {
    url: '/wp-content/plugins/elementor/assets/lib/swiper/v8/css/swiper.min.css',
    local: 'css/swiper/swiper.min.css'
  },
  {
    url: '/wp-content/plugins/happy-elementor-addons/assets/fonts/style.min.css',
    local: 'css/addons/style.min.css'
  },
  {
    url: '/wp-content/themes/hello-elementor/style.min.css',
    local: 'css/theme/style.min.css'
  },
  {
    url: '/wp-content/themes/hello-elementor/theme.min.css',
    local: 'css/theme/theme.min.css'
  }
];

// JavaScript files to download
const JS_FILES = [
  {
    url: '/wp-content/plugins/elementor/assets/lib/swiper/v8/swiper.min.js',
    local: 'js/elementor/swiper.min.js'
  },
  {
    url: '/wp-content/plugins/elementor/assets/js/webpack.runtime.min.js',
    local: 'js/elementor/webpack.runtime.min.js'
  },
  {
    url: '/wp-content/plugins/elementor/assets/js/frontend-modules.min.js',
    local: 'js/elementor/frontend-modules.min.js'
  },
  {
    url: '/wp-content/plugins/elementor/assets/js/frontend.min.js',
    local: 'js/elementor/frontend.min.js'
  },
  {
    url: '/wp-content/plugins/mega-elements-addons-for-elementor/includes/widgets/meafe-post-carousel/post-carousel.js',
    local: 'js/addons/post-carousel.js'
  }
];

interface DownloadResult {
  url: string;
  local: string;
  success: boolean;
  size?: number;
  error?: string;
}

/**
 * Download a file from URL using puppeteer and save to local path
 */
async function downloadFile(page: any, url: string, localPath: string): Promise<DownloadResult> {
  const fullUrl = url.startsWith('http') ? url : `${WORDPRESS_BASE_URL}${url}`;
  const fullPath = path.join(PUBLIC_DIR, localPath);

  try {
    console.log(`Downloading: ${fullUrl}`);

    // Ensure directory exists
    await fs.mkdir(path.dirname(fullPath), { recursive: true });

    // Download file using puppeteer
    const response = await page.goto(fullUrl, {
      waitUntil: 'networkidle2',
      timeout: 30000
    });

    if (!response) {
      throw new Error('No response from server');
    }

    if (!response.ok()) {
      throw new Error(`HTTP ${response.status()}: ${response.statusText()}`);
    }

    // Get content
    const content = await response.text();

    // Save to file
    await fs.writeFile(fullPath, content, 'utf-8');

    // Get file size
    const stats = await fs.stat(fullPath);

    console.log(`✅ Saved: ${localPath} (${formatBytes(stats.size)})`);

    return {
      url: fullUrl,
      local: localPath,
      success: true,
      size: stats.size
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ Failed: ${fullUrl} - ${errorMessage}`);

    return {
      url: fullUrl,
      local: localPath,
      success: false,
      error: errorMessage
    };
  }
}

/**
 * Format bytes to human-readable format
 */
function formatBytes(bytes: number): string {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return Math.round(bytes / Math.pow(k, i) * 100) / 100 + ' ' + sizes[i];
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 WordPress Asset Download Starting...\n');
  console.log(`Source: ${WORDPRESS_BASE_URL}`);
  console.log(`Target: ${PUBLIC_DIR}\n`);

  // Launch browser
  console.log('🌐 Launching browser...');
  const browser = await puppeteer.launch({
    headless: true,
    args: ['--no-sandbox', '--disable-setuid-sandbox']
  });
  const page = await browser.newPage();
  console.log('✅ Browser ready\n');

  const results: DownloadResult[] = [];

  try {
    // Download CSS files
    console.log('📦 Downloading CSS files...\n');
    for (const file of CSS_FILES) {
      const result = await downloadFile(page, file.url, file.local);
      results.push(result);
    }

    console.log('\n📦 Downloading JavaScript files...\n');
    for (const file of JS_FILES) {
      const result = await downloadFile(page, file.url, file.local);
      results.push(result);
    }
  } finally {
    await browser.close();
    console.log('\n🌐 Browser closed');
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 Download Summary');
  console.log('='.repeat(80));

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);

  console.log(`\n✅ Successful: ${successful.length}/${results.length}`);
  console.log(`❌ Failed: ${failed.length}/${results.length}`);

  if (successful.length > 0) {
    const totalSize = successful.reduce((sum, r) => sum + (r.size || 0), 0);
    console.log(`📦 Total Size: ${formatBytes(totalSize)}`);
  }

  if (failed.length > 0) {
    console.log('\n⚠️  Failed Downloads:');
    failed.forEach(f => {
      console.log(`  - ${f.url}`);
      console.log(`    Error: ${f.error}`);
    });
  }

  // Create manifest file
  const manifest = {
    downloadedAt: new Date().toISOString(),
    source: WORDPRESS_BASE_URL,
    cssFiles: CSS_FILES.length,
    jsFiles: JS_FILES.length,
    results: results.map(r => ({
      url: r.url,
      local: r.local,
      success: r.success,
      size: r.size,
      error: r.error
    }))
  };

  const manifestPath = path.join(PUBLIC_DIR, 'wordpress-assets-manifest.json');
  await fs.writeFile(manifestPath, JSON.stringify(manifest, null, 2));
  console.log(`\n📄 Manifest saved: ${manifestPath}`);

  if (failed.length === 0) {
    console.log('\n✅ All assets downloaded successfully!');
    console.log('\nNext steps:');
    console.log('1. Update replica page.tsx files to use local paths');
    console.log('2. Test production build: cd generated-site && npm run build');
    console.log('3. Deploy to Vercel');
  } else {
    console.log('\n⚠️  Some assets failed to download. Please review errors above.');
    process.exit(1);
  }
}

// Run
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

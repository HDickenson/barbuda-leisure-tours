import { chromium } from 'playwright';

(async () => {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1920, height: 1080 } });

  // Screenshot local site
  console.log('Taking screenshot of local site...');
  await page.goto('http://localhost:3003', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'qc-local.png', fullPage: true });
  console.log('Local screenshot saved to qc-local.png');

  // Screenshot WordPress site
  console.log('Taking screenshot of WordPress site...');
  await page.goto('https://www.barbudaleisure.com', { waitUntil: 'networkidle' });
  await page.screenshot({ path: 'qc-wordpress.png', fullPage: true });
  console.log('WordPress screenshot saved to qc-wordpress.png');

  await browser.close();
  console.log('Done!');
})();

import { test, expect } from '@playwright/test';
import fs from 'fs';
import path from 'path';
import PNG from 'pngjs';
import pixelmatch from 'pixelmatch';

// Configuration
const THRESHOLD = 10; // 10% max mismatch
const HEIGHT_TOLERANCE = 0.05; // 5% height variance

const OUTPUT_DIR = path.join(__dirname, '..', 'visual-regression');
const LIVE_BASE = 'https://www.barbudaleisure.com';
const LOCAL_BASE = 'http://localhost:3000';

// Page configurations
const PAGES = [
  { name: 'home', local: '/', live: '/' },
  { name: 'reviews', local: '/reviews', live: '/reviews/' },
  { name: 'blog', local: '/our-blog', live: '/our-blog/' },
  { name: 'faq', local: '/faq', live: '/elementor-416/' },
  { name: 'tour-detail', local: '/tours/discover-barbuda-by-air', live: '/product/discover-barbuda-by-air/' },
  { name: 'terms', local: '/terms-and-conditions', live: '/terms-and-conditions/' },
  { name: 'cancellation', local: '/refund_returns', live: '/refund_returns/' }
];

// Masking CSS to disable animations and mask dynamic content
const MASKING_CSS = `
  *, *::before, *::after {
    animation-duration: 0s !important;
    transition-duration: 0s !important;
  }
  #whatsapp-widget, .grecaptcha-badge, [class*="cookie"] { display: none !important; }
  .elementor-slideshow__slide, .swiper-slide, .hero-carousel .slideBackground,
  [class*="carousel"] [class*="slide"] {
    background-image: none !important;
    background-color: #cccccc !important;
  }
  .elementor-background-overlay, [class*="overlay"] { opacity: 0 !important; }
`;

// Ensure output directory exists
if (!fs.existsSync(OUTPUT_DIR)) {
  fs.mkdirSync(OUTPUT_DIR, { recursive: true });
}

test.describe('Visual Regression Tests', () => {
  test.setTimeout(120000); // 2 minutes per test

  for (const page of PAGES) {
    test(`${page.name} should match live site within ${THRESHOLD}%`, async ({ browser }) => {
      const context = await browser.newContext({ viewport: { width: 1920, height: 1080 } });
      const browserPage = await context.newPage();

      // Capture Live
      await browserPage.goto(`${LIVE_BASE}${page.live}`, { waitUntil: 'domcontentloaded', timeout: 90000 });
      await browserPage.addStyleTag({ content: MASKING_CSS });
      await autoScroll(browserPage);
      await browserPage.evaluate(() => window.scrollTo(0, 0));
      await browserPage.waitForTimeout(1000);
      await browserPage.screenshot({ path: path.join(OUTPUT_DIR, `${page.name}-live.png`), fullPage: true });

      // Capture Local
      await browserPage.goto(`${LOCAL_BASE}${page.local}`, { waitUntil: 'domcontentloaded', timeout: 60000 });
      await browserPage.addStyleTag({ content: MASKING_CSS });
      await autoScroll(browserPage);
      await browserPage.evaluate(() => window.scrollTo(0, 0));
      await browserPage.waitForTimeout(1000);
      await browserPage.screenshot({ path: path.join(OUTPUT_DIR, `${page.name}-local.png`), fullPage: true });

      // Compare
      const img1 = PNG.PNG.sync.read(fs.readFileSync(path.join(OUTPUT_DIR, `${page.name}-live.png`)));
      const img2 = PNG.PNG.sync.read(fs.readFileSync(path.join(OUTPUT_DIR, `${page.name}-local.png`)));
      const { width } = img1;
      const minHeight = Math.min(img1.height, img2.height);

      const diff = new PNG.PNG({ width, height: minHeight });
      const img1Cropped = new PNG.PNG({ width, height: minHeight });
      PNG.PNG.bitblt(img1, img1Cropped, 0, 0, width, minHeight, 0, 0);
      const img2Cropped = new PNG.PNG({ width, height: minHeight });
      PNG.PNG.bitblt(img2, img2Cropped, 0, 0, width, minHeight, 0, 0);

      const numDiffPixels = pixelmatch(
        img1Cropped.data,
        img2Cropped.data,
        diff.data,
        width,
        minHeight,
        { threshold: 0.1 }
      );

      fs.writeFileSync(path.join(OUTPUT_DIR, `${page.name}-diff.png`), PNG.PNG.sync.write(diff));

      const mismatchPercentage = (numDiffPixels / (width * minHeight)) * 100;
      const heightVariance = Math.abs(img1.height - img2.height) / img1.height;

      console.log(`${page.name}: ${mismatchPercentage.toFixed(2)}% mismatch, ${(heightVariance * 100).toFixed(2)}% height variance`);

      // Assertions
      expect(mismatchPercentage, `${page.name} mismatch exceeds ${THRESHOLD}%`).toBeLessThanOrEqual(THRESHOLD);
      expect(heightVariance, `${page.name} height variance exceeds ${HEIGHT_TOLERANCE * 100}%`).toBeLessThanOrEqual(HEIGHT_TOLERANCE);

      await context.close();
    });
  }
});

async function autoScroll(page: any) {
  await page.evaluate(async () => {
    await new Promise<void>((resolve) => {
      let totalHeight = 0;
      const distance = 100;
      const timer = setInterval(() => {
        const scrollHeight = document.body.scrollHeight;
        window.scrollBy(0, distance);
        totalHeight += distance;
        if (totalHeight >= scrollHeight - window.innerHeight) {
          clearInterval(timer);
          resolve();
        }
      }, 50);
    });
  });
}

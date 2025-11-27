#!/usr/bin/env node
import { chromium } from 'playwright';

async function extract(url) {
  const browser = await chromium.launch();
  const page = await browser.newPage({ viewport: { width: 1280, height: 800 } });
  try {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 60000 });
    // make sure we're at the top of the page for consistent detection
    await page.waitForTimeout(500);
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.waitForTimeout(300);
  } catch (e) {
    await browser.close();
    return { error: `page.goto: ${e.message}` };
  }

  const data = await page.evaluate(() => {
    // Try common hero selectors first
    let hero = document.querySelector('.hero-carousel, section.hero, .hero');

    // Fallback: find first large element near the top of the page (likely the hero)
    if (!hero) {
      const candidates = Array.from(document.querySelectorAll('body *'))
        .map(el => ({ el, r: el.getBoundingClientRect() }))
        .filter(x => x.r && x.r.height > 250 && x.r.top >= 0 && x.r.top < 300)
        .sort((a, b) => a.r.top - b.r.top);

      if (candidates.length) hero = candidates[0].el;
    }
    const result = {};
    if (!hero) return { error: 'hero-not-found' };

    // overlay and heading can be inside the hero OR in a sibling overlay wrapper
    const parent = hero.closest('.relative') || document;
    const overlay = (hero.querySelector('.hero-carousel-overlay, .overlay, .elementor-background-overlay, .elementor-background-overlay')
      || parent.querySelector('.hero-carousel-overlay, .overlay, .elementor-background-overlay, .elementor-background-overlay'));

    const heading = (hero.querySelector('h1, h2, .mainHeading')
      || parent.querySelector('h1, h2, .mainHeading'));
    const wave = hero.closest('.relative')?.querySelector('.wave-divider, .elementor-shape');

    const cs = (el) => (el ? getComputedStyle(el) : null);

    result.heroBox = hero.getBoundingClientRect();
    result.heroStyles = cs(hero) ? {
      height: cs(hero).height,
      paddingTop: cs(hero).paddingTop,
      paddingBottom: cs(hero).paddingBottom,
    } : null;

    result.overlay = overlay ? {
      opacity: cs(overlay).opacity,
      backgroundColor: cs(overlay).backgroundColor
    } : null;

    result.heading = heading ? {
      text: heading.textContent?.trim().slice(0, 100),
      fontSize: cs(heading).fontSize,
      fontFamily: cs(heading).fontFamily,
      color: cs(heading).color,
      marginTop: cs(heading).marginTop
    } : null;

    result.wave = wave ? {
      className: wave.className,
      inlineStyle: wave.getAttribute('style'),
      computedHeight: getComputedStyle(wave).height,
      bbox: wave.getBoundingClientRect().toJSON()
    } : null;

    // extract header styles (useful for top-of-page diffs)
    const header = parent.querySelector('header') || document.querySelector('header');
    const headerCS = header ? getComputedStyle(header) : null;

    result.header = header ? {
      height: headerCS.height,
      background: headerCS.backgroundColor,
      position: headerCS.position
    } : null;

    return result;
  });

  await browser.close();
  return data;
}

(async () => {
  const local = 'http://localhost:3000';
  const live = 'https://www.barbudaleisure.com/';

  console.log('Extracting local hero...');
  const l = await extract(local).catch(e => ({error: e.message}));

  console.log('Extracting live hero...');
  const s = await extract(live).catch(e => ({error: e.message}));

  console.log('\n--- LOCAL HERO ---');
  console.dir(l, {depth: null});
  console.log('\n--- LIVE HERO ---');
  console.dir(s, {depth: null});
})();

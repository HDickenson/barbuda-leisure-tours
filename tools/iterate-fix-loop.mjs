#!/usr/bin/env node
/*
 * iterate-fix-loop.mjs
 * Deterministic iterate loop: for each page run live extraction and local extraction and produce a structured diff report
 * - Uses Playwright to fetch pages and compute a simple, deterministic structure snapshot
 * - Outputs JSON report per page: live.json, local.json, diff.json
 * - Produces screenshots using the existing visual-regression artifacts if available
 * Notes: safe, non-destructive — this only generates reports showing differences so you can decide edits.
 */

import fs from 'fs';
import path from 'path';
import { chromium } from 'playwright';

const pagesToProcess = [
  { name: 'home', live: 'https://www.barbudaleisure.com/', local: 'http://localhost:3000' },
  { name: 'reviews', live: 'https://www.barbudaleisure.com/reviews/', local: 'http://localhost:3000/reviews' },
  { name: 'our-tours', live: 'https://www.barbudaleisure.com/our-tours/', local: 'http://localhost:3000/our-tours' },
  { name: 'tour-detail', live: 'https://www.barbudaleisure.com/product/discover-barbuda-by-air/', local: 'http://localhost:3000/tours/discover-barbuda-by-air' },
  { name: 'faq', live: 'https://www.barbudaleisure.com/elementor-416/', local: 'http://localhost:3000/faq' },
  { name: 'terms', live: 'https://www.barbudaleisure.com/terms-and-conditions/', local: 'http://localhost:3000/terms-and-conditions' },
  { name: 'cancellation', live: 'https://www.barbudaleisure.com/refund_returns/', local: 'http://localhost:3000/refund_returns' },
  { name: 'blog', live: 'https://www.barbudaleisure.com/our-blog/', local: 'http://localhost:3000/our-blog' }
];

const outputRoot = path.resolve(process.cwd(), 'iterate-reports');
if (!fs.existsSync(outputRoot)) fs.mkdirSync(outputRoot, { recursive: true });

function snapshotStructure(doc) {
  // Simplified deterministic snapshot: collect top-level semantic sections and their order
  const sections = [];
  const nodes = Array.from(doc.querySelectorAll('main > section, main > div.section, header, footer, main > header, main > article'));

  if (nodes.length === 0) {
    // fallback: gather first-level children of body
    doc.body.childNodes && Array.from(doc.body.childNodes).forEach((n) => {
      if (n.nodeType === 1) {
        const el = n;
        sections.push({ tag: el.tagName, className: el.className || null, id: el.id || null, textSnippet: (el.textContent||'').trim().slice(0,120) });
      }
    });
  } else {
    nodes.forEach((el) => {
      sections.push({ tag: el.tagName, className: el.className || null, id: el.id || null, textSnippet: (el.textContent||'').trim().slice(0,120) });
    });
  }

  // capture footer header details too
  const header = doc.querySelector('header');
  const footer = doc.querySelector('footer');

  return { header: header ? { tag: 'HEADER', className: header.className||null } : null, sections, footer: footer ? { tag: 'FOOTER', className: footer.className||null } : null };
}

async function capture(url, name, dest) {
  const browser = await chromium.launch({ headless: true });
  try {
    const page = await browser.newPage();
    const res = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45000 }).catch(err => { return { ok: false, err: err.message }; });
    if (!res || (res && res.err)) {
      console.warn(`Warning: couldn't fetch ${url}: ${res && res.err ? res.err : 'no response'}`);
    }

    // snapshot DOM structure
    const snapshot = await page.evaluate(() => {
      function getElInfo(el) {
        return {
          tag: el.tagName,
          id: el.id || null,
          className: el.className || null,
          role: el.getAttribute ? el.getAttribute('role') : null,
          ariaLabel: el.getAttribute ? el.getAttribute('aria-label') : null,
          bbox: el.getBoundingClientRect ? (() => {
            const r = el.getBoundingClientRect();
            return { top: Math.round(r.top), left: Math.round(r.left), width: Math.round(r.width), height: Math.round(r.height) };
          })() : null
        }
      }

      const header = document.querySelector('header');
      const footer = document.querySelector('footer');

      const candidates = Array.from(document.querySelectorAll('main > section, main > header, main > article, main > div'))
        .slice(0, 40)
        .map(getElInfo);

      return {
        title: document.title,
        url: location.href,
        header: header ? getElInfo(header) : null,
        contentCandidates: candidates,
        footer: footer ? getElInfo(footer) : null
      };
    });

    // screenshot for visual comparison
    const screenshotPath = path.join(dest, `${name}-screenshot.png`);
    try {
      await page.screenshot({ path: screenshotPath, fullPage: true });
    } catch (e) {
      console.warn('screenshot failed:', e.message);
    }

    // save page HTML for inspections
    const html = await page.content();
    fs.writeFileSync(path.join(dest, `${name}.html`), html);

    await page.close();
    await browser.close();
    return { snapshot };
  } catch (err) {
    try { await browser.close(); } catch(e) {}
    throw err;
  }
}

function compareSnapshots(live, local) {
  const report = { differences: [] };

  // Compare header className
  if (live.header?.className !== local.header?.className) {
    report.differences.push({ type: 'header.className', live: live.header?.className || null, local: local.header?.className || null });
  }

  // Compare footer className
  if (live.footer?.className !== local.footer?.className) {
    report.differences.push({ type: 'footer.className', live: live.footer?.className || null, local: local.footer?.className || null });
  }

  // Compare contentCandidates order by tag+class
  const mk = (c) => `${c.tag}::${c.className||''}`;
  const liveOrder = (live.contentCandidates||[]).map(mk);
  const localOrder = (local.contentCandidates||[]).map(mk);

  // Find first index mismatch
  let firstMismatch = -1;
  for (let i=0;i<Math.max(liveOrder.length, localOrder.length);i++) {
    if (liveOrder[i] !== localOrder[i]) { firstMismatch = i; break; }
  }

  if (firstMismatch >= 0) {
    report.differences.push({ type: 'content.order', index: firstMismatch, liveAtIndex: liveOrder[firstMismatch]||null, localAtIndex: localOrder[firstMismatch]||null });
  }

  // Compute items that exist locally but not on live (by tag/class signature)
  const liveSet = new Set(liveOrder);
  const localExtra = localOrder.filter(x => !liveSet.has(x));
  if (localExtra.length) report.differences.push({ type: 'local.only.nodes', nodes: localExtra.slice(0,10) });

  // Items on live missing locally
  const localSet = new Set(localOrder);
  const liveMissing = liveOrder.filter(x => !localSet.has(x));
  if (liveMissing.length) report.differences.push({ type: 'live.only.nodes', nodes: liveMissing.slice(0,10) });

  return report;
}

(async () => {
  const root = outputRoot;
  for (const p of pagesToProcess) {
    console.log('\n--- processing', p.name);
    const pageDir = path.join(root, p.name);
    if (!fs.existsSync(pageDir)) fs.mkdirSync(pageDir, { recursive: true });

    // Capture live
    console.log('Capturing live:', p.live);
    let liveSnapshot = null;
    try {
      const liveCaptured = await capture(p.live, 'live', pageDir);
      liveSnapshot = liveCaptured.snapshot;
      fs.writeFileSync(path.join(pageDir, 'live.snapshot.json'), JSON.stringify(liveSnapshot, null, 2));
    } catch (e) {
      console.error('Live capture failed for', p.live, e.message || e);
    }

    // Capture local
    console.log('Capturing local:', p.local);
    let localSnapshot = null;
    try {
      const localCaptured = await capture(p.local, 'local', pageDir);
      localSnapshot = localCaptured.snapshot;
      fs.writeFileSync(path.join(pageDir, 'local.snapshot.json'), JSON.stringify(localSnapshot, null, 2));
    } catch (e) {
      console.error('Local capture failed for', p.local, e.message || e);
    }

    if (liveSnapshot && localSnapshot) {
      const diff = compareSnapshots(liveSnapshot, localSnapshot);
      fs.writeFileSync(path.join(pageDir, 'diff.json'), JSON.stringify(diff, null, 2));
      console.log('Differences for', p.name, '->', diff.differences.length, 'entries');
    } else {
      console.warn('Skipping diff - missing one snapshot');
    }

    // Visual diffs: report if pre-existing visual-regression images are available
    const vrDir = path.join(process.cwd(), 'visual-regression');
    const localImage = path.join('visual-regression', `${p.name}-local.png`);
    const liveImage = path.join('visual-regression', `${p.name}-live.png`);
    if (fs.existsSync(path.join(process.cwd(), localImage)) && fs.existsSync(path.join(process.cwd(), liveImage))) {
      const out = path.join(pageDir, `${p.name}-sbs.png`);
      // prefer existing side-by-side tooling if available
      try {
        const mkside = path.join(process.cwd(), 'tools', 'make-side-by-side.mjs');
        if (fs.existsSync(mkside)) {
          // run the side-by-side script (node spawn) synchronously
          const { execSync } = await import('child_process');
          try {
            execSync(`node "${mkside}" "${path.join(process.cwd(), liveImage)}" "${path.join(process.cwd(), localImage)}" "${out}"`, { stdio: 'inherit' });
          } catch (e) {
            // ignore
          }
        }
      } catch (e) {
        // ignore
      }
    }
  }

  console.log('\nAll pages processed. Reports written to', outputRoot);
})();

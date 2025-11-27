#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import { PNG } from 'pngjs';

const DIR = path.join(process.cwd(), 'visual-regression');
const OUT = path.join(DIR, 'side-by-side');
if (!fs.existsSync(DIR)) {
  console.error('visual-regression folder not found — run the visual-regression script first');
  process.exit(1);
}
fs.mkdirSync(OUT, { recursive: true });

function readPng(file) {
  if (!fs.existsSync(file)) return null;
  const buf = fs.readFileSync(file);
  return PNG.sync.read(buf);
}

function writePng(img, outPath) {
  const buf = PNG.sync.write(img);
  fs.writeFileSync(outPath, buf);
}

function concatHoriz(images) {
  // images: array of PNG objects (or null). Use transparent blank if missing.
  const widths = images.map(i => (i ? i.width : 0));
  const heights = images.map(i => (i ? i.height : 0));
  const outW = Math.max(1, widths.reduce((a,b)=>a+b,0));
  const outH = Math.max(...heights, 1);

  const out = new PNG({ width: outW, height: outH });
  let xOff = 0;

  images.forEach(img => {
    if (!img) {
      // leave transparent canvas area of same width (we'll use a default width of 1280 if missing)
      xOff += 0;
      return;
    }

    for (let y = 0; y < img.height; y++) {
      for (let x = 0; x < img.width; x++) {
        const srcIdx = (img.width * y + x) << 2;
        const dstIdx = (out.width * y + (x + xOff)) << 2;
        out.data[dstIdx] = img.data[srcIdx];
        out.data[dstIdx+1] = img.data[srcIdx+1];
        out.data[dstIdx+2] = img.data[srcIdx+2];
        out.data[dstIdx+3] = img.data[srcIdx+3];
      }
    }

    xOff += img.width;
  });

  return out;
}

// Find pages by discovering files matching *-live.png
const files = fs.readdirSync(DIR);
const liveFiles = files.filter(f => f.endsWith('-live.png'));
if (liveFiles.length === 0) {
  console.error('No *-live.png images found in visual-regression — run visual-regression first');
  process.exit(1);
}

const pages = liveFiles.map(f => f.replace('-live.png', ''));

const results = [];
for (const p of pages) {
  const livePath = path.join(DIR, `${p}-live.png`);
  const localPath = path.join(DIR, `${p}-local.png`);
  const diffPath = path.join(DIR, `${p}-diff.png`);

  const live = readPng(livePath);
  const local = readPng(localPath);
  const diff = readPng(diffPath);

  // pick max height to normalize — pad smaller images automatically by our concat impl
  const images = [live, diff, local];

  // if a particular image missing, still create concatenated result using available ones
  const concat = concatHoriz(images.filter(Boolean));

  // Write output name
  const outName = `${p}-side-by-side.png`;
  const outPath = path.join(OUT, outName);
  writePng(concat, outPath);

  results.push({ page: p, out: path.relative(process.cwd(), outPath) });
  console.log(`Created: ${outPath}`);
}

// generate a simple HTML index
const rows = results.map(r => `
  <section style="margin:28px 0;">
    <h2 style="margin:0 0 6px 0">${r.page}</h2>
    <img src="${r.out}" style="max-width:100%; border:1px solid #ddd; box-shadow:0 6px 18px rgba(0,0,0,0.12)"/>
    <p style="color:#666;font-size:13px;margin:6px 0 0 0">left: live | mid: diff | right: local</p>
  </section>
`).join('\n');

const index = `<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><title>Side-by-side visual diffs</title></head><body style="font-family:system-ui,Segoe UI,Roboto,Helvetica,Arial;margin:24px;">
<h1>Side-by-side visual diffs (live | diff | local)</h1>
${rows}
</body></html>`;

fs.writeFileSync(path.join(OUT, 'index.html'), index);
console.log('\nHTML index written to visual-regression/side-by-side/index.html');

#!/usr/bin/env node

import fs from 'fs';
import path from 'path';
import PNG from 'pngjs';

function analyze(diffPath) {
  if (!fs.existsSync(diffPath)) {
    console.error('Not found:', diffPath);
    process.exit(2);
  }

  const buf = fs.readFileSync(diffPath);
  const img = PNG.PNG.sync.read(buf);
  const { width, height, data } = img;

  let diffPixels = 0;
  let topPixels = 0;
  const topLimit = Math.floor(height * 0.35); // top 35% treated as hero

  let minX = width, minY = height, maxX = 0, maxY = 0;

  for (let y = 0; y < height; y++) {
    for (let x = 0; x < width; x++) {
      const idx = (width * y + x) << 2;
      const r = data[idx];
      const g = data[idx + 1];
      const b = data[idx + 2];
      const a = data[idx + 3];

      // Consider pixel different if alpha > 0 and not black
      if (a > 0 && (r || g || b)) {
        diffPixels++;
        if (y <= topLimit) topPixels++;
        minX = Math.min(minX, x);
        minY = Math.min(minY, y);
        maxX = Math.max(maxX, x);
        maxY = Math.max(maxY, y);
      }
    }
  }

  const percentTop = ((topPixels / Math.max(1, diffPixels)) * 100).toFixed(2);
  console.log('File:', diffPath);
  console.log('Dims:', width, 'x', height);
  console.log('Diff pixels:', diffPixels.toLocaleString());
  console.log('Top-region diff pixels (<=35% height):', topPixels.toLocaleString(), `(${percentTop}%)`);
  console.log('BBox:', minX, minY, maxX, maxY);
}

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error('Usage: analyze-visual-diff.mjs <diff.png> [more]');
  process.exit(1);
}

for (const p of args) analyze(p);

#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import PNG from 'pngjs';

if (process.argv.length < 3) {
  console.error('Usage: find-diff-hotspots.mjs <diff.png>');
  process.exit(1);
}

const file = process.argv[2];
if (!fs.existsSync(file)) {
  console.error('File not found:', file);
  process.exit(2);
}

const buf = fs.readFileSync(file);
const img = PNG.PNG.sync.read(buf);
const { width, height, data } = img;

const cols = 12;
const rows = Math.max(3, Math.floor(height / 400));
const tileW = Math.ceil(width / cols);
const tileH = Math.ceil(height / rows);

const tiles = [];

for (let r = 0; r < rows; r++) {
  for (let c = 0; c < cols; c++) {
    const x0 = c * tileW;
    const y0 = r * tileH;
    const w = Math.min(tileW, width - x0);
    const h = Math.min(tileH, height - y0);

    let px = 0;
    for (let y = y0; y < y0 + h; y++) {
      for (let x = x0; x < x0 + w; x++) {
        const idx = (width * y + x) << 2;
        const rch = data[idx];
        const gch = data[idx+1];
        const bch = data[idx+2];
        const ach = data[idx+3];
        if (ach>0 && (rch||gch||bch)) px++;
      }
    }

    tiles.push({ r, c, x: x0, y: y0, w, h, diffPixels: px, area: w*h, percent: (px / (w*h))*100 });
  }
}

tiles.sort((a,b)=>b.diffPixels - a.diffPixels);

console.log('Image:', file);
console.log('Dims:', width, 'x', height);
console.log('Tile grid:', cols, 'x', rows);
console.log('\nTop hotspots:');
tiles.slice(0, 12).forEach((t, idx) => {
  console.log(`#${idx+1} tile r${t.r} c${t.c} at ${t.x},${t.y} size ${t.w}x${t.h} diffPixels=${t.diffPixels.toLocaleString()} (${t.percent.toFixed(2)}%)`);
});

// Optionally save a CSV
const csv = tiles.map(t => `${t.r},${t.c},${t.x},${t.y},${t.w},${t.h},${t.diffPixels},${t.percent.toFixed(2)}`).join('\n');
fs.writeFileSync(path.join(path.dirname(file), 'tile-hotspots.csv'), csv);
console.log('\nCSV written to tile-hotspots.csv');

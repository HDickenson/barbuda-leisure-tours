#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { spawnSync } from 'child_process';

// visual-iterate.mjs
// Conservative automatic visual tuning for front-page hero placement.
// Strategy (conservative):
//  - For a small set of candidate adjustments (change .textBox top in HeroCarousel.module.css by +/- 0.5% steps),
//    apply change, run visual regression, parse home/reviews mismatch percentages from stdout, pick best.
//  - Make a backup of the CSS file and write the chosen change as final (or restore original if no improvement).
//  - DO NOT alter content or assets.

const projectRoot = process.cwd();
const cssFile = path.join(projectRoot, 'barbuda-local', 'src', 'components', 'HeroCarousel.module.css');
if (!fs.existsSync(cssFile)) {
  console.error('Hero CSS not found at', cssFile);
  process.exit(1);
}

const original = fs.readFileSync(cssFile, 'utf8');
const backupPath = cssFile + '.bak.' + Date.now();
fs.writeFileSync(backupPath, original);
console.log('Created backup:', backupPath);

// Utility to set a new top value (percentage) for .textBox
function setTextBoxTop(content, newTop) {
  // find the .textBox block and replace the "top: 45%;" line
  const reTop = /top:\s*[-0-9\.]+%\s*;/m;
  if (!reTop.test(content)) {
    // fallback to insert if not present
    return content.replace(/(\.textBox\s*\{)/m, `$1\n  top: ${newTop}%;`);
  }
  return content.replace(reTop, `top: ${newTop}%;`);
}

// Candidate adjustments (percent values) - keep conservative small range around current 45
const candidates = [44, 44.5, 45, 45.5, 46, 46.5];
const resultRows = [];

for (const candidate of candidates) {
  console.log('\nTesting candidate top:', candidate + '%');
  const updated = setTextBoxTop(original, candidate);
  fs.writeFileSync(cssFile, updated);

  // run visual regression and parse stdout
  // Use absolute path to the run script
  const runner = path.join(projectRoot, 'barbuda-local', 'run-visual-regression.mjs');
  console.log('Running visual-regression ... (this will take a while)');
  const child = spawnSync('node', [runner], { cwd: projectRoot, encoding: 'utf8', maxBuffer: 1024 * 1024 * 20 });
  if (child.error) {
    console.error('Error running visual-regression', child.error);
    // revert and continue
    fs.writeFileSync(cssFile, original);
    continue;
  }

  const out = (child.stdout || '') + '\n' + (child.stderr || '');
  // example lines contain 'Processing page: home...' then 'Mismatch: 64.20%'
  // We'll extract the last 'Mismatch:' occurrences for home and reviews
  const lines = out.split(/\r?\n/).map(l=>l.trim()).filter(Boolean);
  const mismatches = {};
  for (const line of lines) {
    const m = line.match(/^Mismatch:\s*([0-9]+\.[0-9]+)%/);
    if (m) {
      // The script prints Mismatch for each page in sequence; we need to track the last page context
      // Let's also look back for the "Processing page:" line
      const idx = lines.indexOf(line);
      let page = 'unknown';
      // search backwards for "Processing page: <name>"
      for (let i = idx - 1; i >= 0; i--) {
        const pm = lines[i].match(/^Processing page:\s*(\S+)/);
        if (pm) { page = pm[1]; break; }
      }
      mismatches[page] = parseFloat(m[1]);
    }
  }

  console.log('Observed Mismatches:', mismatches);
  resultRows.push({ candidate, mismatches });
}

// Choose best candidate by minimizing (home + reviews) mismatch (if present)
let best = null;
for (const r of resultRows) {
  const home = r.mismatches.home || 999;
  const reviews = r.mismatches.reviews || 999;
  const score = home + reviews;
  if (!best || score < best.score) best = { candidate: r.candidate, score, home, reviews };
}

console.log('\nBest candidate:', best);

if (best && best.candidate !== null) {
  console.log('Applying best candidate top:', best.candidate + '%');
  const updated = setTextBoxTop(original, best.candidate);
  fs.writeFileSync(cssFile, updated);
  console.log('Best change applied to', cssFile, '(backup saved)');
} else {
  console.log('No improvement found — restoring original file');
  fs.writeFileSync(cssFile, original);
}

console.log('\nDone. Run run-visual-regression.mjs to validate final results.');

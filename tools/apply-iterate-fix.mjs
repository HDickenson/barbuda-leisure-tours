#!/usr/bin/env node
// apply-iterate-fix.mjs
// Read iterate-reports/* and produce deterministic, non-destructive fix suggestions.
// Dry-run by default. Re-run with --apply to apply changes (creates .bak backups).

import fs from 'fs';
import path from 'path';

const reportsRoot = path.resolve(process.cwd(), 'barbuda-local', 'barbuda-local', 'iterate-reports');
const appRoot = path.resolve(process.cwd(), 'barbuda-local', 'src', 'app');
const args = process.argv.slice(2);
const APPLY = args.includes('--apply');

if (!fs.existsSync(reportsRoot)) {
  console.error('Reports not found at', reportsRoot);
  process.exit(1);
}

function safeBackup(filePath) {
  const ts = Date.now();
  const backup = `${filePath}.bak.${ts}`;
  fs.copyFileSync(filePath, backup);
  return backup;
}

function removeSectionByClass(fileContent, classPattern) {
  // naive string approach: find occurrences of <section ... className="...pattern..." ...> and remove from <section...> to matching </section>
  // This is heuristic and only intended for predictable patterns produced by the page templates.
  const pattern = new RegExp(`<section[^>]*${classPattern}[^>]*>[\s\S]*?<\/section>`, 'g');
  const matches = [...fileContent.matchAll(pattern)];
  if (matches.length === 0) return { updated: fileContent, removedCount: 0 };
  let updated = fileContent;
  for (const m of matches) {
    updated = updated.replace(m[0], '\n');
  }
  return { updated, removedCount: matches.length };
}

function reorderSections(fileContent, desiredOrder) {
  // desiredOrder is an array of short keys like 'SECTION::className'
  // We'll identify blocks for each section by searching for the className substring and collect them in the desired order; then reconstruct only those blocks, leaving other content in place.
  const sectionPattern = /(<section[\s\S]*?>[\s\S]*?<\/section>)/g;
  const allSections = fileContent.match(sectionPattern) || [];
  if (allSections.length === 0) return { updated: fileContent, reordered: false };

  // Map by key
  function keyForSection(sec) {
    // look for className="..."
    const cls = sec.match(/class(Name)?=\"([^\"]+)\"/i);
    if (cls && cls[2]) {
      return `SECTION::${cls[2].split(/\s+/)[0]}`; // use first token
    }
    // fallback use tag
    return `SECTION::${sec.slice(0,40).replace(/\n/g,' ').slice(0,20)}`;
  }

  const map = new Map();
  for (const s of allSections) map.set(keyForSection(s), s);

  const reorderedBlocks = [];
  let matchedCount = 0;
  for (const key of desiredOrder) {
    if (map.has(key)) { reorderedBlocks.push(map.get(key)); matchedCount++; map.delete(key); }
  }

  // append remaining sections that were not part of desiredOrder in original order
  for (const [k,v] of map.entries()) reorderedBlocks.push(v);

  if (matchedCount === 0) return { updated: fileContent, reordered: false };

  // Replace the first area where multiple consecutive sections were found with reordered content.
  // For a safer approach, find the index of the first matched section in original string
  const firstMatchedKey = desiredOrder.find(k=>map.has(k)===false);
  let firstMatchedIdx = -1;
  for (const sec of allSections) {
    if (sec.includes(typeof firstMatchedKey === 'string' ? firstMatchedKey.replace('SECTION::','') : '')) { firstMatchedIdx = fileContent.indexOf(sec); break; }
  }

  // simple replacement: replace all section blocks sequence with reordered content
  let updated = fileContent;
  // remove allSections in order
  for (const sec of allSections) updated = updated.replace(sec, '___SECTION_PLACEHOLDER___');
  // Now replace placeholders sequentially
  for (const block of reorderedBlocks) {
    updated = updated.replace('___SECTION_PLACEHOLDER___', block);
  }
  // remove any remaining placeholders
  updated = updated.replace(/___SECTION_PLACEHOLDER___/g, '\n');

  return { updated, reordered: true };
}

// Scan reports
const pages = fs.readdirSync(reportsRoot).filter(x=>fs.statSync(path.join(reportsRoot,x)).isDirectory());
const summary = [];

for (const pageName of pages) {
  const pageDir = path.join(reportsRoot, pageName);
  const diffFile = path.join(pageDir, 'diff.json');
  if (!fs.existsSync(diffFile)) continue;
  const diff = JSON.parse(fs.readFileSync(diffFile,'utf-8'));

  // Common file locations for page implementations (try multiple patterns)
  const mappedName = (pageName === 'home') ? '' : (pageName === 'blog' ? 'our-blog' : (pageName === 'terms' ? 'terms-and-conditions' : (pageName === 'cancellation' ? 'refund_returns' : pageName)));
  const pagePathCandidates = [
    // root page (home) or folder-based pages
    path.join(appRoot, mappedName || 'page.tsx'),
    path.join(appRoot, mappedName, 'page.tsx'),
    path.join(appRoot, mappedName + '.tsx'), // fallback
    path.join(appRoot, mappedName, 'page.js'),
    path.join(appRoot, mappedName, 'page.jsx')
  ];
  const pageFile = pagePathCandidates.find(f => fs.existsSync(f) && fs.statSync(f).isFile());
  if (!pageFile) {
    summary.push({ page: pageName, status: 'no-page-file', note: 'page.tsx not found - skipping' });
    continue;
  }

  if (pageName === 'tour-detail') {
    summary.push({ page: pageName, status: 'skipped-dynamic', note: 'dynamic tours skip; no auto-changes made' });
    continue;
  }

  const pageSrc = fs.readFileSync(pageFile,'utf8');
  let updated = pageSrc;
  let anyChange = false;
  const actions = [];

  // Process local.only.nodes -> remove
  const localOnly = diff.differences.find(d=>d.type==='local.only.nodes');
  if (localOnly && localOnly.nodes && localOnly.nodes.length) {
    for (const nodeKey of localOnly.nodes) {
      // nodeKey format like SECTION::relative h-96 ... -> we will use the class substring after '::'
      const parts = nodeKey.split('::');
      const cls = parts[1];
      if (!cls) continue;
      // create class token to search for
      const firstToken = cls.split(/\s+/)[0].replace(/[\[\]\(\)]/g,'');
      const classPattern = firstToken;
      const tryRemove = removeSectionByClass(updated, classPattern);
      if (tryRemove.removedCount > 0) {
        updated = tryRemove.updated; anyChange = true; actions.push({ action: 'removed', class: classPattern, count: tryRemove.removedCount });
      }
    }
  }

  // Reorder content if content.order exists
  const co = diff.differences.find(d=>d.type==='content.order');
  if (co) {
    // Attempt to read live snapshot to get desired order keys
    const liveSnapshotPath = path.join(pageDir, 'live.snapshot.json');
    const localSnapshotPath = path.join(pageDir, 'local.snapshot.json');

    if (fs.existsSync(liveSnapshotPath) && fs.existsSync(localSnapshotPath)) {
      const live = JSON.parse(fs.readFileSync(liveSnapshotPath,'utf8'));
      const local = JSON.parse(fs.readFileSync(localSnapshotPath,'utf8'));
      const mk = (c) => `${c.tag}::${(c.className||'').split(/\s+/)[0]}`;
      const desiredOrder = (live.contentCandidates||[]).map(mk).slice(0,6);
      const { updated: reorderedContent, reordered } = reorderSections(updated, desiredOrder);
      if (reordered) { updated = reorderedContent; anyChange = true; actions.push({ action: 'reordered', page: pageName, matched: desiredOrder.length }); }
    }
  }

  if (anyChange) {
    if (APPLY) {
      const bak = safeBackup(pageFile);
      fs.writeFileSync(pageFile, updated);
      summary.push({ page: pageName, status: 'applied', backup: bak, actions });
    } else {
      summary.push({ page: pageName, status: 'dry-run', actions });
    }
  } else {
    summary.push({ page: pageName, status: 'no-change', note: 'No safe modifications suggested' });
  }
}

console.log('\nApply report (dry-run unless --apply passed):\n', JSON.stringify(summary, null, 2));

if (!APPLY) console.log('\nTo apply changes, re-run with --apply (creates .bak backups).');

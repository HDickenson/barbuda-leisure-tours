#!/usr/bin/env node
import { readFileSync } from 'node:fs';
import { execSync } from 'node:child_process';
import path from 'node:path';

function npmViewDeprecated(pkg) {
  try {
    const out = execSync(`npm view ${pkg} deprecated`, { stdio: ['ignore', 'pipe', 'ignore'] })
      .toString()
      .trim();
    return out || null;
  } catch {
    return null;
  }
}

const pkgJsonPath = path.resolve(process.cwd(), 'package.json');
const pkg = JSON.parse(readFileSync(pkgJsonPath, 'utf8'));
const names = new Set([
  ...Object.keys(pkg.dependencies || {}),
  ...Object.keys(pkg.devDependencies || {}),
]);

const results = [];
for (const name of names) {
  const dep = npmViewDeprecated(name);
  if (dep) results.push({ name, message: dep });
}

if (results.length === 0) {
  console.log('No deprecated direct dependencies found.');
  process.exit(0);
}

console.log('Deprecated direct dependencies:');
for (const r of results) {
  console.log(`- ${r.name}: ${r.message}`);
}
process.exit(1);

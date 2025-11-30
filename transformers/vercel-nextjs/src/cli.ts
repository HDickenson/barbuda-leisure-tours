#!/usr/bin/env node
/**
 * CLI for transforming Elementor extractions to Next.js/Vercel format
 */

import { transformAllPages } from './transformer';
import { resolve } from 'path';

const args = process.argv.slice(2);

if (args.length < 2) {
  console.log(`
Usage: node cli.ts <input-dir> <output-dir>

Example:
  node cli.ts ../../extractors/elementor/output ./output

Arguments:
  input-dir   Directory containing extracted Elementor JSON files
  output-dir  Directory to output transformed Next.js components
  `);
  process.exit(1);
}

const inputDir = resolve(args[0]);
const outputDir = resolve(args[1]);

console.log('Elementor to Next.js/Vercel Transformer');
console.log('======================================\n');
console.log(`Input:  ${inputDir}`);
console.log(`Output: ${outputDir}`);

try {
  transformAllPages(inputDir, outputDir);
} catch (error) {
  console.error('\n❌ Error during transformation:', error);
  process.exit(1);
}

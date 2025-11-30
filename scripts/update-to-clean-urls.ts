#!/usr/bin/env tsx

/**
 * Update to Clean URLs
 *
 * Remove /original prefix from all URLs and update navigation
 */

import * as fs from 'fs/promises';
import * as path from 'path';

const REPLACEMENTS = [
  // Navigation component - clean URLs
  {
    from: /{ name: 'Home', href: '\/original' }/g,
    to: "{ name: 'Home', href: '/' }",
    description: 'Navigation: /original → /'
  },
  {
    from: /{ name: 'Reviews', href: '\/original-reviews' }/g,
    to: "{ name: 'Reviews', href: '/reviews' }",
    description: 'Navigation: /original-reviews → /reviews'
  },
  {
    from: /{ name: 'FAQ', href: '\/original-faq' }/g,
    to: "{ name: 'FAQ', href: '/faq' }",
    description: 'Navigation: /original-faq → /faq'
  },
  {
    from: /{ name: 'About Us', href: '\/original-about' }/g,
    to: "{ name: 'About Us', href: '/about' }",
    description: 'Navigation: /original-about → /about'
  },

  // Internal links in pages
  {
    from: /href="\/original\/"/g,
    to: 'href="/"',
    description: 'Links: /original/ → /'
  },
  {
    from: /href="\/original-reviews\/"/g,
    to: 'href="/reviews/"',
    description: 'Links: /original-reviews/ → /reviews/'
  },
  {
    from: /href="\/original-faq\/"/g,
    to: 'href="/faq/"',
    description: 'Links: /original-faq/ → /faq/'
  },
  {
    from: /href="\/original-about\/"/g,
    to: 'href="/about/"',
    description: 'Links: /original-about/ → /about/'
  },
];

const FILES_TO_UPDATE = [
  'generated-site/app/components/Navigation.tsx',
  'generated-site/app/page.tsx',
  'generated-site/app/about/page.tsx',
  'generated-site/app/reviews/page.tsx',
  'generated-site/app/faq/page.tsx',
];

async function updateFile(filePath: string) {
  const fullPath = path.join(process.cwd(), filePath);

  try {
    console.log(`\n📝 Processing: ${filePath}`);

    let content = await fs.readFile(fullPath, 'utf-8');
    const originalContent = content;
    let changes = 0;

    for (const replacement of REPLACEMENTS) {
      const matches = content.match(replacement.from);
      if (matches) {
        content = content.replace(replacement.from, replacement.to);
        changes += matches.length;
        console.log(`  ✅ ${replacement.description} (${matches.length}x)`);
      }
    }

    if (content !== originalContent) {
      await fs.writeFile(fullPath, content, 'utf-8');
      console.log(`✅ Updated: ${filePath} (${changes} changes)`);
    } else {
      console.log(`⚪ No changes: ${filePath}`);
    }

    return changes;
  } catch (error) {
    console.error(`❌ Failed: ${filePath} - ${error}`);
    return 0;
  }
}

async function main() {
  console.log('🚀 Updating to Clean URLs...\n');

  let totalChanges = 0;

  for (const file of FILES_TO_UPDATE) {
    totalChanges += await updateFile(file);
  }

  console.log(`\n✅ Complete! Total changes: ${totalChanges}`);
  console.log('\nNew URL structure:');
  console.log('  / → Homepage (replica with animations)');
  console.log('  /about/ → About page');
  console.log('  /reviews/ → Reviews page');
  console.log('  /faq/ → FAQ page');
  console.log('  /tours/ → Tours section');
  console.log('  /blog/ → Blog section');
}

main().catch(console.error);

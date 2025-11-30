#!/usr/bin/env tsx

/**
 * Fix All Links Across The Site
 *
 * This script updates all broken links to point to the correct pages:
 * - Replica pages: /original, /original-about, /original-faq, /original-reviews, /original-tours, /original-blog
 * - Tours pages: /tours, /tours/{slug}
 * - Blog pages: /blog, /blog/{slug}
 */

import * as fs from 'fs/promises';
import * as path from 'path';

interface Replacement {
  from: RegExp;
  to: string;
  description: string;
}

const REPLACEMENTS: Replacement[] = [
  // Navigation component - update routes to replica pages
  {
    from: /{ name: 'Home', href: '\/' }/g,
    to: "{ name: 'Home', href: '/original' }",
    description: 'Navigation: Home → /original'
  },
  {
    from: /{ name: 'Reviews', href: '\/reviews' }/g,
    to: "{ name: 'Reviews', href: '/original-reviews' }",
    description: 'Navigation: Reviews → /original-reviews'
  },
  {
    from: /{ name: 'FAQ', href: '\/faq' }/g,
    to: "{ name: 'FAQ', href: '/original-faq' }",
    description: 'Navigation: FAQ → /original-faq'
  },
  {
    from: /{ name: 'About Us', href: '\/about' }/g,
    to: "{ name: 'About Us', href: '/original-about' }",
    description: 'Navigation: About → /original-about'
  },

  // Replica pages - fix WordPress URLs to Next.js routes
  {
    from: /href="https:\/\/www\.barbudaleisure\.com\/"/g,
    to: 'href="/original/"',
    description: 'Replica: WordPress home → /original/'
  },
  {
    from: /href="https:\/\/www\.barbudaleisure\.com\/our-tours\/"/g,
    to: 'href="/tours/"',
    description: 'Replica: WordPress tours → /tours/'
  },
  {
    from: /href="https:\/\/www\.barbudaleisure\.com\/reviews\/"/g,
    to: 'href="/original-reviews/"',
    description: 'Replica: WordPress reviews → /original-reviews/'
  },
  {
    from: /href="https:\/\/www\.barbudaleisure\.com\/elementor-416\/"/g,
    to: 'href="/original-faq/"',
    description: 'Replica: WordPress FAQ → /original-faq/'
  },
  {
    from: /href="https:\/\/www\.barbudaleisure\.com\/our-blog\/"/g,
    to: 'href="/blog/"',
    description: 'Replica: WordPress blog → /blog/'
  },
  {
    from: /href="https:\/\/www\.barbudaleisure\.com\/about-us\/"/g,
    to: 'href="/original-about/"',
    description: 'Replica: WordPress about → /original-about/'
  },

  // Tour product links → tour pages
  {
    from: /href="https:\/\/www\.barbudaleisure\.com\/product\/discover-barbuda-by-sea\/"/g,
    to: 'href="/tours/discover-barbuda-by-sea/"',
    description: 'Replica: Product link → /tours/discover-barbuda-by-sea/'
  },
  {
    from: /href="https:\/\/www\.barbudaleisure\.com\/product\/discover-barbuda-by-air\/"/g,
    to: 'href="/tours/discover-barbuda-by-air/"',
    description: 'Replica: Product link → /tours/discover-barbuda-by-air/'
  },
  {
    from: /href="https:\/\/www\.barbudaleisure\.com\/product\/private-charter-by-air\/"/g,
    to: 'href="/tours/airplane-adventure/"',
    description: 'Replica: Private charter air → /tours/airplane-adventure/'
  },
  {
    from: /href="https:\/\/www\.barbudaleisure\.com\/product\/private-charter-by-sea\/"/g,
    to: 'href="/tours/yacht-adventure/"',
    description: 'Replica: Private charter sea → /tours/yacht-adventure/'
  },

  // Blog post links → blog pages
  {
    from: /href="https:\/\/www\.barbudaleisure\.com\/discover-the-enchanting-island-of-barbuda-with-barbuda-leisure-day-tours-2\/"/g,
    to: 'href="/blog/discover-the-enchanting-island-of-barbuda/"',
    description: 'Replica: Blog post → /blog/discover-the-enchanting-island-of-barbuda/'
  },

  // Skip links - update to current page
  {
    from: /href="https:\/\/www\.barbudaleisure\.com\/#content"/g,
    to: 'href="#content"',
    description: 'Replica: Skip link to content'
  },

  // Contact links (these don't exist, redirect to tours with booking form)
  {
    from: /href="\/contact"/g,
    to: 'href="/tours#booking"',
    description: 'Contact → Tours booking section'
  },
];

const FILES_TO_UPDATE = [
  'generated-site/app/components/Navigation.tsx',
  'generated-site/app/(standalone)/original/page.tsx',
  'generated-site/app/(standalone)/original-about/page.tsx',
  'generated-site/app/(standalone)/original-blog/page.tsx',
  'generated-site/app/(standalone)/original-faq/page.tsx',
  'generated-site/app/(standalone)/original-reviews/page.tsx',
  'generated-site/app/(standalone)/original-tours/page.tsx',
];

interface UpdateResult {
  file: string;
  replacements: number;
  changes: string[];
  success: boolean;
  error?: string;
}

async function updateFile(filePath: string): Promise<UpdateResult> {
  const result: UpdateResult = {
    file: filePath,
    replacements: 0,
    changes: [],
    success: false
  };

  try {
    const fullPath = path.join(process.cwd(), filePath);

    console.log(`\n📝 Processing: ${filePath}`);

    // Read file
    let content = await fs.readFile(fullPath, 'utf-8');
    const originalContent = content;

    // Apply replacements
    for (const replacement of REPLACEMENTS) {
      const matches = content.match(replacement.from);
      if (matches) {
        content = content.replace(replacement.from, replacement.to);
        const count = matches.length;
        result.replacements += count;
        result.changes.push(`  ✅ ${replacement.description} (${count}x)`);
        console.log(`  ✅ ${replacement.description} (${count}x)`);
      }
    }

    // Write back if changes were made
    if (content !== originalContent) {
      await fs.writeFile(fullPath, content, 'utf-8');
      result.success = true;
      console.log(`✅ Updated: ${filePath} (${result.replacements} changes)`);
    } else {
      result.success = true;
      console.log(`⚪ No changes needed: ${filePath}`);
    }

    return result;
  } catch (error) {
    result.error = error instanceof Error ? error.message : String(error);
    console.error(`❌ Failed: ${filePath} - ${result.error}`);
    return result;
  }
}

async function main() {
  console.log('🚀 Fixing All Links Across The Site...\n');
  console.log(`Files to update: ${FILES_TO_UPDATE.length}`);
  console.log(`Replacements defined: ${REPLACEMENTS.length}\n`);
  console.log('='.repeat(80));

  const results: UpdateResult[] = [];

  // Process each file
  for (const file of FILES_TO_UPDATE) {
    const result = await updateFile(file);
    results.push(result);
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 Update Summary');
  console.log('='.repeat(80));

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  const totalChanges = results.reduce((sum, r) => sum + r.replacements, 0);

  console.log(`\n✅ Successful: ${successful.length}/${results.length}`);
  console.log(`❌ Failed: ${failed.length}/${results.length}`);
  console.log(`🔄 Total Changes: ${totalChanges}`);

  if (totalChanges > 0) {
    console.log('\n📋 Changes Made:');
    results.forEach(r => {
      if (r.changes.length > 0) {
        console.log(`\n${r.file}:`);
        r.changes.forEach(change => console.log(change));
      }
    });
  }

  if (failed.length > 0) {
    console.log('\n⚠️  Failed Files:');
    failed.forEach(f => {
      console.log(`  - ${f.file}`);
      console.log(`    Error: ${f.error}`);
    });
  }

  console.log('\n✅ All links fixed!');
  console.log('\nNext steps:');
  console.log('1. Test navigation: cd generated-site && npm run dev');
  console.log('2. Rebuild: cd generated-site && npm run build');
  console.log('3. Deploy: vercel --prod');
}

// Run
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

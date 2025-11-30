#!/usr/bin/env tsx

/**
 * Update Replica Page Asset Paths
 *
 * This script updates all replica page.tsx files to use local CSS/JS paths
 * instead of external WordPress URLs.
 */

import * as fs from 'fs/promises';
import * as path from 'path';

const REPLICA_PAGES = [
  'generated-site/app/(standalone)/original/page.tsx',
  'generated-site/app/(standalone)/original-about/page.tsx',
  'generated-site/app/(standalone)/original-blog/page.tsx',
  'generated-site/app/(standalone)/original-faq/page.tsx',
  'generated-site/app/(standalone)/original-reviews/page.tsx',
  'generated-site/app/(standalone)/original-tours/page.tsx',
];

const REPLACEMENTS = [
  // CSS Files
  {
    from: 'https://www.barbudaleisure.com/wp-content/plugins/elementor/assets/css/frontend.min.css',
    to: '/css/elementor/frontend.min.css'
  },
  {
    from: 'https://www.barbudaleisure.com/wp-content/uploads/elementor/css/post-1229.css',
    to: '/css/elementor/post-1229.css'
  },
  {
    from: 'https://www.barbudaleisure.com/wp-content/uploads/elementor/css/post-186.css',
    to: '/css/elementor/post-186.css'
  },
  {
    from: 'https://www.barbudaleisure.com/wp-content/uploads/elementor/css/post-85.css',
    to: '/css/elementor/post-85.css'
  },
  {
    from: 'https://www.barbudaleisure.com/wp-content/plugins/elementor/assets/lib/font-awesome/css/font-awesome.min.css',
    to: '/css/fontawesome/font-awesome.min.css'
  },
  {
    from: 'https://www.barbudaleisure.com/wp-content/plugins/elementor/assets/lib/swiper/v8/css/swiper.min.css',
    to: '/css/swiper/swiper.min.css'
  },
  {
    from: 'https://www.barbudaleisure.com/wp-content/plugins/happy-elementor-addons/assets/fonts/style.min.css',
    to: '/css/addons/style.min.css'
  },
  {
    from: 'https://www.barbudaleisure.com/wp-content/themes/hello-elementor/style.min.css',
    to: '/css/theme/style.min.css'  // Even though it 404'd, keep the reference
  },
  {
    from: 'https://www.barbudaleisure.com/wp-content/themes/hello-elementor/theme.min.css',
    to: '/css/theme/theme.min.css'  // Even though it 404'd, keep the reference
  },
  // JavaScript Files
  {
    from: 'https://www.barbudaleisure.com/wp-content/plugins/elementor/assets/lib/swiper/v8/swiper.min.js',
    to: '/js/elementor/swiper.min.js'
  },
  {
    from: 'https://www.barbudaleisure.com/wp-content/plugins/elementor/assets/js/webpack.runtime.min.js',
    to: '/js/elementor/webpack.runtime.min.js'
  },
  {
    from: 'https://www.barbudaleisure.com/wp-content/plugins/elementor/assets/js/frontend-modules.min.js',
    to: '/js/elementor/frontend-modules.min.js'
  },
  {
    from: 'https://www.barbudaleisure.com/wp-content/plugins/elementor/assets/js/frontend.min.js',
    to: '/js/elementor/frontend.min.js'
  },
  {
    from: 'https://www.barbudaleisure.com/wp-content/plugins/mega-elements-addons-for-elementor/includes/widgets/meafe-post-carousel/post-carousel.js',
    to: '/js/addons/post-carousel.js'
  },
];

interface UpdateResult {
  file: string;
  success: boolean;
  replacements: number;
  error?: string;
}

/**
 * Update a single file with new asset paths
 */
async function updateFile(filePath: string): Promise<UpdateResult> {
  try {
    const fullPath = path.join(process.cwd(), filePath);

    console.log(`📝 Processing: ${filePath}`);

    // Read file
    let content = await fs.readFile(fullPath, 'utf-8');
    let replacementCount = 0;

    // Apply all replacements
    for (const replacement of REPLACEMENTS) {
      const regex = new RegExp(replacement.from.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);

      if (matches) {
        content = content.replace(regex, replacement.to);
        replacementCount += matches.length;
        console.log(`  ✅ Replaced: ${replacement.from} → ${replacement.to} (${matches.length}x)`);
      }
    }

    // Write updated content back
    if (replacementCount > 0) {
      await fs.writeFile(fullPath, content, 'utf-8');
      console.log(`✅ Updated: ${filePath} (${replacementCount} replacements)\n`);
    } else {
      console.log(`⚪ No changes needed: ${filePath}\n`);
    }

    return {
      file: filePath,
      success: true,
      replacements: replacementCount
    };
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error(`❌ Failed: ${filePath} - ${errorMessage}\n`);

    return {
      file: filePath,
      success: false,
      replacements: 0,
      error: errorMessage
    };
  }
}

/**
 * Main execution
 */
async function main() {
  console.log('🚀 Updating Replica Page Asset Paths...\n');
  console.log(`Pages to update: ${REPLICA_PAGES.length}`);
  console.log(`Replacements defined: ${REPLACEMENTS.length}\n`);

  const results: UpdateResult[] = [];

  // Process each file
  for (const page of REPLICA_PAGES) {
    const result = await updateFile(page);
    results.push(result);
  }

  // Summary
  console.log('='.repeat(80));
  console.log('📊 Update Summary');
  console.log('='.repeat(80));

  const successful = results.filter(r => r.success);
  const failed = results.filter(r => !r.success);
  const totalReplacements = results.reduce((sum, r) => sum + r.replacements, 0);

  console.log(`\n✅ Successful: ${successful.length}/${results.length}`);
  console.log(`❌ Failed: ${failed.length}/${results.length}`);
  console.log(`🔄 Total Replacements: ${totalReplacements}`);

  if (failed.length > 0) {
    console.log('\n⚠️  Failed Updates:');
    failed.forEach(f => {
      console.log(`  - ${f.file}`);
      console.log(`    Error: ${f.error}`);
    });
  }

  console.log('\n✅ All replica pages updated to use local asset paths!');
  console.log('\nNext steps:');
  console.log('1. Test production build: cd generated-site && npm run build');
  console.log('2. Verify styling works in production mode');
  console.log('3. Deploy to Vercel');
}

// Run
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

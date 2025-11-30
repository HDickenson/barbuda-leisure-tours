#!/usr/bin/env tsx

/**
 * Run Elementor Parser on Replica Pages
 *
 * This script should have been run initially to extract Elementor structure
 * from the replica pages before generating Next.js components.
 *
 * Process:
 * 1. Read replica page HTML
 * 2. Parse Elementor structure using widget-analyzer
 * 3. Extract background slideshow settings
 * 4. Extract widget data (headings, images, buttons, etc.)
 * 5. Generate proper React components with animations
 * 6. Apply design tokens and CSS
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { ElementorParser } from '../packages/widget-analyzer/src/elementor-parser.js';

const REPLICA_PAGES = [
  {
    file: 'generated-site/app/page.tsx',
    route: '/',
    name: 'Homepage'
  },
  {
    file: 'generated-site/app/about/page.tsx',
    route: '/about',
    name: 'About'
  },
  {
    file: 'generated-site/app/reviews/page.tsx',
    route: '/reviews',
    name: 'Reviews'
  },
  {
    file: 'generated-site/app/faq/page.tsx',
    route: '/faq',
    name: 'FAQ'
  }
];

interface ElementorAnalysis {
  page: string;
  route: string;
  sections: number;
  widgets: number;
  hasSlideshow: boolean;
  slideshowImages?: number;
  slideshowSettings?: any;
  backgroundAnimations: string[];
  widgetTypes: Record<string, number>;
}

async function main() {
  console.log('\n🔍 Elementor Parser Analysis\n');
  console.log('=' .repeat(80));
  console.log('\nAnalyzing replica pages for Elementor structure...\n');

  const parser = new ElementorParser();
  const analyses: ElementorAnalysis[] = [];

  for (const page of REPLICA_PAGES) {
    try {
      console.log(`\n📄 ${page.name} (${page.route})`);
      console.log('-'.repeat(80));

      // Read page file
      const content = await fs.readFile(page.file, 'utf-8');

      // Check if it's Elementor
      const isElementor = parser.isElementorPage(content);
      console.log(`   Elementor page: ${isElementor ? '✅ Yes' : '❌ No'}`);

      if (!isElementor) {
        console.log('   ⚠️  Not an Elementor page - skipping\n');
        continue;
      }

      // Extract structure
      const structure = parser.extractElementorStructure(content);

      console.log(`   Sections: ${structure.sections.length}`);
      console.log(`   Widgets: ${structure.widgets.length}`);

      // Analyze widgets
      const widgetTypes: Record<string, number> = {};
      structure.widgets.forEach(widget => {
        widgetTypes[widget.widgetType] = (widgetTypes[widget.widgetType] || 0) + 1;
      });

      console.log('\n   Widget Types:');
      Object.entries(widgetTypes)
        .sort((a, b) => b[1] - a[1])
        .forEach(([type, count]) => {
          console.log(`     - ${type}: ${count}`);
        });

      // Check for slideshows
      const backgroundAnimations: string[] = [];
      let hasSlideshow = false;
      let slideshowImages = 0;
      let slideshowSettings: any = null;

      structure.sections.forEach(section => {
        if (section.background?.type === 'slideshow') {
          hasSlideshow = true;

          // Extract slideshow settings from data-settings
          const settingsMatch = content.match(/data-settings="([^"]*background_slideshow[^"]*)"/);
          if (settingsMatch) {
            try {
              // Decode HTML entities
              const decoded = settingsMatch[1]
                .replace(/&quot;/g, '"')
                .replace(/&amp;/g, '&')
                .replace(/&#039;/g, "'")
                .replace(/&lt;/g, '<')
                .replace(/&gt;/g, '>');

              slideshowSettings = JSON.parse(decoded);

              if (slideshowSettings.background_slideshow_gallery) {
                slideshowImages = slideshowSettings.background_slideshow_gallery.length;
              }

              backgroundAnimations.push('slideshow');
              if (slideshowSettings.background_slideshow_ken_burns === 'yes') {
                backgroundAnimations.push('ken-burns');
              }
            } catch (e) {
              console.log(`     ⚠️  Failed to parse slideshow settings: ${e}`);
            }
          }
        }
      });

      console.log('\n   Background:');
      console.log(`     Slideshow: ${hasSlideshow ? '✅ Yes' : '❌ No'}`);
      if (hasSlideshow) {
        console.log(`     Images: ${slideshowImages}`);
        console.log(`     Animations: ${backgroundAnimations.join(', ')}`);

        if (slideshowSettings) {
          console.log(`     Duration: ${slideshowSettings.background_slideshow_slide_duration || 5000}ms`);
          console.log(`     Transition: ${slideshowSettings.background_slideshow_slide_transition || 'fade'}`);
          console.log(`     Transition Duration: ${slideshowSettings.background_slideshow_transition_duration || 500}ms`);
        }
      }

      // Store analysis
      analyses.push({
        page: page.name,
        route: page.route,
        sections: structure.sections.length,
        widgets: structure.widgets.length,
        hasSlideshow,
        slideshowImages,
        slideshowSettings,
        backgroundAnimations,
        widgetTypes
      });

    } catch (error) {
      console.error(`\n   ❌ Error analyzing ${page.name}:`, error);
    }
  }

  // Summary
  console.log('\n' + '='.repeat(80));
  console.log('📊 Analysis Summary\n');

  const totalSections = analyses.reduce((sum, a) => sum + a.sections, 0);
  const totalWidgets = analyses.reduce((sum, a) => sum + a.widgets, 0);
  const pagesWithSlideshows = analyses.filter(a => a.hasSlideshow).length;

  console.log(`Total Pages Analyzed: ${analyses.length}`);
  console.log(`Total Sections: ${totalSections}`);
  console.log(`Total Widgets: ${totalWidgets}`);
  console.log(`Pages with Slideshows: ${pagesWithSlideshows}`);

  // Save analysis
  const outputPath = path.join('data', 'elementor-analysis.json');
  await fs.writeFile(outputPath, JSON.stringify(analyses, null, 2));
  console.log(`\n✅ Analysis saved to: ${outputPath}\n`);

  // Recommendations
  console.log('='.repeat(80));
  console.log('💡 Recommendations\n');

  console.log('The current replica pages have Elementor markup but are not properly parsed.');
  console.log('To fix this, you need to:\n');
  console.log('1. ❌ Current: Raw HTML with Elementor data attributes');
  console.log('2. ✅ Should be: Proper React components with:');
  console.log('   - Decoded slideshow settings');
  console.log('   - Swiper.js initialization');
  console.log('   - Ken Burns animations');
  console.log('   - Widget-specific React components');
  console.log('   - Design token application\n');

  console.log('Next Steps:');
  console.log('1. Run: tsx scripts/phase4-section-reconstructor.ts');
  console.log('2. Run: tsx scripts/phase4-widget-mapper.ts');
  console.log('3. Run: tsx scripts/phase4-design-applicator.ts');
  console.log('4. Verify: npm run build && npm run dev\n');
}

main().catch(console.error);

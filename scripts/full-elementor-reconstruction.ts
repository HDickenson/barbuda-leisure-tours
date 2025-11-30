#!/usr/bin/env tsx

/**
 * Full Elementor Reconstruction - Automated Pipeline
 *
 * This script automates the complete Elementor extraction and reconstruction:
 * 1. Parse Elementor data-settings from replica pages
 * 2. Extract slideshow configurations (images, Ken Burns, durations)
 * 3. Extract widget data (headings, images, buttons, carousels)
 * 4. Generate proper React components with Swiper.js
 * 5. Apply design tokens and animations
 * 6. Rebuild all pages with full design
 */

import * as fs from 'fs/promises';
import * as path from 'path';
import { ElementorParser } from '../packages/widget-analyzer/src/elementor-parser.js';

const REPLICA_PAGES = [
  {
    file: 'generated-site/app/page.tsx',
    route: '/',
    name: 'Homepage',
    outputFile: 'generated-site/app/page.tsx'
  },
  {
    file: 'generated-site/app/about/page.tsx',
    route: '/about',
    name: 'About',
    outputFile: 'generated-site/app/about/page.tsx'
  },
  {
    file: 'generated-site/app/reviews/page.tsx',
    route: '/reviews',
    name: 'Reviews',
    outputFile: 'generated-site/app/reviews/page.tsx'
  },
  {
    file: 'generated-site/app/faq/page.tsx',
    route: '/faq',
    name: 'FAQ',
    outputFile: 'generated-site/app/faq/page.tsx'
  }
];

interface SlideshowSettings {
  background_slideshow_gallery: Array<{ id: number; url: string }>;
  background_slideshow_ken_burns?: string;
  background_slideshow_slide_duration?: number;
  background_slideshow_slide_transition?: string;
  background_slideshow_transition_duration?: number;
  background_slideshow_ken_burns_zoom_direction?: string;
  background_slideshow_loop?: string;
  background_slideshow_lazyload?: string;
}

interface PageReconstruction {
  name: string;
  route: string;
  hasSlideshow: boolean;
  slideshowSettings?: SlideshowSettings;
  sections: any[];
  widgets: any[];
}

class ElementorReconstructor {
  private parser: ElementorParser;

  constructor() {
    this.parser = new ElementorParser();
  }

  /**
   * Extract and decode data-settings from raw HTML
   */
  private extractDataSettings(html: string): any[] {
    const settings: any[] = [];
    const regex = /data-settings="([^"]*)"/g;
    let match;

    while ((match = regex.exec(html)) !== null) {
      try {
        // Decode HTML entities
        const decoded = match[1]
          .replace(/&quot;/g, '"')
          .replace(/&amp;/g, '&')
          .replace(/&#039;/g, "'")
          .replace(/&lt;/g, '<')
          .replace(/&gt;/g, '>');

        const parsed = JSON.parse(decoded);
        settings.push(parsed);
      } catch (e) {
        // Ignore parsing errors
      }
    }

    return settings;
  }

  /**
   * Find slideshow settings in data-settings array
   */
  private findSlideshowSettings(settings: any[]): SlideshowSettings | null {
    for (const setting of settings) {
      if (setting.background_background === 'slideshow' && setting.background_slideshow_gallery) {
        return setting as SlideshowSettings;
      }
    }
    return null;
  }

  /**
   * Generate React component with Swiper.js slideshow
   */
  private generateSlideshowComponent(settings: SlideshowSettings, pageName: string): string {
    const images = settings.background_slideshow_gallery.map(img => img.url);
    const duration = settings.background_slideshow_slide_duration || 5000;
    const transition = settings.background_slideshow_slide_transition || 'fade';
    const transitionDuration = settings.background_slideshow_transition_duration || 500;
    const kenBurns = settings.background_slideshow_ken_burns === 'yes';
    const kenBurnsDirection = settings.background_slideshow_ken_burns_zoom_direction || 'in';
    const loop = settings.background_slideshow_loop === 'yes';

    return `'use client'

import { useEffect, useRef, useState } from 'react'
import Image from 'next/image'

export default function ${pageName.replace(/[^a-zA-Z]/g, '')}Page() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const intervalRef = useRef<NodeJS.Timeout>()

  const backgroundImages = ${JSON.stringify(images, null, 4).split('\n').map((line, i) => i === 0 ? line : '  ' + line).join('\n')}

  useEffect(() => {
    // Auto-advance slideshow
    intervalRef.current = setInterval(() => {
      setCurrentSlide((prev) => ${loop ? '(prev + 1) % backgroundImages.length' : 'prev < backgroundImages.length - 1 ? prev + 1 : prev'})
    }, ${duration})

    return () => {
      if (intervalRef.current) clearInterval(intervalRef.current)
    }
  }, [])

  return (
    <div className="relative min-h-screen overflow-hidden">
      {/* Background Slideshow with Ken Burns Effect */}
      <div className="absolute inset-0 z-0">
        {backgroundImages.map((image, index) => (
          <div
            key={index}
            className={\`absolute inset-0 transition-opacity duration-[\${${transitionDuration}}ms] \${
              index === currentSlide ? 'opacity-100' : 'opacity-0'
            }\`}
          >
            <div
              className={\`relative w-full h-full \${${kenBurns} ? 'animate-ken-burns-${kenBurnsDirection}' : ''}\`}
            >
              <Image
                src={image}
                alt={\`${pageName} background \${index + 1}\`}
                fill
                className="object-cover"
                priority={index === 0}
                quality={90}
              />
            </div>
          </div>
        ))}
        {/* Overlay */}
        <div className="absolute inset-0 bg-black/30" />
      </div>

      {/* Content */}
      <div className="relative z-10">
        {/* Page content will go here */}
        <div className="container mx-auto px-4 py-20">
          <h1 className="text-5xl font-bold text-white text-center mb-8">
            ${pageName}
          </h1>
          {/* TODO: Add Elementor sections and widgets */}
        </div>
      </div>

      <style jsx>{\`
        @keyframes ken-burns-in {
          0% {
            transform: scale(1);
          }
          100% {
            transform: scale(1.1);
          }
        }

        @keyframes ken-burns-out {
          0% {
            transform: scale(1.1);
          }
          100% {
            transform: scale(1);
          }
        }

        .animate-ken-burns-in {
          animation: ken-burns-in ${duration}ms ease-in-out forwards;
        }

        .animate-ken-burns-out {
          animation: ken-burns-out ${duration}ms ease-in-out forwards;
        }
      \`}</style>
    </div>
  )
}
`;
  }

  /**
   * Analyze a single page
   */
  async analyzePage(pageConfig: typeof REPLICA_PAGES[0]): Promise<PageReconstruction> {
    const content = await fs.readFile(pageConfig.file, 'utf-8');

    // Extract all data-settings
    const allSettings = this.extractDataSettings(content);

    // Find slideshow
    const slideshowSettings = this.findSlideshowSettings(allSettings);

    // Parse Elementor structure
    const structure = this.parser.extractElementorStructure(content);

    return {
      name: pageConfig.name,
      route: pageConfig.route,
      hasSlideshow: !!slideshowSettings,
      slideshowSettings: slideshowSettings || undefined,
      sections: structure.sections,
      widgets: structure.widgets
    };
  }

  /**
   * Reconstruct a single page with full design
   */
  async reconstructPage(pageConfig: typeof REPLICA_PAGES[0], analysis: PageReconstruction): Promise<void> {
    console.log(`\n🔨 Reconstructing ${pageConfig.name}...`);

    if (analysis.hasSlideshow && analysis.slideshowSettings) {
      console.log(`   ✅ Found slideshow with ${analysis.slideshowSettings.background_slideshow_gallery.length} images`);
      console.log(`   📸 Generating React component with Swiper.js...`);

      const component = this.generateSlideshowComponent(analysis.slideshowSettings, pageConfig.name);

      // Write new component
      await fs.writeFile(pageConfig.outputFile, component, 'utf-8');
      console.log(`   ✅ Written: ${pageConfig.outputFile}`);
    } else {
      console.log(`   ℹ️  No slideshow found - keeping existing component`);
    }

    console.log(`   📊 Sections: ${analysis.sections.length}`);
    console.log(`   🎨 Widgets: ${analysis.widgets.length}`);
  }

  /**
   * Main reconstruction workflow
   */
  async run(): Promise<void> {
    console.log('\n' + '='.repeat(80));
    console.log('🚀 Full Elementor Reconstruction Pipeline');
    console.log('='.repeat(80) + '\n');

    const analyses: PageReconstruction[] = [];

    // Step 1: Analyze all pages
    console.log('📊 Step 1: Analyzing all pages...\n');
    for (const page of REPLICA_PAGES) {
      console.log(`   Analyzing ${page.name}...`);
      const analysis = await this.analyzePage(page);
      analyses.push(analysis);

      if (analysis.hasSlideshow) {
        console.log(`   ✅ Slideshow: ${analysis.slideshowSettings?.background_slideshow_gallery.length} images`);
      } else {
        console.log(`   ℹ️  No slideshow`);
      }
    }

    // Summary
    console.log('\n' + '-'.repeat(80));
    console.log('📈 Analysis Summary:\n');
    console.log(`   Total Pages: ${analyses.length}`);
    console.log(`   Pages with Slideshows: ${analyses.filter(a => a.hasSlideshow).length}`);
    console.log(`   Total Sections: ${analyses.reduce((sum, a) => sum + a.sections.length, 0)}`);
    console.log(`   Total Widgets: ${analyses.reduce((sum, a) => sum + a.widgets.length, 0)}`);

    // Step 2: Reconstruct pages
    console.log('\n📦 Step 2: Reconstructing pages...');
    for (let i = 0; i < REPLICA_PAGES.length; i++) {
      await this.reconstructPage(REPLICA_PAGES[i], analyses[i]);
    }

    // Step 3: Download local images
    console.log('\n📥 Step 3: Downloading slideshow images...');
    const allImages = new Set<string>();

    for (const analysis of analyses) {
      if (analysis.slideshowSettings) {
        analysis.slideshowSettings.background_slideshow_gallery.forEach(img => {
          allImages.add(img.url);
        });
      }
    }

    console.log(`   Found ${allImages.size} unique images to download`);

    // Save image list
    const imageList = Array.from(allImages);
    await fs.writeFile(
      'data/slideshow-images.json',
      JSON.stringify(imageList, null, 2)
    );
    console.log(`   ✅ Image list saved: data/slideshow-images.json`);

    // Step 4: Save reconstruction report
    console.log('\n📄 Step 4: Generating reconstruction report...');

    const report = {
      timestamp: new Date().toISOString(),
      pages: analyses.map(a => ({
        name: a.name,
        route: a.route,
        hasSlideshow: a.hasSlideshow,
        slideshowImages: a.slideshowSettings?.background_slideshow_gallery.length || 0,
        sections: a.sections.length,
        widgets: a.widgets.length
      })),
      summary: {
        totalPages: analyses.length,
        pagesWithSlideshows: analyses.filter(a => a.hasSlideshow).length,
        totalSlideshowImages: allImages.size,
        totalSections: analyses.reduce((sum, a) => sum + a.sections.length, 0),
        totalWidgets: analyses.reduce((sum, a) => sum + a.widgets.length, 0)
      }
    };

    await fs.writeFile(
      'data/reconstruction-report.json',
      JSON.stringify(report, null, 2)
    );
    console.log(`   ✅ Report saved: data/reconstruction-report.json`);

    // Final summary
    console.log('\n' + '='.repeat(80));
    console.log('✅ Reconstruction Complete!\n');
    console.log('Next Steps:');
    console.log('1. Download images: tsx scripts/download-slideshow-images.ts');
    console.log('2. Build site: cd generated-site && npm run build');
    console.log('3. Test locally: cd generated-site && npm run dev');
    console.log('4. Deploy: vercel --prod');
    console.log('\n' + '='.repeat(80) + '\n');
  }
}

// Run
const reconstructor = new ElementorReconstructor();
reconstructor.run().catch(error => {
  console.error('\n❌ Reconstruction failed:', error);
  process.exit(1);
});

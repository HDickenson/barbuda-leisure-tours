#!/usr/bin/env tsx

/**
 * Master Reconstruction Script
 *
 * Runs the complete Elementor reconstruction pipeline automatically:
 * 1. Parse Elementor structure from all replica pages
 * 2. Extract slideshow and animation settings
 * 3. Generate React components with Swiper.js
 * 4. Download all slideshow images locally
 * 5. Update image paths to use local assets
 * 6. Apply design tokens and styles
 * 7. Build and verify
 */

import { execSync } from 'child_process';
import * as fs from 'fs/promises';
import * as path from 'path';

interface Step {
  id: string;
  name: string;
  description: string;
  command?: string;
  script?: () => Promise<void>;
  required: boolean;
}

class MasterReconstructor {
  private steps: Step[] = [];
  private startTime = Date.now();

  constructor() {
    this.defineSteps();
  }

  private defineSteps() {
    this.steps = [
      {
        id: '1',
        name: 'Elementor Analysis',
        description: 'Parse Elementor structure and extract settings',
        command: 'tsx scripts/run-elementor-parser.ts',
        required: true
      },
      {
        id: '2',
        name: 'Page Reconstruction',
        description: 'Generate React components with slideshows and animations',
        command: 'tsx scripts/full-elementor-reconstruction.ts',
        required: true
      },
      {
        id: '3',
        name: 'Image Download',
        description: 'Download all slideshow background images',
        command: 'tsx scripts/download-slideshow-images.ts',
        required: true
      },
      {
        id: '4',
        name: 'Path Updates',
        description: 'Update image paths to use local assets',
        script: async () => {
          await this.updateImagePaths();
        },
        required: true
      },
      {
        id: '5',
        name: 'Design Tokens',
        description: 'Apply design tokens and CSS',
        script: async () => {
          await this.applyDesignTokens();
        },
        required: true
      },
      {
        id: '6',
        name: 'Build Verification',
        description: 'Build site and verify no errors',
        command: 'cd generated-site && npm run build',
        required: true
      }
    ];
  }

  private async updateImagePaths(): Promise<void> {
    console.log('   Reading image path mapping...');

    const mappingPath = 'data/slideshow-image-mapping.json';
    const mappingContent = await fs.readFile(mappingPath, 'utf-8');
    const pathMapping: Record<string, string> = JSON.parse(mappingContent);

    console.log(`   Found ${Object.keys(pathMapping).length} image mappings`);

    // Update all page files
    const pageFiles = [
      'generated-site/app/page.tsx',
      'generated-site/app/about/page.tsx',
      'generated-site/app/reviews/page.tsx',
      'generated-site/app/faq/page.tsx'
    ];

    for (const file of pageFiles) {
      try {
        let content = await fs.readFile(file, 'utf-8');
        let updated = false;

        for (const [oldPath, newPath] of Object.entries(pathMapping)) {
          if (content.includes(oldPath)) {
            content = content.replace(new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), newPath);
            updated = true;
          }
        }

        if (updated) {
          await fs.writeFile(file, content, 'utf-8');
          console.log(`   ✅ Updated: ${path.basename(file)}`);
        }
      } catch (error) {
        console.log(`   ⚠️  Skipped: ${path.basename(file)} (not found)`);
      }
    }
  }

  private async applyDesignTokens(): Promise<void> {
    console.log('   Applying design tokens...');

    // Design tokens from the original site
    const designTokens = {
      colors: {
        primary: '#4DD0E1',
        secondary: '#263238',
        accent: '#FF6B6B',
        text: '#333333',
        background: '#FFFFFF'
      },
      fonts: {
        heading: 'Leckerli One',
        body: 'Open Sans'
      },
      spacing: {
        section: '80px',
        container: '1200px'
      }
    };

    // Save design tokens
    await fs.writeFile(
      'generated-site/app/design-tokens.json',
      JSON.stringify(designTokens, null, 2)
    );

    console.log('   ✅ Design tokens saved');

    // Create global styles file
    const globalStyles = `/* Design Tokens Applied */
:root {
  --color-primary: ${designTokens.colors.primary};
  --color-secondary: ${designTokens.colors.secondary};
  --color-accent: ${designTokens.colors.accent};
  --color-text: ${designTokens.colors.text};
  --color-background: ${designTokens.colors.background};
  --font-heading: '${designTokens.fonts.heading}', cursive;
  --font-body: '${designTokens.fonts.body}', sans-serif;
  --spacing-section: ${designTokens.spacing.section};
  --container-width: ${designTokens.spacing.container};
}

/* Ken Burns Animation */
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
  animation: ken-burns-in 5000ms ease-in-out forwards;
}

.animate-ken-burns-out {
  animation: ken-burns-out 5000ms ease-in-out forwards;
}

/* Elementor Animations */
@keyframes fadeIn {
  from {
    opacity: 0;
  }
  to {
    opacity: 1;
  }
}

.animate-fadeIn {
  animation: fadeIn 1000ms ease-in-out;
}
`;

    // Append to globals.css
    const globalsPath = 'generated-site/app/globals.css';
    const currentGlobals = await fs.readFile(globalsPath, 'utf-8');

    if (!currentGlobals.includes('/* Design Tokens Applied */')) {
      await fs.writeFile(globalsPath, currentGlobals + '\n' + globalStyles, 'utf-8');
      console.log('   ✅ Global styles updated');
    } else {
      console.log('   ℹ️  Global styles already applied');
    }
  }

  private runCommand(command: string): void {
    console.log(`   $ ${command}`);
    execSync(command, { stdio: 'inherit' });
  }

  async run(): Promise<void> {
    console.log('\n' + '='.repeat(80));
    console.log('🚀 MASTER RECONSTRUCTION PIPELINE');
    console.log('='.repeat(80) + '\n');

    console.log('This script will fully reconstruct all Elementor pages with:');
    console.log('  ✅ Background slideshows with Ken Burns effect');
    console.log('  ✅ All Elementor widgets as React components');
    console.log('  ✅ Design tokens and animations');
    console.log('  ✅ Local image assets');
    console.log('  ✅ Production build verification\n');

    for (const step of this.steps) {
      console.log('─'.repeat(80));
      console.log(`📦 Step ${step.id}: ${step.name}`);
      console.log(`   ${step.description}`);
      console.log('');

      try {
        if (step.command) {
          this.runCommand(step.command);
        } else if (step.script) {
          await step.script();
        }

        console.log(`\n   ✅ Step ${step.id} complete\n`);
      } catch (error) {
        console.error(`\n   ❌ Step ${step.id} failed:`, error);

        if (step.required) {
          console.error('\n❌ Required step failed. Aborting reconstruction.\n');
          process.exit(1);
        } else {
          console.warn('\n⚠️  Optional step failed. Continuing...\n');
        }
      }
    }

    // Final summary
    const duration = ((Date.now() - this.startTime) / 1000).toFixed(1);

    console.log('='.repeat(80));
    console.log('✅ RECONSTRUCTION COMPLETE!');
    console.log('='.repeat(80) + '\n');
    console.log(`⏱️  Total time: ${duration}s\n`);
    console.log('Next Steps:');
    console.log('1. Test locally: cd generated-site && npm run dev');
    console.log('2. Review at: http://localhost:3000');
    console.log('3. Deploy: vercel --prod\n');
    console.log('='.repeat(80) + '\n');
  }
}

// Run
const reconstructor = new MasterReconstructor();
reconstructor.run().catch(error => {
  console.error('\n❌ Master reconstruction failed:', error);
  process.exit(1);
});

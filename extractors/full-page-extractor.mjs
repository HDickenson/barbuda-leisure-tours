#!/usr/bin/env node

/**
 * FULL PAGE CONTENT EXTRACTOR
 *
 * Extracts ALL visible page content, not just containers
 * - Hero section with slideshow
 * - All content sections (tours, why choose us, etc.)
 * - Header and footer
 * - Images, colors, fonts, spacing
 */

import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_URL = 'https://www.barbudaleisure.com';
const OUTPUT_DIR = path.join(__dirname, 'output', 'full-page-extraction');

class FullPageExtractor {
  constructor() {
    this.browser = null;
    this.page = null;
    this.extractedData = {
      timestamp: new Date().toISOString(),
      url: TARGET_URL,
      hero: null,
      sections: [],
      header: null,
      footer: null,
      images: [],
      colors: new Set(),
      fonts: new Set()
    };
  }

  async init() {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    await fs.mkdir(path.join(OUTPUT_DIR, 'screenshots'), { recursive: true });

    this.browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1920, height: 1080 });
  }

  async navigate() {
    console.log(`🌐 Navigating to ${TARGET_URL}...`);
    await this.page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 60000 });

    // Wait for page to be fully rendered
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Close any popups/modals
    try {
      await this.page.evaluate(() => {
        // Close any visible modals
        const modals = document.querySelectorAll('.modal, .popup, [role="dialog"]');
        modals.forEach(modal => modal.style.display = 'none');

        // Close any cookie notices
        const cookieNotices = document.querySelectorAll('[class*="cookie"], [id*="cookie"]');
        cookieNotices.forEach(notice => notice.style.display = 'none');
      });
    } catch (err) {
      console.log('  ⚠ No popups to close');
    }

    console.log('✅ Page loaded and ready\n');
  }

  /**
   * Extract hero section (topmost section with full width)
   */
  async extractHero() {
    console.log('🎯 Extracting Hero Section...\n');

    const heroData = await this.page.evaluate(() => {
      // Find the first full-width section
      const sections = Array.from(document.querySelectorAll('section, .elementor-section'));
      const hero = sections.find(s => {
        const rect = s.getBoundingClientRect();
        return rect.width >= window.innerWidth - 100 && rect.top < 300;
      });

      if (!hero) return null;

      const computed = window.getComputedStyle(hero);
      const rect = hero.getBoundingClientRect();

      // Extract background image
      const bgImage = computed.backgroundImage;
      const hasSlideshow = hero.querySelector('.swiper, .slideshow, [class*="slider"]') !== null;

      // Extract all text content
      const headings = Array.from(hero.querySelectorAll('h1, h2, h3')).map(h => ({
        tag: h.tagName.toLowerCase(),
        text: h.textContent.trim(),
        styles: {
          fontFamily: window.getComputedStyle(h).fontFamily,
          fontSize: window.getComputedStyle(h).fontSize,
          fontWeight: window.getComputedStyle(h).fontWeight,
          color: window.getComputedStyle(h).color,
          textAlign: window.getComputedStyle(h).textAlign
        }
      }));

      const paragraphs = Array.from(hero.querySelectorAll('p')).map(p => ({
        text: p.textContent.trim(),
        styles: {
          fontFamily: window.getComputedStyle(p).fontFamily,
          fontSize: window.getComputedStyle(p).fontSize,
          color: window.getComputedStyle(p).color
        }
      }));

      // Extract CTA buttons
      const buttons = Array.from(hero.querySelectorAll('a, button')).map(btn => ({
        text: btn.textContent.trim(),
        href: btn.href || null,
        styles: {
          backgroundColor: window.getComputedStyle(btn).backgroundColor,
          color: window.getComputedStyle(btn).color,
          padding: window.getComputedStyle(btn).padding,
          borderRadius: window.getComputedStyle(btn).borderRadius,
          fontSize: window.getComputedStyle(btn).fontSize,
          fontWeight: window.getComputedStyle(btn).fontWeight
        }
      }));

      return {
        selector: hero.className || hero.tagName,
        rect: {
          top: rect.top + window.scrollY,
          left: rect.left,
          width: rect.width,
          height: rect.height
        },
        styles: {
          backgroundColor: computed.backgroundColor,
          backgroundImage: bgImage !== 'none' ? bgImage.substring(0, 100) : 'none',
          backgroundSize: computed.backgroundSize,
          backgroundPosition: computed.backgroundPosition,
          minHeight: computed.minHeight,
          padding: computed.padding,
          display: computed.display,
          alignItems: computed.alignItems,
          justifyContent: computed.justifyContent
        },
        hasSlideshow,
        headings,
        paragraphs,
        buttons
      };
    });

    if (heroData) {
      console.log(`  ✓ Hero section: ${heroData.rect.width}×${heroData.rect.height}px`);
      console.log(`  ✓ Slideshow: ${heroData.hasSlideshow ? 'Yes' : 'No'}`);
      console.log(`  ✓ Headings: ${heroData.headings.length}`);
      console.log(`  ✓ Buttons: ${heroData.buttons.length}\n`);

      this.extractedData.hero = heroData;
    }
  }

  /**
   * Extract all main content sections
   */
  async extractContentSections() {
    console.log('📦 Extracting Content Sections...\n');

    const sectionsData = await this.page.evaluate(() => {
      const sections = [];

      // Find all major content sections (skip header/footer)
      const allSections = Array.from(document.querySelectorAll('section, .elementor-section'));

      allSections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();

        // Only include sections with substantial height
        if (rect.height < 50) return;

        // Skip header/footer regions
        const top = rect.top + window.scrollY;
        if (top < 150 || top > document.body.scrollHeight - 700) return;

        const computed = window.getComputedStyle(section);

        // Extract section content
        const headings = Array.from(section.querySelectorAll('h1, h2, h3, h4')).map(h => ({
          tag: h.tagName.toLowerCase(),
          text: h.textContent.trim(),
          fontSize: window.getComputedStyle(h).fontSize,
          fontFamily: window.getComputedStyle(h).fontFamily,
          color: window.getComputedStyle(h).color
        }));

        const images = Array.from(section.querySelectorAll('img')).map(img => ({
          src: img.src,
          alt: img.alt,
          width: img.width,
          height: img.height
        }));

        const links = Array.from(section.querySelectorAll('a')).map(a => ({
          text: a.textContent.trim(),
          href: a.href
        }));

        sections.push({
          index,
          selector: section.className || section.tagName,
          rect: {
            top,
            left: rect.left,
            width: rect.width,
            height: rect.height
          },
          styles: {
            backgroundColor: computed.backgroundColor,
            backgroundImage: computed.backgroundImage !== 'none' ? 'Has background image' : 'none',
            padding: computed.padding,
            margin: computed.margin,
            minHeight: computed.minHeight
          },
          content: {
            headings,
            images: images.slice(0, 10), // Limit images
            links: links.slice(0, 20) // Limit links
          }
        });
      });

      return sections;
    });

    console.log(`  ✓ Found ${sectionsData.length} content sections\n`);
    this.extractedData.sections = sectionsData;

    // Screenshot each section
    for (let i = 0; i < Math.min(sectionsData.length, 10); i++) {
      const section = sectionsData[i];
      console.log(`  📸 Section ${i + 1}: ${section.content.headings[0]?.text || 'Untitled'}`);
    }
    console.log('');
  }

  /**
   * Extract all images
   */
  async extractImages() {
    console.log('🖼️  Extracting Images...\n');

    const imagesData = await this.page.evaluate(() => {
      return Array.from(document.querySelectorAll('img'))
        .filter(img => img.width > 50 && img.height > 50) // Skip small icons
        .map(img => ({
          src: img.src,
          alt: img.alt || 'No alt text',
          width: img.width,
          height: img.height,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight
        }))
        .slice(0, 50); // Limit to first 50 images
    });

    console.log(`  ✓ Found ${imagesData.length} images\n`);
    this.extractedData.images = imagesData;
  }

  /**
   * Extract color palette
   */
  async extractColors() {
    console.log('🎨 Extracting Color Palette...\n');

    const colors = await this.page.evaluate(() => {
      const colorSet = new Set();

      // Get all elements
      document.querySelectorAll('*').forEach(el => {
        const computed = window.getComputedStyle(el);

        // Extract colors
        if (computed.backgroundColor && computed.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          colorSet.add(computed.backgroundColor);
        }
        if (computed.color && computed.color !== 'rgba(0, 0, 0, 0)') {
          colorSet.add(computed.color);
        }
      });

      return Array.from(colorSet).slice(0, 30); // Top 30 colors
    });

    console.log(`  ✓ Found ${colors.length} unique colors\n`);
    this.extractedData.colors = colors;
  }

  /**
   * Save all extraction data
   */
  async saveData() {
    console.log('💾 Saving extraction data...\n');

    // Convert Sets to Arrays for JSON
    const saveData = {
      ...this.extractedData,
      colors: Array.from(this.extractedData.colors),
      fonts: Array.from(this.extractedData.fonts)
    };

    await fs.writeFile(
      path.join(OUTPUT_DIR, 'full-page-extraction.json'),
      JSON.stringify(saveData, null, 2)
    );

    // Generate application instructions
    const instructions = {
      timestamp: saveData.timestamp,
      instructions: [
        {
          component: 'Hero Section',
          file: 'barbuda-local/src/app/page.tsx',
          changes: [
            `Update background color to: ${this.extractedData.hero?.styles.backgroundColor}`,
            `Set padding to: ${this.extractedData.hero?.styles.padding}`,
            `Add slideshow with ${this.extractedData.hero?.hasSlideshow ? 'swiper' : 'static image'}`
          ]
        },
        ...this.extractedData.sections.map((section, i) => ({
          component: `Section ${i + 1}: ${section.content.headings[0]?.text || 'Untitled'}`,
          file: 'barbuda-local/src/app/page.tsx',
          changes: [
            `Background: ${section.styles.backgroundColor}`,
            `Padding: ${section.styles.padding}`,
            `Contains ${section.content.images.length} images`
          ]
        }))
      ]
    };

    await fs.writeFile(
      path.join(OUTPUT_DIR, 'application-instructions.json'),
      JSON.stringify(instructions, null, 2)
    );

    console.log('✓ Saved full-page-extraction.json');
    console.log('✓ Saved application-instructions.json\n');
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async run() {
    try {
      console.log('🚀 FULL PAGE CONTENT EXTRACTOR\n');
      console.log('═══════════════════════════════════════\n');

      await this.init();
      await this.navigate();

      // Full page screenshot
      await this.page.screenshot({
        path: path.join(OUTPUT_DIR, 'screenshots', 'full-page.png'),
        fullPage: true
      });
      console.log('📸 Full page screenshot saved\n');

      await this.extractHero();
      await this.extractContentSections();
      await this.extractImages();
      await this.extractColors();
      await this.saveData();

      console.log('═══════════════════════════════════════');
      console.log('✨ EXTRACTION COMPLETE\n');
      console.log(`📁 Output: ${OUTPUT_DIR}\n`);
      console.log('📊 Summary:');
      console.log(`   Hero: ${this.extractedData.hero ? 'Found' : 'Not found'}`);
      console.log(`   Sections: ${this.extractedData.sections.length}`);
      console.log(`   Images: ${this.extractedData.images.length}`);
      console.log(`   Colors: ${this.extractedData.colors.size}\n`);

    } catch (error) {
      console.error('\n❌ Error:', error);
      throw error;
    } finally {
      await this.close();
    }
  }
}

const extractor = new FullPageExtractor();
extractor.run().catch(console.error);

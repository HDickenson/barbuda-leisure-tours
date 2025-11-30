#!/usr/bin/env node

/**
 * DEEP SECTION EXTRACTOR
 *
 * Extracts nested sections within main Elementor containers
 * Focuses on actual content sections with styling
 */

import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_URL = 'https://www.barbudaleisure.com';
const OUTPUT_DIR = path.join(__dirname, 'output', 'deep-extraction');

class DeepSectionExtractor {
  constructor() {
    this.browser = null;
    this.page = null;
    this.sharedRegistry = null;
    this.extractedData = {
      timestamp: new Date().toISOString(),
      url: TARGET_URL,
      header: null,
      sections: [],
      footer: null,
      sharedComponents: {
        header: { isShared: true, componentPath: null, needsUpdate: false },
        footer: { isShared: true, componentPath: null, needsUpdate: false }
      }
    };
  }

  async loadSharedRegistry() {
    try {
      const registryPath = path.join(__dirname, 'shared-components-registry.json');
      const registryData = await fs.readFile(registryPath, 'utf-8');
      this.sharedRegistry = JSON.parse(registryData);
      console.log('✓ Loaded shared components registry\n');
    } catch (err) {
      console.log('⚠ No shared registry found, will create components as needed\n');
      this.sharedRegistry = null;
    }
  }

  async init() {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    await fs.mkdir(path.join(OUTPUT_DIR, 'screenshots'), { recursive: true });

    this.browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1920, height: 1080 });
  }

  async navigate() {
    console.log(`🌐 Navigating to ${TARGET_URL}...`);
    await this.page.goto(TARGET_URL, { waitUntil: 'networkidle2', timeout: 60000 });
    console.log('✅ Page loaded\n');
  }

  /**
   * Discover all sections with actual content
   */
  async discoverSections() {
    console.log('🔍 Discovering page sections...\n');

    const sections = await this.page.evaluate(() => {
      const results = [];

      // Find all elementor-section elements (actual content sections)
      const sectionElements = document.querySelectorAll('.elementor-section');

      sectionElements.forEach((section, index) => {
        const rect = section.getBoundingClientRect();
        const computed = window.getComputedStyle(section);

        // Only include sections with actual height
        if (rect.height > 10) {
          const classList = Array.from(section.classList);
          const isTopSection = classList.includes('elementor-top-section');

          results.push({
            index,
            selector: `.elementor-section:nth-of-type(${index + 1})`,
            classList: classList.join(' '),
            isTopSection,
            rect: {
              top: rect.top + window.scrollY,
              left: rect.left,
              width: rect.width,
              height: rect.height
            },
            backgroundColor: computed.backgroundColor,
            backgroundImage: computed.backgroundImage,
            minHeight: computed.minHeight,
            padding: computed.padding
          });
        }
      });

      return results;
    });

    console.log(`📦 Found ${sections.length} content sections:\n`);
    sections.forEach((s, i) => {
      console.log(`   ${i + 1}. ${s.isTopSection ? '⭐ TOP' : '  '} Section at ${Math.round(s.rect.top)}px (${Math.round(s.rect.height)}px tall)`);
      console.log(`       BG: ${s.backgroundColor}`);
      if (s.backgroundImage !== 'none') {
        console.log(`       BG Image: Yes`);
      }
    });
    console.log('');

    return sections;
  }

  /**
   * Extract section with full CSS
   */
  async extractSection(sectionInfo) {
    const data = await this.page.evaluate((info) => {
      const section = document.querySelectorAll('.elementor-section')[info.index];
      if (!section) return null;

      const computed = window.getComputedStyle(section);

      const styles = {};
      const props = [
        'display', 'position', 'top', 'bottom', 'left', 'right', 'zIndex',
        'width', 'height', 'minHeight', 'maxHeight',
        'margin', 'marginTop', 'marginBottom', 'marginLeft', 'marginRight',
        'padding', 'paddingTop', 'paddingBottom', 'paddingLeft', 'paddingRight',
        'background', 'backgroundColor', 'backgroundImage', 'backgroundSize',
        'backgroundPosition', 'backgroundRepeat', 'backgroundAttachment',
        'border', 'borderRadius', 'boxShadow',
        'color', 'fontFamily', 'fontSize', 'fontWeight', 'lineHeight',
        'filter', 'backdropFilter', 'opacity', 'transform', 'transition',
        'textAlign', 'overflow', 'flexDirection', 'justifyContent', 'alignItems'
      ];

      props.forEach(prop => {
        const value = computed[prop];
        if (value && value !== 'none' && value !== 'normal' && value !== 'auto' && value !== '0px') {
          styles[prop] = value;
        }
      });

      return {
        selector: info.selector,
        classList: info.classList,
        isTopSection: info.isTopSection,
        rect: info.rect,
        styles
      };
    }, sectionInfo);

    if (data) {
      // Screenshot
      try {
        const elements = await this.page.$$(`.elementor-section`);
        const element = elements[sectionInfo.index];

        if (element) {
          const rect = await element.boundingBox();
          if (rect && rect.height > 0) {
            const screenshotPath = path.join(OUTPUT_DIR, 'screenshots', `section-${sectionInfo.index + 1}.png`);
            await element.screenshot({ path: screenshotPath });
            data.screenshot = screenshotPath;
            console.log(`  ✓ Section ${sectionInfo.index + 1}: ${Object.keys(data.styles).length} CSS properties`);
          }
        }
      } catch (err) {
        console.log(`  ⚠ Screenshot failed for section ${sectionInfo.index + 1}: ${err.message}`);
        data.screenshot = null;
      }
    }

    return data;
  }

  /**
   * Extract header content
   */
  async extractHeader() {
    console.log('📋 Extracting Header content...\n');

    // Check if header is a shared component
    if (this.sharedRegistry?.sharedComponents?.header) {
      const headerInfo = this.sharedRegistry.sharedComponents.header;
      console.log(`  ℹ Header is a SHARED component: ${headerInfo.componentPath}`);
      console.log(`  ℹ Used in: ${headerInfo.usage}`);
      this.extractedData.sharedComponents.header.componentPath = headerInfo.componentPath;
    }

    const headerData = await this.page.evaluate(() => {
      const header = document.querySelector('.ekit-template-content-header');
      if (!header) return null;

      // Find actual header content (sticky header, navigation, etc.)
      const stickyHeader = header.querySelector('.sticky-header, [data-settings*="sticky"]');
      const nav = header.querySelector('nav, .navigation, .main-menu');

      const target = stickyHeader || nav || header;
      const computed = window.getComputedStyle(target);
      const rect = target.getBoundingClientRect();

      const styles = {};
      const props = [
        'display', 'position', 'top', 'zIndex', 'width', 'height',
        'background', 'backgroundColor', 'padding', 'boxShadow'
      ];

      props.forEach(prop => {
        const value = computed[prop];
        if (value && value !== 'none' && value !== 'auto') {
          styles[prop] = value;
        }
      });

      return {
        found: true,
        selector: target.className ? `.${target.className.split(' ')[0]}` : '.ekit-template-content-header',
        rect: {
          top: rect.top + window.scrollY,
          left: rect.left,
          width: rect.width,
          height: rect.height
        },
        styles
      };
    });

    if (headerData) {
      console.log(`  ✓ Header found: ${headerData.rect.width}×${headerData.rect.height}px`);
      console.log(`  ✓ Position: ${headerData.styles.position || 'static'}`);
      this.extractedData.header = headerData;
    } else {
      console.log(`  ⚠ Header not found or has no content`);
    }
    console.log('');
  }

  /**
   * Extract footer content
   */
  async extractFooter() {
    console.log('📋 Extracting Footer...\n');

    // Check if footer is a shared component
    if (this.sharedRegistry?.sharedComponents?.footer) {
      const footerInfo = this.sharedRegistry.sharedComponents.footer;
      console.log(`  ℹ Footer is a SHARED component: ${footerInfo.componentPath}`);
      console.log(`  ℹ Used in: ${footerInfo.usage}`);
      this.extractedData.sharedComponents.footer.componentPath = footerInfo.componentPath;
    }

    const footerData = await this.page.evaluate(() => {
      const footer = document.querySelector('.ekit-template-content-footer');
      if (!footer) return null;

      const computed = window.getComputedStyle(footer);
      const rect = footer.getBoundingClientRect();

      const styles = {};
      const props = [
        'display', 'position', 'width', 'height',
        'background', 'backgroundColor', 'backgroundImage',
        'padding', 'color', 'fontFamily'
      ];

      props.forEach(prop => {
        const value = computed[prop];
        if (value && value !== 'none' && value !== 'auto' && value !== '0px') {
          styles[prop] = value;
        }
      });

      return {
        found: true,
        selector: '.ekit-template-content-footer',
        rect: {
          top: rect.top + window.scrollY,
          left: rect.left,
          width: rect.width,
          height: rect.height
        },
        styles
      };
    });

    if (footerData) {
      // Screenshot footer
      try {
        const element = await this.page.$('.ekit-template-content-footer');
        if (element) {
          const screenshotPath = path.join(OUTPUT_DIR, 'screenshots', 'footer.png');
          await element.screenshot({ path: screenshotPath });
          footerData.screenshot = screenshotPath;
        }
      } catch (err) {
        console.log(`  ⚠ Footer screenshot failed: ${err.message}`);
      }

      console.log(`  ✓ Footer found: ${footerData.rect.width}×${footerData.rect.height}px`);
      console.log(`  ✓ Background: ${footerData.styles.backgroundColor || 'transparent'}`);
      this.extractedData.footer = footerData;
    } else {
      console.log(`  ⚠ Footer not found`);
    }
    console.log('');
  }

  /**
   * Save extraction data
   */
  async saveData() {
    console.log('💾 Saving extraction data...\n');

    await fs.writeFile(
      path.join(OUTPUT_DIR, 'deep-extraction.json'),
      JSON.stringify(this.extractedData, null, 2)
    );

    // Generate summary report
    const report = {
      timestamp: this.extractedData.timestamp,
      url: this.extractedData.url,
      summary: {
        header: this.extractedData.header ? 'Found' : 'Not found',
        sections: this.extractedData.sections.length,
        topSections: this.extractedData.sections.filter(s => s.isTopSection).length,
        footer: this.extractedData.footer ? 'Found' : 'Not found',
        totalProperties: this.extractedData.sections.reduce((sum, s) => sum + Object.keys(s.styles).length, 0)
      },
      sharedComponents: {
        header: {
          isShared: true,
          componentPath: this.extractedData.sharedComponents.header.componentPath,
          action: 'Update existing component, DO NOT create new one'
        },
        footer: {
          isShared: true,
          componentPath: this.extractedData.sharedComponents.footer.componentPath,
          action: 'Update existing component, DO NOT create new one'
        }
      },
      sections: this.extractedData.sections.map((s, i) => ({
        index: i + 1,
        isTopSection: s.isTopSection,
        dimensions: s.rect,
        properties: Object.keys(s.styles).length,
        keyStyles: {
          backgroundColor: s.styles.backgroundColor,
          backgroundImage: s.styles.backgroundImage?.substring(0, 50),
          padding: s.styles.padding,
          minHeight: s.styles.minHeight
        }
      }))
    };

    await fs.writeFile(
      path.join(OUTPUT_DIR, 'deep-extraction-report.json'),
      JSON.stringify(report, null, 2)
    );

    console.log('✓ Saved deep-extraction.json');
    console.log('✓ Saved deep-extraction-report.json\n');

    console.log('📊 Summary:');
    console.log(`   Header: ${report.summary.header}`);
    console.log(`   Total sections: ${report.summary.sections}`);
    console.log(`   Top-level sections: ${report.summary.topSections}`);
    console.log(`   Footer: ${report.summary.footer}`);
    console.log(`   Total CSS properties: ${report.summary.totalProperties}\n`);
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async run() {
    try {
      console.log('🚀 DEEP SECTION EXTRACTOR\n');
      console.log('═══════════════════════════════════════\n');

      await this.init();
      await this.loadSharedRegistry();
      await this.navigate();

      // Full page screenshot
      await this.page.screenshot({
        path: path.join(OUTPUT_DIR, 'screenshots', 'full-page.png'),
        fullPage: true
      });
      console.log('📸 Full page screenshot saved\n');

      await this.extractHeader();

      const sections = await this.discoverSections();

      console.log('📦 Extracting section details...\n');
      for (const section of sections) {
        const data = await this.extractSection(section);
        if (data) {
          this.extractedData.sections.push(data);
        }
      }
      console.log('');

      await this.extractFooter();
      await this.saveData();

      console.log('═══════════════════════════════════════');
      console.log('✨ DEEP EXTRACTION COMPLETE\n');
      console.log(`📁 Output: ${OUTPUT_DIR}\n`);

    } catch (error) {
      console.error('\n❌ Error:', error);
      throw error;
    } finally {
      await this.close();
    }
  }
}

const extractor = new DeepSectionExtractor();
extractor.run().catch(console.error);

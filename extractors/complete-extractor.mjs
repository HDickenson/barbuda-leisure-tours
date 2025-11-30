#!/usr/bin/env node

/**
 * COMPLETE PAGE EXTRACTOR
 *
 * Fixed to properly extract:
 * - Header (ElementsKit template)
 * - All Elementor sections (by container ID)
 * - Footer (ElementsKit template)
 *
 * Deterministic and accurate
 */

import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_URL = 'https://www.barbudaleisure.com';
const OUTPUT_DIR = path.join(__dirname, 'output', 'complete-extraction');

class CompleteExtractor {
  constructor() {
    this.browser = null;
    this.page = null;
    this.extractedData = {
      timestamp: new Date().toISOString(),
      url: TARGET_URL,
      header: null,
      sections: [],
      footer: null
    };
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
   * Extract element with exact CSS
   */
  async extractElement(selector, name) {
    const element = await this.page.$(selector);
    if (!element) {
      console.log(`  ⚠ Not found: ${selector}`);
      return null;
    }

    const data = await this.page.evaluate((sel) => {
      const el = document.querySelector(sel);
      if (!el) return null;

      const computed = window.getComputedStyle(el);
      const rect = el.getBoundingClientRect();

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
        'filter', 'backdropFilter', 'opacity', 'transform', 'transition'
      ];

      props.forEach(prop => {
        const value = computed[prop];
        if (value && value !== 'none' && value !== 'normal' && value !== 'auto' && value !== '0px') {
          styles[prop] = value;
        }
      });

      return {
        selector: sel,
        tagName: el.tagName,
        className: el.className,
        id: el.id,
        rect: {
          top: rect.top + window.scrollY,
          left: rect.left,
          width: rect.width,
          height: rect.height
        },
        styles
      };
    }, selector);

    if (data) {
      // Screenshot with error handling
      try {
        const rect = await element.boundingBox();
        if (rect && rect.height > 0 && rect.width > 0) {
          const screenshotPath = path.join(OUTPUT_DIR, 'screenshots', `${name}.png`);
          await element.screenshot({ path: screenshotPath });
          data.screenshot = screenshotPath;
          console.log(`  ✓ Extracted ${name} (${Object.keys(data.styles).length} properties)`);
        } else {
          console.log(`  ⚠ Element has no dimensions (${rect?.width || 0}×${rect?.height || 0}), skipping screenshot`);
          console.log(`  ✓ Extracted ${name} CSS only (${Object.keys(data.styles).length} properties)`);
          data.screenshot = null;
        }
      } catch (err) {
        console.log(`  ⚠ Screenshot failed: ${err.message}`);
        console.log(`  ✓ Extracted ${name} CSS only (${Object.keys(data.styles).length} properties)`);
        data.screenshot = null;
      }
    }

    return data;
  }

  /**
   * Discover all Elementor containers
   */
  async discoverContainers() {
    console.log('🔍 Discovering Elementor containers...\n');

    const containers = await this.page.evaluate(() => {
      return Array.from(document.querySelectorAll('[data-elementor-type]')).map(el => ({
        type: el.getAttribute('data-elementor-type'),
        id: el.getAttribute('data-elementor-id'),
        className: el.className,
        top: el.getBoundingClientRect().top + window.scrollY,
        height: el.getBoundingClientRect().height
      }));
    });

    console.log('📦 Found Elementor containers:');
    containers.forEach(c => {
      console.log(`   - ${c.type} (ID: ${c.id}) at ${Math.round(c.top)}px`);
    });
    console.log('');

    return containers;
  }

  /**
   * Extract header
   */
  async extractHeader() {
    console.log('📋 Extracting Header...');
    this.extractedData.header = await this.extractElement(
      '.ekit-template-content-header',
      'header'
    );
    console.log('');
  }

  /**
   * Extract all sections properly
   */
  async extractSections() {
    console.log('📦 Extracting Sections...\n');

    // Get all Elementor containers
    const containers = await this.page.evaluate(() => {
      return Array.from(document.querySelectorAll('.elementor[data-elementor-type]')).map((el, i) => ({
        index: i,
        id: el.getAttribute('data-elementor-id'),
        type: el.getAttribute('data-elementor-type'),
        className: el.className,
        selector: `.elementor-${el.getAttribute('data-elementor-id')}`
      }));
    });

    for (const container of containers) {
      console.log(`  📦 Container ${container.index + 1}: ${container.type} (ID: ${container.id})`);

      const data = await this.extractElement(
        container.selector,
        `section-${container.id}`
      );

      if (data) {
        data.containerType = container.type;
        data.containerId = container.id;
        this.extractedData.sections.push(data);
      }
    }

    console.log('');
  }

  /**
   * Extract footer
   */
  async extractFooter() {
    console.log('📋 Extracting Footer...');
    this.extractedData.footer = await this.extractElement(
      '.ekit-template-content-footer',
      'footer'
    );
    console.log('');
  }

  /**
   * Save data
   */
  async saveData() {
    console.log('💾 Saving extraction data...\n');

    await fs.writeFile(
      path.join(OUTPUT_DIR, 'complete-extraction.json'),
      JSON.stringify(this.extractedData, null, 2)
    );

    // Generate report
    const report = {
      timestamp: this.extractedData.timestamp,
      url: this.extractedData.url,
      summary: {
        header: this.extractedData.header ? 'Extracted' : 'Not found',
        sections: this.extractedData.sections.length,
        footer: this.extractedData.footer ? 'Extracted' : 'Not found',
        totalProperties: (this.extractedData.header ? Object.keys(this.extractedData.header.styles).length : 0) +
                        this.extractedData.sections.reduce((sum, s) => sum + Object.keys(s.styles).length, 0) +
                        (this.extractedData.footer ? Object.keys(this.extractedData.footer.styles).length : 0)
      },
      elements: {
        header: this.extractedData.header ? {
          found: true,
          selector: this.extractedData.header.selector,
          dimensions: this.extractedData.header.rect,
          properties: Object.keys(this.extractedData.header.styles).length,
          keyStyles: {
            backgroundColor: this.extractedData.header.styles.backgroundColor,
            position: this.extractedData.header.styles.position,
            zIndex: this.extractedData.header.styles.zIndex
          }
        } : { found: false },
        sections: this.extractedData.sections.map(s => ({
          containerType: s.containerType,
          containerId: s.containerId,
          selector: s.selector,
          dimensions: s.rect,
          properties: Object.keys(s.styles).length,
          keyStyles: {
            backgroundColor: s.styles.backgroundColor,
            padding: s.styles.padding,
            minHeight: s.styles.minHeight
          }
        })),
        footer: this.extractedData.footer ? {
          found: true,
          selector: this.extractedData.footer.selector,
          dimensions: this.extractedData.footer.rect,
          properties: Object.keys(this.extractedData.footer.styles).length,
          keyStyles: {
            backgroundColor: this.extractedData.footer.styles.backgroundColor,
            padding: this.extractedData.footer.styles.padding
          }
        } : { found: false }
      }
    };

    await fs.writeFile(
      path.join(OUTPUT_DIR, 'extraction-report.json'),
      JSON.stringify(report, null, 2)
    );

    console.log('✓ Saved complete-extraction.json');
    console.log('✓ Saved extraction-report.json\n');

    console.log('📊 Summary:');
    console.log(`   Header: ${report.summary.header}`);
    console.log(`   Sections: ${report.summary.sections}`);
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
      console.log('🚀 COMPLETE PAGE EXTRACTOR\n');
      console.log('═══════════════════════════════════════\n');

      await this.init();
      await this.navigate();

      // Full page screenshot
      await this.page.screenshot({
        path: path.join(OUTPUT_DIR, 'screenshots', 'full-page.png'),
        fullPage: true
      });
      console.log('📸 Full page screenshot saved\n');

      await this.discoverContainers();
      await this.extractHeader();
      await this.extractSections();
      await this.extractFooter();
      await this.saveData();

      console.log('═══════════════════════════════════════');
      console.log('✨ EXTRACTION COMPLETE\n');
      console.log(`📁 Output: ${OUTPUT_DIR}\n`);

    } catch (error) {
      console.error('\n❌ Error:', error);
      throw error;
    } finally {
      await this.close();
    }
  }
}

const extractor = new CompleteExtractor();
extractor.run().catch(console.error);

#!/usr/bin/env node

/**
 * DETERMINISTIC DESIGN EXTRACTOR
 *
 * NO AI INVOLVED - Pure DOM inspection and CSS extraction
 * Repeatable, verifiable, and generates exact transformation rules
 *
 * Output: JSON files with exact CSS properties and transformation mappings
 */

import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_URL = 'https://www.barbudaleisure.com';
const OUTPUT_DIR = path.join(__dirname, 'output', 'deterministic');

class DeterministicExtractor {
  constructor() {
    this.browser = null;
    this.page = null;
    this.extractedData = {
      timestamp: new Date().toISOString(),
      url: TARGET_URL,
      viewport: { width: 1920, height: 1080 },
      sections: [],
      cssRules: [],
      transformationRules: []
    };
  }

  async init() {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    await fs.mkdir(path.join(OUTPUT_DIR, 'screenshots'), { recursive: true });
    await fs.mkdir(path.join(OUTPUT_DIR, 'section-screenshots'), { recursive: true });

    this.browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });
  }

  async navigate() {
    console.log(`🌐 Navigating to ${TARGET_URL}...`);
    await this.page.goto(TARGET_URL, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });
    console.log('✅ Page loaded\n');
  }

  /**
   * Extract EXACT computed styles for a section
   * No interpretation, just raw CSS values
   */
  async extractSectionStyles(selector, index) {
    return await this.page.evaluate((sel) => {
      const element = document.querySelectorAll(sel)[0];
      if (!element) return null;

      const computed = window.getComputedStyle(element);
      const rect = element.getBoundingClientRect();

      // Extract ALL relevant CSS properties deterministically
      const styles = {};
      const relevantProps = [
        // Layout
        'display', 'position', 'top', 'right', 'bottom', 'left',
        'width', 'height', 'minHeight', 'maxHeight', 'minWidth', 'maxWidth',

        // Spacing
        'margin', 'marginTop', 'marginRight', 'marginBottom', 'marginLeft',
        'padding', 'paddingTop', 'paddingRight', 'paddingBottom', 'paddingLeft',

        // Background
        'background', 'backgroundColor', 'backgroundImage', 'backgroundSize',
        'backgroundPosition', 'backgroundRepeat', 'backgroundAttachment',
        'backgroundClip', 'backgroundOrigin',

        // Border
        'border', 'borderRadius', 'borderWidth', 'borderStyle', 'borderColor',

        // Typography
        'color', 'fontFamily', 'fontSize', 'fontWeight', 'fontStyle',
        'lineHeight', 'letterSpacing', 'textAlign', 'textTransform',

        // Flexbox/Grid
        'flexDirection', 'flexWrap', 'justifyContent', 'alignItems',
        'gridTemplateColumns', 'gridTemplateRows', 'gap',

        // Effects
        'boxShadow', 'filter', 'backdropFilter', 'opacity', 'transform',
        'transition', 'animation',

        // Z-index
        'zIndex', 'overflow', 'overflowX', 'overflowY'
      ];

      relevantProps.forEach(prop => {
        const value = computed[prop];
        if (value && value !== 'none' && value !== 'normal' && value !== 'auto') {
          styles[prop] = value;
        }
      });

      return {
        selector: sel,
        className: element.className,
        id: element.id,
        tagName: element.tagName,
        rect: {
          top: rect.top + window.scrollY,
          left: rect.left,
          width: rect.width,
          height: rect.height
        },
        styles,
        innerHTML: element.innerHTML.substring(0, 200), // First 200 chars for reference
        childCount: element.children.length
      };
    }, selector);
  }

  /**
   * Take screenshot of specific section for visual QC
   */
  async screenshotSection(selector, name) {
    const element = await this.page.$(selector);
    if (!element) {
      console.log(`  ⚠ Element not found: ${selector}`);
      return null;
    }

    const screenshotPath = path.join(OUTPUT_DIR, 'section-screenshots', `${name}.png`);
    await element.screenshot({ path: screenshotPath });
    console.log(`  📸 Section screenshot: ${name}.png`);
    return screenshotPath;
  }

  /**
   * Extract all sections deterministically
   */
  async extractSections() {
    console.log('🔍 Extracting sections...\n');

    const sectionSelectors = [
      'section.elementor-section:nth-of-type(1)', // Hero
      'section.elementor-section:nth-of-type(2)', // Tours
      'section.elementor-section:nth-of-type(3)', // Why Choose Us
      'section.elementor-section:nth-of-type(4)', // Footer/CTA
    ];

    const sectionNames = ['hero', 'tours', 'why-choose-us', 'footer-cta'];

    for (let i = 0; i < sectionSelectors.length; i++) {
      const selector = sectionSelectors[i];
      const name = sectionNames[i];

      console.log(`📦 Section ${i + 1}: ${name}`);

      // Extract exact styles
      const sectionData = await this.extractSectionStyles(selector, i);

      if (sectionData) {
        // Take screenshot for visual verification
        const screenshotPath = await this.screenshotSection(selector, name);

        sectionData.name = name;
        sectionData.index = i;
        sectionData.screenshot = screenshotPath;

        this.extractedData.sections.push(sectionData);
        console.log(`  ✓ Extracted ${Object.keys(sectionData.styles).length} CSS properties\n`);
      } else {
        console.log(`  ✗ Section not found\n`);
      }
    }
  }

  /**
   * Extract ALL CSS rules from stylesheets (deterministic)
   */
  async extractCSSRules() {
    console.log('🎨 Extracting CSS rules...\n');

    const cssRules = await this.page.evaluate(() => {
      const rules = [];

      // Get all stylesheets
      for (const sheet of document.styleSheets) {
        try {
          // Only process same-origin stylesheets
          if (sheet.href && !sheet.href.includes(window.location.hostname)) {
            continue;
          }

          const cssRules = sheet.cssRules || sheet.rules;
          for (const rule of cssRules) {
            if (rule.style) {
              const ruleData = {
                selector: rule.selectorText,
                properties: {}
              };

              // Extract all properties
              for (let i = 0; i < rule.style.length; i++) {
                const prop = rule.style[i];
                ruleData.properties[prop] = rule.style.getPropertyValue(prop);
              }

              if (Object.keys(ruleData.properties).length > 0) {
                rules.push(ruleData);
              }
            }
          }
        } catch (e) {
          // Skip CORS-protected stylesheets
        }
      }

      return rules;
    });

    this.extractedData.cssRules = cssRules;
    console.log(`✓ Extracted ${cssRules.length} CSS rules\n`);
  }

  /**
   * Generate deterministic transformation rules
   * Maps original CSS to Next.js/Tailwind equivalents
   */
  async generateTransformationRules() {
    console.log('🔄 Generating transformation rules...\n');

    for (const section of this.extractedData.sections) {
      const transformations = {
        section: section.name,
        selector: section.selector,
        mappings: []
      };

      // Map background colors
      if (section.styles.backgroundColor) {
        transformations.mappings.push({
          original: { backgroundColor: section.styles.backgroundColor },
          tailwind: this.colorToTailwind(section.styles.backgroundColor),
          css: `background-color: ${section.styles.backgroundColor};`
        });
      }

      // Map padding
      if (section.styles.padding) {
        transformations.mappings.push({
          original: { padding: section.styles.padding },
          tailwind: this.paddingToTailwind(section.styles.padding),
          css: `padding: ${section.styles.padding};`
        });
      }

      // Map min-height
      if (section.styles.minHeight) {
        transformations.mappings.push({
          original: { minHeight: section.styles.minHeight },
          tailwind: this.minHeightToTailwind(section.styles.minHeight),
          css: `min-height: ${section.styles.minHeight};`
        });
      }

      // Map filters
      if (section.styles.filter && section.styles.filter !== 'none') {
        transformations.mappings.push({
          original: { filter: section.styles.filter },
          tailwind: null, // Filters need inline styles
          css: `filter: ${section.styles.filter};`
        });
      }

      // Map background images
      if (section.styles.backgroundImage && section.styles.backgroundImage !== 'none') {
        const bgImage = section.styles.backgroundImage;
        const urlMatch = bgImage.match(/url\(["']?(.+?)["']?\)/);
        if (urlMatch) {
          transformations.mappings.push({
            original: { backgroundImage: section.styles.backgroundImage },
            imageUrl: urlMatch[1],
            backgroundSize: section.styles.backgroundSize,
            backgroundPosition: section.styles.backgroundPosition,
            css: `background-image: ${section.styles.backgroundImage}; background-size: ${section.styles.backgroundSize}; background-position: ${section.styles.backgroundPosition};`
          });
        }
      }

      this.extractedData.transformationRules.push(transformations);
    }

    console.log(`✓ Generated ${this.extractedData.transformationRules.length} transformation rule sets\n`);
  }

  /**
   * Helper: Convert RGB color to Tailwind class (deterministic)
   */
  colorToTailwind(color) {
    // Extract RGB values
    const rgbMatch = color.match(/rgb\((\d+),\s*(\d+),\s*(\d+)\)/);
    if (rgbMatch) {
      const [, r, g, b] = rgbMatch.map(Number);

      // Exact color matches
      if (r === 48 && g === 187 && b === 216) return 'bg-cyan'; // #30BBD8
      if (r === 245 && g === 182 && b === 211) return 'bg-pink'; // #F5B6D3
      if (r === 0 && g === 29 && b === 70) return 'bg-navy'; // #001D46
      if (r === 255 && g === 255 && b === 255) return 'bg-white';
      if (r === 0 && g === 0 && b === 0) return 'bg-black';
    }

    return { custom: color };
  }

  /**
   * Helper: Convert padding to Tailwind
   */
  paddingToTailwind(padding) {
    const parts = padding.split(' ');
    if (parts.length === 1) {
      const value = parseInt(parts[0]);
      if (value === 0) return 'p-0';
      if (value === 150) return 'py-[150px]';
      if (value === 75) return 'py-[75px]';
    }
    return { custom: padding };
  }

  /**
   * Helper: Convert min-height to Tailwind
   */
  minHeightToTailwind(minHeight) {
    if (minHeight.includes('vh')) {
      return 'min-h-screen';
    }
    if (minHeight === '450px') return 'min-h-[450px]';
    return { custom: minHeight };
  }

  /**
   * Save all extracted data
   */
  async saveData() {
    console.log('💾 Saving extracted data...\n');

    // Main extraction file
    await fs.writeFile(
      path.join(OUTPUT_DIR, 'extraction.json'),
      JSON.stringify(this.extractedData, null, 2)
    );

    // Sections only
    await fs.writeFile(
      path.join(OUTPUT_DIR, 'sections.json'),
      JSON.stringify(this.extractedData.sections, null, 2)
    );

    // CSS rules only
    await fs.writeFile(
      path.join(OUTPUT_DIR, 'css-rules.json'),
      JSON.stringify(this.extractedData.cssRules, null, 2)
    );

    // Transformation rules (ready to apply)
    await fs.writeFile(
      path.join(OUTPUT_DIR, 'transformation-rules.json'),
      JSON.stringify(this.extractedData.transformationRules, null, 2)
    );

    console.log('✓ Saved extraction.json');
    console.log('✓ Saved sections.json');
    console.log('✓ Saved css-rules.json');
    console.log('✓ Saved transformation-rules.json\n');
  }

  /**
   * Generate visual QC report
   */
  async generateQCReport() {
    console.log('📊 Generating QC report...\n');

    const report = {
      timestamp: new Date().toISOString(),
      url: TARGET_URL,
      sections: this.extractedData.sections.map(s => ({
        name: s.name,
        selector: s.selector,
        screenshot: s.screenshot,
        dimensions: s.rect,
        propertiesExtracted: Object.keys(s.styles).length,
        keyProperties: {
          backgroundColor: s.styles.backgroundColor,
          padding: s.styles.padding,
          minHeight: s.styles.minHeight,
          backgroundImage: s.styles.backgroundImage ? 'yes' : 'no',
          filter: s.styles.filter || 'none'
        }
      })),
      summary: {
        totalSections: this.extractedData.sections.length,
        totalCSSRules: this.extractedData.cssRules.length,
        totalTransformations: this.extractedData.transformationRules.length
      }
    };

    await fs.writeFile(
      path.join(OUTPUT_DIR, 'qc-report.json'),
      JSON.stringify(report, null, 2)
    );

    // Generate HTML QC report for visual verification
    const html = this.generateQCHTML(report);
    await fs.writeFile(
      path.join(OUTPUT_DIR, 'qc-report.html'),
      html
    );

    console.log('✓ Generated qc-report.json');
    console.log('✓ Generated qc-report.html\n');
  }

  /**
   * Generate HTML QC report with screenshots
   */
  generateQCHTML(report) {
    return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Visual QC Report - ${new Date().toISOString()}</title>
  <style>
    body { font-family: system-ui; max-width: 1200px; margin: 0 auto; padding: 20px; }
    .section { border: 1px solid #ddd; margin: 20px 0; padding: 20px; border-radius: 8px; }
    .section h2 { margin-top: 0; }
    .screenshot { max-width: 100%; border: 1px solid #ccc; border-radius: 4px; }
    .properties { background: #f5f5f5; padding: 10px; border-radius: 4px; font-family: monospace; font-size: 12px; }
    .key-prop { display: inline-block; margin: 5px; padding: 5px 10px; background: #e0e0e0; border-radius: 4px; }
  </style>
</head>
<body>
  <h1>Visual QC Report</h1>
  <p><strong>Generated:</strong> ${report.timestamp}</p>
  <p><strong>Source:</strong> ${report.url}</p>

  <h2>Summary</h2>
  <ul>
    <li>Sections Extracted: ${report.summary.totalSections}</li>
    <li>CSS Rules: ${report.summary.totalCSSRules}</li>
    <li>Transformations: ${report.summary.totalTransformations}</li>
  </ul>

  <h2>Sections</h2>
  ${report.sections.map(section => `
    <div class="section">
      <h2>${section.name}</h2>
      <p><strong>Selector:</strong> <code>${section.selector}</code></p>
      <p><strong>Dimensions:</strong> ${section.dimensions.width}px × ${section.dimensions.height}px</p>
      <p><strong>Properties Extracted:</strong> ${section.propertiesExtracted}</p>

      <h3>Key Properties</h3>
      <div>
        ${Object.entries(section.keyProperties).map(([key, value]) =>
          `<span class="key-prop"><strong>${key}:</strong> ${value}</span>`
        ).join('')}
      </div>

      <h3>Screenshot</h3>
      <img src="${section.screenshot ? path.relative(OUTPUT_DIR, section.screenshot) : ''}" class="screenshot" alt="${section.name}">
    </div>
  `).join('')}
</body>
</html>`;
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  async run() {
    try {
      console.log('🚀 DETERMINISTIC EXTRACTOR\n');
      console.log('═══════════════════════════════════════\n');

      await this.init();
      await this.navigate();

      // Take full page screenshot
      await this.page.screenshot({
        path: path.join(OUTPUT_DIR, 'screenshots', 'full-page.png'),
        fullPage: true
      });
      console.log('📸 Full page screenshot saved\n');

      await this.extractSections();
      await this.extractCSSRules();
      await this.generateTransformationRules();
      await this.saveData();
      await this.generateQCReport();

      console.log('═══════════════════════════════════════');
      console.log('✨ EXTRACTION COMPLETE\n');
      console.log(`📁 Output: ${OUTPUT_DIR}`);
      console.log(`📊 Open qc-report.html to verify visually\n`);

    } catch (error) {
      console.error('\n❌ Error:', error);
      throw error;
    } finally {
      await this.close();
    }
  }
}

// Run
const extractor = new DeterministicExtractor();
extractor.run().catch(console.error);

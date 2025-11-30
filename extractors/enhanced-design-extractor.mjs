#!/usr/bin/env node

/**
 * Enhanced Design Extractor with Chrome DevTools MCP Integration
 *
 * This script uses Chrome DevTools MCP to:
 * 1. Visually inspect the live WordPress site
 * 2. Extract complete DOM structure with computed styles
 * 3. Identify and extract carousel/slideshow configurations
 * 4. Download all images and assets
 * 5. Generate comprehensive design specifications
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_URL = process.env.TARGET_URL || 'https://www.barbudaleisure.com';
const OUTPUT_DIR = path.join(__dirname, 'output', 'design-extraction');

class EnhancedDesignExtractor {
  constructor() {
    this.client = null;
    this.transport = null;
    this.screenshots = [];
    this.extractedData = {
      metadata: {
        url: TARGET_URL,
        timestamp: new Date().toISOString(),
        extractor: 'enhanced-design-extractor',
        version: '2.0.0'
      },
      sections: [],
      carousels: [],
      images: [],
      colors: new Set(),
      fonts: new Set(),
      animations: [],
      dividers: []
    };
  }

  /**
   * Helper to parse MCP tool call responses
   */
  parseMCPResponse(result, defaultValue = null) {
    try {
      if (result && result.content && result.content.length > 0) {
        const content = result.content[0];
        if (content.type === 'text') {
          return JSON.parse(content.text);
        }
      }
    } catch (e) {
      console.error('Failed to parse MCP response:', e.message);
    }
    return defaultValue;
  }

  async init() {
    console.log('🚀 Initializing Enhanced Design Extractor...');

    // Create output directory
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    await fs.mkdir(path.join(OUTPUT_DIR, 'screenshots'), { recursive: true });
    await fs.mkdir(path.join(OUTPUT_DIR, 'assets'), { recursive: true });

    // Initialize MCP client
    this.transport = new StdioClientTransport({
      command: 'npx',
      args: ['-y', 'chrome-devtools-mcp@latest', '--headless=true', '--isolated=true']
    });

    this.client = new Client(
      { name: 'enhanced-design-extractor', version: '2.0.0' },
      { capabilities: {} }
    );

    await this.client.connect(this.transport);
    console.log('✅ Chrome DevTools MCP connected');
  }

  async navigateToSite() {
    console.log(`🌐 Navigating to ${TARGET_URL}...`);

    // Create new page
    await this.client.callTool({
      name: 'chrome-devtools__new_page',
      arguments: {}
    });

    // Set viewport
    await this.client.callTool({
      name: 'chrome-devtools__resize_page',
      arguments: { width: 1366, height: 900 }
    });

    // Navigate to URL
    await this.client.callTool({
      name: 'chrome-devtools__navigate_page',
      arguments: { type: 'url', url: TARGET_URL, timeout: 30000 }
    });

    // Wait for page to fully load
    await new Promise(resolve => setTimeout(resolve, 3000));

    console.log('✅ Page loaded');
  }

  async takeScreenshot(name) {
    const filepath = path.join(OUTPUT_DIR, 'screenshots', `${name}.png`);

    await this.client.callTool({
      name: 'chrome-devtools__take_screenshot',
      arguments: {
        filePath: filepath,
        fullPage: true,
        format: 'png'
      }
    });

    this.screenshots.push({ name, filepath });
    console.log(`📸 Screenshot saved: ${name}.png`);
  }

  async extractDOMStructure() {
    console.log('🔍 Extracting DOM structure...');

    const script = `
      (function() {
        const sections = [];
        const sectionElements = document.querySelectorAll('section, .elementor-section, .elementor-top-section');

        sectionElements.forEach((section, index) => {
          const computed = window.getComputedStyle(section);
          const rect = section.getBoundingClientRect();

          const sectionData = {
            index,
            tagName: section.tagName,
            className: section.className,
            id: section.id,
            position: {
              top: rect.top + window.scrollY,
              left: rect.left,
              width: rect.width,
              height: rect.height
            },
            styles: {
              background: computed.background,
              backgroundColor: computed.backgroundColor,
              backgroundImage: computed.backgroundImage,
              backgroundSize: computed.backgroundSize,
              backgroundPosition: computed.backgroundPosition,
              padding: computed.padding,
              margin: computed.margin,
              minHeight: computed.minHeight,
              display: computed.display,
              flexDirection: computed.flexDirection,
              justifyContent: computed.justifyContent,
              alignItems: computed.alignItems
            },
            children: []
          };

          // Extract child containers
          const containers = section.querySelectorAll('.elementor-container, .container, .elementor-column');
          containers.forEach((container, cIndex) => {
            const cComputed = window.getComputedStyle(container);
            sectionData.children.push({
              index: cIndex,
              className: container.className,
              styles: {
                width: cComputed.width,
                maxWidth: cComputed.maxWidth,
                padding: cComputed.padding,
                display: cComputed.display,
                gap: cComputed.gap
              }
            });
          });

          sections.push(sectionData);
        });

        return JSON.stringify(sections);
      })();
    `;

    const result = await this.client.callTool({
      name: 'chrome-devtools__evaluate_js',
      arguments: { expression: script }
    });

    // Handle MCP response format
    let sections = [];
    if (result && result.content && result.content.length > 0) {
      const content = result.content[0];
      if (content.type === 'text') {
        try {
          sections = JSON.parse(content.text);
        } catch (e) {
          console.error('Failed to parse sections:', e.message);
          sections = [];
        }
      }
    }

    this.extractedData.sections = sections;
    console.log(`✅ Extracted ${this.extractedData.sections.length} sections`);
  }

  async extractCarousels() {
    console.log('🎠 Extracting carousels and sliders...');

    const script = `
      (function() {
        const carousels = [];

        // Detect Swiper carousels
        document.querySelectorAll('.swiper, .swiper-container, .elementor-swiper').forEach((swiper, index) => {
          const carousel = {
            type: 'swiper',
            index,
            className: swiper.className,
            slides: []
          };

          // Get slides
          swiper.querySelectorAll('.swiper-slide').forEach((slide, sIndex) => {
            const img = slide.querySelector('img');
            carousel.slides.push({
              index: sIndex,
              content: slide.innerHTML.substring(0, 200),
              image: img ? img.src : null,
              alt: img ? img.alt : null
            });
          });

          // Get configuration from data attributes
          for (const attr of swiper.attributes) {
            if (attr.name.startsWith('data-')) {
              carousel[attr.name] = attr.value;
            }
          }

          carousels.push(carousel);
        });

        // Detect Elementor slideshows
        document.querySelectorAll('.elementor-slideshow, .elementor-background-slideshow').forEach((slideshow, index) => {
          const carousel = {
            type: 'elementor-slideshow',
            index,
            className: slideshow.className,
            slides: []
          };

          // Get slideshow images from data attribute or child elements
          const dataSlideshow = slideshow.getAttribute('data-slideshow');
          if (dataSlideshow) {
            try {
              carousel.config = JSON.parse(dataSlideshow);
            } catch (e) {}
          }

          slideshow.querySelectorAll('.elementor-background-slide').forEach((slide, sIndex) => {
            const computed = window.getComputedStyle(slide);
            carousel.slides.push({
              index: sIndex,
              backgroundImage: computed.backgroundImage
            });
          });

          carousels.push(carousel);
        });

        // Detect other carousel types (Slick, Owl, etc.)
        document.querySelectorAll('.slick-slider, .owl-carousel, .carousel').forEach((carousel, index) => {
          const type = carousel.classList.contains('slick-slider') ? 'slick' :
                      carousel.classList.contains('owl-carousel') ? 'owl' : 'generic';

          carousels.push({
            type,
            index,
            className: carousel.className,
            innerHTML: carousel.innerHTML.substring(0, 500)
          });
        });

        return JSON.stringify(carousels);
      })();
    `;

    const result = await this.client.callTool({
      name: 'chrome-devtools__evaluate_js',
      arguments: { expression: script }
    });

    this.extractedData.carousels = JSON.parse(result.content[0].text);
    console.log(`✅ Extracted ${this.extractedData.carousels.length} carousels/sliders`);
  }

  async extractColors() {
    console.log('🎨 Extracting color palette...');

    const script = `
      (function() {
        const colors = new Set();

        // Extract colors from computed styles
        document.querySelectorAll('*').forEach(element => {
          const computed = window.getComputedStyle(element);

          if (computed.color && computed.color !== 'rgba(0, 0, 0, 0)') {
            colors.add(computed.color);
          }
          if (computed.backgroundColor && computed.backgroundColor !== 'rgba(0, 0, 0, 0)') {
            colors.add(computed.backgroundColor);
          }
          if (computed.borderColor && computed.borderColor !== 'rgba(0, 0, 0, 0)') {
            colors.add(computed.borderColor);
          }
        });

        // Extract from CSS variables
        const rootStyles = window.getComputedStyle(document.documentElement);
        for (let i = 0; i < rootStyles.length; i++) {
          const prop = rootStyles[i];
          if (prop.startsWith('--') && (prop.includes('color') || prop.includes('bg'))) {
            const value = rootStyles.getPropertyValue(prop).trim();
            if (value) colors.add(value);
          }
        }

        return JSON.stringify(Array.from(colors));
      })();
    `;

    const result = await this.client.callTool({
      name: 'chrome-devtools__evaluate_js',
      arguments: { expression: script }
    });

    const colors = JSON.parse(result.content[0].text);
    this.extractedData.colors = colors;
    console.log(`✅ Extracted ${colors.length} unique colors`);
  }

  async extractFonts() {
    console.log('📝 Extracting typography...');

    const script = `
      (function() {
        const fonts = new Set();
        const typography = [];

        // Extract all font families
        document.querySelectorAll('*').forEach(element => {
          const computed = window.getComputedStyle(element);
          if (computed.fontFamily) {
            fonts.add(computed.fontFamily);
          }
        });

        // Extract typography from headings and key elements
        document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, .elementor-heading-title, button, a').forEach(element => {
          const computed = window.getComputedStyle(element);
          typography.push({
            tagName: element.tagName,
            className: element.className,
            text: element.textContent.substring(0, 50),
            fontFamily: computed.fontFamily,
            fontSize: computed.fontSize,
            fontWeight: computed.fontWeight,
            lineHeight: computed.lineHeight,
            letterSpacing: computed.letterSpacing,
            color: computed.color
          });
        });

        return JSON.stringify({
          fonts: Array.from(fonts),
          typography: typography.slice(0, 50) // Limit to first 50
        });
      })();
    `;

    const result = await this.client.callTool({
      name: 'chrome-devtools__evaluate_js',
      arguments: { expression: script }
    });

    const data = JSON.parse(result.content[0].text);
    this.extractedData.fonts = data.fonts;
    this.extractedData.typography = data.typography;
    console.log(`✅ Extracted ${data.fonts.length} font families`);
  }

  async extractImages() {
    console.log('🖼️  Extracting images...');

    const script = `
      (function() {
        const images = [];

        document.querySelectorAll('img').forEach((img, index) => {
          images.push({
            index,
            src: img.src,
            alt: img.alt,
            width: img.width,
            height: img.height,
            naturalWidth: img.naturalWidth,
            naturalHeight: img.naturalHeight,
            className: img.className,
            loading: img.loading,
            srcset: img.srcset
          });
        });

        // Extract background images
        document.querySelectorAll('*').forEach((element, index) => {
          const computed = window.getComputedStyle(element);
          if (computed.backgroundImage && computed.backgroundImage !== 'none') {
            const match = computed.backgroundImage.match(/url\\(["']?(.+?)["']?\\)/);
            if (match && match[1]) {
              images.push({
                index: \`bg-\${index}\`,
                src: match[1],
                type: 'background',
                className: element.className
              });
            }
          }
        });

        return JSON.stringify(images);
      })();
    `;

    const result = await this.client.callTool({
      name: 'chrome-devtools__evaluate_js',
      arguments: { expression: script }
    });

    this.extractedData.images = JSON.parse(result.content[0].text);
    console.log(`✅ Extracted ${this.extractedData.images.length} images`);
  }

  async extractDividers() {
    console.log('〰️  Extracting wave dividers and separators...');

    const script = `
      (function() {
        const dividers = [];

        document.querySelectorAll('.elementor-shape, .elementor-divider, svg[class*="wave"], svg[class*="divider"]').forEach((divider, index) => {
          const parent = divider.parentElement;
          const computed = window.getComputedStyle(divider);
          const parentComputed = window.getComputedStyle(parent);

          dividers.push({
            index,
            type: divider.tagName.toLowerCase(),
            className: divider.className,
            parentClassName: parent.className,
            styles: {
              fill: computed.fill || divider.getAttribute('fill'),
              stroke: computed.stroke,
              width: computed.width,
              height: computed.height,
              position: parentComputed.position,
              top: parentComputed.top,
              bottom: parentComputed.bottom,
              transform: computed.transform
            },
            svgContent: divider.tagName === 'svg' ? divider.outerHTML.substring(0, 500) : null
          });
        });

        return JSON.stringify(dividers);
      })();
    `;

    const result = await this.client.callTool({
      name: 'chrome-devtools__evaluate_js',
      arguments: { expression: script }
    });

    this.extractedData.dividers = JSON.parse(result.content[0].text);
    console.log(`✅ Extracted ${this.extractedData.dividers.length} dividers`);
  }

  async saveResults() {
    console.log('💾 Saving extraction results...');

    // Save main data file
    const dataPath = path.join(OUTPUT_DIR, 'extracted-design.json');
    await fs.writeFile(
      dataPath,
      JSON.stringify({
        ...this.extractedData,
        colors: Array.from(this.extractedData.colors),
        fonts: Array.from(this.extractedData.fonts)
      }, null, 2)
    );

    // Save separate files for each category
    await fs.writeFile(
      path.join(OUTPUT_DIR, 'sections.json'),
      JSON.stringify(this.extractedData.sections, null, 2)
    );

    await fs.writeFile(
      path.join(OUTPUT_DIR, 'carousels.json'),
      JSON.stringify(this.extractedData.carousels, null, 2)
    );

    await fs.writeFile(
      path.join(OUTPUT_DIR, 'colors.json'),
      JSON.stringify(Array.from(this.extractedData.colors), null, 2)
    );

    await fs.writeFile(
      path.join(OUTPUT_DIR, 'images.json'),
      JSON.stringify(this.extractedData.images, null, 2)
    );

    console.log(`✅ Results saved to ${OUTPUT_DIR}`);
  }

  async cleanup() {
    if (this.transport) {
      await this.transport.close();
    }
  }

  async run() {
    try {
      await this.init();
      await this.navigateToSite();
      await this.takeScreenshot('homepage-full');

      await this.extractDOMStructure();
      await this.extractCarousels();
      await this.extractColors();
      await this.extractFonts();
      await this.extractImages();
      await this.extractDividers();

      await this.saveResults();

      console.log('\n✨ Extraction complete!');
      console.log(`📁 Results: ${OUTPUT_DIR}`);

    } catch (error) {
      console.error('❌ Error:', error);
      throw error;
    } finally {
      await this.cleanup();
    }
  }
}

// Run extractor
const extractor = new EnhancedDesignExtractor();
extractor.run().catch(console.error);

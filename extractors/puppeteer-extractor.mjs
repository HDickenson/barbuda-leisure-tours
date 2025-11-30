#!/usr/bin/env node

/**
 * Puppeteer-based Design Extractor
 * Reliable extraction using Puppeteer (proven to work from visual-compare.mjs)
 */

import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_URL = 'https://www.barbudaleisure.com';
const OUTPUT_DIR = path.join(__dirname, 'output', 'puppeteer-extraction');

async function main() {
  console.log('🚀 Starting Puppeteer Design Extraction...\n');
  console.log(`Target: ${TARGET_URL}\n`);

  // Create output directory
  await fs.mkdir(OUTPUT_DIR, { recursive: true });
  await fs.mkdir(path.join(OUTPUT_DIR, 'screenshots'), { recursive: true });

  let browser = null;

  try {
    // Launch browser
    console.log('🌐 Launching browser...');
    browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox']
    });

    const page = await browser.newPage();
    await page.setViewport({ width: 1920, height: 1080, deviceScaleFactor: 1 });

    console.log('📄 Navigating to page...');
    await page.goto(TARGET_URL, {
      waitUntil: 'networkidle2',
      timeout: 60000
    });

    console.log('✅ Page loaded\n');

    // Take screenshots
    console.log('📸 Taking screenshots...');

    // Full page screenshot
    await page.screenshot({
      path: path.join(OUTPUT_DIR, 'screenshots', 'homepage-full.png'),
      fullPage: true
    });
    console.log('   ✓ Full page screenshot');

    // Viewport screenshot
    await page.screenshot({
      path: path.join(OUTPUT_DIR, 'screenshots', 'homepage-viewport.png'),
      fullPage: false
    });
    console.log('   ✓ Viewport screenshot\n');

    // Extract comprehensive design data
    console.log('🔍 Extracting design data...\n');

    const designData = await page.evaluate(() => {
      const data = {
        metadata: {
          url: window.location.href,
          title: document.title,
          timestamp: new Date().toISOString()
        },
        sections: [],
        carousels: [],
        images: [],
        backgroundImages: [],
        colors: [],
        fonts: [],
        typography: [],
        dividers: [],
        animations: []
      };

      // Extract sections with detailed styling
      console.log('Extracting sections...');
      document.querySelectorAll('section, .elementor-section, .elementor-top-section').forEach((section, index) => {
        const computed = window.getComputedStyle(section);
        const rect = section.getBoundingClientRect();

        data.sections.push({
          index,
          selector: section.tagName.toLowerCase(),
          id: section.id,
          className: section.className,
          position: {
            top: rect.top + window.scrollY,
            height: rect.height,
            width: rect.width
          },
          styles: {
            background: computed.background,
            backgroundColor: computed.backgroundColor,
            backgroundImage: computed.backgroundImage,
            backgroundSize: computed.backgroundSize,
            backgroundPosition: computed.backgroundPosition,
            backgroundAttachment: computed.backgroundAttachment,
            padding: computed.padding,
            paddingTop: computed.paddingTop,
            paddingBottom: computed.paddingBottom,
            margin: computed.margin,
            minHeight: computed.minHeight,
            display: computed.display,
            position: computed.position,
            zIndex: computed.zIndex,
            overflow: computed.overflow
          },
          filters: {
            filter: computed.filter,
            backdropFilter: computed.backdropFilter
          },
          // Extract child structure
          children: {
            containers: section.querySelectorAll('.elementor-container, .container').length,
            columns: section.querySelectorAll('.elementor-column, .col').length,
            widgets: section.querySelectorAll('[class*="elementor-widget"], [class*="widget"]').length
          }
        });
      });

      // Extract carousels and sliders
      console.log('Extracting carousels...');

      // Swiper
      document.querySelectorAll('.swiper, .swiper-container, .elementor-swiper').forEach((swiper, index) => {
        const slides = swiper.querySelectorAll('.swiper-slide');
        data.carousels.push({
          type: 'swiper',
          index,
          className: swiper.className,
          slidesCount: slides.length,
          slides: Array.from(slides).map((slide, sIndex) => {
            const img = slide.querySelector('img');
            const computed = window.getComputedStyle(slide);
            return {
              index: sIndex,
              backgroundImage: computed.backgroundImage,
              image: img ? {
                src: img.src,
                alt: img.alt,
                width: img.width,
                height: img.height
              } : null
            };
          }),
          config: Array.from(swiper.attributes)
            .filter(attr => attr.name.startsWith('data-'))
            .reduce((acc, attr) => {
              acc[attr.name] = attr.value;
              return acc;
            }, {})
        });
      });

      // Elementor slideshow
      document.querySelectorAll('.elementor-slideshow, .elementor-background-slideshow').forEach((slideshow, index) => {
        const slides = slideshow.querySelectorAll('.elementor-background-slide, [class*="slide"]');
        data.carousels.push({
          type: 'elementor-slideshow',
          index,
          className: slideshow.className,
          slidesCount: slides.length,
          slides: Array.from(slides).map((slide, sIndex) => {
            const computed = window.getComputedStyle(slide);
            return {
              index: sIndex,
              backgroundImage: computed.backgroundImage,
              transition: computed.transition,
              animation: computed.animation
            };
          }),
          dataSlideshow: slideshow.getAttribute('data-slideshow')
        });
      });

      // Extract all images
      console.log('Extracting images...');
      document.querySelectorAll('img').forEach((img, index) => {
        data.images.push({
          index,
          src: img.src,
          alt: img.alt,
          title: img.title,
          width: img.width,
          height: img.height,
          naturalWidth: img.naturalWidth,
          naturalHeight: img.naturalHeight,
          className: img.className,
          loading: img.loading,
          srcset: img.srcset,
          sizes: img.sizes,
          parent: {
            tagName: img.parentElement?.tagName,
            className: img.parentElement?.className
          }
        });
      });

      // Extract background images
      console.log('Extracting background images...');
      document.querySelectorAll('*').forEach((element, index) => {
        const computed = window.getComputedStyle(element);
        if (computed.backgroundImage && computed.backgroundImage !== 'none') {
          const urlMatch = computed.backgroundImage.match(/url\(["']?(.+?)["']?\)/);
          if (urlMatch && urlMatch[1]) {
            data.backgroundImages.push({
              index,
              url: urlMatch[1],
              element: element.tagName,
              className: element.className,
              id: element.id,
              backgroundSize: computed.backgroundSize,
              backgroundPosition: computed.backgroundPosition,
              backgroundRepeat: computed.backgroundRepeat
            });
          }
        }
      });

      // Extract color palette
      console.log('Extracting colors...');
      const colorSet = new Set();
      document.querySelectorAll('section, div, header, footer, button, a').forEach(element => {
        const computed = window.getComputedStyle(element);

        if (computed.color && computed.color !== 'rgba(0, 0, 0, 0)') {
          colorSet.add(computed.color);
        }
        if (computed.backgroundColor && computed.backgroundColor !== 'rgba(0, 0, 0, 0)') {
          colorSet.add(computed.backgroundColor);
        }
        if (computed.borderColor && computed.borderColor !== 'rgba(0, 0, 0, 0)') {
          colorSet.add(computed.borderColor);
        }
      });

      // Extract CSS variables
      const rootStyles = window.getComputedStyle(document.documentElement);
      for (let i = 0; i < rootStyles.length; i++) {
        const prop = rootStyles[i];
        if (prop.startsWith('--') && (prop.includes('color') || prop.includes('bg'))) {
          const value = rootStyles.getPropertyValue(prop).trim();
          if (value && value.match(/^(#|rgb|hsl)/)) {
            colorSet.add(value);
          }
        }
      }

      data.colors = Array.from(colorSet);

      // Extract typography
      console.log('Extracting typography...');
      const fontSet = new Set();

      document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, button, a, .elementor-heading-title').forEach((element, index) => {
        const computed = window.getComputedStyle(element);
        const text = element.textContent.trim().substring(0, 100);

        fontSet.add(computed.fontFamily);

        if (index < 100) { // Limit typography samples
          data.typography.push({
            index,
            tagName: element.tagName,
            className: element.className,
            text,
            fontFamily: computed.fontFamily,
            fontSize: computed.fontSize,
            fontWeight: computed.fontWeight,
            fontStyle: computed.fontStyle,
            lineHeight: computed.lineHeight,
            letterSpacing: computed.letterSpacing,
            textTransform: computed.textTransform,
            color: computed.color
          });
        }
      });

      data.fonts = Array.from(fontSet);

      // Extract dividers and shapes
      console.log('Extracting dividers...');
      document.querySelectorAll('.elementor-shape, .elementor-divider, svg[class*="wave"], svg[class*="divider"]').forEach((divider, index) => {
        const parent = divider.parentElement;
        const computed = window.getComputedStyle(divider);
        const parentComputed = window.getComputedStyle(parent);

        data.dividers.push({
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
            left: parentComputed.left,
            right: parentComputed.right,
            transform: computed.transform,
            zIndex: parentComputed.zIndex
          },
          svgContent: divider.tagName === 'svg' || divider.tagName === 'SVG' ?
            divider.outerHTML.substring(0, 1000) : null
        });
      });

      // Extract animations
      console.log('Extracting animations...');
      document.querySelectorAll('[data-animation], [class*="animated"], [class*="fadeIn"]').forEach((element, index) => {
        const computed = window.getComputedStyle(element);
        data.animations.push({
          index,
          element: element.tagName,
          className: element.className,
          dataAnimation: element.getAttribute('data-animation'),
          styles: {
            animation: computed.animation,
            transition: computed.transition,
            transform: computed.transform
          }
        });
      });

      return data;
    });

    // Save extracted data
    console.log('💾 Saving extracted data...\n');

    await fs.writeFile(
      path.join(OUTPUT_DIR, 'design-data.json'),
      JSON.stringify(designData, null, 2)
    );

    // Save individual category files
    await fs.writeFile(
      path.join(OUTPUT_DIR, 'sections.json'),
      JSON.stringify(designData.sections, null, 2)
    );

    await fs.writeFile(
      path.join(OUTPUT_DIR, 'carousels.json'),
      JSON.stringify(designData.carousels, null, 2)
    );

    await fs.writeFile(
      path.join(OUTPUT_DIR, 'images.json'),
      JSON.stringify(designData.images, null, 2)
    );

    await fs.writeFile(
      path.join(OUTPUT_DIR, 'colors.json'),
      JSON.stringify(designData.colors, null, 2)
    );

    await fs.writeFile(
      path.join(OUTPUT_DIR, 'fonts.json'),
      JSON.stringify(designData.fonts, null, 2)
    );

    console.log('✨ Extraction Complete!\n');
    console.log(`📁 Output directory: ${OUTPUT_DIR}\n`);
    console.log('📊 Summary:');
    console.log(`   - Sections: ${designData.sections.length}`);
    console.log(`   - Carousels/Sliders: ${designData.carousels.length}`);
    console.log(`   - Images: ${designData.images.length}`);
    console.log(`   - Background Images: ${designData.backgroundImages.length}`);
    console.log(`   - Colors: ${designData.colors.length}`);
    console.log(`   - Fonts: ${designData.fonts.length}`);
    console.log(`   - Typography samples: ${designData.typography.length}`);
    console.log(`   - Dividers: ${designData.dividers.length}`);
    console.log(`   - Animations: ${designData.animations.length}`);

  } catch (error) {
    console.error('\n❌ Error:', error);
    throw error;
  } finally {
    if (browser) {
      await browser.close();
    }
    console.log('\n👋 Done!');
  }
}

main().catch(console.error);

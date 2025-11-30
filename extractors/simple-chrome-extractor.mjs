#!/usr/bin/env node

/**
 * Simplified Chrome DevTools Extractor
 * Focused approach to extract design data accurately
 */

import { Client } from '@modelcontextprotocol/sdk/client/index.js';
import { StdioClientTransport } from '@modelcontextprotocol/sdk/client/stdio.js';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const TARGET_URL = 'https://www.barbudaleisure.com';
const OUTPUT_DIR = path.join(__dirname, 'output', 'chrome-extraction');

async function main() {
  console.log('🚀 Starting Chrome DevTools Extraction...\n');

  // Create output directory
  await fs.mkdir(OUTPUT_DIR, { recursive: true });

  // Initialize MCP client
  const transport = new StdioClientTransport({
    command: 'npx',
    args: ['-y', 'chrome-devtools-mcp@latest', '--headless=true', '--isolated=true']
  });

  const client = new Client(
    { name: 'chrome-extractor', version: '1.0.0' },
    { capabilities: {} }
  );

  try {
    await client.connect(transport);
    console.log('✅ Connected to Chrome DevTools\n');

    // List available tools
    console.log('📋 Available tools:');
    const tools = await client.listTools();
    tools.tools.forEach(tool => {
      console.log(`   - ${tool.name}`);
    });
    console.log('');

    // Create new page
    console.log('📄 Creating new page...');
    await client.callTool({ name: 'new_page', arguments: {} });

    // Set viewport
    console.log('🖥️  Setting viewport...');
    await client.callTool({
      name: 'resize_page',
      arguments: { width: 1920, height: 1080 }
    });

    // Navigate
    console.log(`🌐 Navigating to ${TARGET_URL}...`);
    await client.callTool({
      name: 'navigate_page',
      arguments: { url: TARGET_URL, timeout: 30000 }
    });

    // Wait for page load
    console.log('⏳ Waiting for page to load...');
    await new Promise(resolve => setTimeout(resolve, 5000));

    // Take screenshot
    console.log('📸 Taking screenshot...');
    const screenshotPath = path.join(OUTPUT_DIR, 'homepage.png');
    await client.callTool({
      name: 'take_screenshot',
      arguments: {
        path: screenshotPath,
        fullPage: true
      }
    });
    console.log(`✅ Screenshot saved: ${screenshotPath}\n`);

    // Extract data using console
    console.log('🔍 Extracting design data...\n');

    const extractionScript = `
      JSON.stringify({
        // Basic page info
        title: document.title,
        url: window.location.href,

        // Sections
        sections: Array.from(document.querySelectorAll('section, .elementor-section')).map((section, i) => {
          const styles = window.getComputedStyle(section);
          return {
            index: i,
            tag: section.tagName,
            id: section.id,
            classes: section.className,
            background: styles.background,
            backgroundColor: styles.backgroundColor,
            backgroundImage: styles.backgroundImage,
            padding: styles.padding,
            minHeight: styles.minHeight
          };
        }),

        // Images
        images: Array.from(document.querySelectorAll('img')).map(img => ({
          src: img.src,
          alt: img.alt,
          width: img.width,
          height: img.height
        })),

        // Carousels/Sliders
        sliders: Array.from(document.querySelectorAll('.swiper, .elementor-slideshow, .slick-slider')).map((slider, i) => ({
          index: i,
          type: slider.className,
          slidesCount: slider.querySelectorAll('.swiper-slide, .elementor-background-slide, .slick-slide').length
        })),

        // Colors (sample from key elements)
        colors: (() => {
          const colors = new Set();
          document.querySelectorAll('section, div[class*="elementor"], .container').forEach(el => {
            const styles = window.getComputedStyle(el);
            if (styles.backgroundColor && styles.backgroundColor !== 'rgba(0, 0, 0, 0)') {
              colors.add(styles.backgroundColor);
            }
          });
          return Array.from(colors);
        })(),

        // Fonts
        fonts: (() => {
          const fonts = new Set();
          document.querySelectorAll('h1, h2, h3, p, button').forEach(el => {
            fonts.add(window.getComputedStyle(el).fontFamily);
          });
          return Array.from(fonts);
        })()
      });
    `;

    console.log('📊 Running extraction script...');
    const result = await client.callTool({
      name: 'evaluate_script',
      arguments: { script: extractionScript }
    });

    console.log('📝 Processing results...');

    // Save raw result for inspection
    await fs.writeFile(
      path.join(OUTPUT_DIR, 'raw-result.json'),
      JSON.stringify(result, null, 2)
    );

    // Parse and save extracted data
    if (result && result.content && result.content.length > 0) {
      const content = result.content[0];

      if (content.type === 'text') {
        const data = JSON.parse(content.text);

        await fs.writeFile(
          path.join(OUTPUT_DIR, 'extracted-data.json'),
          JSON.stringify(data, null, 2)
        );

        console.log('\n✨ Extraction Complete!\n');
        console.log(`📁 Output directory: ${OUTPUT_DIR}`);
        console.log(`   - homepage.png (screenshot)`);
        console.log(`   - extracted-data.json (design data)`);
        console.log(`   - raw-result.json (MCP response)\n`);

        console.log('📊 Summary:');
        console.log(`   - Sections: ${data.sections?.length || 0}`);
        console.log(`   - Images: ${data.images?.length || 0}`);
        console.log(`   - Sliders: ${data.sliders?.length || 0}`);
        console.log(`   - Colors: ${data.colors?.length || 0}`);
        console.log(`   - Fonts: ${data.fonts?.length || 0}`);
      } else {
        console.log('❌ Unexpected content type:', content.type);
        console.log(content);
      }
    } else {
      console.log('❌ No content in result');
      console.log(result);
    }

  } catch (error) {
    console.error('\n❌ Error:', error.message);
    console.error(error);
  } finally {
    await transport.close();
    console.log('\n👋 Done!');
  }
}

main().catch(console.error);

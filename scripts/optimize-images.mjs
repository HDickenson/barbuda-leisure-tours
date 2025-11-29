#!/usr/bin/env node
/**
 * Image Optimization Script for Barbuda Leisure Day Tours
 * 
 * Features:
 * - Generates multiple responsive sizes (320w, 640w, 768w, 1024w, 1920w)
 * - Outputs WebP and AVIF formats with JPG/PNG fallbacks
 * - Optimizes compression for web delivery
 * - Updates all references in tours.ts, blog.json, and CSS files
 * - Preserves aspect ratios
 * - Organizes output by size and format
 * 
 * Usage:
 *   npm install --save-dev sharp
 *   node scripts/optimize-images.mjs [--dry-run] [--force]
 */

import sharp from 'sharp';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const CONFIG = {
  // Image sizes to generate (widths in pixels)
  sizes: [320, 640, 768, 1024, 1920],
  
  // Output formats
  formats: ['webp', 'avif', 'jpg'],
  
  // Quality settings per format
  quality: {
    webp: 85,
    avif: 80,
    jpg: 85,
    png: 90,
  },
  
  // Compression settings
  compression: {
    webp: { effort: 4 },
    avif: { effort: 4 },
    jpg: { progressive: true, mozjpeg: true },
    png: { compressionLevel: 9, progressive: true },
  },
  
  // Source directories to scan
  sourceDirs: [
    'public/images',
    'public/images/downloaded',
    'public/images/blog',
    'public/images/excellence',
  ],
  
  // Output directory structure
  outputDir: 'public/images/optimized',
  
  // Files to update with new paths
  updateFiles: [
    'src/data/tours.ts',
    'src/data/blog.json',
    'src/app/globals.css',
    'tailwind.config.js',
  ],
  
  // Skip files matching these patterns
  skipPatterns: [
    /\.svg$/i,
    /\.webp$/i,
    /\.avif$/i,
    /optimized/i,
    /-\d+w\./i, // Already optimized files
  ],
};

// Command line arguments
const args = process.argv.slice(2);
const DRY_RUN = args.includes('--dry-run');
const FORCE = args.includes('--force');

// Statistics
const stats = {
  processed: 0,
  skipped: 0,
  errors: 0,
  totalSizeBefore: 0,
  totalSizeAfter: 0,
  files: [],
};

/**
 * Main execution
 */
async function main() {
  console.log('🖼️  Barbuda Image Optimization Tool\n');
  
  if (DRY_RUN) {
    console.log('🔍 DRY RUN MODE - No files will be modified\n');
  }
  
  try {
    // Step 1: Create output directory
    await createOutputDirectory();
    
    // Step 2: Find all images
    console.log('📂 Scanning for images...\n');
    const images = await findAllImages();
    console.log(`Found ${images.length} images to process\n`);
    
    if (images.length === 0) {
      console.log('No images found. Exiting.');
      return;
    }
    
    // Step 3: Process each image
    console.log('⚙️  Processing images...\n');
    for (const imagePath of images) {
      await processImage(imagePath);
    }
    
    // Step 4: Update file references
    if (!DRY_RUN && stats.processed > 0) {
      console.log('\n📝 Updating file references...\n');
      await updateFileReferences();
    }
    
    // Step 5: Display summary
    displaySummary();
    
  } catch (error) {
    console.error('❌ Fatal error:', error.message);
    process.exit(1);
  }
}

/**
 * Create output directory structure
 */
async function createOutputDirectory() {
  const projectRoot = path.resolve(__dirname, '..');
  const outputPath = path.join(projectRoot, CONFIG.outputDir);
  
  if (!DRY_RUN) {
    await fs.mkdir(outputPath, { recursive: true });
  }
  
  console.log(`✅ Output directory: ${CONFIG.outputDir}\n`);
}

/**
 * Find all images in source directories
 */
async function findAllImages() {
  const projectRoot = path.resolve(__dirname, '..');
  const images = [];
  
  for (const dir of CONFIG.sourceDirs) {
    const fullPath = path.join(projectRoot, dir);
    
    try {
      await fs.access(fullPath);
      const files = await scanDirectory(fullPath);
      images.push(...files);
    } catch (error) {
      console.warn(`⚠️  Directory not found: ${dir}`);
    }
  }
  
  return images;
}

/**
 * Recursively scan directory for images
 */
async function scanDirectory(dir) {
  const images = [];
  
  try {
    const entries = await fs.readdir(dir, { withFileTypes: true });
    
    for (const entry of entries) {
      const fullPath = path.join(dir, entry.name);
      
      if (entry.isDirectory()) {
        const subImages = await scanDirectory(fullPath);
        images.push(...subImages);
      } else if (entry.isFile() && isImageFile(entry.name)) {
        if (!shouldSkipFile(entry.name)) {
          images.push(fullPath);
        }
      }
    }
  } catch (error) {
    console.warn(`⚠️  Could not scan directory: ${dir}`);
  }
  
  return images;
}

/**
 * Check if file is an image
 */
function isImageFile(filename) {
  const imageExtensions = ['.jpg', '.jpeg', '.png', '.webp', '.avif'];
  const ext = path.extname(filename).toLowerCase();
  return imageExtensions.includes(ext);
}

/**
 * Check if file should be skipped
 */
function shouldSkipFile(filename) {
  return CONFIG.skipPatterns.some(pattern => pattern.test(filename));
}

/**
 * Process a single image file
 */
async function processImage(imagePath) {
  const projectRoot = path.resolve(__dirname, '..');
  const relativePath = path.relative(projectRoot, imagePath);
  const filename = path.basename(imagePath, path.extname(imagePath));
  
  console.log(`  Processing: ${relativePath}`);
  
  try {
    // Get original file size
    const originalStats = await fs.stat(imagePath);
    stats.totalSizeBefore += originalStats.size;
    
    // Load image with sharp
    const image = sharp(imagePath);
    const metadata = await image.metadata();
    
    // Process each size
    const outputs = [];
    for (const width of CONFIG.sizes) {
      // Skip if image is smaller than target width
      if (metadata.width && metadata.width < width) continue;
      
      // Generate each format
      for (const format of CONFIG.formats) {
        const output = await generateImage(image, width, format, filename);
        if (output) {
          outputs.push(output);
        }
      }
    }
    
    // Calculate size savings
    const totalOutputSize = outputs.reduce((sum, out) => sum + out.size, 0);
    stats.totalSizeAfter += totalOutputSize;
    
    stats.files.push({
      original: relativePath,
      originalSize: originalStats.size,
      outputs: outputs,
      savings: originalStats.size - totalOutputSize,
      savingsPercent: ((1 - totalOutputSize / originalStats.size) * 100).toFixed(1),
    });
    
    stats.processed++;
    console.log(`    ✓ Generated ${outputs.length} variants (${formatBytes(totalOutputSize)})\n`);
    
  } catch (error) {
    console.error(`    ✗ Error: ${error.message}\n`);
    stats.errors++;
  }
}

/**
 * Generate a single optimized image
 */
async function generateImage(image, width, format, filename) {
  const projectRoot = path.resolve(__dirname, '..');
  const outputPath = path.join(
    projectRoot,
    CONFIG.outputDir,
    `${filename}-${width}w.${format}`
  );
  
  if (DRY_RUN) {
    return {
      path: outputPath,
      size: 0,
      width,
      format,
    };
  }
  
  try {
    // Clone the image and resize
    let pipeline = image.clone().resize(width, null, {
      withoutEnlargement: true,
      fit: 'inside',
    });
    
    // Apply format-specific settings
    switch (format) {
      case 'webp':
        pipeline = pipeline.webp({
          quality: CONFIG.quality.webp,
          ...CONFIG.compression.webp,
        });
        break;
      case 'avif':
        pipeline = pipeline.avif({
          quality: CONFIG.quality.avif,
          ...CONFIG.compression.avif,
        });
        break;
      case 'jpg':
      case 'jpeg':
        pipeline = pipeline.jpeg({
          quality: CONFIG.quality.jpg,
          ...CONFIG.compression.jpg,
        });
        break;
      case 'png':
        pipeline = pipeline.png({
          quality: CONFIG.quality.png,
          ...CONFIG.compression.png,
        });
        break;
    }
    
    // Save to disk
    const info = await pipeline.toFile(outputPath);
    
    return {
      path: outputPath,
      size: info.size,
      width: info.width,
      height: info.height,
      format,
    };
  } catch (error) {
    console.error(`      ⚠️  Failed to generate ${width}w ${format}: ${error.message}`);
    return null;
  }
}

/**
 * Update file references to use optimized images
 */
async function updateFileReferences() {
  const projectRoot = path.resolve(__dirname, '..');
  const pathMap = buildPathMap();
  
  for (const file of CONFIG.updateFiles) {
    const filePath = path.join(projectRoot, file);
    
    try {
      await fs.access(filePath);
      await updateFile(filePath, pathMap);
    } catch (error) {
      console.warn(`  ⚠️  File not found: ${file}`);
    }
  }
}

/**
 * Build a map of old paths to new optimized paths
 */
function buildPathMap() {
  const map = new Map();
  
  for (const fileInfo of stats.files) {
    const originalPath = fileInfo.original.replace(/\\/g, '/');
    
    // Find the best quality WebP at 1024w or largest available
    const webp1024 = fileInfo.outputs.find(
      out => out.format === 'webp' && out.width === 1024
    );
    const bestWebp = webp1024 || fileInfo.outputs.find(
      out => out.format === 'webp'
    );
    
    if (bestWebp) {
      const newPath = path.relative(
        path.resolve(__dirname, '..', 'public'),
        bestWebp.path
      ).replace(/\\/g, '/');
      
      // Map various possible reference formats
      const oldPathVariants = [
        `/images/${path.basename(originalPath)}`,
        `./images/${path.basename(originalPath)}`,
        `../images/${path.basename(originalPath)}`,
        originalPath,
      ];
      
      oldPathVariants.forEach(variant => {
        map.set(variant, `/${newPath}`);
      });
    }
  }
  
  return map;
}

/**
 * Update a single file with new image paths
 */
async function updateFile(filePath, pathMap) {
  const filename = path.basename(filePath);
  console.log(`  Updating: ${filename}`);
  
  try {
    let content = await fs.readFile(filePath, 'utf-8');
    let changes = 0;
    
    // Replace each old path with new path
    for (const [oldPath, newPath] of pathMap.entries()) {
      const regex = new RegExp(oldPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g');
      const matches = content.match(regex);
      if (matches) {
        content = content.replace(regex, newPath);
        changes += matches.length;
      }
    }
    
    if (changes > 0) {
      await fs.writeFile(filePath, content, 'utf-8');
      console.log(`    ✓ Updated ${changes} reference(s)\n`);
    } else {
      console.log(`    - No changes needed\n`);
    }
  } catch (error) {
    console.error(`    ✗ Error: ${error.message}\n`);
  }
}

/**
 * Display summary statistics
 */
function displaySummary() {
  console.log('\n' + '='.repeat(60));
  console.log('📊 OPTIMIZATION SUMMARY');
  console.log('='.repeat(60) + '\n');
  
  console.log(`✅ Processed: ${stats.processed} images`);
  console.log(`⏭️  Skipped: ${stats.skipped} images`);
  console.log(`❌ Errors: ${stats.errors} images\n`);
  
  if (stats.processed > 0) {
    const totalVariants = stats.files.reduce(
      (sum, file) => sum + file.outputs.length, 0
    );
    console.log(`🖼️  Generated: ${totalVariants} variants\n`);
    
    console.log(`💾 Original size: ${formatBytes(stats.totalSizeBefore)}`);
    console.log(`📦 Optimized size: ${formatBytes(stats.totalSizeAfter)}`);
    
    const totalSavings = stats.totalSizeBefore - stats.totalSizeAfter;
    const savingsPercent = ((totalSavings / stats.totalSizeBefore) * 100).toFixed(1);
    console.log(`💰 Total savings: ${formatBytes(totalSavings)} (${savingsPercent}%)\n`);
    
    // Top 5 largest savings
    const topSavings = [...stats.files]
      .sort((a, b) => b.savings - a.savings)
      .slice(0, 5);
    
    if (topSavings.length > 0) {
      console.log('🏆 Top Optimizations:');
      topSavings.forEach((file, i) => {
        console.log(
          `  ${i + 1}. ${path.basename(file.original)} - ` +
          `${formatBytes(file.savings)} (${file.savingsPercent}%)`
        );
      });
      console.log('');
    }
  }
  
  if (DRY_RUN) {
    console.log('💡 Run without --dry-run to apply changes\n');
  } else {
    console.log('✨ Optimization complete!\n');
    console.log('📝 Updated files:');
    CONFIG.updateFiles.forEach(file => console.log(`  - ${file}`));
    console.log('');
  }
}

/**
 * Format bytes to human-readable string
 */
function formatBytes(bytes) {
  if (bytes === 0) return '0 Bytes';
  const k = 1024;
  const sizes = ['Bytes', 'KB', 'MB', 'GB'];
  const i = Math.floor(Math.log(bytes) / Math.log(k));
  return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
}

// Run the script
main().catch(error => {
  console.error('Fatal error:', error);
  process.exit(1);
});

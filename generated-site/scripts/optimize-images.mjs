#!/usr/bin/env node
import sharp from 'sharp';
import { readdir, stat, unlink } from 'fs/promises';
import { join, extname, dirname, basename } from 'path';
import { fileURLToPath } from 'url';

const __dirname = dirname(fileURLToPath(import.meta.url));
const projectRoot = join(__dirname, '..');
const imagesDir = join(projectRoot, 'public', 'images');

// Configuration
const config = {
  quality: 80,
  maxWidth: 2400,
  formats: {
    jpg: ['jpg', 'jpeg'],
    png: ['png'],
  },
  skipPatterns: ['-scaled'], // Skip already optimized files
};

// Statistics
const stats = {
  processed: 0,
  skipped: 0,
  errors: 0,
  originalSize: 0,
  optimizedSize: 0,
  removedDuplicates: 0,
};

async function getFiles(dir, fileList = []) {
  try {
    const files = await readdir(dir);
    for (const file of files) {
      const filePath = join(dir, file);
      const fileStat = await stat(filePath);
      
      if (fileStat.isDirectory()) {
        await getFiles(filePath, fileList);
      } else {
        fileList.push(filePath);
      }
    }
  } catch (error) {
    console.error(`Error reading directory ${dir}:`, error.message);
  }
  return fileList;
}

function shouldSkip(filePath) {
  const ext = extname(filePath).toLowerCase().slice(1);
  const fileName = basename(filePath);
  
  // Skip if not an image format we handle
  const allFormats = [...config.formats.jpg, ...config.formats.png];
  if (!allFormats.includes(ext)) {
    return true;
  }
  
  // Skip files matching skip patterns
  if (config.skipPatterns.some(pattern => fileName.includes(pattern))) {
    return true;
  }
  
  return false;
}

async function optimizeImage(filePath) {
  try {
    const originalStats = await stat(filePath);
    stats.originalSize += originalStats.size;
    
    // Get image metadata
    const image = sharp(filePath);
    const metadata = await image.metadata();
    
    console.log(`  Processing: ${basename(filePath)} (${(originalStats.size / 1024).toFixed(1)}KB, ${metadata.width}x${metadata.height})`);
    
    // Resize if too large
    let transformer = sharp(filePath);
    if (metadata.width > config.maxWidth) {
      transformer = transformer.resize(config.maxWidth, null, {
        withoutEnlargement: true,
        fit: 'inside',
      });
      console.log(`    → Resizing from ${metadata.width}px to ${config.maxWidth}px width`);
    }
    
    // Convert to WebP
    const webpPath = filePath.replace(/\.(jpe?g|png)$/i, '.webp');
    await transformer
      .webp({ quality: config.quality })
      .toFile(webpPath);
    
    const webpStats = await stat(webpPath);
    stats.optimizedSize += webpStats.size;
    
    const savings = ((1 - webpStats.size / originalStats.size) * 100).toFixed(1);
    console.log(`    ✅ Created: ${basename(webpPath)} (${(webpStats.size / 1024).toFixed(1)}KB, ${savings}% smaller)`);
    
    // Remove original file
    await unlink(filePath);
    console.log(`    🗑️  Removed: ${basename(filePath)}`);
    
    stats.processed++;
  } catch (error) {
    console.error(`    ❌ Failed: ${error.message}`);
    stats.errors++;
  }
}

async function removeDuplicateScaledImages() {
  console.log('\n📋 Scanning for duplicate -scaled images...\n');
  
  const allFiles = await getFiles(imagesDir);
  const scaledFiles = allFiles.filter(f => f.includes('-scaled'));
  
  for (const scaledFile of scaledFiles) {
    try {
      const originalPath = scaledFile.replace(/-scaled(\.[^.]+)$/, '$1');
      const scaledStats = await stat(scaledFile);
      
      // Check if original exists
      try {
        await stat(originalPath);
        // Original exists, remove the scaled version
        await unlink(scaledFile);
        stats.removedDuplicates++;
        console.log(`  🗑️  Removed duplicate: ${basename(scaledFile)} (${(scaledStats.size / 1024).toFixed(1)}KB)`);
      } catch {
        // Original doesn't exist, keep the scaled version
        console.log(`  ⚠️  Keeping: ${basename(scaledFile)} (no original found)`);
      }
    } catch (error) {
      console.error(`  ❌ Error processing ${basename(scaledFile)}:`, error.message);
    }
  }
}

async function main() {
  console.log('🖼️  Image Optimization Script\n');
  console.log('📁 Target directory:', imagesDir);
  console.log('⚙️  Configuration:', JSON.stringify(config, null, 2), '\n');
  
  // Step 1: Remove duplicate -scaled images
  await removeDuplicateScaledImages();
  
  // Step 2: Get all image files
  console.log('\n📋 Scanning for images to optimize...\n');
  const allFiles = await getFiles(imagesDir);
  const imageFiles = allFiles.filter(f => !shouldSkip(f));
  
  console.log(`Found ${imageFiles.length} images to optimize (${allFiles.length - imageFiles.length} skipped)\n`);
  
  // Step 3: Optimize each image
  for (let i = 0; i < imageFiles.length; i++) {
    console.log(`[${i + 1}/${imageFiles.length}]`);
    await optimizeImage(imageFiles[i]);
  }
  
  // Step 4: Print summary
  console.log('\n' + '='.repeat(60));
  console.log('📊 Optimization Summary');
  console.log('='.repeat(60));
  console.log(`✅ Processed: ${stats.processed} images`);
  console.log(`⏭️  Skipped: ${stats.skipped} images`);
  console.log(`❌ Errors: ${stats.errors} images`);
  console.log(`🗑️  Removed duplicates: ${stats.removedDuplicates} files`);
  console.log(`📦 Original size: ${(stats.originalSize / 1024 / 1024).toFixed(2)} MB`);
  console.log(`📦 Optimized size: ${(stats.optimizedSize / 1024 / 1024).toFixed(2)} MB`);
  
  if (stats.originalSize > 0) {
    const totalSavings = ((1 - stats.optimizedSize / stats.originalSize) * 100).toFixed(1);
    const savedMB = ((stats.originalSize - stats.optimizedSize) / 1024 / 1024).toFixed(2);
    console.log(`💾 Total savings: ${savedMB} MB (${totalSavings}%)`);
  }
  console.log('='.repeat(60));
  
  if (stats.errors > 0) {
    console.log('\n⚠️  Some images failed to optimize. Check the errors above.');
    process.exit(1);
  }
  
  console.log('\n✅ Image optimization complete!');
}

main().catch(error => {
  console.error('❌ Fatal error:', error);
  process.exit(1);
});

# Image Optimization Scripts

## optimize-images.mjs

Comprehensive image optimization tool for Barbuda Leisure Day Tours website.

### Features

- ✅ **Multiple Sizes**: Generates 5 responsive widths (320w, 640w, 768w, 1024w, 1920w)
- ✅ **Modern Formats**: WebP, AVIF, and JPG fallbacks
- ✅ **Smart Compression**: Format-specific quality and compression settings
- ✅ **Auto-Update**: Updates references in `tours.ts`, `blog.json`, CSS files
- ✅ **Size Analytics**: Reports savings and optimization statistics
- ✅ **Dry Run Mode**: Preview changes before applying

### Quick Start

```bash
# Install dependencies (if not already installed)
npm install

# Preview what will be optimized (dry run)
npm run optimize:images:dry

# Run optimization and update files
npm run optimize:images
```

### Usage

```bash
# Basic usage - optimizes all images and updates references
node scripts/optimize-images.mjs

# Dry run - see what would happen without making changes
node scripts/optimize-images.mjs --dry-run

# Force re-optimization of all images
node scripts/optimize-images.mjs --force
```

### Output Structure

Optimized images are saved to `public/images/optimized/`:

```
public/images/optimized/
├── BarbudaLeisureTours-7-320w.webp
├── BarbudaLeisureTours-7-320w.avif
├── BarbudaLeisureTours-7-320w.jpg
├── BarbudaLeisureTours-7-640w.webp
├── BarbudaLeisureTours-7-640w.avif
├── BarbudaLeisureTours-7-640w.jpg
├── BarbudaLeisureTours-7-1024w.webp
└── ...
```

### Configuration

Edit `optimize-images.mjs` to customize:

- **Sizes**: `CONFIG.sizes` - Array of widths to generate
- **Formats**: `CONFIG.formats` - Output formats (webp, avif, jpg, png)
- **Quality**: `CONFIG.quality` - Quality per format (0-100)
- **Source Dirs**: `CONFIG.sourceDirs` - Directories to scan
- **Update Files**: `CONFIG.updateFiles` - Files to update with new paths

### Size Recommendations

| Use Case | Recommended Size | Format |
|----------|-----------------|--------|
| Mobile Hero | 640w | WebP |
| Tablet | 768w | WebP |
| Desktop Hero | 1920w | WebP |
| Thumbnails | 320w | WebP |
| Blog Cards | 640w | WebP |
| Tour Gallery | 1024w | WebP |

### Automatic Updates

The script automatically updates image references in:

- `src/data/tours.ts` - Tour hero images and galleries
- `src/data/blog.json` - Blog post images
- `src/app/globals.css` - Background images
- `tailwind.config.js` - Theme images

### Example Output

```
🖼️  Barbuda Image Optimization Tool

✅ Output directory: public/images/optimized

📂 Scanning for images...

Found 18 images to process

⚙️  Processing images...

  Processing: public/images/downloaded/BarbudaLeisureTours-7.jpg
    ✓ Generated 15 variants (1.2 MB)

  Processing: public/images/Pink-Beach-North-scaled.jpg
    ✓ Generated 15 variants (2.1 MB)

📝 Updating file references...

  Updating: tours.ts
    ✓ Updated 23 reference(s)

  Updating: blog.json
    ✓ Updated 2 reference(s)

============================================================
📊 OPTIMIZATION SUMMARY
============================================================

✅ Processed: 18 images
⏭️  Skipped: 4 images
❌ Errors: 0 images

🖼️  Generated: 270 variants

💾 Original size: 45.3 MB
📦 Optimized size: 12.7 MB
💰 Total savings: 32.6 MB (72.0%)

🏆 Top Optimizations:
  1. DSC3121-scaled.jpg - 5.2 MB (78.3%)
  2. Pink-Beach-North-scaled.jpg - 4.8 MB (75.1%)
  3. BarbudaLeisureTours-7.jpg - 3.1 MB (68.9%)

✨ Optimization complete!

📝 Updated files:
  - src/data/tours.ts
  - src/data/blog.json
  - src/app/globals.css
  - tailwind.config.js
```

### Best Practices

1. **Run Dry Run First**: Always test with `--dry-run` before optimizing
2. **Backup Originals**: Keep original images in a separate backup location
3. **Test Website**: Check all pages after optimization
4. **Version Control**: Commit changes incrementally
5. **CI/CD Integration**: Add to build pipeline for automatic optimization

### Troubleshooting

**Issue**: "Sharp installation failed"
- **Solution**: Try `npm rebuild sharp` or install Visual C++ Build Tools on Windows

**Issue**: "No images found"
- **Solution**: Check `CONFIG.sourceDirs` paths are correct

**Issue**: "References not updated"
- **Solution**: Verify `CONFIG.updateFiles` includes your data files

**Issue**: "Out of memory"
- **Solution**: Process fewer images at once or increase Node memory: `NODE_OPTIONS=--max-old-space-size=4096 node scripts/optimize-images.mjs`

### Performance Tips

- **WebP First**: Best balance of quality and size
- **AVIF for Modern**: 20-30% smaller than WebP (but slower encoding)
- **Use Picture Element**: Serve multiple formats with fallbacks
- **Lazy Loading**: Load images on demand
- **CDN Delivery**: Host optimized images on CDN for faster delivery

### Next.js Integration

Use with Next.js Image component for best results:

```jsx
import Image from 'next/image';

<Image
  src="/images/optimized/hero-1024w.webp"
  alt="Barbuda Beach"
  width={1024}
  height={683}
  sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 1024px"
  priority
/>
```

### Advanced: Picture Element

For maximum browser compatibility:

```html
<picture>
  <source
    srcset="/images/optimized/hero-1024w.avif"
    type="image/avif"
  />
  <source
    srcset="/images/optimized/hero-1024w.webp"
    type="image/webp"
  />
  <img
    src="/images/optimized/hero-1024w.jpg"
    alt="Barbuda Beach"
    loading="lazy"
  />
</picture>
```

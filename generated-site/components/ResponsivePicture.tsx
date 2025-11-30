/**
 * Responsive Picture Component for Optimized Images
 * 
 * Serves multiple formats (AVIF, WebP, JPG) with responsive sizes
 * Use this for maximum format and size control
 */

interface ResponsivePictureProps {
  basePath: string;               // Path without extension and size (e.g., '/images/optimized/hero')
  alt: string;
  width: number;
  height: number;
  className?: string;
  loading?: 'lazy' | 'eager';
  sizes?: string;                 // e.g., "(max-width: 768px) 100vw, 50vw"
}

/**
 * Example usage:
 * 
 * <ResponsivePicture
 *   basePath="/images/optimized/BarbudaLeisureTours-7"
 *   alt="Discover Barbuda by Air"
 *   width={1920}
 *   height={1280}
 *   loading="eager"
 *   sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 1920px"
 * />
 */
export default function ResponsivePicture({
  basePath,
  alt,
  width,
  height,
  className = '',
  loading = 'lazy',
  sizes = '100vw',
}: ResponsivePictureProps) {
  // Generate srcset for different formats and sizes
  const generateSrcSet = (format: string) => {
    const widths = [320, 640, 768, 1024, 1920];
    return widths
      .map(w => `${basePath}-${w}w.${format} ${w}w`)
      .join(', ');
  };

  return (
    <picture className={className}>
      {/* AVIF - Best compression (~20-30% smaller than WebP) */}
      <source
        type="image/avif"
        srcSet={generateSrcSet('avif')}
        sizes={sizes}
      />
      
      {/* WebP - Great compression, 95%+ browser support */}
      <source
        type="image/webp"
        srcSet={generateSrcSet('webp')}
        sizes={sizes}
      />
      
      {/* JPG - Universal fallback for older browsers */}
      <img
        src={`${basePath}-1024w.jpg`}
        srcSet={generateSrcSet('jpg')}
        sizes={sizes}
        alt={alt}
        width={width}
        height={height}
        loading={loading}
        className={className}
        style={{ width: '100%', height: 'auto' }}
      />
    </picture>
  );
}

/**
 * Background Image Hook
 * 
 * Returns optimized background image CSS for div elements
 */
export function useBackgroundImage(basePath: string, size: 'mobile' | 'tablet' | 'desktop') {
  const sizeMap = {
    mobile: 640,
    tablet: 1024,
    desktop: 1920,
  };

  const width = sizeMap[size];
  
  return {
    backgroundImage: `url('${basePath}-${width}w.webp')`,
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    backgroundRepeat: 'no-repeat',
  };
}

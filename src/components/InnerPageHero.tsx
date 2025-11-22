import WaveDivider from './WaveDivider';

interface InnerPageHeroProps {
  title: string;
  subtitle?: string;
  backgroundImage: string;
  /** Height of the hero section. Defaults to 'h-96 md:h-[500px]' */
  height?: string;
  /** Whether to use parallax effect. Defaults to true */
  parallax?: boolean;
  /** Overlay opacity from 0-100. Defaults to 40 */
  overlayOpacity?: number;
  /** Whether to show wave divider at bottom. Defaults to true */
  showWave?: boolean;
  /** Wave fill color. Defaults to white */
  waveFillColor?: string;
}

export default function InnerPageHero({
  title,
  subtitle,
  backgroundImage,
  height = 'h-96 md:h-[500px]',
  parallax = true,
  overlayOpacity = 40,
  showWave = true,
  waveFillColor = '#FFFFFF',
}: InnerPageHeroProps) {
  return (
    <section
      className={`relative ${height} w-full flex items-center justify-center`}
      style={{
        backgroundImage: `url(${backgroundImage})`,
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        ...(parallax && { backgroundAttachment: 'fixed' }),
      }}
    >
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity / 100 }}
      />

      {/* Wave Divider */}
      {showWave && (
        <WaveDivider
          pathD="M0,96L48,112C96,128,192,160,288,165.3C384,171,480,149,576,128C672,107,768,85,864,90.7C960,96,1056,128,1152,133.3C1248,139,1344,117,1392,106.7L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
          viewBox="0 0 1440 320"
          fillColor={waveFillColor}
          position="bottom"
          height="100px"
        />
      )}

      {/* Hero Content */}
      <div className="relative z-10 text-center px-4 max-w-3xl">
        <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold text-white mb-4 drop-shadow-lg">
          {title}
        </h1>
        {subtitle && (
          <p className="text-lg md:text-xl text-white drop-shadow-md">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

import WaveDivider from './WaveDivider';
import heroWave from './heroWavePaths';
import styles from './InnerPageHero.module.css';

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
  parallax = false,
  overlayOpacity = 40,
  showWave = true,
  waveFillColor = '#FFFFFF',
}: InnerPageHeroProps) {
  return (
    <section className={`relative ${height} w-full flex items-center justify-center overflow-hidden`}>
      {/* Background */}
      <div
        className={`${styles.bg} absolute inset-0`}
        style={{
          backgroundImage: `url(${backgroundImage})`,
          backgroundSize: 'cover',
          backgroundPosition: 'center center',
          backgroundAttachment: 'scroll',
          // Avoid background-attachment: fixed by default (can produce inconsistent
          // rendering in headless/browser captures). Use parallax opt-in if needed.
          ...(parallax ? { backgroundAttachment: 'fixed' } : {})
        }}
        aria-hidden
      />
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black"
        style={{ opacity: overlayOpacity / 100 }}
      />

      {/* Wave Divider */}
      {showWave && (
        // Use the shared hero wave paths (same as front page small brush wave)
        <WaveDivider
          {...heroWave}
          paths={heroWave.paths}
          viewBox={heroWave.viewBox}
          fillColor={waveFillColor}
          position="bottom"
          height="120px"
        />
      )}

      {/* Hero Content */}
      <div className={`relative z-10 text-center px-4 max-w-3xl ${styles.contentWrap}`}>
        <h1 className="font-['Leckerli_One'] text-[50px] md:text-[80px] font-light text-white leading-tight md:leading-[80px] mb-4 drop-shadow-sm">
          {title}
        </h1>
        {subtitle && (
          <p className="font-['Lexend_Deca'] text-lg md:text-xl text-white drop-shadow-sm">
            {subtitle}
          </p>
        )}
      </div>
    </section>
  );
}

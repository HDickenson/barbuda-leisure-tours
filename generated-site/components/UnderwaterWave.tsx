// Underwater wave decoration component
// Data extracted from WordPress Elementor footer
import footerWaves from '@/data/footer-waves.json';

interface UnderwaterWaveProps {
  className?: string;
}

// Get the bottom wave (index 1) from extracted data
const bottomWave = footerWaves[1];

export default function UnderwaterWave({ className }: UnderwaterWaveProps) {
  return (
    <div className={className} aria-hidden="true">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={bottomWave.viewBox}
        preserveAspectRatio="xMidYMax slice"
        style={{ width: '100%', height: '100%', display: 'block', transform: 'rotate(180deg)', opacity: 0.3 }}
      >
        <g fill="rgba(255, 255, 255, 1)">
          {bottomWave.paths.map((path: { d: string; opacity?: string | null }, index: number) => (
            <path
              key={index}
              d={path.d}
              opacity={path.opacity ? parseFloat(path.opacity) : 1}
            />
          ))}
        </g>
      </svg>
    </div>
  );
}

interface WaveDividerProps {
  position?: 'top' | 'bottom';
  height?: number;
  width?: string;
  fill?: string;
  type?: 'wave-brush' | 'under-water' | 'simple-wave';
  color?: string;
  flip?: boolean;
}

export function WaveDivider({
  position = 'bottom',
  height = 200,
  width = 'calc(200% + 1.3px)',
  fill = '#ffffff',
  type = 'wave-brush',
  color,
  flip
}: WaveDividerProps) {
  // SVG paths from original Elementor site
  const paths = {
    // Wave brush divider (main decorative wave)
    'wave-brush': "M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,144C960,149,1056,139,1152,122.7C1248,107,1344,85,1392,74.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",

    // Under water divider (softer wave)
    'under-water': "M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,144C960,149,1056,139,1152,122.7C1248,107,1344,85,1392,74.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z",

    // Simple wave (from current implementation)
    'simple-wave': "M0,96L48,112C96,128,192,160,288,160C384,160,480,128,576,122.7C672,117,768,139,864,144C960,149,1056,139,1152,122.7C1248,107,1344,85,1392,74.7L1440,64L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
  };

  const viewBoxes = {
    'wave-brush': "0 0 1440 320",
    'under-water': "0 0 1440 320",
    'simple-wave': "0 0 1440 320"
  };

  return (
    <div
      className={`absolute ${position === 'top' ? 'top-0 rotate-180' : 'bottom-0'} left-0 right-0 pointer-events-none overflow-hidden h-[${height}px]`}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox={viewBoxes[type]}
        preserveAspectRatio="none"
        className="block w-full h-full"
      >
        <path fill={fill} fillOpacity="1" d={paths[type]} />
      </svg>
    </div>
  );
}

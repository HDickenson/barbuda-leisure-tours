// TEMPLATE: Wave Divider Component
// PLACEHOLDERS: (none - uses props)
// DEPENDENCIES: (none)
// DESCRIPTION: Reusable SVG wave divider with configurable path(s), colors, and position

interface WaveDividerPath {
  d: string;
  className?: string | null;
  opacity?: string | null;
}

interface WaveDividerProps {
  pathD?: string;  // Single path (backwards compatibility)
  paths?: WaveDividerPath[];  // Multiple paths (WordPress-accurate)
  viewBox: string;
  fillColor: string;
  position: 'top' | 'bottom';
  height?: string;
  /** vertical offset applied to the SVG wrapper (e.g. '-2px'). Only affects visual position, not rotation */
  offsetY?: string | number;
  rotate?: boolean;  // Explicit rotation control (overrides position-based rotation)
}

export default function WaveDivider({
  pathD,
  paths,
  viewBox,
  fillColor,
  position,
  height = '100px',
  offsetY,
  rotate
}: WaveDividerProps) {
  // Support both single path (legacy) and multiple paths (WordPress-accurate)
  const pathsToRender = paths || (pathD ? [{ d: pathD, className: null, opacity: null }] : []);

  // Determine rotation: use explicit rotate prop if provided
  // Elementor CSS rotates BOTTOM waves (when data-negative=false, which is the default)
  // Top waves don't rotate by default in Elementor
  const shouldRotate = rotate !== undefined ? rotate : position === 'bottom';

  return (
    <div
      className={`wave-divider wave-${position}`}
      style={{
          position: 'absolute',
          /* if offsetY passed, use it as the position offset for the chosen edge (top/bottom). Otherwise default to 0 */
          [position]: offsetY !== undefined ? offsetY : 0,
          left: 0,
          width: '100%',
          height,
          overflow: 'hidden',
          lineHeight: 0,
          transform: shouldRotate ? 'rotate(180deg)' : 'none',
          zIndex: 10,
          pointerEvents: 'none'
        }}
    >
      <svg
        viewBox={viewBox}
        preserveAspectRatio="none"
        style={{ width: '100%', height: '100%' }}
      >
        {pathsToRender.map((path, i) => (
          <path
            key={i}
            d={path.d}
            fill={fillColor}
            opacity={path.opacity || undefined}
            className={path.className || undefined}
          />
        ))}
      </svg>
    </div>
  );
}

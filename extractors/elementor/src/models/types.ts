/**
 * Utility types used across Elementor models
 */

/**
 * Represents spacing values (padding/margin) with units
 */
export interface SpacingValue {
  top: number;
  right: number;
  bottom: number;
  left: number;
  unit: 'px' | 'em' | 'rem' | '%' | 'vh' | 'vw';
  isLinked: boolean;
}

/**
 * Represents any size with units
 */
export interface SizeValue {
  size: number;
  unit: 'px' | 'em' | 'rem' | '%' | 'vh' | 'vw';
}

/**
 * Border radius values for each corner
 */
export interface BorderRadiusValue {
  topLeft: number;
  topRight: number;
  bottomRight: number;
  bottomLeft: number;
  unit: 'px' | 'em' | 'rem' | '%';
  isLinked: boolean;
}

/**
 * Border settings
 */
export interface BorderSettings {
  type: 'none' | 'solid' | 'double' | 'dotted' | 'dashed' | 'groove';
  width?: SpacingValue;
  color?: string;
}

/**
 * Shadow settings (box shadow or text shadow)
 */
export interface ShadowSettings {
  horizontal: number;
  vertical: number;
  blur: number;
  spread: number;
  color: string;
  position: 'outline' | 'inset';
}

/**
 * Typography settings
 */
export interface TypographySettings {
  fontFamily: string;
  fontSize: SizeValue;
  fontWeight: '100' | '200' | '300' | '400' | '500' | '600' | '700' | '800' | '900';
  fontStyle: 'normal' | 'italic' | 'oblique';
  textTransform: 'none' | 'uppercase' | 'lowercase' | 'capitalize';
  textDecoration: 'none' | 'underline' | 'line-through';
  lineHeight: SizeValue;
  letterSpacing: SizeValue;
  wordSpacing?: SizeValue;
}

/**
 * Background settings (color, image, gradient, video)
 */
export interface BackgroundSettings {
  type: 'none' | 'classic' | 'gradient' | 'video' | 'slideshow';

  // Classic (single color/image)
  color?: string;
  image?: {
    url: string;
    id: number;
  };
  position?: string;
  attachment?: 'scroll' | 'fixed';
  repeat?: 'no-repeat' | 'repeat' | 'repeat-x' | 'repeat-y';
  size?: 'auto' | 'cover' | 'contain' | 'custom';

  // Gradient
  gradient?: {
    type: 'linear' | 'radial';
    angle?: number;
    position?: string;
    colors: Array<{
      color: string;
      position: number;
    }>;
  };

  // Video
  video?: {
    videoUrl?: string;
    startTime?: number;
    endTime?: number;
    autoplay: boolean;
    mute: boolean;
    loop: boolean;
    fallbackImage?: string;
  };

  // Overlay
  overlay?: {
    enabled: boolean;
    color?: string;
    opacity?: number;
  };
}

/**
 * Animation types supported by Elementor
 */
export type AnimationType =
  // Fade animations
  | 'fadeIn'
  | 'fadeInUp'
  | 'fadeInDown'
  | 'fadeInLeft'
  | 'fadeInRight'
  // Zoom animations
  | 'zoomIn'
  | 'zoomInUp'
  | 'zoomInDown'
  | 'zoomInLeft'
  | 'zoomInRight'
  // Bounce animations
  | 'bounceIn'
  | 'bounceInUp'
  | 'bounceInDown'
  | 'bounceInLeft'
  | 'bounceInRight'
  // Slide animations
  | 'slideInUp'
  | 'slideInDown'
  | 'slideInLeft'
  | 'slideInRight'
  // Other
  | 'rotateIn'
  | 'lightSpeedIn'
  | 'rollIn'
  | 'flipInX'
  | 'flipInY';

/**
 * Easing functions for animations
 */
export type EasingFunction =
  | 'linear'
  | 'ease'
  | 'ease-in'
  | 'ease-out'
  | 'ease-in-out'
  | string; // For custom cubic-bezier

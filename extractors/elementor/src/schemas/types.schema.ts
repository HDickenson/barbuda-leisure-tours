/**
 * Zod schemas for common types
 * Runtime validation for utility types
 */

import { z } from 'zod';

/**
 * Spacing value schema (padding/margin)
 */
export const SpacingValueSchema = z.object({
  top: z.number(),
  right: z.number(),
  bottom: z.number(),
  left: z.number(),
  unit: z.enum(['px', 'em', 'rem', '%', 'vh', 'vw']),
  isLinked: z.boolean(),
});

/**
 * Size value schema
 */
export const SizeValueSchema = z.object({
  size: z.number(),
  unit: z.enum(['px', 'em', 'rem', '%', 'vh', 'vw']),
});

/**
 * Border radius schema
 */
export const BorderRadiusValueSchema = z.object({
  topLeft: z.number(),
  topRight: z.number(),
  bottomRight: z.number(),
  bottomLeft: z.number(),
  unit: z.enum(['px', 'em', 'rem', '%']),
  isLinked: z.boolean(),
});

/**
 * Border settings schema
 */
export const BorderSettingsSchema = z.object({
  type: z.enum(['none', 'solid', 'double', 'dotted', 'dashed', 'groove']),
  width: SpacingValueSchema.optional(),
  color: z.string().optional(),
});

/**
 * Shadow settings schema
 */
export const ShadowSettingsSchema = z.object({
  horizontal: z.number(),
  vertical: z.number(),
  blur: z.number(),
  spread: z.number(),
  color: z.string(),
  position: z.enum(['outline', 'inset']),
});

/**
 * Typography settings schema
 */
export const TypographySettingsSchema = z.object({
  fontFamily: z.string(),
  fontSize: SizeValueSchema,
  fontWeight: z.enum(['100', '200', '300', '400', '500', '600', '700', '800', '900']),
  fontStyle: z.enum(['normal', 'italic', 'oblique']),
  textTransform: z.enum(['none', 'uppercase', 'lowercase', 'capitalize']),
  textDecoration: z.enum(['none', 'underline', 'line-through']),
  lineHeight: SizeValueSchema,
  letterSpacing: SizeValueSchema,
  wordSpacing: SizeValueSchema.optional(),
});

/**
 * Background settings schema
 */
export const BackgroundSettingsSchema = z.object({
  type: z.enum(['none', 'classic', 'gradient', 'video', 'slideshow']),
  color: z.string().optional(),
  image: z
    .object({
      url: z.string(),
      id: z.number(),
    })
    .optional(),
  position: z.string().optional(),
  attachment: z.enum(['scroll', 'fixed']).optional(),
  repeat: z.enum(['no-repeat', 'repeat', 'repeat-x', 'repeat-y']).optional(),
  size: z.enum(['auto', 'cover', 'contain', 'custom']).optional(),
  gradient: z
    .object({
      type: z.enum(['linear', 'radial']),
      angle: z.number().optional(),
      position: z.string().optional(),
      colors: z.array(
        z.object({
          color: z.string(),
          position: z.number(),
        }),
      ),
    })
    .optional(),
  video: z
    .object({
      videoUrl: z.string().optional(),
      startTime: z.number().optional(),
      endTime: z.number().optional(),
      autoplay: z.boolean(),
      mute: z.boolean(),
      loop: z.boolean(),
      fallbackImage: z.string().optional(),
    })
    .optional(),
  overlay: z
    .object({
      enabled: z.boolean(),
      color: z.string().optional(),
      opacity: z.number().optional(),
    })
    .optional(),
});

/**
 * Animation type schema
 */
export const AnimationTypeSchema = z.enum([
  'fadeIn',
  'fadeInUp',
  'fadeInDown',
  'fadeInLeft',
  'fadeInRight',
  'zoomIn',
  'zoomInUp',
  'zoomInDown',
  'zoomInLeft',
  'zoomInRight',
  'bounceIn',
  'bounceInUp',
  'bounceInDown',
  'bounceInLeft',
  'bounceInRight',
  'slideInUp',
  'slideInDown',
  'slideInLeft',
  'slideInRight',
  'rotateIn',
  'lightSpeedIn',
  'rollIn',
  'flipInX',
  'flipInY',
]);

/**
 * Easing function schema
 */
export const EasingFunctionSchema = z.union([
  z.enum(['linear', 'ease', 'ease-in', 'ease-out', 'ease-in-out']),
  z.string(), // For custom cubic-bezier
]);

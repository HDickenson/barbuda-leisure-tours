/**
 * Zod schemas for widget-related models
 */

import { z } from 'zod';
import {
  SpacingValueSchema,
  BorderSettingsSchema,
  BorderRadiusValueSchema,
  ShadowSettingsSchema,
  TypographySettingsSchema,
  BackgroundSettingsSchema,
  AnimationTypeSchema,
  EasingFunctionSchema,
  SizeValueSchema,
} from './types.schema';
import { WidgetContentSchema } from './WidgetContent.schema';

/**
 * Widget animation schema
 */
export const WidgetAnimationSchema = z.object({
  type: AnimationTypeSchema,
  duration: z.number(),
  delay: z.number(),
  easing: EasingFunctionSchema.optional(),
  trigger: z.enum(['viewport', 'page-load', 'hover', 'click']),
});

/**
 * Widget style schema
 */
export const WidgetStyleSchema = z.object({
  typography: TypographySettingsSchema.optional(),
  color: z.string().optional(),
  backgroundColor: z.string().optional(),
  padding: SpacingValueSchema.optional(),
  margin: SpacingValueSchema.optional(),
  border: BorderSettingsSchema.optional(),
  borderRadius: BorderRadiusValueSchema.optional(),
  boxShadow: ShadowSettingsSchema.optional(),
  textShadow: ShadowSettingsSchema.optional(),
  background: BackgroundSettingsSchema.optional(),
  globalStyleRefs: z.array(z.string()).optional(),
}).catchall(z.unknown()); // Allow widget-specific styles

/**
 * Conditional display schema
 */
export const ConditionalDisplaySchema = z.object({
  enabled: z.boolean(),
  conditions: z.array(
    z.object({
      type: z.enum(['device', 'user-role', 'custom']),
      operator: z.enum(['is', 'is-not', 'contains', 'starts-with', 'ends-with']),
      value: z.union([z.string(), z.array(z.string())]),
    }),
  ),
  logic: z.enum(['and', 'or']),
});

/**
 * Widget advanced settings schema
 */
export const WidgetAdvancedSchema = z.object({
  position: z.enum(['default', 'absolute', 'fixed']).optional(),
  offset: z
    .object({
      x: SizeValueSchema,
      y: SizeValueSchema,
    })
    .optional(),
  zIndex: z.number().optional(),
  animation: WidgetAnimationSchema.optional(),
  conditionalDisplay: ConditionalDisplaySchema.optional(),
  cssClasses: z.string().optional(),
  cssId: z.string().optional(),
  customAttributes: z
    .array(
      z.object({
        key: z.string(),
        value: z.string(),
      }),
    )
    .optional(),
  scrollingEffects: z
    .object({
      vertical: z
        .object({
          translateY: z.object({ from: z.number(), to: z.number() }).optional(),
          opacity: z.object({ from: z.number(), to: z.number() }).optional(),
          blur: z.object({ from: z.number(), to: z.number() }).optional(),
          scale: z.object({ from: z.number(), to: z.number() }).optional(),
        })
        .optional(),
      horizontal: z
        .object({
          translateX: z.object({ from: z.number(), to: z.number() }).optional(),
        })
        .optional(),
      transparency: z
        .object({
          opacity: z.object({ from: z.number(), to: z.number() }).optional(),
        })
        .optional(),
    })
    .optional(),
});

/**
 * Widget responsive overrides schema
 */
export const WidgetResponsiveSchema = z.object({
  mobile: z
    .object({
      style: WidgetStyleSchema.partial().optional(),
      advanced: WidgetAdvancedSchema.partial().optional(),
    })
    .optional(),
  tablet: z
    .object({
      style: WidgetStyleSchema.partial().optional(),
      advanced: WidgetAdvancedSchema.partial().optional(),
    })
    .optional(),
});

/**
 * Elementor widget schema
 */
export const ElementorWidgetSchema = z.object({
  id: z.string(),
  elType: z.literal('widget'),
  widgetType: z.string(),
  content: WidgetContentSchema,
  style: WidgetStyleSchema,
  advanced: WidgetAdvancedSchema,
  responsive: WidgetResponsiveSchema.optional(),
  isInner: z.boolean().optional(),
  defaultRendered: z.boolean().optional(),
  customData: z.record(z.unknown()).optional(),
});

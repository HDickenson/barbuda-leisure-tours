/**
 * Zod schemas for global styles
 */

import { z } from 'zod';
import { TypographySettingsSchema, SizeValueSchema } from './types.schema';

/**
 * Global colors schema
 */
export const GlobalColorsSchema = z.record(z.string());

/**
 * Global typography schema
 */
export const GlobalTypographySchema = z.record(TypographySettingsSchema);

/**
 * Global button schema
 */
export const GlobalButtonSchema = z.object({
  typography: TypographySettingsSchema.optional(),
  textColor: z.string().optional(),
  backgroundColor: z.string().optional(),
  borderRadius: SizeValueSchema.optional(),
  padding: z
    .object({
      top: z.number(),
      right: z.number(),
      bottom: z.number(),
      left: z.number(),
      unit: z.enum(['px', 'em', 'rem']),
    })
    .optional(),
});

/**
 * Global image settings schema
 */
export const GlobalImageSchema = z.object({
  defaultImageSize: z.enum(['thumbnail', 'medium', 'large', 'full']),
  lightbox: z.boolean(),
  lazyLoad: z.boolean(),
});

/**
 * Global layout settings schema
 */
export const GlobalLayoutSchema = z.object({
  contentWidth: z.number(),
  contentWidthUnit: z.enum(['px', '%']),
  stretchedSectionWidth: z.number(),
  pageTitle: z.boolean(),
  responsiveBreakpoints: z.object({
    mobile: z.number(),
    mobileLandscape: z.number().optional(),
    tablet: z.number(),
  }),
});

/**
 * Global custom CSS schema
 */
export const GlobalCustomCSSSchema = z.object({
  desktop: z.string().optional(),
  tablet: z.string().optional(),
  mobile: z.string().optional(),
});

/**
 * Global style schema
 */
export const GlobalStyleSchema = z.object({
  colors: GlobalColorsSchema.optional(),
  typography: GlobalTypographySchema.optional(),
  buttons: z.record(GlobalButtonSchema).optional(),
  images: GlobalImageSchema.optional(),
  layout: GlobalLayoutSchema.optional(),
  customCSS: GlobalCustomCSSSchema.optional(),
  themeStyle: z
    .object({
      defaultGenericFonts: z.string().optional(),
      siteLogoWidth: z.number().optional(),
      viewport: z
        .object({
          tablet: z.number(),
          mobile: z.number(),
        })
        .optional(),
    })
    .optional(),
  rawSystemSettings: z.record(z.unknown()).optional(),
});

/**
 * Zod schemas for structural elements (Section, Column)
 */

import { z } from 'zod';
import {
  SpacingValueSchema,
  BorderSettingsSchema,
  BorderRadiusValueSchema,
  ShadowSettingsSchema,
  BackgroundSettingsSchema,
} from './types.schema';
import { ElementorWidgetSchema } from './Widget.schema';

/**
 * Elementor column schema
 */
export const ElementorColumnSchema = z.object({
  id: z.string(),
  elType: z.literal('column'),
  width: z.number(),
  widthUnit: z.enum(['%', 'px']),
  contentPosition: z.enum(['default', 'top', 'center', 'bottom']),
  spaceBetween: z.number().optional(),
  background: BackgroundSettingsSchema,
  widgets: z.array(ElementorWidgetSchema),
  padding: SpacingValueSchema.optional(),
  margin: SpacingValueSchema.optional(),
  border: BorderSettingsSchema.optional(),
  borderRadius: z.any().optional(), // BorderRadiusValueSchema
  cssClasses: z.string().optional(),
  cssId: z.string().optional(),
  responsive: z
    .object({
      mobile: z.any().optional(), // Partial<ElementorColumn>
      tablet: z.any().optional(), // Partial<ElementorColumn>
    })
    .optional(),
});

/**
 * Elementor section schema
 */
export const ElementorSectionSchema = z.object({
  id: z.string(),
  elType: z.literal('section'),
  contentPosition: z.enum(['default', 'top', 'middle', 'bottom']),
  stretchSection: z.enum(['no', 'full-width', 'stretch-section']),
  heightType: z.enum(['default', 'fit-to-screen', 'min-height']),
  customHeight: z.number().optional(),
  gap: z.enum(['default', 'no', 'narrow', 'extended', 'wide', 'wider']),
  background: BackgroundSettingsSchema,
  structure: z.string(),
  columns: z.array(ElementorColumnSchema),
  padding: SpacingValueSchema.optional(),
  margin: SpacingValueSchema.optional(),
  border: BorderSettingsSchema.optional(),
  borderRadius: BorderRadiusValueSchema.optional(),
  boxShadow: ShadowSettingsSchema.optional(),
  cssClasses: z.string().optional(),
  cssId: z.string().optional(),
  zIndex: z.number().optional(),
  responsive: z
    .object({
      mobile: z.any().optional(), // Partial<ElementorSection>
      tablet: z.any().optional(), // Partial<ElementorSection>
    })
    .optional(),
});

/**
 * Zod schemas for page-level models
 */

import { z } from 'zod';
import { ElementorSectionSchema } from './Structure.schema';

/**
 * Page settings schema
 */
export const PageSettingsSchema = z.object({
  pageLayout: z.enum(['default', 'elementor_header_footer', 'elementor_canvas']),
  contentWidth: z.number(),
  metaTitle: z.string().optional(),
  metaDescription: z.string().optional(),
  customCss: z.string().optional(),
  colorScheme: z
    .object({
      primary: z.string().optional(),
      secondary: z.string().optional(),
      text: z.string().optional(),
      accent: z.string().optional(),
    })
    .optional(),
}).catchall(z.unknown()); // Allow any other page-level settings

/**
 * Elementor page schema
 */
export const ElementorPageSchema = z.object({
  // WordPress metadata
  id: z.number(),
  title: z.string(),
  url: z.string(),
  slug: z.string(),
  status: z.enum(['publish', 'draft', 'pending', 'private']),
  lastModified: z.string(),

  // Elementor metadata
  elementorVersion: z.string(),
  elementorProVersion: z.string().optional(),
  editMode: z.enum(['builder', 'disabled']),
  templateType: z.enum(['page', 'section', 'widget']),

  // Page structure
  sections: z.array(ElementorSectionSchema),

  // Global settings
  pageSettings: PageSettingsSchema,

  // Extraction metadata
  extractedAt: z.string(),
  extractorVersion: z.string(),
});

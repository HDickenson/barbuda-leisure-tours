/**
 * Zod schemas for widget content types
 */

import { z } from 'zod';

/**
 * Heading widget content schema
 */
export const HeadingContentSchema = z.object({
  title: z.string(),
  htmlTag: z.enum(['h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'div', 'span', 'p']),
  link: z
    .object({
      url: z.string(),
      isExternal: z.boolean(),
      nofollow: z.boolean(),
    })
    .optional(),
});

/**
 * Text editor widget content schema
 */
export const TextEditorContentSchema = z.object({
  editor: z.string(),
  dropCap: z.boolean().optional(),
  columnsCount: z.number().optional(),
  columnGap: z.number().optional(),
});

/**
 * Image widget content schema
 */
export const ImageContentSchema = z.object({
  image: z.object({
    url: z.string(),
    id: z.number().optional(),
    alt: z.string(),
  }),
  imageSize: z.enum(['thumbnail', 'medium', 'medium_large', 'large', 'full', 'custom']),
  caption: z.string().optional(),
  link: z
    .object({
      url: z.string(),
      isExternal: z.boolean(),
      nofollow: z.boolean(),
    })
    .optional(),
  openLightbox: z.boolean(),
});

/**
 * Button widget content schema
 */
export const ButtonContentSchema = z.object({
  text: z.string(),
  link: z.object({
    url: z.string(),
    isExternal: z.boolean(),
    nofollow: z.boolean(),
  }),
  size: z.enum(['xs', 'sm', 'md', 'lg', 'xl']),
  icon: z
    .object({
      value: z.string(),
      library: z.enum(['solid', 'regular', 'brands', 'custom']),
    })
    .optional(),
  iconAlign: z.enum(['left', 'right']),
});

/**
 * Video widget content schema
 */
export const VideoContentSchema = z.object({
  videoType: z.enum(['youtube', 'vimeo', 'dailymotion', 'hosted']),
  youtubeUrl: z.string().optional(),
  vimeoUrl: z.string().optional(),
  dailymotionUrl: z.string().optional(),
  hostedUrl: z.string().optional(),
  startTime: z.number().optional(),
  endTime: z.number().optional(),
  autoplay: z.boolean(),
  mute: z.boolean(),
  loop: z.boolean(),
  controls: z.boolean(),
  modestBranding: z.boolean(),
  privacyMode: z.boolean(),
  relatedVideos: z.boolean(),
  aspectRatio: z.enum(['169', '219', '43', '32', '11', 'custom']),
  customAspectRatio: z.string().optional(),
  playIconColor: z.string().optional(),
  lightboxEnabled: z.boolean(),
  thumbnailImage: z.object({
    url: z.string(),
    id: z.number().optional(),
  }).optional(),
});

/**
 * Icon widget content schema
 */
export const IconContentSchema = z.object({
  icon: z.object({
    value: z.string(),
    library: z.enum(['solid', 'regular', 'brands', 'custom']),
  }),
  link: z.object({
    url: z.string(),
    isExternal: z.boolean(),
    nofollow: z.boolean(),
  }).optional(),
  view: z.enum(['default', 'stacked', 'framed']),
  shape: z.enum(['circle', 'square']),
  primaryColor: z.string().optional(),
  secondaryColor: z.string().optional(),
  size: z.number().optional(),
  rotate: z.number().optional(),
  hoverAnimation: z.string().optional(),
});

/**
 * Spacer widget content schema
 */
export const SpacerContentSchema = z.object({
  space: z.number(),
  spaceTablet: z.number().optional(),
  spaceMobile: z.number().optional(),
});

/**
 * Divider widget content schema
 */
export const DividerContentSchema = z.object({
  style: z.enum(['solid', 'double', 'dotted', 'dashed']),
  weight: z.number(),
  color: z.string().optional(),
  width: z.number(),
  gap: z.number(),
  align: z.enum(['left', 'center', 'right']),
  icon: z.object({
    value: z.string(),
    library: z.enum(['solid', 'regular', 'brands', 'custom']),
  }).optional(),
});

/**
 * Google Maps widget content schema
 */
export const GoogleMapsContentSchema = z.object({
  address: z.string().optional(),
  latitude: z.number().optional(),
  longitude: z.number().optional(),
  zoom: z.number(),
  height: z.number(),
  preventScroll: z.boolean(),
  mapType: z.enum(['roadmap', 'satellite', 'hybrid', 'terrain']),
  streetView: z.boolean(),
  markers: z.array(z.object({
    address: z.string().optional(),
    latitude: z.number().optional(),
    longitude: z.number().optional(),
    title: z.string().optional(),
    description: z.string().optional(),
    icon: z.string().optional(),
  })).optional(),
});

/**
 * Form widget content schema (Elementor Pro)
 */
export const FormContentSchema = z.object({
  formFields: z.array(
    z.object({
      fieldType: z.enum([
        'text',
        'email',
        'textarea',
        'url',
        'tel',
        'select',
        'checkbox',
        'radio',
        'date',
        'time',
        'file',
        'number',
      ]),
      label: z.string(),
      placeholder: z.string().optional(),
      required: z.boolean(),
      fieldOptions: z.array(z.string()).optional(),
    }),
  ),
  submitButton: z.object({
    text: z.string(),
    size: z.enum(['xs', 'sm', 'md', 'lg', 'xl']),
  }),
  formActions: z.array(
    z.object({
      type: z.enum(['email', 'redirect', 'webhook', 'mailchimp', 'activecampaign']),
      settings: z.record(z.unknown()),
    }),
  ),
});

/**
 * Union schema for all widget content types
 */
export const WidgetContentSchema = z.union([
  HeadingContentSchema,
  TextEditorContentSchema,
  ImageContentSchema,
  ButtonContentSchema,
  VideoContentSchema,
  IconContentSchema,
  SpacerContentSchema,
  DividerContentSchema,
  GoogleMapsContentSchema,
  FormContentSchema,
  z.record(z.unknown()), // Fallback for unknown widget types
]);

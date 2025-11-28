import { createImageUrlBuilder } from '@sanity/image-url'
import type { SanityImageSource } from '@sanity/image-url'
import { client } from './client'

const builder = createImageUrlBuilder(client)

export function urlFor(source: SanityImageSource) {
  return builder.image(source)
}

// Helper to get optimized image URL with specific dimensions
export function getImageUrl(
  source: SanityImageSource,
  width?: number,
  height?: number
): string {
  let img = urlFor(source).auto('format').quality(85)

  if (width) {
    img = img.width(width)
  }

  if (height) {
    img = img.height(height)
  }

  return img.url()
}

// Helper to get image with specific fit
export function getImageUrlWithFit(
  source: SanityImageSource,
  width: number,
  height: number,
  fit: 'clip' | 'crop' | 'fill' | 'fillmax' | 'max' | 'scale' | 'min' = 'crop'
): string {
  return urlFor(source)
    .width(width)
    .height(height)
    .fit(fit)
    .auto('format')
    .quality(85)
    .url()
}

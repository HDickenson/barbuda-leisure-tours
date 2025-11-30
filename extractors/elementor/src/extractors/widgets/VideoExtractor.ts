/**
 * Video Widget Extractor
 * Extracts content from Elementor video widgets
 */

import type { VideoContent } from '../../models';

/**
 * Extract video widget content from Elementor settings
 * @param settings Raw Elementor widget settings
 * @returns Typed video content
 */
export function extractVideoContent(
  settings: Record<string, unknown>,
): VideoContent {
  // Extract video type
  const videoType = normalizeVideoType(settings.video_type);

  // Extract URLs based on video type
  const youtubeUrl = videoType === 'youtube' ? String(settings.youtube_url || '') : undefined;
  const vimeoUrl = videoType === 'vimeo' ? String(settings.vimeo_url || '') : undefined;
  const dailymotionUrl = videoType === 'dailymotion' ? String(settings.dailymotion_url || '') : undefined;
  const hostedUrl = videoType === 'hosted' ? extractHostedUrl(settings) : undefined;

  // Extract timing
  const startTime = typeof settings.start === 'number' ? settings.start : undefined;
  const endTime = typeof settings.end === 'number' ? settings.end : undefined;

  // Extract playback settings
  const autoplay = normalizeBoolean(settings.autoplay);
  const mute = normalizeBoolean(settings.mute);
  const loop = normalizeBoolean(settings.loop);
  const controls = normalizeBoolean(settings.controls, true); // Default true
  const modestBranding = normalizeBoolean(settings.modest_branding);
  const privacyMode = normalizeBoolean(settings.privacy_mode);
  const relatedVideos = normalizeBoolean(settings.rel, true); // YouTube rel parameter

  // Extract aspect ratio
  const aspectRatio = normalizeAspectRatio(settings.aspect_ratio);
  const customAspectRatio = aspectRatio === 'custom' ? String(settings.custom_aspect_ratio || '') : undefined;

  // Extract appearance settings
  const playIconColor = settings.play_icon_color ? String(settings.play_icon_color) : undefined;
  const lightboxEnabled = normalizeBoolean(settings.lightbox);

  // Extract thumbnail
  const thumbnailImage = settings.show_image_overlay === 'yes' ? extractThumbnail(settings.image_overlay) : undefined;

  const content: VideoContent = {
    videoType,
    autoplay,
    mute,
    loop,
    controls,
    modestBranding,
    privacyMode,
    relatedVideos,
    aspectRatio,
    lightboxEnabled,
  };

  if (youtubeUrl) content.youtubeUrl = youtubeUrl;
  if (vimeoUrl) content.vimeoUrl = vimeoUrl;
  if (dailymotionUrl) content.dailymotionUrl = dailymotionUrl;
  if (hostedUrl) content.hostedUrl = hostedUrl;
  if (startTime !== undefined) content.startTime = startTime;
  if (endTime !== undefined) content.endTime = endTime;
  if (customAspectRatio) content.customAspectRatio = customAspectRatio;
  if (playIconColor) content.playIconColor = playIconColor;
  if (thumbnailImage) content.thumbnailImage = thumbnailImage;

  return content;
}

/**
 * Normalize video type
 */
function normalizeVideoType(
  type: unknown,
): 'youtube' | 'vimeo' | 'dailymotion' | 'hosted' {
  const typeStr = String(type || 'youtube').toLowerCase();

  const validTypes = ['youtube', 'vimeo', 'dailymotion', 'hosted'];
  if (validTypes.includes(typeStr)) {
    return typeStr as 'youtube' | 'vimeo' | 'dailymotion' | 'hosted';
  }

  return 'youtube'; // Default
}

/**
 * Extract hosted video URL
 */
function extractHostedUrl(settings: Record<string, unknown>): string | undefined {
  const hostedUrl = settings.hosted_url;

  if (typeof hostedUrl === 'string') {
    return hostedUrl;
  }

  if (typeof hostedUrl === 'object' && hostedUrl !== null) {
    const urlObj = hostedUrl as Record<string, unknown>;
    return String(urlObj.url || '');
  }

  return undefined;
}

/**
 * Normalize aspect ratio
 */
function normalizeAspectRatio(
  ratio: unknown,
): '169' | '219' | '43' | '32' | '11' | 'custom' {
  const ratioStr = String(ratio || '169');

  const validRatios = ['169', '219', '43', '32', '11', 'custom'];
  if (validRatios.includes(ratioStr)) {
    return ratioStr as '169' | '219' | '43' | '32' | '11' | 'custom';
  }

  return '169'; // Default 16:9
}

/**
 * Extract thumbnail image
 */
function extractThumbnail(imageData: unknown): { url: string; id?: number } | undefined {
  if (!imageData || typeof imageData !== 'object') {
    return undefined;
  }

  const image = imageData as Record<string, unknown>;
  const url = String(image.url || '');

  if (!url) {
    return undefined;
  }

  const result: { url: string; id?: number } = { url };

  if (typeof image.id === 'number') {
    result.id = image.id;
  } else if (image.id) {
    const parsed = parseInt(String(image.id), 10);
    if (!isNaN(parsed)) {
      result.id = parsed;
    }
  }

  return result;
}

/**
 * Normalize boolean values with optional default
 */
function normalizeBoolean(value: unknown, defaultValue = false): boolean {
  if (typeof value === 'boolean') {
    return value;
  }

  if (value === undefined || value === null) {
    return defaultValue;
  }

  const strValue = String(value).toLowerCase();
  return strValue === 'yes' || strValue === 'true' || strValue === '1';
}

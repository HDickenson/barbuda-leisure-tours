import { describe, it, expect } from 'vitest';
import { extractVideoContent } from './VideoExtractor';

describe('VideoExtractor', () => {
  it('should extract basic YouTube video', () => {
    const settings = {
      video_type: 'youtube',
      youtube_url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ',
      autoplay: 'no',
      mute: 'no',
      loop: 'no',
      controls: 'yes',
      modest_branding: 'no',
      privacy_mode: 'no',
      rel: 'yes',
      aspect_ratio: '169',
      lightbox: 'no',
    };
    const result = extractVideoContent(settings);
    expect(result.videoType).toBe('youtube');
    expect(result.youtubeUrl).toBe('https://www.youtube.com/watch?v=dQw4w9WgXcQ');
    expect(result.autoplay).toBe(false);
    expect(result.controls).toBe(true);
    expect(result.aspectRatio).toBe('169');
  });

  it('should extract Vimeo video with timing', () => {
    const settings = {
      video_type: 'vimeo',
      vimeo_url: 'https://vimeo.com/123456789',
      start: 30,
      end: 120,
      autoplay: 'yes',
      mute: 'yes',
      loop: 'yes',
      controls: 'no',
      modest_branding: 'no',
      privacy_mode: 'no',
      rel: 'no',
      aspect_ratio: '219',
      lightbox: 'yes',
    };
    const result = extractVideoContent(settings);
    expect(result.videoType).toBe('vimeo');
    expect(result.vimeoUrl).toBe('https://vimeo.com/123456789');
    expect(result.startTime).toBe(30);
    expect(result.endTime).toBe(120);
    expect(result.autoplay).toBe(true);
    expect(result.mute).toBe(true);
    expect(result.loop).toBe(true);
    expect(result.controls).toBe(false);
    expect(result.lightboxEnabled).toBe(true);
  });

  it('should extract hosted video', () => {
    const settings = {
      video_type: 'hosted',
      hosted_url: 'https://example.com/video.mp4',
      autoplay: 'no',
      mute: 'no',
      loop: 'no',
      controls: 'yes',
      modest_branding: 'no',
      privacy_mode: 'no',
      rel: 'no',
      aspect_ratio: '169',
      lightbox: 'no',
    };
    const result = extractVideoContent(settings);
    expect(result.videoType).toBe('hosted');
    expect(result.hostedUrl).toBe('https://example.com/video.mp4');
  });

  it('should extract video with custom aspect ratio', () => {
    const settings = {
      video_type: 'youtube',
      youtube_url: 'https://www.youtube.com/watch?v=test',
      aspect_ratio: 'custom',
      custom_aspect_ratio: '21:9',
      autoplay: 'no',
      mute: 'no',
      loop: 'no',
      controls: 'yes',
      modest_branding: 'no',
      privacy_mode: 'no',
      rel: 'no',
      lightbox: 'no',
    };
    const result = extractVideoContent(settings);
    expect(result.aspectRatio).toBe('custom');
    expect(result.customAspectRatio).toBe('21:9');
  });

  it('should extract video with thumbnail overlay', () => {
    const settings = {
      video_type: 'youtube',
      youtube_url: 'https://www.youtube.com/watch?v=test',
      show_image_overlay: 'yes',
      image_overlay: {
        url: 'https://example.com/thumb.jpg',
        id: 456,
      },
      autoplay: 'no',
      mute: 'no',
      loop: 'no',
      controls: 'yes',
      modest_branding: 'no',
      privacy_mode: 'no',
      rel: 'no',
      aspect_ratio: '169',
      lightbox: 'no',
    };
    const result = extractVideoContent(settings);
    expect(result.thumbnailImage).toEqual({
      url: 'https://example.com/thumb.jpg',
      id: 456,
    });
  });

  it('should handle all aspect ratios', () => {
    const ratios = ['169', '219', '43', '32', '11', 'custom'];
    for (const ratio of ratios) {
      const settings = {
        video_type: 'youtube',
        youtube_url: 'test',
        aspect_ratio: ratio,
        autoplay: 'no',
        mute: 'no',
        loop: 'no',
        controls: 'yes',
        modest_branding: 'no',
        privacy_mode: 'no',
        rel: 'no',
        lightbox: 'no',
      };
      const result = extractVideoContent(settings);
      expect(result.aspectRatio).toBe(ratio);
    }
  });

  it('should handle all video types', () => {
    const types = ['youtube', 'vimeo', 'dailymotion', 'hosted'];
    for (const type of types) {
      const settings = {
        video_type: type,
        autoplay: 'no',
        mute: 'no',
        loop: 'no',
        controls: 'yes',
        modest_branding: 'no',
        privacy_mode: 'no',
        rel: 'no',
        aspect_ratio: '169',
        lightbox: 'no',
      };
      const result = extractVideoContent(settings);
      expect(result.videoType).toBe(type);
    }
  });

  it('should use default values when controls not specified', () => {
    const settings = {
      video_type: 'youtube',
      youtube_url: 'test',
      autoplay: 'no',
      mute: 'no',
      loop: 'no',
      modest_branding: 'no',
      privacy_mode: 'no',
      aspect_ratio: '169',
      lightbox: 'no',
    };
    const result = extractVideoContent(settings);
    expect(result.controls).toBe(true); // Default
    expect(result.relatedVideos).toBe(true); // Default
  });
});

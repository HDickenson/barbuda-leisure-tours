/**
 * Google Maps Widget Extractor
 * Extracts content from Elementor Google Maps widgets
 */

import type { GoogleMapsContent } from '../../models';

/**
 * Extract Google Maps widget content from Elementor settings
 * @param settings Raw Elementor widget settings
 * @returns Typed Google Maps content
 */
export function extractGoogleMapsContent(
  settings: Record<string, unknown>,
): GoogleMapsContent {
  // Extract address or coordinates
  const address = settings.address ? String(settings.address) : undefined;
  const latitude = typeof settings.lat === 'number' ? settings.lat : parseFloat(String(settings.lat || ''));
  const longitude = typeof settings.lng === 'number' ? settings.lng : parseFloat(String(settings.lng || ''));

  // Extract zoom level
  const zoom = extractZoom(settings.zoom);

  // Extract height
  const height = extractHeight(settings.height);

  // Extract map settings
  const preventScroll = normalizeBoolean(settings.prevent_scroll);
  const mapType = normalizeMapType(settings.map_type);
  const streetView = normalizeBoolean(settings.street_view, true);

  // Extract markers
  const markers = extractMarkers(settings.markers);

  const content: GoogleMapsContent = {
    zoom,
    height,
    preventScroll,
    mapType,
    streetView,
  };

  if (address) content.address = address;
  if (!isNaN(latitude)) content.latitude = latitude;
  if (!isNaN(longitude)) content.longitude = longitude;
  if (markers && markers.length > 0) content.markers = markers;

  return content;
}

/**
 * Extract zoom level
 */
function extractZoom(zoomData: unknown): number {
  if (typeof zoomData === 'number') {
    return Math.max(0, Math.min(21, zoomData)); // Clamp between 0-21
  }

  if (typeof zoomData === 'object' && zoomData !== null) {
    const obj = zoomData as Record<string, unknown>;
    if (typeof obj.size === 'number') {
      return Math.max(0, Math.min(21, obj.size));
    }
  }

  if (typeof zoomData === 'string') {
    const parsed = parseInt(zoomData, 10);
    if (!isNaN(parsed)) {
      return Math.max(0, Math.min(21, parsed));
    }
  }

  return 10; // Default zoom
}

/**
 * Extract height in pixels
 */
function extractHeight(heightData: unknown): number {
  if (typeof heightData === 'number') {
    return heightData;
  }

  if (typeof heightData === 'object' && heightData !== null) {
    const obj = heightData as Record<string, unknown>;
    if (typeof obj.size === 'number') {
      return obj.size;
    }
    if (typeof obj.size === 'string') {
      const parsed = parseInt(obj.size, 10);
      if (!isNaN(parsed)) {
        return parsed;
      }
    }
  }

  if (typeof heightData === 'string') {
    const parsed = parseInt(heightData, 10);
    if (!isNaN(parsed)) {
      return parsed;
    }
  }

  return 300; // Default height
}

/**
 * Normalize map type
 */
function normalizeMapType(
  type: unknown,
): 'roadmap' | 'satellite' | 'hybrid' | 'terrain' {
  const typeStr = String(type || 'roadmap').toLowerCase();

  const validTypes = ['roadmap', 'satellite', 'hybrid', 'terrain'];
  if (validTypes.includes(typeStr)) {
    return typeStr as 'roadmap' | 'satellite' | 'hybrid' | 'terrain';
  }

  return 'roadmap';
}

/**
 * Extract markers array
 */
function extractMarkers(
  markersData: unknown,
): Array<{
  address?: string;
  latitude?: number;
  longitude?: number;
  title?: string;
  description?: string;
  icon?: string;
}> | undefined {
  if (!Array.isArray(markersData) || markersData.length === 0) {
    return undefined;
  }

  const markers = markersData
    .map((markerData) => {
      if (typeof markerData !== 'object' || markerData === null) {
        return null;
      }

      const marker = markerData as Record<string, unknown>;

      const address = marker.address ? String(marker.address) : undefined;
      const latitude = typeof marker.lat === 'number' ? marker.lat : undefined;
      const longitude = typeof marker.lng === 'number' ? marker.lng : undefined;
      const title = marker.title ? String(marker.title) : undefined;
      const description = marker.description ? String(marker.description) : undefined;
      const icon = marker.icon ? String(marker.icon) : undefined;

      // Must have at least address or coordinates
      if (!address && (latitude === undefined || longitude === undefined)) {
        return null;
      }

      const result: {
        address?: string;
        latitude?: number;
        longitude?: number;
        title?: string;
        description?: string;
        icon?: string;
      } = {};

      if (address) result.address = address;
      if (latitude !== undefined) result.latitude = latitude;
      if (longitude !== undefined) result.longitude = longitude;
      if (title) result.title = title;
      if (description) result.description = description;
      if (icon) result.icon = icon;

      return result;
    })
    .filter((marker) => marker !== null);

  return markers.length > 0 ? markers : undefined;
}

/**
 * Normalize boolean values
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

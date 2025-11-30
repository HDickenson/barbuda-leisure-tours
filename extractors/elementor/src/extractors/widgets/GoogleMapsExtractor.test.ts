import { describe, it, expect } from 'vitest';
import { extractGoogleMapsContent } from './GoogleMapsExtractor';

describe('GoogleMapsExtractor', () => {
  it('should extract map with address', () => {
    const settings = {
      address: '1600 Amphitheatre Parkway, Mountain View, CA',
      zoom: 15,
      height: 400,
      prevent_scroll: 'no',
      map_type: 'roadmap',
      street_view: 'yes',
    };
    const result = extractGoogleMapsContent(settings);
    expect(result.address).toBe('1600 Amphitheatre Parkway, Mountain View, CA');
    expect(result.zoom).toBe(15);
    expect(result.height).toBe(400);
    expect(result.preventScroll).toBe(false);
    expect(result.mapType).toBe('roadmap');
    expect(result.streetView).toBe(true);
  });

  it('should extract map with coordinates', () => {
    const settings = {
      lat: 37.4224764,
      lng: -122.0842499,
      zoom: 12,
      height: 500,
      prevent_scroll: 'yes',
      map_type: 'satellite',
      street_view: 'no',
    };
    const result = extractGoogleMapsContent(settings);
    expect(result.latitude).toBe(37.4224764);
    expect(result.longitude).toBe(-122.0842499);
    expect(result.preventScroll).toBe(true);
    expect(result.mapType).toBe('satellite');
    expect(result.streetView).toBe(false);
  });

  it('should extract map with markers', () => {
    const settings = {
      address: 'San Francisco, CA',
      zoom: 10,
      height: 400,
      prevent_scroll: 'no',
      map_type: 'roadmap',
      street_view: 'yes',
      markers: [
        {
          address: 'Golden Gate Bridge, San Francisco, CA',
          title: 'Golden Gate Bridge',
          description: 'Famous suspension bridge',
        },
        {
          lat: 37.8199286,
          lng: -122.4782551,
          title: 'Alcatraz Island',
        },
      ],
    };
    const result = extractGoogleMapsContent(settings);
    expect(result.markers).toHaveLength(2);
    expect(result.markers?.[0]?.address).toBe('Golden Gate Bridge, San Francisco, CA');
    expect(result.markers?.[0]?.title).toBe('Golden Gate Bridge');
    expect(result.markers?.[0]?.description).toBe('Famous suspension bridge');
    expect(result.markers?.[1]?.latitude).toBe(37.8199286);
    expect(result.markers?.[1]?.longitude).toBe(-122.4782551);
    expect(result.markers?.[1]?.title).toBe('Alcatraz Island');
  });

  it('should handle all map types', () => {
    const mapTypes = ['roadmap', 'satellite', 'hybrid', 'terrain'];
    for (const mapType of mapTypes) {
      const settings = {
        address: 'Test Location',
        zoom: 10,
        height: 400,
        prevent_scroll: 'no',
        map_type: mapType,
        street_view: 'yes',
      };
      const result = extractGoogleMapsContent(settings);
      expect(result.mapType).toBe(mapType);
    }
  });

  it('should clamp zoom level to valid range', () => {
    const settings1 = {
      zoom: -5,
      height: 400,
      prevent_scroll: 'no',
      map_type: 'roadmap',
      street_view: 'yes',
    };
    const result1 = extractGoogleMapsContent(settings1);
    expect(result1.zoom).toBe(0); // Minimum

    const settings2 = {
      zoom: 25,
      height: 400,
      prevent_scroll: 'no',
      map_type: 'roadmap',
      street_view: 'yes',
    };
    const result2 = extractGoogleMapsContent(settings2);
    expect(result2.zoom).toBe(21); // Maximum
  });

  it('should extract zoom from responsive object', () => {
    const settings = {
      zoom: { size: 14 },
      height: { size: 450 },
      prevent_scroll: 'no',
      map_type: 'roadmap',
      street_view: 'yes',
    };
    const result = extractGoogleMapsContent(settings);
    expect(result.zoom).toBe(14);
    expect(result.height).toBe(450);
  });

  it('should use default values when not specified', () => {
    const settings = {};
    const result = extractGoogleMapsContent(settings);
    expect(result.zoom).toBe(10);
    expect(result.height).toBe(300);
    expect(result.preventScroll).toBe(false);
    expect(result.mapType).toBe('roadmap');
    expect(result.streetView).toBe(true); // Default
  });

  it('should filter out invalid markers', () => {
    const settings = {
      zoom: 10,
      height: 400,
      prevent_scroll: 'no',
      map_type: 'roadmap',
      street_view: 'yes',
      markers: [
        {
          address: 'Valid Marker',
          title: 'Valid',
        },
        {
          // Invalid - no address or coordinates
          title: 'Invalid',
        },
        {
          lat: 37.7749,
          lng: -122.4194,
          title: 'Valid with coords',
        },
      ],
    };
    const result = extractGoogleMapsContent(settings);
    expect(result.markers).toHaveLength(2); // Only 2 valid markers
  });

  it('should handle marker with custom icon', () => {
    const settings = {
      zoom: 10,
      height: 400,
      prevent_scroll: 'no',
      map_type: 'roadmap',
      street_view: 'yes',
      markers: [
        {
          address: 'Custom Icon Location',
          icon: 'https://example.com/custom-marker.png',
        },
      ],
    };
    const result = extractGoogleMapsContent(settings);
    expect(result.markers?.[0]?.icon).toBe('https://example.com/custom-marker.png');
  });

  it('should not include markers when array is empty', () => {
    const settings = {
      zoom: 10,
      height: 400,
      prevent_scroll: 'no',
      map_type: 'roadmap',
      street_view: 'yes',
      markers: [],
    };
    const result = extractGoogleMapsContent(settings);
    expect(result.markers).toBeUndefined();
  });
});

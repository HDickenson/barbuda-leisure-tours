/**
 * PHP serialization parser
 * Handles parsing of PHP serialized data from WordPress/Elementor
 */

import { unserialize } from 'php-serialize';
import type { Logger } from 'winston';

/**
 * Parse PHP serialized data safely
 * @param data PHP serialized string
 * @param logger Optional logger for error tracking
 * @returns Parsed data or null if parsing fails
 */
export function parsePhpSerialized(
  data: string,
  logger?: Logger,
): unknown | null {
  try {
    if (!data || typeof data !== 'string') {
      logger?.warn('Invalid PHP serialized data: empty or not a string');
      return null;
    }

    // Elementor data is typically serialized PHP
    const parsed = unserialize(data);
    return parsed;
  } catch (error) {
    logger?.error('Failed to parse PHP serialized data', {
      error: error instanceof Error ? error.message : String(error),
      dataPreview: data.substring(0, 100),
    });
    return null;
  }
}

/**
 * Parse Elementor page data from WordPress meta
 * Handles nested serialization (common in Elementor)
 * @param metaValue WordPress meta value (_elementor_data)
 * @param logger Optional logger
 * @returns Parsed Elementor data structure
 */
export function parseElementorData(
  metaValue: string | unknown,
  logger?: Logger,
): unknown[] | null {
  try {
    // If already parsed (from REST API), return as-is
    if (Array.isArray(metaValue)) {
      return metaValue;
    }

    // If string, attempt to parse as JSON first (REST API format)
    if (typeof metaValue === 'string') {
      try {
        const jsonParsed = JSON.parse(metaValue);
        if (Array.isArray(jsonParsed)) {
          return jsonParsed;
        }
      } catch {
        // Not JSON, try PHP serialization
      }

      // Try PHP unserialization
      const phpParsed = parsePhpSerialized(metaValue, logger);
      if (Array.isArray(phpParsed)) {
        return phpParsed;
      }
    }

    logger?.warn('Elementor data is not in expected format', {
      type: typeof metaValue,
      isArray: Array.isArray(metaValue),
    });
    return null;
  } catch (error) {
    logger?.error('Failed to parse Elementor data', {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

/**
 * Parse Elementor page settings from WordPress meta
 * @param metaValue WordPress meta value (_elementor_page_settings)
 * @param logger Optional logger
 * @returns Parsed page settings object
 */
export function parseElementorSettings(
  metaValue: string | unknown,
  logger?: Logger,
): Record<string, unknown> | null {
  try {
    // If already an object, return as-is
    if (typeof metaValue === 'object' && metaValue !== null && !Array.isArray(metaValue)) {
      return metaValue as Record<string, unknown>;
    }

    // If string, try JSON first
    if (typeof metaValue === 'string') {
      try {
        const jsonParsed = JSON.parse(metaValue);
        if (typeof jsonParsed === 'object' && jsonParsed !== null && !Array.isArray(jsonParsed)) {
          return jsonParsed;
        }
      } catch {
        // Not JSON, try PHP
      }

      // Try PHP unserialization
      const phpParsed = parsePhpSerialized(metaValue, logger);
      if (typeof phpParsed === 'object' && phpParsed !== null) {
        return phpParsed as Record<string, unknown>;
      }
    }

    logger?.warn('Page settings not in expected format');
    return null;
  } catch (error) {
    logger?.error('Failed to parse page settings', {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

/**
 * Parse Elementor global kit settings (site-wide styles)
 * @param metaValue WordPress meta value (_elementor_kit_data or system settings)
 * @param logger Optional logger
 * @returns Parsed global settings
 */
export function parseGlobalKitSettings(
  metaValue: string | unknown,
  logger?: Logger,
): Record<string, unknown> | null {
  try {
    // Use same logic as page settings
    return parseElementorSettings(metaValue, logger);
  } catch (error) {
    logger?.error('Failed to parse global kit settings', {
      error: error instanceof Error ? error.message : String(error),
    });
    return null;
  }
}

/**
 * Sanitize and normalize Elementor data
 * Handles common data issues (empty arrays, null values, etc.)
 * @param data Raw parsed data
 * @returns Sanitized data
 */
export function sanitizeElementorData(data: unknown): unknown {
  if (data === null || data === undefined) {
    return null;
  }

  if (Array.isArray(data)) {
    return data
      .map(sanitizeElementorData)
      .filter((item) => item !== null);
  }

  if (typeof data === 'object') {
    const sanitized: Record<string, unknown> = {};
    for (const [key, value] of Object.entries(data)) {
      const sanitizedValue = sanitizeElementorData(value);
      if (sanitizedValue !== null) {
        sanitized[key] = sanitizedValue;
      }
    }
    return sanitized;
  }

  return data;
}

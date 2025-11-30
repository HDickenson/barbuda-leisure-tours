/**
 * WordPress REST API connector
 * Fetches Elementor data via WordPress REST API
 */

import axios, { type AxiosInstance } from 'axios';
import type { Logger } from 'winston';
import type { RestApiConfig } from '../core/Config';

/**
 * WordPress post data from REST API
 */
export interface WpPost {
  id: number;
  title: { rendered: string };
  slug: string;
  status: string;
  modified: string;
  link: string;
  meta: Record<string, unknown>;
}

/**
 * REST API connector for WordPress
 */
export class RestApiConnector {
  private client: AxiosInstance;
  private logger: Logger | undefined;

  constructor(config: RestApiConfig, logger?: Logger) {
    this.logger = logger;

    // Create axios instance with authentication
    const auth = config.applicationPassword
      ? {
          username: config.username || '',
          password: config.applicationPassword,
        }
      : config.password
        ? {
            username: config.username || '',
            password: config.password,
          }
        : undefined;

    this.client = axios.create({
      baseURL: config.baseUrl.endsWith('/')
        ? `${config.baseUrl}wp-json/`
        : `${config.baseUrl}/wp-json/`,
      ...(auth && { auth }),
      timeout: config.timeout || 30000,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.logger?.debug('REST API connector initialized', {
      baseURL: config.baseUrl,
      timeout: config.timeout || 30000,
    });
  }

  /**
   * Fetch a single page by ID
   * @param pageId WordPress page ID
   * @returns Page data with meta fields
   */
  async fetchPage(pageId: number): Promise<WpPost | null> {
    try {
      this.logger?.debug(`Fetching page ${pageId}`);

      const response = await this.client.get<WpPost>(`wp/v2/pages/${pageId}`, {
        params: {
          _fields: 'id,title,slug,status,modified,link,meta',
        },
      });

      this.logger?.info(`Successfully fetched page ${pageId}`);
      return response.data;
    } catch (error) {
      this.logger?.error(`Failed to fetch page ${pageId}`, {
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }

  /**
   * Fetch all pages with Elementor data
   * @returns Array of pages
   */
  async fetchAllPages(): Promise<WpPost[]> {
    try {
      this.logger?.debug('Fetching all pages with Elementor data');

      const pages: WpPost[] = [];
      let page = 1;
      let hasMore = true;

      while (hasMore) {
        const response = await this.client.get<WpPost[]>('wp/v2/pages', {
          params: {
            page,
            per_page: 100,
            _fields: 'id,title,slug,status,modified,link,meta',
            // Filter for Elementor pages
            meta_key: '_elementor_edit_mode',
            meta_value: 'builder',
          },
        });

        pages.push(...response.data);

        // Check if there are more pages
        const totalPages = parseInt(response.headers['x-wp-totalpages'] || '1', 10);
        hasMore = page < totalPages;
        page++;

        this.logger?.debug(`Fetched page ${page - 1} of ${totalPages}`);
      }

      this.logger?.info(`Successfully fetched ${pages.length} Elementor pages`);
      return pages;
    } catch (error) {
      this.logger?.error('Failed to fetch pages', {
        error: error instanceof Error ? error.message : String(error),
      });
      return [];
    }
  }

  /**
   * Fetch Elementor data for a specific page
   * @param pageId WordPress page ID
   * @returns Elementor data JSON
   */
  async fetchElementorData(pageId: number): Promise<unknown[] | null> {
    try {
      this.logger?.debug(`Fetching Elementor data for page ${pageId}`);

      // Fetch via custom REST endpoint (requires Elementor Pro or custom endpoint)
      // Fallback: fetch via post meta
      const response = await this.client.get<{ meta: Record<string, unknown> }>(
        `wp/v2/pages/${pageId}`,
        {
          params: {
            _fields: 'meta',
            context: 'edit',
          },
        },
      );

      const elementorData = response.data.meta._elementor_data;

      if (!elementorData) {
        this.logger?.warn(`No Elementor data found for page ${pageId}`);
        return null;
      }

      // Parse if string (PHP serialized or JSON)
      if (typeof elementorData === 'string') {
        try {
          return JSON.parse(elementorData);
        } catch {
          // PHP serialized data - return as string for parser
          return elementorData as any;
        }
      }

      return elementorData as unknown[];
    } catch (error) {
      this.logger?.error(`Failed to fetch Elementor data for page ${pageId}`, {
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }

  /**
   * Fetch page settings (Elementor page settings)
   * @param pageId WordPress page ID
   * @returns Page settings object
   */
  async fetchPageSettings(pageId: number): Promise<Record<string, unknown> | null> {
    try {
      this.logger?.debug(`Fetching page settings for page ${pageId}`);

      const response = await this.client.get<{ meta: Record<string, unknown> }>(
        `wp/v2/pages/${pageId}`,
        {
          params: {
            _fields: 'meta',
            context: 'edit',
          },
        },
      );

      const settings = response.data.meta._elementor_page_settings;

      if (!settings) {
        return {};
      }

      // Parse if string
      if (typeof settings === 'string') {
        try {
          return JSON.parse(settings);
        } catch {
          return settings as any;
        }
      }

      return settings as Record<string, unknown>;
    } catch (error) {
      this.logger?.error(`Failed to fetch page settings for page ${pageId}`, {
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }

  /**
   * Fetch global Elementor kit settings (site-wide styles)
   * @returns Global kit settings
   */
  async fetchGlobalKitSettings(): Promise<Record<string, unknown> | null> {
    try {
      this.logger?.debug('Fetching global kit settings');

      // Fetch Elementor kit post (post_type: elementor_library, template_type: kit)
      const response = await this.client.get<{ id: number }[]>(
        'wp/v2/elementor_library',
        {
          params: {
            template_type: 'kit',
            per_page: 1,
          },
        },
      );

      if (!response.data || response.data.length === 0) {
        this.logger?.warn('No global kit found');
        return null;
      }

      const kit = response.data[0];
      if (!kit) {
        return null;
      }

      const kitId = kit.id;

      // Fetch kit meta data
      const kitResponse = await this.client.get<{ meta: Record<string, unknown> }>(
        `wp/v2/elementor_library/${kitId}`,
        {
          params: {
            _fields: 'meta',
          },
        },
      );

      return kitResponse.data.meta as Record<string, unknown>;
    } catch (error) {
      this.logger?.error('Failed to fetch global kit settings', {
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }

  /**
   * Test connection to WordPress site
   * @returns true if connection successful
   */
  async testConnection(): Promise<boolean> {
    try {
      this.logger?.debug('Testing REST API connection');

      await this.client.get('wp/v2/pages', {
        params: { per_page: 1 }
      });

      this.logger?.info('REST API connection successful');
      return true;
    } catch (error) {
      this.logger?.error('REST API connection failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }
}

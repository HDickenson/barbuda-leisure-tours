/**
 * WordPress REST API Client
 * Handles fetching pages and Elementor data from WordPress sites
 */

import type { Logger } from 'winston';

/**
 * Authentication configuration for WordPress API
 */
export interface WordPressAuth {
  type: 'basic' | 'app-password' | 'jwt';
  username?: string;
  password?: string;
  token?: string;
}

/**
 * WordPress client configuration
 */
export interface WordPressConfig {
  baseUrl: string;
  auth?: WordPressAuth;
  timeout?: number; // Request timeout in milliseconds (default: 30000)
  retries?: number; // Number of retry attempts (default: 3)
  retryDelay?: number; // Delay between retries in milliseconds (default: 1000)
  userAgent?: string; // Custom user agent
}

/**
 * Options for fetching pages
 */
export interface FetchOptions {
  postId?: number;
  slug?: string;
  status?: 'publish' | 'draft' | 'pending' | 'private' | 'any';
  includeElementorOnly?: boolean;
  perPage?: number;
  page?: number;
}

/**
 * Raw WordPress post data from REST API
 */
export interface WordPressPost {
  id: number;
  date: string;
  date_gmt: string;
  modified: string;
  modified_gmt: string;
  slug: string;
  status: string;
  type: string;
  link: string;
  title: {
    rendered: string;
  };
  content: {
    rendered: string;
    protected: boolean;
  };
  excerpt: {
    rendered: string;
    protected: boolean;
  };
  author: number;
  featured_media: number;
  meta: Record<string, unknown>;
  [key: string]: unknown;
}

/**
 * WordPress post with Elementor metadata
 */
export interface ElementorPostData {
  id: number;
  title: string;
  url: string;
  slug: string;
  status: string;
  modified: string;
  elementorData: unknown[];
  elementorSettings: Record<string, unknown>;
  elementorVersion: string;
  elementorProVersion?: string;
  elementorEditMode?: string;
}

/**
 * WordPress API error
 */
export class WordPressApiError extends Error {
  constructor(
    message: string,
    public statusCode?: number,
    public response?: unknown,
  ) {
    super(message);
    this.name = 'WordPressApiError';
  }
}

/**
 * Rate limiter for API requests
 */
class RateLimiter {
  private activeRequests = 0;
  private lastRequestTime = 0;

  constructor(
    private maxConcurrent: number = 5,
    private minDelay: number = 100,
  ) {}

  async throttle<T>(fn: () => Promise<T>): Promise<T> {
    // Wait for available slot
    while (this.activeRequests >= this.maxConcurrent) {
      await new Promise((resolve) => setTimeout(resolve, 50));
    }

    // Enforce minimum delay between requests
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    if (timeSinceLastRequest < this.minDelay) {
      await new Promise((resolve) =>
        setTimeout(resolve, this.minDelay - timeSinceLastRequest),
      );
    }

    this.activeRequests++;
    this.lastRequestTime = Date.now();

    try {
      return await fn();
    } finally {
      this.activeRequests--;
    }
  }
}

/**
 * WordPress REST API Client
 * Fetches pages with Elementor data from WordPress sites
 */
export class WordPressClient {
  private config: {
    baseUrl: string;
    auth?: WordPressAuth;
    timeout: number;
    retries: number;
    retryDelay: number;
    userAgent: string;
  };
  private logger: Logger | undefined;
  private rateLimiter: RateLimiter;

  constructor(config: WordPressConfig, logger?: Logger) {
    this.config = {
      baseUrl: this.normalizeBaseUrl(config.baseUrl),
      timeout: config.timeout ?? 30000,
      retries: config.retries ?? 3,
      retryDelay: config.retryDelay ?? 1000,
      userAgent:
        config.userAgent ?? '@barbuda/elementor-extractor/1.0.0',
    };
    if (config.auth) {
      this.config.auth = config.auth;
    }
    this.logger = logger;
    this.rateLimiter = new RateLimiter();

    this.logger?.debug('WordPressClient initialized', {
      baseUrl: this.config.baseUrl,
      timeout: this.config.timeout,
      retries: this.config.retries,
    });
  }

  /**
   * Fetch a single page by ID
   * @param postId WordPress post ID
   * @returns Elementor post data or null if not found
   */
  async fetchPage(postId: number): Promise<ElementorPostData | null> {
    this.logger?.info('Fetching page', { postId });

    try {
      const post = await this.fetchPost(postId);
      if (!post) {
        this.logger?.warn('Page not found', { postId });
        return null;
      }

      const elementorData = await this.fetchElementorData(postId);
      return this.transformPostData(post, elementorData);
    } catch (error) {
      this.logger?.error('Failed to fetch page', {
        postId,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Fetch a single page by slug
   * @param slug WordPress post slug
   * @returns Elementor post data or null if not found
   */
  async fetchPageBySlug(slug: string): Promise<ElementorPostData | null> {
    this.logger?.info('Fetching page by slug', { slug });

    try {
      const posts = await this.fetchPosts({ slug, perPage: 1 });
      if (posts.length === 0) {
        this.logger?.warn('Page not found', { slug });
        return null;
      }

      const post = posts[0];
      if (!post) {
        return null;
      }

      const elementorData = await this.fetchElementorData(post.id);
      return this.transformPostData(post, elementorData);
    } catch (error) {
      this.logger?.error('Failed to fetch page by slug', {
        slug,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Fetch multiple pages matching criteria
   * @param options Fetch options
   * @returns Array of Elementor post data
   */
  async fetchPages(options: FetchOptions = {}): Promise<ElementorPostData[]> {
    this.logger?.info('Fetching pages', options);

    try {
      const posts = await this.fetchPosts(options);

      this.logger?.debug(`Found ${posts.length} posts`);

      // Filter to Elementor pages if requested
      let filteredPosts = posts;
      if (options.includeElementorOnly) {
        filteredPosts = posts.filter((post) =>
          this.hasElementorData(post),
        );
        this.logger?.debug(
          `Filtered to ${filteredPosts.length} Elementor pages`,
        );
      }

      // Fetch Elementor data for each page
      const results: ElementorPostData[] = [];
      for (const post of filteredPosts) {
        try {
          const elementorData = await this.fetchElementorData(post.id);
          const transformed = this.transformPostData(post, elementorData);
          if (transformed) {
            results.push(transformed);
          }
        } catch (error) {
          this.logger?.warn('Failed to fetch Elementor data for post', {
            postId: post.id,
            error: error instanceof Error ? error.message : String(error),
          });
        }
      }

      return results;
    } catch (error) {
      this.logger?.error('Failed to fetch pages', {
        options,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Test connection to WordPress API
   * @returns true if connection successful
   */
  async testConnection(): Promise<boolean> {
    this.logger?.info('Testing WordPress API connection');

    try {
      await this.request('/wp-json/wp/v2/pages', {
        per_page: 1,
      });
      this.logger?.info('Connection test successful');
      return true;
    } catch (error) {
      this.logger?.error('Connection test failed', {
        error: error instanceof Error ? error.message : String(error),
      });
      return false;
    }
  }

  /**
   * Fetch WordPress site info
   * @returns Site information
   */
  async fetchSiteInfo(): Promise<Record<string, unknown>> {
    this.logger?.debug('Fetching site info');

    try {
      const data = await this.request('/wp-json');
      return data as Record<string, unknown>;
    } catch (error) {
      this.logger?.error('Failed to fetch site info', {
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Fetch a single WordPress post
   */
  private async fetchPost(postId: number): Promise<WordPressPost | null> {
    try {
      const data = await this.request(`/wp-json/wp/v2/pages/${postId}`);
      return data as WordPressPost;
    } catch (error) {
      if (
        error instanceof WordPressApiError &&
        error.statusCode === 404
      ) {
        return null;
      }
      throw error;
    }
  }

  /**
   * Fetch multiple WordPress posts
   */
  private async fetchPosts(
    options: FetchOptions = {},
  ): Promise<WordPressPost[]> {
    const params: Record<string, string | number> = {
      per_page: options.perPage ?? 100,
      page: options.page ?? 1,
    };

    if (options.postId) {
      params.include = options.postId;
    }

    if (options.slug) {
      params.slug = options.slug;
    }

    if (options.status) {
      params.status = options.status;
    }

    try {
      const data = await this.request('/wp-json/wp/v2/pages', params);
      return (data as WordPressPost[]) || [];
    } catch (error) {
      this.logger?.error('Failed to fetch posts', {
        options,
        error: error instanceof Error ? error.message : String(error),
      });
      throw error;
    }
  }

  /**
   * Fetch Elementor data for a specific post
   */
  private async fetchElementorData(
    postId: number,
  ): Promise<Record<string, unknown>> {
    try {
      // Try to fetch from post meta
      const data = await this.request(
        `/wp-json/wp/v2/pages/${postId}`,
        { context: 'edit' },
      );
      const post = data as WordPressPost;

      return {
        elementorData: post.meta?._elementor_data || [],
        elementorSettings: post.meta?._elementor_page_settings || {},
        elementorVersion: post.meta?._elementor_version || 'unknown',
        elementorProVersion: post.meta?._elementor_pro_version,
        elementorEditMode: post.meta?._elementor_edit_mode,
      };
    } catch (error) {
      this.logger?.warn('Failed to fetch Elementor data from meta', {
        postId,
        error: error instanceof Error ? error.message : String(error),
      });

      // Return empty data structure
      return {
        elementorData: [],
        elementorSettings: {},
        elementorVersion: 'unknown',
      };
    }
  }

  /**
   * Check if a post has Elementor data
   */
  private hasElementorData(post: WordPressPost): boolean {
    if (!post.meta) return false;

    const editMode = post.meta._elementor_edit_mode;
    if (editMode === 'builder') return true;

    const data = post.meta._elementor_data;
    return Array.isArray(data) && data.length > 0;
  }

  /**
   * Transform WordPress post data to ElementorPostData
   */
  private transformPostData(
    post: WordPressPost,
    elementorData: Record<string, unknown>,
  ): ElementorPostData | null {
    try {
      // Parse Elementor data if it's a string (serialized)
      let parsedElementorData = elementorData.elementorData as unknown[];
      if (typeof parsedElementorData === 'string') {
        try {
          parsedElementorData = JSON.parse(parsedElementorData);
        } catch {
          this.logger?.warn('Failed to parse Elementor data JSON', {
            postId: post.id,
          });
          parsedElementorData = [];
        }
      }

      const result: ElementorPostData = {
        id: post.id,
        title:
          typeof post.title === 'object' && post.title !== null
            ? post.title.rendered
            : String(post.title),
        url: post.link,
        slug: post.slug,
        status: post.status,
        modified: post.modified,
        elementorData: parsedElementorData || [],
        elementorSettings:
          (elementorData.elementorSettings as Record<string, unknown>) ||
          {},
        elementorVersion:
          String(elementorData.elementorVersion) || 'unknown',
      };

      if (elementorData.elementorProVersion) {
        result.elementorProVersion = String(elementorData.elementorProVersion);
      }

      if (elementorData.elementorEditMode) {
        result.elementorEditMode = String(elementorData.elementorEditMode);
      }

      return result;
    } catch (error) {
      this.logger?.error('Failed to transform post data', {
        postId: post.id,
        error: error instanceof Error ? error.message : String(error),
      });
      return null;
    }
  }

  /**
   * Make an HTTP request to WordPress API with retry logic
   */
  private async request(
    path: string,
    params?: Record<string, string | number>,
  ): Promise<unknown> {
    const url = new URL(path, this.config.baseUrl);

    // Add query parameters
    if (params) {
      for (const [key, value] of Object.entries(params)) {
        url.searchParams.append(key, String(value));
      }
    }

    let lastError: Error | null = null;

    // Retry logic
    for (let attempt = 0; attempt <= this.config.retries; attempt++) {
      try {
        return await this.rateLimiter.throttle(async () => {
          const controller = new AbortController();
          const timeoutId = setTimeout(
            () => controller.abort(),
            this.config.timeout,
          );

          try {
            const headers: Record<string, string> = {
              'User-Agent': this.config.userAgent,
              Accept: 'application/json',
            };

            // Add authentication
            if (this.config.auth) {
              if (this.config.auth.type === 'basic' || this.config.auth.type === 'app-password') {
                const credentials = Buffer.from(
                  `${this.config.auth.username}:${this.config.auth.password}`,
                ).toString('base64');
                headers.Authorization = `Basic ${credentials}`;
              } else if (this.config.auth.type === 'jwt' && this.config.auth.token) {
                headers.Authorization = `Bearer ${this.config.auth.token}`;
              }
            }

            this.logger?.debug('Making request', {
              url: url.toString(),
              attempt,
            });

            const response = await fetch(url.toString(), {
              method: 'GET',
              headers,
              signal: controller.signal,
            });

            clearTimeout(timeoutId);

            if (!response.ok) {
              throw new WordPressApiError(
                `HTTP ${response.status}: ${response.statusText}`,
                response.status,
                await response.text().catch(() => null),
              );
            }

            const contentType = response.headers.get('content-type');
            if (contentType?.includes('application/json')) {
              return await response.json();
            } else {
              return await response.text();
            }
          } catch (error) {
            clearTimeout(timeoutId);

            if (error instanceof Error && error.name === 'AbortError') {
              throw new WordPressApiError(
                `Request timeout after ${this.config.timeout}ms`,
              );
            }

            throw error;
          }
        });
      } catch (error) {
        lastError = error instanceof Error ? error : new Error(String(error));

        // Don't retry on certain errors
        if (
          error instanceof WordPressApiError &&
          error.statusCode &&
          [400, 401, 403, 404].includes(error.statusCode)
        ) {
          throw error;
        }

        // Wait before retrying
        if (attempt < this.config.retries) {
          const delay = this.config.retryDelay * Math.pow(2, attempt);
          this.logger?.debug('Retrying request', {
            attempt: attempt + 1,
            maxRetries: this.config.retries,
            delay,
          });
          await new Promise((resolve) => setTimeout(resolve, delay));
        }
      }
    }

    throw lastError || new Error('Request failed after retries');
  }

  /**
   * Normalize base URL
   */
  private normalizeBaseUrl(url: string): string {
    // Remove trailing slash
    let normalized = url.replace(/\/$/, '');

    // Ensure protocol
    if (!normalized.startsWith('http://') && !normalized.startsWith('https://')) {
      normalized = `https://${normalized}`;
    }

    return normalized;
  }
}

/**
 * Create a WordPress client instance
 * @param config WordPress configuration
 * @param logger Optional logger
 * @returns WordPress client instance
 */
export function createWordPressClient(
  config: WordPressConfig,
  logger?: Logger,
): WordPressClient {
  return new WordPressClient(config, logger);
}

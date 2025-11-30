/**
 * ElementorPage model
 * Represents a complete WordPress page built with Elementor
 */

import type { ElementorSection } from './ElementorSection';

/**
 * Page-level settings
 */
export interface PageSettings {
  // Layout
  pageLayout: 'default' | 'elementor_header_footer' | 'elementor_canvas';
  contentWidth: number;

  // SEO
  metaTitle?: string;
  metaDescription?: string;

  // Custom CSS
  customCss?: string;

  // Color scheme (page-level overrides)
  colorScheme?: {
    primary?: string;
    secondary?: string;
    text?: string;
    accent?: string;
  };

  // Any other page-level settings
  [key: string]: unknown;
}

/**
 * Complete Elementor page with metadata and content
 */
export interface ElementorPage {
  // WordPress metadata
  id: number;
  title: string;
  url: string;
  slug: string;
  status: 'publish' | 'draft' | 'pending' | 'private';
  lastModified: string; // ISO 8601 timestamp

  // Elementor metadata
  elementorVersion: string;
  elementorProVersion?: string;
  editMode: 'builder' | 'disabled';
  templateType: 'page' | 'section' | 'widget';

  // Page structure
  sections: ElementorSection[];

  // Global settings
  pageSettings: PageSettings;

  // Extraction metadata
  extractedAt: string; // ISO 8601 timestamp
  extractorVersion: string;
}

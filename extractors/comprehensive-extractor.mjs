#!/usr/bin/env node

/**
 * COMPREHENSIVE PAGE EXTRACTOR
 *
 * Properly extracts:
 * 1. Closes all popups/modals FIRST
 * 2. Scrolls entire page to load lazy content
 * 3. Extracts hero carousel with all 27 slides
 * 4. Extracts all wave dividers with SVG paths
 * 5. Extracts ALL content sections
 * 6. Extracts images, colors, fonts
 */

import puppeteer from 'puppeteer';
import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const DEFAULT_URL = 'https://www.barbudaleisure.com';
const OUTPUT_DIR = path.join(__dirname, 'output', 'comprehensive');

// Header detection selectors (priority-ordered: Elementor → WordPress → Generic)
const HEADER_SELECTORS = [
  '.elementor-location-header',
  '[data-elementor-type="header"]',
  '.ekit-template-content-header',
  'header.site-header',
  '.site-header',
  'header[role="banner"]',
  'header'
];

// Footer detection selectors (Elementor-first priority)
const FOOTER_SELECTORS = [
  'footer[data-elementor-type="footer"]',
  '.elementor-location-footer',
  '.ekit-template-content-footer',  // ElementsKit footer
  'footer.ekit-template-content-footer',
  'footer#colophon',
  'footer.site-footer',
  'footer'
];

// Social media detection patterns (multi-strategy: domain + icon + keyword)
const SOCIAL_PATTERNS = {
  facebook: {
    domains: ['facebook.com', 'fb.com', 'fb.me'],
    icons: ['fa-facebook', 'facebook', 'icon-facebook', 'bi-facebook'],
    keywords: ['facebook']
  },
  twitter: {
    domains: ['twitter.com', 'x.com', 't.co'],
    icons: ['fa-twitter', 'twitter', 'icon-twitter', 'bi-twitter', 'fa-x-twitter'],
    keywords: ['twitter']
  },
  instagram: {
    domains: ['instagram.com', 'instagr.am'],
    icons: ['fa-instagram', 'instagram', 'icon-instagram', 'bi-instagram'],
    keywords: ['instagram']
  },
  linkedin: {
    domains: ['linkedin.com', 'lnkd.in'],
    icons: ['fa-linkedin', 'linkedin', 'icon-linkedin', 'bi-linkedin'],
    keywords: ['linkedin']
  },
  youtube: {
    domains: ['youtube.com', 'youtu.be'],
    icons: ['fa-youtube', 'youtube', 'icon-youtube', 'bi-youtube'],
    keywords: ['youtube']
  },
  pinterest: {
    domains: ['pinterest.com', 'pin.it'],
    icons: ['fa-pinterest', 'pinterest', 'icon-pinterest', 'bi-pinterest'],
    keywords: ['pinterest']
  },
  tiktok: {
    domains: ['tiktok.com', 'tiktok.it'],
    icons: ['fa-tiktok', 'tiktok', 'icon-tiktok', 'bi-tiktok'],
    keywords: ['tiktok']
  }
};

// Utility Functions

/**
 * Extract URL from CSS background-image string
 * @param {string} bgImageString - CSS background-image value like 'url("https://...")'
 * @returns {string|null} Extracted URL or null
 */
function extractUrl(bgImageString) {
  if (!bgImageString || bgImageString === 'none') return null;
  const match = bgImageString.match(/url\(['"]?([^'"()]+)['"]?\)/);
  return match ? match[1] : null;
}

/**
 * Normalize color to both hex and rgb representations
 * @param {string} colorString - Color in any format (rgb, rgba, hsl, hex)
 * @returns {{hex: string, rgb: string, rgba: string|null}} Normalized color object
 */
function normalizeColor(colorString) {
  if (!colorString || colorString === 'transparent') {
    return { hex: null, rgb: null, rgba: null };
  }

  // RGB/RGBA format
  const rgbMatch = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
  if (rgbMatch) {
    const [, r, g, b, a] = rgbMatch;
    const hex = '#' + [r, g, b].map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
    const rgb = `rgb(${r}, ${g}, ${b})`;
    const rgba = a ? `rgba(${r}, ${g}, ${b}, ${a})` : null;
    return { hex, rgb, rgba };
  }

  // Hex format
  const hexMatch = colorString.match(/^#([0-9a-fA-F]{3,8})$/);
  if (hexMatch) {
    let hex = hexMatch[0];
    // Expand shorthand hex (#abc → #aabbcc)
    if (hex.length === 4) {
      hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
    }
    // Convert hex to rgb
    const r = parseInt(hex.slice(1, 3), 16);
    const g = parseInt(hex.slice(3, 5), 16);
    const b = parseInt(hex.slice(5, 7), 16);
    const rgb = `rgb(${r}, ${g}, ${b})`;
    return { hex, rgb, rgba: null };
  }

  // HSL format - approximate conversion
  const hslMatch = colorString.match(/hsla?\((\d+),\s*([\d.]+)%,\s*([\d.]+)%(?:,\s*([\d.]+))?\)/);
  if (hslMatch) {
    // For now, return the original string (full HSL→RGB conversion is complex)
    return { hex: null, rgb: colorString, rgba: null };
  }

  return { hex: null, rgb: colorString, rgba: null };
}

/**
 * Extract font information from element's computed style
 * @param {Object} computedStyle - Window.getComputedStyle() result
 * @returns {{family: string, weight: number, size: string}} Font data
 */
function extractFontFromComputedStyle(computedStyle) {
  return {
    family: computedStyle.fontFamily.replace(/['"]/g, '').split(',')[0].trim(),
    weight: parseInt(computedStyle.fontWeight) || 400,
    size: computedStyle.fontSize
  };
}

/**
 * Validate if image URL is accessible (returns boolean)
 * Note: This is a helper function structure; actual HTTP checking would be done in extractImageUrls()
 * @param {string} url - Image URL to validate
 * @returns {boolean} True if URL format is valid
 */
function validateImageUrl(url) {
  if (!url) return false;
  try {
    const parsed = new URL(url);
    return parsed.protocol === 'http:' || parsed.protocol === 'https:';
  } catch {
    return false;
  }
}

class ComprehensiveExtractor {
  constructor(url) {
    this.targetUrl = url || DEFAULT_URL;
    this.browser = null;
    this.page = null;
    this.data = {
      timestamp: new Date().toISOString(),
      url: this.targetUrl,
      extractorVersion: '3.0.0',

      // NEW: Complete page assets
      header: null,
      footer: null,

      hero: {
        carousel: null,
        text: null,
        button: null
      },
      sections: [],
      waveDividers: [],

      // NEW: Global styles
      fonts: [],
      colors: [],
      layout: null,
      breakpoints: null,

      // NEW: Extraction validation
      extractionReport: null,

      // Legacy fields (keeping for compatibility)
      carousels: [],
      images: []
    };
  }

  async init() {
    await fs.mkdir(OUTPUT_DIR, { recursive: true });
    await fs.mkdir(path.join(OUTPUT_DIR, 'screenshots'), { recursive: true });

    this.browser = await puppeteer.launch({
      headless: 'new',
      args: ['--no-sandbox', '--disable-setuid-sandbox', '--disable-web-security']
    });
    this.page = await this.browser.newPage();
    await this.page.setViewport({ width: 1920, height: 1080 });
  }

  async navigate() {
    console.log(`🌐 Navigating to ${this.targetUrl}...`);
    await this.page.goto(this.targetUrl, { waitUntil: 'networkidle2', timeout: 60000 });
    await new Promise(resolve => setTimeout(resolve, 3000));

    // CRITICAL: Close all popups/modals FIRST
    console.log('🚫 Closing popups and modals...');
    await this.page.evaluate(() => {
      // Find and close all possible popups
      const selectors = [
        '.modal', '.popup', '[role="dialog"]',
        '.elementor-popup-modal', '.dialog',
        '[class*="popup"]', '[class*="modal"]',
        '[id*="popup"]', '[id*="modal"]'
      ];

      selectors.forEach(sel => {
        document.querySelectorAll(sel).forEach(el => {
          el.style.display = 'none';
          el.style.visibility = 'hidden';
          el.remove();
        });
      });

      // Close any overlay backdrops
      document.querySelectorAll('[class*="overlay"], [class*="backdrop"]').forEach(el => {
        el.style.display = 'none';
        el.remove();
      });

      // Click close buttons
      document.querySelectorAll('[class*="close"], [aria-label*="close" i]').forEach(btn => {
        try {
          btn.click();
        } catch (e) {}
      });
    });

    await new Promise(resolve => setTimeout(resolve, 1000));
    console.log('✓ Popups closed\n');

    // Scroll entire page to load lazy content
    console.log('📜 Scrolling page to load all content...');
    await this.page.evaluate(async () => {
      await new Promise((resolve) => {
        let totalHeight = 0;
        const distance = 300;
        const timer = setInterval(() => {
          window.scrollBy(0, distance);
          totalHeight += distance;

          if (totalHeight >= document.body.scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });

    await this.page.evaluate(() => window.scrollTo(0, 0));
    await new Promise(resolve => setTimeout(resolve, 2000));
    console.log('✓ Page scrolled and loaded\n');
  }

  /**
   * Extract complete header data including logo, navigation, mobile menu
   * Implements US1 - Complete Header and Navigation Extraction (P1)
   */
  async extractHeader() {
    console.log('📋 Extracting Header and Navigation...\n');

    const headerData = await this.page.evaluate((HEADER_SELECTORS) => {
      // Find header using priority-ordered selectors
      let header = null;
      let matchedSelector = null;

      for (const selector of HEADER_SELECTORS) {
        const element = document.querySelector(selector);
        if (element) {
          const rect = element.getBoundingClientRect();
          const pageHeight = document.body.scrollHeight;
          const elementTop = rect.top + window.scrollY;

          // Validate: header should be in top 30% of page
          if (elementTop < pageHeight * 0.3) {
            header = element;
            matchedSelector = selector;
            break;
          }
        }
      }

      if (!header) {
        return null;
      }

      // Extract logo
      let logo = null;
      const logoSelectors = ['.custom-logo', '.site-logo', 'img[class*="logo" i]', 'img'];
      for (const sel of logoSelectors) {
        const logoEl = header.querySelector(sel);
        if (logoEl && logoEl.tagName === 'IMG') {
          const parentLink = logoEl.closest('a');
          logo = {
            src: logoEl.src,
            alt: logoEl.alt || '',
            width: logoEl.width || logoEl.naturalWidth,
            height: logoEl.height || logoEl.naturalHeight,
            href: parentLink ? parentLink.href : null
          };
          break;
        }
      }

      // If logo is SVG
      if (!logo) {
        const svgLogo = header.querySelector('svg[class*="logo" i]');
        if (svgLogo) {
          const parentLink = svgLogo.closest('a');
          logo = {
            src: null,
            alt: 'SVG Logo',
            width: svgLogo.width?.baseVal?.value || null,
            height: svgLogo.height?.baseVal?.value || null,
            href: parentLink ? parentLink.href : null,
            svgContent: svgLogo.outerHTML.substring(0, 500) // Truncate for size
          };
        }
      }

      // Recursive function to extract menu items
      function extractMenuItems(parentUl) {
        const items = [];
        if (!parentUl) return items;

        const menuLis = Array.from(parentUl.children).filter(el => el.tagName === 'LI');

        menuLis.forEach((li, idx) => {
          const link = li.querySelector(':scope > a');
          if (!link) return;

          const item = {
            index: idx,
            text: link.textContent.trim(),
            href: link.href,
            target: link.target || '_self',
            hasChildren: false,
            children: []
          };

          // Check for submenu (recursive)
          const submenu = li.querySelector(':scope > ul.sub-menu, :scope > ul.dropdown-menu, :scope > ul');
          if (submenu) {
            item.hasChildren = true;
            item.children = extractMenuItems(submenu);

            // Detect mega-menu
            const submenuWidth = submenu.offsetWidth;
            const hasMultipleCols = submenu.querySelectorAll(':scope > li').length > 5 ||
                                   submenu.querySelectorAll('.column, .mega-menu-column').length > 1;
            if (submenuWidth > 400 || hasMultipleCols) {
              item.isMegaMenu = true;
            }
          }

          items.push(item);
        });

        return items;
      }

      // Find navigation menu
      let navigation = null;
      const navSelectors = [
        '.elementor-nav-menu > ul',
        'nav.primary-menu > ul',
        'nav ul.menu',
        'nav ul.nav',
        '.nav-menu',
        'nav ul'
      ];

      for (const sel of navSelectors) {
        const navUl = header.querySelector(sel);
        if (navUl && navUl.children.length > 0) {
          const menuItems = extractMenuItems(navUl);

          // Calculate max depth
          function getDepth(items) {
            if (!items || items.length === 0) return 0;
            return 1 + Math.max(...items.map(item =>
              item.children && item.children.length > 0 ? getDepth(item.children) : 0
            ));
          }

          navigation = {
            totalItems: menuItems.length,
            maxDepth: getDepth(menuItems),
            menuItems
          };
          break;
        }
      }

      // Mobile menu configuration
      let mobileMenu = null;
      const mobileToggle = header.querySelector(
        '.mobile-menu-toggle, [aria-label*="menu" i], .hamburger, [class*="menu-icon"]'
      );

      if (mobileToggle) {
        mobileMenu = {
          hasToggle: true,
          breakpoint: 768, // Default, will try to detect from CSS
          iconType: mobileToggle.classList.contains('hamburger') ? 'hamburger' : 'default'
        };

        // Try to detect breakpoint from CSS (simplified - full implementation would parse stylesheets)
        // For now, check common breakpoints
        const mobileStyles = window.getComputedStyle(mobileToggle);
        if (mobileStyles.display === 'none') {
          mobileMenu.breakpoint = 768; // Visible at mobile, hidden at desktop
        }
      }

      // Header styles
      const headerStyles = window.getComputedStyle(header);
      const headerRect = header.getBoundingClientRect();

      return {
        found: true,
        selector: matchedSelector,
        logo,
        navigation,
        mobileMenu,
        styles: {
          backgroundColor: headerStyles.backgroundColor,
          height: Math.round(headerRect.height),
          padding: headerStyles.padding,
          zIndex: headerStyles.zIndex,
          boxShadow: headerStyles.boxShadow !== 'none' ? headerStyles.boxShadow : null
        },
        sticky: headerStyles.position === 'fixed' || headerStyles.position === 'sticky',
        isElementor: matchedSelector.includes('elementor'),
        rect: {
          top: headerRect.top + window.scrollY,
          height: headerRect.height,
          width: headerRect.width
        }
      };
    }, HEADER_SELECTORS);

    if (headerData) {
      console.log(`  ✓ Header found: ${headerData.selector}`);
      console.log(`  ✓ Logo: ${headerData.logo ? 'Found' : 'Not found'}`);
      console.log(`  ✓ Navigation items: ${headerData.navigation ? headerData.navigation.totalItems : 0}`);
      console.log(`  ✓ Mobile menu: ${headerData.mobileMenu ? 'Yes' : 'No'}`);
      console.log('');
      this.data.header = headerData;
    } else {
      console.log('  ⚠ Header not found - site may not have traditional header\n');
      this.data.header = null;
    }
  }

  /**
   * Extract complete footer data including columns, social links, contact info
   * Implements US2 - Complete Footer Extraction (P1)
   */
  async extractFooter() {
    console.log('👣 Extracting Footer...\n');

    const footerData = await this.page.evaluate((FOOTER_SELECTORS, SOCIAL_PATTERNS) => {
      // Find footer using priority-ordered selectors
      let footer = null;
      let matchedSelector = null;

      for (const selector of FOOTER_SELECTORS) {
        const element = document.querySelector(selector);
        if (element) {
          const rect = element.getBoundingClientRect();
          const pageHeight = document.body.scrollHeight;
          const elementTop = rect.top + window.scrollY;

          // Validate: footer should be in bottom 35% of page (adjusted for flexibility)
          if (elementTop > pageHeight * 0.65) {
            footer = element;
            matchedSelector = selector;
            break;
          }
        }
      }

      if (!footer) {
        return null;
      }

      // Extract footer columns
      function extractColumnContent(column) {
        const headings = Array.from(column.querySelectorAll('h1, h2, h3, h4, h5, h6')).map(h => ({
          tag: h.tagName.toLowerCase(),
          text: h.textContent.trim()
        }));

        const paragraphs = Array.from(column.querySelectorAll('p')).map(p => ({
          text: p.textContent.trim().substring(0, 300)
        }));

        const links = Array.from(column.querySelectorAll('a')).slice(0, 10).map(link => ({
          text: link.textContent.trim(),
          href: link.href
        }));

        return { headings, paragraphs, links };
      }

      // Try Elementor columns first
      let columns = [];
      const elementorCols = footer.querySelectorAll('.elementor-column');
      if (elementorCols.length > 0) {
        columns = Array.from(elementorCols).map((col, idx) => ({
          index: idx,
          widthPercent: Math.round((col.offsetWidth / footer.offsetWidth) * 100),
          content: extractColumnContent(col)
        }));
      } else {
        // Fallback: detect generic columns
        const genericCols = footer.querySelectorAll('.footer-column, .widget, [class*="col-"]');
        if (genericCols.length > 0) {
          columns = Array.from(genericCols).map((col, idx) => ({
            index: idx,
            widthPercent: Math.round((col.offsetWidth / footer.offsetWidth) * 100),
            content: extractColumnContent(col)
          }));
        }
      }

      // Extract social media links
      const socialLinks = [];
      const allLinks = footer.querySelectorAll('a');

      allLinks.forEach(link => {
        const href = link.href.toLowerCase();
        const iconClasses = link.className.toLowerCase();
        const ariaLabel = (link.getAttribute('aria-label') || '').toLowerCase();

        for (const [platform, patterns] of Object.entries(SOCIAL_PATTERNS)) {
          const domainMatch = patterns.domains.some(d => href.includes(d));
          const iconMatch = patterns.icons.some(i => iconClasses.includes(i));
          const keywordMatch = patterns.keywords.some(k => ariaLabel.includes(k));

          if (domainMatch || iconMatch || keywordMatch) {
            // Check if not already added (deduplicate)
            if (!socialLinks.find(s => s.url === link.href)) {
              socialLinks.push({
                platform,
                url: link.href,
                iconClass: link.querySelector('i, svg') ?
                  (link.querySelector('i')?.className || 'svg-icon') : null
              });
            }
            break;
          }
        }
      });

      // Extract contact information
      const contactInfo = {
        emails: [],
        phones: [],
        addresses: []
      };

      // Extract emails - Method 1: mailto links
      footer.querySelectorAll('a[href^="mailto:"]').forEach(link => {
        const email = link.href.replace('mailto:', '');
        if (!contactInfo.emails.includes(email)) {
          contactInfo.emails.push(email);
        }
      });

      // Extract emails - Method 2: regex in text
      const emailRegex = /\b[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Z|a-z]{2,}\b/g;
      const footerText = footer.textContent;
      const emailMatches = footerText.match(emailRegex) || [];
      emailMatches.forEach(email => {
        if (!contactInfo.emails.includes(email)) {
          contactInfo.emails.push(email);
        }
      });

      // Extract phones - Method 1: tel links
      footer.querySelectorAll('a[href^="tel:"]').forEach(link => {
        const phone = link.href.replace('tel:', '');
        if (!contactInfo.phones.includes(phone)) {
          contactInfo.phones.push(phone);
        }
      });

      // Extract phones - Method 2: regex patterns
      const phonePatterns = [
        /\+?1?\s*\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}/g,  // US format
        /\+?\d{1,3}[\s.-]?\(?\d{2,4}\)?[\s.-]?\d{3,4}[\s.-]?\d{4}/g  // International
      ];

      phonePatterns.forEach(pattern => {
        const matches = footerText.match(pattern) || [];
        matches.forEach(phone => {
          const cleaned = phone.trim();
          if (cleaned.length >= 10 && !contactInfo.phones.includes(cleaned)) {
            contactInfo.phones.push(cleaned);
          }
        });
      });

      // Extract addresses (heuristic)
      const addressKeywords = ['street', 'avenue', 'road', 'suite', 'floor', 'building'];
      footer.querySelectorAll('p, div').forEach(el => {
        const text = el.textContent.toLowerCase();
        if (addressKeywords.some(kw => text.includes(kw)) && text.length < 200) {
          const fullText = el.textContent.trim();
          if (!contactInfo.addresses.includes(fullText)) {
            contactInfo.addresses.push(fullText);
          }
        }
      });

      // Extract copyright text
      let copyright = null;
      const copyrightRegex = /©|\(c\)|copyright/i;
      footer.querySelectorAll('p, div, span').forEach(el => {
        const text = el.textContent;
        if (copyrightRegex.test(text) && text.length < 200) {
          const yearMatch = text.match(/\d{4}/);
          copyright = {
            text: text.trim(),
            year: yearMatch ? yearMatch[0] : null
          };
        }
      });

      // Extract legal links
      const legalKeywords = ['privacy', 'terms', 'cookie', 'legal', 'policy', 'disclaimer'];
      const legalLinks = [];

      footer.querySelectorAll('a').forEach(link => {
        const text = link.textContent.toLowerCase();
        if (legalKeywords.some(kw => text.includes(kw))) {
          legalLinks.push({
            text: link.textContent.trim(),
            href: link.href
          });
        }
      });

      // Footer styles
      const footerStyles = window.getComputedStyle(footer);
      const footerRect = footer.getBoundingClientRect();

      return {
        selector: matchedSelector,
        columns,
        socialLinks,
        contactInfo,
        copyright,
        legalLinks,
        styles: {
          backgroundColor: footerStyles.backgroundColor,
          color: footerStyles.color,
          padding: footerStyles.padding,
          fontSize: footerStyles.fontSize,
          borderTop: footerStyles.borderTop !== 'none' ? footerStyles.borderTop : null
        },
        rect: {
          top: footerRect.top + window.scrollY,
          height: footerRect.height,
          width: footerRect.width
        }
      };
    }, FOOTER_SELECTORS, SOCIAL_PATTERNS);

    if (footerData) {
      console.log(`  ✓ Footer found: ${footerData.selector}`);
      console.log(`  ✓ Columns: ${footerData.columns.length}`);
      console.log(`  ✓ Social links: ${footerData.socialLinks.length}`);
      console.log(`  ✓ Contact emails: ${footerData.contactInfo.emails.length}`);
      console.log(`  ✓ Contact phones: ${footerData.contactInfo.phones.length}`);
      console.log(`  ✓ Legal links: ${footerData.legalLinks.length}`);
      console.log('');
      this.data.footer = footerData;
    } else {
      console.log('  ⚠ Footer not found - site may use unconventional layout\n');
      this.data.footer = null;
    }
  }

  /**
   * Extract hero carousel with ALL slides (FIXED VERSION)
   * Implements US3 - Carousel Bug Fix (P1)
   *
   * Fixes three root causes:
   * 1. Filter Swiper duplicate slides (loop mode creates 18 duplicates)
   * 2. Search child elements for Elementor background images
   * 3. Check lazy-load data-background attribute
   */
  async extractHeroCarousel() {
    console.log('🎠 Extracting Hero Carousel...\n');

    const carouselData = await this.page.evaluate(() => {
      // Helper function: Extract URL from CSS background-image string
      function extractUrlFromBg(bgImageString) {
        if (!bgImageString || bgImageString === 'none') return null;
        const match = bgImageString.match(/url\(['"]?([^'"()]+)['"]?\)/);
        return match ? match[1] : null;
      }

      // Find hero swiper
      const swipers = document.querySelectorAll('.swiper');
      let heroSwiper = null;

      for (const swiper of swipers) {
        const rect = swiper.getBoundingClientRect();
        if (rect.top < 500 && rect.width > 1000) {
          heroSwiper = swiper;
          break;
        }
      }

      if (!heroSwiper) return null;

      const allSlides = Array.from(heroSwiper.querySelectorAll('.swiper-slide'));

      // FIX 1: Filter out Swiper duplicate slides (created by loop mode)
      const realSlides = allSlides.filter(slide =>
        !slide.classList.contains('swiper-slide-duplicate')
      );

      // Extract data from real slides only
      const slideData = realSlides.map((slide, i) => {
        // FIX 2: Search for image in CHILD elements (Elementor stores images in child divs)
        const img = slide.querySelector('img');
        const bgDiv = slide.querySelector('[style*="background-image"]');
        const bgDivStyle = bgDiv ? bgDiv.style.backgroundImage : null;

        // FIX 3: Check lazy-load data-background attribute (Swiper lazy loading)
        const lazyBgDiv = slide.querySelector('[data-background]');
        const lazyBgUrl = lazyBgDiv ? lazyBgDiv.getAttribute('data-background') : null;

        // Computed style as fallback
        const computedBgStyle = window.getComputedStyle(slide).backgroundImage;

        // FOUR-METHOD IMAGE DETECTION (priority cascade)
        const imageUrl = img?.src ||                    // Method 1: <img> tag (standard)
                        lazyBgUrl ||                   // Method 2: data-background (lazy)
                        extractUrlFromBg(bgDivStyle) ||  // Method 3: Child div inline style (Elementor)
                        extractUrlFromBg(computedBgStyle); // Method 4: Computed background (fallback)

        // Extract overlay content
        const overlay = slide.querySelector('.elementor-background-overlay, .carousel-caption, [class*="overlay"]');
        let overlayData = null;

        if (overlay) {
          const overlayText = overlay.textContent.trim();
          const overlayStyles = window.getComputedStyle(overlay);
          overlayData = {
            text: overlayText.substring(0, 200),
            textColor: overlayStyles.color,
            backgroundColor: overlayStyles.backgroundColor,
            opacity: overlayStyles.opacity
          };
        }

        return {
          index: i,
          image: imageUrl,
          alt: img?.alt || `Slide ${i + 1}`,
          width: img?.width || slide.offsetWidth,
          height: img?.height || slide.offsetHeight,
          overlay: overlayData
        };
      });

      // Filter slides that have valid image URLs
      const slidesWithImages = slideData.filter(s => s.image);

      // Detect carousel configuration
      const hasNavigation = heroSwiper.querySelector('.swiper-button-next, .swiper-button-prev') !== null;
      const hasPagination = heroSwiper.querySelector('.swiper-pagination') !== null;
      const swiperWrapper = heroSwiper.querySelector('.swiper-wrapper');
      const hasLoop = swiperWrapper?.classList.contains('swiper-wrapper-loop') || allSlides.length > realSlides.length;

      return {
        slideCount: realSlides.length,  // Real slides only (not duplicates)
        slides: slidesWithImages,
        config: {
          autoplay: true,  // Assume true if carousel exists
          autoplayDelay: 5000,  // Default Swiper value
          effect: 'slide',  // Most common
          loop: hasLoop,
          navigation: hasNavigation,
          pagination: hasPagination
        },
        rect: {
          width: heroSwiper.offsetWidth,
          height: heroSwiper.offsetHeight,
          top: heroSwiper.getBoundingClientRect().top + window.scrollY
        }
      };
    });

    if (carouselData) {
      const allSlidesCount = carouselData.slideCount;
      const extractedCount = carouselData.slides.length;

      console.log(`  ✓ Found carousel with ${allSlidesCount} slides (real, excluding duplicates)`);
      console.log(`  ✓ Extracted ${extractedCount} image URLs`);

      // Validation: Check for mismatch
      if (extractedCount < allSlidesCount) {
        console.log(`  ⚠️ Warning: Slide count mismatch - expected ${allSlidesCount}, extracted ${extractedCount}`);
      }

      console.log('');
      this.data.hero.carousel = carouselData;
    } else {
      console.log('  ⚠ No hero carousel found\n');
    }
  }

  async extractWaveDividers() {
    console.log('🌊 Extracting Wave Dividers...\n');

    const dividers = await this.page.evaluate(() => {
      const results = [];

      document.querySelectorAll('.elementor-shape, [class*="wave"]').forEach((shape, i) => {
        const svg = shape.querySelector('svg');
        if (!svg) return;

        // Extract ALL path elements (WordPress uses multiple paths per wave)
        const allPaths = Array.from(svg.querySelectorAll('path'));
        if (allPaths.length === 0) return;

        const parent = shape.closest('section, .e-con, .elementor-section');
        const parentBg = parent ? window.getComputedStyle(parent).backgroundColor : null;

        // Get fill color from first path (all paths use same fill via CSS class)
        const firstPath = allPaths[0];
        const pathFillAttr = firstPath.getAttribute('fill');
        const pathComputedFill = window.getComputedStyle(firstPath).fill;
        const svgFill = svg.getAttribute('fill');
        const computedSvgFill = window.getComputedStyle(svg).fill;

        let fillColor = pathFillAttr || pathComputedFill || svgFill || computedSvgFill;

        // If still no fill or fill is 'none', use parent background color
        if (!fillColor || fillColor === 'none' || fillColor === 'currentColor') {
          fillColor = parentBg || '#FFFFFF';
        }

        // Extract all path data with their attributes
        const paths = allPaths.map(path => ({
          d: path.getAttribute('d'),
          className: path.getAttribute('class'),
          opacity: path.getAttribute('opacity')
        }));

        results.push({
          index: i,
          svgViewBox: svg.getAttribute('viewBox'),
          paths: paths,  // Array of all paths
          pathD: allPaths[0].getAttribute('d'),  // Keep for backwards compatibility
          fillColor: fillColor,
          parentBackground: parentBg,
          position: shape.classList.contains('elementor-shape-top') ? 'top' : 'bottom',
          width: svg.getAttribute('width'),
          height: svg.getAttribute('height')
        });
      });

      return results;
    });

    console.log(`  ✓ Found ${dividers.length} wave dividers\n`);
    dividers.forEach((d, i) => {
      console.log(`    Wave ${i + 1}: ${d.position}, ${d.paths.length} paths, fill: ${d.fillColor || 'inherit'}`);
    });
    console.log('');

    this.data.waveDividers = dividers;
  }

  async extractAllSections() {
    console.log('📦 Extracting ALL Content Sections...\n');

    const sections = await this.page.evaluate(() => {
      const results = [];

      // Find ALL visible sections
      const allSections = document.querySelectorAll('section, .e-con.e-parent, [data-element_type="section"]');

      allSections.forEach((section, index) => {
        const rect = section.getBoundingClientRect();

        // Skip tiny sections
        if (rect.height < 80) return;

        // Skip header/footer areas
        const top = rect.top + window.scrollY;
        if (top < 100) return; // Skip header
        if (top > document.body.scrollHeight - 800) return; // Skip footer

        const computed = window.getComputedStyle(section);

        // Extract headings
        const headings = Array.from(section.querySelectorAll('h1, h2, h3, h4')).map(h => ({
          tag: h.tagName.toLowerCase(),
          text: h.textContent.trim(),
          fontFamily: window.getComputedStyle(h).fontFamily,
          fontSize: window.getComputedStyle(h).fontSize,
          fontWeight: window.getComputedStyle(h).fontWeight,
          color: window.getComputedStyle(h).color
        }));

        // Extract paragraphs
        const paragraphs = Array.from(section.querySelectorAll('p')).slice(0, 5).map(p => ({
          text: p.textContent.trim().substring(0, 200),
          fontSize: window.getComputedStyle(p).fontSize,
          color: window.getComputedStyle(p).color
        }));

        // Extract images
        const images = Array.from(section.querySelectorAll('img')).map(img => ({
          src: img.src,
          alt: img.alt,
          width: img.width,
          height: img.height
        }));

        // Extract buttons/links
        const buttons = Array.from(section.querySelectorAll('a.elementor-button, a[role="button"], button')).map(btn => ({
          text: btn.textContent.trim(),
          href: btn.href || null,
          backgroundColor: window.getComputedStyle(btn).backgroundColor,
          color: window.getComputedStyle(btn).color,
          padding: window.getComputedStyle(btn).padding,
          borderRadius: window.getComputedStyle(btn).borderRadius
        }));

        results.push({
          index,
          selector: section.className || section.tagName,
          rect: {
            top,
            left: rect.left,
            width: rect.width,
            height: rect.height
          },
          styles: {
            backgroundColor: computed.backgroundColor,
            backgroundImage: computed.backgroundImage !== 'none' ? 'has-bg-image' : 'none',
            backgroundSize: computed.backgroundSize,
            backgroundPosition: computed.backgroundPosition,
            padding: computed.padding,
            minHeight: computed.minHeight
          },
          content: {
            headings,
            paragraphs,
            images: images.slice(0, 10),
            buttons: buttons.slice(0, 5)
          }
        });
      });

      return results;
    });

    console.log(`  ✓ Found ${sections.length} content sections\n`);
    sections.forEach(s => {
      const heading = s.content.headings[0]?.text || 'No heading';
      console.log(`    Section ${s.index + 1}: "${heading.substring(0, 50)}" (${Math.round(s.rect.height)}px)`);
    });
    console.log('');

    this.data.sections = sections;
  }

  /**
   * Extract global fonts used across the page
   * Implements US4 - Global Fonts and Colors (P2) - Part 1
   */
  async extractFonts() {
    console.log('🔤 Extracting Global Fonts...\n');

    const fontsData = await this.page.evaluate(() => {
      const fontUsageMap = new Map();

      // Query all text elements
      const textElements = document.querySelectorAll('h1, h2, h3, h4, h5, h6, p, a, span, li, button, div');

      textElements.forEach(el => {
        const styles = window.getComputedStyle(el);
        const fontFamily = styles.fontFamily.replace(/['"]/g, '').split(',')[0].trim();
        const fontWeight = parseInt(styles.fontWeight) || 400;
        const fontSize = styles.fontSize;

        if (!fontUsageMap.has(fontFamily)) {
          fontUsageMap.set(fontFamily, {
            family: fontFamily,
            weights: new Set(),
            sizes: new Set(),
            elements: new Set(),
            count: 0
          });
        }

        const fontData = fontUsageMap.get(fontFamily);
        fontData.weights.add(fontWeight);
        fontData.sizes.add(fontSize);
        fontData.elements.add(el.tagName.toLowerCase());
        fontData.count++;
      });

      // Identify font sources
      const googleFonts = new Set();
      const links = document.querySelectorAll('link[href*="fonts.googleapis.com"]');
      links.forEach(link => {
        const match = link.href.match(/family=([^:&]+)/);
        if (match) {
          googleFonts.add(match[1].replace(/\+/g, ' '));
        }
      });

      // Build fonts array
      const fonts = [];
      fontUsageMap.forEach((data, family) => {
        // Filter out system fonts used less than 5 times (likely one-offs)
        if (data.count >= 5) {
          const isGoogleFont = Array.from(googleFonts).some(gf =>
            family.toLowerCase().includes(gf.toLowerCase())
          );

          fonts.push({
            family: data.family,
            weights: Array.from(data.weights).sort((a, b) => a - b),
            source: isGoogleFont ? 'google' : 'system',
            usageContext: Array.from(data.elements),
            frequency: data.count
          });
        }
      });

      // Sort by frequency (most used first)
      return fonts.sort((a, b) => b.frequency - a.frequency);
    });

    console.log(`  ✓ Found ${fontsData.length} unique fonts\n`);
    fontsData.forEach((font, i) => {
      console.log(`    ${i + 1}. ${font.family} (${font.source}, weights: ${font.weights.join(', ')}, used ${font.frequency}x)`);
    });
    console.log('');

    this.data.fonts = fontsData;
  }

  /**
   * Extract global colors used across the page
   * Implements US4 - Global Fonts and Colors (P2) - Part 2
   */
  async extractColors() {
    console.log('🎨 Extracting Global Colors...\n');

    const colorsData = await this.page.evaluate(() => {
      const colorUsageMap = new Map();

      // Helper: Normalize color to both hex and rgb
      function normalizeColor(colorString) {
        if (!colorString || colorString === 'transparent') return null;

        // RGB/RGBA format
        const rgbMatch = colorString.match(/rgba?\((\d+),\s*(\d+),\s*(\d+)(?:,\s*([\d.]+))?\)/);
        if (rgbMatch) {
          const [, r, g, b, a] = rgbMatch;
          const hex = '#' + [r, g, b].map(x => parseInt(x).toString(16).padStart(2, '0')).join('');
          const rgb = `rgb(${r}, ${g}, ${b})`;
          const rgba = a ? `rgba(${r}, ${g}, ${b}, ${a})` : null;
          return { hex, rgb, rgba, alpha: a ? parseFloat(a) : 1 };
        }

        // Hex format
        const hexMatch = colorString.match(/^#([0-9a-fA-F]{3,8})$/);
        if (hexMatch) {
          let hex = hexMatch[0];
          if (hex.length === 4) {
            hex = '#' + hex[1] + hex[1] + hex[2] + hex[2] + hex[3] + hex[3];
          }
          const r = parseInt(hex.slice(1, 3), 16);
          const g = parseInt(hex.slice(3, 5), 16);
          const b = parseInt(hex.slice(5, 7), 16);
          const rgb = `rgb(${r}, ${g}, ${b})`;
          return { hex, rgb, rgba: null, alpha: 1 };
        }

        return null;
      }

      // Query all visible elements
      const elements = document.querySelectorAll('*');
      elements.forEach(el => {
        // Skip if not visible
        const rect = el.getBoundingClientRect();
        if (rect.width === 0 || rect.height === 0) return;

        const styles = window.getComputedStyle(el);

        // Extract colors
        const textColor = normalizeColor(styles.color);
        const bgColor = normalizeColor(styles.backgroundColor);
        const borderColor = normalizeColor(styles.borderTopColor);

        [textColor, bgColor, borderColor].forEach((colorData, idx) => {
          if (!colorData) return;
          if (colorData.alpha < 0.1) return; // Skip near-transparent

          const key = colorData.hex;
          if (!colorUsageMap.has(key)) {
            colorUsageMap.set(key, {
              hex: colorData.hex,
              rgb: colorData.rgb,
              rgba: colorData.rgba,
              usage: [],
              count: 0,
              contexts: new Set()
            });
          }

          const data = colorUsageMap.get(key);
          data.count++;

          // Categorize usage context
          if (idx === 0) data.contexts.add('text');
          if (idx === 1) data.contexts.add('background');
          if (idx === 2) data.contexts.add('border');

          // Identify element type
          const tag = el.tagName.toLowerCase();
          if (['h1', 'h2', 'h3', 'h4', 'h5', 'h6'].includes(tag)) {
            data.contexts.add('heading');
          } else if (tag === 'a' || el.classList.contains('button')) {
            data.contexts.add('link');
          }
        });
      });

      // Build colors array
      const colors = [];
      colorUsageMap.forEach((data, hex) => {
        // Filter out rare colors (used less than 3 times)
        if (data.count >= 3) {
          colors.push({
            hex: data.hex,
            rgb: data.rgb,
            rgba: data.rgba,
            usage: Array.from(data.contexts),
            frequency: data.count
          });
        }
      });

      // Sort by frequency
      return colors.sort((a, b) => b.frequency - a.frequency).slice(0, 20); // Top 20 colors
    });

    console.log(`  ✓ Found ${colorsData.length} unique colors\n`);
    colorsData.slice(0, 10).forEach((color, i) => {
      console.log(`    ${i + 1}. ${color.hex} (${color.usage.join(', ')}, used ${color.frequency}x)`);
    });
    if (colorsData.length > 10) {
      console.log(`    ... and ${colorsData.length - 10} more colors`);
    }
    console.log('');

    this.data.colors = colorsData;
  }

  async saveData() {
    console.log('💾 Saving comprehensive extraction...\n');

    await fs.writeFile(
      path.join(OUTPUT_DIR, 'comprehensive-extraction.json'),
      JSON.stringify(this.data, null, 2)
    );

    // Generate implementation guide
    const guide = {
      timestamp: this.data.timestamp,
      summary: {
        heroCarousel: this.data.hero.carousel ? `${this.data.hero.carousel.slideCount} slides` : 'Not found',
        waveDividers: this.data.waveDividers.length,
        sections: this.data.sections.length,
        totalImages: this.data.sections.reduce((sum, s) => sum + s.content.images.length, 0)
      },
      implementationSteps: [
        {
          step: 1,
          task: 'Implement Hero Carousel',
          component: 'Hero Section in page.tsx',
          details: this.data.hero.carousel ? [
            `Install swiper: npm install swiper`,
            `Create carousel with ${this.data.hero.carousel.slideCount} slides`,
            `Use images: ${this.data.hero.carousel.slides.slice(0, 3).map(s => s.image).join(', ')}`
          ] : ['Hero carousel not found']
        },
        {
          step: 2,
          task: 'Add Wave Dividers',
          component: 'WaveDivider.tsx',
          details: this.data.waveDividers.map((w, i) => (
            `Wave ${i + 1}: ${w.position}, SVG path length: ${w.pathD?.length || 0} chars`
          ))
        },
        {
          step: 3,
          task: 'Build Content Sections',
          component: 'page.tsx',
          details: this.data.sections.map(s => {
            const heading = s.content.headings[0]?.text || 'Untitled';
            return `Section: "${heading}" with ${s.content.images.length} images, ${s.content.buttons.length} buttons`;
          })
        }
      ]
    };

    await fs.writeFile(
      path.join(OUTPUT_DIR, 'implementation-guide.json'),
      JSON.stringify(guide, null, 2)
    );

    console.log('✓ Saved comprehensive-extraction.json');
    console.log('✓ Saved implementation-guide.json\n');
  }

  async close() {
    if (this.browser) {
      await this.browser.close();
    }
  }

  /**
   * Phase 9: Generate extraction report with validation and coverage metrics
   * Implements FR-038 through FR-042
   */
  async generateExtractionReport(startTime) {
    console.log('\n📊 Generating extraction report...');

    const duration = Date.now() - startTime;

    // FR-038: Validate extraction completeness
    const issues = [];
    const warnings = [];

    // Check critical arrays
    if (this.data.hero?.carousel && this.data.hero.carousel.slides.length === 0 && this.data.hero.carousel.slideCount > 0) {
      issues.push({
        severity: 'error',
        component: 'carousel',
        message: `Carousel has ${this.data.hero.carousel.slideCount} slides but 0 images extracted`,
        requirement: 'FR-038'
      });
    }

    if (!this.data.header || !this.data.header.found) {
      warnings.push({
        severity: 'warning',
        component: 'header',
        message: 'Header not found - page may not have traditional header',
        requirement: 'FR-038'
      });
    }

    if (!this.data.footer) {
      warnings.push({
        severity: 'warning',
        component: 'footer',
        message: 'Footer not found - page may not have traditional footer',
        requirement: 'FR-038'
      });
    }

    if (this.data.fonts.length === 0) {
      warnings.push({
        severity: 'warning',
        component: 'fonts',
        message: 'No fonts extracted - may impact typography fidelity',
        requirement: 'FR-038'
      });
    }

    if (this.data.colors.length === 0) {
      warnings.push({
        severity: 'warning',
        component: 'colors',
        message: 'No colors extracted - may impact visual fidelity',
        requirement: 'FR-038'
      });
    }

    // FR-039: Calculate coverage percentage
    const pageHeight = await this.page.evaluate(() => document.body.scrollHeight);

    let extractedHeight = 0;

    // Add header height
    if (this.data.header?.rect?.height) {
      extractedHeight += this.data.header.rect.height;
    }

    // Add footer height
    if (this.data.footer?.rect?.height) {
      extractedHeight += this.data.footer.rect.height;
    }

    // Add carousel height
    if (this.data.hero?.carousel?.rect?.height) {
      extractedHeight += this.data.hero.carousel.rect.height;
    }

    // Add sections height
    extractedHeight += this.data.sections.reduce((sum, section) => sum + (section.rect?.height || 0), 0);

    const coveragePercent = pageHeight > 0 ? (extractedHeight / pageHeight) * 100 : 0;

    if (coveragePercent < 95) {
      warnings.push({
        severity: 'warning',
        component: 'coverage',
        message: `Page coverage is ${coveragePercent.toFixed(1)}% (target: ≥95%)`,
        requirement: 'FR-039'
      });
    }

    // FR-040: Document extraction report
    this.data.extractionReport = {
      timestamp: new Date().toISOString(),
      duration,
      status: issues.length === 0 ? 'success' : 'partial',
      coverage: {
        header: !!this.data.header?.found,
        footer: !!this.data.footer,
        carousel: this.data.hero?.carousel ? this.data.hero.carousel.slides.length > 0 : false,
        sections: this.data.sections.length,
        fonts: this.data.fonts.length,
        colors: this.data.colors.length,
        waveDividers: this.data.waveDividers.length
      },
      issues,
      warnings,
      metrics: {
        pageHeight,
        extractedHeight: Math.round(extractedHeight),
        coveragePercent: Math.round(coveragePercent * 100) / 100
      }
    };

    console.log(`  ✓ Coverage: ${coveragePercent.toFixed(1)}% (${extractedHeight}px / ${pageHeight}px)`);
    console.log(`  ✓ Status: ${this.data.extractionReport.status}`);
    console.log(`  ✓ Issues: ${issues.length}`);
    console.log(`  ✓ Warnings: ${warnings.length}`);

    return this.data.extractionReport;
  }

  /**
   * Phase 9: Validate image URLs (FR-041)
   */
  async validateImageUrls() {
    console.log('\n🔍 Validating image URLs...');

    const allImages = [];

    // Collect all image URLs
    if (this.data.header?.logo?.src) {
      allImages.push({ source: 'header.logo', url: this.data.header.logo.src });
    }

    if (this.data.hero?.carousel?.slides) {
      this.data.hero.carousel.slides.forEach((slide, i) => {
        if (slide.image) {
          allImages.push({ source: `carousel.slide[${i}]`, url: slide.image });
        }
      });
    }

    this.data.sections.forEach((section, i) => {
      if (section.backgroundImage) {
        allImages.push({ source: `sections[${i}].backgroundImage`, url: section.backgroundImage });
      }
    });

    if (allImages.length === 0) {
      console.log('  ⚠ No images to validate');
      return;
    }

    console.log(`  Checking ${allImages.length} image URLs...`);

    const brokenLinks = [];
    let validCount = 0;
    let skipCount = 0;

    // Validate each URL (limit to avoid timeout)
    const samplesToCheck = allImages.slice(0, Math.min(20, allImages.length));

    for (const { source, url } of samplesToCheck) {
      try {
        // Use page.goto with short timeout to check URL
        const response = await this.page.goto(url, {
          waitUntil: 'domcontentloaded',
          timeout: 5000
        });

        if (response && response.ok()) {
          validCount++;
        } else {
          brokenLinks.push({
            source,
            url,
            status: response?.status() || 'unknown',
            error: `HTTP ${response?.status() || 'unknown'}`
          });
        }
      } catch (error) {
        brokenLinks.push({
          source,
          url,
          status: 'error',
          error: error.message
        });
      }
    }

    if (allImages.length > samplesToCheck.length) {
      skipCount = allImages.length - samplesToCheck.length;
    }

    console.log(`  ✓ Valid: ${validCount}`);
    console.log(`  ✗ Broken: ${brokenLinks.length}`);
    if (skipCount > 0) {
      console.log(`  ⊗ Skipped: ${skipCount} (validation limit)`);
    }

    if (brokenLinks.length > 0) {
      this.data.extractionReport.warnings.push({
        severity: 'warning',
        component: 'images',
        message: `${brokenLinks.length} broken image links detected`,
        requirement: 'FR-041',
        details: brokenLinks.slice(0, 5) // Include first 5 for reference
      });
    }
  }

  async run() {
    const startTime = Date.now();

    try {
      console.log('🚀 COMPREHENSIVE PAGE EXTRACTOR\n');
      console.log('═══════════════════════════════════════\n');

      await this.init();
      await this.navigate();

      // Full page screenshot
      await this.page.screenshot({
        path: path.join(OUTPUT_DIR, 'screenshots', 'full-page-clean.png'),
        fullPage: true
      });
      console.log('📸 Full page screenshot saved\n');

      // NEW: Extract complete page assets (MVP - Phases 3-5)
      await this.extractHeader();
      await this.extractFooter();
      await this.extractHeroCarousel();

      // Existing extractions
      await this.extractWaveDividers();
      await this.extractAllSections();

      // Enhancement: Extract global styles (Phase 6 - P2)
      await this.extractFonts();
      await this.extractColors();

      // Phase 9: Validation and reporting
      await this.generateExtractionReport(startTime);
      // Skip image validation for now (can be very slow)
      // await this.validateImageUrls();

      await this.saveData();

      console.log('\n═══════════════════════════════════════');
      console.log('✨ COMPREHENSIVE EXTRACTION COMPLETE\n');
      console.log(`📁 Output: ${OUTPUT_DIR}\n`);
      console.log('📊 Summary:');
      console.log(`   Header: ${this.data.header ? 'Found' : 'Not found'}`);
      if (this.data.header) {
        console.log(`     - Logo: ${this.data.header.logo ? 'Yes' : 'No'}`);
        console.log(`     - Navigation items: ${this.data.header.navigation ? this.data.header.navigation.totalItems : 0}`);
      }
      console.log(`   Footer: ${this.data.footer ? 'Found' : 'Not found'}`);
      if (this.data.footer) {
        console.log(`     - Columns: ${this.data.footer.columns.length}`);
        console.log(`     - Social links: ${this.data.footer.socialLinks.length}`);
      }
      console.log(`   Hero Carousel: ${this.data.hero.carousel ? this.data.hero.carousel.slideCount + ' slides' : 'Not found'}`);
      if (this.data.hero.carousel) {
        console.log(`     - Images extracted: ${this.data.hero.carousel.slides.length}/${this.data.hero.carousel.slideCount}`);
      }
      console.log(`   Wave Dividers: ${this.data.waveDividers.length}`);
      console.log(`   Content Sections: ${this.data.sections.length}`);
      console.log(`   Global Fonts: ${this.data.fonts.length}`);
      console.log(`   Global Colors: ${this.data.colors.length}`);

      // Phase 9: Display quality metrics
      if (this.data.extractionReport) {
        console.log(`\n📈 Quality Metrics:`);
        console.log(`   Coverage: ${this.data.extractionReport.metrics.coveragePercent}% of page height`);
        console.log(`   Status: ${this.data.extractionReport.status}`);
        console.log(`   Duration: ${Math.round(this.data.extractionReport.duration / 1000)}s`);

        if (this.data.extractionReport.issues.length > 0) {
          console.log(`\n⚠️  Issues (${this.data.extractionReport.issues.length}):`);
          this.data.extractionReport.issues.forEach(issue => {
            console.log(`   ❌ ${issue.component}: ${issue.message}`);
          });
        }

        if (this.data.extractionReport.warnings.length > 0) {
          console.log(`\n⚠️  Warnings (${this.data.extractionReport.warnings.length}):`);
          this.data.extractionReport.warnings.forEach(warning => {
            console.log(`   ⚠  ${warning.component}: ${warning.message}`);
          });
        }
      }

      console.log('\n');

    } catch (error) {
      console.error('\n❌ Error:', error);
      throw error;
    } finally {
      await this.close();
    }
  }
}

// Get URL from command line args or use default
const targetUrl = process.argv[2] || 'https://www.barbudaleisure.com';
const extractor = new ComprehensiveExtractor(targetUrl);
extractor.run().catch(console.error);

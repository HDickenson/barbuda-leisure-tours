import axios from 'axios';
import * as cheerio from 'cheerio';
import * as fs from 'fs';
import * as path from 'path';

interface ScrapedPage {
  url: string;
  title: string;
  header: HeaderData;
  footer: FooterData;
  sections: SectionData[];
  forms: FormData[];
  testimonials: TestimonialData[];
  styles: StyleData;
  scripts: string[];
}

interface HeaderData {
  logo: {
    src: string;
    alt: string;
    width?: string;
    height?: string;
  } | null;
  navigation: NavItem[];
  html: string;
  styles: ComputedStyles;
}

interface NavItem {
  text: string;
  url: string;
  children?: NavItem[];
}

interface FooterData {
  columns: FooterColumn[];
  copyright: string;
  links: LinkItem[];
  social: SocialLink[];
  html: string;
  styles: ComputedStyles;
}

interface FooterColumn {
  title: string;
  content: string;
  links: LinkItem[];
}

interface LinkItem {
  text: string;
  url: string;
}

interface SocialLink {
  platform: string;
  url: string;
  icon: string;
}

interface SectionData {
  id: string;
  type: string;
  html: string;
  styles: ComputedStyles;
  content: any;
}

interface FormData {
  id: string;
  title: string;
  fields: FormField[];
  action: string;
  method: string;
  html: string;
}

interface FormField {
  name: string;
  type: string;
  label: string;
  required: boolean;
  placeholder?: string;
  validation?: string;
}

interface TestimonialData {
  author: string;
  text: string;
  rating?: number;
  date?: string;
}

interface StyleData {
  colors: Record<string, string>;
  fonts: Record<string, string>;
  spacing: Record<string, string>;
}

interface ComputedStyles {
  backgroundColor?: string;
  color?: string;
  padding?: string;
  margin?: string;
  fontSize?: string;
  fontFamily?: string;
  [key: string]: string | undefined;
}

class HTMLScraper {
  private baseUrl: string;

  constructor(baseUrl: string) {
    this.baseUrl = baseUrl;
  }

  async scrapePage(url: string): Promise<ScrapedPage> {
    console.log(`Scraping: ${url}`);

    const response = await axios.get(url, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
      }
    });

    const html = response.data;
    const $ = cheerio.load(html);

    const scraped: ScrapedPage = {
      url,
      title: $('title').text(),
      header: this.extractHeader($),
      footer: this.extractFooter($),
      sections: this.extractSections($),
      forms: this.extractForms($),
      testimonials: this.extractTestimonials($),
      styles: this.extractStyles($, html),
      scripts: this.extractScripts($)
    };

    return scraped;
  }

  private extractHeader($: cheerio.CheerioAPI): HeaderData {
    const header = $('header, .header, #header, [role="banner"]').first();

    // Extract logo
    const logoImg = header.find('img').first();
    const logo = logoImg.length ? {
      src: logoImg.attr('src') || '',
      alt: logoImg.attr('alt') || '',
      width: logoImg.attr('width'),
      height: logoImg.attr('height')
    } : null;

    // Extract navigation
    const nav = header.find('nav, .nav, .navigation, .menu').first();
    const navigation = this.extractNav(nav);

    return {
      logo,
      navigation,
      html: header.html() || '',
      styles: this.getComputedStyles(header)
    };
  }

  private extractNav(nav: cheerio.Cheerio<any>): NavItem[] {
    const items: NavItem[] = [];
    const $ = nav as any;

    nav.find('> ul > li, > .menu-item').each((_, el) => {
      const $el = $(el);
      const link = $el.find('a').first();

      if (link.length) {
        items.push({
          text: link.text().trim(),
          url: link.attr('href') || '#'
        });
      }
    });

    return items;
  }

  private extractFooter($: cheerio.CheerioAPI): FooterData {
    const footer = $('footer, .footer, #footer, [role="contentinfo"]').first();

    // Extract columns
    const columns: FooterColumn[] = [];
    footer.find('.footer-column, .footer-widget, .widget').each((_, el) => {
      const $el = cheerio.load(el);
      const title = $el('h2, h3, h4').first().text().trim();
      const links: LinkItem[] = [];

      $el('a').each((_, link) => {
        const $link = cheerio.load(link);
        links.push({
          text: $link.text().trim(),
          url: $link.attr('href') || '#'
        });
      });

      columns.push({
        title,
        content: $el.text(),
        links
      });
    });

    // Extract copyright
    const copyright = footer.find('[class*="copyright"], .site-info').text().trim();

    // Extract social links
    const social: SocialLink[] = [];
    footer.find('a[href*="facebook"], a[href*="instagram"], a[href*="twitter"], a[href*="linkedin"]').each((_, el) => {
      const $el = cheerio.load(el);
      const href = $el.attr('href') || '';
      const platform = this.detectSocialPlatform(href);

      if (platform) {
        social.push({
          platform,
          url: href,
          icon: $el.find('i, svg').attr('class') || ''
        });
      }
    });

    // Extract all footer links
    const links: LinkItem[] = [];
    footer.find('a').each((_, el) => {
      const $el = cheerio.load(el);
      links.push({
        text: $el.text().trim(),
        url: $el.attr('href') || '#'
      });
    });

    return {
      columns,
      copyright,
      links,
      social,
      html: footer.html() || '',
      styles: this.getComputedStyles(footer)
    };
  }

  private detectSocialPlatform(url: string): string | null {
    if (url.includes('facebook.com')) return 'facebook';
    if (url.includes('instagram.com')) return 'instagram';
    if (url.includes('twitter.com') || url.includes('x.com')) return 'twitter';
    if (url.includes('linkedin.com')) return 'linkedin';
    return null;
  }

  private extractSections($: cheerio.CheerioAPI): SectionData[] {
    const sections: SectionData[] = [];

    // Remove header and footer from selection
    $('header, footer').remove();

    // Extract main content sections
    $('main section, .section, article section').each((i, el) => {
      const $el = cheerio.load(el);
      sections.push({
        id: $el.attr('id') || `section-${i}`,
        type: this.detectSectionType($el),
        html: $el.html() || '',
        styles: this.getComputedStyles($el),
        content: this.extractSectionContent($el)
      });
    });

    return sections;
  }

  private detectSectionType($el: cheerio.Cheerio<any>): string {
    const classes = $el.attr('class') || '';

    if (classes.includes('testimonial') || classes.includes('review')) return 'testimonials';
    if (classes.includes('gallery')) return 'gallery';
    if (classes.includes('contact') || $el.find('form').length) return 'contact';
    if (classes.includes('hero') || classes.includes('banner')) return 'hero';

    return 'content';
  }

  private extractSectionContent($el: cheerio.Cheerio<any>): any {
    return {
      heading: $el.find('h1, h2, h3').first().text().trim(),
      text: $el.find('p').map((_, p) => cheerio.load(p).text().trim()).get(),
      images: $el.find('img').map((_, img) => ({
        src: cheerio.load(img).attr('src'),
        alt: cheerio.load(img).attr('alt')
      })).get()
    };
  }

  private extractForms($: cheerio.CheerioAPI): FormData[] {
    const forms: FormData[] = [];

    $('form').each((i, el) => {
      const $form = cheerio.load(el);
      const fields: FormField[] = [];

      $form.find('input, textarea, select').each((_, field) => {
        const $field = cheerio.load(field);
        const name = $field.attr('name') || '';

        if (name && !['submit', 'hidden'].includes($field.attr('type') || '')) {
          fields.push({
            name,
            type: $field.attr('type') || 'text',
            label: $form.find(`label[for="${$field.attr('id')}"]`).text().trim() || name,
            required: $field.attr('required') !== undefined,
            placeholder: $field.attr('placeholder'),
            validation: $field.attr('pattern')
          });
        }
      });

      forms.push({
        id: $form.attr('id') || `form-${i}`,
        title: $form.closest('section').find('h2, h3').first().text().trim(),
        fields,
        action: $form.attr('action') || '',
        method: $form.attr('method') || 'POST',
        html: $form.html() || ''
      });
    });

    return forms;
  }

  private extractTestimonials($: cheerio.CheerioAPI): TestimonialData[] {
    const testimonials: TestimonialData[] = [];

    $('.testimonial, .review, [class*="testimonial"], [class*="review"]').each((_, el) => {
      const $el = cheerio.load(el);

      testimonials.push({
        author: $el.find('.author, .name, [class*="author"]').text().trim(),
        text: $el.find('.text, .content, p').first().text().trim(),
        rating: this.extractRating($el),
        date: $el.find('.date, time').text().trim()
      });
    });

    return testimonials;
  }

  private extractRating($el: cheerio.Cheerio<any>): number | undefined {
    const stars = $el.find('[class*="star"]').length;
    if (stars > 0) return stars;

    const ratingText = $el.find('[class*="rating"]').text();
    const match = ratingText.match(/(\d+\.?\d*)/);
    return match ? parseFloat(match[1]) : undefined;
  }

  private extractStyles($: cheerio.CheerioAPI, html: string): StyleData {
    const styles: StyleData = {
      colors: {},
      fonts: {},
      spacing: {}
    };

    // Extract inline styles and style tags
    $('style').each((_, el) => {
      const css = $(el).html() || '';
      this.parseCSSColors(css, styles.colors);
    });

    // Extract common CSS variables
    const root = $(':root, html');
    if (root.length) {
      // This would need actual computed styles from browser
      // For now, extract from inline styles
    }

    return styles;
  }

  private parseCSSColors(css: string, colors: Record<string, string>) {
    const colorRegex = /(#[0-9a-fA-F]{3,6}|rgba?\([^)]+\))/g;
    const matches = css.match(colorRegex);

    if (matches) {
      matches.forEach((color, i) => {
        colors[`color-${i}`] = color;
      });
    }
  }

  private extractScripts($: cheerio.CheerioAPI): string[] {
    const scripts: string[] = [];

    $('script[src]').each((_, el) => {
      const src = $(el).attr('src');
      if (src) {
        scripts.push(src);
      }
    });

    return scripts;
  }

  private getComputedStyles(el: cheerio.Cheerio<any>): ComputedStyles {
    // This is limited - real computed styles need browser
    const styles: ComputedStyles = {};
    const style = el.attr('style');

    if (style) {
      style.split(';').forEach(rule => {
        const [prop, value] = rule.split(':').map(s => s.trim());
        if (prop && value) {
          styles[prop] = value;
        }
      });
    }

    return styles;
  }

  async scrapeMultiplePages(urls: string[]): Promise<Record<string, ScrapedPage>> {
    const results: Record<string, ScrapedPage> = {};

    for (const url of urls) {
      try {
        const scraped = await this.scrapePage(url);
        const slug = url.split('/').filter(Boolean).pop() || 'home';
        results[slug] = scraped;

        // Be nice to the server
        await new Promise(resolve => setTimeout(resolve, 1000));
      } catch (error) {
        console.error(`Failed to scrape ${url}:`, error);
      }
    }

    return results;
  }

  async saveResults(results: Record<string, ScrapedPage>, outputDir: string) {
    if (!fs.existsSync(outputDir)) {
      fs.mkdirSync(outputDir, { recursive: true });
    }

    for (const [slug, data] of Object.entries(results)) {
      const filePath = path.join(outputDir, `${slug}.json`);
      fs.writeFileSync(filePath, JSON.stringify(data, null, 2));
      console.log(`Saved: ${filePath}`);
    }
  }
}

// CLI
async function main() {
  const baseUrl = 'https://www.barbudaleisure.com';
  const urls = [
    `${baseUrl}/our-tours/`,
    `${baseUrl}/about-us/`,
    `${baseUrl}/reviews/`,
    `${baseUrl}/ready-to-explore-barbuda/`
  ];

  const scraper = new HTMLScraper(baseUrl);
  console.log('Starting HTML scraping...');

  const results = await scraper.scrapeMultiplePages(urls);

  const outputDir = path.join(__dirname, '../../output/html-scraped');
  await scraper.saveResults(results, outputDir);

  console.log(`\nCompleted! Scraped ${Object.keys(results).length} pages`);
  console.log(`Output: ${outputDir}`);
}

if (require.main === module) {
  main().catch(console.error);
}

export { HTMLScraper, ScrapedPage };

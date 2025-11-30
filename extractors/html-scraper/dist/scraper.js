"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.HTMLScraper = void 0;
const axios_1 = __importDefault(require("axios"));
const cheerio = __importStar(require("cheerio"));
const fs = __importStar(require("fs"));
const path = __importStar(require("path"));
class HTMLScraper {
    constructor(baseUrl) {
        this.baseUrl = baseUrl;
    }
    async scrapePage(url) {
        console.log(`Scraping: ${url}`);
        const response = await axios_1.default.get(url, {
            headers: {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36'
            }
        });
        const html = response.data;
        const $ = cheerio.load(html);
        const scraped = {
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
    extractHeader($) {
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
    extractNav(nav) {
        const items = [];
        const $ = nav;
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
    extractFooter($) {
        const footer = $('footer, .footer, #footer, [role="contentinfo"]').first();
        // Extract columns
        const columns = [];
        footer.find('.footer-column, .footer-widget, .widget').each((_, el) => {
            const $el = cheerio.load(el);
            const title = $el('h2, h3, h4').first().text().trim();
            const links = [];
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
        const social = [];
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
        const links = [];
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
    detectSocialPlatform(url) {
        if (url.includes('facebook.com'))
            return 'facebook';
        if (url.includes('instagram.com'))
            return 'instagram';
        if (url.includes('twitter.com') || url.includes('x.com'))
            return 'twitter';
        if (url.includes('linkedin.com'))
            return 'linkedin';
        return null;
    }
    extractSections($) {
        const sections = [];
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
    detectSectionType($el) {
        const classes = $el.attr('class') || '';
        if (classes.includes('testimonial') || classes.includes('review'))
            return 'testimonials';
        if (classes.includes('gallery'))
            return 'gallery';
        if (classes.includes('contact') || $el.find('form').length)
            return 'contact';
        if (classes.includes('hero') || classes.includes('banner'))
            return 'hero';
        return 'content';
    }
    extractSectionContent($el) {
        return {
            heading: $el.find('h1, h2, h3').first().text().trim(),
            text: $el.find('p').map((_, p) => cheerio.load(p).text().trim()).get(),
            images: $el.find('img').map((_, img) => ({
                src: cheerio.load(img).attr('src'),
                alt: cheerio.load(img).attr('alt')
            })).get()
        };
    }
    extractForms($) {
        const forms = [];
        $('form').each((i, el) => {
            const $form = cheerio.load(el);
            const fields = [];
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
    extractTestimonials($) {
        const testimonials = [];
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
    extractRating($el) {
        const stars = $el.find('[class*="star"]').length;
        if (stars > 0)
            return stars;
        const ratingText = $el.find('[class*="rating"]').text();
        const match = ratingText.match(/(\d+\.?\d*)/);
        return match ? parseFloat(match[1]) : undefined;
    }
    extractStyles($, html) {
        const styles = {
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
    parseCSSColors(css, colors) {
        const colorRegex = /(#[0-9a-fA-F]{3,6}|rgba?\([^)]+\))/g;
        const matches = css.match(colorRegex);
        if (matches) {
            matches.forEach((color, i) => {
                colors[`color-${i}`] = color;
            });
        }
    }
    extractScripts($) {
        const scripts = [];
        $('script[src]').each((_, el) => {
            const src = $(el).attr('src');
            if (src) {
                scripts.push(src);
            }
        });
        return scripts;
    }
    getComputedStyles(el) {
        // This is limited - real computed styles need browser
        const styles = {};
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
    async scrapeMultiplePages(urls) {
        const results = {};
        for (const url of urls) {
            try {
                const scraped = await this.scrapePage(url);
                const slug = url.split('/').filter(Boolean).pop() || 'home';
                results[slug] = scraped;
                // Be nice to the server
                await new Promise(resolve => setTimeout(resolve, 1000));
            }
            catch (error) {
                console.error(`Failed to scrape ${url}:`, error);
            }
        }
        return results;
    }
    async saveResults(results, outputDir) {
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
exports.HTMLScraper = HTMLScraper;
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
//# sourceMappingURL=scraper.js.map
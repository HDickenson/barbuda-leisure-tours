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
declare class HTMLScraper {
    private baseUrl;
    constructor(baseUrl: string);
    scrapePage(url: string): Promise<ScrapedPage>;
    private extractHeader;
    private extractNav;
    private extractFooter;
    private detectSocialPlatform;
    private extractSections;
    private detectSectionType;
    private extractSectionContent;
    private extractForms;
    private extractTestimonials;
    private extractRating;
    private extractStyles;
    private parseCSSColors;
    private extractScripts;
    private getComputedStyles;
    scrapeMultiplePages(urls: string[]): Promise<Record<string, ScrapedPage>>;
    saveResults(results: Record<string, ScrapedPage>, outputDir: string): Promise<void>;
}
export { HTMLScraper, ScrapedPage };

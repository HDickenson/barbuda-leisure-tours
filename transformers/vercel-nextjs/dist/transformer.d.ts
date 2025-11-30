/**
 * Elementor to Next.js/Vercel Transformer
 * Converts extracted Elementor pages to Next.js components with Tailwind CSS
 */
interface ElementorPage {
    id: number;
    title: string;
    url: string;
    slug: string;
    status: string;
    lastModified: string;
    sections: ElementorSection[];
    pageSettings: {
        pageLayout: string;
        contentWidth: number;
    };
}
interface ElementorSection {
    id: string;
    elType: string;
    background?: {
        type: string;
        image?: {
            url: string;
            id: number;
        };
    };
    columns: ElementorColumn[];
    padding?: SpacingValue;
    margin?: SpacingValue;
}
interface ElementorColumn {
    id: string;
    width: number;
    widthUnit: string;
    widgets: ElementorWidget[];
    padding?: SpacingValue;
    margin?: SpacingValue;
}
interface ElementorWidget {
    id: string;
    widgetType: string;
    content: Record<string, any>;
    style?: Record<string, any>;
}
interface SpacingValue {
    unit: string;
    top: string | number;
    right: string | number;
    bottom: string | number;
    left: string | number;
}
/**
 * Transform Elementor page to Next.js component
 */
export declare function transformPageToNextJS(page: ElementorPage): {
    component: string;
    contentData: any;
    styles: string;
};
/**
 * Main transform function
 */
export declare function transformAllPages(inputDir: string, outputDir: string): void;
export {};
//# sourceMappingURL=transformer.d.ts.map
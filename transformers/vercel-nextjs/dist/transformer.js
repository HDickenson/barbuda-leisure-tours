"use strict";
/**
 * Elementor to Next.js/Vercel Transformer
 * Converts extracted Elementor pages to Next.js components with Tailwind CSS
 */
Object.defineProperty(exports, "__esModule", { value: true });
exports.transformPageToNextJS = transformPageToNextJS;
exports.transformAllPages = transformAllPages;
const fs_1 = require("fs");
const path_1 = require("path");
/**
 * Transform Elementor page to Next.js component
 */
function transformPageToNextJS(page) {
    const componentName = slugToComponentName(page.slug);
    // Extract content data
    const contentData = extractContentData(page);
    // Generate component code
    const component = generateComponentCode(componentName, page);
    // Generate Tailwind styles
    const styles = generateTailwindStyles(page);
    return { component, contentData, styles };
}
/**
 * Convert slug to valid component name
 */
function slugToComponentName(slug) {
    return slug
        .split('-')
        .map(word => word.charAt(0).toUpperCase() + word.slice(1))
        .join('');
}
/**
 * Extract pure content data (no styling)
 */
function extractContentData(page) {
    return {
        title: page.title,
        slug: page.slug,
        sections: page.sections.map(section => ({
            id: section.id,
            columns: section.columns.map(column => ({
                id: column.id,
                widgets: column.widgets.map(widget => ({
                    id: widget.id,
                    type: widget.widgetType,
                    content: widget.content,
                })),
            })),
        })),
    };
}
/**
 * Generate Next.js component code
 */
function generateComponentCode(componentName, page) {
    const imports = generateImports(page);
    const sectionsCode = page.sections.map((section, idx) => generateSectionCode(section, idx)).join('\n\n');
    return `${imports}

export default function ${componentName}Page() {
  return (
    <main className="min-h-screen">
      {/* Page: ${page.title} */}
      ${sectionsCode}
    </main>
  );
}

export const metadata = {
  title: '${page.title}',
  description: 'Barbuda Leisure - ${page.title}',
};
`;
}
/**
 * Generate necessary imports
 */
function generateImports(page) {
    const imports = new Set(['Image']);
    // Detect which components are needed
    page.sections.forEach(section => {
        section.columns.forEach(column => {
            column.widgets.forEach(widget => {
                if (widget.widgetType === 'image')
                    imports.add('Image');
                if (widget.widgetType === 'button')
                    imports.add('Button');
                if (widget.widgetType === 'heading')
                    imports.add('Heading');
            });
        });
    });
    return `import Image from 'next/image';
${Array.from(imports).filter(i => i !== 'Image').map(i => `import { ${i} } from '@/components/ui/${i.toLowerCase()}';`).join('\n')}`;
}
/**
 * Generate section code
 */
function generateSectionCode(section, idx) {
    const sectionClasses = generateSectionClasses(section);
    const backgroundStyle = generateBackgroundStyle(section.background);
    const columnsCode = section.columns.map((column, colIdx) => generateColumnCode(column, colIdx)).join('\n        ');
    return `      <section
        className="${sectionClasses}"
        ${backgroundStyle ? `style={{ ${backgroundStyle} }}` : ''}
      >
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-12 gap-4">
        ${columnsCode}
          </div>
        </div>
      </section>`;
}
/**
 * Generate column code
 */
function generateColumnCode(column, idx) {
    const columnClasses = generateColumnClasses(column);
    const widgetsCode = column.widgets.map((widget, widgetIdx) => generateWidgetCode(widget, widgetIdx)).join('\n            ');
    return `            <div className="${columnClasses}">
            ${widgetsCode}
            </div>`;
}
/**
 * Generate widget code
 */
function generateWidgetCode(widget, idx) {
    switch (widget.widgetType) {
        case 'heading':
            return generateHeadingWidget(widget);
        case 'text-editor':
            return generateTextEditorWidget(widget);
        case 'image':
            return generateImageWidget(widget);
        case 'button':
            return generateButtonWidget(widget);
        case 'ha-card':
            return generateCardWidget(widget);
        default:
            return `{/* Widget: ${widget.widgetType} */}`;
    }
}
/**
 * Generate heading widget
 */
function generateHeadingWidget(widget) {
    const { title, htmlTag = 'h2' } = widget.content;
    const Tag = htmlTag;
    return `<${Tag} className="text-2xl font-bold mb-4">
                ${escapeHtml(title)}
              </${Tag}>`;
}
/**
 * Generate text editor widget
 */
function generateTextEditorWidget(widget) {
    const { editor } = widget.content;
    return `<div
                className="prose prose-lg"
                dangerouslySetInnerHTML={{ __html: \`${escapeBackticks(editor)}\` }}
              />`;
}
/**
 * Generate image widget
 */
function generateImageWidget(widget) {
    const { image, alt = '' } = widget.content;
    const imageUrl = image?.url || '';
    if (!imageUrl)
        return '';
    return `<Image
                src="${imageUrl}"
                alt="${escapeHtml(alt)}"
                width={800}
                height={600}
                className="w-full h-auto rounded-lg"
              />`;
}
/**
 * Generate button widget
 */
function generateButtonWidget(widget) {
    const { text, link } = widget.content;
    const href = link?.url || '#';
    return `<a
                href="${href}"
                className="inline-block px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
              >
                ${escapeHtml(text)}
              </a>`;
}
/**
 * Generate card widget (Happy Addons)
 */
function generateCardWidget(widget) {
    const { image, title, description, button_text, button_link, badge_text } = widget.content;
    return `<div className="bg-white rounded-lg shadow-lg overflow-hidden">
                ${badge_text ? `<div className="absolute top-4 right-4 bg-blue-600 text-white px-3 py-1 rounded-full text-sm">
                  ${escapeHtml(badge_text)}
                </div>` : ''}
                ${image?.url ? `<Image
                  src="${image.url}"
                  alt="${escapeHtml(title)}"
                  width={800}
                  height={400}
                  className="w-full h-48 object-cover"
                />` : ''}
                <div className="p-6">
                  <h3 className="text-xl font-bold mb-2">${escapeHtml(title)}</h3>
                  <p className="text-gray-600 mb-4">${escapeHtml(description)}</p>
                  ${button_text ? `<a
                    href="${button_link?.url || '#'}"
                    className="inline-block px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 transition"
                  >
                    ${escapeHtml(button_text)}
                  </a>` : ''}
                </div>
              </div>`;
}
/**
 * Generate section Tailwind classes
 */
function generateSectionClasses(section) {
    const classes = ['py-12'];
    if (section.padding) {
        const p = section.padding;
        if (p.top)
            classes.push(`pt-[${p.top}${p.unit}]`);
        if (p.bottom)
            classes.push(`pb-[${p.bottom}${p.unit}]`);
    }
    return classes.join(' ');
}
/**
 * Generate column Tailwind classes
 */
function generateColumnClasses(column) {
    const colSpan = Math.round((column.width / 100) * 12);
    const classes = [`col-span-${colSpan}`];
    if (column.padding) {
        const p = column.padding;
        if (p.top && p.top !== '0')
            classes.push(`pt-[${p.top}${p.unit}]`);
        if (p.bottom && p.bottom !== '0')
            classes.push(`pb-[${p.bottom}${p.unit}]`);
        if (p.left && p.left !== '0')
            classes.push(`pl-[${p.left}${p.unit}]`);
        if (p.right && p.right !== '0')
            classes.push(`pr-[${p.right}${p.unit}]`);
    }
    return classes.join(' ');
}
/**
 * Generate background style
 */
function generateBackgroundStyle(background) {
    if (!background)
        return null;
    if (background.type === 'classic' && background.image?.url) {
        return `backgroundImage: 'url(${background.image.url})', backgroundSize: 'cover', backgroundPosition: 'center'`;
    }
    return null;
}
/**
 * Generate Tailwind custom styles
 */
function generateTailwindStyles(page) {
    return `/* Custom styles for ${page.title} */

/* Add any custom Tailwind utilities here */
`;
}
/**
 * Escape HTML
 */
function escapeHtml(text) {
    if (typeof text !== 'string')
        return '';
    return text
        .replace(/&/g, '&amp;')
        .replace(/</g, '&lt;')
        .replace(/>/g, '&gt;')
        .replace(/"/g, '&quot;')
        .replace(/'/g, '&#039;');
}
/**
 * Escape backticks for template literals
 */
function escapeBackticks(text) {
    if (typeof text !== 'string')
        return '';
    return text.replace(/`/g, '\\`').replace(/\$/g, '\\$');
}
/**
 * Main transform function
 */
function transformAllPages(inputDir, outputDir) {
    const fs = require('fs');
    const path = require('path');
    // Create output directories
    const pagesDir = (0, path_1.join)(outputDir, 'pages');
    const dataDir = (0, path_1.join)(outputDir, 'data');
    [pagesDir, dataDir].forEach(dir => {
        if (!(0, fs_1.existsSync)(dir)) {
            (0, fs_1.mkdirSync)(dir, { recursive: true });
        }
    });
    // Read all page files
    const files = fs.readdirSync(inputDir)
        .filter((f) => f.startsWith('page-') && f.endsWith('.json'));
    console.log(`\nTransforming ${files.length} pages...\n`);
    files.forEach((file) => {
        const pagePath = (0, path_1.join)(inputDir, file);
        const page = JSON.parse(fs.readFileSync(pagePath, 'utf-8'));
        console.log(`✓ Transforming: ${page.title} (${page.slug})`);
        const { component, contentData } = transformPageToNextJS(page);
        // Write component file
        const componentPath = (0, path_1.join)(pagesDir, `${page.slug}.tsx`);
        (0, fs_1.writeFileSync)(componentPath, component, 'utf-8');
        // Write content data
        const dataPath = (0, path_1.join)(dataDir, `${page.slug}.json`);
        (0, fs_1.writeFileSync)(dataPath, JSON.stringify(contentData, null, 2), 'utf-8');
    });
    console.log(`\n✅ Transformation complete! Output in: ${outputDir}\n`);
}
//# sourceMappingURL=transformer.js.map
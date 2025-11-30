import { writeFile } from 'fs/promises';
export async function generateDesignSystem(siteId) {
    const tokens = {
        color: { primary: '#0ea5e9', background: '#ffffff', foreground: '#111827' },
        radius: { sm: 4, md: 8, lg: 16 },
        spacing: { xs: 4, sm: 8, md: 16, lg: 24, xl: 32 },
        type: { fontFamily: 'Inter, system-ui, sans-serif', scale: [12, 14, 16, 20, 24, 32, 40] }
    };
    await writeFile(`apps/next-website/styles/tokens.json`, JSON.stringify(tokens, null, 2));
    await writeFile(`docs/${siteId}-brand-guide.md`, `# Brand Guide\n\n\`\`\`json\n${JSON.stringify(tokens, null, 2)}\n\`\`\``);
    return { siteId, tokensCreated: true };
}

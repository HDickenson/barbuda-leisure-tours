/**
 * Zod validation schemas for all pipeline data structures
 *
 * @packageDocumentation
 */
import { z } from 'zod';
// ============================================================================
// Basic Validators
// ============================================================================
/**
 * Validates a URL string
 */
export const urlSchema = z.string().url().min(1);
/**
 * Validates a site ID
 */
export const siteIdSchema = z.string().min(1).max(20).regex(/^[a-zA-Z0-9]+$/);
/**
 * Validates a hex color
 */
export const hexColorSchema = z.string().regex(/^#[0-9a-fA-F]{3,6}$/);
/**
 * Validates a percentage (0-1)
 */
export const percentageSchema = z.number().min(0).max(1);
// ============================================================================
// Crawl Schemas
// ============================================================================
/**
 * Scout Worker start request
 */
export const scoutStartRequestSchema = z.object({
    url: urlSchema
});
/**
 * Scout Worker start response
 */
export const scoutStartResponseSchema = z.object({
    ok: z.boolean(),
    siteId: siteIdSchema
});
/**
 * Scout Worker step request
 */
export const scoutStepRequestSchema = z.object({
    siteId: siteIdSchema,
    limit: z.number().int().min(1).max(100).optional()
});
/**
 * Scout Worker step response
 */
export const scoutStepResponseSchema = z.object({
    ok: z.boolean(),
    siteId: siteIdSchema,
    processed: z.number().int().min(0),
    remaining: z.number().int().min(0)
});
/**
 * Crawl result schema
 */
export const crawlResultSchema = z.object({
    siteId: siteIdSchema,
    pages: z.array(z.string()),
    assets: z.array(z.string()).optional().default([]),
    metrics: z.object({
        pageCount: z.number().int().min(0),
        assetCount: z.number().int().min(0),
        duration: z.number().min(0),
        errors: z.number().int().min(0).optional().default(0)
    })
});
// ============================================================================
// Asset Schemas
// ============================================================================
/**
 * Asset result schema
 */
export const assetResultSchema = z.object({
    siteId: siteIdSchema,
    total: z.number().int().min(0),
    downloaded: z.number().int().min(0),
    failed: z.number().int().min(0).optional().default(0),
    duration: z.number().min(0),
    failures: z.array(z.object({
        url: z.string(),
        reason: z.string()
    })).optional()
});
/**
 * Coverage schema
 */
export const coverageSchema = z.object({
    siteId: siteIdSchema,
    coverage: percentageSchema,
    total: z.number().int().min(0),
    downloaded: z.number().int().min(0)
});
// ============================================================================
// Design System Schemas
// ============================================================================
/**
 * Color palette schema
 */
export const colorPaletteSchema = z.object({
    primary: hexColorSchema,
    secondary: hexColorSchema.optional(),
    accent: hexColorSchema.optional(),
    background: hexColorSchema,
    foreground: hexColorSchema,
    muted: hexColorSchema.optional(),
    destructive: hexColorSchema.optional(),
    border: hexColorSchema.optional()
}).catchall(hexColorSchema.optional());
/**
 * Typography schema
 */
export const typographySchema = z.object({
    fontFamily: z.array(z.string()).min(1),
    fontSize: z.array(z.number().positive()).min(1),
    fontWeight: z.array(z.number().int().min(100).max(900)).min(1),
    lineHeight: z.array(z.number().positive()).min(1),
    letterSpacing: z.array(z.string()).optional()
});
/**
 * Spacing schema
 */
export const spacingSchema = z.object({
    xs: z.number().min(0),
    sm: z.number().min(0),
    md: z.number().min(0),
    lg: z.number().min(0),
    xl: z.number().min(0),
    '2xl': z.number().min(0).optional(),
    '3xl': z.number().min(0).optional()
}).catchall(z.number().min(0).optional());
/**
 * Animation schema
 */
export const animationSchema = z.object({
    name: z.string().min(1),
    type: z.enum(['transition', 'keyframe', 'scroll']),
    trigger: z.enum(['hover', 'focus', 'scroll', 'mount', 'click']).optional(),
    properties: z.array(z.string()).min(1),
    duration: z.number().positive(),
    easing: z.string(),
    delay: z.number().min(0).optional(),
    keyframes: z.record(z.record(z.string())).optional()
});
/**
 * Design tokens schema
 */
export const designTokensSchema = z.object({
    colors: colorPaletteSchema,
    typography: typographySchema,
    spacing: spacingSchema,
    shadows: z.array(z.string()),
    borderRadius: z.array(z.number().min(0)),
    animations: z.array(animationSchema)
});
/**
 * Component prop schema
 */
export const componentPropSchema = z.object({
    name: z.string().min(1),
    type: z.string().min(1),
    required: z.boolean(),
    defaultValue: z.string().optional(),
    description: z.string().optional()
});
/**
 * Component pattern schema
 */
export const componentPatternSchema = z.object({
    id: z.string().min(1),
    type: z.string().min(1),
    frequency: z.number().int().positive(),
    htmlPattern: z.string(),
    cssClasses: z.array(z.string()),
    props: z.array(componentPropSchema),
    animations: z.array(z.string()).optional()
});
/**
 * Design system schema
 */
export const designSystemSchema = z.object({
    siteId: siteIdSchema,
    tokens: designTokensSchema,
    components: z.array(componentPatternSchema),
    timestamp: z.string().datetime()
});
// ============================================================================
// Synthesis Schemas
// ============================================================================
/**
 * Generated component schema
 */
export const generatedComponentSchema = z.object({
    name: z.string().min(1),
    path: z.string().min(1),
    type: z.string().min(1),
    dependencies: z.array(z.string()),
    props: z.array(componentPropSchema)
});
/**
 * Synth result schema
 */
export const synthResultSchema = z.object({
    siteId: siteIdSchema,
    pages: z.number().int().min(0),
    components: z.number().int().min(0),
    files: z.array(z.string()),
    duration: z.number().min(0),
    warnings: z.array(z.string()).optional()
});
// ============================================================================
// Verification Schemas
// ============================================================================
/**
 * Visual diff report schema
 */
export const visualDiffReportSchema = z.object({
    passed: z.boolean(),
    pages: z.array(z.object({
        url: z.string(),
        diffPercentage: percentageSchema,
        originalPath: z.string(),
        generatedPath: z.string(),
        diffPath: z.string().optional()
    }))
});
/**
 * Link report schema
 */
export const linkReportSchema = z.object({
    ok: z.boolean(),
    total: z.number().int().min(0),
    broken: z.array(z.object({
        source: z.string(),
        href: z.string(),
        status: z.number().int()
    }))
});
/**
 * Performance report schema
 */
export const performanceReportSchema = z.object({
    regression: z.number(),
    lighthouse: z.object({
        performance: z.number().min(0).max(100),
        accessibility: z.number().min(0).max(100),
        bestPractices: z.number().min(0).max(100),
        seo: z.number().min(0).max(100)
    }).optional(),
    webVitals: z.object({
        lcp: z.number().positive(),
        fid: z.number().positive(),
        cls: z.number().min(0)
    }).optional()
});
/**
 * Accessibility report schema
 */
export const accessibilityReportSchema = z.object({
    ok: z.boolean(),
    issues: z.array(z.object({
        type: z.string(),
        severity: z.enum(['critical', 'serious', 'moderate', 'minor']),
        description: z.string(),
        selector: z.string().optional()
    }))
});
/**
 * Verification report schema
 */
export const verificationReportSchema = z.object({
    siteId: siteIdSchema,
    passed: z.boolean(),
    visualDiff: visualDiffReportSchema,
    linkReport: linkReportSchema,
    responsiveReport: z.object({ ok: z.boolean() }),
    perf: performanceReportSchema,
    a11y: accessibilityReportSchema,
    timestamp: z.string().datetime()
});
// ============================================================================
// Pipeline Schemas
// ============================================================================
/**
 * Clone result schema
 */
export const cloneResultSchema = z.object({
    siteId: siteIdSchema,
    success: z.boolean(),
    crawl: crawlResultSchema,
    assets: assetResultSchema,
    designSystem: designSystemSchema,
    synthesis: synthResultSchema,
    verification: verificationReportSchema,
    duration: z.number().min(0),
    errors: z.array(z.string()).optional()
});
/**
 * Stage status schema
 */
export const stageStatusSchema = z.enum(['pending', 'running', 'completed', 'failed']);
/**
 * Pipeline progress schema
 */
export const pipelineProgressSchema = z.object({
    stage: z.enum(['scout', 'download', 'design', 'synthesize', 'verify']),
    status: stageStatusSchema,
    progress: z.number().min(0).max(100),
    message: z.string(),
    elapsed: z.number().min(0)
});
// ============================================================================
// Configuration Schemas
// ============================================================================
/**
 * Crawler configuration schema
 */
export const crawlerConfigSchema = z.object({
    maxPages: z.number().int().positive().optional(),
    timeout: z.number().positive().optional(),
    userAgent: z.string().optional(),
    respectRobotsTxt: z.boolean().optional(),
    delay: z.number().min(0).optional()
});
/**
 * Design configuration schema
 */
export const designConfigSchema = z.object({
    useVision: z.boolean().optional(),
    screenshotSize: z.object({
        width: z.number().int().positive(),
        height: z.number().int().positive()
    }).optional(),
    extractAnimations: z.boolean().optional()
});
/**
 * Synthesis configuration schema
 */
export const synthConfigSchema = z.object({
    componentLibrary: z.enum(['shadcn', 'custom']).optional(),
    typescript: z.boolean().optional(),
    generateTests: z.boolean().optional(),
    animationLibrary: z.enum(['framer-motion', 'gsap', 'css']).optional()
});
/**
 * Verification configuration schema
 */
export const verificationConfigSchema = z.object({
    visualThreshold: percentageSchema.optional(),
    checkPerformance: z.boolean().optional(),
    checkA11y: z.boolean().optional(),
    checkResponsive: z.boolean().optional()
});
/**
 * Pipeline configuration schema
 */
export const pipelineConfigSchema = z.object({
    crawler: crawlerConfigSchema.optional(),
    design: designConfigSchema.optional(),
    synthesis: synthConfigSchema.optional(),
    verification: verificationConfigSchema.optional()
});

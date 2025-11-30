/**
 * Shared TypeScript types for WordPress to Next.js migration pipeline
 *
 * @packageDocumentation
 */

// ============================================================================
// Core Domain Types
// ============================================================================

/**
 * Unique identifier for a cloned site
 * Generated from base64-encoded URL
 */
export type SiteId = string;

/**
 * Result of crawling a website
 */
export interface CrawlResult {
  /** Unique site identifier */
  siteId: SiteId;
  /** Array of discovered page URLs */
  pages: string[];
  /** Array of discovered asset URLs */
  assets: string[];
  /** Crawl performance metrics */
  metrics: {
    /** Number of pages crawled */
    pageCount: number;
    /** Number of assets discovered */
    assetCount: number;
    /** Crawl duration in milliseconds */
    duration: number;
    /** Number of errors encountered */
    errors: number;
  };
}

/**
 * Result of asset download process
 */
export interface AssetResult {
  /** Site identifier */
  siteId: SiteId;
  /** Total assets discovered */
  total: number;
  /** Assets successfully downloaded */
  downloaded: number;
  /** Failed downloads */
  failed: number;
  /** Download duration in milliseconds */
  duration: number;
  /** Failed asset details */
  failures?: Array<{
    url: string;
    reason: string;
  }>;
}

/**
 * Asset coverage information
 */
export interface Coverage {
  /** Site identifier */
  siteId: SiteId;
  /** Coverage percentage (0-1) */
  coverage: number;
  /** Total assets */
  total: number;
  /** Downloaded assets */
  downloaded: number;
}

// ============================================================================
// Design System Types
// ============================================================================

/**
 * Color palette with semantic naming
 */
export interface ColorPalette {
  /** Primary brand color */
  primary: string;
  /** Secondary brand color */
  secondary?: string;
  /** Accent color */
  accent?: string;
  /** Background color */
  background: string;
  /** Foreground/text color */
  foreground: string;
  /** Muted text color */
  muted?: string;
  /** Destructive/error color */
  destructive?: string;
  /** Border color */
  border?: string;
  /** Additional colors */
  [key: string]: string | undefined;
}

/**
 * Typography system
 */
export interface Typography {
  /** Font family stack */
  fontFamily: string[];
  /** Font size scale in pixels */
  fontSize: number[];
  /** Font weight scale */
  fontWeight: number[];
  /** Line height scale */
  lineHeight: number[];
  /** Letter spacing values */
  letterSpacing?: string[];
}

/**
 * Spacing scale
 */
export interface Spacing {
  xs: number;
  sm: number;
  md: number;
  lg: number;
  xl: number;
  '2xl'?: number;
  '3xl'?: number;
  [key: string]: number | undefined;
}

/**
 * Animation specification
 */
export interface Animation {
  /** Animation identifier */
  name: string;
  /** Animation type */
  type: 'transition' | 'keyframe' | 'scroll';
  /** Trigger event */
  trigger?: 'hover' | 'focus' | 'scroll' | 'mount' | 'click';
  /** CSS properties being animated */
  properties: string[];
  /** Duration in milliseconds */
  duration: number;
  /** CSS easing function */
  easing: string;
  /** Delay in milliseconds */
  delay?: number;
  /** Keyframe steps (for keyframe animations) */
  keyframes?: Record<string, Record<string, string>>;
}

/**
 * Design tokens extracted from site
 */
export interface DesignTokens {
  /** Color palette */
  colors: ColorPalette;
  /** Typography system */
  typography: Typography;
  /** Spacing scale */
  spacing: Spacing;
  /** Shadow values */
  shadows: string[];
  /** Border radius values */
  borderRadius: number[];
  /** Animations */
  animations: Animation[];
}

/**
 * Component pattern detected in HTML
 */
export interface ComponentPattern {
  /** Unique identifier */
  id: string;
  /** Component type */
  type: 'button' | 'card' | 'hero' | 'nav' | 'footer' | 'form' | 'modal' | 'carousel' | string;
  /** Number of times pattern appears */
  frequency: number;
  /** Sample HTML structure */
  htmlPattern: string;
  /** CSS classes used */
  cssClasses: string[];
  /** Component props/attributes */
  props: ComponentProp[];
  /** Associated animations */
  animations?: string[];
}

/**
 * Component property definition
 */
export interface ComponentProp {
  /** Property name */
  name: string;
  /** TypeScript type */
  type: string;
  /** Is required */
  required: boolean;
  /** Default value */
  defaultValue?: string;
  /** Description */
  description?: string;
}

/**
 * Complete design system
 */
export interface DesignSystem {
  /** Site identifier */
  siteId: SiteId;
  /** Design tokens */
  tokens: DesignTokens;
  /** Component patterns */
  components: ComponentPattern[];
  /** Generation timestamp */
  timestamp: string;
}

// ============================================================================
// Page Synthesis Types
// ============================================================================

/**
 * Result of page synthesis
 */
export interface SynthResult {
  /** Site identifier */
  siteId: SiteId;
  /** Number of pages generated */
  pages: number;
  /** Number of components generated */
  components: number;
  /** Generated file paths */
  files: string[];
  /** Generation duration in milliseconds */
  duration: number;
  /** Warnings encountered */
  warnings?: string[];
}

/**
 * Generated component metadata
 */
export interface GeneratedComponent {
  /** Component name */
  name: string;
  /** File path */
  path: string;
  /** Component type */
  type: string;
  /** Dependencies */
  dependencies: string[];
  /** Props interface */
  props: ComponentProp[];
}

// ============================================================================
// Verification Types
// ============================================================================

/**
 * Visual regression report
 */
export interface VisualDiffReport {
  /** Overall pass status */
  passed: boolean;
  /** Pages compared */
  pages: Array<{
    /** Page URL */
    url: string;
    /** Pixel difference percentage */
    diffPercentage: number;
    /** Original screenshot path */
    originalPath: string;
    /** Generated screenshot path */
    generatedPath: string;
    /** Diff image path */
    diffPath?: string;
  }>;
}

/**
 * Link validation report
 */
export interface LinkReport {
  /** Overall status */
  ok: boolean;
  /** Total links checked */
  total: number;
  /** Broken links */
  broken: Array<{
    /** Source page */
    source: string;
    /** Link href */
    href: string;
    /** HTTP status code */
    status: number;
  }>;
}

/**
 * Performance report
 */
export interface PerformanceReport {
  /** Performance regression percentage */
  regression: number;
  /** Lighthouse scores */
  lighthouse?: {
    performance: number;
    accessibility: number;
    bestPractices: number;
    seo: number;
  };
  /** Core Web Vitals */
  webVitals?: {
    lcp: number;  // Largest Contentful Paint (ms)
    fid: number;  // First Input Delay (ms)
    cls: number;  // Cumulative Layout Shift
  };
}

/**
 * Accessibility report
 */
export interface AccessibilityReport {
  /** Overall status */
  ok: boolean;
  /** Issues found */
  issues: Array<{
    /** Issue type */
    type: string;
    /** Severity */
    severity: 'critical' | 'serious' | 'moderate' | 'minor';
    /** Description */
    description: string;
    /** Element selector */
    selector?: string;
  }>;
}

/**
 * Complete verification report
 */
export interface VerificationReport {
  /** Site identifier */
  siteId: SiteId;
  /** Overall pass status */
  passed: boolean;
  /** Visual regression report */
  visualDiff: VisualDiffReport;
  /** Link validation */
  linkReport: LinkReport;
  /** Responsive design check */
  responsiveReport: { ok: boolean };
  /** Performance metrics */
  perf: PerformanceReport;
  /** Accessibility scan */
  a11y: AccessibilityReport;
  /** Verification timestamp */
  timestamp: string;
}

// ============================================================================
// Pipeline Types
// ============================================================================

/**
 * Overall pipeline result
 */
export interface CloneResult {
  /** Site identifier */
  siteId: SiteId;
  /** Pipeline success status */
  success: boolean;
  /** Crawl results */
  crawl: CrawlResult;
  /** Asset download results */
  assets: AssetResult;
  /** Design system */
  designSystem: DesignSystem;
  /** Synthesis results */
  synthesis: SynthResult;
  /** Verification report */
  verification: VerificationReport;
  /** Total pipeline duration in milliseconds */
  duration: number;
  /** Any errors encountered */
  errors?: string[];
}

/**
 * Pipeline stage status
 */
export type StageStatus = 'pending' | 'running' | 'completed' | 'failed';

/**
 * Pipeline progress tracking
 */
export interface PipelineProgress {
  /** Current stage */
  stage: 'scout' | 'download' | 'design' | 'synthesize' | 'verify';
  /** Stage status */
  status: StageStatus;
  /** Progress percentage (0-100) */
  progress: number;
  /** Current message */
  message: string;
  /** Elapsed time in milliseconds */
  elapsed: number;
}

// ============================================================================
// Error Types
// ============================================================================

/**
 * Custom error for pipeline failures
 */
export class PipelineError extends Error {
  constructor(
    message: string,
    public stage: string,
    public cause?: Error
  ) {
    super(message);
    this.name = 'PipelineError';
  }
}

/**
 * Error with retry capability
 */
export class RetryableError extends Error {
  constructor(
    message: string,
    public retriesLeft: number
  ) {
    super(message);
    this.name = 'RetryableError';
  }
}

// ============================================================================
// Configuration Types
// ============================================================================

/**
 * Crawler configuration
 */
export interface CrawlerConfig {
  /** Maximum pages to crawl */
  maxPages?: number;
  /** Request timeout in milliseconds */
  timeout?: number;
  /** User agent string */
  userAgent?: string;
  /** Respect robots.txt */
  respectRobotsTxt?: boolean;
  /** Delay between requests in milliseconds */
  delay?: number;
}

/**
 * Design extraction configuration
 */
export interface DesignConfig {
  /** Use Claude Vision API */
  useVision?: boolean;
  /** Screenshot dimensions */
  screenshotSize?: { width: number; height: number };
  /** Extract animations */
  extractAnimations?: boolean;
}

/**
 * Synthesis configuration
 */
export interface SynthConfig {
  /** Component library to use */
  componentLibrary?: 'shadcn' | 'custom';
  /** Use TypeScript */
  typescript?: boolean;
  /** Generate tests */
  generateTests?: boolean;
  /** Animation library */
  animationLibrary?: 'framer-motion' | 'gsap' | 'css';
}

/**
 * Verification configuration
 */
export interface VerificationConfig {
  /** Visual diff threshold (0-1) */
  visualThreshold?: number;
  /** Run performance tests */
  checkPerformance?: boolean;
  /** Run accessibility tests */
  checkA11y?: boolean;
  /** Check responsive design */
  checkResponsive?: boolean;
}

/**
 * Complete pipeline configuration
 */
export interface PipelineConfig {
  crawler?: CrawlerConfig;
  design?: DesignConfig;
  synthesis?: SynthConfig;
  verification?: VerificationConfig;
}

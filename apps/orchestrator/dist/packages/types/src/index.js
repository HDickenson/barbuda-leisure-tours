/**
 * Shared TypeScript types for WordPress to Next.js migration pipeline
 *
 * @packageDocumentation
 */
// ============================================================================
// Error Types
// ============================================================================
/**
 * Custom error for pipeline failures
 */
export class PipelineError extends Error {
    stage;
    cause;
    constructor(message, stage, cause) {
        super(message);
        this.stage = stage;
        this.cause = cause;
        this.name = 'PipelineError';
    }
}
/**
 * Error with retry capability
 */
export class RetryableError extends Error {
    retriesLeft;
    constructor(message, retriesLeft) {
        super(message);
        this.retriesLeft = retriesLeft;
        this.name = 'RetryableError';
    }
}

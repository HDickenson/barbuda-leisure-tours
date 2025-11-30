# Research: Elementor Page Builder Extractor

**Feature**: 001-elementor-extractor
**Date**: 2025-11-13
**Purpose**: Resolve technical unknowns and establish best practices for Elementor data extraction

## Research Questions

### 1. WordPress Data Access Method

**Question**: What is the best method to access Elementor data from WordPress sites?

**Options Evaluated**:
1. **WP-CLI** - WordPress command-line interface
2. **REST API** - WordPress REST API + Elementor endpoints
3. **Direct MySQL** - Direct database queries
4. **WP-JSON Endpoint** - Custom JSON endpoint via plugin

**Decision**: **Multi-connector strategy with REST API as primary, WP-CLI as fallback**

**Rationale**:
- **REST API** is the most portable and doesn't require server CLI access
- Elementor stores data in `wp_postmeta` table under `_elementor_data` meta key
- REST API can be extended via custom endpoints to bulk-fetch Elementor data
- **WP-CLI** is more reliable for large exports but requires SSH/shell access
- Direct MySQL requires credentials and bypasses WordPress security
- Multi-connector design allows users to choose based on their environment

**Implementation Approach**:
- Create abstract `WordPressConnector` interface
- Implement `RestApiConnector` (primary, ~90% of use cases)
- Implement `WpCliConnector` (fallback, for server environments)
- Implement `DatabaseConnector` (advanced, for direct access scenarios)
- CLI tool accepts `--connector=rest|wpcli|db` flag

**Alternatives Considered**:
- **WP-CLI only**: Rejected because many hosted WordPress sites don't provide CLI access
- **REST API only**: Rejected because bulk extraction can hit rate limits
- **Direct MySQL only**: Rejected due to security concerns and lack of WordPress context

---

### 2. Elementor Data Storage Format

**Question**: How does Elementor store page builder data in WordPress?

**Research Findings**:
- Elementor stores page structure as **serialized PHP** in `wp_postmeta.meta_value`
- Meta key: `_elementor_data` (contains JSON-like structure after unserialization)
- Additional meta keys:
  - `_elementor_edit_mode`: Editor mode (builder/disabled)
  - `_elementor_template_type`: Template type (page/section/widget)
  - `_elementor_version`: Elementor version used
  - `_elementor_pro_version`: Pro version (if installed)
  - `_elementor_page_settings`: Global page settings
  - `_elementor_css`: Generated CSS cache

**Decision**: **Use PHP unserialize equivalent for TypeScript**

**Rationale**:
- PHP `serialize()` format is well-documented
- Libraries exist for PHP unserialization in Node.js/TypeScript
- Elementor data structure post-unserialization is array-based with predictable schema

**Best Practice Library**:
- Use `php-serialize` npm package (17k weekly downloads, actively maintained)
- Fallback to manual parsing if library fails (defensive programming)

**Data Structure** (post-unserialization):
```typescript
interface ElementorRawData {
  elements: Array<{
    id: string;
    elType: 'section' | 'column' | 'widget';
    settings: Record<string, any>;
    elements?: Array<...>; // Recursive for sections/columns
    widgetType?: string; // For widgets
  }>;
}
```

---

### 3. Elementor Widget Types and Registry

**Question**: What are the most common Elementor widget types to prioritize?

**Research Findings** (from Elementor documentation and usage analytics):

**Elementor Free (Top 15 by usage)**:
1. `heading` - Text headings (H1-H6)
2. `text-editor` - Rich text content
3. `image` - Image widget
4. `button` - Call-to-action buttons
5. `spacer` - Vertical spacing
6. `divider` - Horizontal dividers
7. `video` - Video embeds (YouTube, Vimeo, self-hosted)
8. `image-box` - Image with title/description
9. `icon` - Icon display
10. `icon-box` - Icon with text
11. `image-carousel` - Image slider
12. `icon-list` - Styled lists with icons
13. `progress` - Progress bars
14. `testimonial` - Customer testimonials
15. `tabs` - Tabbed content

**Elementor Pro (Top 10 by usage)**:
1. `form` - Contact/lead forms
2. `posts` - WordPress posts grid
3. `portfolio` - Portfolio/gallery
4. `slider` - Advanced slider with effects
5. `animated-headline` - Text animations
6. `price-table` - Pricing tables
7. `countdown` - Countdown timers
8. `login` - Login/register forms
9. `menu-anchor` - One-page navigation anchors
10. `sitemap` - Automated sitemap generation

**Decision**: **Phase implementation: P1 covers top 10 Free widgets, P4 adds Pro widgets**

**Rationale**:
- Top 10 Free widgets cover ~80% of Elementor usage
- Remaining Free widgets share similar patterns (can reuse extraction logic)
- Pro widgets require Elementor Pro installation to test
- MVP (P1 user story) focuses on basic widgets to prove architecture

---

### 4. Style Extraction Strategy

**Question**: How to extract and represent Elementor's complex styling system?

**Research Findings**:
- Elementor uses a settings-based styling system (not direct CSS)
- Each widget has style settings organized by tabs: Content, Style, Advanced
- Responsive settings stored with `_mobile`, `_tablet` suffixes
- Global styles referenced by ID (colors: `primary`, `secondary`, etc.)
- CSS is generated dynamically from these settings

**Decision**: **Extract raw settings + computed CSS, map to standard CSS properties**

**Rationale**:
- Raw settings preserve Elementor's intent (colors, spacing units, etc.)
- Computed CSS provides fallback if setting-to-CSS mapping is incomplete
- Standard CSS property mapping enables transformer to generate clean CSS/Tailwind

**Extraction Approach**:
```typescript
interface WidgetStyleExtraction {
  rawSettings: {
    // Raw Elementor settings
    _padding: { unit: 'px', top: 20, right: 20, ... };
    _margin: { ... };
    typography_font_family: 'Roboto';
    // ... all style settings
  };
  computedCss: {
    // Mapped to standard CSS properties
    padding: '20px 20px 20px 20px';
    fontFamily: 'Roboto, sans-serif';
    // ... all computed values
  };
  responsive: {
    mobile: { ... };
    tablet: { ... };
  };
  globalStyleRefs: ['primary-color', 'heading-font'];
}
```

**Best Practice**:
- Use Elementor's CSS generation logic as reference (open-source in Elementor GitHub)
- Create style mapping tables for common properties
- Fall back to raw settings if mapping is ambiguous

---

### 5. Performance Optimization for Large Pages

**Question**: How to handle extraction of pages with 200+ widgets without timeouts?

**Research Findings**:
- Large Elementor pages can have 5MB+ of serialized data
- Nested structure requires recursive traversal
- Memory spikes occur during full-tree parsing

**Decision**: **Streaming extraction with widget-level batching**

**Rationale**:
- Parse top-level structure first (sections only)
- Extract widgets in batches of 50
- Write output incrementally (streaming JSON)
- Allows progress reporting and early failure detection

**Implementation Strategy**:
```typescript
async function* extractWidgetsStreaming(page: ElementorPage) {
  for (const section of page.sections) {
    for (const column of section.columns) {
      for (const widget of column.widgets) {
        yield await extractWidget(widget);
        // Memory can be freed after each widget
      }
    }
  }
}
```

**Memory Management**:
- Use WeakMap for temporary widget cache
- Clear processed sections after extraction
- Target <512MB memory footprint for 200+ widget pages

---

### 6. Error Handling and Resilience

**Question**: How to handle extraction failures gracefully per FR-013?

**Research Findings**:
- Common failure scenarios:
  - Malformed serialized data (corrupted meta)
  - Missing widget type handlers
  - Broken media URLs
  - Deprecated widget types
  - Third-party custom widgets

**Decision**: **Continue-on-error strategy with detailed failure logging**

**Rationale**:
- Partial extraction is better than complete failure
- Logs provide actionable debugging information
- Manual review can address edge cases

**Error Handling Pattern**:
```typescript
interface ExtractionResult {
  success: ElementorWidget[];
  failed: Array<{
    widgetId: string;
    widgetType: string;
    error: string;
    rawData: any; // For debugging
  }>;
  warnings: string[];
}
```

**Best Practice**:
- Wrap each widget extraction in try-catch
- Log full stack trace + widget context
- Continue to next widget
- Final report shows success rate per widget type

---

### 7. Testing Strategy for WordPress/Elementor Integration

**Question**: How to create reliable integration tests without live WordPress?

**Decision**: **Fixture-based testing with real Elementor exports**

**Rationale**:
- Create sample WordPress sites with various Elementor patterns
- Export raw post meta data as JSON fixtures
- Test against fixtures (fast, deterministic, no external dependencies)
- Maintain small test WordPress Docker image for final validation

**Test Data Sources**:
1. **Minimal fixture**: 1 page, 3 widgets (text, image, button) - for unit tests
2. **Complex fixture**: 50+ widgets, nested sections, animations - for integration tests
3. **Pro fixture**: Elementor Pro widgets (forms, sliders, portfolios)
4. **Edge case fixtures**: Malformed data, deprecated widgets, custom widgets

**Docker Test Environment** (optional, for final validation):
```yaml
# docker-compose.test.yml
services:
  wordpress:
    image: wordpress:6.4
    environment:
      - Install Elementor plugin
      - Seed with test pages
  extractor:
    build: .
    depends_on:
      - wordpress
    command: npm test:integration
```

---

## Technology Stack Summary

### Core Dependencies
- **TypeScript**: 5.3+
- **Node.js**: 20 LTS
- **php-serialize**: PHP data unserialization
- **axios**: HTTP client for REST API
- **mysql2**: MySQL connector (optional, for DatabaseConnector)
- **commander**: CLI argument parsing
- **zod**: Schema validation for extracted data
- **winston**: Structured logging

### Development Dependencies
- **Vitest**: Testing framework
- **@vitest/ui**: Test UI
- **typescript-eslint**: Linting
- **prettier**: Code formatting

### Optional Dependencies
- **@wordpress/env**: Local WordPress Docker environment for testing

---

## Architecture Decisions

### ADR-001: Multi-Connector Strategy
**Status**: Accepted
**Context**: Users have different WordPress hosting environments
**Decision**: Support REST API, WP-CLI, and direct database connectors
**Consequences**: Slightly more complex, but vastly more portable

### ADR-002: TypeScript for Type Safety
**Status**: Accepted
**Context**: Elementor data has complex nested structures
**Decision**: Use TypeScript with strict mode
**Consequences**: Better IDE support, catches errors at compile time, aligns with Constitution Principle IV (TypeScript required)

### ADR-003: Streaming Extraction for Large Pages
**Status**: Accepted
**Context**: Pages with 200+ widgets can cause memory issues
**Decision**: Use async generators for widget-level streaming
**Consequences**: More complex code, but handles large pages gracefully

### ADR-004: Continue-on-Error Extraction
**Status**: Accepted
**Context**: Some widgets may fail to extract (custom/deprecated)
**Decision**: Log failures but continue extraction
**Consequences**: Partial extractions succeed, requires post-processing review

---

## Open Questions for Future Research

1. **Global Templates**: How to handle Elementor global templates (reusable sections)?
   - **Action**: Research in Phase 1 during data model design

2. **Dynamic Content**: How to extract Elementor dynamic content (ACF fields, custom fields)?
   - **Action**: May require separate extractor or post-processing step

3. **Custom Fonts**: How to extract and package custom fonts from Elementor?
   - **Action**: Deferred to asset extraction feature (separate from widget extraction)

4. **Revision History**: Should we extract all Elementor revisions or just current?
   - **Action**: Extract latest + metadata about revisions (count, last modified)

---

## References

- [Elementor GitHub Repository](https://github.com/elementor/elementor)
- [Elementor Developer Docs](https://developers.elementor.com/)
- [WordPress REST API Handbook](https://developer.wordpress.org/rest-api/)
- [WP-CLI Commands](https://developer.wordpress.org/cli/commands/)
- [php-serialize npm package](https://www.npmjs.com/package/php-serialize)

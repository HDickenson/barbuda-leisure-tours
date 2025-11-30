# Implementation Plan: Elementor Page Builder Extractor

**Branch**: `001-elementor-extractor` | **Date**: 2025-11-13 | **Spec**: [spec.md](spec.md)
**Input**: Feature specification from `/specs/001-elementor-extractor/spec.md`

**Note**: This template is filled in by the `/speckit.plan` command. See `.specify/templates/commands/plan.md` for the execution workflow.

## Summary

Build an extraction tool that reads Elementor page builder data from WordPress sites and outputs structured JSON containing all widget configurations, styling properties, animations, and hierarchical relationships. This extractor is the first component in the WordPress-to-Next.js conversion pipeline, focusing on comprehensive data capture to enable pixel-perfect reconstruction downstream.

## Technical Context

**Language/Version**: TypeScript 5.3+ (Node.js 20 LTS)
**Primary Dependencies**: Multi-connector strategy - REST API (primary), WP-CLI (fallback), MySQL (advanced); php-serialize, axios, commander, zod, winston
**Storage**: File-based JSON output (no database required for extractor itself)
**Testing**: Vitest for unit tests, fixture-based integration tests, optional Docker WordPress for validation
**Target Platform**: Node.js CLI tool, cross-platform (Windows, macOS, Linux)
**Project Type**: Single project (CLI tool with library core)
**Performance Goals**: Extract 100 widgets in <30 seconds, handle 200+ widgets without timeout, <512MB memory footprint
**Constraints**: Must handle serialized PHP data from WordPress, memory-efficient streaming for large pages
**Scale/Scope**: Target 50+ Elementor widget types (15 Free in P1, 20+ Pro in P4), support Elementor 3.0+, process sites with 100+ pages

## Constitution Check

*GATE: Must pass before Phase 0 research. Re-check after Phase 1 design.*

### Principle I: Deterministic Conversion ✅ PASS
- **Requirement**: All conversion steps must be reproducible and scripted
- **Compliance**: Extractor outputs structured JSON from WordPress data; given same input, produces identical output
- **Evidence**: FR-011 (structured output), FR-012 (logging), SC-001 (100% capture reproducibility)

### Principle II: Pixel-Perfect Visual Fidelity ✅ PASS
- **Requirement**: Capture all styling data to enable <1% pixel difference
- **Compliance**: Extracts all CSS properties, responsive breakpoints, animations, global styles
- **Evidence**: FR-004 (all styling properties), FR-005 (responsive variations), SC-003 (<1% pixel difference target)

### Principle III: Comprehensive Asset Capture ✅ PASS
- **Requirement**: Capture ALL assets from Elementor pages
- **Compliance**: Extracts widgets, content, styling, animations, conditional logic, global styles, media URLs
- **Evidence**: FR-001 to FR-010 cover complete Elementor data surface area, P4 user story addresses Pro widgets

### Principle VI: Extensibility and Plugin Architecture ✅ PASS
- **Requirement**: Modular, independently testable components (Extractors, Validators, Reporters)
- **Compliance**: Extractor is first modular component in pipeline, designed for extension
- **Evidence**: FR-013 (graceful failure handling), single responsibility (extraction only, no transformation)

### Principle VII: Observability and Quality Reporting ✅ PASS
- **Requirement**: Generate quality reports (JSON + Markdown)
- **Compliance**: Extraction logs, validation reports, error tracking
- **Evidence**: FR-012 (operation logging), FR-014 (validation step), SC-008 (debugging logs), SC-009 (95% validation accuracy)

### Principle IV: Modern Next.js Best Practices ⚠️ DEFERRED
- **Status**: Not applicable at extraction phase (applies to transformer/generator components)
- **Note**: This extractor produces data; Next.js code generation is downstream

### Principle V: Incremental Migration Support ⚠️ DEFERRED
- **Status**: Not applicable at extraction phase (applies to deployment/routing components)
- **Note**: Extractor is stateless and supports processing individual pages independently

### Constitution Compliance Summary
**Result**: ✅ **PASS** - All applicable principles satisfied
**Violations**: None
**Deferred**: Principles IV & V apply to downstream components, not extraction phase

## Project Structure

### Documentation (this feature)

```text
specs/[###-feature]/
├── plan.md              # This file (/speckit.plan command output)
├── research.md          # Phase 0 output (/speckit.plan command)
├── data-model.md        # Phase 1 output (/speckit.plan command)
├── quickstart.md        # Phase 1 output (/speckit.plan command)
├── contracts/           # Phase 1 output (/speckit.plan command)
└── tasks.md             # Phase 2 output (/speckit.tasks command - NOT created by /speckit.plan)
```

### Source Code (repository root)

```text
extractors/
└── elementor/
    ├── src/
    │   ├── models/           # TypeScript interfaces for Elementor entities
    │   │   ├── ElementorPage.ts
    │   │   ├── ElementorSection.ts
    │   │   ├── ElementorColumn.ts
    │   │   ├── ElementorWidget.ts
    │   │   ├── WidgetStyle.ts
    │   │   ├── WidgetAnimation.ts
    │   │   └── GlobalStyle.ts
    │   ├── extractors/       # Widget-specific extraction logic
    │   │   ├── base/
    │   │   │   ├── BaseExtractor.ts
    │   │   │   └── WidgetRegistry.ts
    │   │   ├── free/         # Elementor Free widgets
    │   │   │   ├── TextExtractor.ts
    │   │   │   ├── ImageExtractor.ts
    │   │   │   ├── ButtonExtractor.ts
    │   │   │   └── ...
    │   │   └── pro/          # Elementor Pro widgets
    │   │       ├── FormExtractor.ts
    │   │       ├── SliderExtractor.ts
    │   │       └── ...
    │   ├── parsers/          # WordPress/Elementor data parsers
    │   │   ├── ElementorDataParser.ts
    │   │   ├── PhpSerializeParser.ts
    │   │   └── StyleParser.ts
    │   ├── validators/       # Data validation
    │   │   ├── SchemaValidator.ts
    │   │   └── CompletenessValidator.ts
    │   ├── reporters/        # Logging and reporting
    │   │   ├── JsonReporter.ts
    │   │   ├── MarkdownReporter.ts
    │   │   └── Logger.ts
    │   ├── connectors/       # WordPress data access
    │   │   ├── WordPressConnector.ts
    │   │   ├── WpCliConnector.ts
    │   │   ├── RestApiConnector.ts
    │   │   └── DatabaseConnector.ts
    │   ├── core/             # Core extraction engine
    │   │   ├── ExtractionEngine.ts
    │   │   ├── Pipeline.ts
    │   │   └── Config.ts
    │   └── cli/              # Command-line interface
    │       ├── index.ts
    │       └── commands/
    │           ├── extract.ts
    │           └── validate.ts
    ├── tests/
    │   ├── unit/             # Unit tests for individual components
    │   │   ├── extractors/
    │   │   ├── parsers/
    │   │   └── validators/
    │   ├── integration/      # End-to-end extraction tests
    │   │   ├── fixtures/     # Sample WordPress/Elementor data
    │   │   └── scenarios/
    │   └── contract/         # Contract tests for output schema
    │       └── output-schema.test.ts
    ├── package.json
    ├── tsconfig.json
    └── vitest.config.ts
```

**Structure Decision**: Single project structure selected. This is a CLI tool with a library core following the Extractor pattern from Constitution Principle VI. The modular design allows:
- Independent testing of each widget extractor
- Easy extension for new Elementor widgets (Free or Pro)
- Swappable WordPress connectors (WP-CLI, REST API, or direct database)
- Clear separation of concerns (extraction, parsing, validation, reporting)

## Complexity Tracking

> **Fill ONLY if Constitution Check has violations that must be justified**

**No violations**: All constitution principles satisfied. No complexity justifications required.

---

## Phase 0: Research Outcomes

**File**: [research.md](research.md)

**Key Decisions**:
1. **WordPress Data Access**: Multi-connector strategy (REST API primary, WP-CLI fallback, MySQL advanced)
2. **Data Format**: PHP serialize/unserialize with `php-serialize` npm package
3. **Widget Coverage**: Top 15 Free widgets (P1), 20+ Pro widgets (P4)
4. **Performance**: Streaming extraction with 50-widget batches, <512MB memory target
5. **Error Handling**: Continue-on-error with detailed failure logging

**Technologies Selected**:
- TypeScript 5.3+ (strict mode)
- Node.js 20 LTS
- Key deps: php-serialize, axios, commander, zod, winston
- Testing: Vitest with fixture-based integration tests

---

## Phase 1: Design Outcomes

### Data Model

**File**: [data-model.md](data-model.md)

**Entities Defined**:
- `ElementorPage`: Complete page with metadata and sections
- `ElementorSection`: Top-level container with layout and background
- `ElementorColumn`: Column container within sections
- `ElementorWidget`: Individual components with content/style/advanced settings
- `WidgetStyle`: CSS properties and responsive overrides
- `WidgetAnimation`: Animation configuration
- `GlobalStyle`: Reusable theme kit styles
- `ExtractionReport`: Quality metrics and failure tracking

**Validation**: All entities have Zod schemas for runtime validation

### API Contracts

**File**: [contracts/cli-interface.md](contracts/cli-interface.md)

**CLI Commands**:
1. `extract`: Main extraction command with connector options
2. `validate`: Schema validation for extracted JSON
3. `list-widgets`: Show supported widget types
4. `config`: Manage configuration

**Exit Codes**: 0 (success), 1 (partial), 2 (fatal), 3 (validation error)

### Quickstart Guide

**File**: [quickstart.md](quickstart.md)

**Quick Start Flow**:
1. Install: `npm install -g @barbuda/elementor-extractor`
2. Extract: `elementor-extractor extract --url https://site.com --output site.json`
3. Validate: `elementor-extractor validate --input site.json`

**Troubleshooting**: Connection, auth, timeout, and partial failure scenarios documented

---

## Constitution Re-Check (Post-Design)

### Principle I: Deterministic Conversion ✅ PASS
- **Design Validation**: CLI outputs structured JSON with Zod validation
- **Implementation**: Streaming extraction ensures consistent output for same input
- **Evidence**: data-model.md defines all schemas, cli-interface.md specifies exit codes

### Principle II: Pixel-Perfect Visual Fidelity ✅ PASS
- **Design Validation**: Complete style extraction (colors, typography, spacing, animations)
- **Implementation**: `WidgetStyle` captures all CSS properties plus responsive breakpoints
- **Evidence**: data-model.md includes typography, background, border, shadow, responsive settings

### Principle III: Comprehensive Asset Capture ✅ PASS
- **Design Validation**: Extracts widgets, content, styles, animations, global styles, media URLs
- **Implementation**: 50+ widget types supported, Pro widgets included
- **Evidence**: research.md documents widget coverage, data-model.md includes all asset types

### Principle VI: Extensibility and Plugin Architecture ✅ PASS
- **Design Validation**: Modular extractors (free/pro), swappable connectors, registry pattern
- **Implementation**: Project structure shows extractors/free, extractors/pro, connectors/
- **Evidence**: plan.md project structure, research.md ADR-001 (multi-connector)

### Principle VII: Observability and Quality Reporting ✅ PASS
- **Design Validation**: JSON + Markdown reports, detailed logs, validation metrics
- **Implementation**: `ExtractionReport` entity, --report flag, --verbose logging
- **Evidence**: data-model.md ExtractionReport, cli-interface.md report schema

### Final Constitution Compliance
**Result**: ✅ **PASS** - All applicable principles satisfied after design phase
**Changes from Pre-Design**: No changes - initial assessment was correct

# Tasks: Elementor Page Builder Extractor

**Input**: Design documents from `/specs/001-elementor-extractor/`
**Prerequisites**: plan.md (required), spec.md (required for user stories), research.md, data-model.md, contracts/

**Tests**: Tests are OPTIONAL - not explicitly requested in feature specification. Focus on core extraction functionality.

**Organization**: Tasks are grouped by user story to enable independent implementation and testing of each story.

**Output Separation**: Extracted JSON files and reports will be written to a dedicated `output/` directory, separate from source code in `extractors/elementor/src/`.

## Format: `[ID] [P?] [Story] Description`

- **[P]**: Can run in parallel (different files, no dependencies)
- **[Story]**: Which user story this task belongs to (e.g., US1, US2, US3, US4)
- Include exact file paths in descriptions

## Path Conventions

- **Source code**: `extractors/elementor/src/`
- **Tests**: `extractors/elementor/tests/`
- **Output**: `output/extractions/` (extracted JSON files, reports)

---

## Phase 1: Setup (Shared Infrastructure)

**Purpose**: Project initialization and basic structure

- [x] T001 Create project structure per implementation plan
- [x] T002 Initialize TypeScript project with dependencies (package.json, tsconfig.json)
- [x] T003 [P] Configure linting (ESLint) and formatting (Prettier)
- [x] T004 [P] Configure testing framework (Vitest with coverage)
- [x] T005 [P] Create .gitignore and README.md
- [ ] T006 Create output directory structure at output/extractions/ for extracted JSON files
- [ ] T007 Add output/ to .gitignore to keep extracted data separate from source control

**Checkpoint**: Project structure ready, dependencies installed

---

## Phase 2: Foundational (Blocking Prerequisites)

**Purpose**: Core infrastructure that MUST be complete before ANY user story can be implemented

**⚠️ CRITICAL**: No user story work can begin until this phase is complete

- [ ] T008 [P] Create TypeScript interfaces for ElementorPage in extractors/elementor/src/models/ElementorPage.ts
- [ ] T009 [P] Create TypeScript interfaces for ElementorSection in extractors/elementor/src/models/ElementorSection.ts
- [ ] T010 [P] Create TypeScript interfaces for ElementorColumn in extractors/elementor/src/models/ElementorColumn.ts
- [ ] T011 [P] Create TypeScript interfaces for ElementorWidget in extractors/elementor/src/models/ElementorWidget.ts
- [ ] T012 [P] Create TypeScript interfaces for WidgetStyle in extractors/elementor/src/models/WidgetStyle.ts
- [ ] T013 [P] Create TypeScript interfaces for WidgetAnimation in extractors/elementor/src/models/WidgetAnimation.ts
- [ ] T014 [P] Create TypeScript interfaces for GlobalStyle in extractors/elementor/src/models/GlobalStyle.ts
- [ ] T015 [P] Create TypeScript interfaces for ExtractionReport in extractors/elementor/src/models/ExtractionReport.ts
- [ ] T016 [P] Create models index file in extractors/elementor/src/models/index.ts exporting all model interfaces
- [ ] T017 Create Zod schemas for all models in extractors/elementor/src/models/schemas.ts
- [ ] T018 Implement PHP serialization parser in extractors/elementor/src/parsers/PhpSerializeParser.ts using php-serialize library
- [ ] T019 Implement Elementor data parser in extractors/elementor/src/parsers/ElementorDataParser.ts (parses raw Elementor meta to structured data)
- [ ] T020 Create abstract WordPressConnector interface in extractors/elementor/src/connectors/WordPressConnector.ts
- [ ] T021 Implement RestApiConnector in extractors/elementor/src/connectors/RestApiConnector.ts using axios
- [ ] T022 Implement configuration manager in extractors/elementor/src/core/Config.ts (handles CLI options, env vars, config files)
- [ ] T023 Implement structured logger in extractors/elementor/src/reporters/Logger.ts using winston
- [ ] T024 Implement JSON reporter in extractors/elementor/src/reporters/JsonReporter.ts (writes extracted data to output/extractions/)
- [ ] T025 Implement extraction engine core in extractors/elementor/src/core/ExtractionEngine.ts (orchestrates extraction pipeline)
- [ ] T026 Create BaseExtractor abstract class in extractors/elementor/src/extractors/base/BaseExtractor.ts
- [ ] T027 Create WidgetRegistry in extractors/elementor/src/extractors/base/WidgetRegistry.ts (maps widget types to extractors)

**Checkpoint**: Foundation ready - user story implementation can now begin in parallel

---

## Phase 3: User Story 1 - Extract Basic Widget Data (Priority: P1) 🎯 MVP

**Goal**: Extract all Elementor widgets with their types, configurations, and content in structured JSON format

**Independent Test**: Run extractor against a test WordPress page with text, image, and button widgets; verify all widgets captured in JSON with hierarchical structure preserved

### Implementation for User Story 1

- [ ] T028 [P] [US1] Implement HeadingExtractor in extractors/elementor/src/extractors/free/HeadingExtractor.ts
- [ ] T029 [P] [US1] Implement TextEditorExtractor in extractors/elementor/src/extractors/free/TextEditorExtractor.ts
- [ ] T030 [P] [US1] Implement ImageExtractor in extractors/elementor/src/extractors/free/ImageExtractor.ts
- [ ] T031 [P] [US1] Implement ButtonExtractor in extractors/elementor/src/extractors/free/ButtonExtractor.ts
- [ ] T032 [P] [US1] Implement SpacerExtractor in extractors/elementor/src/extractors/free/SpacerExtractor.ts
- [ ] T033 [P] [US1] Implement DividerExtractor in extractors/elementor/src/extractors/free/DividerExtractor.ts
- [ ] T034 [P] [US1] Implement VideoExtractor in extractors/elementor/src/extractors/free/VideoExtractor.ts
- [ ] T035 [P] [US1] Implement ImageBoxExtractor in extractors/elementor/src/extractors/free/ImageBoxExtractor.ts
- [ ] T036 [P] [US1] Implement IconExtractor in extractors/elementor/src/extractors/free/IconExtractor.ts
- [ ] T037 [P] [US1] Implement IconBoxExtractor in extractors/elementor/src/extractors/free/IconBoxExtractor.ts
- [ ] T038 [US1] Register all P1 Free widget extractors in WidgetRegistry
- [ ] T039 [US1] Implement section extraction logic in ExtractionEngine (processes ElementorSection with child columns)
- [ ] T040 [US1] Implement column extraction logic in ExtractionEngine (processes ElementorColumn with child widgets)
- [ ] T041 [US1] Implement widget extraction dispatch logic in ExtractionEngine (routes to appropriate widget extractor)
- [ ] T042 [US1] Implement hierarchical structure assembly in ExtractionEngine (builds Page → Section → Column → Widget tree)
- [ ] T043 [US1] Add error handling for widget extraction failures (continue-on-error pattern per FR-013)
- [ ] T044 [US1] Implement CLI extract command in extractors/elementor/src/cli/commands/extract.ts with --url, --output, --connector flags
- [ ] T045 [US1] Implement CLI entry point in extractors/elementor/src/cli/index.ts using commander
- [ ] T046 [US1] Update package.json bin to point to dist/cli/index.js
- [ ] T047 [US1] Test extraction against sample WordPress page with 10 basic widgets, verify JSON output in output/extractions/

**Checkpoint**: At this point, User Story 1 should be fully functional and testable independently. Basic widget extraction works end-to-end via CLI.

---

## Phase 4: User Story 2 - Capture Widget Styling (Priority: P2)

**Goal**: Extract all styling information (colors, typography, spacing, responsive settings) for pixel-perfect visual fidelity

**Independent Test**: Extract styled widgets and verify all CSS properties captured, including mobile/tablet/desktop responsive variations

### Implementation for User Story 2

- [ ] T048 [P] [US2] Implement StyleParser in extractors/elementor/src/parsers/StyleParser.ts (converts Elementor settings to CSS properties)
- [ ] T049 [US2] Implement typography settings extraction in StyleParser (font family, size, weight, line height, etc.)
- [ ] T050 [US2] Implement spacing settings extraction in StyleParser (padding, margin with units)
- [ ] T051 [US2] Implement border settings extraction in StyleParser (type, width, color, radius)
- [ ] T052 [US2] Implement background settings extraction in StyleParser (color, image, gradient, video)
- [ ] T053 [US2] Implement shadow settings extraction in StyleParser (box shadow, text shadow)
- [ ] T054 [US2] Implement responsive breakpoint extraction in StyleParser (mobile, tablet overrides)
- [ ] T055 [US2] Add global style reference extraction in StyleParser (theme kit colors, typography presets)
- [ ] T056 [US2] Integrate StyleParser into all widget extractors (populate WidgetStyle property)
- [ ] T057 [US2] Extract global styles from WordPress options table in RestApiConnector
- [ ] T058 [US2] Add GlobalStyle array to ElementorPage output structure
- [ ] T059 [US2] Test style extraction with custom-styled widgets, verify exact CSS values in output/extractions/

**Checkpoint**: At this point, User Stories 1 AND 2 should both work independently. Full styling data captured for visual fidelity.

---

## Phase 5: User Story 3 - Extract Advanced Widget Settings (Priority: P3)

**Goal**: Extract animations, interactions, custom attributes, and conditional display rules for dynamic behaviors

**Independent Test**: Extract animated widgets and conditional visibility, verify all settings captured in JSON

### Implementation for User Story 3

- [ ] T060 [P] [US3] Implement animation settings extraction in BaseExtractor (type, duration, delay, easing, trigger)
- [ ] T061 [P] [US3] Implement conditional display extraction in BaseExtractor (device rules, user role rules, custom conditions)
- [ ] T062 [P] [US3] Implement custom attributes extraction in BaseExtractor (CSS classes, IDs, data-* attributes)
- [ ] T063 [P] [US3] Implement scrolling effects extraction in BaseExtractor (Elementor Pro feature - opacity, translate, etc.)
- [ ] T064 [US3] Add WidgetAdvanced property to all widget extractors (populate with animations, conditionals, custom attrs)
- [ ] T065 [US3] Add animation type enum validation in Zod schemas (fadeIn, slideIn, zoomIn, etc.)
- [ ] T066 [US3] Test advanced settings extraction with animated widgets, verify animation data in output/extractions/

**Checkpoint**: All user stories 1, 2, and 3 should now be independently functional. Dynamic behaviors captured.

---

## Phase 6: User Story 4 - Handle Elementor Pro Widgets (Priority: P4)

**Goal**: Extract Elementor Pro premium widgets (forms, sliders, portfolios, etc.)

**Independent Test**: Extract pages with Pro widgets and verify each Pro widget type has specific settings captured

### Implementation for User Story 4

- [ ] T067 [P] [US4] Implement FormExtractor in extractors/elementor/src/extractors/pro/FormExtractor.ts (form fields, actions, submit button)
- [ ] T068 [P] [US4] Implement SliderExtractor in extractors/elementor/src/extractors/pro/SliderExtractor.ts (slides, navigation, autoplay)
- [ ] T069 [P] [US4] Implement PostsExtractor in extractors/elementor/src/extractors/pro/PostsExtractor.ts (query parameters, display settings)
- [ ] T070 [P] [US4] Implement PortfolioExtractor in extractors/elementor/src/extractors/pro/PortfolioExtractor.ts (gallery items, filters)
- [ ] T071 [P] [US4] Implement PriceTableExtractor in extractors/elementor/src/extractors/pro/PriceTableExtractor.ts (pricing tiers, features, buttons)
- [ ] T072 [P] [US4] Implement CountdownExtractor in extractors/elementor/src/extractors/pro/CountdownExtractor.ts (target date, format)
- [ ] T073 [P] [US4] Implement AnimatedHeadlineExtractor in extractors/elementor/src/extractors/pro/AnimatedHeadlineExtractor.ts (animation style, rotating text)
- [ ] T074 [P] [US4] Implement LoginExtractor in extractors/elementor/src/extractors/pro/LoginExtractor.ts (login/register forms, redirect URLs)
- [ ] T075 [P] [US4] Implement MenuAnchorExtractor in extractors/elementor/src/extractors/pro/MenuAnchorExtractor.ts (anchor IDs, scroll settings)
- [ ] T076 [P] [US4] Implement SitemapExtractor in extractors/elementor/src/extractors/pro/SitemapExtractor.ts (taxonomy, depth, order)
- [ ] T077 [US4] Register all Pro widget extractors in WidgetRegistry
- [ ] T078 [US4] Add Pro widget detection flag to extraction report (indicates if Pro installed)
- [ ] T079 [US4] Test Pro widget extraction with sample Pro pages, verify specific settings in output/extractions/

**Checkpoint**: All user stories should now be independently functional. Complete Free + Pro widget coverage.

---

## Phase 7: Additional Connectors & Validation

**Purpose**: Add alternative WordPress connectors and data validation for production readiness

- [ ] T080 [P] Implement WpCliConnector in extractors/elementor/src/connectors/WpCliConnector.ts (executes wp-cli commands)
- [ ] T081 [P] Implement DatabaseConnector in extractors/elementor/src/connectors/DatabaseConnector.ts (direct MySQL queries using mysql2)
- [ ] T082 Implement connector factory in extractors/elementor/src/connectors/index.ts (selects connector based on --connector flag)
- [ ] T083 [P] Implement SchemaValidator in extractors/elementor/src/validators/SchemaValidator.ts (validates extracted data against Zod schemas)
- [ ] T084 [P] Implement CompletenessValidator in extractors/elementor/src/validators/CompletenessValidator.ts (checks for missing required fields)
- [ ] T085 Integrate validation into ExtractionEngine (runs after extraction, before output)
- [ ] T086 Add --validate flag to CLI extract command (default: true)
- [ ] T087 Implement CLI validate command in extractors/elementor/src/cli/commands/validate.ts (validates existing JSON file)
- [ ] T088 Test validation with incomplete/malformed extraction data, verify error detection

---

## Phase 8: Reporting & Observability

**Purpose**: Implement quality reporting and detailed logging per Constitution Principle VII

- [ ] T089 [P] Implement MarkdownReporter in extractors/elementor/src/reporters/MarkdownReporter.ts (generates extraction-report.md in output/extractions/)
- [ ] T090 Implement extraction statistics tracking in ExtractionEngine (widget counts, duration, success rate)
- [ ] T091 Implement failure tracking in ExtractionEngine (failed widgets with error details)
- [ ] T092 Generate ExtractionReport entity after extraction completes
- [ ] T093 Write ExtractionReport to JSON output file
- [ ] T094 Write Markdown report using MarkdownReporter (includes summary, statistics, failures)
- [ ] T095 Add --report flag to CLI extract command (specifies Markdown report output path)
- [ ] T096 Add --verbose flag to CLI for detailed console logging
- [ ] T097 Test reporting with complex extraction (50+ widgets), verify report accuracy in output/extractions/

---

## Phase 9: CLI Enhancements

**Purpose**: Complete CLI features for production use

- [ ] T098 [P] Implement CLI list-widgets command in extractors/elementor/src/cli/commands/list-widgets.ts (shows supported widget types)
- [ ] T099 [P] Implement CLI config command in extractors/elementor/src/cli/commands/config.ts (manages .elementor-extractor.json)
- [ ] T100 Add --pages flag to extract command (filter specific pages by ID or slug)
- [ ] T101 Add --include-drafts flag to extract command (include unpublished pages)
- [ ] T102 Add --batch-size flag to extract command (widget batch size for memory management)
- [ ] T103 Add --timeout flag to extract command (request timeout in milliseconds)
- [ ] T104 Add --fail-fast flag to extract command (stop on first widget failure)
- [ ] T105 Implement environment variable support (ELEMENTOR_EXTRACTOR_* vars)
- [ ] T106 Implement .elementor-extractor.json config file loading in Config.ts
- [ ] T107 Add CLI help text and examples for all commands
- [ ] T108 Add version command (--version or -V flag)

---

## Phase 10: Performance Optimization

**Purpose**: Ensure performance targets met (100 widgets <30s, 200+ widgets no timeout)

- [ ] T109 Implement streaming extraction with async generators in ExtractionEngine (process widgets in batches)
- [ ] T110 Add memory profiling to track memory usage during large page extraction
- [ ] T111 Implement widget batch processing (default 50 widgets per batch)
- [ ] T112 Add progress indicator to CLI extraction (progress bar showing X/Y widgets)
- [ ] T113 Optimize PHP unserialization for large data structures
- [ ] T114 Add timeout handling for individual widget extraction (prevent single widget from blocking)
- [ ] T115 Test extraction with 200+ widget page, verify completion time and memory usage

---

## Phase 11: Testing & Quality Assurance

**Purpose**: Ensure 80% test coverage and production readiness

- [ ] T116 [P] Create unit tests for PhpSerializeParser in extractors/elementor/tests/unit/parsers/PhpSerializeParser.test.ts
- [ ] T117 [P] Create unit tests for ElementorDataParser in extractors/elementor/tests/unit/parsers/ElementorDataParser.test.ts
- [ ] T118 [P] Create unit tests for StyleParser in extractors/elementor/tests/unit/parsers/StyleParser.test.ts
- [ ] T119 [P] Create unit tests for HeadingExtractor in extractors/elementor/tests/unit/extractors/HeadingExtractor.test.ts
- [ ] T120 [P] Create unit tests for SchemaValidator in extractors/elementor/tests/unit/validators/SchemaValidator.test.ts
- [ ] T121 [P] Create integration test fixtures (sample WordPress Elementor data) in extractors/elementor/tests/integration/fixtures/
- [ ] T122 Create integration test for basic widget extraction in extractors/elementor/tests/integration/scenarios/basic-extraction.test.ts
- [ ] T123 Create integration test for styled widget extraction in extractors/elementor/tests/integration/scenarios/styled-extraction.test.ts
- [ ] T124 Create integration test for Pro widget extraction in extractors/elementor/tests/integration/scenarios/pro-extraction.test.ts
- [ ] T125 Create contract test for JSON output schema in extractors/elementor/tests/contract/output-schema.test.ts
- [ ] T126 Run test coverage report, ensure >=80% coverage (npm run test:coverage)
- [ ] T127 Fix any failing tests or coverage gaps

---

## Phase 12: Polish & Cross-Cutting Concerns

**Purpose**: Final improvements affecting multiple user stories

- [ ] T128 [P] Add TypeScript type exports to main index.ts
- [ ] T129 [P] Add JSDoc comments to all public APIs
- [ ] T130 Update README.md with installation, usage examples, and feature list
- [ ] T131 Create CHANGELOG.md documenting v1.0.0 features
- [ ] T132 Add error handling for common failure scenarios (connection errors, auth failures, invalid data)
- [ ] T133 Add user-friendly error messages to CLI (suggestions for fixing common issues)
- [ ] T134 Build project and verify CLI works (npm run build && elementor-extractor --help)
- [ ] T135 Create example extraction output in output/extractions/examples/ for documentation
- [ ] T136 Run linting and formatting (npm run lint && npm run format)
- [ ] T137 Perform security audit (npm audit)
- [ ] T138 Test CLI against live WordPress demo site (e.g., demo.elementor.com)
- [ ] T139 Verify all success criteria met (SC-001 through SC-010 from spec.md)
- [ ] T140 Run quickstart.md validation steps to ensure documentation is accurate

---

## Dependencies & Execution Order

### Phase Dependencies

- **Setup (Phase 1)**: ✅ COMPLETE - No dependencies
- **Foundational (Phase 2)**: Depends on Setup completion - BLOCKS all user stories
- **User Story 1 (Phase 3)**: Depends on Foundational (Phase 2) - MVP baseline
- **User Story 2 (Phase 4)**: Can start after Foundational (Phase 2) - Independent from US1 but builds on it
- **User Story 3 (Phase 5)**: Can start after Foundational (Phase 2) - Independent but builds on US1/US2
- **User Story 4 (Phase 6)**: Can start after Foundational (Phase 2) - Independent but requires US1 foundation
- **Additional Connectors (Phase 7)**: Depends on Foundational + US1 (needs basic extraction working)
- **Reporting (Phase 8)**: Depends on Foundational + US1 (needs extraction data to report on)
- **CLI Enhancements (Phase 9)**: Depends on Foundational + US1 (extends basic CLI)
- **Performance (Phase 10)**: Depends on US1-US4 complete (optimizes existing functionality)
- **Testing (Phase 11)**: Can run in parallel with implementation (write tests as features complete)
- **Polish (Phase 12)**: Depends on all features complete

### User Story Dependencies

- **User Story 1 (P1 - MVP)**: Can start after Foundational (Phase 2) - No dependencies on other stories
- **User Story 2 (P2)**: Can start after Foundational (Phase 2) - Builds on US1's widget extraction
- **User Story 3 (P3)**: Can start after Foundational (Phase 2) - Extends US1/US2 with advanced settings
- **User Story 4 (P4)**: Can start after Foundational (Phase 2) - Uses same patterns as US1 for different widgets

### Parallel Opportunities

- **Foundational**: T008-T016 (model interfaces) can all run in parallel
- **User Story 1**: T028-T037 (widget extractors) can all run in parallel
- **User Story 2**: T048-T054 (style parsing) can run in parallel
- **User Story 3**: T060-T063 (advanced settings) can run in parallel
- **User Story 4**: T067-T076 (Pro extractors) can all run in parallel
- **Testing**: T116-T120 (unit tests) can all run in parallel

---

## Implementation Strategy

### MVP First (User Story 1 Only)

1. Complete Phase 1: Setup ✅ DONE
2. Complete Phase 2: Foundational (CRITICAL - blocks all stories)
3. Complete Phase 3: User Story 1 (Basic Widget Extraction)
4. **STOP and VALIDATE**: Test extraction with sample page
5. Output JSON to `output/extractions/test-site.json`
6. Deploy/demo if ready

**Estimated Time**: 4-8 developer days for MVP

### Incremental Delivery

1. Complete Setup + Foundational → Foundation ready
2. Add User Story 1 → Test independently → Output to `output/extractions/` (MVP!)
3. Add User Story 2 → Test independently → Enhanced visual fidelity
4. Add User Story 3 → Test independently → Dynamic behaviors
5. Add User Story 4 → Test independently → Complete Pro coverage
6. Each story adds value without breaking previous stories

### Parallel Team Strategy

With multiple developers:

1. Team completes Setup + Foundational together
2. Once Foundational is done:
   - Developer A: User Story 1 (basic extraction)
   - Developer B: User Story 2 (styling) + Parsers
   - Developer C: Connectors (WP-CLI, Database)
3. Stories complete and integrate independently

---

## Output Structure

All extracted data and reports go to `output/extractions/`:

```
output/
└── extractions/
    ├── site-name.json                    # Main extraction output
    ├── site-name-report.md               # Extraction report
    ├── examples/                         # Example outputs for documentation
    │   ├── basic-page.json
    │   ├── styled-page.json
    │   └── pro-widgets.json
    └── .gitkeep                          # Keep directory in git
```

**Note**: `output/` directory is added to `.gitignore` to keep extracted data separate from source control.

---

## Notes

- [P] tasks = different files, no dependencies, can run in parallel
- [Story] label maps task to specific user story for traceability
- Each user story should be independently completable and testable
- Commit after each task or logical group
- Stop at any checkpoint to validate story independently
- Total tasks: 140 (7 complete, 133 remaining)
- MVP tasks: T001-T047 (47 tasks, 7 complete = 40 remaining for MVP)

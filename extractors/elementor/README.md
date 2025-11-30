# Elementor Page Builder Extractor

Extract Elementor page builder data from WordPress sites for conversion to Next.js.

## Installation

```bash
npm install -g @barbuda/elementor-extractor
```

## Quick Start

```bash
# Extract from WordPress site
elementor-extractor extract --url https://your-site.com --output site.json

# Validate extracted data
elementor-extractor validate --input site.json
```

## Documentation

- **[Quickstart Guide](../../specs/001-elementor-extractor/quickstart.md)** - Get started in 5 minutes
- **[CLI Reference](../../specs/001-elementor-extractor/contracts/cli-interface.md)** - Complete CLI documentation
- **[Data Model](../../specs/001-elementor-extractor/data-model.md)** - TypeScript interfaces and schemas
- **[Implementation Plan](../../specs/001-elementor-extractor/plan.md)** - Architecture and design decisions

## Development

```bash
# Install dependencies
npm install

# Build
npm run build

# Run tests
npm test

# Watch mode for development
npm run dev
```

## Features

- ✅ Extract all Elementor widget types (Free & Pro)
- ✅ Capture complete styling (colors, typography, spacing, responsive)
- ✅ Extract animations and advanced settings
- ✅ Multiple WordPress connectors (REST API, WP-CLI, MySQL)
- ✅ Schema validation with Zod
- ✅ Detailed extraction reports (JSON + Markdown)
- ✅ Handles large pages (200+ widgets) efficiently
- ✅ Continue-on-error with failure logging

## Architecture

Built following the Barbuda WordPress-to-Next.js Conversion Constitution:

- **Deterministic**: Same input always produces same output
- **Comprehensive**: Captures all Elementor data for pixel-perfect reconstruction
- **Modular**: Extensible widget extractors and pluggable connectors
- **Observable**: Detailed logs and quality reports

## License

MIT

## Project Status

**Branch**: `001-elementor-extractor`
**Status**: 🚧 In Development

See [spec.md](../../specs/001-elementor-extractor/spec.md) for requirements and [plan.md](../../specs/001-elementor-extractor/plan.md) for implementation details.

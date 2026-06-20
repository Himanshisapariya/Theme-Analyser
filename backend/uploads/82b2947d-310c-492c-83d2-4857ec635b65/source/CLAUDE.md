# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Development

```bash
# Start local development server
shopify theme dev --store xx-xy-athletics
```

No build step is required — this is a pure Shopify theme with Liquid templates, CSS, and vanilla JavaScript.

## Architecture Overview

This is a Shopify theme for **XX-XY Athletics** (`xx-xy-athletics.myshopify.com`), built on the **Monaco v1.0.4** base theme (by Apparent Collective).

### Directory Structure

| Directory | Purpose |
|-----------|---------|
| `layout/` | Top-level HTML wrappers (`theme.liquid` is the main one) |
| `sections/` | Merchant-configurable page building blocks |
| `snippets/` | Reusable partials rendered via `{% render %}` |
| `blocks/` | Block components used within sections |
| `templates/` | Page routing via JSON files that assign sections |
| `assets/` | CSS, JS, and SVG files |
| `config/` | `settings_schema.json` (merchant UI), `settings_data.json` (saved values) |
| `locales/` | 30+ language translation files |

### Routing

Templates in `templates/` control routing. Variant templates follow the pattern `{type}.{handle}.json` (e.g., `collection.outlet.json`, `product.egift-card.json`). Pages use `page.{handle}.json`.

### JavaScript Architecture

- **Vanilla JS only** — no frameworks
- **Web Components** extend `HTMLElement` (e.g., `<product-form>`, `<cart-drawer>`)
- **PubSub event system** in `assets/pubsub.js` — events like `cartUpdate`, `variantChange`, `cartError` coordinate between components
- Scripts are loaded with `defer` in `layout/theme.liquid`

### Styling

- Component-scoped CSS using `component-*.css` naming convention
- **BEM naming** for HTML classes (e.g., `.drawer__inner`, `.modal__close-button`)
- CSS custom properties for theming (fonts, colors, spacing) defined in `layout/theme.liquid`
- Primary color: `#3db671` (green), Accent: `#2f484c` (dark teal), Background: `#f7f7f7` (light) / `#272527` (dark)

### Key Features

- **Cart**: Drawer UI, upsell, free shipping progress bar (threshold: $100 US / $200 CA)
- **Products**: Quick add, variant switching, compare, bundle builder
- **Search**: Predictive search with AJAX
- **Commerce**: Gift with purchase (GWP), multi-region market config
- **Dark mode**: Toggle via `config/settings_data.json`

### Shopify-Specific Conventions

- Settings defined in `config/settings_schema.json` appear as merchant-editable controls in the Shopify admin
- Asset URLs are generated via Liquid filters: `{{ 'file.css' | asset_url }}`
- Section re-rendering uses `fetch` against Shopify's section rendering API
- Custom metafields are defined in `.shopify/metafields.json` (articles have URL, mobile image, and summary fields)

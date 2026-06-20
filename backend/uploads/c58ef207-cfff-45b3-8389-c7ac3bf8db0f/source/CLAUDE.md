# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

---

## Store & Dev Command

- Store: `xx-xy-athletics.myshopify.com` (XX-XY Athletics)
- Theme base: Monaco v1.0.4 (Dawn-derived)

```bash
shopify theme dev --store xx-xy-athletics.myshopify.com --theme-editor-sync
```

No build step — pure Liquid/CSS/JS via Shopify CLI.

---

## Architecture Overview

Production Shopify theme — 136 sections, 139 snippets, 204 assets, 63 templates.

### Key Entry Points

| File | Purpose |
|------|---------|
| `layout/theme.liquid` | Root layout — loads global CSS/JS |
| `assets/custom.css` | All custom styles and extra-class overrides |
| `assets/global.js` + `assets/custom.js` | Theme init, Swiper configs, page detection |
| `assets/pubsub.js` | Event bus used across sections (cart, product events) |
| `config/settings_schema.json` | Theme-level customizer settings |

### JS Patterns

Scripts in `assets/` — no bundler, loaded independently.

- `cart-drawer.js` + `cart.js` — cart state
- `predictive-search.js` — search suggestions
- `facets.js` / `collection-filters-form.js` — collection filtering
- Third-party (loaded from assets, not CDN): jQuery 3.6.0, GSAP, Swiper

### CSS Layers

- `base.css` — ALL typography (sizes, weights) — never override
- `custom.css` — all custom styles go here
- Color: always `rgba(var(--color-foreground))`
- Naming: BEM throughout — `.block__element--modifier`
- For media queries use mobile first approach


---

## Core Principles

> Write code as if it will be used in a **high-traffic production store** — performance, scalability, maintainability first.
> If anything can be done with liquid and css do not use JS unless necessary

---

## Sections — New Section Checklist

Every new section must follow this checklist:

### 1. No CLS (Cumulative Layout Shift)

CLS is caused by content shifting after load. Prevent it:

- **Always set explicit `width` and `height` on every `<img>`** — never omit these
- **Reserve space for lazy-loaded images** with `aspect-ratio` in CSS instead of letting height be 0
- **No JS-injected layout changes** after page paint (no class toggling that shifts layout)
- **Fonts:** use `font-display: swap` is already set — do not override; avoid FOUT by not swapping heading fonts mid-render
- **No dynamic content that changes height** after Liquid renders (e.g., no JS that appends content into a fixed-height container)
- **Carousels/sliders:** set a fixed height or `aspect-ratio` on the track container so slides don't cause reflow

```liquid
{{- image | image_url: width: 800 -}}
<img
  src="{{ image | image_url: width: 800 }}"
  srcset="
    {{ image | image_url: width: 400 }} 400w,
    {{ image | image_url: width: 800 }} 800w,
    {{ image | image_url: width: 1200 }} 1200w
  "
  width="{{ image.width }}"
  height="{{ image.height }}"
  alt="{{ image.alt | escape }}"
  loading="lazy"
>
```

```css
/* Reserve image space — prevents CLS */
.my-section__image-wrap {
  aspect-ratio: 16 / 9;
  overflow: hidden;
}
.my-section__image-wrap img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}
```

### 2. Schema

- All settings in schema — never hardcode values
- Always include `extra_class` field:

```json
{
  "type": "text",
  "id": "extra_class",
  "label": "Extra Class",
  "info": "Add custom CSS classes to the section wrapper"
}
```

```liquid
<section class="my-section {{ section.settings.extra_class }}">
```

- Use blocks for repeatable content
- Always add a `presets` entry so it appears in Theme Editor

## Liquid Coding Standards
 
- Use Shopify native objects and correct Liquid filters
- Use `assign` variables for readability
- Avoid unnecessary nested loops and performance-heavy logic
- Handle edge cases: empty collections, missing metafields, null values

- Blank-check every setting before rendering:

```liquid
{% if section.settings.heading != blank %}
  <h2>{{ section.settings.heading }}</h2>
{% endif %}
```

## Metafields & Metaobjects
 
Always prefer metafields/metaobjects over hardcoded content.

---

## Use Existing Snippets

Check `snippets/` before writing any new component. Never duplicate what exists.

| Need | Snippet |
|------|---------|
| Product card | `product-card-extended.liquid` or `product-card-horizontal.liquid` |
| Product image/thumb | `product-thumbnail.liquid` |
| Article preview | `article-card-small.liquid` |
| Pagination | `pagination.liquid` |
| Load more / infinite scroll | `load-more.liquid` / `infinite-scroll.liquid` |
| Icons | `icon-*.liquid` (arrow, caret, close, star, etc.) |
| Price display | `price.liquid` |
| Breadcrumbs | `bread-ctm.liquid` |

```liquid
{%- render 'product-card-extended', product: product, section: section -%}
{%- render 'pagination', paginate: paginate -%}
{%- render 'icon-arrow' -%}
```

---

## Custom CSS

All custom styles — including `extra_class` overrides — go in **`assets/custom.css`** only.

- Never add custom styles to `base.css` or section files
- Scope to extra class to prevent bleed:

```css
.my-extra-class { }
.my-extra-class .product-card__title { }
```

`custom.css` is already loaded in `layout/theme.liquid`.

---

## JavaScript Guidelines

- Minimal, modular JS only
- No unnecessary event listeners or DOM manipulation
- Use `pubsub.js` event bus for cross-section communicat
- Prefer `document.addEventListener('DOMContentLoaded', ...)` pattern
- Use `data-*` attributes to bind JS to HTML elements
- Avoid blocking scripts — use `defer` or `async`
- Keep JS in separate `.js` section files or `assets/` folder

---

## Naming Conventions

- CSS: BEM — `.card-product__title`, `.card-product--featured`
- Snippets: `card-product.liquid`, `icon-arrow.liquid`
- Sections: `featured-collection.liquid`
- Schema IDs: snake_case — `"id": "button_label"`

---

## SEO & Accessibility

- Heading hierarchy: `h1 → h2 → h3` — never skip levels
- Meaningful `alt` on all images
- ARIA attributes where needed
- Mobile-first layout


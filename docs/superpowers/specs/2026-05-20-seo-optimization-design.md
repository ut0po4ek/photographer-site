# SEO Optimization — All 4 Projects

**Date:** 2026-05-20
**Scope:** restaurant-site, flovers-site, form-light-site, astro-business-starter

---

## Goal

Fix all identified SEO issues across 4 projects: robots.txt, og-image, favicon, homepage meta, siteConfig normalization, JSON-LD structured data. No visual design changes.

---

## Current State Audit

| Issue | restaurant-site | flovers-site | form-light-site | astro-business-starter |
|---|---|---|---|---|
| robots.txt wrong domain (formandlight.ru) | ✗ broken | ✗ broken | ✓ correct | ✗ broken |
| og-image.jpg missing from public/ | ✗ missing | ✗ missing | ✗ missing | ✗ missing |
| Homepage title/description not passed | ✗ empty | ✓ ok | ✓ ok | ✗ empty (index.astro) |
| siteConfig lacks locale/ogLocale/url/seo | ✓ ok | ✓ ok | ✗ incomplete | ✓ ok |
| favicon.ico missing | ✗ missing | ✓ exists | ✓ exists | ✓ exists |
| JSON-LD structured data | ✗ none | ✗ none | ✗ none | ✗ none |
| astro.config.mjs site URL placeholder | ✗ example.com sub | ✗ example.com | ✓ real domain | ✗ example.com |
| BaseLayout uses hardcoded values | ✓ siteConfig | ✓ siteConfig | ✗ hardcoded | ✓ siteConfig |

---

## Phase 1: Technical Fixes

### 1.1 robots.txt

**restaurant-site** — replace with:
```
User-agent: *
Allow: /

Sitemap: https://piccolino.example.com/sitemap-index.xml
```

**flovers-site** — replace with:
```
User-agent: *
Allow: /

Sitemap: https://flovers.example.com/sitemap-index.xml
```

**astro-business-starter** — replace with:
```
User-agent: *
Allow: /

Sitemap: https://example.com/sitemap-index.xml
```

**form-light-site** — already correct (`https://formandlight.ru/sitemap.xml`). No change.
Note: `sitemap-index.xml` is the filename Astro generates (not `sitemap.xml`). form-light currently uses `sitemap.xml` — correct to `sitemap-index.xml` too.

### 1.2 og-image.jpg

No external fetch. Use best available local photo in each project, copied to `public/og-image.jpg`.

All projects get a local `public/og-image.jpg`. External Unsplash URLs are unreliable for OG caching by social networks.

| Project | Strategy |
|---|---|
| restaurant-site | Copy `src/assets/photos/home-hero-restaurant.jpg` → `public/og-image.jpg` using Bash |
| flovers-site | No local raster photos. Download the hero Unsplash image used in Hero.astro and save as `public/og-image.jpg` via `curl` |
| form-light-site | Download the Unsplash image currently hardcoded as ogImage default in BaseLayout and save as `public/og-image.jpg` via `curl` |
| astro-business-starter | Create a minimal 1200×630 neutral SVG saved as `public/og-image.svg`, **and** use ImageMagick/`convert` or node canvas if available to produce a JPG. If no tool available, copy restaurant-site's hero as a neutral fallback. siteConfig.seo.ogImage = `'/og-image.jpg'` |

After copying/downloading: all four `siteConfig.seo.ogImage` values point to `'/og-image.jpg'`.

After copying: update `siteConfig.seo.ogImage` (or equivalent) to `'/og-image.jpg'` in every project.

### 1.3 restaurant-site homepage title/description

In `src/pages/index.astro`, change:
```astro
<BaseLayout>
```
To:
```astro
<BaseLayout
  title="PICCOLINO — итальянский ресторан авторской кухни"
  description="Итальянский ресторан PICCOLINO: паста ручной работы, открытый огонь, винная карта, камерный интерьер и бронирование столов."
>
```

### 1.4 astro-business-starter homepage title/description

Check `src/pages/index.astro` — if `<BaseLayout>` is called without title/description, add them using `siteConfig`:
```astro
<BaseLayout
  title={`${siteConfig.name} — ${siteConfig.description}`}
  description={siteConfig.description}
>
```

### 1.5 siteConfig normalization — form-light-site

Add missing fields to `src/config/site.ts`:
```typescript
export const siteConfig = {
  name: 'FORM & LIGHT',
  description: 'Студия архитектуры и дизайна интерьеров',
  locale: 'ru',
  ogLocale: 'ru_RU',
  url: 'https://formandlight.ru',
  // ...existing contacts, forms, footer...
  seo: {
    ogImage: '/og-image.jpg',
  },
} as const;
```

Update `src/layouts/BaseLayout.astro` to use siteConfig instead of hardcoded values:
- `import { siteConfig } from '../config/site';`
- Replace hardcoded `title`, `description`, `ogImage` defaults with `siteConfig.*`
- Replace hardcoded `lang="ru"` with `lang={siteConfig.locale}`
- Replace hardcoded `content="ru_RU"` with `content={siteConfig.ogLocale}`
- Replace hardcoded `content="FORM & LIGHT"` (og:site_name) with `content={siteConfig.name}`

### 1.6 favicon.ico — restaurant-site

restaurant-site has only `favicon.svg`. Add `favicon.ico` by copying from one of the other projects (they all have the same generic favicon). The layout already references `/favicon.svg` — no layout change needed.
Also add `<link rel="icon" href="/favicon.ico" sizes="any" />` to BaseLayout for browser fallback compatibility.

### 1.7 astro.config.mjs site URL

**flovers-site**: change `site` to `'https://flovers.example.com'` (matching robots.txt and siteConfig.url).
**astro-business-starter**: keep `'https://example.com'` — this is intentional for a starter template.
**restaurant-site**: already `'https://piccolino.example.com'` — matches siteConfig. No change.

---

## Phase 2: JSON-LD Structured Data

### 2.1 BaseLayout changes (all 4 projects)

Add `jsonLd` prop to every `BaseLayout.astro`:

```typescript
interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
  canonical?: string;
  jsonLd?: object | object[];
}
const { ..., jsonLd } = Astro.props;
```

In `<head>`, after the Twitter Card block:
```astro
{jsonLd && (
  <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
)}
```

### 2.2 JSON-LD per project

**restaurant-site** — type `Restaurant`

Object to pass from `src/pages/index.astro`:
```javascript
{
  "@context": "https://schema.org",
  "@type": "Restaurant",
  "name": siteConfig.name,
  "description": siteConfig.description,
  "url": siteConfig.url,
  "image": `${siteConfig.url}/og-image.jpg`,
  "telephone": siteConfig.contacts.phone,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": siteConfig.contacts.address,
    "addressLocality": "Москва",
    "addressCountry": "RU"
  },
  "servesCuisine": "Italian",
  "priceRange": "₽₽₽",
  "openingHours": "Mo-Su 12:00-00:00",
  "sameAs": []
}
```

Also add `og:type: "restaurant.restaurant"` to menu page (keep `website` on homepage).

**flovers-site** — type `Florist`

```javascript
{
  "@context": "https://schema.org",
  "@type": "Florist",
  "name": siteConfig.name,
  "description": siteConfig.description,
  "url": siteConfig.url,
  "image": `${siteConfig.url}/og-image.jpg`,
  "telephone": siteConfig.contacts.phone,
  "address": {
    "@type": "PostalAddress",
    "streetAddress": siteConfig.contacts.address,
    "addressLocality": "Москва",
    "addressCountry": "RU"
  },
  "sameAs": [
    siteConfig.contacts.instagram,
    siteConfig.contacts.vk
  ].filter(v => v && !v.includes('about:blank'))
}
```

**form-light-site** — type `ProfessionalService`

```javascript
{
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": siteConfig.name,
  "description": siteConfig.description,
  "url": siteConfig.url,
  "image": `${siteConfig.url}/og-image.jpg`,
  "telephone": siteConfig.contacts.phone,
  "email": siteConfig.contacts.email,
  "address": {
    "@type": "PostalAddress",
    "addressLocality": "Москва",
    "addressCountry": "RU"
  },
  "sameAs": []
}
```

**astro-business-starter** — type `Organization`

```javascript
{
  "@context": "https://schema.org",
  "@type": "Organization",
  "name": siteConfig.name,
  "description": siteConfig.description,
  "url": siteConfig.url,
  "image": `${siteConfig.url}/og-image.jpg`,
  "contactPoint": {
    "@type": "ContactPoint",
    "telephone": siteConfig.contacts.phone,
    "email": siteConfig.contacts.email,
    "contactType": "customer service"
  }
}
```

JSON-LD is passed only from `index.astro` in each project (homepage). Inner pages do not get JSON-LD in this iteration.

---

## Phase 3: Verification

After all changes in each project:

```bash
npm run check   # 0 errors expected
npm run build   # build succeeds
grep -Rni "formandlight.ru" public src astro.config.mjs  # 0 matches in non-form-light projects
ls public/og-image.jpg   # exists
ls public/favicon.ico    # exists (restaurant-site)
cat public/robots.txt    # correct Sitemap URL
```

---

## Out of Scope

- Inner-page JSON-LD (catalog items, project pages) — separate task
- Performance / Core Web Vitals
- Google Search Console setup
- Social media preview testing
- Any visual design changes
- og:type per-page (only `website` used globally)

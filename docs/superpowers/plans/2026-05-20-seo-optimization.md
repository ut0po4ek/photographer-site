# SEO Optimization Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Fix all SEO issues across 4 projects: robots.txt, og-image, favicon, homepage meta tags, siteConfig normalization, and JSON-LD structured data.

**Architecture:** Each project is worked independently with a full verify checkpoint (check + build + grep) after each one. No changes touch visual design, styles, animations, or page content. All changes are in `<head>` meta, `public/` assets, `src/config/site.ts`, and `src/layouts/BaseLayout.astro`.

**Tech Stack:** Astro 6, TypeScript, `src/config/site.ts` pattern, JSON-LD via `set:html`, `curl` for image download, `cp` for file copy.

**Do NOT push** until the user explicitly confirms.

---

## File Map

### restaurant-site (`/Users/utopo4ek/Projects/Portfolio land/restaurant-site`)
- Modify: `public/robots.txt`
- Create: `public/og-image.jpg` (copy from `src/assets/photos/home-hero-restaurant.jpg`)
- Create: `public/favicon.ico` (copy from flovers-site)
- Modify: `src/layouts/BaseLayout.astro` — add `jsonLd` prop + favicon.ico link
- Modify: `src/pages/index.astro` — add title + description + jsonLd

### flovers-site (`/Users/utopo4ek/Projects/Portfolio land/flovers-site`)
- Modify: `public/robots.txt`
- Create: `public/og-image.jpg` (download from Unsplash via curl)
- Modify: `src/layouts/BaseLayout.astro` — add `jsonLd` prop
- Modify: `src/pages/index.astro` — add jsonLd

### form-light-site (`/Users/utopo4ek/Projects/Portfolio land/form-light-site`)
- Modify: `public/robots.txt` — fix sitemap filename to `sitemap-index.xml`
- Create: `public/og-image.jpg` (download from Unsplash via curl)
- Modify: `src/config/site.ts` — add locale, ogLocale, url, seo fields
- Modify: `src/layouts/BaseLayout.astro` — replace hardcoded values with siteConfig + add jsonLd prop
- Modify: `src/pages/index.astro` — add jsonLd

### astro-business-starter (`/Users/utopo4ek/Projects/Portfolio land/astro-business-starter`)
- Modify: `public/robots.txt`
- Create: `public/og-image.jpg` (copy from restaurant-site as neutral fallback)
- Modify: `src/layouts/BaseLayout.astro` — add `jsonLd` prop
- Modify: `src/pages/index.astro` — add title + description + jsonLd

---

## PROJECT 1: restaurant-site

Working directory for all steps: `/Users/utopo4ek/Projects/Portfolio land/restaurant-site`

---

### Task 1.1: Fix robots.txt

**Files:**
- Modify: `public/robots.txt`

- [ ] **Step 1: Replace robots.txt content**

Write this exact content to `public/robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://piccolino.example.com/sitemap-index.xml
```

- [ ] **Step 2: Verify**

```bash
cat "public/robots.txt"
```

Expected:
```
User-agent: *
Allow: /

Sitemap: https://piccolino.example.com/sitemap-index.xml
```

- [ ] **Step 3: Commit**

```bash
git -C "/Users/utopo4ek/Projects/Portfolio land/restaurant-site" add public/robots.txt
git -C "/Users/utopo4ek/Projects/Portfolio land/restaurant-site" commit -m "fix: correct robots.txt sitemap URL for restaurant-site"
```

---

### Task 1.2: Add og-image.jpg and favicon.ico

**Files:**
- Create: `public/og-image.jpg`
- Create: `public/favicon.ico`

- [ ] **Step 1: Copy hero photo as og-image**

```bash
cp "/Users/utopo4ek/Projects/Portfolio land/restaurant-site/src/assets/photos/home-hero-restaurant.jpg" \
   "/Users/utopo4ek/Projects/Portfolio land/restaurant-site/public/og-image.jpg"
```

- [ ] **Step 2: Copy favicon.ico from flovers-site**

```bash
cp "/Users/utopo4ek/Projects/Portfolio land/flovers-site/public/favicon.ico" \
   "/Users/utopo4ek/Projects/Portfolio land/restaurant-site/public/favicon.ico"
```

- [ ] **Step 3: Verify both files exist**

```bash
ls -lh "/Users/utopo4ek/Projects/Portfolio land/restaurant-site/public/og-image.jpg" \
       "/Users/utopo4ek/Projects/Portfolio land/restaurant-site/public/favicon.ico"
```

Expected: both files listed with non-zero sizes.

- [ ] **Step 4: Commit**

```bash
git -C "/Users/utopo4ek/Projects/Portfolio land/restaurant-site" add public/og-image.jpg public/favicon.ico
git -C "/Users/utopo4ek/Projects/Portfolio land/restaurant-site" commit -m "feat: add og-image.jpg and favicon.ico"
```

---

### Task 1.3: Add favicon.ico link and jsonLd prop to BaseLayout

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Read the current Props interface**

```bash
sed -n '6,22p' "/Users/utopo4ek/Projects/Portfolio land/restaurant-site/src/layouts/BaseLayout.astro"
```

Expected output (current state):
```astro
interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
  canonical?: string;
}

const {
  title = `${siteConfig.name} — ${siteConfig.description}`,
  description = siteConfig.description,
  ogImage = siteConfig.seo.ogImage,
  canonical = Astro.url.href,
} = Astro.props;
```

- [ ] **Step 2: Replace Props interface and destructuring**

Replace the block starting with `interface Props {` through `} = Astro.props;` with:

```astro
interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
  canonical?: string;
  jsonLd?: object | object[];
}

const {
  title = `${siteConfig.name} — ${siteConfig.description}`,
  description = siteConfig.description,
  ogImage = siteConfig.seo.ogImage,
  canonical = Astro.url.href,
  jsonLd,
} = Astro.props;
```

- [ ] **Step 3: Add favicon.ico link and JSON-LD script in `<head>`**

Find the existing favicon link:
```astro
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
```

Replace with:
```astro
    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
    <link rel="icon" href="/favicon.ico" sizes="any" />

    <!-- Structured Data -->
    {jsonLd && (
      <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
    )}
```

- [ ] **Step 4: Run type check**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/restaurant-site" && npm run check
```

Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git -C "/Users/utopo4ek/Projects/Portfolio land/restaurant-site" add src/layouts/BaseLayout.astro
git -C "/Users/utopo4ek/Projects/Portfolio land/restaurant-site" commit -m "feat: add jsonLd prop and favicon.ico link to BaseLayout"
```

---

### Task 1.4: Add title, description and JSON-LD to homepage

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Read current index.astro frontmatter**

```bash
head -25 "/Users/utopo4ek/Projects/Portfolio land/restaurant-site/src/pages/index.astro"
```

- [ ] **Step 2: Add siteConfig import and jsonLd constant to frontmatter**

The frontmatter currently imports components only. Add after the last `import` line and before the closing `---`:

```astro
import { siteConfig } from '../config/site';

const jsonLd = {
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
  "openingHours": "Mo-Su 12:00-00:00"
};
```

- [ ] **Step 3: Update BaseLayout call**

Replace:
```astro
<BaseLayout>
```

With:
```astro
<BaseLayout
  title="PICCOLINO — итальянский ресторан авторской кухни"
  description="Итальянский ресторан PICCOLINO: паста ручной работы, открытый огонь, винная карта, камерный интерьер и бронирование столов."
  jsonLd={jsonLd}
>
```

- [ ] **Step 4: Run type check**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/restaurant-site" && npm run check
```

Expected: 0 errors.

- [ ] **Step 5: Commit**

```bash
git -C "/Users/utopo4ek/Projects/Portfolio land/restaurant-site" add src/pages/index.astro
git -C "/Users/utopo4ek/Projects/Portfolio land/restaurant-site" commit -m "feat: add homepage title, description and Restaurant JSON-LD"
```

---

### Task 1.5: Verify restaurant-site ✓

- [ ] **Step 1: Build**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/restaurant-site" && npm run build
```

Expected: build succeeds, 0 errors.

- [ ] **Step 2: Grep for formandlight.ru**

```bash
grep -Rni "formandlight.ru" \
  "/Users/utopo4ek/Projects/Portfolio land/restaurant-site/public" \
  "/Users/utopo4ek/Projects/Portfolio land/restaurant-site/src" \
  "/Users/utopo4ek/Projects/Portfolio land/restaurant-site/astro.config.mjs"
```

Expected: zero matches.

- [ ] **Step 3: Verify assets exist**

```bash
ls "/Users/utopo4ek/Projects/Portfolio land/restaurant-site/public/og-image.jpg" \
   "/Users/utopo4ek/Projects/Portfolio land/restaurant-site/public/favicon.ico" \
   "/Users/utopo4ek/Projects/Portfolio land/restaurant-site/public/robots.txt"
```

Expected: all 3 files present.

- [ ] **Step 4: Verify robots.txt**

```bash
cat "/Users/utopo4ek/Projects/Portfolio land/restaurant-site/public/robots.txt"
```

Expected: Sitemap URL contains `piccolino.example.com`, not `formandlight.ru`.

---

## PROJECT 2: flovers-site

Working directory: `/Users/utopo4ek/Projects/Portfolio land/flovers-site`

---

### Task 2.1: Fix robots.txt

**Files:**
- Modify: `public/robots.txt`

- [ ] **Step 1: Replace robots.txt**

Write this exact content to `public/robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://flovers.example.com/sitemap-index.xml
```

- [ ] **Step 2: Also update astro.config.mjs site URL**

Read current value:
```bash
cat "/Users/utopo4ek/Projects/Portfolio land/flovers-site/astro.config.mjs"
```

Replace `site: 'https://example.com'` with `site: 'https://flovers.example.com'`.

The full updated `astro.config.mjs`:
```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://flovers.example.com',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [sitemap()],
});
```

- [ ] **Step 3: Update siteConfig.url to match**

In `src/config/site.ts`, change:
```typescript
url: 'https://example.com',
```
To:
```typescript
url: 'https://flovers.example.com',
```

- [ ] **Step 4: Commit**

```bash
git -C "/Users/utopo4ek/Projects/Portfolio land/flovers-site" add public/robots.txt astro.config.mjs src/config/site.ts
git -C "/Users/utopo4ek/Projects/Portfolio land/flovers-site" commit -m "fix: correct robots.txt and site URL for flovers-site"
```

---

### Task 2.2: Add og-image.jpg

**Files:**
- Create: `public/og-image.jpg`

- [ ] **Step 1: Download flovers hero image via curl**

```bash
curl -L \
  "https://images.unsplash.com/photo-1771085417618-c69f6209e540?w=1200&h=630&q=85&fm=jpg&crop=entropy&cs=srgb&auto=format&fit=crop" \
  -o "/Users/utopo4ek/Projects/Portfolio land/flovers-site/public/og-image.jpg"
```

- [ ] **Step 2: Verify file exists and has content**

```bash
ls -lh "/Users/utopo4ek/Projects/Portfolio land/flovers-site/public/og-image.jpg"
```

Expected: file exists, size > 50KB.

- [ ] **Step 3: Commit**

```bash
git -C "/Users/utopo4ek/Projects/Portfolio land/flovers-site" add public/og-image.jpg
git -C "/Users/utopo4ek/Projects/Portfolio land/flovers-site" commit -m "feat: add og-image.jpg for flovers-site"
```

---

### Task 2.3: Add jsonLd prop to flovers BaseLayout

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Read the current Props interface**

```bash
sed -n '6,22p' "/Users/utopo4ek/Projects/Portfolio land/flovers-site/src/layouts/BaseLayout.astro"
```

- [ ] **Step 2: Add jsonLd to Props interface and destructuring**

Replace the Props interface block with:
```astro
interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
  canonical?: string;
  jsonLd?: object | object[];
}

const {
  title = `${siteConfig.name} — ${siteConfig.description}`,
  description = siteConfig.description,
  ogImage = siteConfig.seo.ogImage,
  canonical = Astro.url.href,
  jsonLd,
} = Astro.props;
```

- [ ] **Step 3: Add JSON-LD script block after the Twitter Card section**

Find the line:
```astro
    <!-- Favicon -->
```

Insert before it:
```astro
    <!-- Structured Data -->
    {jsonLd && (
      <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
    )}

```

- [ ] **Step 4: Run check and commit**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/flovers-site" && npm run check
git -C "/Users/utopo4ek/Projects/Portfolio land/flovers-site" add src/layouts/BaseLayout.astro
git -C "/Users/utopo4ek/Projects/Portfolio land/flovers-site" commit -m "feat: add jsonLd prop to flovers BaseLayout"
```

---

### Task 2.4: Add JSON-LD to flovers homepage

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Read current index.astro**

```bash
head -25 "/Users/utopo4ek/Projects/Portfolio land/flovers-site/src/pages/index.astro"
```

- [ ] **Step 2: Add jsonLd constant to frontmatter**

After the existing imports, before the closing `---`, add:

```astro
const jsonLd = {
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
    siteConfig.contacts.vk,
  ].filter((v: string) => v && !v.includes('about:blank'))
};
```

- [ ] **Step 3: Add jsonLd to BaseLayout call**

Find the existing `<BaseLayout` call (it already passes title and description). Add `jsonLd={jsonLd}`:

```astro
<BaseLayout
  title={`${siteConfig.name} — ${siteConfig.description}`}
  description={siteConfig.description}
  jsonLd={jsonLd}
>
```

- [ ] **Step 4: Run check and commit**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/flovers-site" && npm run check
git -C "/Users/utopo4ek/Projects/Portfolio land/flovers-site" add src/pages/index.astro
git -C "/Users/utopo4ek/Projects/Portfolio land/flovers-site" commit -m "feat: add Florist JSON-LD to flovers homepage"
```

---

### Task 2.5: Verify flovers-site ✓

- [ ] **Step 1: Build**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/flovers-site" && npm run build
```

Expected: 0 errors.

- [ ] **Step 2: Grep for formandlight.ru**

```bash
grep -Rni "formandlight.ru" \
  "/Users/utopo4ek/Projects/Portfolio land/flovers-site/public" \
  "/Users/utopo4ek/Projects/Portfolio land/flovers-site/src" \
  "/Users/utopo4ek/Projects/Portfolio land/flovers-site/astro.config.mjs"
```

Expected: zero matches.

- [ ] **Step 3: Verify assets**

```bash
ls "/Users/utopo4ek/Projects/Portfolio land/flovers-site/public/og-image.jpg"
cat "/Users/utopo4ek/Projects/Portfolio land/flovers-site/public/robots.txt"
```

Expected: file exists; robots.txt shows `flovers.example.com`.

---

## PROJECT 3: form-light-site

Working directory: `/Users/utopo4ek/Projects/Portfolio land/form-light-site`

---

### Task 3.1: Fix robots.txt

**Files:**
- Modify: `public/robots.txt`

- [ ] **Step 1: Replace robots.txt**

The current `robots.txt` has the right domain but wrong sitemap filename (`sitemap.xml` instead of `sitemap-index.xml`). Write:

```
User-agent: *
Allow: /

Sitemap: https://formandlight.ru/sitemap-index.xml
```

- [ ] **Step 2: Commit**

```bash
git -C "/Users/utopo4ek/Projects/Portfolio land/form-light-site" add public/robots.txt
git -C "/Users/utopo4ek/Projects/Portfolio land/form-light-site" commit -m "fix: correct sitemap filename in robots.txt to sitemap-index.xml"
```

---

### Task 3.2: Add og-image.jpg

**Files:**
- Create: `public/og-image.jpg`

- [ ] **Step 1: Download the Unsplash image currently used as ogImage default**

```bash
curl -L \
  "https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1200&h=630&q=85&auto=format&fit=crop" \
  -o "/Users/utopo4ek/Projects/Portfolio land/form-light-site/public/og-image.jpg"
```

- [ ] **Step 2: Verify**

```bash
ls -lh "/Users/utopo4ek/Projects/Portfolio land/form-light-site/public/og-image.jpg"
```

Expected: file exists, size > 50KB.

- [ ] **Step 3: Commit**

```bash
git -C "/Users/utopo4ek/Projects/Portfolio land/form-light-site" add public/og-image.jpg
git -C "/Users/utopo4ek/Projects/Portfolio land/form-light-site" commit -m "feat: add og-image.jpg for form-light-site"
```

---

### Task 3.3: Normalize siteConfig

**Files:**
- Modify: `src/config/site.ts`

- [ ] **Step 1: Read current siteConfig**

```bash
cat "/Users/utopo4ek/Projects/Portfolio land/form-light-site/src/config/site.ts"
```

- [ ] **Step 2: Replace the entire file with the normalized version**

```typescript
export const siteConfig = {
  name: 'FORM & LIGHT',
  description: 'Студия архитектуры и дизайна интерьеров',
  locale: 'ru',
  ogLocale: 'ru_RU',
  url: 'https://formandlight.ru',
  contacts: {
    phone: '+7 900 123-45-67',
    phoneHref: 'tel:+79001234567',
    email: 'hello@formandlight.ru',
    address: 'Москва, Россия',
    addressMapsHref: 'https://yandex.ru/maps/?text=Москва%2C+Россия',
    telegram: 'about:blank',
    whatsapp: 'about:blank',
    instagram: 'about:blank',
    vk: 'about:blank',
  },
  forms: {
    contactEndpoint: '/.netlify/functions/contact',
    source: 'FORM & LIGHT',
  },
  footer: {
    privacyHref: 'about:blank',
  },
  seo: {
    ogImage: '/og-image.jpg',
  },
} as const;
```

- [ ] **Step 3: Run type check to confirm no breakage**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/form-light-site" && npm run check
```

Expected: 0 errors (or only errors about BaseLayout which we fix next).

- [ ] **Step 4: Commit**

```bash
git -C "/Users/utopo4ek/Projects/Portfolio land/form-light-site" add src/config/site.ts
git -C "/Users/utopo4ek/Projects/Portfolio land/form-light-site" commit -m "feat: normalize siteConfig with locale, ogLocale, url, seo fields"
```

---

### Task 3.4: Update form-light BaseLayout to use siteConfig and add jsonLd

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Read the current BaseLayout frontmatter**

```bash
sed -n '1,25p' "/Users/utopo4ek/Projects/Portfolio land/form-light-site/src/layouts/BaseLayout.astro"
```

- [ ] **Step 2: Replace the entire frontmatter block (between the `---` markers)**

Current frontmatter (lines 1–19):
```astro
---
import '../styles/global.css';
import { ClientRouter } from 'astro:transitions';

interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
  canonical?: string;
}

const {
  title = 'FORM & LIGHT — Архитектура и дизайн интерьеров',
  description = 'Студия архитектуры и дизайна интерьеров. Проектируем частные дома, интерьеры и жилые среды, в которых эстетика соединяется с образом жизни.',
  ogImage = 'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=1600&q=85&auto=format&fit=crop',
  canonical = Astro.url.href,
} = Astro.props;
---
```

New frontmatter:
```astro
---
import '../styles/global.css';
import { ClientRouter } from 'astro:transitions';
import { siteConfig } from '../config/site';

interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
  canonical?: string;
  jsonLd?: object | object[];
}

const {
  title = `${siteConfig.name} — ${siteConfig.description}`,
  description = siteConfig.description,
  ogImage = siteConfig.seo.ogImage,
  canonical = Astro.url.href,
  jsonLd,
} = Astro.props;
---
```

- [ ] **Step 3: Replace hardcoded values in `<html>` and meta tags**

In the template section, make these replacements:

Replace `<html lang="ru">` → `<html lang={siteConfig.locale}>`

Replace `<meta property="og:locale" content="ru_RU" />` → `<meta property="og:locale" content={siteConfig.ogLocale} />`

Replace `<meta property="og:site_name" content="FORM & LIGHT" />` → `<meta property="og:site_name" content={siteConfig.name} />`

- [ ] **Step 4: Add JSON-LD script block**

Find the `<!-- Favicon -->` comment. Insert before it:
```astro
    <!-- Structured Data -->
    {jsonLd && (
      <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
    )}

```

- [ ] **Step 5: Run type check**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/form-light-site" && npm run check
```

Expected: 0 errors.

- [ ] **Step 6: Commit**

```bash
git -C "/Users/utopo4ek/Projects/Portfolio land/form-light-site" add src/layouts/BaseLayout.astro
git -C "/Users/utopo4ek/Projects/Portfolio land/form-light-site" commit -m "feat: replace hardcoded values with siteConfig and add jsonLd prop"
```

---

### Task 3.5: Add JSON-LD to form-light homepage

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Read current index.astro**

```bash
head -25 "/Users/utopo4ek/Projects/Portfolio land/form-light-site/src/pages/index.astro"
```

- [ ] **Step 2: Add siteConfig import and jsonLd constant to frontmatter**

The frontmatter imports components. Add after the last import line:

```astro
import { siteConfig } from '../config/site';

const jsonLd = {
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
  }
};
```

- [ ] **Step 3: Add jsonLd to BaseLayout call**

Find the current `<BaseLayout` call (already has title and description). Add `jsonLd={jsonLd}`:

```astro
<BaseLayout
  title="FORM & LIGHT — Архитектура и дизайн интерьеров"
  description="Студия архитектуры и дизайна интерьеров. Проектируем частные дома, интерьеры и жилые среды в Москве и по всей России."
  jsonLd={jsonLd}
>
```

- [ ] **Step 4: Run check and commit**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/form-light-site" && npm run check
git -C "/Users/utopo4ek/Projects/Portfolio land/form-light-site" add src/pages/index.astro
git -C "/Users/utopo4ek/Projects/Portfolio land/form-light-site" commit -m "feat: add ProfessionalService JSON-LD to form-light homepage"
```

---

### Task 3.6: Verify form-light-site ✓

- [ ] **Step 1: Build**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/form-light-site" && npm run build
```

Expected: 0 errors.

- [ ] **Step 2: Grep — formandlight.ru should only appear in legitimate places (siteConfig.url, robots.txt)**

```bash
grep -Rni "formandlight.ru" \
  "/Users/utopo4ek/Projects/Portfolio land/form-light-site/public" \
  "/Users/utopo4ek/Projects/Portfolio land/form-light-site/src" \
  "/Users/utopo4ek/Projects/Portfolio land/form-light-site/astro.config.mjs"
```

Expected: only `src/config/site.ts` (url field), `astro.config.mjs` (site field), and `public/robots.txt` (Sitemap URL). These are correct — formandlight.ru IS the real domain for this project.

- [ ] **Step 3: Verify assets and robots**

```bash
ls "/Users/utopo4ek/Projects/Portfolio land/form-light-site/public/og-image.jpg"
cat "/Users/utopo4ek/Projects/Portfolio land/form-light-site/public/robots.txt"
```

Expected: file exists; robots.txt shows `sitemap-index.xml` (not `sitemap.xml`).

---

## PROJECT 4: astro-business-starter

Working directory: `/Users/utopo4ek/Projects/Portfolio land/astro-business-starter`

---

### Task 4.1: Fix robots.txt

**Files:**
- Modify: `public/robots.txt`

- [ ] **Step 1: Replace robots.txt**

```
User-agent: *
Allow: /

Sitemap: https://example.com/sitemap-index.xml
```

- [ ] **Step 2: Commit**

```bash
git -C "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter" add public/robots.txt
git -C "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter" commit -m "fix: correct robots.txt sitemap URL for astro-business-starter"
```

---

### Task 4.2: Add og-image.jpg

**Files:**
- Create: `public/og-image.jpg`

- [ ] **Step 1: Copy restaurant hero as neutral placeholder**

```bash
cp "/Users/utopo4ek/Projects/Portfolio land/restaurant-site/public/og-image.jpg" \
   "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter/public/og-image.jpg"
```

- [ ] **Step 2: Verify**

```bash
ls -lh "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter/public/og-image.jpg"
```

Expected: file exists, size > 50KB.

- [ ] **Step 3: Commit**

```bash
git -C "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter" add public/og-image.jpg
git -C "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter" commit -m "feat: add og-image.jpg placeholder for astro-business-starter"
```

---

### Task 4.3: Add jsonLd prop to starter BaseLayout

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Read current Props block**

```bash
sed -n '6,22p' "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter/src/layouts/BaseLayout.astro"
```

- [ ] **Step 2: Add jsonLd to Props interface and destructuring**

Replace Props block with:
```astro
interface Props {
  title?: string;
  description?: string;
  ogImage?: string;
  canonical?: string;
  jsonLd?: object | object[];
}

const {
  title = `${siteConfig.name} — ${siteConfig.description}`,
  description = siteConfig.description,
  ogImage = siteConfig.seo.ogImage,
  canonical = Astro.url.href,
  jsonLd,
} = Astro.props;
```

- [ ] **Step 3: Add JSON-LD script block**

Find `<!-- Favicon -->` in the `<head>`. Insert before it:
```astro
    <!-- Structured Data -->
    {jsonLd && (
      <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} />
    )}

```

- [ ] **Step 4: Run check and commit**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter" && npm run check
git -C "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter" add src/layouts/BaseLayout.astro
git -C "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter" commit -m "feat: add jsonLd prop to starter BaseLayout"
```

---

### Task 4.4: Add title, description and JSON-LD to starter homepage

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Read current index.astro**

```bash
head -20 "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter/src/pages/index.astro"
```

- [ ] **Step 2: Add siteConfig import and jsonLd constant to frontmatter**

Add after the last import, before closing `---`:

```astro
import { siteConfig } from '../config/site';

const jsonLd = {
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
};
```

- [ ] **Step 3: Update BaseLayout call**

Replace:
```astro
<BaseLayout>
```

With:
```astro
<BaseLayout
  title={`${siteConfig.name} — ${siteConfig.description}`}
  description={siteConfig.description}
  jsonLd={jsonLd}
>
```

- [ ] **Step 4: Run check and commit**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter" && npm run check
git -C "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter" add src/pages/index.astro
git -C "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter" commit -m "feat: add homepage title, description and Organization JSON-LD"
```

---

### Task 4.5: Verify astro-business-starter ✓

- [ ] **Step 1: Build**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter" && npm run build
```

Expected: 0 errors.

- [ ] **Step 2: Grep for formandlight.ru**

```bash
grep -Rni "formandlight.ru" \
  "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter/public" \
  "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter/src" \
  "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter/astro.config.mjs"
```

Expected: zero matches.

- [ ] **Step 3: Verify assets**

```bash
ls "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter/public/og-image.jpg"
cat "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter/public/robots.txt"
```

Expected: file exists; robots.txt shows `example.com/sitemap-index.xml`.

---

## Final Report Template

After all 4 projects complete, provide this report:

### restaurant-site
- robots.txt Sitemap URL: [value]
- og-image.jpg: exists / missing
- favicon.ico: exists / missing
- Homepage title: [value]
- JSON-LD type: Restaurant
- npm run check: PASS / FAIL
- npm run build: PASS / FAIL
- formandlight.ru grep: 0 matches / N matches

### flovers-site
- robots.txt Sitemap URL: [value]
- astro.config.mjs site: [value]
- og-image.jpg: exists / missing
- JSON-LD type: Florist
- npm run check: PASS / FAIL
- npm run build: PASS / FAIL
- formandlight.ru grep: 0 matches / N matches

### form-light-site
- robots.txt Sitemap URL: [value]
- og-image.jpg: exists / missing
- siteConfig locale/ogLocale/url/seo: added / missing
- BaseLayout: uses siteConfig / hardcoded
- JSON-LD type: ProfessionalService
- npm run check: PASS / FAIL
- npm run build: PASS / FAIL
- formandlight.ru in non-config files: 0 matches / N matches

### astro-business-starter
- robots.txt Sitemap URL: [value]
- og-image.jpg: exists / missing
- Homepage title: [value]
- JSON-LD type: Organization
- npm run check: PASS / FAIL
- npm run build: PASS / FAIL
- formandlight.ru grep: 0 matches / N matches

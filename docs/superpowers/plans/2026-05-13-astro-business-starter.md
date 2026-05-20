# Astro Business Starter — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Create `/Users/utopo4ek/Projects/Portfolio land/astro-business-starter` — a clean, brand-neutral Astro starter for business websites (flower shop, restaurant, studio, portfolio), extracted from the DgVision-site project without touching the source.

**Architecture:** Copy source files (excluding node_modules/dist/git history) into a new sibling directory, then surgically replace all FORM & LIGHT brand references with siteConfig-driven values, neutralize the CSS token palette, replace domain-specific data with generic placeholders, and validate with a clean build.

**Tech Stack:** Astro, TypeScript, Tailwind CSS v4 (via @tailwindcss/vite), @astrojs/sitemap, View Transitions

---

## Safety Invariants (check before every step)
- Source: `/Users/utopo4ek/Projects/Portfolio land/DgVision-site` — READ ONLY
- Target: `/Users/utopo4ek/Projects/Portfolio land/astro-business-starter` — WRITE HERE
- Never run `rm`, `mv`, `git` in source directory
- Never `cd` into source to edit files

---

## File Map

### Created (new files in target)
- `src/config/site.ts` — single source of truth for brand/nav/contacts
- `README.md` — starter documentation

### Copied then modified
- `astro.config.mjs` — change site URL
- `package.json` — change name/description
- `tsconfig.json` — unchanged
- `src/styles/global.css` — neutralize warm palette tokens
- `src/layouts/BaseLayout.astro` — use siteConfig, fix localStorage key
- `src/components/layout/Header.astro` — use siteConfig.nav/name/cta
- `src/components/layout/Footer.astro` — use siteConfig contacts/nav/name
- `src/components/ui/Button.astro` — unchanged (fully generic already)
- `src/data/items.ts` — replaces projects.ts + services.ts with generic items
- `src/data/process.ts` — generic 6-step process
- `src/data/team.ts` — 2 generic placeholder members
- `src/pages/index.astro` — rewired to new sections/data
- `src/pages/items/index.astro` — generic items list page
- `src/pages/items/[slug].astro` — generic item detail page
- `src/components/sections/Hero.astro` — neutral SVG visual, neutral copy
- `src/components/sections/About.astro` — generic copy
- `src/components/sections/Services.astro` — 3 generic service cards
- `src/components/sections/Process.astro` — driven by data/process.ts
- `src/components/sections/Team.astro` — driven by data/team.ts
- `src/components/sections/CtaSection.astro` — use siteConfig.cta
- `src/components/sections/ContactSection.astro` — use siteConfig.contacts, generic form options
- `public/favicon.svg` — generic placeholder favicon
- `public/robots.txt` — generic

### Deleted from copy (not carried over)
- `src/components/sections/Doubts.astro` — architecture-specific
- `src/components/sections/Approach.astro` — architecture-specific
- `src/components/sections/Tools.astro` — architecture-specific
- `src/components/sections/Projects.astro` — replaced by Items pattern
- `src/data/projects.ts` — replaced by data/items.ts
- `src/data/services.ts` — replaced by data/items.ts
- `src/pages/projects/` — replaced by pages/items/
- `src/pages/services/` — not carried over (generic services now inline sections)
- `node_modules/`, `dist/`, `.astro/`, `.git/`

---

## Task 1: Copy source to target directory

**Files:**
- Create: `/Users/utopo4ek/Projects/Portfolio land/astro-business-starter/` (directory)

- [ ] **Step 1.1: Verify source exists and target does not**

```bash
ls "/Users/utopo4ek/Projects/Portfolio land/"
# Expected: DgVision  DgVision-site  (NO astro-business-starter yet)
```

**CRITICAL: If `/Users/utopo4ek/Projects/Portfolio land/astro-business-starter` already exists:**
- DO NOT overwrite it
- DO NOT delete it
- STOP and report: "Target directory already exists. Please confirm whether to proceed with astro-business-starter-v2 or manually remove the existing directory."
- Do NOT continue until user confirms

- [ ] **Step 1.2: Copy with exclusions using rsync**

```bash
rsync -av \
  --exclude='node_modules' \
  --exclude='dist' \
  --exclude='.astro' \
  --exclude='.git' \
  --exclude='.vercel' \
  --exclude='.netlify' \
  --exclude='.env' \
  --exclude='.env.local' \
  --exclude='.DS_Store' \
  "/Users/utopo4ek/Projects/Portfolio land/DgVision-site/" \
  "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter/"
```

- [ ] **Step 1.3: Verify copy succeeded**

```bash
ls "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter/src/"
# Expected: components  data  layouts  pages  styles
ls "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter/src/components/"
# Expected: layout  sections  ui
```

- [ ] **Step 1.4: Verify source is untouched**

```bash
ls "/Users/utopo4ek/Projects/Portfolio land/DgVision-site/src/data/"
# Expected: process.ts  projects.ts  services.ts  team.ts  (all original files present)
```

---

## Task 2: Update package.json and astro.config.mjs

**Files:**
- Modify: `astro-business-starter/package.json`
- Modify: `astro-business-starter/astro.config.mjs`

- [ ] **Step 2.1: Update package.json**

Replace the content of `package.json` with:

```json
{
  "name": "astro-business-starter",
  "type": "module",
  "version": "1.0.0",
  "description": "Reusable Astro starter for modern business websites",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro",
    "check": "astro check"
  },
  "dependencies": {
    "@astrojs/sitemap": "^3.2.1",
    "astro": "^5.7.10"
  },
  "devDependencies": {
    "@astrojs/check": "^0.9.4",
    "@tailwindcss/vite": "^4.1.4",
    "tailwindcss": "^4.1.4",
    "typescript": "^5.8.3"
  }
}
```

Note: copy exact version numbers from the source `package.json` to ensure reproducibility. The above is a template — replace version numbers with whatever is in DgVision-site/package.json.

- [ ] **Step 2.2: Update astro.config.mjs**

```js
// @ts-check
import { defineConfig } from 'astro/config';
import tailwindcss from '@tailwindcss/vite';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://example.com',
  vite: {
    plugins: [tailwindcss()]
  },
  integrations: [sitemap()],
});
```

---

## Task 3: Create src/config/site.ts

**Files:**
- Create: `astro-business-starter/src/config/site.ts`

- [ ] **Step 3.1: Create the file**

```typescript
export const siteConfig = {
  name: 'Starter Brand',
  shortName: 'Starter',
  description: 'Reusable Astro starter for modern business websites.',
  locale: 'ru',
  ogLocale: 'ru_RU',
  url: 'https://example.com',
  year: new Date().getFullYear(),

  contacts: {
    email: 'hello@example.com',
    phone: '+7 000 000-00-00',
    address: 'Город, улица',
    telegram: '#',
    whatsapp: '#',
    instagram: '#',
  },

  nav: [
    { label: 'О нас',     href: '/#about' },
    { label: 'Услуги',    href: '/#services' },
    { label: 'Кейсы',     href: '/#items' },
    { label: 'Процесс',   href: '/#process' },
    { label: 'Команда',   href: '/#team' },
    { label: 'Контакты',  href: '/#contacts' },
  ],

  cta: {
    label: 'Обсудить проект',
    href: '/#contacts',
  },

  footer: {
    tagline: 'Современный сайт для вашего бизнеса. Быстрый, адаптивный и SEO-готовый.',
    ctaText: 'Расскажите о своей задаче — обсудим формат и первые шаги.',
    privacyHref: '/privacy',
  },

  seo: {
    ogImage: '/og-image.jpg',
  },
};
```

---

## Task 4: Update BaseLayout.astro

**Files:**
- Modify: `astro-business-starter/src/layouts/BaseLayout.astro`

- [ ] **Step 4.1: Rewrite BaseLayout.astro**

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
}

const {
  title = `${siteConfig.name} — ${siteConfig.description}`,
  description = siteConfig.description,
  ogImage = siteConfig.seo.ogImage,
  canonical = Astro.url.href,
} = Astro.props;
---

<!doctype html>
<html lang={siteConfig.locale}>
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <!-- Anti-flash: resolve theme and add .js class before first paint -->
    <script is:inline>
      (function () {
        document.documentElement.classList.add('js');
        var key = 'starter-theme';
        var saved = 'system';
        try {
          saved = localStorage.getItem(key) || 'system';
        } catch (_) {
          saved = 'system';
        }
        var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        var resolved = saved === 'system' ? (prefersDark ? 'dark' : 'light') : saved;
        document.documentElement.dataset.theme = resolved;
        document.documentElement.dataset.themePreference = saved;
      })();
    </script>
    <meta name="generator" content={Astro.generator} />

    <title>{title}</title>
    <meta name="description" content={description} />
    <link rel="canonical" href={canonical} />

    <!-- Open Graph -->
    <meta property="og:type" content="website" />
    <meta property="og:title" content={title} />
    <meta property="og:description" content={description} />
    <meta property="og:image" content={ogImage} />
    <meta property="og:url" content={canonical} />
    <meta property="og:locale" content={siteConfig.ogLocale} />
    <meta property="og:site_name" content={siteConfig.name} />

    <!-- Twitter Card -->
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content={title} />
    <meta name="twitter:description" content={description} />
    <meta name="twitter:image" content={ogImage} />

    <!-- Favicon -->
    <link rel="icon" type="image/svg+xml" href="/favicon.svg" />

    <!-- Preconnect for Google Fonts -->
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap"
      rel="stylesheet"
    />

    <!-- View Transitions for smooth page navigation -->
    <ClientRouter fallback="none" />
  </head>
  <body>
    <slot />

    <script>
      function initReveal() {
        const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

        if (reduced) {
          document.querySelectorAll('.reveal').forEach(el => el.classList.add('visible', 'is-visible'));
          document.querySelectorAll('[data-reveal]').forEach(el => el.classList.add('is-visible'));
          return;
        }

        const dataRevealEls = document.querySelectorAll('[data-reveal]:not(.is-visible)');
        const newObserver = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                const el = entry.target as HTMLElement;
                const delay = el.dataset.revealDelay;
                if (delay) {
                  el.style.transitionDelay = delay + 'ms';
                }
                el.classList.add('is-visible');
                newObserver.unobserve(el);
              }
            });
          },
          { threshold: 0.08, rootMargin: '0px 0px -50px 0px' }
        );
        dataRevealEls.forEach(el => newObserver.observe(el));

        const revealElements = document.querySelectorAll('.reveal:not(.visible):not(.is-visible)');
        const observer = new IntersectionObserver(
          (entries) => {
            entries.forEach((entry) => {
              if (entry.isIntersecting) {
                entry.target.classList.add('visible', 'is-visible');
                observer.unobserve(entry.target);
              }
            });
          },
          { threshold: 0.1, rootMargin: '0px 0px -60px 0px' }
        );
        revealElements.forEach((el) => observer.observe(el));
      }

      initReveal();
      document.addEventListener('astro:page-load', initReveal);
    </script>
  </body>
</html>
```

Key changes vs source:
- `title` default uses `siteConfig`
- `lang` uses `siteConfig.locale`
- `og:site_name` uses `siteConfig.name`
- `og:locale` uses `siteConfig.ogLocale`
- localStorage key changed from `'form-light-theme'` to `'starter-theme'`

---

## Task 5: Update Header.astro

**Files:**
- Modify: `astro-business-starter/src/components/layout/Header.astro`

- [ ] **Step 5.1: Replace frontmatter and hardcoded strings**

Replace the entire frontmatter block (lines 1–10 in source):

```astro
---
import { siteConfig } from '../../config/site';
const navLinks = siteConfig.nav;
---
```

- [ ] **Step 5.2: Replace logo text and aria-label**

Find:
```html
<a
  href="/"
  class="header-logo text-sm font-medium tracking-[0.15em] uppercase"
  aria-label="FORM & LIGHT — на главную"
>
  FORM&nbsp;&amp;&nbsp;LIGHT
</a>
```

Replace with:
```html
<a
  href="/"
  class="header-logo text-sm font-medium tracking-[0.15em] uppercase"
  aria-label={`${siteConfig.name} — на главную`}
>
  {siteConfig.shortName}
</a>
```

- [ ] **Step 5.3: Replace CTA button href and label**

Find:
```html
<a
  href="/#contacts"
  class="header-cta hidden md:inline-flex ...
>
  Обсудить проект
</a>
```

Replace with:
```html
<a
  href={siteConfig.cta.href}
  class="header-cta hidden md:inline-flex ...
>
  {siteConfig.cta.label}
</a>
```

- [ ] **Step 5.4: Replace mobile CTA button**

Find in the mobile menu section:
```html
<a
  href="/#contacts"
  class="mobile-nav-link mobile-cta inline-flex ...
  style="--delay: 360ms"
  data-close-menu
>
  Обсудить проект
</a>
```

Replace with:
```html
<a
  href={siteConfig.cta.href}
  class="mobile-nav-link mobile-cta inline-flex ...
  style="--delay: 360ms"
  data-close-menu
>
  {siteConfig.cta.label}
</a>
```

- [ ] **Step 5.5: Replace mobile footer brand and year**

Find:
```html
<p class="text-[var(--color-fg-muted)] text-xs tracking-widest uppercase">FORM & LIGHT</p>
<p class="text-[var(--color-fg-muted)] text-xs">© 2026</p>
```

Replace with:
```html
<p class="text-[var(--color-fg-muted)] text-xs tracking-widest uppercase">{siteConfig.name}</p>
<p class="text-[var(--color-fg-muted)] text-xs">© {siteConfig.year}</p>
```

- [ ] **Step 5.6: Update localStorage key in the `<script>` block**

Find:
```typescript
const STORAGE_KEY = 'form-light-theme';
```

Replace with:
```typescript
const STORAGE_KEY = 'starter-theme';
```

---

## Task 6: Update Footer.astro

**Files:**
- Modify: `astro-business-starter/src/components/layout/Footer.astro`

- [ ] **Step 6.1: Replace frontmatter**

```astro
---
import { siteConfig } from '../../config/site';
const navLinks = siteConfig.nav;
---
```

- [ ] **Step 6.2: Replace brand block**

Find:
```html
<a href="/" class="footer-brand text-sm font-medium tracking-[0.15em] uppercase block mb-4">
  FORM&nbsp;&amp;&nbsp;LIGHT
</a>
<p class="footer-link-muted text-sm leading-relaxed max-w-xs">
  Студия архитектуры и дизайна интерьеров. Создаём пространства, которые становятся естественным продолжением человека.
</p>
```

Replace with:
```html
<a href="/" class="footer-brand text-sm font-medium tracking-[0.15em] uppercase block mb-4">
  {siteConfig.name}
</a>
<p class="footer-link-muted text-sm leading-relaxed max-w-xs">
  {siteConfig.footer.tagline}
</p>
```

- [ ] **Step 6.3: Replace contacts block**

Find the hardcoded phone/email/address:
```html
<a href="tel:+79001234567" ...>+7 900 123-45-67</a>
<a href="mailto:hello@formandlight.ru" ...>hello@formandlight.ru</a>
<p class="footer-link-muted text-sm">Москва, Россия</p>
```

Replace with:
```html
<a href={`tel:${siteConfig.contacts.phone.replace(/\s|-/g, '')}`} class="footer-link-muted text-sm transition-colors duration-200">
  {siteConfig.contacts.phone}
</a>
<a href={`mailto:${siteConfig.contacts.email}`} class="footer-link-muted text-sm transition-colors duration-200">
  {siteConfig.contacts.email}
</a>
<p class="footer-link-muted text-sm">{siteConfig.contacts.address}</p>
```

- [ ] **Step 6.4: Replace social links**

Find:
```html
<a href="/#contacts" ... aria-label="Telegram">TG</a>
<a href="/#contacts" ... aria-label="WhatsApp">WA</a>
<a href="/#contacts" ... aria-label="Instagram">IG</a>
```

Replace with:
```html
<a href={siteConfig.contacts.telegram} class="label-tag footer-link-sub transition-colors duration-200" aria-label="Telegram">TG</a>
<a href={siteConfig.contacts.whatsapp} class="label-tag footer-link-sub transition-colors duration-200" aria-label="WhatsApp">WA</a>
<a href={siteConfig.contacts.instagram} class="label-tag footer-link-sub transition-colors duration-200" aria-label="Instagram">IG</a>
```

- [ ] **Step 6.5: Replace CTA column**

Find:
```html
<p class="label-tag footer-link-sub mb-5">Начать проект</p>
<p class="footer-link-muted text-sm mb-6 leading-relaxed">
  Расскажите о своей задаче — обсудим формат и первые идеи.
</p>
<a href="/#contacts" class="footer-cta-btn ...">Обсудить проект</a>
```

Replace with:
```html
<p class="label-tag footer-link-sub mb-5">Начать работу</p>
<p class="footer-link-muted text-sm mb-6 leading-relaxed">
  {siteConfig.footer.ctaText}
</p>
<a href={siteConfig.cta.href} class="footer-cta-btn inline-flex items-center gap-2 px-5 py-2.5 text-xs font-medium tracking-widest uppercase">
  {siteConfig.cta.label}
</a>
```

- [ ] **Step 6.6: Replace bottom bar copyright**

Find:
```html
<p class="footer-link-sub text-xs">
  © 2026 FORM & LIGHT. Все права защищены.
</p>
```

Replace with:
```html
<p class="footer-link-sub text-xs">
  © {siteConfig.year} {siteConfig.name}. Все права защищены.
</p>
```

- [ ] **Step 6.7: Replace privacy link**

Find:
```html
<a href="/privacy" class="footer-link-sub text-xs ...">Политика конфиденциальности</a>
```

Replace with:
```html
<a href={siteConfig.footer.privacyHref} class="footer-link-sub text-xs transition-colors duration-200">Политика конфиденциальности</a>
```

---

## Task 7: Neutralize global.css palette

**Files:**
- Modify: `astro-business-starter/src/styles/global.css`

The token architecture stays intact — only color values change to be brand-neutral.

- [ ] **Step 7.1: Replace light theme color tokens**

Find and replace the `:root, [data-theme="light"]` block's color values:

```css
:root,
[data-theme="light"] {
  --color-bg:          #fafaf9;
  --color-bg-warm:     #f5f5f3;
  --color-bg-dark:     #18181b;
  --color-fg:          #18181b;
  --color-fg-muted:    #71717a;
  --color-fg-subtle:   #a1a1aa;
  --color-accent:      #6366f1;
  --color-accent-dark: #4f46e5;
  --color-border:      #e4e4e7;
  --color-border-dark: #27272a;

  --ease-out:   cubic-bezier(0.16, 1, 0.3, 1);
  --ease-inout: cubic-bezier(0.4, 0, 0.2, 1);

  /* Button tokens — light theme */
  --btn-primary-bg:           #18181b;
  --btn-primary-text:         #fafaf9;
  --btn-primary-border:       #18181b;
  --btn-primary-hover-bg:     #3f3f46;
  --btn-primary-hover-text:   #fafaf9;
  --btn-primary-hover-border: #3f3f46;

  --btn-secondary-bg:           transparent;
  --btn-secondary-text:         #18181b;
  --btn-secondary-border:       rgba(24, 24, 27, 0.30);
  --btn-secondary-hover-bg:     rgba(24, 24, 27, 0.06);
  --btn-secondary-hover-text:   #18181b;
  --btn-secondary-hover-border: rgba(24, 24, 27, 0.55);

  --btn-accent-bg:           #6366f1;
  --btn-accent-text:         #ffffff;
  --btn-accent-border:       #6366f1;
  --btn-accent-hover-bg:     #4f46e5;
  --btn-accent-hover-text:   #ffffff;
  --btn-accent-hover-border: #4f46e5;

  --btn-ghost-bg:           transparent;
  --btn-ghost-text:         #71717a;
  --btn-ghost-border:       transparent;
  --btn-ghost-hover-bg:     rgba(24, 24, 27, 0.05);
  --btn-ghost-hover-text:   #18181b;
  --btn-ghost-hover-border: transparent;

  /* Glass tokens — used by Header */
  --glass-hero-bg:       rgba(15, 15, 18, 0.54);
  --glass-hero-border:   rgba(255, 255, 255, 0.10);
  --glass-hero-text:     rgba(250, 250, 249, 0.90);
  --glass-hero-text-m:   rgba(250, 250, 249, 0.60);
  --glass-hero-cta-bd:   rgba(250, 250, 249, 0.35);
  --glass-scroll-bg:     rgba(250, 250, 249, 0.88);
  --glass-scroll-border: rgba(24, 24, 27, 0.08);
  --glass-scroll-text:   rgba(24, 24, 27, 0.88);
  --glass-scroll-text-m: rgba(24, 24, 27, 0.55);
  --glass-scroll-cta-bd: rgba(24, 24, 27, 0.40);
}
```

- [ ] **Step 7.2: Replace dark theme color tokens**

Find and replace only the color-related lines in `[data-theme="dark"]` (keep all other tokens like card/glass/btn):

```css
--color-bg:          #09090b;
--color-bg-warm:     #111113;
--color-bg-dark:     #000000;
--color-fg:          #fafaf9;
--color-fg-muted:    rgba(250, 250, 249, 0.75);
--color-fg-subtle:   rgba(250, 250, 249, 0.50);
--color-accent:      #818cf8;
--color-accent-dark: #6366f1;
--color-border:      rgba(250, 250, 249, 0.16);
--color-border-dark: rgba(250, 250, 249, 0.10);
```

Also update the dark theme button tokens for the new accent color:
```css
--btn-primary-bg:           #818cf8;
--btn-primary-text:         #09090b;
--btn-primary-border:       #818cf8;
--btn-primary-hover-bg:     #a5b4fc;
--btn-primary-hover-text:   #09090b;
--btn-primary-hover-border: #a5b4fc;

--btn-accent-bg:           #818cf8;
--btn-accent-text:         #09090b;
--btn-accent-border:       #818cf8;
--btn-accent-hover-bg:     #a5b4fc;
--btn-accent-hover-text:   #09090b;
--btn-accent-hover-border: #a5b4fc;
```

- [ ] **Step 7.3: Remove hero-section-specific tokens from global.css**

Find and remove these blocks that are architecture-specific (they will live only in Hero.astro):
```css
/* Hero-section tokens — overridden here because Astro scoped styles ... */
--hero-panel-bg: ...
--hero-line: ...
--hero-scroll: ...
--hero-draw-stroke: ...
/* etc */
--projects-panel-bg: ...
```

These tokens belong inside Hero.astro's `<style>` block only, not in global.css.

---

## Task 8: Create data/items.ts

**Files:**
- Create: `astro-business-starter/src/data/items.ts`
- Delete: `astro-business-starter/src/data/projects.ts` (after items.ts is created)
- Delete: `astro-business-starter/src/data/services.ts` (after items.ts is created)

- [ ] **Step 8.1: Create data/items.ts**

```typescript
export type ItemCategory = string;

export interface ItemFact {
  label: string;
  value: string;
}

export interface ItemInsight {
  icon: string;
  title: string;
  text: string;
}

export interface ItemFeature {
  number: string;
  title: string;
  text: string;
}

export interface ItemGalleryImage {
  alt: string;
  bgClass: string;
  src?: string;
  span?: 'wide' | 'tall' | 'normal';
}

export interface Item {
  id: string;
  slug: string;
  title: string;
  category: ItemCategory;
  type: string;
  description: string;
  bgClass: string;
  cardImage?: string;
  heroImage?: string;
  heroBg: string;
  about: string[];
  vision: {
    headline: string;
    body: string;
  };
  task: {
    text: string;
    insights: ItemInsight[];
  };
  features: ItemFeature[];
  facts: ItemFact[];
  gallery: ItemGalleryImage[];
}

export const items: Item[] = [
  {
    id: 'project-alpha',
    slug: 'project-alpha',
    title: 'Проект Альфа',
    category: 'Категория',
    type: 'Тип работы',
    description: 'Краткое описание первого демо-кейса. Замените на реальный контент.',
    bgClass: 'bg-neutral-400',
    cardImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=800&q=75&auto=format&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1600&q=80&auto=format&fit=crop',
    heroBg: 'bg-gradient-to-br from-neutral-600 via-neutral-500 to-neutral-700',
    about: [
      'Это первый демо-кейс стартера. Опишите здесь суть проекта, его контекст и ключевые решения.',
      'Второй абзац о проекте. Замените этот текст на реальное описание вашей работы.',
    ],
    vision: {
      headline: 'Заголовок концепции',
      body: 'Опишите ключевую идею или принцип, которым руководствовались в этом проекте.',
    },
    task: {
      text: 'Описание задачи клиента и контекста проекта.',
      insights: [
        { icon: '○', title: 'Аспект 1', text: 'Краткое описание первого аспекта' },
        { icon: '◇', title: 'Аспект 2', text: 'Краткое описание второго аспекта' },
        { icon: '△', title: 'Аспект 3', text: 'Краткое описание третьего аспекта' },
        { icon: '□', title: 'Аспект 4', text: 'Краткое описание четвёртого аспекта' },
      ],
    },
    features: [
      { number: '01', title: 'Особенность 1', text: 'Описание первой ключевой особенности проекта.' },
      { number: '02', title: 'Особенность 2', text: 'Описание второй ключевой особенности проекта.' },
      { number: '03', title: 'Особенность 3', text: 'Описание третьей ключевой особенности проекта.' },
      { number: '04', title: 'Особенность 4', text: 'Описание четвёртой ключевой особенности проекта.' },
    ],
    facts: [
      { label: 'Тип', value: 'Тип работы' },
      { label: 'Год', value: '2026' },
      { label: 'Статус', value: 'Завершён' },
    ],
    gallery: [
      { alt: 'Главное изображение проекта', bgClass: 'bg-neutral-500', span: 'wide',
        src: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&q=75&auto=format&fit=crop' },
      { alt: 'Деталь проекта 2', bgClass: 'bg-neutral-400', span: 'normal',
        src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=75&auto=format&fit=crop' },
      { alt: 'Деталь проекта 3', bgClass: 'bg-neutral-300', span: 'tall',
        src: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=800&q=75&auto=format&fit=crop' },
    ],
  },
  {
    id: 'project-beta',
    slug: 'project-beta',
    title: 'Проект Бета',
    category: 'Другая категория',
    type: 'Другой тип',
    description: 'Краткое описание второго демо-кейса. Замените на реальный контент.',
    bgClass: 'bg-zinc-400',
    cardImage: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=800&q=75&auto=format&fit=crop',
    heroImage: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1600&q=80&auto=format&fit=crop',
    heroBg: 'bg-gradient-to-br from-zinc-600 via-zinc-500 to-zinc-700',
    about: [
      'Описание второго демо-кейса. Замените этот текст на реальное описание вашей работы.',
    ],
    vision: {
      headline: 'Заголовок видения',
      body: 'Опишите ключевую идею второго проекта.',
    },
    task: {
      text: 'Описание задачи для второго проекта.',
      insights: [
        { icon: '○', title: 'Аспект 1', text: 'Описание аспекта' },
        { icon: '◇', title: 'Аспект 2', text: 'Описание аспекта' },
      ],
    },
    features: [
      { number: '01', title: 'Особенность 1', text: 'Описание особенности.' },
      { number: '02', title: 'Особенность 2', text: 'Описание особенности.' },
    ],
    facts: [
      { label: 'Тип', value: 'Другой тип' },
      { label: 'Год', value: '2026' },
      { label: 'Статус', value: 'В работе' },
    ],
    gallery: [
      { alt: 'Главное изображение', bgClass: 'bg-zinc-500', span: 'wide',
        src: 'https://images.unsplash.com/photo-1500534314209-a25ddb2bd429?w=1200&q=75&auto=format&fit=crop' },
      { alt: 'Деталь', bgClass: 'bg-zinc-400', span: 'normal',
        src: 'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=800&q=75&auto=format&fit=crop' },
    ],
  },
];

export function getItemBySlug(slug: string): Item | undefined {
  return items.find(i => i.slug === slug);
}

export function getRelatedItems(currentSlug: string, count = 3): Item[] {
  return items.filter(i => i.slug !== currentSlug).slice(0, count);
}
```

- [ ] **Step 8.2: Delete old data files**

```bash
rm "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter/src/data/projects.ts"
rm "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter/src/data/services.ts"
```

Verify they are gone and source is untouched:
```bash
ls "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter/src/data/"
# Expected: items.ts  process.ts  team.ts

ls "/Users/utopo4ek/Projects/Portfolio land/DgVision-site/src/data/"
# Expected: process.ts  projects.ts  services.ts  team.ts  (all still present)
```

---

## Task 9: Create pages/items/

**Files:**
- Create: `astro-business-starter/src/pages/items/index.astro`
- Create: `astro-business-starter/src/pages/items/[slug].astro`
- Delete: `astro-business-starter/src/pages/projects/` (entire directory)
- Delete: `astro-business-starter/src/pages/services/` (entire directory)

- [ ] **Step 9.1: Create items index page**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Header from '../../components/layout/Header.astro';
import Footer from '../../components/layout/Footer.astro';
import { items } from '../../data/items';
import { siteConfig } from '../../config/site';
---

<BaseLayout
  title={`Кейсы — ${siteConfig.name}`}
  description="Примеры наших работ и проектов."
>
  <Header />
  <main class="pt-20">
    <section class="section-padding bg-[var(--color-bg)]">
      <div class="container-site">
        <span class="label-tag reveal">Кейсы</span>
        <div class="divider my-4 reveal reveal-delay-1"></div>
        <h1
          class="mt-6 mb-12 reveal reveal-delay-2"
          style="font-size: clamp(2rem, 5vw, 3.5rem); font-weight: 300; letter-spacing: -0.02em; line-height: 1.1;"
        >
          Наши работы
        </h1>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map((item, i) => (
            <a
              href={`/items/${item.slug}`}
              class={`reveal reveal-delay-${Math.min(i+1, 4)} group block`}
            >
              <div class={`aspect-[4/3] ${!item.cardImage ? item.heroBg : 'bg-neutral-800'} relative overflow-hidden mb-4`}>
                {item.cardImage && (
                  <img
                    src={item.cardImage}
                    alt={item.description}
                    loading="lazy"
                    decoding="async"
                    class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                    width="800"
                    height="600"
                  />
                )}
                <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" aria-hidden="true"></div>
                <div class="absolute inset-0 bg-[var(--color-bg-dark)] opacity-0 group-hover:opacity-30 transition-opacity duration-400"></div>
              </div>
              <span class="label-tag text-[var(--color-accent)] block mb-1">{item.category}</span>
              <h2 class="text-sm font-medium group-hover:text-[var(--color-accent)] transition-colors duration-200">{item.title}</h2>
              <p class="text-xs text-[var(--color-fg-muted)] mt-1">{item.type}</p>
            </a>
          ))}
        </div>
      </div>
    </section>
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 9.2: Create items detail page**

Model after the source `projects/[slug].astro` but:
- Import from `../../data/items` and `../../config/site`
- Replace all project.* fields with item.* fields
- Replace title template `${project.title} — FORM & LIGHT` with `${item.title} — ${siteConfig.name}`
- Keep all section structure (hero, facts bar, about, vision, task, features, gallery, cta, related)
- Keep all reveal animations, glass effects, image patterns

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import Header from '../../components/layout/Header.astro';
import Footer from '../../components/layout/Footer.astro';
import Button from '../../components/ui/Button.astro';
import { items, getItemBySlug, getRelatedItems } from '../../data/items';
import { siteConfig } from '../../config/site';

export function getStaticPaths() {
  return items.map(item => ({
    params: { slug: item.slug },
  }));
}

const { slug } = Astro.params;
const item = getItemBySlug(slug);

if (!item) {
  return Astro.redirect('/items');
}

const related = getRelatedItems(slug, 3);
---

<BaseLayout
  title={`${item.title} — ${siteConfig.name}`}
  description={item.description}
>
  <Header />

  <main class="pt-20">
    <!-- Item Hero -->
    <section class={`item-hero relative min-h-[70vh] md:min-h-[80vh] flex flex-col justify-end pb-12 md:pb-20 overflow-hidden ${!item.heroImage ? item.heroBg : 'bg-neutral-900'}`}>
      {item.heroImage && (
        <img
          src={item.heroImage}
          alt={`${item.title} — фото`}
          class="absolute inset-0 w-full h-full object-cover"
          width="1600" height="900"
          fetchpriority="high"
          decoding="async"
        />
      )}
      <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-black/25 to-black/10" aria-hidden="true"></div>

      <div class="container-site relative z-10">
        <nav aria-label="Хлебные крошки" class="mb-8">
          <ol class="flex items-center gap-2" style="font-size: 0.6875rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: rgba(250,249,247,0.5);">
            <li><a href="/" class="hover:text-white transition-colors duration-200">Главная</a></li>
            <li aria-hidden="true">·</li>
            <li><a href="/items" class="hover:text-white transition-colors duration-200">Кейсы</a></li>
            <li aria-hidden="true">·</li>
            <li style="color: rgba(250,249,247,0.8);">{item.title}</li>
          </ol>
        </nav>

        <div class="max-w-3xl">
          <span class="inline-block mb-4" style="font-size: 0.6875rem; font-weight: 500; letter-spacing: 0.12em; text-transform: uppercase; color: var(--color-accent);">
            {item.category} · {item.type}
          </span>
          <h1
            class="text-white mb-6"
            data-reveal="up"
            data-reveal-delay="300"
            style="font-size: clamp(2.5rem, 6vw, 5rem); font-weight: 300; letter-spacing: -0.03em; line-height: 1.05;"
          >
            {item.title}
          </h1>
          <p
            class="text-white/70 text-base md:text-lg leading-relaxed max-w-xl"
            data-reveal="up"
            data-reveal-delay="500"
          >
            {item.description}
          </p>
        </div>
      </div>
    </section>

    <!-- Facts bar -->
    <div class="section-adaptive border-b border-[var(--color-border)]">
      <div class="container-site">
        <div class="facts-bar flex flex-wrap">
          {item.facts.map((fact, i) => (
            <div class={`reveal reveal-delay-${Math.min(i+1,5)} py-5 pr-8 ${i > 0 ? 'pl-8 border-l border-[var(--color-border-dark)]' : ''}`}>
              <p class="label-tag text-[var(--color-fg-subtle)] mb-1">{fact.label}</p>
              <p class="text-sm text-[var(--color-fg)] font-medium">{fact.value}</p>
            </div>
          ))}
        </div>
      </div>
    </div>

    <!-- About -->
    <section class="section-padding bg-[var(--color-bg)]">
      <div class="container-site">
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_1.2fr] gap-12 lg:gap-20 items-start">
          <div>
            <span class="label-tag reveal">О проекте</span>
            <div class="divider my-4 reveal reveal-delay-1"></div>
            <h2 class="mt-6 reveal reveal-delay-2" style="font-size: clamp(1.5rem, 3vw, 2.5rem); font-weight: 300; letter-spacing: -0.02em; line-height: 1.1;">
              {item.title}
            </h2>
          </div>
          <div class="space-y-5">
            {item.about.map((para, i) => (
              <p class={`reveal reveal-delay-${i + 2} text-[var(--color-fg-muted)] leading-relaxed`}>{para}</p>
            ))}
          </div>
        </div>
      </div>
    </section>

    <!-- Vision -->
    <section class="section-padding section-adaptive overflow-hidden">
      <div class="container-site">
        <div class="max-w-4xl mx-auto">
          <span class="label-tag text-[var(--color-fg-subtle)] reveal">Видение</span>
          <div class="divider my-4 reveal reveal-delay-1" style="background-color: var(--color-accent);"></div>
          <blockquote class="mt-10">
            <p class="reveal reveal-delay-2 text-[var(--color-accent)] mb-6" style="font-size: clamp(1.75rem, 4vw, 3rem); font-weight: 300; letter-spacing: -0.025em; line-height: 1.1;">
              {item.vision.headline}
            </p>
            <p class="reveal reveal-delay-3 text-[var(--color-fg-muted)] text-base leading-relaxed max-w-2xl">
              {item.vision.body}
            </p>
          </blockquote>
        </div>
      </div>
    </section>

    <!-- Task -->
    <section class="section-padding bg-[var(--color-bg-warm)]">
      <div class="container-site">
        <span class="label-tag reveal">Задача</span>
        <div class="divider my-4 reveal reveal-delay-1"></div>
        <div class="grid grid-cols-1 lg:grid-cols-[1fr_1.5fr] gap-12 lg:gap-20 mt-6">
          <p class="reveal reveal-delay-2 text-[var(--color-fg-muted)] text-base leading-relaxed self-start">{item.task.text}</p>
          {item.task.insights.length > 0 && (
            <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {item.task.insights.map((insight, i) => (
                <div class={`reveal reveal-delay-${Math.min(i+2,5)} p-6 bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors duration-300`}>
                  <span class="text-[var(--color-accent)] text-lg mb-3 block" aria-hidden="true">{insight.icon}</span>
                  <h3 class="text-sm font-medium mb-2">{insight.title}</h3>
                  <p class="text-xs text-[var(--color-fg-muted)] leading-relaxed">{insight.text}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </section>

    <!-- Features -->
    {item.features.length > 0 && (
      <section class="section-padding bg-[var(--color-bg)]">
        <div class="container-site">
          <span class="label-tag reveal">Особенности</span>
          <div class="divider my-4 reveal reveal-delay-1"></div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-10">
            {item.features.map((feature, i) => (
              <div class={`reveal reveal-delay-${Math.min(i+1,4)} p-6 bg-[var(--color-bg-warm)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors duration-300`}>
                <span class="label-tag text-[var(--color-accent)] block mb-4">{feature.number}</span>
                <h3 class="text-sm font-medium mb-3">{feature.title}</h3>
                <p class="text-xs text-[var(--color-fg-muted)] leading-relaxed">{feature.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>
    )}

    <!-- Gallery -->
    <section class="section-padding bg-[var(--color-bg-warm)]">
      <div class="container-site">
        <span class="label-tag reveal">Галерея</span>
        <div class="divider my-4 reveal reveal-delay-1"></div>
        <div class="mt-10 grid grid-cols-2 md:grid-cols-3 gap-3 md:gap-4 auto-rows-[200px] md:auto-rows-[240px]">
          {item.gallery.map((img, i) => (
            <div
              class={`gallery-item reveal reveal-delay-${Math.min(i+1,5)} group relative overflow-hidden ${!img.src ? img.bgClass : 'bg-neutral-800'} ${img.span === 'wide' ? 'col-span-2' : ''} ${img.span === 'tall' ? 'row-span-2' : ''}`}
            >
              {img.src ? (
                <img
                  src={img.src}
                  alt={img.alt}
                  loading="lazy"
                  decoding="async"
                  class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.05]"
                  width="800" height="600"
                />
              ) : (
                <div class="visual-placeholder absolute inset-0" aria-hidden="true"></div>
              )}
              <div class="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity duration-400" aria-hidden="true"></div>
              <div class="caption-overlay absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
                <p class="text-white/90" style="font-size: 0.6rem; letter-spacing: 0.06em; font-weight: 500;">{img.alt}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>

    <!-- CTA -->
    <section class="section-padding section-adaptive text-center">
      <div class="container-site">
        <div class="max-w-2xl mx-auto">
          <span class="label-tag text-[var(--color-fg-subtle)] reveal">Хотите похожий результат?</span>
          <div class="divider my-4 mx-auto reveal reveal-delay-1" style="background-color: var(--color-accent);"></div>
          <h2 class="text-[var(--color-fg)] mt-8 mb-5 reveal reveal-delay-2" style="font-size: clamp(1.5rem, 3.5vw, 2.5rem); font-weight: 300; letter-spacing: -0.02em; line-height: 1.1;">
            Обсудим вашу задачу
          </h2>
          <p class="text-[var(--color-fg-muted)] text-base leading-relaxed mb-8 reveal reveal-delay-3">
            Расскажите о проекте — обсудим формат и первые шаги
          </p>
          <Button href={siteConfig.cta.href} variant="primary" size="lg" class="reveal reveal-delay-4">
            {siteConfig.cta.label}
            <svg width="14" height="14" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
              <line x1="0" y1="7" x2="12" y2="7"/>
              <polyline points="8,3 12,7 8,11"/>
            </svg>
          </Button>
        </div>
      </div>
    </section>

    <!-- Related -->
    {related.length > 0 && (
      <section class="section-padding bg-[var(--color-bg-warm)]">
        <div class="container-site">
          <div class="flex items-end justify-between mb-12">
            <div>
              <span class="label-tag reveal">Другие кейсы</span>
              <div class="divider my-4 reveal reveal-delay-1"></div>
            </div>
            <a href="/items" class="label-tag text-[var(--color-fg-muted)] hover:text-[var(--color-fg)] transition-colors duration-200 reveal reveal-delay-1">
              Все кейсы →
            </a>
          </div>
          <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {related.map((r, i) => (
              <a href={`/items/${r.slug}`} class={`reveal reveal-delay-${i+1} group block`}>
                <div class={`aspect-[4/3] ${!r.cardImage ? r.heroBg : 'bg-neutral-800'} relative overflow-hidden mb-4`}>
                  {r.cardImage && (
                    <img src={r.cardImage} alt={r.description} loading="lazy" decoding="async"
                      class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
                      width="800" height="600" />
                  )}
                  <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" aria-hidden="true"></div>
                </div>
                <span class="label-tag text-[var(--color-accent)] block mb-1">{r.category}</span>
                <h3 class="text-sm font-medium group-hover:text-[var(--color-accent)] transition-colors duration-200">{r.title}</h3>
                <p class="text-xs text-[var(--color-fg-muted)] mt-1">{r.type}</p>
              </a>
            ))}
          </div>
        </div>
      </section>
    )}
  </main>

  <Footer />

  <style>
    .item-hero {
      min-height: 70vh;
      min-height: 70svh;
    }
    @media (hover: none) and (pointer: coarse) {
      .caption-overlay { opacity: 1; background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%); }
    }
    .facts-bar { overflow-x: auto; -webkit-overflow-scrolling: touch; }
    .facts-bar > div { min-width: 0; }
    .visual-placeholder {
      background-color: var(--color-bg-warm);
      background-image:
        linear-gradient(var(--color-border) 1px, transparent 1px),
        linear-gradient(90deg, var(--color-border) 1px, transparent 1px);
      background-size: 32px 32px;
    }
  </style>
</BaseLayout>
```

- [ ] **Step 9.3: Delete old pages directories**

```bash
rm -rf "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter/src/pages/projects"
rm -rf "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter/src/pages/services"
```

Verify source is untouched:
```bash
ls "/Users/utopo4ek/Projects/Portfolio land/DgVision-site/src/pages/"
# Expected: index.astro  projects/  services/  (all still present)
```

---

## Task 10: Update data/process.ts and data/team.ts

**Files:**
- Modify: `astro-business-starter/src/data/process.ts`
- Modify: `astro-business-starter/src/data/team.ts`

- [ ] **Step 10.1: Replace process.ts with generic steps**

```typescript
export interface ProcessStep {
  number: string;
  title: string;
  description: string;
}

export const processSteps: ProcessStep[] = [
  {
    number: '01',
    title: 'Знакомство и бриф',
    description: 'Встречаемся, слушаем и задаём вопросы. Важно понять задачу, контекст и ожидаемый результат.',
  },
  {
    number: '02',
    title: 'Анализ и планирование',
    description: 'Изучаем задачу, аудиторию и ограничения. Формируем подход и план работы.',
  },
  {
    number: '03',
    title: 'Концепция',
    description: 'Предлагаем решение: структуру, логику, ключевые идеи. Согласовываем направление.',
  },
  {
    number: '04',
    title: 'Разработка',
    description: 'Реализуем концепцию. Работаем в плотном контакте, согласовываем каждый этап.',
  },
  {
    number: '05',
    title: 'Проверка и доработка',
    description: 'Тестируем результат, собираем обратную связь, вносим правки.',
  },
  {
    number: '06',
    title: 'Запуск и передача',
    description: 'Передаём готовый результат. Обеспечиваем плавный запуск и поддержку.',
  },
];
```

- [ ] **Step 10.2: Replace team.ts with generic placeholders**

```typescript
export interface TeamMemberImage {
  src: string;
  alt: string;
}

export interface TeamMember {
  id: string;
  name: string;
  role: string;
  description: string;
  initials: string;
  image?: TeamMemberImage;
}

export const team: TeamMember[] = [
  {
    id: 'member-1',
    name: 'Имя Фамилия',
    role: 'Должность / роль',
    description: 'Краткое описание члена команды. Опыт, специализация, ключевые компетенции.',
    initials: 'ИФ',
    image: {
      src: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=640&h=800&q=80&auto=format&fit=crop&crop=faces',
      alt: 'Член команды 1',
    },
  },
  {
    id: 'member-2',
    name: 'Имя Фамилия',
    role: 'Должность / роль',
    description: 'Краткое описание второго члена команды. Опыт и ключевые навыки.',
    initials: 'ИФ',
    image: {
      src: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?w=640&h=800&q=80&auto=format&fit=crop&crop=faces',
      alt: 'Член команды 2',
    },
  },
];
```

---

## Task 11: Neutralize section components

**Files:**
- Modify: `astro-business-starter/src/components/sections/Hero.astro`
- Modify: `astro-business-starter/src/components/sections/About.astro`
- Modify: `astro-business-starter/src/components/sections/Services.astro`
- Modify: `astro-business-starter/src/components/sections/CtaSection.astro`
- Modify: `astro-business-starter/src/components/sections/ContactSection.astro`
- Delete: `astro-business-starter/src/components/sections/Doubts.astro`
- Delete: `astro-business-starter/src/components/sections/Approach.astro`
- Delete: `astro-business-starter/src/components/sections/Tools.astro`

- [ ] **Step 11.1: Delete architecture-specific sections**

```bash
rm "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter/src/components/sections/Doubts.astro"
rm "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter/src/components/sections/Approach.astro"
rm "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter/src/components/sections/Tools.astro"
rm "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter/src/components/sections/Projects.astro"
```

- [ ] **Step 11.2: Neutralize Hero.astro**

In the Hero.astro frontmatter and content:
1. Add import: `import { siteConfig } from '../../config/site';`
2. Replace the chip label in the SVG drawing:
   Find: `<span style="...">FORM&nbsp;&amp;&nbsp;LIGHT</span>`
   Replace with: `<span style="...">{siteConfig.name}</span>`
3. Replace hero label text:
   Find: `Architecture &amp; Interior Design · 2026`
   Replace with: `{siteConfig.description}`
4. Replace h1 content to be generic:
   ```html
   <span class="hero-line-1-inner block">Современный сайт</span>
   ...
   <span class="hero-line-2-inner block">для вашего</span>
   ...
   <em class="hero-line-accent-inner not-italic block" style="color: var(--color-accent);">бизнеса</em>
   ```
5. Replace subtitle:
   Find: `Создаём дома, интерьеры и пространства,...`
   Replace with: `Быстрый, адаптивный и SEO-готовый шаблон на Astro для любого бизнес-сайта`
6. Replace CTA buttons:
   ```astro
   <Button href={siteConfig.cta.href} variant="primary" size="md">
     {siteConfig.cta.label}
     ...
   </Button>
   <Button href="/items" variant="secondary" size="md">
     Смотреть кейсы
   </Button>
   ```
7. Replace stats with generic numbers:
   ```typescript
   { value: '5+', label: 'лет опыта' },
   { value: '20+', label: 'проектов' },
   { value: '10', label: 'клиентов' },
   { value: '3', label: 'направления' },
   ```
8. In `<style>`, remove the arch-specific `--hero-panel-bg`, `--hero-draw-*` token references that conflict with global.css dark mode. The tokens stay in the style block local to Hero.astro — just confirm no FORM & LIGHT references remain.

- [ ] **Step 11.3: Neutralize About.astro**

Open the file and replace all architecture/interior-specific text with generic business copy. Keep the section structure (label, divider, heading, paragraphs, stats/facts). Replace text with:
- Heading: `О нас` / `Кто мы`
- Body: Generic "We are a [type] team. We solve [type] tasks." placeholder copy
- Remove any specific mentions of architecture, interiors, private houses

- [ ] **Step 11.4: Neutralize Services.astro**

Replace the 3 service entries with generic ones:
- Service 1: `Консультация` — Помогаем разобраться в задаче, выбрать подход и оценить объём работ.
- Service 2: `Разработка` — Реализуем решение под ваши требования, сроки и бюджет.
- Service 3: `Сопровождение` — Поддерживаем результат после запуска, оперативно решаем вопросы.

Keep the visual layout, card structure, hover effects.

- [ ] **Step 11.5: Neutralize CtaSection.astro**

```astro
---
import Button from '../ui/Button.astro';
import { siteConfig } from '../../config/site';
---
```

Replace hardcoded CTA text:
- Heading: `Готовы начать?`
- Subtext: `Расскажите о задаче — обсудим подход, сроки и формат работы.`
- Button: `{siteConfig.cta.label}` linking to `{siteConfig.cta.href}`

- [ ] **Step 11.6: Neutralize ContactSection.astro**

1. Add import: `import { siteConfig } from '../../config/site';`
2. Replace hardcoded phone: `{siteConfig.contacts.phone}` / `href={...siteConfig.contacts.phone...}`
3. Replace hardcoded email: `{siteConfig.contacts.email}`
4. Replace hardcoded address: `{siteConfig.contacts.address}`
5. Replace the `<select>` options with generic ones:
   ```html
   <option value="" disabled selected>Выберите направление</option>
   <option value="consulting">Консультация</option>
   <option value="development">Разработка</option>
   <option value="support">Сопровождение</option>
   <option value="other">Другое</option>
   ```
6. Replace comment placeholder in textarea: `Расскажите о задаче, пожеланиях и сроках...`

---

## Task 12: Update index.astro

**Files:**
- Modify: `astro-business-starter/src/pages/index.astro`

- [ ] **Step 12.1: Remove deleted section imports and usages**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/layout/Header.astro';
import Footer from '../components/layout/Footer.astro';
import Hero from '../components/sections/Hero.astro';
import About from '../components/sections/About.astro';
import Services from '../components/sections/Services.astro';
import Process from '../components/sections/Process.astro';
import Team from '../components/sections/Team.astro';
import CtaSection from '../components/sections/CtaSection.astro';
import ContactSection from '../components/sections/ContactSection.astro';
import { siteConfig } from '../config/site';
---

<BaseLayout>
  <Header />
  <main>
    <Hero />
    <About />
    <Services />
    <Process />
    <Team />
    <CtaSection />
    <ContactSection />
  </main>
  <Footer />
</BaseLayout>
```

Note: `Doubts`, `Approach`, `Tools`, `Projects` imports are removed.

---

## Task 13: Initialize git and install dependencies

**Files:**
- Create: `astro-business-starter/.gitignore`

- [ ] **Step 13.1: Verify .gitignore exists (copied from source)**

```bash
cat "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter/.gitignore"
# Should show node_modules, dist, .env etc.
```

If missing, create it:
```
node_modules/
dist/
.astro/
.env
.env.local
.DS_Store
*.log
```

- [ ] **Step 13.2: Install dependencies**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter" && npm install
```

Expected: packages installed, no errors.

- [ ] **Step 13.3: Run type check**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter" && npm run check
```

Expected: 0 errors. If errors, fix them before proceeding.

- [ ] **Step 13.4: Run build**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter" && npm run build
```

Expected: build succeeds with no errors.

- [ ] **Step 13.5: Verify no FORM & LIGHT references remain in source files**

```bash
grep -r "FORM & LIGHT\|formandlight\|form-light-theme\|DgVision\|dg.vision" \
  "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter/src/" \
  --include="*.astro" --include="*.ts" --include="*.css"
```

Expected: **no output** (zero matches). If any found, fix them.

- [ ] **Step 13.6: Initialize git (NO COMMIT — awaiting manual review)**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/astro-business-starter" && git init
git add .
# DO NOT COMMIT — user will review and commit manually after seeing the final report
```

**STOP HERE. Do not run `git commit`. Report results to the user and await confirmation.**

- [ ] **Step 13.7: Verify source is still untouched**

```bash
ls "/Users/utopo4ek/Projects/Portfolio land/DgVision-site/src/data/"
# Must show: process.ts  projects.ts  services.ts  team.ts
grep "FORM & LIGHT" "/Users/utopo4ek/Projects/Portfolio land/DgVision-site/src/layouts/BaseLayout.astro"
# Must still show the original hardcoded string
```

---

## Task 14: Create README.md

**Files:**
- Create: `astro-business-starter/README.md`

- [ ] **Step 14.1: Write README**

```markdown
# Astro Business Starter

Reusable Astro starter for modern business websites: flower shops, restaurants, studios, portfolios, and service businesses.

## What's Inside

- **Astro** + TypeScript + Tailwind CSS v4
- **Light / Dark / System** theme switcher with anti-flash script
- **SEO-ready** BaseLayout (Open Graph, Twitter Card, sitemap)
- **Header** — glass morphism effect, anchor navigation, mobile fullscreen menu
- **Footer** — siteConfig-driven contacts, nav, brand
- **Button** component — 5 variants (primary, secondary, accent, ghost, submit)
- **Reveal animations** — scroll-triggered via IntersectionObserver
- **View Transitions** — smooth page-to-page navigation
- **Data-driven routing** — items/[slug].astro pattern for portfolios, catalogs, menus
- **Contact form** — client-side validation, loading state, success state
- Responsive containers, section utilities, reduced-motion support

## Quick Start

```bash
npm install
npm run dev       # localhost:4321
npm run build     # production build
npm run preview   # preview build
npm run check     # TypeScript check
```

## Adapting to a New Brand

### Step 1 — Edit `src/config/site.ts`

```typescript
export const siteConfig = {
  name: 'Your Brand Name',
  shortName: 'Brand',
  description: 'Your brand tagline.',
  // contacts, nav, cta, footer...
};
```

### Step 2 — Edit CSS tokens in `src/styles/global.css`

Change these 8–10 variables for a new brand palette:

```css
:root {
  --color-bg:        /* page background */
  --color-bg-warm:   /* warm sections background */
  --color-fg:        /* primary text */
  --color-fg-muted:  /* secondary text */
  --color-border:    /* borders */
  --color-accent:    /* brand accent color */
  --color-accent-dark: /* darker accent */
  --btn-primary-bg:  /* primary button background */
  --btn-primary-text: /* primary button text */
}
```

**Flower shop palette example:**
```css
--color-bg:        #fdf8f5;
--color-bg-warm:   #faf3ef;
--color-accent:    #e8927c;
--color-accent-dark: #c9674f;
--btn-primary-bg:  #e8927c;
--btn-primary-text: #ffffff;
```

**Restaurant palette example:**
```css
--color-bg:        #faf7f2;
--color-bg-warm:   #f5efe6;
--color-accent:    #8b3a3a;
--color-accent-dark: #6b2a2a;
--btn-primary-bg:  #8b3a3a;
--btn-primary-text: #faf7f2;
```

### Step 3 — Replace `src/data/items.ts`

For a flower shop: rename `items` → `bouquets`, update fields.
For a restaurant: rename `items` → `dishes` or `events`.
For a studio: keep `items` as portfolio cases.

The data-driven routing (`/items/[slug]`) works for any entity type.

### Step 4 — Replace section content

Key sections to update for your business:
- `src/components/sections/Hero.astro` — headline, subtitle, CTA
- `src/components/sections/About.astro` — company description
- `src/components/sections/Services.astro` — your service cards
- `src/components/sections/Process.astro` — your workflow steps

### Step 5 — Replace images

All images use Unsplash URLs as placeholders. Replace with your own hosted images.

## How the Theme System Works

Theme is stored in `localStorage` under the key `'starter-theme'` (values: `'light'`, `'dark'`, `'system'`).

The anti-flash script in `BaseLayout.astro` reads this key and sets `data-theme` on `<html>` before first paint, preventing flash.

To change the localStorage key, update:
1. `BaseLayout.astro` → inline script (`var key = 'starter-theme'`)
2. `Header.astro` → `<script>` block (`const STORAGE_KEY = 'starter-theme'`)

## How Data-Driven Routing Works

1. Define items in `src/data/items.ts`
2. `src/pages/items/index.astro` — renders the grid list
3. `src/pages/items/[slug].astro` — calls `getStaticPaths()` and renders each detail page
4. Astro generates static HTML for every item at build time

Rename `items` to whatever fits your domain — just update the `data/` file and `pages/` folder name.

## File Structure

```
src/
├── config/
│   └── site.ts          ← change brand/nav/contacts here
├── styles/
│   └── global.css       ← change color tokens here
├── layouts/
│   └── BaseLayout.astro ← SEO, theme, reveal init
├── components/
│   ├── layout/
│   │   ├── Header.astro ← nav, theme switcher, mobile menu
│   │   └── Footer.astro
│   ├── sections/
│   │   ├── Hero.astro
│   │   ├── About.astro
│   │   ├── Services.astro
│   │   ├── Process.astro
│   │   ├── Team.astro
│   │   ├── CtaSection.astro
│   │   └── ContactSection.astro
│   └── ui/
│       └── Button.astro ← primary, secondary, accent, ghost, submit
├── data/
│   ├── items.ts         ← portfolio/catalog/menu items
│   ├── process.ts       ← workflow steps
│   └── team.ts          ← team members
└── pages/
    ├── index.astro
    └── items/
        ├── index.astro
        └── [slug].astro
```

## What NOT to commit

- `.env`, `.env.local` — secrets
- `node_modules/` — generated
- `dist/` — build output
- `.astro/` — generated types
```

---

## Self-Review Checklist

After the plan is complete, verify:

- [ ] Every task has exact file paths
- [ ] No `FORM & LIGHT`, `formandlight.ru`, `form-light-theme`, `DgVision` left in starter src files
- [ ] `Button.astro` is unchanged (it's already fully generic)
- [ ] `Team.astro` and `Process.astro` sections — driven from data files, no hardcoded content
- [ ] `items/[slug].astro` compiles — all referenced fields (item.about, item.vision, item.task, item.features, item.gallery, item.facts) exist in Item interface
- [ ] The `siteConfig.year` is computed (`new Date().getFullYear()`) not hardcoded
- [ ] localStorage key changed in BOTH BaseLayout (inline script) AND Header (script block)
- [ ] Source directory check commands included in Task 8, 9, 13

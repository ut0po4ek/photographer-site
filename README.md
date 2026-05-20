# Astro Business Starter

Reusable Astro starter for modern business websites: flower shops, restaurants, studios, portfolios, and service businesses.

## What's Inside

- **Astro** + TypeScript + Tailwind CSS v4
- **Light / Dark / System** theme switcher with anti-flash script
- **SEO-ready** BaseLayout (Open Graph, Twitter Card, sitemap)
- **Header** — glass morphism, anchor navigation, mobile fullscreen menu
- **Footer** — siteConfig-driven contacts, nav, brand
- **Button** component — 5 variants (primary, secondary, accent, ghost, submit)
- **Reveal animations** — scroll-triggered via IntersectionObserver
- **View Transitions** — smooth page-to-page navigation
- **Data-driven routing** — `items/[slug].astro` pattern for portfolios, catalogs, menus
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
  contacts: {
    email: 'hello@yourbrand.ru',
    phone: '+7 000 000-00-00',
    address: 'Ваш город',
    telegram: 'https://t.me/yourbrand',
    whatsapp: 'https://wa.me/7000000000',
    instagram: 'https://instagram.com/yourbrand',
  },
  nav: [
    { label: 'О нас',   href: '/#about' },
    { label: 'Услуги',  href: '/#services' },
    { label: 'Кейсы',   href: '/#items' },
    { label: 'Процесс', href: '/#process' },
    { label: 'Команда', href: '/#team' },
    { label: 'Контакты',href: '/#contacts' },
  ],
  cta: { label: 'Обсудить проект', href: '/#contacts' },
};
```

### Step 2 — Edit CSS tokens in `src/styles/global.css`

Change these 8–10 variables for a new brand palette:

```css
:root {
  --color-bg:          /* page background      */
  --color-bg-warm:     /* alt section background */
  --color-fg:          /* primary text         */
  --color-fg-muted:    /* secondary text       */
  --color-border:      /* borders              */
  --color-accent:      /* brand accent color   */
  --color-accent-dark: /* darker accent        */
  --btn-primary-bg:    /* primary button bg    */
  --btn-primary-text:  /* primary button text  */
}
```

**Flower shop palette:**

```css
--color-bg:          #fdf8f5;
--color-bg-warm:     #faf3ef;
--color-accent:      #e8927c;
--color-accent-dark: #c9674f;
--btn-primary-bg:    #e8927c;
--btn-primary-text:  #ffffff;
```

**Restaurant palette:**

```css
--color-bg:          #faf7f2;
--color-bg-warm:     #f5efe6;
--color-accent:      #8b3a3a;
--color-accent-dark: #6b2a2a;
--btn-primary-bg:    #8b3a3a;
--btn-primary-text:  #faf7f2;
```

### Step 3 — Replace `src/data/items.ts`

| Business type | Rename `items` to |
|---|---|
| Flower shop | `bouquets` |
| Restaurant | `dishes` or `events` |
| Studio | `projects` |
| Services business | `cases` |

The data-driven routing (`/items/[slug]`) works for any entity — just rename the folder in `src/pages/` to match.

### Step 4 — Replace section content

| File | What to change |
|---|---|
| `src/components/sections/Hero.astro` | headline, subtitle, stats |
| `src/components/sections/About.astro` | company description, advantages |
| `src/components/sections/Services.astro` | service titles, descriptions, features |
| `src/components/sections/Process.astro` | driven by `data/process.ts` |
| `src/components/sections/Team.astro` | driven by `data/team.ts` |
| `src/components/sections/ContactSection.astro` | form options, placeholder text |

### Step 5 — Replace images

All images use Unsplash placeholder URLs. Replace with your own hosted images in:

- `src/data/items.ts` — item card and hero images
- `src/data/team.ts` — team member photos
- `src/components/sections/Hero.astro` — hero visual

## UI Components

Generic form and UI components live in `src/components/ui/`.

| Component | Purpose |
| --------- | ------- |
| `TextField` | Styled text or email input |
| `TextareaField` | Styled textarea |
| `SelectField` | Native styled select (no JS required) |
| `CustomSelect` | Custom dropdown with keyboard navigation |
| `PhoneField` | Phone input with +7 Russian format mask |
| `DatePicker` | Calendar date picker popover |
| `Icon` | SVG icon component (phone, location, telegram, whatsapp, instagram, vk) |

### PhoneField mask

`PhoneField.astro` uses a `+7 (___) ___-__-__` mask as a Russian-format example. Replace the mask logic in the component's `<script>` block for other locales.

## How the Theme System Works

Theme preference is stored in `localStorage` under key `'starter-theme'`.

Values: `'light'` | `'dark'` | `'system'`

The anti-flash inline script in `BaseLayout.astro` reads this before first paint and sets `data-theme` on `<html>`, preventing flash of wrong theme.

When forking for a new project, update the key in **three** places:

1. `src/layouts/BaseLayout.astro` — inline script: `var key = 'starter-theme'`
2. `src/layouts/BaseLayout.astro` — `astro:after-swap` handler: `localStorage.getItem('starter-theme')`
3. `src/components/layout/Header.astro` — script block: `const STORAGE_KEY = 'starter-theme'`

## How Data-Driven Routing Works

1. Define items in `src/data/items.ts`
2. `src/pages/items/index.astro` — renders the grid list
3. `src/pages/items/[slug].astro` — `getStaticPaths()` generates a page per item
4. Astro builds static HTML for every item at build time

To rename the route (e.g. `/bouquets/[slug]`):

1. Rename `src/pages/items/` → `src/pages/bouquets/`
2. Update links in `Header.astro` nav and any cross-links

## File Structure

```
src/
├── config/
│   └── site.ts              ← brand/nav/contacts — change first
├── styles/
│   └── global.css           ← color tokens — change second
├── layouts/
│   └── BaseLayout.astro     ← SEO, theme anti-flash, reveal init
├── components/
│   ├── layout/
│   │   ├── Header.astro     ← nav, theme switcher, mobile menu
│   │   └── Footer.astro
│   ├── sections/
│   │   ├── Hero.astro
│   │   ├── About.astro
│   │   ├── Services.astro
│   │   ├── Process.astro    ← driven by data/process.ts
│   │   ├── Team.astro       ← driven by data/team.ts
│   │   ├── CtaSection.astro
│   │   └── ContactSection.astro
│   └── ui/
│       └── Button.astro     ← primary, secondary, accent, ghost, submit
├── data/
│   ├── items.ts             ← portfolio/catalog items (2 demo entries)
│   ├── process.ts           ← workflow steps (6 generic steps)
│   └── team.ts              ← team members (2 placeholder entries)
└── pages/
    ├── index.astro
    └── items/
        ├── index.astro      ← items grid
        └── [slug].astro     ← item detail
```

## What NOT to Commit

```
.env
.env.local
node_modules/
dist/
.astro/
```

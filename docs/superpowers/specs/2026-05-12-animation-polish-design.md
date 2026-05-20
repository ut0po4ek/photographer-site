# FORM & LIGHT — Animation Polish, Theme System & Image Fix Design

**Date:** 2026-05-12  
**Scope:** Performance polish, Safari compatibility, mobile layout, touch UX, light/dark/system theme, related-projects images  
**Approach:** Surgical A+B — fix real problems, preserve visual style

---

## Goals

1. Animations run stably across all browsers including Safari/WebKit
2. No freezes, jank, or layout shift
3. All content accessible on mobile without hover
4. No horizontal scroll anywhere
5. Light / dark / system theme — no flash on load, localStorage persistence
6. "Other projects" cards show images
7. Build passes without errors

## Non-goals

- Do not remove animations
- Do not change visual style
- Do not add heavy libraries
- Do not restructure as React SPA
- Do not redesign desktop layout (desktop layout may be touched only if required for animation stability, theme variables, header fallback, or image fixes)

---

## 1. global.css — Motion system

### 1.1 JS-guard for reveal elements

**Problem:** `[data-reveal]` and `.reveal` elements start at `opacity: 0`. If JS fails or is slow, content stays invisible forever.

**Fix:** Add CSS rule so that without `.js` class on `<html>`, all reveal elements are immediately visible:

```css
html:not(.js) [data-reveal],
html:not(.js) .reveal {
  opacity: 1 !important;
  transform: none !important;
  filter: none !important;
  clip-path: none !important;
}
```

The `.js` class is added by BaseLayout inline script (section 2). This means:
- JS disabled → all content visible
- Reveal script crashes → content was already visible before script ran (JS guard fires first)
- Hidden state only applies under `.js [data-reveal]`

### 1.2 Remove global will-change

**Problem:** `will-change: opacity, transform` on every `[data-reveal]` element creates excessive compositing layers — bad for performance especially on mobile.

**Fix:** Remove `will-change` from the base `[data-reveal]` rule entirely.

### 1.3 Disable blur filter on mobile/touch

**Problem:** `[data-reveal="scale"]` uses `filter: blur(6px)` — expensive on mobile, can cause freezes.

**Fix:**
```css
@media (hover: none) and (pointer: coarse) {
  [data-reveal="scale"],
  [data-reveal="scale"].is-visible {
    filter: none;
  }
}
```

### 1.4 Theme transition class

**Problem:** Naive `transition: all` on theme switch is heavy.

**Fix:** Add class-based transition that only fires during theme switching:
```css
html.theme-transitioning *,
html.theme-transitioning *::before,
html.theme-transitioning *::after {
  transition:
    background-color 240ms ease,
    color 240ms ease,
    border-color 240ms ease,
    box-shadow 240ms ease !important;
}
```

JS adds `theme-transitioning` class before changing `data-theme`, removes it after 300ms.

### 1.5 CSS variables — theme tokens

**Problem:** Current `:root` has hardcoded color values. Theme system requires `[data-theme="light"]` and `[data-theme="dark"]` variants.

**Fix:** Restructure `:root` to map to theme tokens. Keep existing custom properties names to avoid breaking other files, but drive them from theme-specific values:

```css
/* Light theme (default) */
:root,
[data-theme="light"] {
  --color-bg:          #faf9f7;
  --color-bg-warm:     #f5f2ed;
  --color-bg-dark:     #1a1916;
  --color-fg:          #1a1916;
  --color-fg-muted:    #6b6860;
  --color-fg-subtle:   #9c9890;
  --color-accent:      #b5a48a;
  --color-accent-dark: #8a7660;
  --color-border:      #e8e4de;
  --color-border-dark: #2e2c29;
  /* Glass tokens for header */
  --glass-hero-bg:     rgba(18, 18, 16, 0.54);
  --glass-hero-border: rgba(255, 255, 255, 0.10);
  --glass-hero-text:   rgba(250, 249, 247, 0.90);
  --glass-scroll-bg:   rgba(246, 243, 237, 0.82);
  --glass-scroll-border: rgba(25, 25, 22, 0.08);
  --glass-scroll-text: rgba(25, 25, 22, 0.88);
}

[data-theme="dark"] {
  --color-bg:          #11110f;
  --color-bg-warm:     #161512;
  --color-bg-dark:     #0a0a09;
  --color-fg:          #f0ece4;
  --color-fg-muted:    rgba(240, 236, 228, 0.62);
  --color-fg-subtle:   rgba(240, 236, 228, 0.40);
  --color-accent:      #b8aa92;
  --color-accent-dark: #9a8c75;
  --color-border:      rgba(240, 236, 228, 0.12);
  --color-border-dark: rgba(240, 236, 228, 0.08);
  /* Glass tokens for header */
  --glass-hero-bg:     rgba(10, 10, 9, 0.65);
  --glass-hero-border: rgba(255, 255, 255, 0.08);
  --glass-hero-text:   rgba(240, 236, 228, 0.90);
  --glass-scroll-bg:   rgba(17, 17, 15, 0.88);
  --glass-scroll-border: rgba(240, 236, 228, 0.10);
  --glass-scroll-text: rgba(240, 236, 228, 0.88);
}
```

Note: `--color-bg-dark` and `--color-border-dark` keep their existing names. In dark mode they map to the darkest shades of the dark palette.

---

## 2. BaseLayout.astro — JS-guard + theme init

### 2.1 Inline script — anti-flash theme + JS class

**Critical:** This must be the very first `<script>` in `<head>`, before any stylesheets load. In Astro, use `is:inline` to prevent bundling/deferral.

```html
<script is:inline>
  // 1. Add .js class immediately (enables reveal hiding)
  document.documentElement.classList.add('js');

  // 2. Resolve and apply theme before first paint
  (function() {
    var key = 'form-light-theme';
    var saved = localStorage.getItem(key) || 'system';
    var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    var resolved = saved === 'system' ? (prefersDark ? 'dark' : 'light') : saved;
    document.documentElement.dataset.theme = resolved;
    document.documentElement.dataset.themePreference = saved;
  })();
</script>
```

**Order in BaseLayout:**
1. `<script is:inline>` (above) — in `<head>`, before CSS links
2. CSS links (Google Fonts, global.css via Astro)
3. Body content
4. Regular `<script>` for reveal/motion (deferred, after DOM)

### 2.2 Reveal init — add .js to observer setup

The existing `initReveal()` function remains unchanged. The `.js` class is already added by the inline script above, so JS-guard CSS works correctly.

---

## 3. Header.astro — Safari fallback + theme + theme switcher

### 3.1 @supports fallback for backdrop-filter

```css
.site-header {
  -webkit-backdrop-filter: blur(18px) saturate(150%);
  backdrop-filter: blur(18px) saturate(150%);
}

@supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
  .site-header { background: rgba(18, 18, 16, 0.95) !important; }
  .site-header[data-state="scrolled"] { background: rgba(246, 243, 237, 0.97) !important; }
}
```

### 3.2 Header glass — use theme tokens

**Problem:** Header currently hardcodes `rgba(18, 18, 16, 0.54)` etc. In dark mode these values are the same, which is wrong for light mode.

**Fix:** Replace hardcoded values with theme tokens from global.css:
```css
.site-header {
  --h-bg:     var(--glass-hero-bg);
  --h-border: var(--glass-hero-border);
  --h-text:   var(--glass-hero-text);
  /* ... */
}
.site-header[data-state="scrolled"] {
  --h-bg:     var(--glass-scroll-bg);
  --h-border: var(--glass-scroll-border);
  --h-text:   var(--glass-scroll-text);
}
```

This way theme switching automatically updates header glass colors.

### 3.3 Theme switcher component in header

**UX:** Compact button in desktop header (between CTA and burger). Opens a small dropdown with 3 options.

**HTML structure:**
```html
<div class="theme-switcher" style="position: relative;">
  <button
    id="theme-btn"
    aria-label="Тема оформления"
    aria-expanded="false"
    aria-haspopup="true"
    class="theme-btn w-10 h-10 flex items-center justify-center"
  >
    <!-- Icon changes based on current theme -->
    <span class="theme-icon" aria-hidden="true"></span>
  </button>
  <div id="theme-menu" role="menu" aria-label="Выбор темы" class="theme-menu hidden">
    <button role="menuitem" data-theme-option="light">Светлая</button>
    <button role="menuitem" data-theme-option="dark">Тёмная</button>
    <button role="menuitem" data-theme-option="system">Системная</button>
  </div>
</div>
```

**Accessibility:** `aria-expanded`, `role="menu"`, `role="menuitem"`, keyboard navigation (arrows, Escape, Enter), focus management.

**In mobile menu:** Add theme toggle buttons (light/dark/system) as a row of 3 buttons at the bottom of the mobile menu nav.

**Icons (SVG inline):**
- Light: sun icon
- Dark: moon icon
- System: monitor/circle icon

### 3.4 Theme switcher JavaScript (in Header.astro script)

```js
const STORAGE_KEY = 'form-light-theme';

function getPreference() {
  return localStorage.getItem(STORAGE_KEY) || 'system';
}

function setTheme(preference) {
  localStorage.setItem(STORAGE_KEY, preference);
  const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
  const resolved = preference === 'system' ? (prefersDark ? 'dark' : 'light') : preference;

  // Smooth transition
  document.documentElement.classList.add('theme-transitioning');
  document.documentElement.dataset.theme = resolved;
  document.documentElement.dataset.themePreference = preference;
  setTimeout(() => document.documentElement.classList.remove('theme-transitioning'), 300);

  updateSwitcherUI(preference);
}

// Listen for OS theme changes when preference is 'system'
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
  if (getPreference() === 'system') setTheme('system');
});
```

---

## 4. Hero.astro (homepage)

### 4.1 min-height svh fallback

```css
.hero-section {
  min-height: 100vh;   /* legacy fallback */
  min-height: 100svh;  /* iOS Safari 15.4+ */
}
```

Override `min-h-screen` Tailwind class with this explicit CSS in the `<style>` block.

### 4.2 Dark theme: hero background

The hero section uses `bg-[var(--color-bg-dark)]`. Since `--color-bg-dark` is remapped in dark theme to an even darker value (`#0a0a09`), hero will look slightly different but correct. No extra work needed.

---

## 5. projects/[slug].astro — Hero animation + touch UX + images

### 5.1 Hero title/description — replace setTimeout with data-reveal

**Problem:** `<h1>` and `<p>` in project hero have `style="opacity: 0; transform: translateY(1.5rem)"` with `setTimeout` animation. Content invisible if JS slow.

**Fix:**
- Remove inline `style` opacity/transform from both elements
- Add `data-reveal="up"` and `data-reveal-delay="300"` to `<h1>`
- Add `data-reveal="up"` and `data-reveal-delay="500"` to `<p>`
- Remove the entire bottom `<script>` block that does setTimeout animation

The BaseLayout `initReveal()` handles these elements automatically.

### 5.2 Gallery captions — touch visibility

```css
@media (hover: none) and (pointer: coarse) {
  .gallery-item .caption-overlay {
    opacity: 1;
  }
}
```

Add `caption-overlay` class to the caption `<div>` in gallery items.

### 5.3 min-height for project hero — svh

```css
.project-hero {
  min-height: 70vh;
  min-height: 70svh;
}
```

### 5.4 Facts bar — overflow safety

Add `overflow-x: auto` to facts bar container and `min-width: 0` to flex children.

### 5.5 Related projects — fix images

**Root cause found:** In `[slug].astro`, the "Другие проекты" section renders:
```html
<div class={`aspect-[4/3] ${p.heroBg} relative overflow-hidden mb-4`}>
  <!-- only gradient, no <img> tag -->
```

It renders only `heroBg` gradient, no `<img>` tag for `cardImage`.

**Fix:** Add `<img>` tag when `cardImage` exists, matching the pattern from `projects/index.astro`:
```astro
<div class={`aspect-[4/3] ${!p.cardImage ? p.heroBg : 'bg-stone-800'} relative overflow-hidden mb-4`}>
  {p.cardImage && (
    <img
      src={p.cardImage}
      alt={p.description}
      loading="lazy"
      decoding="async"
      class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
      width="800" height="600"
    />
  )}
  <!-- gradient overlay always present -->
  <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" aria-hidden="true"></div>
  <!-- ... -->
</div>
```

**Also:** Add `cardImage` to `kamenka` and `north-villa` in `data/projects.ts` (currently missing):
- `kamenka`: use a suitable Unsplash image
- `north-villa`: use a suitable Unsplash image

---

## 6. projects/index.astro + Projects.astro (homepage)

### 6.1 Remove hover-only overlay CTA on touch devices

**Fix:** Add named class `project-card-hover-overlay` to hover overlay divs in both files:

In template:
```html
<div class="project-card-hover-overlay absolute inset-0 bg-[var(--color-bg-dark)] opacity-0 group-hover:opacity-35 ...">
```

In CSS:
```css
@media (hover: none) and (pointer: coarse) {
  .project-card-hover-overlay {
    display: none;
  }
}
```

The card is still fully clickable via the wrapping `<a>` tag. Title and meta below image communicate it's a link.

---

## 7. Mobile layout verification

After all changes, verify at 320px / 390px / 768px:

- [ ] No horizontal scroll on any page
- [ ] Hero heading doesn't overflow
- [ ] Facts bar wraps correctly (no horizontal scroll)
- [ ] Gallery grid: 2-col at mobile is intentional, verify no overflow
- [ ] Filter tabs on `/projects` wrap correctly
- [ ] Footer collapses to 1 column on mobile
- [ ] Contact form inputs have adequate touch targets (py-3.5 ≈ 48px — good)
- [ ] Mobile menu safe-area: add `padding-top: env(safe-area-inset-top)` to `.mobile-menu`
- [ ] All content in project cards accessible without hover
- [ ] Gallery captions visible on touch
- [ ] Other projects images visible
- [ ] Theme switcher visible and usable in mobile menu
- [ ] Header state works after scroll down and back to top
- [ ] Header remains glass, not transparent

---

## 8. Theme system: light / dark / system

### Storage
- `localStorage` key: `form-light-theme`
- Values: `"light"` | `"dark"` | `"system"`
- Store **user preference**, not resolved theme
- Default (nothing in storage): `"system"`

### Resolution
- `"system"` → read `window.matchMedia("(prefers-color-scheme: dark)").matches`
- Apply resolved theme as `document.documentElement.dataset.theme = "light" | "dark"`
- Also set `document.documentElement.dataset.themePreference = "light" | "dark" | "system"`

### Anti-flash
- Inline `<script is:inline>` in `<head>` before CSS — sets `data-theme` before first paint
- No visible flash even on dark system preference

### System reactivity
- `matchMedia('(prefers-color-scheme: dark)').addEventListener('change', ...)` in Header.astro script
- If preference is `"system"`, re-resolve and apply on OS theme change — no reload needed

### Acceptance criteria
- First visit: system theme applied, no flash
- Reload: same theme, no flash
- light/dark/system all selectable from header switcher
- System responds to OS theme change without reload
- Header stays glass in both themes
- All pages: `/`, `/projects`, `/projects/[slug]` — correct in both themes
- Mobile menu includes theme switcher
- `prefers-reduced-motion`: theme switch has no transition animation

---

## 9. Other Projects images

### Root cause
`getRelatedProjects()` in `data/projects.ts` returns correct `Project` objects with `cardImage`. But the related projects section in `projects/[slug].astro` renders only `heroBg` gradient — the `<img>` tag is missing.

### Fix
1. Add `<img>` tag for `cardImage` in the related projects loop in `[slug].astro` (see section 5.5)
2. Add `cardImage` URLs for `kamenka` and `north-villa` in `data/projects.ts` (these projects lack `cardImage` — they'll show gradient fallback until added)

### Acceptance criteria
- On every `/projects/[slug]` page, "Другие проекты" shows cards with images where `cardImage` exists
- No empty grey blocks for projects that have `cardImage`
- Graceful gradient fallback for projects without `cardImage`
- `alt` text present on all images
- Images correct in light/dark theme
- Images correct on mobile
- Build passes

---

## Files Changed

| File | Changes |
|------|---------|
| `src/styles/global.css` | JS-guard, remove will-change, mobile blur fix, theme transition class, CSS theme variables (light + dark tokens) |
| `src/layouts/BaseLayout.astro` | Inline anti-flash script: `.js` class + theme resolution |
| `src/components/layout/Header.astro` | `@supports` backdrop-filter fallback, glass tokens from CSS vars, theme switcher UI + JS |
| `src/components/sections/Hero.astro` | `min-height: 100svh` |
| `src/components/sections/Projects.astro` | Touch UX — `project-card-hover-overlay` class + CSS |
| `src/pages/projects/[slug].astro` | Replace setTimeout hero animation with data-reveal; gallery touch captions; facts bar overflow fix; related projects images |
| `src/pages/projects/index.astro` | Touch UX — `project-card-hover-overlay` class + CSS |
| `src/data/projects.ts` | Add `cardImage` for `kamenka` and `north-villa` |

---

## Safari-specific Checklist

- [x] `-webkit-backdrop-filter` added
- [x] `@supports not (backdrop-filter)` fallback for solid bg
- [x] `min-height: 100svh` for full-height hero
- [x] No `position: fixed` inside `overflow: hidden` containers (verified — not present)
- [x] `scroll-behavior: auto` in reduced-motion
- [x] `prefers-reduced-motion` covered in both CSS and JS
- [x] No hover-only content on touch devices

---

## Build & Verification Steps

1. `npm run build` — must pass with no errors
2. `npm run dev` — visual check in Chrome
3. DevTools mobile emulation at 390px (iPhone 14)
4. Check 320px for overflow
5. Check light theme
6. Check dark theme
7. Check system theme
8. Reload after each selected theme — verify no flash
9. Check theme switcher in desktop header
10. Check theme switcher in mobile menu
11. Check "Other projects" cards images on every project detail page
12. Verify reduced-motion: DevTools > Rendering > Emulate prefers-reduced-motion
13. Check JS disabled: all content should be visible
14. Header state: initial, scrolled, back-to-top — glass preserved in both themes

---

## Known Limitations

- Real iOS Safari manual test required if device available — CSS fixes are best-practice but not live-verified
- Real OS theme switching (changing macOS/iOS appearance) should be manually tested on a real device
- View Transitions API (`ClientRouter`) has no explicit fallback for Firefox — Astro handles with `fallback="none"` — Firefox navigates normally without transition (acceptable)
- `.reveal` legacy class remains alongside `[data-reveal]` — full unification is out of scope for this pass
- `kamenka` and `north-villa` will show gradient fallback until real `cardImage` URLs are added to `data/projects.ts`

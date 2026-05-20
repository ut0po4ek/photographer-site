# Animation Polish, Theme System & Image Fix Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Surgical performance polish of the existing FORM & LIGHT Astro site: Safari-safe animations, light/dark/system theme with no flash, touch UX fixes, and correct images in "Other Projects" cards — without changing visual style or breaking desktop layout.

**Architecture:** CSS custom properties drive the theme system via `[data-theme="light|dark"]` on `<html>`. An inline `<script is:inline>` in `<head>` applies the resolved theme before first paint to prevent flash. The Header component owns the theme switcher UI and JS. Motion fixes are pure CSS changes to `global.css`. Image fix is a data + template change to one page.

**Tech Stack:** Astro 5, Tailwind CSS v4, vanilla TypeScript in Astro `<script>` blocks, no new npm packages.

---

## File Map

| File | Role in this plan |
|------|-------------------|
| `src/styles/global.css` | Theme CSS tokens (light/dark), JS-guard, motion fixes, theme transition class |
| `src/layouts/BaseLayout.astro` | Anti-flash inline script in `<head>` |
| `src/components/layout/Header.astro` | Safari glass fallback, glass tokens, theme switcher UI + JS |
| `src/components/sections/Hero.astro` | `min-height: 100svh` fix |
| `src/components/sections/Projects.astro` | Touch UX: `project-card-hover-overlay` hide on touch |
| `src/pages/projects/[slug].astro` | Project hero data-reveal, gallery touch captions, facts bar, related-projects image fix |
| `src/pages/projects/index.astro` | Touch UX: same hover overlay fix |
| `src/data/projects.ts` | Add `cardImage` for `kamenka` and `north-villa` |

---

## Stage 1: Global motion/performance CSS fixes

**Files:** `src/styles/global.css`  
**Risk:** Low — pure additive CSS. Existing animations unaffected.  
**Verify:** `npm run dev`, open any page, disable JS in DevTools → all text visible. Enable JS → reveals animate in.

### Task 1: Add JS-guard and remove will-change from global.css

- [ ] Open `src/styles/global.css`

- [ ] In the `MOTION SYSTEM` section, find the `[data-reveal]` base rule (currently line ~90):
  ```css
  [data-reveal] {
    opacity: 0;
    will-change: opacity, transform;
    transition: ...
  }
  ```
  Remove `will-change: opacity, transform;` from it. The rule becomes:
  ```css
  [data-reveal] {
    opacity: 0;
    transition:
      opacity    900ms var(--ease-out),
      transform  900ms var(--ease-out),
      clip-path  1000ms var(--ease-out),
      filter     900ms var(--ease-out);
  }
  ```

- [ ] Immediately after the closing `}` of `[data-reveal].is-visible { ... }`, add the JS-guard block:
  ```css
  /* JS-guard: if JS never ran or crashed, reveal elements are visible */
  html:not(.js) [data-reveal],
  html:not(.js) .reveal {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
    clip-path: none !important;
  }
  ```

- [ ] After the JS-guard block, add the touch blur disable:
  ```css
  /* Disable expensive blur reveal on touch/mobile devices */
  @media (hover: none) and (pointer: coarse) {
    [data-reveal="scale"],
    [data-reveal="scale"].is-visible {
      filter: none;
    }
  }
  ```

- [ ] Run `npm run build` in `/Users/utopo4ek/Projects/Portfolio land/DgVision-site`:
  ```bash
  cd "/Users/utopo4ek/Projects/Portfolio land/DgVision-site" && npm run build
  ```
  Expected: build completes with 0 errors.

- [ ] **Acceptance:** Build passes. `[data-reveal]` rule has no `will-change`.

---

## Stage 2: CSS theme tokens (light + dark)

**Files:** `src/styles/global.css`  
**Risk:** Medium — restructures `:root` variables. All existing color usage via `var(--color-*)` continues to work since names are preserved.  
**Verify:** After applying, open in browser. Light theme looks identical to before. Switch to dark via DevTools `html[data-theme="dark"]` → dark palette applies.

### Task 2: Restructure :root into theme tokens + add theme-transitioning class

- [ ] Open `src/styles/global.css`

- [ ] Find the `DESIGN TOKENS` section containing the current `:root { ... }` block (lines ~6–21). Replace the entire `:root` block with:
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

    --ease-out:   cubic-bezier(0.16, 1, 0.3, 1);
    --ease-inout: cubic-bezier(0.4, 0, 0.2, 1);

    /* Glass tokens — used by Header */
    --glass-hero-bg:      rgba(18, 18, 16, 0.54);
    --glass-hero-border:  rgba(255, 255, 255, 0.10);
    --glass-hero-text:    rgba(250, 249, 247, 0.90);
    --glass-hero-text-m:  rgba(250, 249, 247, 0.60);
    --glass-hero-cta-bd:  rgba(250, 249, 247, 0.35);
    --glass-scroll-bg:    rgba(246, 243, 237, 0.82);
    --glass-scroll-border: rgba(25, 25, 22, 0.08);
    --glass-scroll-text:  rgba(25, 25, 22, 0.88);
    --glass-scroll-text-m: rgba(25, 25, 22, 0.55);
    --glass-scroll-cta-bd: rgba(25, 25, 22, 0.40);
  }

  /* Dark theme */
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

    /* ease vars inherited from :root — no change needed */

    /* Glass tokens — dark mode header glass */
    --glass-hero-bg:      rgba(10, 10, 9, 0.65);
    --glass-hero-border:  rgba(255, 255, 255, 0.08);
    --glass-hero-text:    rgba(240, 236, 228, 0.90);
    --glass-hero-text-m:  rgba(240, 236, 228, 0.55);
    --glass-hero-cta-bd:  rgba(240, 236, 228, 0.30);
    --glass-scroll-bg:    rgba(17, 17, 15, 0.88);
    --glass-scroll-border: rgba(240, 236, 228, 0.10);
    --glass-scroll-text:  rgba(240, 236, 228, 0.88);
    --glass-scroll-text-m: rgba(240, 236, 228, 0.55);
    --glass-scroll-cta-bd: rgba(240, 236, 228, 0.30);
  }
  ```

- [ ] After the theme token blocks (before the `html { ... }` base rule), add the theme-transitioning utility:
  ```css
  /* Smooth theme switching — only active during the 300ms transition window */
  html.theme-transitioning *,
  html.theme-transitioning *::before,
  html.theme-transitioning *::after {
    transition:
      background-color 240ms ease,
      color            240ms ease,
      border-color     240ms ease,
      box-shadow       240ms ease !important;
  }

  /* Disable transition animation when user prefers reduced motion */
  @media (prefers-reduced-motion: reduce) {
    html.theme-transitioning *,
    html.theme-transitioning *::before,
    html.theme-transitioning *::after {
      transition: none !important;
    }
  }
  ```

- [ ] Run `npm run build` again:
  ```bash
  cd "/Users/utopo4ek/Projects/Portfolio land/DgVision-site" && npm run build
  ```
  Expected: 0 errors.

- [ ] In DevTools console on the running dev server (`npm run dev`), run:
  ```js
  document.documentElement.dataset.theme = 'dark'
  ```
  Expected: page background shifts to dark `#11110f`, text becomes light. Run again with `'light'` → returns to warm off-white.

- [ ] **Acceptance:** Light theme looks identical to before this change. Dark theme applies correctly via `data-theme="dark"`.

---

## Stage 3: BaseLayout anti-flash inline script

**Files:** `src/layouts/BaseLayout.astro`  
**Risk:** Low — additive. The inline script runs before CSS loads, setting `data-theme` so no flash occurs.  
**Verify:** Hard-reload page in dark system preference → no white flash before dark theme.

### Task 3: Add anti-flash inline script to BaseLayout head

- [ ] Open `src/layouts/BaseLayout.astro`

- [ ] Find the `<head>` opening tag. Insert the following as the **very first child** of `<head>` — before the `<meta charset>` even, or immediately after it but crucially before any `<link>` or bundled `<script>` tags. In Astro, `<script is:inline>` is not bundled and runs synchronously:
  ```astro
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />

    <!-- Anti-flash: resolve theme and add .js class before first paint -->
    <script is:inline>
      (function () {
        // Add .js immediately — enables CSS reveal hiding
        document.documentElement.classList.add('js');

        // Resolve theme with try/catch for Safari private mode
        var key = 'form-light-theme';
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
  ```
  The rest of `<head>` (title, meta, links, ClientRouter) follows unchanged.

- [ ] Run `npm run build`:
  ```bash
  cd "/Users/utopo4ek/Projects/Portfolio land/DgVision-site" && npm run build
  ```
  Expected: 0 errors.

- [ ] Start dev server (`npm run dev`). Open DevTools → Application → Local Storage. Set `form-light-theme` to `dark`. Hard reload. Expected: page loads dark with **no white flash**. Clear localStorage, hard reload → system preference used.

- [ ] **Acceptance:** `html` element has `data-theme` and `class="js"` immediately on page load (visible in Elements panel before any JS runs).

---

## Stage 4: Header — Safari glass fallback + theme tokens + theme switcher

**Files:** `src/components/layout/Header.astro`  
**Risk:** Medium — touches Header CSS and JS significantly. Visual regression possible if token names mismatch.  
**Verify:** Header visible and glass in both themes, on hero and scrolled state. Theme switcher opens/closes, keyboard navigable.

### Task 4: Wire header glass to theme tokens + add Safari @supports fallback

- [ ] Open `src/components/layout/Header.astro`

- [ ] In the `<style>` block, find `.site-header { ... }`. Replace the `backdrop-filter` line and the hardcoded `--h-*` token assignments with theme-token-driven values:
  ```css
  .site-header {
    position: fixed;
    top: 0; left: 0; right: 0;
    z-index: 50;

    /* Safari + standard backdrop-filter */
    -webkit-backdrop-filter: blur(18px) saturate(150%);
    backdrop-filter: blur(18px) saturate(150%);

    /* Glass tokens now driven by CSS theme variables */
    --h-bg:     var(--glass-hero-bg);
    --h-border: var(--glass-hero-border);
    --h-text:   var(--glass-hero-text);
    --h-text-m: var(--glass-hero-text-m);
    --h-cta-bd: var(--glass-hero-cta-bd);

    background: var(--h-bg);
    border-bottom: 1px solid var(--h-border);
    color: var(--h-text);

    transition:
      background-color 420ms cubic-bezier(0.4, 0, 0.2, 1),
      border-color     420ms cubic-bezier(0.4, 0, 0.2, 1),
      color            420ms cubic-bezier(0.4, 0, 0.2, 1),
      box-shadow       420ms cubic-bezier(0.4, 0, 0.2, 1);
  }
  ```

- [ ] Replace the `.site-header[data-state="scrolled"]` rule:
  ```css
  .site-header[data-state="scrolled"] {
    --h-bg:     var(--glass-scroll-bg);
    --h-border: var(--glass-scroll-border);
    --h-text:   var(--glass-scroll-text);
    --h-text-m: var(--glass-scroll-text-m);
    --h-cta-bd: var(--glass-scroll-cta-bd);
    box-shadow: 0 1px 24px rgba(0,0,0,0.06);
  }
  ```

- [ ] After the `.site-header[data-state="scrolled"]` rule, add the `@supports` fallback for browsers without `backdrop-filter`:
  ```css
  /* Fallback: solid background for browsers without backdrop-filter support */
  @supports not ((backdrop-filter: blur(1px)) or (-webkit-backdrop-filter: blur(1px))) {
    .site-header {
      background: rgba(18, 18, 16, 0.95) !important;
    }
    .site-header[data-state="scrolled"] {
      background: rgba(246, 243, 237, 0.97) !important;
    }
    [data-theme="dark"] .site-header,
    [data-theme="dark"] .site-header[data-state="scrolled"] {
      background: rgba(10, 10, 9, 0.97) !important;
    }
  }
  ```

- [ ] Run `npm run build`. Visually check header in both themes via DevTools `data-theme` toggle. Expected: header glass visible, not transparent, in both light and dark.

### Task 5: Add theme switcher UI to Header

- [ ] In `src/components/layout/Header.astro`, find the `<!-- CTA + Burger -->` div. Add the theme switcher button between the CTA link and the burger button:
  ```astro
  <!-- Theme switcher -->
  <div class="theme-switcher relative">
    <button
      id="theme-btn"
      class="theme-btn w-10 h-10 flex items-center justify-center rounded-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]"
      aria-label="Тема оформления"
      aria-expanded="false"
      aria-haspopup="true"
      title="Переключить тему"
    >
      <!-- Sun icon (light) -->
      <svg class="theme-icon-light hidden" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <circle cx="12" cy="12" r="5"/>
        <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
        <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
        <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
        <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
      </svg>
      <!-- Moon icon (dark) -->
      <svg class="theme-icon-dark hidden" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
      </svg>
      <!-- Monitor icon (system) -->
      <svg class="theme-icon-system hidden" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
        <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
      </svg>
    </button>

    <!-- Dropdown menu -->
    <div
      id="theme-menu"
      role="menu"
      aria-label="Выбор темы"
      class="theme-menu absolute right-0 top-full mt-2 hidden"
    >
      <button role="menuitem" data-theme-option="light" class="theme-menu-item flex items-center gap-3 w-full px-4 py-2.5 text-xs font-medium tracking-widest uppercase text-left">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <circle cx="12" cy="12" r="5"/>
          <line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/>
          <line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/>
          <line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/>
          <line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/>
        </svg>
        Светлая
      </button>
      <button role="menuitem" data-theme-option="dark" class="theme-menu-item flex items-center gap-3 w-full px-4 py-2.5 text-xs font-medium tracking-widest uppercase text-left">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>
        </svg>
        Тёмная
      </button>
      <button role="menuitem" data-theme-option="system" class="theme-menu-item flex items-center gap-3 w-full px-4 py-2.5 text-xs font-medium tracking-widest uppercase text-left">
        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
          <rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/>
        </svg>
        Системная
      </button>
    </div>
  </div>
  ```

- [ ] In the mobile menu `<nav>`, after the last nav link and before the CTA div, add mobile theme switcher:
  ```astro
  <!-- Mobile theme switcher -->
  <div class="mobile-theme-switcher flex gap-3 pt-2">
    <button data-mobile-theme="light" class="mobile-theme-btn flex items-center gap-2 px-4 py-3 text-xs font-medium tracking-widest uppercase border border-[#3a3630] text-[var(--color-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]" aria-label="Светлая тема">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
      Светлая
    </button>
    <button data-mobile-theme="dark" class="mobile-theme-btn flex items-center gap-2 px-4 py-3 text-xs font-medium tracking-widest uppercase border border-[#3a3630] text-[var(--color-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]" aria-label="Тёмная тема">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
      Тёмная
    </button>
    <button data-mobile-theme="system" class="mobile-theme-btn flex items-center gap-2 px-4 py-3 text-xs font-medium tracking-widest uppercase border border-[#3a3630] text-[var(--color-bg)] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--color-accent)]" aria-label="Системная тема">
      <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true"><rect x="2" y="3" width="20" height="14" rx="2"/><line x1="8" y1="21" x2="16" y2="21"/><line x1="12" y1="17" x2="12" y2="21"/></svg>
      Системная
    </button>
  </div>
  ```

### Task 6: Add theme switcher CSS to Header

- [ ] In the `<style>` block of `Header.astro`, add styles for the theme switcher (append after existing styles):
  ```css
  /* ─── Theme button ───────────────────────────────── */
  .theme-btn {
    color: var(--h-text-m);
    transition: color 200ms ease, opacity 200ms ease;
  }
  .theme-btn:hover { color: var(--h-text); opacity: 0.9; }

  /* ─── Theme dropdown menu ────────────────────────── */
  .theme-menu {
    min-width: 10rem;
    background: var(--color-bg);
    border: 1px solid var(--color-border);
    box-shadow: 0 8px 32px rgba(0,0,0,0.12);
    z-index: 100;
  }
  .theme-menu-item {
    color: var(--color-fg-muted);
    transition: background-color 150ms ease, color 150ms ease;
  }
  .theme-menu-item:hover,
  .theme-menu-item:focus {
    background-color: var(--color-bg-warm);
    color: var(--color-fg);
    outline: none;
  }
  .theme-menu-item[data-active="true"] {
    color: var(--color-accent);
  }

  /* ─── Mobile theme switcher ──────────────────────── */
  .mobile-theme-btn {
    transition: border-color 200ms ease, background-color 200ms ease;
  }
  .mobile-theme-btn[data-active="true"] {
    border-color: var(--color-bg);
    background-color: rgba(255,255,255,0.08);
  }
  .mobile-theme-btn:hover {
    border-color: var(--color-accent);
  }
  ```

### Task 7: Add theme switcher JavaScript to Header

- [ ] In the `<script>` block of `Header.astro`, append the following after the existing mobile menu code (keep existing header/menu JS intact):
  ```ts
  /* ─── Theme system ───────────────────────────────── */
  const STORAGE_KEY = 'form-light-theme';

  type ThemePreference = 'light' | 'dark' | 'system';

  function getStoredPreference(): ThemePreference {
    try {
      return (localStorage.getItem(STORAGE_KEY) as ThemePreference) || 'system';
    } catch {
      return 'system';
    }
  }

  function resolveTheme(pref: ThemePreference): 'light' | 'dark' {
    if (pref === 'system') {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return pref;
  }

  function applyTheme(preference: ThemePreference) {
    try {
      localStorage.setItem(STORAGE_KEY, preference);
    } catch { /* Safari private mode — ignore */ }

    const resolved = resolveTheme(preference);

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    if (!reduced) {
      document.documentElement.classList.add('theme-transitioning');
      setTimeout(() => document.documentElement.classList.remove('theme-transitioning'), 300);
    }

    document.documentElement.dataset.theme = resolved;
    document.documentElement.dataset.themePreference = preference;
    updateThemeUI(preference);
  }

  function updateThemeUI(preference: ThemePreference) {
    // Desktop icon
    document.querySelectorAll<HTMLElement>('.theme-icon-light, .theme-icon-dark, .theme-icon-system').forEach(el => {
      el.classList.add('hidden');
    });
    const activeIcon = document.querySelector<HTMLElement>(`.theme-icon-${preference}`);
    activeIcon?.classList.remove('hidden');

    // Desktop menu items active state
    document.querySelectorAll<HTMLElement>('.theme-menu-item').forEach(btn => {
      btn.dataset.active = String(btn.dataset.themeOption === preference);
    });

    // Mobile buttons active state
    document.querySelectorAll<HTMLElement>('.mobile-theme-btn').forEach(btn => {
      btn.dataset.active = String(btn.dataset.mobileTheme === preference);
    });
  }

  // Desktop dropdown open/close
  const themeBtn = document.getElementById('theme-btn')!;
  const themeMenu = document.getElementById('theme-menu')!;
  let themeMenuOpen = false;

  function openThemeMenu() {
    themeMenuOpen = true;
    themeMenu.classList.remove('hidden');
    themeBtn.setAttribute('aria-expanded', 'true');
    // Focus first item
    const firstItem = themeMenu.querySelector<HTMLElement>('[role="menuitem"]');
    firstItem?.focus();
  }

  function closeThemeMenu() {
    themeMenuOpen = false;
    themeMenu.classList.add('hidden');
    themeBtn.setAttribute('aria-expanded', 'false');
  }

  themeBtn.addEventListener('click', () => {
    themeMenuOpen ? closeThemeMenu() : openThemeMenu();
  });

  // Keyboard navigation within menu
  themeMenu.addEventListener('keydown', (e: KeyboardEvent) => {
    const items = Array.from(themeMenu.querySelectorAll<HTMLElement>('[role="menuitem"]'));
    const current = document.activeElement as HTMLElement;
    const idx = items.indexOf(current);

    if (e.key === 'ArrowDown') {
      e.preventDefault();
      items[(idx + 1) % items.length]?.focus();
    } else if (e.key === 'ArrowUp') {
      e.preventDefault();
      items[(idx - 1 + items.length) % items.length]?.focus();
    } else if (e.key === 'Escape') {
      closeThemeMenu();
      themeBtn.focus();
    }
  });

  // Click outside closes
  document.addEventListener('click', (e) => {
    if (themeMenuOpen && !themeBtn.contains(e.target as Node) && !themeMenu.contains(e.target as Node)) {
      closeThemeMenu();
    }
  });

  // Desktop menu item clicks
  themeMenu.querySelectorAll<HTMLElement>('[data-theme-option]').forEach(btn => {
    btn.addEventListener('click', () => {
      applyTheme(btn.dataset.themeOption as ThemePreference);
      closeThemeMenu();
    });
  });

  // Mobile theme buttons
  document.querySelectorAll<HTMLElement>('[data-mobile-theme]').forEach(btn => {
    btn.addEventListener('click', () => {
      applyTheme(btn.dataset.mobileTheme as ThemePreference);
    });
  });

  // OS theme change listener (for 'system' preference)
  window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', () => {
    if (getStoredPreference() === 'system') {
      applyTheme('system');
    }
  });

  // Initialize UI on load and after View Transitions
  function initThemeUI() {
    updateThemeUI(getStoredPreference());
  }
  initThemeUI();
  document.addEventListener('astro:page-load', initThemeUI);
  ```

- [ ] Run `npm run build`:
  ```bash
  cd "/Users/utopo4ek/Projects/Portfolio land/DgVision-site" && npm run build
  ```
  Expected: 0 errors.

- [ ] Run `npm run dev`. Check:
  1. Theme button visible in header, shows correct icon
  2. Click opens dropdown with 3 options
  3. Click "Тёмная" → page transitions to dark, no flash
  4. Reload → dark theme persists (localStorage)
  5. Click "Системная" → clears to OS preference
  6. Tab through menu items → keyboard navigation works
  7. Escape closes menu

- [ ] **Acceptance:** Theme switcher in desktop header and mobile menu. Switching is smooth. Reload persists choice. System tracks OS preference.

---

## Stage 5: Hero min-height svh + project hero data-reveal fix

**Files:** `src/components/sections/Hero.astro`, `src/pages/projects/[slug].astro`  
**Risk:** Low — CSS addition, template attribute change.  
**Verify:** Dev tools mobile emulation → iOS safe area not cutting off hero bottom.

### Task 8: Hero.astro — add min-height: 100svh

- [ ] Open `src/components/sections/Hero.astro`

- [ ] In the `<style>` block, add after the existing `/* ── Line-reveal animation ─────────────── */` comment:
  ```css
  /* iOS Safari safe viewport height */
  .hero-section {
    min-height: 100vh;   /* legacy browsers */
    min-height: 100svh;  /* iOS Safari 15.4+, Chrome 108+ */
  }
  ```

- [ ] **Acceptance:** `hero-section` has both `min-height` declarations.

### Task 9: projects/[slug].astro — replace setTimeout hero animation with data-reveal

- [ ] Open `src/pages/projects/[slug].astro`

- [ ] Find the `<h1>` element with class `hero-project-title`. It currently has:
  ```astro
  style="font-size: clamp(2.5rem, 6vw, 5rem); font-weight: 300; letter-spacing: -0.03em; line-height: 1.05; opacity: 0; transform: translateY(1.5rem);"
  ```
  Replace with (remove the `opacity` and `transform` from inline style, add data-reveal attributes):
  ```astro
  data-reveal="up"
  data-reveal-delay="300"
  style="font-size: clamp(2.5rem, 6vw, 5rem); font-weight: 300; letter-spacing: -0.03em; line-height: 1.05;"
  ```

- [ ] Find the `<p>` element with class `hero-project-desc`. It currently has:
  ```astro
  style="opacity: 0; transform: translateY(1rem);"
  ```
  Replace with:
  ```astro
  data-reveal="up"
  data-reveal-delay="500"
  ```
  (Remove the inline style entirely if it only contained opacity/transform.)

- [ ] Find and **delete** the entire `<script>` block at the bottom of `[slug].astro` that contains:
  ```ts
  const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
  const titleEl = document.querySelector('.hero-project-title') as HTMLElement;
  // ... setTimeout animation ...
  ```
  This script is no longer needed — `initReveal()` in BaseLayout handles data-reveal elements.

- [ ] Add a `<style>` block to `[slug].astro` (or add to existing if one exists) for svh:
  ```css
  /* iOS Safari viewport height fix */
  .project-hero {
    min-height: 70vh;
    min-height: 70svh;
  }
  ```

- [ ] Add class `project-hero` to the project hero `<section>` element (currently has inline `min-h-[70vh] md:min-h-[80vh]`). Keep the Tailwind classes but also add the named class:
  ```astro
  <section class={`project-hero relative min-h-[70vh] md:min-h-[80vh] flex flex-col justify-end ...`}>
  ```

- [ ] Run `npm run build`. Expected: 0 errors.

- [ ] **Acceptance:** Navigating to `/projects/severnyy-sklon` shows title animating in via `data-reveal` (no setTimeout), content is visible even if JS is disabled.

---

## Stage 6: Touch UX fixes

**Files:** `src/components/sections/Projects.astro`, `src/pages/projects/index.astro`, `src/pages/projects/[slug].astro`  
**Risk:** Low — adds class + CSS media query. Desktop unaffected.  
**Verify:** Chrome DevTools → toggle touch emulation → hover overlays disappear, cards still clickable.

### Task 10: Projects.astro (homepage) — hide hover overlay on touch

- [ ] Open `src/components/sections/Projects.astro`

- [ ] Find the hover overlay div inside the article. It currently looks like:
  ```astro
  <div class="absolute inset-0 bg-[var(--color-bg-dark)] opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none flex items-end justify-end p-5">
  ```
  Add class `project-card-hover-overlay`:
  ```astro
  <div class="project-card-hover-overlay absolute inset-0 bg-[var(--color-bg-dark)] opacity-0 group-hover:opacity-40 transition-opacity duration-500 pointer-events-none flex items-end justify-end p-5">
  ```

- [ ] In the `Projects.astro` file (there is no existing `<style>` block — add one before `</section>` or after the existing template):
  ```astro
  <style>
    @media (hover: none) and (pointer: coarse) {
      .project-card-hover-overlay {
        display: none;
      }
    }
  </style>
  ```

### Task 11: projects/index.astro — hide hover overlay on touch

- [ ] Open `src/pages/projects/index.astro`

- [ ] Find the hover overlay div inside the project card:
  ```astro
  <div class="absolute inset-0 bg-[var(--color-bg-dark)] opacity-0 group-hover:opacity-35 transition-opacity duration-500 pointer-events-none"></div>
  ```
  Add class `project-card-hover-overlay`:
  ```astro
  <div class="project-card-hover-overlay absolute inset-0 bg-[var(--color-bg-dark)] opacity-0 group-hover:opacity-35 transition-opacity duration-500 pointer-events-none"></div>
  ```

- [ ] In the existing `<style>` block of `projects/index.astro`, add:
  ```css
  @media (hover: none) and (pointer: coarse) {
    .project-card-hover-overlay {
      display: none;
    }
  }
  ```

### Task 12: [slug].astro — gallery captions visible on touch

- [ ] Open `src/pages/projects/[slug].astro`

- [ ] Find the gallery caption div inside `.gallery-item`. It currently is:
  ```astro
  <div class="absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
  ```
  Add class `caption-overlay`:
  ```astro
  <div class="caption-overlay absolute bottom-0 left-0 right-0 p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300 delay-100">
  ```

- [ ] In the `<style>` block of `[slug].astro` (add if not present), append:
  ```css
  /* Gallery captions always visible on touch devices */
  @media (hover: none) and (pointer: coarse) {
    .caption-overlay {
      opacity: 1;
      background: linear-gradient(to top, rgba(0,0,0,0.5) 0%, transparent 100%);
    }
  }

  /* Facts bar overflow safety */
  .facts-bar {
    overflow-x: auto;
    -webkit-overflow-scrolling: touch;
  }
  .facts-bar > div {
    min-width: 0;
  }
  ```

- [ ] Find the facts bar container div (currently: `<div class="flex flex-wrap">`) and add class `facts-bar`:
  ```astro
  <div class="facts-bar flex flex-wrap">
  ```

- [ ] Run `npm run build`. Expected: 0 errors.

- [ ] **Acceptance:** In DevTools with touch emulation: gallery captions visible, hover overlays gone, cards fully clickable via `<a>`.

---

## Stage 7: Related projects image fix

**Files:** `src/data/projects.ts`, `src/pages/projects/[slug].astro`  
**Risk:** Low — data addition + template fix. No visual regression on existing pages.  
**Verify:** Navigate to any `/projects/[slug]` → "Другие проекты" section shows photos.

### Task 13: Add cardImage to kamenka and north-villa

- [ ] Open `src/data/projects.ts`

- [ ] Find the `kamenka` project object. After `bgClass: 'bg-stone-300',`, add:
  ```ts
  cardImage: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=800&q=75&auto=format&fit=crop',
  heroImage: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1600&q=80&auto=format&fit=crop',
  ```

- [ ] Find the `north-villa` project object. After `bgClass: 'bg-zinc-300',`, add:
  ```ts
  cardImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=75&auto=format&fit=crop',
  heroImage: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1600&q=80&auto=format&fit=crop',
  ```

- [ ] Run `npm run build`. Expected: TypeScript satisfied (Project interface has `cardImage?: string` and `heroImage?: string` — optional).

### Task 14: Fix related projects image rendering in [slug].astro

- [ ] Open `src/pages/projects/[slug].astro`

- [ ] Find the "Другие проекты" section — the related projects grid. Find this div inside the related project link:
  ```astro
  <div class={`aspect-[4/3] ${p.heroBg} relative overflow-hidden mb-4`}>
  ```
  Replace it with:
  ```astro
  <div class={`aspect-[4/3] ${!p.cardImage ? p.heroBg : 'bg-stone-800'} relative overflow-hidden mb-4`}>
    {p.cardImage && (
      <img
        src={p.cardImage}
        alt={p.description}
        loading="lazy"
        decoding="async"
        class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-[1.04]"
        width="800"
        height="600"
      />
    )}
    <div class="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent pointer-events-none" aria-hidden="true"></div>
  ```
  Keep the rest of the existing hover overlay elements (the arrow icon etc.) after this.

- [ ] Run `npm run build`. Expected: 0 errors.

- [ ] Run `npm run dev`. Navigate to `/projects/severnyy-sklon`. Scroll to "Другие проекты". Expected: 3 project cards with photos (Тихая линия, Каменный двор, Лесной квартал — these all have `cardImage`).

- [ ] Navigate to `/projects/kamenka`. Scroll to "Другие проекты". Expected: cards with photos.

- [ ] **Acceptance:** No grey placeholder boxes for projects that have `cardImage`. `alt` attribute present on all images.

---

## Stage 8: Mobile verification pass

**Files:** `src/components/layout/Header.astro` (safe-area padding)  
**Risk:** Low — CSS addition.  
**Verify:** DevTools mobile emulation, check visual layout at multiple widths.

### Task 15: Add iOS safe-area padding to mobile menu

- [ ] Open `src/components/layout/Header.astro`

- [ ] In the `<style>` block, find `.mobile-menu { ... }`. Add safe-area padding support:
  ```css
  .mobile-menu {
    background: var(--color-bg-dark);
    opacity: 0;
    visibility: hidden;
    transition: opacity 400ms cubic-bezier(0.16, 1, 0.3, 1),
                visibility 400ms;
    /* iOS safe area */
    padding-top: max(2rem, env(safe-area-inset-top));
    padding-bottom: max(2rem, env(safe-area-inset-bottom));
  }
  ```

- [ ] Run `npm run dev`. Open DevTools → responsive mode → iPhone 14 Pro (has notch). Verify mobile menu doesn't overlap with status bar area.

### Task 16: Verify mobile layout at key viewports

This is a manual verification task — no code changes unless issues are found.

- [ ] Start dev server: `cd "/Users/utopo4ek/Projects/Portfolio land/DgVision-site" && npm run dev`

- [ ] Open Chrome DevTools. Check each page at 320px width:
  - `/` — no horizontal scroll, hero heading doesn't overflow, stats row wraps
  - `/projects` — filter tabs wrap, cards stack to 1 column, no overflow
  - `/projects/severnyy-sklon` — facts bar scrollable but no page-level horizontal scroll, gallery 2-col OK

- [ ] At 390px (iPhone 14): repeat above checks

- [ ] At 768px (tablet): verify 2-col layouts look correct

- [ ] If any horizontal scroll found: add `overflow-x: hidden` to the offending container. Common culprit: any element using `100vw` with padding. Check for any `width: 100vw` in global.css or components.

- [ ] **Acceptance:** No horizontal scroll at 320px, 390px, 768px on any page.

---

## Stage 9: Build and regression checks

**Files:** None changed in this stage — verification only.  
**Risk:** Zero — read-only.

### Task 17: Final build + regression verification

- [ ] Run production build:
  ```bash
  cd "/Users/utopo4ek/Projects/Portfolio land/DgVision-site" && npm run build
  ```
  Expected: 0 errors, 0 TypeScript errors.

- [ ] Start preview server if available:
  ```bash
  npm run preview
  ```
  If not available: `npm run dev` is sufficient.

- [ ] **Theme verification checklist** (DevTools, `localhost:4321`):
  - [ ] Open `/` in light mode (default or set via switcher) → warm off-white background
  - [ ] Switch to dark → dark `#11110f` background, light text
  - [ ] Hard reload in dark → no white flash, dark loads immediately
  - [ ] Switch to system → test with DevTools Media Features → `prefers-color-scheme: dark` emulation
  - [ ] Reload with system + dark emulation → dark loads, no flash
  - [ ] Open mobile menu → theme buttons visible and functional
  - [ ] Header in dark mode: glass visible on hero (dark glass), glass on scroll (darker glass) — not transparent

- [ ] **Animation verification checklist:**
  - [ ] DevTools Rendering → Enable "Emulate CSS media feature prefers-reduced-motion" → all elements immediately visible, no transitions
  - [ ] Disable JS (Settings → Debugger → Disable JavaScript) → reload `/` → all text visible (JS-guard working)
  - [ ] Re-enable JS → reload → hero animates in normally
  - [ ] Scroll through homepage → reveal animations fire on viewport entry, no double-firing

- [ ] **Related projects image checklist:**
  - [ ] `/projects/severnyy-sklon` → "Другие проекты" shows 3 cards with photos
  - [ ] `/projects/tihaya-liniya` → same
  - [ ] `/projects/kamennyy-dvor` → same
  - [ ] `/projects/lesnoy-kvartal` → same

- [ ] **Touch UX checklist** (DevTools toggle "No touch device" → "Mobile"):
  - [ ] Project cards: hover overlay not shown, card still clickable
  - [ ] Gallery page: captions visible without hover

- [ ] **Safari-compatibility** (no real Safari needed — CSS is sufficient):
  - [ ] Inspect `<html>` in DevTools → confirm `data-theme` set correctly
  - [ ] Confirm `-webkit-backdrop-filter` present in computed styles for `.site-header`
  - [ ] Confirm `.hero-section` has both `min-height: 100vh` and `min-height: 100svh`

- [ ] **Acceptance:** All checklists pass. Build completes with 0 errors.

---

## Self-Review Against Spec

**Spec coverage:**

| Spec Section | Covered by Task(s) |
|---|---|
| 1.1 JS-guard | Task 1 |
| 1.2 Remove will-change | Task 1 |
| 1.3 Mobile blur disable | Task 1 |
| 1.4 Theme transition class | Task 2 |
| 1.5 CSS theme tokens | Task 2 |
| 2.1 Anti-flash inline script (with try/catch) | Task 3 |
| 3.1 @supports backdrop-filter | Task 4 |
| 3.2 Header glass via theme tokens | Task 4 |
| 3.3 Theme switcher UI | Task 5 |
| 3.4 Theme switcher JS | Task 7 |
| 4.1 Hero svh | Task 8 |
| 5.1 Project hero data-reveal | Task 9 |
| 5.2 Gallery captions touch | Task 12 |
| 5.3 Project hero svh | Task 9 |
| 5.4 Facts bar overflow | Task 12 |
| 5.5 Related projects image fix | Task 14 |
| 6.1 Hover overlay touch | Tasks 10, 11 |
| 7. Mobile layout | Tasks 15, 16 |
| 8. Theme system (storage, OS reactivity, no flash) | Tasks 2, 3, 7 |
| 9. Other projects images | Tasks 13, 14 |
| Build verification | Task 17 |

**All spec sections covered.** No gaps found.

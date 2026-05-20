# Dark Theme Regression Fix — Design Spec
**Date:** 2026-05-12  
**Project:** FORM & LIGHT portfolio site (Astro + Tailwind)  
**Status:** Approved

---

## Problem Summary

After dark theme improvements, a regression appeared in light theme:

1. Several sections kept `bg-[var(--color-bg-dark)]` (dark background) in both themes.
2. Text tokens inside those sections were updated to standard theme-aware tokens (`var(--color-fg)`, `var(--color-fg-muted)`), which are dark in light theme.
3. Result: dark text on dark background — unreadable.
4. Additionally: the "Отправить заявку" submit button in the contact form remains visually unadapted in dark theme (appears white instead of warm accent).

---

## Decision

**Adaptive Section Background** approach:

- In **light theme**: these sections become light (warm/neutral bg, standard light-theme text tokens).
- In **dark theme**: these sections stay dark (cinematic/dramatic, standard dark-theme text tokens).
- No global `--color-fg` changes. No on-dark token layer added.
- Implemented via utility classes added to `global.css`.

---

## Architecture

### 1. Utility Classes in `global.css`

Add three adaptive section classes inside `@layer utilities`:

```css
/* Section is bg-dark in dark theme, bg-warm in light theme */
.section-adaptive {
  background-color: var(--color-bg-warm);
}
[data-theme="dark"] .section-adaptive {
  background-color: var(--color-bg-dark);
}

/* Section is bg-dark in dark theme, bg (lightest) in light theme */
.section-adaptive-light {
  background-color: var(--color-bg);
}
[data-theme="dark"] .section-adaptive-light {
  background-color: var(--color-bg-dark);
}
```

These replace all occurrences of `bg-[var(--color-bg-dark)]` in cinematic/CTA/facts sections.

### 2. Hero Section

Hero is more complex — it has hardcoded dark hex colors in decorative geometric elements. Two changes needed:

**a) Background:** Replace `bg-[var(--color-bg-dark)]` with `section-adaptive-light` class.

**b) Geometric decorators:** The panel, rects, lines use hardcoded darks (`#242118`, `#2e2b26`, `#3d3930`, `#2e2c29`, `#2a2825`, `#4a4540`). Replace with CSS variables defined in the `<style>` block scoped per theme:

```css
/* In Hero.astro <style> */
.hero-section {
  --hero-panel-bg:  #f0ece4;
  --hero-panel-bg2: #e8e3da;
  --hero-rect-bg:   #e4dfd6;
  --hero-rect-bd:   #d8d2c8;
  --hero-line:      #ddd8d0;
  --hero-scroll:    #c8c4bc;
}
[data-theme="dark"] .hero-section {
  --hero-panel-bg:  #242118;
  --hero-panel-bg2: #2e2b26;
  --hero-rect-bg:   #2e2b26;
  --hero-rect-bd:   #3d3930;
  --hero-line:      #2e2c29;
  --hero-scroll:    #4a4540;
}
```

Then replace every hardcoded hex in the hero HTML with `var(--hero-*)`.

**c) Buttons in Hero:** Currently `hero-btn-primary` uses `var(--color-fg)` as background. In light theme that's dark (#1a1916) — good. In dark theme, the `[data-theme="dark"]` override applies accent. This works correctly once hero bg is light — no changes needed to button logic.

**d) Stats border:** `border-[#2e2c29]` — replace with `var(--hero-line)`.

**e) Premium feel in light theme:** The warm tones for panel/rect decorators (`#f0ece4`, `#e8e3da`) preserve the architectural premium feel without being a blank white box.

### 3. Approach Section

Replace `bg-[var(--color-bg-dark)]` with `section-adaptive` class.

Text already uses `var(--color-fg)`, `var(--color-fg-muted)`, `var(--color-fg-subtle)` — these are correct in light theme once the bg is light.

The abstract bar at the bottom uses `bg-stone-500 opacity-15` — neutral, works in both themes.

### 4. CtaSection

Replace `bg-[var(--color-bg-dark)]` with `section-adaptive`.

Button `.cta-btn` uses `var(--color-fg)` as bg in light theme (dark button on warm bg — correct). `[data-theme="dark"]` override applies accent — correct.

No button changes needed.

### 5. projects/index.astro — Page Header

Section uses `bg-[var(--color-bg-dark)]` → replace with `section-adaptive-light`.

**Critical fix:** `<h1>` currently uses `text-[var(--color-bg)]` — in light theme `--color-bg` is `#faf9f7` (near-white) which is invisible on a light bg. Change to `text-[var(--color-fg)]`.

Subtitle/breadcrumbs use `var(--color-fg-muted)` and `var(--color-fg-subtle)` — correct for light theme once bg is light.

Decorative geometric shapes (`#232119`, `#2e2c29`, `#3a3630`) in the header background — same fix as Hero: introduce `--projects-panel-bg` etc. variables scoped per theme.

### 6. projects/[slug].astro — Facts Bar

```
bg-[var(--color-bg-dark)] border-b border-[var(--color-border-dark)]
```

Replace bg with `section-adaptive`. `--color-border-dark` in light theme is `#2e2c29` — nearly invisible on light bg. The border should also adapt: add a scoped CSS rule or use `border-[var(--color-border)]` instead of `border-[var(--color-border-dark)]`.

Facts text: `var(--color-fg-subtle)`, `var(--color-fg)` — correct once bg is light.

### 7. projects/[slug].astro — Vision Section

```
bg-[var(--color-bg-dark)]
```

Replace with `section-adaptive`.

`var(--color-fg-subtle)` (label), `var(--color-accent)` (headline — fine in both themes), `var(--color-fg-muted)` (body) — all correct once bg is light.

### 8. projects/[slug].astro — Project CTA Section

```
bg-[var(--color-bg-dark)] text-center
```

Replace with `section-adaptive`.

`.slug-cta-btn` uses `var(--color-fg)` as bg in light (dark button — correct), `[data-theme="dark"]` applies accent. No button changes needed.

`var(--color-fg-subtle)` (label), `var(--color-fg)` (h2), `var(--color-fg-muted)` (p) — correct once bg is light.

### 9. Submit Button in Dark Theme

**Root cause:** `.submit-btn` styles are in a `<style>` block inside `ContactSection.astro`. In Astro, component-scoped styles are scoped with a hash attribute. The `[data-theme="dark"] .submit-btn` selector may not reach elements if Astro's scoping interferes with the parent `[data-theme]` attribute on `<html>`.

**Fix:** Move `.submit-btn` and `[data-theme="dark"] .submit-btn` rules to `global.css` (unscoped). This guarantees `[data-theme="dark"]` on `<html>` correctly matches.

Final tokens for submit button (in `global.css`):

```css
/* Submit button */
:root,
[data-theme="light"] {
  /* already covered by standard tokens — keep .submit-btn using color-fg/color-bg */
}

.submit-btn {
  background: var(--color-fg);
  color: var(--color-bg);
  transition: background 300ms ease, color 300ms ease;
}
.submit-btn:hover:not(:disabled) {
  background: var(--color-accent-dark);
  color: var(--color-bg);
}
[data-theme="dark"] .submit-btn {
  background: var(--button-primary-bg);   /* #c8b898 */
  color: var(--button-primary-text);      /* #11110f */
}
[data-theme="dark"] .submit-btn:hover:not(:disabled) {
  background: var(--button-primary-hover-bg);
  color: var(--button-primary-hover-text);
}
.submit-btn:disabled {
  opacity: 0.6;
  cursor: not-allowed;
}
```

Remove the duplicate `<style>` block from `ContactSection.astro` (keep only non-submit styles if any exist).

---

## Files Changed

| File | Change |
|------|--------|
| `src/styles/global.css` | Add `.section-adaptive`, `.section-adaptive-light` utility classes; move `.submit-btn` styles here |
| `src/components/sections/Hero.astro` | Replace `bg-[var(--color-bg-dark)]` with `section-adaptive-light`; replace hardcoded hex decorators with `--hero-*` CSS variables scoped per theme |
| `src/components/sections/Approach.astro` | Replace `bg-[var(--color-bg-dark)]` with `section-adaptive` |
| `src/components/sections/CtaSection.astro` | Replace `bg-[var(--color-bg-dark)]` with `section-adaptive` |
| `src/components/sections/ContactSection.astro` | Remove `<style>` block with `.submit-btn` (moved to global.css) |
| `src/pages/projects/index.astro` | Replace `bg-[var(--color-bg-dark)]` with `section-adaptive-light`; fix H1 from `text-[var(--color-bg)]` to `text-[var(--color-fg)]`; adapt decorative bg elements |
| `src/pages/projects/[slug].astro` | Replace `bg-[var(--color-bg-dark)]` in facts bar, vision, CTA with `section-adaptive`; fix facts bar border |

---

## Regression Checklist

### Light Theme
- [ ] `/` — Hero is light (warm architectural feel, not blank white)
- [ ] `/` — Approach section is light, text readable
- [ ] `/` — CtaSection is light, button dark/readable
- [ ] `/` — Contact form: text readable, submit button dark bg + light text
- [ ] `/` — Footer: unchanged (already correct with local tokens)
- [ ] `/projects` — Page header is light, H1 dark and readable
- [ ] `/projects/[slug]` — Facts bar light, labels readable
- [ ] `/projects/[slug]` — Vision section light, accent headline visible
- [ ] `/projects/[slug]` — Project CTA light, button readable

### Dark Theme
- [ ] `/` — Hero dark and cinematic
- [ ] `/` — Approach dark
- [ ] `/` — CtaSection dark
- [ ] `/` — Submit button: accent bg (#c8b898) + dark text, NOT white
- [ ] `/` — Footer unchanged
- [ ] `/projects` — Page header dark
- [ ] `/projects/[slug]` — Facts bar dark
- [ ] `/projects/[slug]` — Vision dark
- [ ] `/projects/[slug]` — Project CTA dark

### Mobile
- [ ] 320px — no overflow, no invisible text
- [ ] 390px — hero composition intact
- [ ] 768px — all sections correct in both themes

### Build
- [ ] `npm run build` passes with no errors

---

## What NOT To Do

- Do not change global `--color-fg` in light theme.
- Do not add `!important` except as last resort.
- Do not add hardcoded hex colors to individual elements.
- Do not use on-dark token layer for sections that should become light.
- Do not remove hero animations or geometric composition.
- Do not break the already-correct Footer local token approach.
- Do not touch dark theme visual style beyond making the adaptive classes work.

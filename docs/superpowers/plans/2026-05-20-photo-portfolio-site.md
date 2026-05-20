# Photo Portfolio Site — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Создать одностраничный сайт-визитку фотографа Анны Смирновой на базе astro-business-starter: чёрно-белая эстетика, 9 секций, SEO, адаптив, без переключателя темы.

**Architecture:** Копируем astro-business-starter в photographer-site, заменяем все секции под контент фотографа, удаляем theme-switcher и всю связанную dark/light логику, переписываем global.css под фиксированную чёрно-белую палитру. Новые секции: Hero, About, WhyMe, Services, Portfolio, Reviews, Contact, Footer — все в одном `src/pages/index.astro`.

**Tech Stack:** Astro 6, TypeScript, Tailwind v4 (via @tailwindcss/vite), Google Fonts (Cormorant Garamond + Inter), @astrojs/sitemap, Netlify Functions (contact backend уже есть в starter).

---

## File Structure

**Создаются новые / полностью переписываются:**
- `src/config/site.ts` — siteConfig под фотографа
- `src/styles/global.css` — фиксированная ч/б палитра, удалена dark-тема
- `src/layouts/BaseLayout.astro` — удалён theme-script, добавлены Cormorant Garamond шрифты
- `src/components/layout/Header.astro` — удалён theme-switcher, новая навигация
- `src/components/layout/Footer.astro` — минимальный footer фотографа
- `src/components/sections/Hero.astro` — hero фотографа (тёмный фон, фото, имя, CTA)
- `src/components/sections/About.astro` — секция "Обо мне"
- `src/components/sections/WhyMe.astro` — новый файл, секция "Почему я?"
- `src/components/sections/Services.astro` — карточки услуг фотографа
- `src/components/sections/Portfolio.astro` — новый файл, CSS-grid галерея
- `src/components/sections/Reviews.astro` — новый файл, карточки отзывов
- `src/components/sections/ContactSection.astro` — форма записи на съёмку
- `src/pages/index.astro` — главная, собирает все секции, JSON-LD ProfessionalService

**Удаляются:**
- `src/components/sections/Process.astro`
- `src/components/sections/Team.astro`
- `src/components/sections/CtaSection.astro`
- `src/pages/items/` (весь каталог)
- `src/data/items.ts`, `src/data/process.ts`, `src/data/team.ts`

**Остаются без изменений (переиспользуем):**
- `src/components/ui/Button.astro`
- `src/components/ui/TextField.astro`
- `src/components/ui/PhoneField.astro`
- `src/components/ui/CustomSelect.astro`
- `src/components/ui/TextareaField.astro`
- `src/components/ui/Icon.astro`
- `src/server/contact/` (весь contact backend)
- `astro.config.mjs` (обновляем `site`)
- `public/favicon.ico`, `public/favicon.svg`
- `public/robots.txt` (обновляем)
- `public/og-image.jpg` (заменяем)

**Добавляются:**
- `src/assets/photos/` — 8 placeholder-фото (grayscale Unsplash URL в img src)

---

## Task 1: Scaffolding — копируем starter в photographer-site

**Files:**
- Modify: `/Users/utopo4ek/Projects/Portfolio land/photographer-site/` (заполняем из starter)

- [ ] **Step 1: Копируем файлы starter в photographer-site**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land"
cp -r astro-business-starter/. photographer-site/
```

- [ ] **Step 2: Удаляем лишние data-файлы и страницы**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/photographer-site"
rm -f src/data/items.ts src/data/process.ts src/data/team.ts
rm -rf src/pages/items
rm -f src/components/sections/Process.astro
rm -f src/components/sections/Team.astro
rm -f src/components/sections/CtaSection.astro
```

- [ ] **Step 3: Инициализируем git-репозиторий и делаем первый коммит**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/photographer-site"
git init
git add .
git commit -m "chore: init photographer-site from astro-business-starter"
```

---

## Task 2: siteConfig — контент фотографа

**Files:**
- Modify: `src/config/site.ts`

- [ ] **Step 1: Заменяем siteConfig**

Полное содержимое `src/config/site.ts`:

```typescript
export const siteConfig = {
  name: 'Анна Смирнова',
  shortName: 'Анна Смирнова',
  description: 'Фотограф индивидуальных, семейных и love story съёмок.',
  locale: 'ru',
  ogLocale: 'ru_RU',
  url: 'https://example.com',
  year: new Date().getFullYear(),

  contacts: {
    email: 'hello@example.com',
    phone: '+7 999 000-00-00',
    telegram: 'https://t.me/example',
    whatsapp: 'https://wa.me/79999999999',
    instagram: 'https://instagram.com/example',
  },

  nav: [
    { label: 'Обо мне',   href: '/#about' },
    { label: 'Услуги',    href: '/#services' },
    { label: 'Портфолио', href: '/#portfolio' },
    { label: 'Отзывы',   href: '/#reviews' },
    { label: 'Контакты',  href: '/#contacts' },
  ],

  cta: {
    label: 'Записаться',
    href: '/#contacts',
  },

  forms: {
    contactEndpoint: '/.netlify/functions/contact',
    source: 'Anna Smirnova Photography',
  },

  footer: {
    tagline: 'Фотограф индивидуальных, семейных и love story съёмок.',
    privacyHref: 'about:blank',
  },

  seo: {
    ogImage: '/og-image.jpg',
  },
};
```

- [ ] **Step 2: Коммит**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/photographer-site"
git add src/config/site.ts
git commit -m "feat: siteConfig for Anna Smirnova Photography"
```

---

## Task 3: global.css — фиксированная ч/б палитра, удаление dark-темы

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Заменяем блок дизайн-токенов**

Найти в `src/styles/global.css` блок `@layer base { :root, [data-theme="light"] { ... } [data-theme="dark"] { ... } }` и заменить его целиком на следующее (только `:root`, без dark-темы, без `[data-theme]` атрибутов, с новой ч/б палитрой):

```css
@layer base {
  :root {
    /* ── Core palette ─────────────────────────────── */
    --color-bg:          #f5f5f2;
    --color-bg-warm:     #eeece8;
    --color-bg-dark:     #111111;
    --color-fg:          #151515;
    --color-fg-muted:    rgba(21, 21, 21, 0.60);
    --color-fg-subtle:   rgba(21, 21, 21, 0.38);
    --color-accent:      #151515;
    --color-accent-dark: #000000;
    --color-border:      rgba(21, 21, 21, 0.12);
    --color-border-dark: rgba(21, 21, 21, 0.22);

    --ease-out:   cubic-bezier(0.16, 1, 0.3, 1);
    --ease-inout: cubic-bezier(0.4, 0, 0.2, 1);

    /* ── Button tokens ────────────────────────────── */
    --btn-primary-bg:           #151515;
    --btn-primary-text:         #f5f5f2;
    --btn-primary-border:       #151515;
    --btn-primary-hover-bg:     #333333;
    --btn-primary-hover-text:   #f5f5f2;
    --btn-primary-hover-border: #333333;

    --btn-secondary-bg:           transparent;
    --btn-secondary-text:         #151515;
    --btn-secondary-border:       rgba(21, 21, 21, 0.30);
    --btn-secondary-hover-bg:     rgba(21, 21, 21, 0.06);
    --btn-secondary-hover-text:   #151515;
    --btn-secondary-hover-border: rgba(21, 21, 21, 0.55);

    --btn-accent-bg:           #151515;
    --btn-accent-text:         #f5f5f2;
    --btn-accent-border:       #151515;
    --btn-accent-hover-bg:     #333333;
    --btn-accent-hover-text:   #f5f5f2;
    --btn-accent-hover-border: #333333;

    --btn-ghost-bg:           transparent;
    --btn-ghost-text:         rgba(21, 21, 21, 0.55);
    --btn-ghost-border:       transparent;
    --btn-ghost-hover-bg:     rgba(21, 21, 21, 0.05);
    --btn-ghost-hover-text:   #151515;
    --btn-ghost-hover-border: transparent;

    /* ── Glass tokens для Header ──────────────────── */
    /* hero: поверх тёмного фона */
    --glass-hero-bg:       rgba(17, 17, 17, 0.60);
    --glass-hero-border:   rgba(245, 245, 242, 0.10);
    --glass-hero-text:     rgba(245, 245, 242, 0.92);
    --glass-hero-text-m:   rgba(245, 245, 242, 0.60);
    --glass-hero-cta-bd:   rgba(245, 245, 242, 0.38);
    /* scrolled: поверх светлого фона */
    --glass-scroll-bg:     rgba(245, 245, 242, 0.92);
    --glass-scroll-border: rgba(21, 21, 21, 0.10);
    --glass-scroll-text:   rgba(21, 21, 21, 0.90);
    --glass-scroll-text-m: rgba(21, 21, 21, 0.55);
    --glass-scroll-cta-bd: rgba(21, 21, 21, 0.35);
  }
}
```

- [ ] **Step 2: Удалить блок `[data-theme="dark"]` из global.css целиком**

Найти и удалить весь блок:
```
/* Dark theme */
[data-theme="dark"] {
  ...
}
```
Если он находится внутри `@layer base`, удалить только вложенный блок `[data-theme="dark"] { ... }`.

- [ ] **Step 3: Найти и удалить все `:global([data-theme="dark"])` стили если они есть в global.css**

```bash
grep -n 'data-theme' "/Users/utopo4ek/Projects/Portfolio land/photographer-site/src/styles/global.css"
```

Вручную удалить найденные блоки (если есть после шага 2).

- [ ] **Step 4: Коммит**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/photographer-site"
git add src/styles/global.css
git commit -m "feat: b&w design tokens, remove dark theme"
```

---

## Task 4: BaseLayout — удалить theme-script, добавить шрифты

**Files:**
- Modify: `src/layouts/BaseLayout.astro`

- [ ] **Step 1: Удалить inline theme-script из `<head>`**

Найти в BaseLayout.astro блок:
```html
<!-- Anti-flash: resolve theme and add .js class before first paint -->
<script is:inline>
  (function () {
    document.documentElement.classList.add('js');
    var key = 'starter-theme';
    ...
  })();
</script>
```
И удалить его целиком.

- [ ] **Step 2: Удалить body-script с логикой reveal + theme из `<body>`**

Найти в BaseLayout.astro весь `<script>` в `<body>` (начинается со строки `let revealObserver: IntersectionObserver | null = null;`) и заменить его на пустой скрипт активации `.js` класса:

```html
<script is:inline>
  document.documentElement.classList.add('js');
</script>
```

- [ ] **Step 3: Обновить Google Fonts — добавить Cormorant Garamond**

Найти строку:
```html
<link
  href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500&display=swap"
  rel="stylesheet"
/>
```
Заменить на:
```html
<link
  href="https://fonts.googleapis.com/css2?family=Cormorant+Garamond:ital,wght@0,300;0,400;0,500;1,300;1,400&family=Inter:wght@300;400;500&display=swap"
  rel="stylesheet"
/>
```

- [ ] **Step 4: Удалить ClientRouter (view transitions не нужны)**

Найти и удалить:
```
import { ClientRouter } from 'astro:transitions';
```
и
```
<ClientRouter fallback="none" />
```

- [ ] **Step 5: Обновить `<html lang>` атрибут**

Убедиться что: `<html lang={siteConfig.locale}>` — уже корректно (locale = 'ru').

- [ ] **Step 6: Коммит**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/photographer-site"
git add src/layouts/BaseLayout.astro
git commit -m "feat: remove theme system, add Cormorant Garamond, remove view transitions"
```

---

## Task 5: Header — удалить theme-switcher

**Files:**
- Modify: `src/components/layout/Header.astro`

- [ ] **Step 1: Удалить `<!-- Theme switcher -->` блок из desktop header**

Найти блок `<!-- Theme switcher -->` с `<div class="theme-switcher relative">` и удалить его целиком (с открывающего `<div class="theme-switcher relative">` до закрывающего `</div>`).

- [ ] **Step 2: Удалить `<!-- Mobile theme switcher -->` из mobile menu**

Найти `<div class="mobile-theme-switcher flex flex-wrap gap-3 pt-4">` в mobile menu и удалить весь блок с тремя кнопками темы.

- [ ] **Step 3: Удалить `<style>` блок `.theme-btn`, `.theme-menu`, `.theme-menu-item`, `.mobile-theme-btn` из `<style>` секции**

Удалить следующие CSS-блоки из `<style>`:
- `/* ─── Theme button ───────────────────────────── */` и `.theme-btn { ... }`
- `/* ─── Theme dropdown menu ────────────────────── */` и `.theme-menu { ... }`, `.theme-menu-item { ... }`
- `/* ─── Mobile theme switcher ──────────────────── */` и `.mobile-theme-btn { ... }`

- [ ] **Step 4: Заменить весь `<script>` в Header на упрощённую версию без theme-логики**

Удалить весь `<script>` блок и заменить на:

```html
<script>
  let menuOpen = false;

  function resolveHeaderState() {
    const header = document.getElementById('site-header');
    if (!header) return;
    const hero = document.getElementById('hero');
    if (!hero) { header.dataset.state = 'scrolled'; return; }
    header.dataset.state = hero.getBoundingClientRect().bottom < 72 ? 'scrolled' : 'hero';
  }

  function closeMobileMenu() {
    const burgerBtn = document.getElementById('burger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    menuOpen = false;
    mobileMenu?.classList.remove('is-open');
    mobileMenu?.setAttribute('aria-hidden', 'true');
    burgerBtn?.setAttribute('aria-expanded', 'false');
    document.body.style.overflow = '';
  }

  function openMobileMenu() {
    const burgerBtn = document.getElementById('burger-btn');
    const mobileMenu = document.getElementById('mobile-menu');
    if (!burgerBtn || !mobileMenu) return;
    menuOpen = true;
    mobileMenu.classList.add('is-open');
    mobileMenu.setAttribute('aria-hidden', 'false');
    burgerBtn.setAttribute('aria-expanded', 'true');
    document.body.style.overflow = 'hidden';
  }

  function initHeader() {
    resolveHeaderState();
    if (document.documentElement.dataset.headerScrollBound !== 'true') {
      document.documentElement.dataset.headerScrollBound = 'true';
      window.addEventListener('scroll', resolveHeaderState, { passive: true });
    }
    const burgerBtn = document.getElementById('burger-btn');
    const closeBtn = document.getElementById('close-menu');
    const mobileMenu = document.getElementById('mobile-menu');
    if (burgerBtn && !burgerBtn.dataset.bound) {
      burgerBtn.dataset.bound = 'true';
      burgerBtn.addEventListener('click', () => menuOpen ? closeMobileMenu() : openMobileMenu());
    }
    if (closeBtn && !closeBtn.dataset.bound) {
      closeBtn.dataset.bound = 'true';
      closeBtn.addEventListener('click', closeMobileMenu);
    }
    mobileMenu?.querySelectorAll('[data-close-menu]').forEach(link => {
      if ((link as HTMLElement).dataset.bound) return;
      (link as HTMLElement).dataset.bound = 'true';
      link.addEventListener('click', closeMobileMenu);
    });
    if (!document.documentElement.dataset.escBound) {
      document.documentElement.dataset.escBound = 'true';
      document.addEventListener('keydown', (e) => { if (e.key === 'Escape' && menuOpen) closeMobileMenu(); });
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initHeader, { once: true });
  } else {
    initHeader();
  }
  document.addEventListener('astro:page-load', initHeader);
</script>
```

- [ ] **Step 5: Проверка — grep на theme в Header**

```bash
grep -n "theme\|dark\|light\|system" "/Users/utopo4ek/Projects/Portfolio land/photographer-site/src/components/layout/Header.astro"
```

Ожидаемый результат: нет совпадений (или только если слова встречаются в обычном тексте, не как часть theme-логики).

- [ ] **Step 6: Коммит**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/photographer-site"
git add src/components/layout/Header.astro
git commit -m "feat: remove theme switcher from header"
```

---

## Task 6: global.css — типографика serif + утилиты для тёмных секций

**Files:**
- Modify: `src/styles/global.css`

- [ ] **Step 1: Добавить CSS-переменные шрифтов и базовые стили**

Найти в global.css после блока `@layer base { :root { ... } }` добавить:

```css
@layer base {
  html {
    font-family: 'Inter', sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
  }

  h1, h2, h3 {
    font-family: 'Cormorant Garamond', 'Georgia', serif;
  }
}
```

- [ ] **Step 2: Добавить утилиты для тёмных секций**

В конец `@layer components` (или после блока `.btn-submit`) добавить:

```css
  /* ── Dark section tokens (фотограф) ────────────── */
  .section-dark {
    --color-bg:       #111111;
    --color-bg-warm:  #1a1a1a;
    --color-fg:       #f4f4f0;
    --color-fg-muted: rgba(244, 244, 240, 0.60);
    --color-fg-subtle: rgba(244, 244, 240, 0.38);
    --color-border:   rgba(244, 244, 240, 0.12);
    background-color: #111111;
    color: #f4f4f0;
  }

  .section-light {
    background-color: var(--color-bg);
    color: var(--color-fg);
  }
```

- [ ] **Step 3: Коммит**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/photographer-site"
git add src/styles/global.css
git commit -m "feat: add serif font base styles and dark section utility"
```

---

## Task 7: Hero — секция фотографа (тёмный фон, имя, CTA)

**Files:**
- Modify: `src/components/sections/Hero.astro`

- [ ] **Step 1: Полностью заменить содержимое Hero.astro**

```astro
---
import Button from '../ui/Button.astro';
import { siteConfig } from '../../config/site';
---

<section
  id="hero"
  class="section-dark relative min-h-screen flex flex-col justify-end overflow-hidden"
  aria-label="Главный экран"
>
  <!-- Background image placeholder -->
  <div class="absolute inset-0 z-0" aria-hidden="true">
    <img
      src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=1600&q=80"
      alt=""
      class="w-full h-full object-cover"
      style="filter: grayscale(1) brightness(0.45);"
      loading="eager"
      decoding="async"
    />
    <!-- Dark overlay -->
    <div class="absolute inset-0" style="background: linear-gradient(to top, rgba(17,17,17,0.85) 0%, rgba(17,17,17,0.30) 60%, rgba(17,17,17,0.15) 100%);"></div>
  </div>

  <!-- Content -->
  <div class="container-site relative z-10 pb-16 md:pb-24 pt-28">
    <div class="max-w-3xl">
      <!-- Label -->
      <p class="mb-4 text-[rgba(244,244,240,0.55)] tracking-[0.22em] uppercase" style="font-size: 0.6875rem; font-weight: 500;">
        PHOTOGRAPHER
      </p>

      <!-- Name -->
      <h1
        class="mb-6"
        style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: clamp(3rem, 8vw, 7rem); font-weight: 300; letter-spacing: -0.01em; line-height: 1.0; color: #f4f4f0;"
      >
        Анна<br />Смирнова
      </h1>

      <!-- Divider -->
      <div class="mb-6" style="width: 4rem; height: 1px; background: rgba(244,244,240,0.35);"></div>

      <!-- Description -->
      <p class="mb-4 max-w-md" style="color: rgba(244,244,240,0.72); font-size: 1rem; line-height: 1.65;">
        Индивидуальные, семейные и love story съёмки<br class="hidden sm:block" />в естественном чёрно-белом стиле.
      </p>

      <!-- Stats -->
      <div class="flex flex-wrap gap-x-8 gap-y-2 mb-10" style="color: rgba(244,244,240,0.50); font-size: 0.75rem; letter-spacing: 0.08em; text-transform: uppercase;">
        <span>Более 6 лет опыта</span>
        <span>Победитель локальных фотоконкурсов</span>
      </div>

      <!-- CTA -->
      <Button href={siteConfig.cta.href} variant="secondary" size="md">
        Записаться на съёмку
      </Button>
    </div>
  </div>

  <!-- Scroll hint -->
  <div class="absolute bottom-8 right-8 flex flex-col items-center gap-3 z-10" aria-hidden="true" style="opacity: 0.35;">
    <span style="writing-mode: vertical-lr; letter-spacing: 0.18em; font-size: 0.52rem; font-weight: 500; text-transform: uppercase; color: #f4f4f0;">scroll</span>
    <div style="width: 1px; height: 3rem; background: #f4f4f0;"></div>
  </div>
</section>

<style>
  .hero-section {
    min-height: 100svh;
  }
  /* Override btn-secondary for dark background */
  #hero .btn-secondary {
    --btn-secondary-bg:           transparent;
    --btn-secondary-text:         #f4f4f0;
    --btn-secondary-border:       rgba(244, 244, 240, 0.45);
    --btn-secondary-hover-bg:     rgba(244, 244, 240, 0.10);
    --btn-secondary-hover-text:   #f4f4f0;
    --btn-secondary-hover-border: rgba(244, 244, 240, 0.80);
  }
</style>
```

- [ ] **Step 2: Коммит**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/photographer-site"
git add src/components/sections/Hero.astro
git commit -m "feat: hero section for photographer"
```

---

## Task 8: About — секция "Обо мне"

**Files:**
- Modify: `src/components/sections/About.astro`

- [ ] **Step 1: Полностью заменить содержимое About.astro**

```astro
---
// About section — light background
---

<section id="about" class="section-light section-padding">
  <div class="container-site">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24 items-center">

      <!-- Left: text -->
      <div>
        <span class="label-tag">Обо мне</span>
        <div class="divider my-4"></div>

        <h2
          class="mt-6 mb-8"
          style="font-size: clamp(1.75rem, 4vw, 3rem); font-weight: 300; letter-spacing: -0.01em; line-height: 1.15;"
        >
          Живые эмоции,<br />честные кадры
        </h2>

        <p class="mb-5 leading-relaxed" style="color: var(--color-fg-muted); font-size: 1rem; line-height: 1.7;">
          Привет, я Анна — фотограф с большой любовью к живым эмоциям и честным кадрам. Моя цель — заметить самые важные моменты вашей жизни и сохранить их в спокойной, эстетичной визуальной истории.
        </p>

        <p class="leading-relaxed" style="color: var(--color-fg-muted); font-size: 1rem; line-height: 1.7;">
          Работаю в строгой чёрно-белой эстетике — без фильтров и перегруза. Каждая съёмка — это маленькая история, рассказанная через свет и детали.
        </p>
      </div>

      <!-- Right: photos -->
      <div class="grid grid-cols-2 gap-4">
        <div class="col-span-2 aspect-[4/3] overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80"
            alt="Портрет фотографа Анны Смирновой"
            class="w-full h-full object-cover"
            style="filter: grayscale(1);"
            loading="lazy"
          />
        </div>
        <div class="aspect-square overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=600&q=80"
            alt="Рабочий момент на съёмке"
            class="w-full h-full object-cover"
            style="filter: grayscale(1);"
            loading="lazy"
          />
        </div>
        <div class="aspect-square overflow-hidden">
          <img
            src="https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=600&q=80"
            alt="Детали фотоаппарата"
            class="w-full h-full object-cover"
            style="filter: grayscale(1);"
            loading="lazy"
          />
        </div>
      </div>

    </div>
  </div>
</section>
```

- [ ] **Step 2: Коммит**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/photographer-site"
git add src/components/sections/About.astro
git commit -m "feat: about section for photographer"
```

---

## Task 9: WhyMe — новая секция "Почему я?"

**Files:**
- Create: `src/components/sections/WhyMe.astro`

- [ ] **Step 1: Создать файл WhyMe.astro**

```astro
---
const reasons = [
  {
    number: '01',
    title: 'Индивидуальный подход',
    desc: 'Помогаю расслабиться в кадре и подбираю формат съёмки под вашу историю.',
  },
  {
    number: '02',
    title: 'Естественные эмоции',
    desc: 'Не заставляю позировать искусственно — ловлю живые моменты.',
  },
  {
    number: '03',
    title: 'Спокойная обработка',
    desc: 'Чистый чёрно-белый стиль без перегруза и модных фильтров.',
  },
  {
    number: '04',
    title: 'Быстрая отдача',
    desc: 'Первые кадры — в течение нескольких дней после съёмки.',
  },
];
---

<section id="why" class="section-dark section-padding">
  <div class="container-site">
    <div class="mb-14 md:mb-20">
      <span class="label-tag" style="color: rgba(244,244,240,0.45);">Почему я?</span>
      <div class="divider my-4" style="background: rgba(244,244,240,0.15);"></div>
      <h2
        class="mt-6"
        style="font-size: clamp(1.5rem, 3.5vw, 2.75rem); font-weight: 300; letter-spacing: -0.01em; color: #f4f4f0;"
      >
        Что отличает мою работу
      </h2>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-0">
      {reasons.map((item) => (
        <div class="why-card py-8 pr-8 border-t" style="border-color: rgba(244,244,240,0.12);">
          <p class="mb-4 font-light" style="font-size: 2rem; color: rgba(244,244,240,0.20); font-family: 'Cormorant Garamond', Georgia, serif;">{item.number}</p>
          <h3 class="mb-3 text-sm font-medium tracking-wide" style="color: #f4f4f0; text-transform: uppercase; letter-spacing: 0.08em;">{item.title}</h3>
          <p class="text-sm leading-relaxed" style="color: rgba(244,244,240,0.55);">{item.desc}</p>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Коммит**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/photographer-site"
git add src/components/sections/WhyMe.astro
git commit -m "feat: why me section"
```

---

## Task 10: Services — карточки услуг фотографа

**Files:**
- Modify: `src/components/sections/Services.astro`

- [ ] **Step 1: Полностью заменить содержимое Services.astro**

```astro
---
import Button from '../ui/Button.astro';

const services = [
  {
    title: 'Портретная съёмка',
    price: 'от 6 000 ₽',
    desc: '1 час съёмки, помощь с позированием, 20 обработанных фото.',
    tags: ['1 час', '20 фото', 'Позирование'],
  },
  {
    title: 'Семейная съёмка',
    price: 'от 9 000 ₽',
    desc: 'Тёплая прогулка или домашняя съёмка для всей семьи.',
    tags: ['1.5 часа', '30 фото', 'Прогулка или дома'],
  },
  {
    title: 'Love Story',
    price: 'от 8 000 ₽',
    desc: 'История пары в естественном стиле без постановочной искусственности.',
    tags: ['1.5 часа', '25 фото', 'История пары'],
  },
  {
    title: 'Контентная съёмка',
    price: 'от 7 000 ₽',
    desc: 'Портреты для экспертов, блогов и личного бренда.',
    tags: ['1 час', '20 фото', 'Личный бренд'],
  },
];
---

<section id="services" class="section-light section-padding">
  <div class="container-site">
    <div class="mb-14 md:mb-20">
      <span class="label-tag">Услуги</span>
      <div class="divider my-4"></div>
      <h2
        class="mt-6"
        style="font-size: clamp(1.5rem, 3.5vw, 2.75rem); font-weight: 300; letter-spacing: -0.01em;"
      >
        Форматы съёмок
      </h2>
    </div>

    <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-px" style="background: var(--color-border);">
      {services.map((service) => (
        <div class="service-card flex flex-col p-8" style="background: var(--color-bg);">
          <h3 class="mb-2 text-base font-medium tracking-tight">{service.title}</h3>
          <p
            class="mb-4"
            style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 1.5rem; font-weight: 300; color: var(--color-fg);"
          >
            {service.price}
          </p>
          <p class="mb-5 text-sm leading-relaxed flex-1" style="color: var(--color-fg-muted);">
            {service.desc}
          </p>
          <div class="flex flex-wrap gap-1.5 mb-6">
            {service.tags.map((tag) => (
              <span class="text-xs px-2.5 py-1 border" style="border-color: var(--color-border); color: var(--color-fg-muted); letter-spacing: 0.04em;">
                {tag}
              </span>
            ))}
          </div>
          <Button href="/#contacts" variant="secondary" size="sm">
            Записаться
          </Button>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Коммит**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/photographer-site"
git add src/components/sections/Services.astro
git commit -m "feat: services section with photographer pricing"
```

---

## Task 11: Portfolio — CSS-grid галерея

**Files:**
- Create: `src/components/sections/Portfolio.astro`

- [ ] **Step 1: Создать файл Portfolio.astro**

```astro
---
const photos = [
  {
    src: 'https://images.unsplash.com/photo-1531746020798-e6953c6e8e04?w=800&q=80',
    alt: 'Портрет девушки в чёрно-белом стиле',
    span: 'col-span-1 row-span-2',
  },
  {
    src: 'https://images.unsplash.com/photo-1542038784456-1ea8e935640e?w=800&q=80',
    alt: 'Семейная фотосессия',
    span: 'col-span-1 row-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1607462109225-6b64ae2dd3cb?w=800&q=80',
    alt: 'Love story съёмка',
    span: 'col-span-1 row-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&q=80',
    alt: 'Детали фотосъёмки',
    span: 'col-span-1 row-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1502920917128-1aa500764cbd?w=800&q=80',
    alt: 'Портрет для личного бренда',
    span: 'col-span-1 row-span-2',
  },
  {
    src: 'https://images.unsplash.com/photo-1504703395950-b89145a5425b?w=800&q=80',
    alt: 'Детская фотосессия',
    span: 'col-span-1 row-span-1',
  },
  {
    src: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&q=80',
    alt: 'Свадебная съёмка в чёрно-белом',
    span: 'col-span-2 row-span-1',
  },
];
---

<section id="portfolio" class="section-dark section-padding">
  <div class="container-site">
    <div class="mb-14 md:mb-20">
      <span class="label-tag" style="color: rgba(244,244,240,0.45);">Портфолио</span>
      <div class="divider my-4" style="background: rgba(244,244,240,0.15);"></div>
      <h2
        class="mt-6"
        style="font-size: clamp(1.5rem, 3.5vw, 2.75rem); font-weight: 300; letter-spacing: -0.01em; color: #f4f4f0;"
      >
        Результаты работы
      </h2>
    </div>

    <!-- Desktop grid -->
    <div class="portfolio-grid hidden md:grid">
      {photos.map((photo) => (
        <div class={`portfolio-item ${photo.span} overflow-hidden`}>
          <img
            src={photo.src}
            alt={photo.alt}
            class="w-full h-full object-cover"
            style="filter: grayscale(1);"
            loading="lazy"
          />
        </div>
      ))}
    </div>

    <!-- Mobile: 2-column simple grid -->
    <div class="grid grid-cols-2 gap-2 md:hidden">
      {photos.map((photo) => (
        <div class="aspect-square overflow-hidden">
          <img
            src={photo.src}
            alt={photo.alt}
            class="w-full h-full object-cover"
            style="filter: grayscale(1);"
            loading="lazy"
          />
        </div>
      ))}
    </div>
  </div>
</section>

<style>
  .portfolio-grid {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    grid-auto-rows: 280px;
    gap: 6px;
  }

  .portfolio-item img {
    transition: transform 400ms ease;
  }
  .portfolio-item:hover img {
    transform: scale(1.03);
  }
</style>
```

- [ ] **Step 2: Коммит**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/photographer-site"
git add src/components/sections/Portfolio.astro
git commit -m "feat: portfolio grid section"
```

---

## Task 12: Reviews — карточки отзывов

**Files:**
- Create: `src/components/sections/Reviews.astro`

- [ ] **Step 1: Создать файл Reviews.astro**

```astro
---
const reviews = [
  {
    name: 'Мария К.',
    type: 'Семейная съёмка',
    text: 'Анна помогла нам расслабиться, и съёмка прошла очень легко. Фотографии получились живыми и настоящими.',
  },
  {
    name: 'Елена В.',
    type: 'Love Story',
    text: 'Очень понравилась атмосфера и результат. Всё спокойно, красиво и без лишней постановки.',
  },
  {
    name: 'Ирина и Сергей',
    type: 'Семейная съёмка',
    text: 'Получили фотографии быстрее, чем ожидали. Теперь это наши любимые семейные кадры.',
  },
];
---

<section id="reviews" class="section-light section-padding">
  <div class="container-site">
    <div class="mb-14 md:mb-20">
      <span class="label-tag">Отзывы</span>
      <div class="divider my-4"></div>
      <h2
        class="mt-6"
        style="font-size: clamp(1.5rem, 3.5vw, 2.75rem); font-weight: 300; letter-spacing: -0.01em;"
      >
        Отзывы моих клиентов
      </h2>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-3 gap-px" style="background: var(--color-border);">
      {reviews.map((review) => (
        <div class="review-card p-8 flex flex-col gap-6" style="background: var(--color-bg);">
          <!-- Quote mark -->
          <div aria-hidden="true" style="font-family: 'Cormorant Garamond', Georgia, serif; font-size: 4rem; line-height: 1; color: var(--color-border); font-weight: 300;">"</div>
          <p class="text-base leading-relaxed flex-1" style="color: var(--color-fg-muted);">
            {review.text}
          </p>
          <div class="border-t pt-6" style="border-color: var(--color-border);">
            <p class="text-sm font-medium" style="color: var(--color-fg);">{review.name}</p>
            <p class="text-xs mt-1 tracking-wide uppercase" style="color: var(--color-fg-subtle); letter-spacing: 0.08em;">{review.type}</p>
          </div>
        </div>
      ))}
    </div>
  </div>
</section>
```

- [ ] **Step 2: Коммит**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/photographer-site"
git add src/components/sections/Reviews.astro
git commit -m "feat: reviews section"
```

---

## Task 13: ContactSection — форма записи на съёмку

**Files:**
- Modify: `src/components/sections/ContactSection.astro`

- [ ] **Step 1: Полностью заменить содержимое ContactSection.astro**

Использовать существующий backend, поменять только контент и тип выбора:

```astro
---
import Button from '../ui/Button.astro';
import TextField from '../ui/TextField.astro';
import PhoneField from '../ui/PhoneField.astro';
import CustomSelect from '../ui/CustomSelect.astro';
import TextareaField from '../ui/TextareaField.astro';
import Icon from '../ui/Icon.astro';
import { siteConfig } from '../../config/site';

const shootTypes = [
  { value: 'portrait', label: 'Портретная' },
  { value: 'family', label: 'Семейная' },
  { value: 'lovestory', label: 'Love Story' },
  { value: 'content', label: 'Контентная' },
  { value: 'other', label: 'Другое' },
];
---

<section id="contacts" class="section-dark section-padding">
  <div class="container-site">
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-16 lg:gap-24">

      <!-- Left: info -->
      <div>
        <span class="label-tag" style="color: rgba(244,244,240,0.45);">Контакты</span>
        <div class="divider my-4" style="background: rgba(244,244,240,0.15);"></div>
        <h2
          class="mt-6 mb-6"
          style="font-size: clamp(1.5rem, 3.5vw, 2.75rem); font-weight: 300; letter-spacing: -0.01em; color: #f4f4f0;"
        >
          Записаться<br />на съёмку
        </h2>
        <p class="mb-10 leading-relaxed" style="color: rgba(244,244,240,0.60); font-size: 1rem;">
          Напишите мне — обсудим формат, дату и место. Отвечаю в течение дня.
        </p>

        <!-- Contact links -->
        <div class="flex flex-col gap-4 mb-10">
          <a href={siteConfig.contacts.telegram} class="contact-link flex items-center gap-3" target="_blank" rel="noreferrer" aria-label="Telegram">
            <span class="contact-icon"><Icon name="telegram" /></span>
            <span>Telegram</span>
          </a>
          <a href={siteConfig.contacts.whatsapp} class="contact-link flex items-center gap-3" target="_blank" rel="noreferrer" aria-label="WhatsApp">
            <span class="contact-icon"><Icon name="whatsapp" /></span>
            <span>WhatsApp</span>
          </a>
          <a href={siteConfig.contacts.instagram} class="contact-link flex items-center gap-3" target="_blank" rel="noreferrer" aria-label="Instagram">
            <span class="contact-icon"><Icon name="instagram" /></span>
            <span>Instagram</span>
          </a>
          <a href={`mailto:${siteConfig.contacts.email}`} class="contact-link flex items-center gap-3" aria-label="Email">
            <span class="contact-icon">
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.7" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                <rect x="2" y="4" width="20" height="16" rx="2"/>
                <polyline points="2,4 12,13 22,4"/>
              </svg>
            </span>
            <span>{siteConfig.contacts.email}</span>
          </a>
        </div>
      </div>

      <!-- Right: form -->
      <div>
        <form
          id="contact-form"
          class="flex flex-col gap-5"
          novalidate
          data-endpoint={siteConfig.forms.contactEndpoint}
          data-source={siteConfig.forms.source}
        >
          <TextField id="field-name" name="name" label="Имя" autocomplete="name" required placeholder="Ваше имя" error="Пожалуйста, укажите ваше имя" />
          <PhoneField id="field-phone" name="phone" label="Телефон" required error="Пожалуйста, укажите ваш телефон" />
          <TextField id="field-email" name="email" label="Email" type="email" autocomplete="email" placeholder="your@email.com" />
          <CustomSelect id="field-type" name="service" label="Тип съёмки" placeholder="Выберите тип съёмки" options={shootTypes} required error="Пожалуйста, выберите тип съёмки" />
          <TextareaField id="field-comment" name="comment" label="Комментарий" rows={4} placeholder="Расскажите о пожеланиях: дата, место, идея..." />

          <!-- Privacy -->
          <div class="flex items-start gap-3">
            <div class="relative mt-0.5 shrink-0">
              <input
                id="field-privacy"
                name="privacy"
                type="checkbox"
                required
                class="w-4 h-4 appearance-none border bg-transparent checked:bg-[#f4f4f0] checked:border-[#f4f4f0] focus:outline-none focus-visible:ring-2 cursor-pointer transition-colors duration-200"
                style="border-color: rgba(244,244,240,0.35);"
              />
              <svg class="absolute inset-0 w-4 h-4 pointer-events-none opacity-0 privacy-check" viewBox="0 0 16 16" fill="none" stroke="#111111" stroke-width="2" aria-hidden="true">
                <polyline points="3,8 6,11 13,4"/>
              </svg>
            </div>
            <label for="field-privacy" class="text-xs leading-relaxed cursor-pointer" style="color: rgba(244,244,240,0.50);">
              Я согласен(а) с <a href={siteConfig.footer.privacyHref} class="underline" style="color: rgba(244,244,240,0.70);">политикой конфиденциальности</a>
            </label>
          </div>
          <p id="privacy-error" class="hidden text-xs text-red-400 -mt-3">Необходимо ваше согласие</p>

          <Button type="submit" variant="submit" size="lg" fullWidth={true} id="submit-btn" class="mt-2">
            <span id="btn-text">Отправить заявку</span>
            <svg id="btn-spinner" class="hidden w-4 h-4 animate-spin" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
              <path d="M12 2a10 10 0 1 0 10 10" stroke-linecap="round"/>
            </svg>
          </Button>

          <!-- Honeypot -->
          <input type="text" name="company" autocomplete="off" tabindex="-1" aria-hidden="true" style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden" />
          <input type="hidden" name="page" />
          <input type="hidden" name="source" />
        </form>

        <!-- Success state -->
        <div id="form-success" class="hidden flex-col items-start gap-4 p-10 border" style="border-color: rgba(244,244,240,0.15); background: rgba(244,244,240,0.04);">
          <div class="w-10 h-10 border flex items-center justify-center" style="border-color: rgba(244,244,240,0.35);">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="#f4f4f0" stroke-width="1.5">
              <polyline points="2,8 6,12 14,4"/>
            </svg>
          </div>
          <h3 class="text-lg font-light tracking-tight" style="color: #f4f4f0;">Заявка принята</h3>
          <p class="text-sm leading-relaxed" style="color: rgba(244,244,240,0.60);">Я свяжусь с вами в ближайшее время. Обычно отвечаю в течение дня.</p>
        </div>

        <!-- Error state -->
        <div id="form-error" class="hidden flex-col items-start gap-4 p-10 border" style="border-color: rgba(239,68,68,0.30);">
          <h3 class="text-lg font-light tracking-tight" style="color: #f4f4f0;">Не удалось отправить</h3>
          <p class="text-sm leading-relaxed" style="color: rgba(244,244,240,0.60);">Попробуйте позже или напишите мне напрямую.</p>
        </div>
      </div>
    </div>
  </div>
</section>

<style>
  .contact-link {
    color: rgba(244, 244, 240, 0.60);
    font-size: 0.875rem;
    transition: color 200ms ease;
  }
  .contact-link:hover { color: #f4f4f0; }
  .contact-icon {
    width: 2rem;
    height: 2rem;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    border: 1px solid rgba(244,244,240,0.18);
    border-radius: 50%;
    flex-shrink: 0;
  }
</style>
```

- [ ] **Step 2: Скопировать `<script>` блок из оригинального ContactSection**

Скопировать весь `<script>` блок из оригинального `astro-business-starter/src/components/sections/ContactSection.astro` — он работает без изменений (маппинг полей уже поддерживает `service` и `comment`).

- [ ] **Step 3: Коммит**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/photographer-site"
git add src/components/sections/ContactSection.astro
git commit -m "feat: contact section for photographer booking"
```

---

## Task 14: Footer — минимальный footer фотографа

**Files:**
- Modify: `src/components/layout/Footer.astro`

- [ ] **Step 1: Полностью заменить содержимое Footer.astro**

```astro
---
import { siteConfig } from '../../config/site';
---

<footer style="background: #0d0d0d; color: rgba(244,244,240,0.55);">
  <div class="container-site py-12">
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 border-b pb-10 mb-8" style="border-color: rgba(244,244,240,0.10);">
      <!-- Brand -->
      <div>
        <a href="/" class="block mb-2 text-sm font-medium tracking-[0.15em] uppercase" style="color: #f4f4f0;">
          {siteConfig.name}
        </a>
        <p class="text-xs leading-relaxed max-w-xs" style="color: rgba(244,244,240,0.42);">
          {siteConfig.footer.tagline}
        </p>
      </div>

      <!-- Social links -->
      <div class="flex gap-5 text-xs tracking-widest uppercase" style="color: rgba(244,244,240,0.42);">
        <a href={siteConfig.contacts.telegram} class="footer-social" target="_blank" rel="noreferrer" aria-label="Telegram">TG</a>
        <a href={siteConfig.contacts.whatsapp} class="footer-social" target="_blank" rel="noreferrer" aria-label="WhatsApp">WA</a>
        <a href={siteConfig.contacts.instagram} class="footer-social" target="_blank" rel="noreferrer" aria-label="Instagram">IG</a>
      </div>
    </div>

    <!-- Bottom -->
    <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
      <p class="text-xs" style="color: rgba(244,244,240,0.30);">
        © {siteConfig.year} {siteConfig.name}. Все права защищены.
      </p>
      <a href={siteConfig.footer.privacyHref} class="text-xs transition-colors duration-200 hover:text-[rgba(244,244,240,0.65)]" style="color: rgba(244,244,240,0.30);">
        Политика конфиденциальности
      </a>
    </div>
  </div>
</footer>

<style>
  .footer-social {
    transition: color 200ms ease;
  }
  .footer-social:hover {
    color: rgba(244, 244, 240, 0.80);
  }
</style>
```

- [ ] **Step 2: Коммит**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/photographer-site"
git add src/components/layout/Footer.astro
git commit -m "feat: minimal photographer footer"
```

---

## Task 15: index.astro — собираем страницу, JSON-LD ProfessionalService

**Files:**
- Modify: `src/pages/index.astro`

- [ ] **Step 1: Полностью заменить содержимое index.astro**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import Header from '../components/layout/Header.astro';
import Footer from '../components/layout/Footer.astro';
import Hero from '../components/sections/Hero.astro';
import About from '../components/sections/About.astro';
import WhyMe from '../components/sections/WhyMe.astro';
import Services from '../components/sections/Services.astro';
import Portfolio from '../components/sections/Portfolio.astro';
import Reviews from '../components/sections/Reviews.astro';
import ContactSection from '../components/sections/ContactSection.astro';
import { siteConfig } from '../config/site';

const jsonLd = {
  "@context": "https://schema.org",
  "@type": "ProfessionalService",
  "name": siteConfig.name,
  "description": siteConfig.description,
  "url": siteConfig.url,
  "image": `${siteConfig.url}${siteConfig.seo.ogImage}`,
  "telephone": siteConfig.contacts.phone,
  "email": siteConfig.contacts.email,
  "serviceType": "Photography",
  "areaServed": "RU",
  "sameAs": [
    siteConfig.contacts.telegram,
    siteConfig.contacts.whatsapp,
    siteConfig.contacts.instagram,
  ],
};
---

<BaseLayout
  title={`${siteConfig.name} — ${siteConfig.description}`}
  description={siteConfig.description}
  jsonLd={jsonLd}
>
  <Header />
  <main>
    <Hero />
    <About />
    <WhyMe />
    <Services />
    <Portfolio />
    <Reviews />
    <ContactSection />
  </main>
  <Footer />
</BaseLayout>
```

- [ ] **Step 2: Коммит**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/photographer-site"
git add src/pages/index.astro
git commit -m "feat: assemble one-page photographer site with JSON-LD ProfessionalService"
```

---

## Task 16: SEO — og-image, robots.txt, astro.config.mjs

**Files:**
- Modify: `public/robots.txt`
- Modify: `public/og-image.jpg` (заменить на нейтральный placeholder)
- Modify: `astro.config.mjs`

- [ ] **Step 1: Обновить robots.txt**

Содержимое `public/robots.txt`:
```
User-agent: *
Allow: /

Sitemap: https://example.com/sitemap-index.xml
```

- [ ] **Step 2: Проверить og-image.jpg**

```bash
ls -la "/Users/utopo4ek/Projects/Portfolio land/photographer-site/public/og-image.jpg"
```

Если файл существует (скопирован из starter) — оставить как есть. Перед production заменить на реальный 1200×630 ч/б файл.

- [ ] **Step 3: Проверить astro.config.mjs — site уже стоит `https://example.com`**

Содержимое должно совпадать:
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

- [ ] **Step 4: Коммит**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/photographer-site"
git add public/robots.txt astro.config.mjs
git commit -m "feat: SEO — robots.txt, sitemap config"
```

---

## Task 17: Проверки — grep, npm run check, npm run build

**Files:** нет изменений, только проверки

- [ ] **Step 1: Grep на чужие бренды**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/photographer-site"
grep -Rni "starter-theme\|theme-switcher\|data-theme\|flovers\|piccolin\|formandlight\|starter brand\|Starter Brand" src public astro.config.mjs
```

Ожидаемый результат: нет совпадений (кроме, возможно, css переменных `--btn-` в global.css — они безвредны).

- [ ] **Step 2: Grep на тему dark/light**

```bash
grep -Rni "localStorage.*theme\|getThemePreference\|syncTheme\|themeMenu\|theme-btn\|theme-menu\|mobile-theme" src
```

Ожидаемый результат: нет совпадений.

- [ ] **Step 3: Проверить og-image и favicon**

```bash
ls -la "/Users/utopo4ek/Projects/Portfolio land/photographer-site/public/og-image.jpg"
ls -la "/Users/utopo4ek/Projects/Portfolio land/photographer-site/public/favicon.ico"
ls -la "/Users/utopo4ek/Projects/Portfolio land/photographer-site/public/favicon.svg"
cat "/Users/utopo4ek/Projects/Portfolio land/photographer-site/public/robots.txt"
```

- [ ] **Step 4: npm run check**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/photographer-site"
npm run check
```

Ожидаемый результат: `0 errors, 0 warnings` или только предупреждения (не ошибки).

- [ ] **Step 5: npm run build**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/photographer-site"
npm run build
```

Ожидаемый результат: успешный билд без ошибок. Если есть ошибки — исправить типы/импорты в соответствующих файлах.

- [ ] **Step 6: Финальный коммит**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/photographer-site"
git add -A
git commit -m "chore: final build verified"
```

---

## Self-Review

**Spec coverage check:**
- [x] Header с навигацией и burger → Task 5
- [x] Hero с тёмным фоном, именем, CTA → Task 7
- [x] About с текстом и фото → Task 8
- [x] Why Me 4 пункта → Task 9
- [x] Services 4 карточки с ценами → Task 10
- [x] Portfolio CSS-grid 7 фото → Task 11
- [x] Reviews 3 карточки → Task 12
- [x] Contact форма с типом съёмки → Task 13
- [x] Footer minimal → Task 14
- [x] JSON-LD ProfessionalService → Task 15
- [x] SEO og-image, robots.txt, sitemap → Task 16
- [x] Удалён theme-switcher → Tasks 3, 4, 5
- [x] Ч/б палитра CSS-токены → Task 3, 6
- [x] Cormorant Garamond шрифт → Tasks 4, 6
- [x] Адаптив — все секции используют responsive классы Tailwind
- [x] Grep проверки → Task 17
- [x] npm check + build → Task 17

**Placeholder check:** нет TBD/TODO в коде. Все блоки содержат реальный контент.

**Type consistency:**
- `siteConfig.contacts` — без `address`, `addressMapsHref`, `vk` (они не нужны для фотографа и не используются в компонентах)
- `WhyMe.astro`, `Portfolio.astro`, `Reviews.astro` — новые файлы, импортируются в index.astro
- Форма в ContactSection: поле `name="service"` → маппится в `payload.service` через существующий contact-form script

---

## Production checklist (после реализации)

Перед запуском в production заменить:
1. **Фотографии** — Unsplash URLs заменить на реальные фото клиента (src/assets/ + Astro Image)
2. **Домен** — `https://example.com` → реальный домен в `astro.config.mjs`, `siteConfig.url`, `robots.txt`
3. **Контакты** — telegram, whatsapp, instagram, email, phone в `siteConfig.contacts`
4. **og-image.jpg** — `public/og-image.jpg` заменить на реальный 1200×630 файл
5. **Имя фотографа** — если нужно откорректировать в `siteConfig`
6. **Netlify env vars** — SMTP/Telegram credentials для contact backend

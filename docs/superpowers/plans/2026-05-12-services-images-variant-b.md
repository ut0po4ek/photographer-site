# Services Pages Images (Variant B) Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add heroImage, cardImage, detailImage, and resultImage fields to each service in `services.ts`, then update service pages to use them — making service detail pages visually rich while keeping the premium, calm aesthetic.

**Architecture:** Extend `Service` type with four new image fields (heroImage replaces the existing `image` field). Update `services/index.astro` cards to use `cardImage`. Update `services/[slug].astro` to: use `heroImage` in hero section, add a wide detail image block after intro, add an image block in the result section, and add preview thumbnails to the "Other services" cards. All images use Unsplash CDN URLs already in use across the site — no downloads required.

**Tech Stack:** Astro, TypeScript, Tailwind CSS v4, Unsplash CDN

---

## Files

- **Modify:** `src/data/services.ts` — extend `Service` type, add image fields to all three services
- **Modify:** `src/pages/services/index.astro` — use `cardImage` in service list cards
- **Modify:** `src/pages/services/[slug].astro` — use `heroImage`, add detailImage block after intro, add resultImage block in result section, add thumbnails to "Other services" cards

---

### Task 1: Extend Service type and add image data

**Files:**
- Modify: `src/data/services.ts`

- [ ] **Step 1: Replace `image?` field with four new image fields in the `Service` type**

In `src/data/services.ts`, replace the existing `image?` block (lines 31–34):

```typescript
export type ServiceImage = {
  src: string;
  alt: string;
};

export type Service = {
  slug: ServiceSlug;
  number: string;
  title: string;
  shortTitle: string;
  category: string;
  description: string;
  heroText: string;
  intro: string[];
  heroImage?: ServiceImage;
  cardImage?: ServiceImage;
  detailImage?: ServiceImage;
  resultImage?: ServiceImage;
  facts: ServiceFact[];
  features: ServiceFeature[];
  steps: ServiceStep[];
  deliverables: ServiceDeliverable[];
  result: string;
  projectCategories: ProjectCategory[];
};
```

- [ ] **Step 2: Add image data for "architecture" service**

Replace the existing `image` field in the `architecture` service object with four separate fields:

```typescript
heroImage: {
  src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=1400&q=80&auto=format&fit=crop',
  alt: 'Современный загородный дом — бетон, дерево, панорамное остекление',
},
cardImage: {
  src: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?w=800&q=75&auto=format&fit=crop',
  alt: 'Архитектурное проектирование — частный дом',
},
detailImage: {
  src: 'https://images.unsplash.com/photo-1486325212027-8081e485255e?w=1400&q=80&auto=format&fit=crop',
  alt: 'Архитектурная деталь фасада — материалы, свет, объём',
},
resultImage: {
  src: 'https://images.unsplash.com/photo-1570129477492-45c003edd2be?w=1400&q=80&auto=format&fit=crop',
  alt: 'Готовый проект частного дома с продуманной планировкой',
},
```

- [ ] **Step 3: Add image data for "interior-design" service**

Replace the existing `image` field in the `interior-design` service object:

```typescript
heroImage: {
  src: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=1400&q=80&auto=format&fit=crop',
  alt: 'Спокойный современный интерьер с натуральными материалами',
},
cardImage: {
  src: 'https://images.unsplash.com/photo-1583847268964-b28dc8f51f92?w=800&q=75&auto=format&fit=crop',
  alt: 'Дизайн интерьеров — тёплый минимализм',
},
detailImage: {
  src: 'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?w=1400&q=80&auto=format&fit=crop',
  alt: 'Гостиная с панорамным видом — натуральное дерево, мягкий свет',
},
resultImage: {
  src: 'https://images.unsplash.com/photo-1564078516393-cf04bd966897?w=1400&q=80&auto=format&fit=crop',
  alt: 'Завершённый интерьер спальни — спокойствие, фактуры, свет',
},
```

- [ ] **Step 4: Add image data for "development-concepts" service**

Replace the existing `image` field in the `development-concepts` service object:

```typescript
heroImage: {
  src: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=1400&q=80&auto=format&fit=crop',
  alt: 'Камерный посёлок среди леса — концепция жилой среды',
},
cardImage: {
  src: 'https://images.unsplash.com/photo-1523217582562-09d0def993a6?w=800&q=75&auto=format&fit=crop',
  alt: 'Девелоперские концепции — посёлки и жилые кварталы',
},
detailImage: {
  src: 'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?w=1400&q=80&auto=format&fit=crop',
  alt: 'Природный ландшафт — основа архитектурной концепции среды',
},
resultImage: {
  src: 'https://images.unsplash.com/photo-1439066615861-d1af74d74000?w=1400&q=80&auto=format&fit=crop',
  alt: 'Концептуальный мастер-план — пешеходные сценарии и общественные пространства',
},
```

- [ ] **Step 5: Verify TypeScript compiles**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/DgVision-site" && npx astro check 2>&1 | tail -20
```

Expected: no errors related to `service.image` or `ServiceImage`

---

### Task 2: Update /services index page to use cardImage

**Files:**
- Modify: `src/pages/services/index.astro`

- [ ] **Step 1: Replace `service.image` references with `service.cardImage` in the list card**

In `src/pages/services/index.astro`, find the image block inside the `article` (around line 89–101) and replace:

```astro
<div class="hidden lg:block w-full aspect-[4/3] relative overflow-hidden bg-stone-800">
  {service.cardImage && (
    <img
      src={service.cardImage.src}
      alt={service.cardImage.alt}
      loading="lazy"
      decoding="async"
      width="420"
      height="315"
      class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.04]"
    />
  )}
  {!service.cardImage && (
    <div class="arch-placeholder absolute inset-0" aria-hidden="true"></div>
  )}
  <div class="absolute inset-0 bg-gradient-to-t from-black/35 via-transparent to-transparent pointer-events-none" aria-hidden="true"></div>
</div>
```

- [ ] **Step 2: Build and verify no errors**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/DgVision-site" && npm run build 2>&1 | tail -20
```

Expected: Build succeeds, no TypeScript errors

---

### Task 3: Update service detail page — hero, detailImage block, resultImage block, other services thumbnails

**Files:**
- Modify: `src/pages/services/[slug].astro`

- [ ] **Step 1: Update hero section to use heroImage**

In `src/pages/services/[slug].astro`, find the hero image block (around lines 74–92) and replace `service.image` with `service.heroImage`:

```astro
<div class="service-visual relative aspect-[4/5] md:aspect-[5/4] lg:aspect-[4/5] overflow-hidden bg-stone-800" data-reveal="scale" data-reveal-delay="250">
  {service.heroImage ? (
    <img
      src={service.heroImage.src}
      alt={service.heroImage.alt}
      width="900"
      height="1125"
      fetchpriority="high"
      decoding="async"
      class="absolute inset-0 w-full h-full object-cover"
    />
  ) : (
    <div class="arch-placeholder absolute inset-0" aria-hidden="true"></div>
  )}
  <div class="absolute inset-0 bg-gradient-to-t from-black/45 via-transparent to-transparent pointer-events-none" aria-hidden="true"></div>
  <div class="absolute left-6 bottom-6 right-6">
    <p class="label-tag text-white/70">{service.shortTitle}</p>
  </div>
</div>
```

- [ ] **Step 2: Add detailImage block after the intro section**

After the closing `</section>` of the intro section (the one with "Что входит", around line 116), insert a new section:

```astro
{service.detailImage && (
  <section class="bg-[var(--color-bg)] px-0 md:px-0 overflow-hidden" aria-hidden="false">
    <div class="container-site">
      <div class="reveal aspect-[16/7] md:aspect-[21/8] relative overflow-hidden">
        <img
          src={service.detailImage.src}
          alt={service.detailImage.alt}
          loading="lazy"
          decoding="async"
          width="1400"
          height="525"
          class="absolute inset-0 w-full h-full object-cover"
        />
      </div>
    </div>
  </section>
)}
```

- [ ] **Step 3: Add resultImage block inside the result section**

In the "Результат" section (around lines 161–185), add an image column. Replace the current two-column grid with a three-column version that includes an image when `resultImage` is available.

Replace the existing result section's inner grid:

```astro
<section class="section-padding section-adaptive">
  <div class="container-site">
    {service.resultImage ? (
      <div class="grid grid-cols-1 lg:grid-cols-3 gap-12 lg:gap-16 items-start">
        <div class="lg:col-span-1">
          <span class="label-tag text-[var(--color-fg-subtle)] reveal">Результат</span>
          <div class="divider my-4 reveal reveal-delay-1" style="background-color: var(--color-accent);"></div>
          <h2 class="mt-6 mb-5 text-[var(--color-fg)] reveal reveal-delay-2" style="font-size: clamp(1.5rem, 3.5vw, 2.75rem); font-weight: 300; letter-spacing: -0.02em; line-height: 1.1;">
            Что вы получаете
          </h2>
          <p class="text-[var(--color-fg-muted)] text-base leading-relaxed reveal reveal-delay-3">
            {service.result}
          </p>
        </div>

        <div class="lg:col-span-1 reveal reveal-delay-2">
          <div class="aspect-[3/4] relative overflow-hidden bg-stone-800">
            <img
              src={service.resultImage.src}
              alt={service.resultImage.alt}
              loading="lazy"
              decoding="async"
              width="560"
              height="747"
              class="absolute inset-0 w-full h-full object-cover"
            />
          </div>
        </div>

        <ul class="lg:col-span-1 grid grid-cols-1 gap-3">
          {service.deliverables.map((item, i) => (
            <li class={`reveal reveal-delay-${Math.min(i + 1, 5)} flex items-start gap-3 p-5 bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-fg-muted)]`}>
              <span class="mt-2 h-px w-5 shrink-0 bg-[var(--color-accent)]" aria-hidden="true"></span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    ) : (
      <div class="grid grid-cols-1 lg:grid-cols-[0.9fr_1.1fr] gap-12 lg:gap-20 items-start">
        <div>
          <span class="label-tag text-[var(--color-fg-subtle)] reveal">Результат</span>
          <div class="divider my-4 reveal reveal-delay-1" style="background-color: var(--color-accent);"></div>
          <h2 class="mt-6 mb-5 text-[var(--color-fg)] reveal reveal-delay-2" style="font-size: clamp(1.5rem, 3.5vw, 2.75rem); font-weight: 300; letter-spacing: -0.02em; line-height: 1.1;">
            Что вы получаете
          </h2>
          <p class="text-[var(--color-fg-muted)] text-base leading-relaxed reveal reveal-delay-3">
            {service.result}
          </p>
        </div>
        <ul class="grid grid-cols-1 sm:grid-cols-2 gap-3">
          {service.deliverables.map((item, i) => (
            <li class={`reveal reveal-delay-${Math.min(i + 1, 5)} flex items-start gap-3 p-5 bg-[var(--color-bg)] border border-[var(--color-border)] text-sm text-[var(--color-fg-muted)]`}>
              <span class="mt-2 h-px w-5 shrink-0 bg-[var(--color-accent)]" aria-hidden="true"></span>
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
    )}
  </div>
</section>
```

- [ ] **Step 4: Add preview thumbnails to "Other services" cards**

In the "Другие услуги" section (around lines 236–261), update each `<a>` card to include a thumbnail image at the top. Replace the existing map block:

```astro
<div class="grid grid-cols-1 md:grid-cols-2 gap-6 mt-10">
  {otherServices.map((item, i) => (
    <a
      href={`/services/${item.slug}`}
      class={`reveal reveal-delay-${i + 1} group block overflow-hidden bg-[var(--color-bg)] border border-[var(--color-border)] hover:border-[var(--color-accent)] transition-colors duration-300`}
    >
      <div class="aspect-[16/7] relative overflow-hidden bg-stone-800">
        {item.cardImage ? (
          <img
            src={item.cardImage.src}
            alt={item.cardImage.alt}
            loading="lazy"
            decoding="async"
            width="700"
            height="306"
            class="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-[1.03]"
          />
        ) : (
          <div class="arch-placeholder absolute inset-0" aria-hidden="true"></div>
        )}
        <div class="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent pointer-events-none" aria-hidden="true"></div>
      </div>
      <div class="p-6 md:p-8">
        <span class="label-tag text-[var(--color-accent)] block mb-4">{item.number}</span>
        <h3 class="text-xl font-light mb-3 group-hover:text-[var(--color-accent)] transition-colors duration-200">{item.title}</h3>
        <p class="text-sm text-[var(--color-fg-muted)] leading-relaxed mb-6">{item.description}</p>
        <span class="inline-flex items-center gap-2 label-tag text-[var(--color-fg-muted)] group-hover:text-[var(--color-fg)] transition-colors duration-200">
          Подробнее
          <svg width="12" height="12" viewBox="0 0 14 14" fill="none" stroke="currentColor" stroke-width="1.5" aria-hidden="true">
            <line x1="0" y1="7" x2="12" y2="7"/>
            <polyline points="8,3 12,7 8,11"/>
          </svg>
        </span>
      </div>
    </a>
  ))}
</div>
```

- [ ] **Step 5: Full build to verify**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/DgVision-site" && npm run build 2>&1 | tail -30
```

Expected: Build succeeds with no errors. Warnings about undefined are acceptable only if unrelated to this change.

- [ ] **Step 6: Commit**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/DgVision-site"
git add src/data/services.ts src/pages/services/index.astro src/pages/services/[slug].astro
git commit -m "feat: add heroImage/cardImage/detailImage/resultImage to services, update service pages (variant B)"
```

---

### Task 4: Visual and theme verification

**Files:** None (verification only)

- [ ] **Step 1: Start preview server**

```bash
cd "/Users/utopo4ek/Projects/Portfolio land/DgVision-site" && npm run preview
```

- [ ] **Step 2: Check /services in light and dark themes**

Open `http://localhost:4321/services`

Verify:
- All three service cards show their `cardImage` (no grey empty rectangles)
- Hover scale works on images
- Text over image is readable (gradient scrim is present)
- Layout does not break at 390px width (mobile)
- Layout does not break at 768px

- [ ] **Step 3: Check /services/architecture detail page**

Open `http://localhost:4321/services/architecture`

Verify:
- Hero section shows `heroImage` (not the arch-placeholder)
- After the intro section, the wide `detailImage` strip appears
- The "Результат" section shows three columns with image + deliverables list
- "Другие услуги" cards both have thumbnail images
- No horizontal overflow at 390px
- Text is readable in dark theme

- [ ] **Step 4: Check /services/interior-design**

Open `http://localhost:4321/services/interior-design`

Same checklist as Step 3.

- [ ] **Step 5: Check /services/development-concepts**

Open `http://localhost:4321/services/development-concepts`

Same checklist as Step 3.

- [ ] **Step 6: Regression — check home page and /projects**

Open `http://localhost:4321/` and `http://localhost:4321/projects`

Verify: no broken images, no horizontal overflow, header/nav intact.

- [ ] **Step 7: Check one project detail page**

Open `http://localhost:4321/projects/severnyy-sklon`

Verify: gallery images still work, related services section (if present) not broken.

---

## Post-Implementation Checklist

- [ ] `services.ts` has `ServiceImage` type exported and all three services have `heroImage`, `cardImage`, `detailImage`, `resultImage`
- [ ] Old `image?` field removed from type definition and all service objects
- [ ] `/services` cards use `cardImage`
- [ ] `/services/[slug]` hero uses `heroImage` with `fetchpriority="high"`
- [ ] detailImage wide strip appears after intro on all three service detail pages
- [ ] resultImage column appears in result section on all three service detail pages
- [ ] "Other services" cards have thumbnail images
- [ ] No empty grey placeholders visible anywhere
- [ ] Build passes: `npm run build`
- [ ] No TypeScript errors: `npx astro check`

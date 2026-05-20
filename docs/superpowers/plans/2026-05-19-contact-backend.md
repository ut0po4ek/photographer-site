# Contact Backend Template — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Add a portable contact form backend to astro-business-starter: a reusable `src/server/contact/` module (email via SMTP + optional Telegram) wrapped by a thin Netlify Function, wired to the existing form in ContactSection.astro.

**Architecture:** All business logic lives in `src/server/contact/` with no Netlify/Astro/DOM dependencies — it can be reused on any Node.js backend by replacing only `netlify/functions/contact.ts`. The frontend normalises form field names before posting JSON to `/.netlify/functions/contact`.

**Tech Stack:** Astro 6, TypeScript strict, nodemailer, @netlify/functions, Tailwind CSS v4, npm

---

## File map

| Action   | Path                                          | Responsibility                          |
|----------|-----------------------------------------------|-----------------------------------------|
| Create   | `src/server/contact/types.ts`                 | ContactPayload, ContactResult           |
| Create   | `src/server/contact/validate.ts`              | validateContactPayload()                |
| Create   | `src/server/contact/emailTemplate.ts`         | buildEmailHtml(), buildEmailText()      |
| Create   | `src/server/contact/telegramTemplate.ts`      | buildTelegramMessage()                  |
| Create   | `src/server/contact/sendMail.ts`              | sendMail(payload): Promise<void>        |
| Create   | `src/server/contact/sendTelegram.ts`          | sendTelegram(payload): Promise<void>    |
| Create   | `src/server/contact/handler.ts`               | handleContactRequest()                  |
| Create   | `netlify/functions/contact.ts`                | Netlify Function wrapper (CORS, parse)  |
| Create   | `.env.example`                                | All env variable examples               |
| Create   | `netlify.toml`                                | Build + functions config                |
| Create   | `docs/contact-forms.md`                       | Deployment & portability docs           |
| Modify   | `src/config/site.ts`                          | Add forms: { contactEndpoint, source }  |
| Modify   | `src/components/sections/ContactSection.astro`| Wire form to real backend               |

---

## Task 1: Install dependencies

**Files:**
- Modify: `package.json`

- [ ] **Step 1: Install runtime and dev dependencies**

Run from project root:
```bash
npm install @netlify/functions nodemailer
npm install --save-dev @types/nodemailer
```

Expected: no errors, `package.json` now lists all three under dependencies / devDependencies.

- [ ] **Step 2: Verify TypeScript can resolve nodemailer types**

```bash
npx tsc --noEmit 2>&1 | head -20
```

Expected: no errors about missing `nodemailer` or `@netlify/functions` types (there may be pre-existing Astro type errors — that's OK at this stage).

- [ ] **Step 3: Commit**

```bash
git add package.json package-lock.json
git commit -m "chore: add nodemailer and @netlify/functions deps"
```

---

## Task 2: Types

**Files:**
- Create: `src/server/contact/types.ts`

- [ ] **Step 1: Create the types file**

Create `src/server/contact/types.ts`:

```typescript
export type ContactPayload = {
  name?: string;
  phone?: string;
  email?: string;
  message?: string;
  service?: string;
  date?: string;
  time?: string;
  page?: string;
  source?: string;
  company?: string; // honeypot — non-empty means bot, silently drop
};

export type ContactResult =
  | { ok: true }
  | { ok: false; message: string; statusCode?: 400 | 500 };
```

- [ ] **Step 2: Verify TypeScript accepts the file**

```bash
npx tsc --noEmit 2>&1 | grep "server/contact/types"
```

Expected: no output (no errors for this file).

- [ ] **Step 3: Commit**

```bash
git add src/server/contact/types.ts
git commit -m "feat: add ContactPayload and ContactResult types"
```

---

## Task 3: Validation

**Files:**
- Create: `src/server/contact/validate.ts`

- [ ] **Step 1: Create validate.ts**

Create `src/server/contact/validate.ts`:

```typescript
import type { ContactPayload } from './types.js';

type ValidationResult =
  | { valid: true }
  | { valid: false; message: string };

export function validateContactPayload(payload: ContactPayload): ValidationResult {
  const name = payload.name?.trim();
  const phone = payload.phone?.trim();
  const email = payload.email?.trim();

  if (!name) {
    return { valid: false, message: 'Пожалуйста, укажите ваше имя.' };
  }

  if (!phone && !email) {
    return {
      valid: false,
      message: 'Пожалуйста, укажите телефон или email для связи.',
    };
  }

  return { valid: true };
}
```

- [ ] **Step 2: Verify TypeScript accepts the file**

```bash
npx tsc --noEmit 2>&1 | grep "server/contact/validate"
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/server/contact/validate.ts
git commit -m "feat: add validateContactPayload"
```

---

## Task 4: Email templates

**Files:**
- Create: `src/server/contact/emailTemplate.ts`

- [ ] **Step 1: Create emailTemplate.ts**

Create `src/server/contact/emailTemplate.ts`:

```typescript
import type { ContactPayload } from './types.js';

function esc(value: string | undefined): string {
  if (!value) return '—';
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

function row(label: string, value: string | undefined): string {
  if (!value?.trim()) return '';
  return `<tr><td style="padding:4px 12px 4px 0;color:#6b7280;white-space:nowrap">${label}</td><td style="padding:4px 0">${esc(value)}</td></tr>`;
}

export function buildEmailHtml(payload: ContactPayload, submittedAt: string): string {
  return `<!DOCTYPE html>
<html lang="ru">
<head><meta charset="utf-8"><title>Новая заявка</title></head>
<body style="font-family:sans-serif;font-size:15px;color:#111;max-width:600px;margin:0 auto;padding:24px">
  <h2 style="margin:0 0 20px;font-size:18px;font-weight:600">Новая заявка с сайта</h2>
  <table cellpadding="0" cellspacing="0" style="border-collapse:collapse;width:100%">
    ${row('Имя', payload.name)}
    ${row('Телефон', payload.phone)}
    ${row('Email', payload.email)}
    ${row('Услуга / тип', payload.service)}
    ${row('Дата', payload.date)}
    ${row('Время', payload.time)}
    ${row('Источник', payload.source)}
    ${row('Страница', payload.page)}
    ${row('Сообщение', payload.message)}
    ${row('Дата отправки', submittedAt)}
  </table>
</body>
</html>`;
}

export function buildEmailText(payload: ContactPayload, submittedAt: string): string {
  const lines: string[] = ['Новая заявка с сайта', ''];
  const add = (label: string, value: string | undefined) => {
    if (value?.trim()) lines.push(`${label}: ${value}`);
  };
  add('Имя', payload.name);
  add('Телефон', payload.phone);
  add('Email', payload.email);
  add('Услуга / тип', payload.service);
  add('Дата', payload.date);
  add('Время', payload.time);
  add('Источник', payload.source);
  add('Страница', payload.page);
  add('Сообщение', payload.message);
  add('Дата отправки', submittedAt);
  return lines.join('\n');
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep "server/contact/emailTemplate"
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/server/contact/emailTemplate.ts
git commit -m "feat: add email HTML/text template builders"
```

---

## Task 5: Telegram template

**Files:**
- Create: `src/server/contact/telegramTemplate.ts`

- [ ] **Step 1: Create telegramTemplate.ts**

Create `src/server/contact/telegramTemplate.ts`:

```typescript
import type { ContactPayload } from './types.js';

function tesc(value: string | undefined): string {
  if (!value?.trim()) return '—';
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

export function buildTelegramMessage(payload: ContactPayload, submittedAt: string): string {
  const lines: string[] = ['<b>Новая заявка с сайта</b>', ''];
  const add = (label: string, value: string | undefined) => {
    if (value?.trim()) lines.push(`<b>${label}:</b> ${tesc(value)}`);
  };
  add('Имя', payload.name);
  add('Телефон', payload.phone);
  add('Email', payload.email);
  add('Услуга', payload.service);
  add('Дата', payload.date);
  add('Время', payload.time);
  add('Источник', payload.source);
  add('Страница', payload.page);
  add('Сообщение', payload.message);
  lines.push('');
  lines.push(`<i>${tesc(submittedAt)}</i>`);
  return lines.join('\n');
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep "server/contact/telegramTemplate"
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/server/contact/telegramTemplate.ts
git commit -m "feat: add Telegram message template builder"
```

---

## Task 6: sendMail

**Files:**
- Create: `src/server/contact/sendMail.ts`

- [ ] **Step 1: Create sendMail.ts**

Create `src/server/contact/sendMail.ts`:

```typescript
import nodemailer from 'nodemailer';
import type { ContactPayload } from './types.js';
import { buildEmailHtml, buildEmailText } from './emailTemplate.js';

function requireEnv(name: string): string {
  const value = process.env[name];
  if (!value) throw new Error(`Missing required env variable: ${name}`);
  return value;
}

export async function sendMail(payload: ContactPayload): Promise<void> {
  const host = requireEnv('SMTP_HOST');
  const port = parseInt(requireEnv('SMTP_PORT'), 10);
  const user = requireEnv('SMTP_USER');
  const pass = requireEnv('SMTP_PASS');
  const from = requireEnv('MAIL_FROM');
  const to = requireEnv('MAIL_TO');

  const secure = port === 465;

  const transport = nodemailer.createTransport({
    host,
    port,
    secure,
    auth: { user, pass },
  });

  const submittedAt = new Date().toISOString();
  const pageSuffix = payload.page ? ` (${payload.page})` : '';
  const subject = `Новая заявка с сайта${pageSuffix}`;

  await transport.sendMail({
    from,
    to,
    replyTo: payload.email || undefined,
    subject,
    text: buildEmailText(payload, submittedAt),
    html: buildEmailHtml(payload, submittedAt),
  });
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep "server/contact/sendMail"
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/server/contact/sendMail.ts
git commit -m "feat: add sendMail via nodemailer SMTP"
```

---

## Task 7: sendTelegram

**Files:**
- Create: `src/server/contact/sendTelegram.ts`

- [ ] **Step 1: Create sendTelegram.ts**

Create `src/server/contact/sendTelegram.ts`:

```typescript
import type { ContactPayload } from './types.js';
import { buildTelegramMessage } from './telegramTemplate.js';

export async function sendTelegram(payload: ContactPayload): Promise<void> {
  const token = process.env['TELEGRAM_BOT_TOKEN'];
  const chatId = process.env['TELEGRAM_CHAT_ID'];

  if (!token || !chatId) {
    console.error('[sendTelegram] TELEGRAM_BOT_TOKEN or TELEGRAM_CHAT_ID is not set');
    throw new Error('Telegram is not configured');
  }

  const submittedAt = new Date().toISOString();
  const text = buildTelegramMessage(payload, submittedAt);

  const url = `https://api.telegram.org/bot${token}/sendMessage`;
  const response = await fetch(url, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text, parse_mode: 'HTML' }),
  });

  if (!response.ok) {
    const body = await response.text().catch(() => '');
    console.error(`[sendTelegram] Telegram API error: ${response.status} ${body}`);
    throw new Error(`Telegram API returned ${response.status}`);
  }
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep "server/contact/sendTelegram"
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/server/contact/sendTelegram.ts
git commit -m "feat: add sendTelegram via Bot API"
```

---

## Task 8: handleContactRequest

**Files:**
- Create: `src/server/contact/handler.ts`

- [ ] **Step 1: Create handler.ts**

Create `src/server/contact/handler.ts`:

```typescript
import type { ContactPayload, ContactResult } from './types.js';
import { validateContactPayload } from './validate.js';
import { sendMail } from './sendMail.js';
import { sendTelegram } from './sendTelegram.js';

function normalise(payload: ContactPayload): ContactPayload {
  return {
    ...payload,
    name: payload.name?.trim(),
    phone: payload.phone?.trim(),
    email: payload.email?.trim().toLowerCase(),
    message: payload.message?.trim(),
    service: payload.service?.trim(),
    page: payload.page?.trim(),
    source: payload.source?.trim(),
    // do NOT trim company — any whitespace still means "filled"
  };
}

export async function handleContactRequest(
  raw: ContactPayload,
): Promise<ContactResult> {
  const payload = normalise(raw);

  // honeypot: bot filled the hidden company field
  if (payload.company?.trim()) {
    return { ok: true };
  }

  const validation = validateContactPayload(payload);
  if (!validation.valid) {
    return { ok: false, message: validation.message, statusCode: 400 };
  }

  try {
    await sendMail(payload);
  } catch (err) {
    console.error('[handleContactRequest] sendMail failed:', err);
    return {
      ok: false,
      message: 'Не удалось отправить заявку. Попробуйте позже или напишите нам напрямую.',
      statusCode: 500,
    };
  }

  if (process.env['CONTACT_ENABLE_TELEGRAM'] === 'true') {
    try {
      await sendTelegram(payload);
    } catch (err) {
      // Telegram is a secondary channel — do not fail the request
      console.error('[handleContactRequest] sendTelegram failed:', (err as Error).message);
    }
  }

  return { ok: true };
}
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep "server/contact/handler"
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/server/contact/handler.ts
git commit -m "feat: add handleContactRequest orchestrator"
```

---

## Task 9: Netlify Function wrapper

**Files:**
- Create: `netlify/functions/contact.ts`

- [ ] **Step 1: Create netlify/functions directory and contact.ts**

```bash
mkdir -p netlify/functions
```

Create `netlify/functions/contact.ts`:

```typescript
import type { Handler, HandlerEvent } from '@netlify/functions';
import { handleContactRequest } from '../../src/server/contact/handler.js';
import type { ContactPayload } from '../../src/server/contact/types.js';

function getCorsHeaders(event: HandlerEvent): Record<string, string> {
  const allowedRaw = process.env['CONTACT_ALLOWED_ORIGINS'] ?? '';
  const allowed = allowedRaw.split(',').map((o) => o.trim()).filter(Boolean);
  const origin = event.headers['origin'] ?? '';

  const headers: Record<string, string> = {
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
    'Vary': 'Origin',
  };

  if (allowed.includes(origin)) {
    headers['Access-Control-Allow-Origin'] = origin;
  }

  return headers;
}

export const handler: Handler = async (event) => {
  const corsHeaders = getCorsHeaders(event);

  if (event.httpMethod === 'OPTIONS') {
    return { statusCode: 204, headers: corsHeaders, body: '' };
  }

  if (event.httpMethod !== 'POST') {
    return {
      statusCode: 405,
      headers: { ...corsHeaders, Allow: 'POST, OPTIONS' },
      body: JSON.stringify({ ok: false, message: 'Method Not Allowed' }),
    };
  }

  let payload: ContactPayload;
  try {
    payload = JSON.parse(event.body ?? '{}') as ContactPayload;
  } catch {
    return {
      statusCode: 400,
      headers: corsHeaders,
      body: JSON.stringify({ ok: false, message: 'Invalid JSON body' }),
    };
  }

  const result = await handleContactRequest(payload);
  const statusCode = result.ok ? 200 : (result.statusCode ?? 500);

  return {
    statusCode,
    headers: { ...corsHeaders, 'Content-Type': 'application/json' },
    body: JSON.stringify(result),
  };
};
```

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep "netlify/functions/contact"
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add netlify/functions/contact.ts
git commit -m "feat: add Netlify Function wrapper for contact handler"
```

---

## Task 10: netlify.toml and .env.example

**Files:**
- Create: `netlify.toml`
- Create: `.env.example`

- [ ] **Step 1: Create netlify.toml**

Create `netlify.toml` (file does not yet exist):

```toml
[build]
command = "npm run build"
publish = "dist"

[functions]
directory = "netlify/functions"
```

- [ ] **Step 2: Create .env.example**

Create `.env.example`:

```bash
# SMTP — required for contact form emails
SMTP_HOST=smtp.example.com
SMTP_PORT=465
SMTP_USER=mail@example.com
SMTP_PASS=app-password
MAIL_TO=owner@example.com
MAIL_FROM="Website <mail@example.com>"

# Telegram — optional notification channel
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

# App
CONTACT_ALLOWED_ORIGINS=http://localhost:8888,https://example.com
CONTACT_ENABLE_TELEGRAM=false
```

- [ ] **Step 3: Confirm .env is in .gitignore**

```bash
grep "^\.env$" .gitignore
```

Expected: `.env` appears in output (already gitignored from project setup).

- [ ] **Step 4: Commit**

```bash
git add netlify.toml .env.example
git commit -m "chore: add netlify.toml and .env.example"
```

---

## Task 11: siteConfig — add forms section

**Files:**
- Modify: `src/config/site.ts`

- [ ] **Step 1: Add forms section to siteConfig**

Open `src/config/site.ts`. After the existing `cta` block (before `footer`), add:

```typescript
  forms: {
    contactEndpoint: '/.netlify/functions/contact',
    source: 'Starter Brand',
  },
```

The full file after the change (only the relevant portion shown):

```typescript
  cta: {
    label: 'Обсудить проект',
    href: '/#contacts',
  },

  forms: {
    contactEndpoint: '/.netlify/functions/contact',
    source: 'Starter Brand',
  },

  footer: {
```

Note: `source` is set to the same string as `siteConfig.name` (`'Starter Brand'`). It is written as a literal here because `siteConfig` is the object being defined — it cannot self-reference during construction.

- [ ] **Step 2: Verify TypeScript**

```bash
npx tsc --noEmit 2>&1 | grep "config/site"
```

Expected: no output.

- [ ] **Step 3: Commit**

```bash
git add src/config/site.ts
git commit -m "feat: add forms.contactEndpoint and forms.source to siteConfig"
```

---

## Task 12: ContactSection.astro — HTML additions

**Files:**
- Modify: `src/components/sections/ContactSection.astro`

This task adds HTML-only changes: `data-*` attributes on the form, hidden fields, and the error block. Script changes are in Task 13.

- [ ] **Step 1: Add data-endpoint and data-source to the form tag**

In `src/components/sections/ContactSection.astro`, find line 69:
```html
<form id="contact-form" class="flex flex-col gap-5" novalidate>
```

Replace it with:
```html
<form
  id="contact-form"
  class="flex flex-col gap-5"
  novalidate
  data-endpoint={siteConfig.forms.contactEndpoint}
  data-source={siteConfig.forms.source}
>
```

- [ ] **Step 2: Add hidden fields and honeypot before the closing </form> tag**

Find line 103 (the closing `</form>` tag, right after the Button):
```html
          </Button>
        </form>
```

Insert hidden fields before `</form>`:
```html
          </Button>

          <!-- Honeypot: visually hidden from real users, invisible to screen readers -->
          <input
            type="text"
            name="company"
            autocomplete="off"
            tabindex="-1"
            aria-hidden="true"
            style="position:absolute;left:-9999px;width:1px;height:1px;overflow:hidden"
          />
          <input type="hidden" name="page" />
          <input type="hidden" name="source" />
        </form>
```

- [ ] **Step 3: Add error state block after the success block**

Find this exact closing sequence (the end of `#form-success`):
```html
          Мы свяжемся с вами в ближайшее время. Обычно отвечаем в течение одного рабочего дня.
          </p>
        </div>
      </div>
```

Replace it with (adding the error block between the two closing divs):
```html
          Мы свяжемся с вами в ближайшее время. Обычно отвечаем в течение одного рабочего дня.
          </p>
        </div>

        <!-- Error state -->
        <div id="form-error" class="hidden flex-col items-start gap-4 p-10 bg-[var(--color-bg-warm)] border border-red-500/30">
          <div class="w-10 h-10 border border-red-500/40 flex items-center justify-center">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none" stroke="currentColor" stroke-width="1.5" class="text-red-500">
              <line x1="3" y1="3" x2="13" y2="13"/><line x1="13" y1="3" x2="3" y2="13"/>
            </svg>
          </div>
          <h3 class="text-lg font-light tracking-tight">Не удалось отправить</h3>
          <p class="text-[var(--color-fg-muted)] text-sm leading-relaxed">
            Не удалось отправить заявку. Попробуйте позже или напишите нам напрямую.
          </p>
        </div>
      </div>
```

- [ ] **Step 4: Verify the Astro component builds without errors**

```bash
npm run check 2>&1 | tail -10
```

Expected: no new errors related to `siteConfig.forms`.

- [ ] **Step 5: Commit**

```bash
git add src/components/sections/ContactSection.astro
git commit -m "feat: add form data attributes, hidden fields, honeypot, error block"
```

---

## Task 13: ContactSection.astro — replace submit handler

**Files:**
- Modify: `src/components/sections/ContactSection.astro` (script section only)

This task replaces the entire `<script>` block. The existing script uses a `setTimeout` mock. We replace it with a real `fetch` to the configured endpoint.

- [ ] **Step 1: Replace the entire <script> block**

Find the `<script>` tag (starts at line ~215). Replace the **entire** `<script>…</script>` block with:

```astro
<script>
  function initContactForm() {
    const form = document.getElementById('contact-form') as HTMLFormElement | null;
    if (!form) return;
    if (form.dataset.formReady === 'true') return;
    form.dataset.formReady = 'true';

    const successEl = document.getElementById('form-success');
    const errorEl = document.getElementById('form-error');
    const submitBtn = document.getElementById('submit-btn') as HTMLButtonElement | null;
    const btnText = document.getElementById('btn-text');
    const btnSpinner = document.getElementById('btn-spinner');
    const privacyError = document.getElementById('privacy-error');
    const privacyCheck = document.getElementById('field-privacy') as HTMLInputElement | null;
    if (!privacyCheck) return;

    // populate hidden fields on init
    const pageInput = form.querySelector<HTMLInputElement>('[name="page"]');
    const sourceInput = form.querySelector<HTMLInputElement>('[name="source"]');
    if (pageInput) pageInput.value = window.location.pathname;
    if (sourceInput) sourceInput.value = form.dataset.source ?? '';

    privacyCheck.addEventListener('change', () => {
      const checkmark = privacyCheck.nextElementSibling as SVGElement;
      if (checkmark) checkmark.style.opacity = privacyCheck.checked ? '1' : '0';
    });

    function setLoading(loading: boolean) {
      if (!submitBtn) return;
      submitBtn.disabled = loading;
      if (btnText) btnText.textContent = loading ? 'Отправляем...' : 'Отправить заявку';
      if (loading) btnSpinner?.classList.remove('hidden');
      else btnSpinner?.classList.add('hidden');
    }

    form.addEventListener('submit', async (e) => {
      e.preventDefault();

      // reset error block
      errorEl?.classList.remove('flex');
      errorEl?.classList.add('hidden');

      let valid = true;

      form.querySelectorAll<HTMLInputElement | HTMLSelectElement>('[required]').forEach((field) => {
        const errEl = field.closest('.form-field')?.querySelector('.field-error') as HTMLElement | null;
        const controlEl = form.querySelector<HTMLElement>(`[data-custom-control-for="${field.id}"]`);
        const isEmpty = !field.value.trim() || (field.tagName === 'SELECT' && !field.value);
        if (isEmpty) {
          valid = false;
          if (controlEl) (controlEl as HTMLElement).style.borderColor = '#ef4444';
          else (field as HTMLElement).style.borderColor = '#ef4444';
          if (errEl) errEl.classList.remove('hidden');
        } else {
          if (controlEl) (controlEl as HTMLElement).style.borderColor = '';
          else (field as HTMLElement).style.borderColor = '';
          if (errEl) errEl.classList.add('hidden');
        }
      });

      if (!privacyCheck.checked) {
        valid = false;
        privacyError?.classList.remove('hidden');
      } else {
        privacyError?.classList.add('hidden');
      }

      if (!valid) return;

      const endpoint = form.dataset.endpoint ?? '/.netlify/functions/contact';
      const formData = new FormData(form);

      const payload = {
        name: (formData.get('name') as string | null) ?? '',
        phone: (formData.get('phone') as string | null) ?? '',
        email: (formData.get('email') as string | null) ?? '',
        service:
          (formData.get('service') as string | null) ||
          (formData.get('project_type') as string | null) ||
          (formData.get('menu_item') as string | null) ||
          (formData.get('reservation_type') as string | null) ||
          '',
        message:
          (formData.get('message') as string | null) ||
          (formData.get('comment') as string | null) ||
          '',
        date:
          (formData.get('preferred_date') as string | null) ||
          (formData.get('date') as string | null) ||
          '',
        time: (formData.get('time') as string | null) ?? '',
        page: window.location.pathname,
        source: form.dataset.source ?? '',
        company: (formData.get('company') as string | null) ?? '',
      };

      setLoading(true);

      try {
        const res = await fetch(endpoint, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(payload),
        });

        const data = await res.json().catch(() => ({ ok: false }));

        if (res.ok && (data as { ok: boolean }).ok) {
          form.style.display = 'none';
          if (successEl) {
            successEl.classList.remove('hidden');
            successEl.classList.add('flex');
          }
          form.reset();
        } else {
          errorEl?.classList.remove('hidden');
          errorEl?.classList.add('flex');
          setLoading(false);
        }
      } catch {
        errorEl?.classList.remove('hidden');
        errorEl?.classList.add('flex');
        setLoading(false);
      }
    });

    form.querySelectorAll('input, select, textarea').forEach((field) => {
      field.addEventListener('input', () => {
        (field as HTMLElement).style.borderColor = '';
        const controlEl = form.querySelector<HTMLElement>(`[data-custom-control-for="${(field as HTMLInputElement).id}"]`);
        if (controlEl) controlEl.style.borderColor = '';
        const errEl = field.closest('.form-field')?.querySelector('.field-error') as HTMLElement | null;
        if (errEl) errEl.classList.add('hidden');
      });
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initContactForm, { once: true });
  } else {
    initContactForm();
  }
  document.addEventListener('astro:page-load', initContactForm);
</script>
```

- [ ] **Step 2: Run astro check**

```bash
npm run check 2>&1 | tail -15
```

Expected: 0 errors.

- [ ] **Step 3: Commit**

```bash
git add src/components/sections/ContactSection.astro
git commit -m "feat: wire contact form to real fetch endpoint with loading/error states"
```

---

## Task 14: Verify build passes

- [ ] **Step 1: Run full TypeScript check**

```bash
npm run check
```

Expected: `Found 0 errors.`

- [ ] **Step 2: Run production build**

```bash
npm run build
```

Expected: build completes without errors. `dist/` directory created.

- [ ] **Step 3: Confirm no secrets in source**

```bash
grep -rn "SMTP_PASS\|TELEGRAM_BOT_TOKEN" src/ netlify/ public/ 2>/dev/null
```

Expected: output shows only variable *name* references (e.g., `process.env['SMTP_PASS']`, `requireEnv('SMTP_PASS')`), never actual credential values.

- [ ] **Step 4: Commit final state if any pending changes**

```bash
git status
```

If clean: nothing to do. If there are changes from check/build artefacts (unlikely): commit them.

---

## Task 15: docs/contact-forms.md

**Files:**
- Create: `docs/contact-forms.md`

- [ ] **Step 1: Create docs/contact-forms.md**

Create `docs/contact-forms.md`:

```markdown
# Contact Form Backend

A portable contact form handler built as a Netlify Function wrapper around a reusable Node.js module.

---

## How it works

```
Browser form → POST /.netlify/functions/contact
             → netlify/functions/contact.ts  (CORS, parse, route)
             → src/server/contact/handler.ts (validate, send)
             → nodemailer SMTP              (email, always)
             → Telegram Bot API             (optional)
```

---

## Required env variables

Set these in Netlify UI → Site → Environment variables (or `.env` for local dev).

| Variable                 | Required | Description                                  |
|--------------------------|----------|----------------------------------------------|
| `SMTP_HOST`              | yes      | SMTP server hostname                         |
| `SMTP_PORT`              | yes      | 465 (SSL) or 587 (STARTTLS)                  |
| `SMTP_USER`              | yes      | SMTP login                                   |
| `SMTP_PASS`              | yes      | SMTP password / app password                 |
| `MAIL_TO`                | yes      | Recipient email address                      |
| `MAIL_FROM`              | yes      | Sender, e.g. `"Website <mail@example.com>"`  |
| `TELEGRAM_BOT_TOKEN`     | no       | Required only if Telegram is enabled         |
| `TELEGRAM_CHAT_ID`       | no       | Required only if Telegram is enabled         |
| `CONTACT_ALLOWED_ORIGINS`| no       | Comma-separated allowed origins for CORS     |
| `CONTACT_ENABLE_TELEGRAM`| no       | `true` to enable Telegram notifications      |

---

## SMTP setup

**Yandex Mail example:**
```bash
SMTP_HOST=smtp.yandex.ru
SMTP_PORT=465
SMTP_USER=example@yandex.ru
SMTP_PASS=app-password          # generate in Yandex account settings
MAIL_TO=owner@example.com
MAIL_FROM="Website <example@yandex.ru>"
```

**Gmail example (App Password required):**
```bash
SMTP_HOST=smtp.gmail.com
SMTP_PORT=465
SMTP_USER=example@gmail.com
SMTP_PASS=xxxx-xxxx-xxxx-xxxx   # 16-char App Password from Google account
MAIL_TO=owner@example.com
MAIL_FROM="Website <example@gmail.com>"
```

---

## Enable Telegram notifications

1. Create a bot via [@BotFather](https://t.me/BotFather), copy the token.
2. Add the bot to your channel/group and get the chat ID.
3. Set env variables:
   ```
   TELEGRAM_BOT_TOKEN=123456:ABC-DEF...
   TELEGRAM_CHAT_ID=-1001234567890
   CONTACT_ENABLE_TELEGRAM=true
   ```

If Telegram fails, the email is still sent and the request succeeds. Telegram is a secondary channel.

---

## Local testing with Netlify CLI

```bash
# Install Netlify CLI if needed
npm install -g netlify-cli

# Copy env example and fill in real values
cp .env.example .env
# edit .env with your SMTP credentials

# Start local dev
npx netlify dev
# Site: http://localhost:8888
# Function: http://localhost:8888/.netlify/functions/contact

# Test with curl
curl -X POST http://localhost:8888/.netlify/functions/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","phone":"+79001234567","message":"Hello","page":"/"}'
```

Expected response (without env configured):
```json
{"ok":false,"message":"Не удалось отправить заявку. Попробуйте позже или напишите нам напрямую.","statusCode":500}
```

Expected response (with env configured correctly):
```json
{"ok":true}
```

---

## Deploying to Netlify

1. Push the repo to GitHub (or connect via Netlify CLI).
2. In Netlify UI → Site → Environment variables: add all variables from the table above.
3. Deploy. The function is automatically built from `netlify/functions/`.
4. Test the live endpoint:
   ```bash
   curl -X POST https://your-site.netlify.app/.netlify/functions/contact \
     -H "Content-Type: application/json" \
     -d '{"name":"Live test","phone":"+7000","page":"/"}'
   ```

---

## Transferring to another Astro project

### Minimal steps

1. Copy `src/server/contact/` → same path in destination project.
2. Copy `netlify/functions/contact.ts` → same path.
3. Add to destination `src/config/site.ts`:
   ```typescript
   forms: {
     contactEndpoint: '/.netlify/functions/contact',
     source: 'Your Site Name',
   },
   ```
4. In the destination form component:
   - Add `data-endpoint={siteConfig.forms.contactEndpoint}` and `data-source={siteConfig.forms.source}` to `<form>`.
   - Add honeypot and hidden fields (copy from ContactSection.astro).
   - Copy the submit handler script, adjusting field name mappings if needed:
     ```javascript
     service: formData.get('service') || formData.get('project_type') ||
              formData.get('menu_item') || formData.get('reservation_type'),
     message: formData.get('message') || formData.get('comment'),
     ```
5. Copy `.env.example`, configure env vars in Netlify UI.
6. Run `npm run check && npm run build`.

### Field name mapping

Each project may use different field names. The frontend submit handler normalises them before sending. `src/server/contact/` always receives the canonical names: `name`, `phone`, `email`, `service`, `message`, `date`, `time`, `page`, `source`, `company`.

---

## Switching to a different hosting provider

1. Keep `src/server/contact/` unchanged.
2. Write a new wrapper for your platform:
   - **Vercel:** `api/contact.ts`
   - **Express:** `routes/contact.ts`
   - **Fastify:** plugin calling `handleContactRequest`
3. Wrapper pattern:
   ```typescript
   import { handleContactRequest } from '../src/server/contact/handler.js';
   // parse body → handleContactRequest(payload) → return JSON
   ```
4. Update `siteConfig.forms.contactEndpoint` to the new URL.

---

## Anti-spam and security notes

- **Honeypot:** `company` field is visually hidden. If filled, the request is silently dropped (returns `{"ok":true}` to confuse bots).
- **CORS allowlist:** Set `CONTACT_ALLOWED_ORIGINS` to your production domain(s).
- **No secrets in frontend:** SMTP credentials and Telegram token are server-only.
- **Future hardening:** For high-traffic sites, consider adding Cloudflare Turnstile or hCaptcha, and a simple rate limiter (e.g., Upstash Redis).
```

- [ ] **Step 2: Commit**

```bash
git add docs/contact-forms.md
git commit -m "docs: add contact-forms deployment and portability guide"
```

---

## Post-implementation verification summary

After all tasks are complete, run:

```bash
npm run check && npm run build
grep -rn "SMTP_PASS\|TELEGRAM_BOT_TOKEN" src/ netlify/ public/
```

Expected:
- `check`: `Found 0 errors.`
- `build`: completes successfully, `dist/` created
- `grep`: shows only `process.env['SMTP_PASS']`-style references, no actual values
```

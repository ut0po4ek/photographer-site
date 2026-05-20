# Contact Backend Template — Design Spec

**Date:** 2026-05-19  
**Status:** Approved  
**Project:** astro-business-starter

---

## Goal

Add a portable, reusable contact form backend to `astro-business-starter` so it can be quickly transplanted to `form-light-site`, `restaurant-site`, `flovers-site`, and future Astro projects.

The backend must be decoupled from Netlify: the Netlify Function is a thin runtime wrapper, and all business logic lives in `src/server/contact/` which has zero dependencies on Netlify, Astro, or the DOM.

---

## Architecture

```
Astro frontend form
  → POST /.netlify/functions/contact
  → netlify/functions/contact.ts  (thin wrapper: CORS, parse, route)
  → src/server/contact/handler.ts (handleContactRequest)
      → validate.ts
      → sendMail.ts  (nodemailer SMTP)
      → sendTelegram.ts  (optional, Telegram Bot API)
```

### Portability invariant

To move to Vercel / Express / Fastify: replace `netlify/functions/contact.ts` only.  
`src/server/contact/` is not touched.

---

## File Structure

### New files

```
src/server/contact/
  types.ts              ContactPayload, ContactResult
  validate.ts           validateContactPayload()
  emailTemplate.ts      buildEmailHtml(), buildEmailText()
  telegramTemplate.ts   buildTelegramMessage()  (HTML-escaped)
  sendMail.ts           sendMail(payload): Promise<void>
  sendTelegram.ts       sendTelegram(payload): Promise<void>
  handler.ts            handleContactRequest(payload): Promise<ContactResult>

netlify/functions/
  contact.ts            Runtime wrapper only

.env.example            All env variable examples
netlify.toml            [build] + [functions] config
docs/contact-forms.md   User-facing deployment docs
```

### Modified files

```
src/config/site.ts
  + forms: { contactEndpoint: string; source: string }

src/components/sections/ContactSection.astro
  + data-endpoint, data-source attributes on <form>
  + honeypot hidden field (company)
  + hidden page/source fields (JS-populated)
  + real fetch submit handler (replaces setTimeout mock)
  + error state UI block
```

---

## Dependencies

```
dependencies:
  @netlify/functions   runtime types for Netlify Function
  nodemailer           SMTP email sending

devDependencies:
  @types/nodemailer    TypeScript types
```

Package manager: **npm** (project uses `package-lock.json`).

---

## Types

```typescript
// src/server/contact/types.ts

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
  company?: string; // honeypot — if non-empty, silently drop
};

export type ContactResult =
  | { ok: true }
  | { ok: false; message: string; statusCode?: 400 | 500 };
```

---

## Validation (`validate.ts`)

Rules:
- `name` must be non-empty string (after trim)
- at least one of `phone` or `email` must be non-empty (after trim)
- all other fields optional
- no strict phone format validation (formats vary across projects)
- `company` (honeypot) check happens in `handler.ts` before validation

Returns `{ valid: true }` or `{ valid: false; message: string }` with a safe user-facing message.

---

## handleContactRequest (`handler.ts`)

```
1. trim / lowercase email  (normalization)
2. if company is non-empty → return { ok: true }  (silent bot drop)
3. validateContactPayload → if invalid → return { ok: false, message, statusCode: 400 }
4. sendMail(payload)
   → if throws → log error details, return { ok: false, message: "safe message", statusCode: 500 }
5. if CONTACT_ENABLE_TELEGRAM === "true":
   → sendTelegram(payload)
   → if throws → console.error (no token in log), do NOT fail the request
6. return { ok: true }
```

Server logs may contain detailed error messages.  
Client-facing messages must never reveal SMTP errors, tokens, or stack traces.

---

## sendMail (`sendMail.ts`)

Config read from env on every call (stateless, Netlify Functions):

| Env var   | Required | Notes                          |
|-----------|----------|--------------------------------|
| SMTP_HOST | yes      |                                |
| SMTP_PORT | yes      | 465 → secure: true, else false |
| SMTP_USER | yes      |                                |
| SMTP_PASS | yes      |                                |
| MAIL_FROM | yes      | `"Name <addr>"` format         |
| MAIL_TO   | yes      | recipient                      |

If any required env is missing → throw with descriptive message in logs.

- `replyTo`: set to user's `email` if present in payload
- `subject`: `"Новая заявка с сайта"` + optional `(page)` suffix
- Body: all payload fields + `submittedAt: new Date().toISOString()`
- Formats: both `text` and `html`
- HTML template: user values HTML-escaped before insertion (prevent XSS in email clients)

---

## sendTelegram (`sendTelegram.ts`)

Only invoked when `CONTACT_ENABLE_TELEGRAM === "true"`.

| Env var             | Notes                         |
|---------------------|-------------------------------|
| TELEGRAM_BOT_TOKEN  | never logged                  |
| TELEGRAM_CHAT_ID    |                               |

- Uses `fetch` (Node 18+, no extra dep)
- Endpoint: `https://api.telegram.org/bot${TOKEN}/sendMessage`
- `parse_mode: "HTML"`
- `buildTelegramMessage` HTML-escapes `<`, `>`, `&` in all user values
- `submittedAt`: `new Date().toISOString()` (UTC, no hardcoded timezone)
- If token/chat_id missing → `console.error` with safe message, throw (caller catches)
- Token value itself is never written to logs

---

## Netlify Function wrapper (`netlify/functions/contact.ts`)

Responsibilities — wrapper only, no business logic:

1. Extract `Origin` from request
2. Build CORS headers: if origin matches `CONTACT_ALLOWED_ORIGINS` list → include `Access-Control-Allow-Origin`; always include `Vary: Origin`, `Access-Control-Allow-Methods: POST, OPTIONS`, `Access-Control-Allow-Headers: Content-Type`
3. `OPTIONS` → 204 with CORS headers
4. Not `POST` → 405
5. Parse JSON body → 400 on parse failure
6. `handleContactRequest(payload)`
7. Return JSON `ContactResult` with appropriate HTTP status (200 ok, 400 validation error, 500 server error)

CORS does not block server-to-server or curl requests (no Origin header = no CORS header, request proceeds normally).

---

## Environment Variables

```bash
# SMTP (required)
SMTP_HOST=smtp.example.com
SMTP_PORT=465
SMTP_USER=mail@example.com
SMTP_PASS=app-password
MAIL_TO=owner@example.com
MAIL_FROM="Website <mail@example.com>"

# Telegram (optional)
TELEGRAM_BOT_TOKEN=
TELEGRAM_CHAT_ID=

# App config
CONTACT_ALLOWED_ORIGINS=http://localhost:8888,https://example.com
CONTACT_ENABLE_TELEGRAM=false
```

`.env` is gitignored. `.env.example` is committed.  
No real credentials ever in source code.

---

## siteConfig changes (`src/config/site.ts`)

```typescript
forms: {
  contactEndpoint: "/.netlify/functions/contact",
  source: siteConfig.name,  // referenced in hidden form field
},
```

`source` re-uses the existing `siteConfig.name` value. No duplication.  
To switch to a different backend: change `contactEndpoint` only.

---

## Frontend changes (`ContactSection.astro`)

### HTML additions

On `<form>`:
```html
data-endpoint={siteConfig.forms.contactEndpoint}
data-source={siteConfig.forms.source}
```

Hidden fields added at end of form:
```html
<!-- honeypot: visually hidden, tabindex=-1, aria-hidden -->
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
```

Error state block (after existing success block):
```html
<div id="form-error" class="hidden ...">
  Не удалось отправить заявку. Попробуйте позже или напишите нам напрямую.
</div>
```

### Script changes

Before submit: populate hidden fields from JS:
```javascript
document.querySelector('[name="page"]').value = window.location.pathname;
document.querySelector('[name="source"]').value = form.dataset.source;
```

Payload normalization before fetch (fallback mapping for portability):
```javascript
{
  name: formData.get("name"),
  phone: formData.get("phone"),
  email: formData.get("email"),
  // fallback chain: accept any project-specific field name
  service: formData.get("service") ||
           formData.get("project_type") ||
           formData.get("menu_item") ||
           formData.get("reservation_type"),
  message: formData.get("message") ||
           formData.get("comment"),
  date: formData.get("preferred_date") || formData.get("date"),
  time: formData.get("time"),
  page: window.location.pathname,     // always from JS, not hidden input
  source: form.dataset.source,        // always from JS, not hidden input
  company: formData.get("company"),   // honeypot
}
```

Hidden inputs `page` and `source` are populated by JS before submit but payload always reads the live JS values (`window.location.pathname`, `form.dataset.source`) — the hidden inputs serve as fallback only if JS reads via `formData.get()`.

Submit flow:
```
idle → loading (disable button, "Отправляем...")
  → fetch POST endpoint with JSON
  → success: show success block, reset form
  → error: show error block, keep form filled, re-enable button
```

No heavy libraries. No SPA transformation. Vanilla JS inside Astro `<script>`.

---

## netlify.toml

```toml
[build]
command = "npm run build"
publish = "dist"

[functions]
directory = "netlify/functions"
```

Only created if file does not exist. If it exists, sections are merged carefully.

---

## Portability Guide (transfer to another project)

### Transfer to form-light-site / restaurant-site

1. Copy `src/server/contact/` as-is (no changes needed)
2. Copy `netlify/functions/contact.ts` as-is
3. In the destination project's `siteConfig`, add `forms.contactEndpoint` and `forms.source`
4. In the destination project's form component, add `data-endpoint`, `data-source`, honeypot, hidden fields
5. Update submit handler: map site-specific field names to canonical names (e.g., `comment → message`, `menu_item → service`)
6. Copy `.env.example`, configure env vars in Netlify UI
7. Run `npm run check && npm run build`

Backend `src/server/contact/` is never modified for a new project.  
Only the frontend field name mapping changes.

### Transfer to non-Netlify hosting

1. Keep `src/server/contact/` unchanged
2. Write a new wrapper (e.g., `api/contact.ts` for Vercel, `routes/contact.ts` for Express)
3. Wrapper does: parse request → call `handleContactRequest(payload)` → return JSON
4. Update `siteConfig.forms.contactEndpoint` to new URL

---

## Security baseline

| Concern             | Mitigation                                         |
|---------------------|----------------------------------------------------|
| Bot spam            | Honeypot field `company`                           |
| Secret leakage      | Env vars only; never in code or frontend           |
| XSS in email/TG     | HTML-escape user values in templates               |
| CORS                | Allowlist from env, not hardcoded                  |
| Method restriction  | 405 for non-POST                                   |
| Error leakage       | Safe messages to client; details in server logs    |
| Token logging       | Telegram token never written to logs               |

Future: for production at scale, consider Cloudflare Turnstile / hCaptcha and a simple in-memory or Redis rate limiter. Not in scope for this implementation.

---

## Verification Checklist (post-implementation)

```bash
npm run check    # TypeScript check must pass
npm run build    # build must succeed

# No real secrets in code:
grep -r "SMTP_PASS\|TELEGRAM_BOT_TOKEN" src/ netlify/ public/
# Should match only variable NAME references, not actual values
```

Test locally (requires `netlify dev`):
```bash
curl -X POST http://localhost:8888/.netlify/functions/contact \
  -H "Content-Type: application/json" \
  -d '{"name":"Test","phone":"+79001234567","message":"Hello","page":"/"}'
```

Expected without env configured: structured error in logs, safe JSON error to client (not stack trace).

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

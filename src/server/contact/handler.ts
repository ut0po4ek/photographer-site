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
    console.error('[handleContactRequest] sendMail failed:', (err as Error).message);
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

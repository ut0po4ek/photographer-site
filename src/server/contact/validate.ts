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

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

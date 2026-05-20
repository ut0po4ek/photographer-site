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

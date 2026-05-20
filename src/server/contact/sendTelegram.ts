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

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

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

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

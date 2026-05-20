export const siteConfig = {
  name: 'Анна Смирнова',
  shortName: 'Анна Смирнова',
  description: 'Фотограф индивидуальных, семейных и love story съёмок.',
  locale: 'ru',
  ogLocale: 'ru_RU',
  url: (import.meta.env.PUBLIC_SITE_URL ?? 'https://example.com').replace(/\/$/, ''),
  year: new Date().getFullYear(),

  contacts: {
    email: 'hello@example.com',
    phone: '+7 999 000-00-00',
    telegram: 'https://t.me/example',
    whatsapp: 'https://wa.me/79999999999',
    instagram: 'https://instagram.com/example',
    max: 'https://max.ru/example',
  },

  nav: [
    { label: 'Обо мне',   href: '/#about' },
    { label: 'Услуги',    href: '/#services' },
    { label: 'Портфолио', href: '/#portfolio' },
    { label: 'Отзывы',   href: '/#reviews' },
    { label: 'Контакты',  href: '/#contacts' },
  ],

  cta: {
    label: 'Записаться',
    href: '/#contacts',
  },

  forms: {
    contactEndpoint: '/.netlify/functions/contact',
    source: 'Anna Smirnova Photography',
  },

  footer: {
    tagline: 'Фотограф индивидуальных, семейных и love story съёмок.',
    privacyHref: 'about:blank',
  },

  seo: {
    ogImage: '/og-image.jpg',
  },
};

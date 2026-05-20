export const siteConfig = {
  name: 'Starter Brand',
  shortName: 'Starter',
  description: 'Reusable Astro starter for modern business websites.',
  locale: 'ru',
  ogLocale: 'ru_RU',
  url: 'https://example.com',
  year: new Date().getFullYear(),

  contacts: {
    email: 'hello@example.com',
    phone: '+7 000 000-00-00',
    address: 'Город, улица',
    // Replace with a real Yandex Maps search URL, e.g.:
    // 'https://yandex.ru/maps/?text=Москва%2C+Пречистенка+1'
    addressMapsHref: 'https://yandex.ru/maps/?text=Город%2C+улица',
    telegram: 'about:blank',
    whatsapp: 'about:blank',
    instagram: 'about:blank',
    vk: 'about:blank',
  },

  nav: [
    { label: 'О нас',    href: '/#about' },
    { label: 'Услуги',   href: '/#services' },
    { label: 'Кейсы',    href: '/#items' },
    { label: 'Процесс',  href: '/#process' },
    { label: 'Команда',  href: '/#team' },
    { label: 'Контакты', href: '/#contacts' },
  ],

  cta: {
    label: 'Обсудить проект',
    href: '/#contacts',
  },

  forms: {
    contactEndpoint: '/.netlify/functions/contact',
    source: 'Starter Brand',
  },

  footer: {
    tagline: 'Современный сайт для вашего бизнеса. Быстрый, адаптивный и SEO-готовый.',
    ctaText: 'Расскажите о своей задаче — обсудим формат и первые шаги.',
    privacyHref: 'about:blank',
  },

  seo: {
    ogImage: '/og-image.jpg',
  },
};

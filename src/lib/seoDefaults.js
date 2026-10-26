// Single source of truth for per-page SEO defaults.
// Imported by the server renderer (api/render.js) and the client <SeoHead>, so the title/description
// Google sees in the HTML and the one the app sets after hydration are always the same.
// Admin SEO settings (site_pages.seo_settings) override these on both sides.

export const SITE_URL = 'https://techfnm.com';
export const SITE_NAME = 'TechFNM';
export const DEFAULT_OG_IMAGE = `${SITE_URL}/og-preview.png`;

export const STATIC_PAGES = {
  '/': {
    id: 'page-home',
    title: 'Digital Marketing Agency In Pakistan | TechFNM',
    h1: 'Digital Marketing Agency in Pakistan',
    description:
      'TechFNM is a digital marketing agency in Pakistan offering SEO services, web development, mobile apps, social media and content writing for businesses worldwide.',
  },
  '/about': {
    id: 'page-about',
    title: 'About TechFNM | Digital Marketing & Web Development Agency',
    h1: 'About TechFNM',
    description:
      'Learn about TechFNM, a Pakistan-based team delivering SEO, web development, app development and digital marketing to clients worldwide.',
  },
  '/services': {
    id: 'page-services',
    title: 'Our Services | SEO, Web Development & Digital Marketing | TechFNM',
    h1: 'Our Digital Services',
    description:
      'Explore TechFNM services: SEO, digital marketing, web development, app development, ecommerce, social media and content writing.',
  },
  '/portfolio': {
    id: 'page-portfolio',
    title: 'Portfolio | Recent Projects by TechFNM',
    h1: 'Our Portfolio',
    description: 'See websites, apps, branding and marketing projects TechFNM has delivered for clients.',
  },
  '/blog': {
    id: 'page-blog',
    title: 'Blog | SEO, Web & Digital Marketing Insights | TechFNM',
    h1: 'TechFNM Blog',
    description: 'Guides and insights on SEO, web development, and digital marketing from the TechFNM team.',
  },
  '/contact': {
    id: 'page-contact',
    title: 'Contact TechFNM | Get a Free Quote',
    h1: 'Contact Us',
    description: 'Contact TechFNM for SEO, web development and digital marketing. Get a free quote via form, WhatsApp or email.',
  },
  '/faq': {
    id: 'page-faq',
    title: 'FAQ | TechFNM',
    h1: 'Frequently Asked Questions',
    description: 'Answers about TechFNM services, project timelines, payments and after-sales support.',
  },
  '/request-service': {
    id: 'page-request-service',
    title: 'Request a Service - Get a Free Quote | TechFNM',
    h1: 'Request a Service',
    description: 'Tell us about your project and get a free quote from TechFNM.',
  },
};

/** Look up the defaults by page id ('page-about' or 'about'). */
export function pageDefaultsById(pageId) {
  if (!pageId) return null;
  const full = pageId.startsWith('page-') ? pageId : `page-${pageId}`;
  const key = Object.keys(STATIC_PAGES).find((k) => STATIC_PAGES[k].id === full);
  return key ? { path: key, ...STATIC_PAGES[key] } : null;
}

/** Services/projects that admins have drafted or trashed must not be public. */
export const isLiveService = (s) => !!s && s.status !== 'draft' && s.status !== 'trash';
export const isPublishedProject = (p) => !!p && (!p.status || p.status === 'published');
export const isPublishedPost = (b) => !!b && (!b.status || b.status === 'published' || b.status === 'live');

/** '/services/web-development' | '/web-development' | 'web-development' → 'web-development' (falls back to the id). */
export const serviceSlug = (s) =>
  String((s && s.slug) || '').replace(/^\/?(services\/)?/, '').replace(/\/$/, '') || String((s && s.id) ?? '');

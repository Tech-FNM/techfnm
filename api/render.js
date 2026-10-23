// Server-side SEO renderer.
// Every public route is rewritten here (see vercel.json). We take the built index.html,
// inject the correct per-page <title>, meta description, canonical, OG/Twitter tags,
// and a crawlable HTML body (H1, intro text, internal links) inside #root.
// React's createRoot() replaces #root on load, and Helmet takes over the data-rh tags,
// so users see exactly the same SPA as before while Google gets real HTML.
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import * as D from '../src/lib/serviceDefaults.js';

const SITE_URL = 'https://techfnm.com';
const DEFAULT_IMAGE = `${SITE_URL}/og-preview.png`;

const STATIC_PAGES = {
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

const FALLBACK_SERVICES = [
  { id: 1, title: 'Digital Marketing', slug: 'digital-marketing', description: 'Data-driven digital marketing strategies that drive targeted traffic and measurable growth.' },
  { id: 2, title: 'Content Writing', slug: 'content-writing', description: 'SEO-friendly content that captures your brand voice and converts readers into customers.' },
  { id: 3, title: 'Ecommerce', slug: 'ecommerce', description: 'Powerful online stores with seamless navigation and secure payment gateways.' },
  { id: 4, title: 'Social Media', slug: 'social-media', description: 'Social media campaigns that build community and deliver measurable engagement.' },
  { id: 5, title: 'Web Development Services', slug: 'web-development', meta_title: 'Web Development Services | TechFNM', description: 'High-performance, responsive websites built with the latest technology.' },
  { id: 6, title: 'App Development', slug: 'app-development', description: 'Fast, scalable mobile and web apps tailored to your business.' },
  {
    id: 7,
    title: 'SEO Services',
    slug: 'seo-services',
    meta_title: 'SEO Services in Pakistan | Affordable SEO Agency | TechFNM',
    meta_description: 'Looking for SEO services in Pakistan? TechFNM offers technical SEO, keyword research, on-page and local SEO, and link building that grow traffic and leads.',
    description: 'TechFNM is an SEO agency in Pakistan that helps businesses rank on Google, get more qualified traffic and turn visitors into leads. Our SEO services include SEO audits, keyword research, on-page SEO, technical SEO, local SEO, content and link building, and monthly reporting.',
  },
];

const esc = (v = '') =>
  String(v).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const plain = (md = '', len = 160) =>
  String(md)
    .replace(/<[^>]+>/g, ' ')
    .replace(/[#*_>`~\[\]()!|-]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, len);

const cleanSlug = (s = '') => String(s).replace(/^\/services\//, '').replace(/^\/blog\//, '').replace(/^\//, '');

let templateCache = null;
async function getTemplate(req) {
  if (templateCache) return templateCache;
  const candidates = [
    path.join(process.cwd(), 'dist', 'app.html'),
  ];
  for (const file of candidates) {
    try {
      const html = fs.readFileSync(file, 'utf8');
      if (html.includes('<div id="root">') && !html.includes('/src/main.tsx')) {
        templateCache = html;
        return html;
      }
    } catch {}
  }
  // Fallback: fetch the static built file from our own deployment.
  const r = await fetch(`https://${req.headers.host}/app.html`);
  templateCache = await r.text();
  return templateCache;
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  return url && key ? createClient(url, key) : null;
}

async function resolvePage(pathname, sb) {
  const links = [];
  let services = [];
  if (sb) {
    try {
      const { data } = await sb.from('services').select('*').order('id', { ascending: true });
      services = data || [];
    } catch {}
  }
  if (!services.length || !services.some((x) => cleanSlug(x.slug) === 'seo-services')) {
    services = [...services, ...FALLBACK_SERVICES.filter((f) => !services.some((x) => cleanSlug(x.slug) === f.slug))];
  }
  services.forEach((s) => links.push({ href: `/services/${cleanSlug(s.slug || s.id)}`, text: s.title }));

  // Service detail
  const svc = pathname.match(/^\/services\/([^/]+)$/);
  if (svc) {
    const slug = decodeURIComponent(svc[1]);
    const s = services.find((x) => cleanSlug(x.slug) === slug || String(x.id) === slug);
    if (s) {
      const seo = s.seo_settings || {};
      return {
        title: seo.seoTitle || s.meta_title || `${s.title} Services | TechFNM`,
        description: seo.metaDescription || s.meta_description || s.description,
        image: seo.socialImage || s.image,
        h1: `${s.title} ${s.hero_accent || seo.hero_accent || 'That Turn Searches Into Loyal Customers'}`.trim(),
        body: s.description,
        sections: serviceSections(s, seo),
        canonical: `${SITE_URL}/services/${cleanSlug(s.slug || s.id)}`,
        links,
        schema: 'service',
        name: s.title,
        faqs: pick(s.faqs, seo.faqs, D.defaultServiceFaqs).map((f) => ({
          question: f.q || f.question,
          answer: f.a || f.answer,
        })),
      };
    }
    return { notFound: true, links };
  }

  // Blog detail
  const blog = pathname.match(/^\/blog\/([^/]+)$/);
  if (blog && sb) {
    const slug = decodeURIComponent(blog[1]);
    try {
      const { data } = await sb.from('blogs').select('*').eq('slug', slug).maybeSingle();
      if (data) {
        const seo = data.seo_settings || {};
        return {
          title: seo.seoTitle || data.meta_title || `${data.title} | TechFNM`,
          description: seo.metaDescription || data.meta_description || data.excerpt || plain(data.content),
          image: seo.socialImage || data.image,
          h1: data.title,
          body: plain(data.content, 1500),
          canonical: `${SITE_URL}/blog/${data.slug}`,
          type: 'article',
          links,
          schema: 'article',
          name: data.title,
          published: data.created_at,
          modified: data.updated_at || data.created_at,
          author: data.author,
        };
      }
      return { notFound: true, links };
    } catch {}
  }

  // Static pages (admin SEO settings from site_pages override defaults)
  const key = pathname.replace(/\/$/, '') || '/';
  if (!STATIC_PAGES[key]) return { notFound: true, links };
  const base = STATIC_PAGES[key];
  let seo = {};
  if (sb) {
    try {
      const { data } = await sb.from('site_pages').select('seo_settings').eq('id', base.id).maybeSingle();
      seo = (data && data.seo_settings) || {};
    } catch {}
  }
  return {
    title: seo.seoTitle || base.title,
    description: seo.metaDescription || base.description,
    image: seo.socialImage,
    h1: seo.h1 || base.h1,
    body: base.description,
    canonical: `${SITE_URL}${key}`,
    links,
    isHome: key === '/',
  };
}

const pick = (...lists) => lists.find((l) => Array.isArray(l) && l.length > 0) || [];

// Full service page content, mirroring the sections rendered by ServiceDetail.tsx
function serviceSections(s, seo) {
  const items = (list) =>
    `<ul>${list
      .map((x) =>
        typeof x === 'string'
          ? `<li>${esc(x)}</li>`
          : `<li><h3>${esc(x.title || x.name || '')}</h3><p>${esc(x.desc || x.story || '')}</p></li>`
      )
      .join('')}</ul>`;
  const parts = [];
  parts.push(items(pick(s.hero_bullets, seo.hero_bullets, D.defaultHeroBullets)));
  parts.push(`<h2>Our Core Approach</h2>${items(pick(s.core_pillars, seo.core_pillars, D.defaultCorePillars))}`);
  parts.push(`<h2>What We Deliver</h2>${items(pick(s.capabilities, s.features, seo.capabilities, D.defaultCapabilities))}`);
  parts.push(`<h2>Key Benefits</h2>${items(pick(s.benefits, seo.benefits, D.defaultBenefits))}`);
  parts.push(
    `<h2>Our Process</h2><ol>${pick(s.process_steps, seo.process_steps, D.defaultProcessSteps)
      .map((x) => `<li><h3>${esc(x.title)}</h3><p>${esc(x.desc)}</p></li>`)
      .join('')}</ol>`
  );
  parts.push(
    `<h2>Results</h2><ul>${pick(s.case_wins, seo.case_wins, D.defaultCaseWins)
      .map((x) => `<li><h3>${esc(x.stat || '')} ${esc(x.title || '')}</h3><p>${esc(x.story || x.desc || '')}</p></li>`)
      .join('')}</ul>`
  );
  parts.push(`<h2>Industries We Serve</h2>${items(pick(s.target_industries, seo.target_industries, D.defaultTargetIndustries))}`);
  parts.push(`<h2>Tools We Use</h2>${items(pick(s.tools_used, seo.tools_used, D.defaultTools))}`);
  parts.push(
    `<h2>Pricing</h2><ul>${pick(s.pricing, seo.pricing, D.defaultPricingPlans)
      .map((x) => `<li><h3>${esc(x.name)}: ${esc(x.price)} ${esc(x.period || '')}</h3>${Array.isArray(x.features) ? `<ul>${x.features.map((f) => `<li>${esc(typeof f === 'string' ? f : f.text || f.name || '')}</li>`).join('')}</ul>` : ''}</li>`)
      .join('')}</ul>`
  );
  parts.push(
    `<h2>Frequently Asked Questions</h2>${pick(s.faqs, seo.faqs, D.defaultServiceFaqs)
      .map((f) => `<h3>${esc(f.q || f.question)}</h3><p>${esc(f.a || f.answer)}</p>`)
      .join('')}`
  );
  if (s.content) parts.push(`<div>${esc(plain(s.content, 5000))}</div>`);
  return parts.join('\n');
}

function buildSchema(page, title, description, image) {
  const out = [];
  const crumbs = [{ name: 'Home', item: `${SITE_URL}/` }];
  if (page.schema === 'service') {
    crumbs.push({ name: 'Services', item: `${SITE_URL}/services` }, { name: page.name, item: page.canonical });
    out.push({
      '@context': 'https://schema.org',
      '@type': 'Service',
      name: page.name,
      description,
      url: page.canonical,
      image,
      serviceType: page.name,
      areaServed: [{ '@type': 'Country', name: 'Pakistan' }, 'Worldwide'],
      provider: { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: 'Tech FNM', url: `${SITE_URL}/` },
    });
    const faqs = (page.faqs || []).filter((f) => f && f.question && f.answer);
    if (faqs.length) {
      out.push({
        '@context': 'https://schema.org',
        '@type': 'FAQPage',
        mainEntity: faqs.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
      });
    }
  } else if (page.schema === 'article') {
    crumbs.push({ name: 'Blog', item: `${SITE_URL}/blog` }, { name: page.name, item: page.canonical });
    out.push({
      '@context': 'https://schema.org',
      '@type': 'BlogPosting',
      headline: String(page.name || title).slice(0, 110),
      description,
      image: [image],
      url: page.canonical,
      mainEntityOfPage: page.canonical,
      datePublished: page.published || undefined,
      dateModified: page.modified || page.published || undefined,
      author: { '@type': page.author ? 'Person' : 'Organization', name: page.author || 'Tech FNM' },
      publisher: {
        '@type': 'Organization',
        '@id': `${SITE_URL}/#organization`,
        name: 'Tech FNM',
        logo: { '@type': 'ImageObject', url: `${SITE_URL}/image/agency-assets/projects/0.3295514356725505.png` },
      },
    });
  } else if (!page.isHome && !page.noindex) {
    crumbs.push({ name: page.h1, item: page.canonical });
  }
  if (crumbs.length > 1) {
    out.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map((c, i) => ({ '@type': 'ListItem', position: i + 1, name: c.name, item: c.item })),
    });
  }
  return out;
}

function setMeta(html, attr, name, content) {
  const re = new RegExp(`<meta\\s+${attr}="${name.replace(/:/g, '\\:')}"[^>]*>`, 'i');
  const tag = `<meta ${attr}="${name}" content="${esc(content)}" data-rh="true" />`;
  return re.test(html) ? html.replace(re, tag) : html.replace('</head>', `  ${tag}\n</head>`);
}

export default async function handler(req, res) {
  const pathname = (req.url || '/').split('?')[0];
  let html = await getTemplate(req);
  let page = await resolvePage(pathname, getSupabase());
  const status = page.notFound ? 404 : 200;
  if (page.notFound) {
    page = {
      title: 'Page Not Found | TechFNM',
      description: 'The page you are looking for does not exist.',
      h1: 'Page not found',
      body: 'The page you are looking for does not exist or has been moved.',
      canonical: '',
      links: page.links,
      noindex: true,
    };
  }

  let title = page.title || STATIC_PAGES['/'].title;
  if (!/techfnm/i.test(title)) title = `${title} | TechFNM`;
  const description = page.description || STATIC_PAGES['/'].description;
  const image = page.image || DEFAULT_IMAGE;

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`);
  html = setMeta(html, 'name', 'description', description);
  html = setMeta(html, 'name', 'title', title);
  html = setMeta(html, 'property', 'og:title', title);
  html = setMeta(html, 'property', 'og:description', description);
  html = setMeta(html, 'property', 'og:url', page.canonical);
  html = setMeta(html, 'property', 'og:image', image);
  html = setMeta(html, 'property', 'og:type', page.type || 'website');
  html = setMeta(html, 'name', 'twitter:title', title);
  html = setMeta(html, 'name', 'twitter:description', description);
  html = setMeta(html, 'name', 'twitter:url', page.canonical);
  html = setMeta(html, 'name', 'twitter:image', image);
  const canonicalTag = page.noindex ? '' : `<link rel="canonical" href="${esc(page.canonical)}" data-rh="true" />`;
  html = /<link\s+rel="canonical"[^>]*>/i.test(html)
    ? html.replace(/<link\s+rel="canonical"[^>]*>/i, canonicalTag)
    : html.replace('</head>', `  ${canonicalTag}\n</head>`);

  // Homepage-only static schema (LocalBusiness/Organization/FAQ) must not repeat on every page
  if (!page.isHome) {
    html = html.replace(/<script type="application\/ld\+json">[\s\S]*?<\/script>/i, '');
  }
  if (page.noindex) {
    html = html.replace(/<meta\s+name="robots"[^>]*>/i, '<meta name="robots" content="noindex, follow" data-rh="true" />');
  }
  const ld = buildSchema(page, title, description, image);
  if (ld.length) {
    html = html.replace('</head>', `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>\n</head>`);
  }

  const nav = [
    ['/', 'Home'], ['/services', 'Services'], ['/portfolio', 'Portfolio'], ['/blog', 'Blog'],
    ['/about', 'About'], ['/faq', 'FAQ'], ['/contact', 'Contact'],
  ];
  const ssr = `<div id="ssr-seo" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap"><header><nav>${nav.map(([h, t]) => `<a href="${h}">${t}</a>`).join(' ')}</nav></header>
<main><h1>${esc(page.h1)}</h1><p>${esc(page.body || description)}</p>
${page.sections || ''}
${page.links.length ? `<h2>Our Services</h2><ul>${page.links.map((l) => `<li><a href="${esc(l.href)}">${esc(l.text)}</a></li>`).join('')}</ul>` : ''}
</main></div>`;
  html = html.replace('<!--SSR_CONTENT-->', ssr);
  // Fallback if template lacks the marker
  if (!html.includes(ssr)) html = html.replace('<div id="root"></div>', `<div id="root">${ssr}</div>`);

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, s-maxage=300, stale-while-revalidate=86400');
  res.status(status).send(html);
}

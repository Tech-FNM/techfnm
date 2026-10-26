// Server-side SEO renderer.
// Every public route is rewritten here (see vercel.json). We take the built app.html,
// inject the correct per-page <title>, meta description, canonical, OG/Twitter tags,
// JSON-LD and the FULL crawlable page content inside #root (built from the same CMS
// tables the React components read). React's createRoot() replaces #root on load and
// Helmet takes over the data-rh tags, so users get the same SPA while crawlers get real HTML.
import fs from 'fs';
import path from 'path';
import { createClient } from '@supabase/supabase-js';
import * as D from '../src/lib/serviceDefaults.js';
import * as C from './_lib/defaults.js';
import {
  SITE_URL,
  SITE_NAME,
  DEFAULT_OG_IMAGE as DEFAULT_IMAGE,
  STATIC_PAGES,
  isLiveService,
  isPublishedProject,
  isPublishedPost,
  serviceSlug,
} from '../src/lib/seoDefaults.js';

const LOGO = `${SITE_URL}/image/agency-assets/projects/0.3295514356725505.png`;

const FALLBACK_SERVICES = [
  ...C.SERVICES,
  {
    id: 7,
    title: 'SEO Services',
    slug: 'seo-services',
    meta_title: 'SEO Services in Pakistan | Affordable SEO Agency | TechFNM',
    meta_description: 'Looking for SEO services in Pakistan? TechFNM offers technical SEO, keyword research, on-page and local SEO, and link building that grow traffic and leads.',
    description: 'TechFNM is an SEO agency in Pakistan that helps businesses rank on Google, get more qualified traffic and turn visitors into leads.',
  },
];

// ---------- helpers ----------
export const esc = (v = '') =>
  String(v ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');

const plain = (md = '', len = 160) =>
  String(md || '')
    .replace(/<[^>]+>/g, ' ')
    .replace(/&nbsp;/g, ' ')
    .replace(/[#*_>`~\[\]()!|]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim()
    .slice(0, len);

export const cleanSlug = (s = '') => String(s || '').replace(/^\/services\//, '').replace(/^\/blog\//, '').replace(/^\//, '');
export const slugify = (s = '') =>
  String(s || '').toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
export const projectSlug = (p) => String(p.slug || '').replace(/^\/?(portfolio\/)?/, '').replace(/\/$/, '') || `${slugify(p.title)}-${p.id}`;
const pick = (...lists) => lists.find((l) => Array.isArray(l) && l.length > 0) || [];
const abs = (u) => (!u ? '' : /^https?:/.test(u) ? u : `${SITE_URL}${u.startsWith('/') ? '' : '/'}${u}`);
const isPublished = isPublishedPost;
// new Date('garbage').toISOString() throws and would 500 the whole page
const isoDate = (d) => {
  const t = d ? new Date(d) : null;
  return t && !isNaN(t.getTime()) ? t.toISOString() : undefined;
};
// A malformed escape such as /blog/%E0%A4 makes decodeURIComponent throw (→ 500); treat it as a plain slug.
const safeDecode = (s) => {
  try {
    return decodeURIComponent(s);
  } catch {
    return s;
  }
};

// Keep only safe tags from CMS rich text, and demote any <h1> to <h2> (the page already has one H1).
function safeHtml(html = '') {
  let s = String(html || '');
  if (!/<[a-z]/i.test(s)) s = `<p>${esc(s).replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>')}</p>`;
  return s
    .replace(/<(script|style|iframe|object|embed)[\s\S]*?<\/\1>/gi, '')
    .replace(/\son\w+="[^"]*"/gi, '')
    .replace(/<h1(\s|>)/gi, '<h2$1')
    .replace(/<\/h1>/gi, '</h2>');
}

// Service H1 = hero headline. Priority: explicit hero title → SEO H1 → meta title before "|" → name + accent.
export function serviceH1(s) {
  const seo = s.seo_settings || {};
  const explicit = s.hero_title || seo.hero_title || seo.h1;
  if (explicit) return String(explicit).trim();
  const mt = String(s.meta_title || seo.seoTitle || '').split('|')[0].trim();
  if (mt && mt.toLowerCase() !== String(s.title).toLowerCase() && mt.split(' ').length >= 3) return mt;
  return `${s.title} ${s.hero_accent || seo.hero_accent || 'That Turn Searches Into Loyal Customers'}`.trim();
}

let templateCache = null;
async function getTemplate(req) {
  if (templateCache) return templateCache;
  try {
    const html = fs.readFileSync(path.join(process.cwd(), 'dist', 'app.html'), 'utf8');
    if (html.includes('<div id="root">') && !html.includes('/src/main.tsx')) {
      templateCache = html;
      return html;
    }
  } catch {}
  const r = await fetch(`https://${req.headers.host}/app.html`);
  templateCache = await r.text();
  return templateCache;
}

function getSupabase() {
  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  return url && key ? createClient(url, key) : null;
}

async function q(promise, fallback) {
  try {
    const { data, error } = await promise;
    if (error || data == null) return fallback;
    return data;
  } catch {
    return fallback;
  }
}

async function loadServices(sb) {
  let services = sb ? await q(sb.from('services').select('*').order('id', { ascending: true }), []) : [];
  if (!services.length) services = FALLBACK_SERVICES;
  // Drafted/trashed services are hidden in the app (useServices) — don't publish them here either.
  services = services.filter(isLiveService);
  if (!services.some((x) => serviceSlug(x) === 'seo-services')) {
    services = [...services, FALLBACK_SERVICES.find((f) => f.slug === 'seo-services')];
  }
  return services;
}

// Same fallback rule everywhere (index, detail, homepage, sitemap): an empty table means "use defaults".
async function loadProjects(sb) {
  const rows = sb ? await q(sb.from('projects').select('*').order('id', { ascending: true }), []) : [];
  return (rows.length ? rows : C.PROJECTS).filter(isPublishedProject);
}

const fmtDate = (d) => {
  const t = d ? new Date(d) : null;
  return t && !isNaN(t.getTime()) ? t.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' }) : '';
};

// ---------- page resolvers ----------
async function resolvePage(pathname, sb) {
  const services = await loadServices(sb);
  const serviceLinks = services.map((s) => ({ href: `/services/${serviceSlug(s)}`, text: s.title }));
  const ctx = { services, serviceLinks };

  // Service detail
  const svc = pathname.match(/^\/services\/([^/]+)\/?$/);
  if (svc) {
    const slug = safeDecode(svc[1]);
    const s = services.find((x) => serviceSlug(x) === slug || String(x.id) === slug);
    if (!s) return { notFound: true, ...ctx };
    const seo = s.seo_settings || {};
    const faqs = pick(s.faqs, seo.faqs, D.defaultServiceFaqs).map((f) => ({ question: f.q || f.question, answer: f.a || f.answer }));
    const related = sb ? await relatedPostsFor(sb, s) : [];
    return {
      ...ctx,
      // Same priority as the React page (ServiceDetail.tsx) so server and client never disagree.
      title: s.meta_title || seo.seoTitle || `${s.title} Services | TechFNM`,
      description: s.meta_description || seo.metaDescription || s.description,
      image: seo.socialImage || s.image,
      h1: serviceH1(s),
      body: `<p>${esc(s.description)}</p>${serviceSections(s, seo)}${relatedHtml(related)}`,
      canonical: `${SITE_URL}/services/${serviceSlug(s)}`,
      schema: 'service',
      name: s.title,
      faqs,
      crumbs: [['Services', `${SITE_URL}/services`], [s.title, `${SITE_URL}/services/${serviceSlug(s)}`]],
    };
  }

  // Blog detail
  const blog = pathname.match(/^\/blog\/([^/]+)\/?$/);
  if (blog) {
    const slug = safeDecode(blog[1]);
    const data = sb ? await q(sb.from('blogs').select('*').eq('slug', slug).maybeSingle(), null) : null;
    if (!data || !isPublished(data)) return { notFound: true, ...ctx };
    return { ...ctx, ...(await blogPage(sb, data)) };
  }

  // Portfolio project detail
  const proj = pathname.match(/^\/portfolio\/([^/]+)\/?$/);
  if (proj) {
    const slug = safeDecode(proj[1]);
    const projects = await loadProjects(sb);
    const p = projects.find((x) => projectSlug(x) === slug || String(x.id) === slug);
    if (!p) return { notFound: true, ...ctx };
    return { ...ctx, ...projectPage(p) };
  }

  // Static pages (admin SEO settings from site_pages override defaults)
  const key = pathname.replace(/\/$/, '') || '/';
  if (!STATIC_PAGES[key]) return { notFound: true, ...ctx };
  const base = STATIC_PAGES[key];
  const row = sb ? await q(sb.from('site_pages').select('seo_settings, sections_data').eq('id', base.id).maybeSingle(), null) : null;
  const seo = (row && row.seo_settings) || {};
  const page = {
    ...ctx,
    title: seo.seoTitle || base.title,
    description: seo.metaDescription || base.description,
    image: seo.socialImage,
    h1: seo.h1 || base.h1,
    body: `<p>${esc(seo.metaDescription || base.description)}</p>`,
    canonical: `${SITE_URL}${key === '/' ? '/' : key}`,
    isHome: key === '/',
    crumbs: key === '/' ? [] : [[seo.h1 || base.h1, `${SITE_URL}${key}`]],
  };
  if (key === '/') Object.assign(page, await homePage(sb, row, services));
  if (key === '/blog') page.body += await blogIndexHtml(sb);
  if (key === '/portfolio') page.body += await portfolioIndexHtml(sb);
  if (key === '/services') page.body += servicesListHtml(services);
  return page;
}

// ---------- homepage ----------
async function homePage(sb, row, services) {
  // Same merge order as usePageContent('page-home'): canonical defaults → site_pages.sections_data → pages_content rows
  let d = { ...C.HOME, ...((row && row.sections_data) || {}) };
  if (sb) {
    const pc = await q(sb.from('pages_content').select('*'), []);
    pc.forEach((r) => r && r.content && r.id !== 'site_header' && Object.assign(d, r.content));
  }
  const [faqRows, testRows, blogRows, projects] = await Promise.all([
    sb ? q(sb.from('faqs').select('*').order('created_at', { ascending: true }), []) : [],
    sb ? q(sb.from('testimonials').select('*'), []) : [],
    sb ? q(sb.from('blogs').select('title,slug,image,meta_description,content,created_at,status,category,author,seo_settings').order('created_at', { ascending: false }), []) : [],
    loadProjects(sb),
  ]);
  const faqs = (faqRows.length ? faqRows : C.FAQS).map((f) => ({ question: f.question || f.q, answer: f.answer || f.a })).filter((f) => f.question && f.answer);
  const testimonials = testRows.length ? testRows : C.TESTIMONIALS;
  const posts = blogRows.filter(isPublished).slice(0, 3);

  const sec = (badge, heading, desc) =>
    `${badge ? `<p>${esc(badge)}</p>` : ''}<h2>${esc(heading)}</h2>${desc ? `<p>${esc(desc)}</p>` : ''}`;
  const link = (href, text) => (href && text ? `<p><a href="${esc(href)}">${esc(text)}</a></p>` : '');
  const lines = (s) => String(s || '').split('\n').map((x) => x.trim()).filter(Boolean);

  const parts = [];
  // Hero
  parts.push(`<section id="hero"><p>${esc(d.hero_badge)}</p><p>${esc(d.hero_desc)}</p>
${link(d.hero_cta1_link, d.hero_cta1_text)}${link('/services', d.hero_cta2_text)}
<ul>${[1, 2, 3].map((i) => d[`hero_stat${i}_num`] ? `<li>${esc(d[`hero_stat${i}_num`])} ${esc(d[`hero_stat${i}_lbl`])}</li>` : '').join('')}</ul></section>`);
  // About
  parts.push(`<section id="about">${sec(d.about_badge, d.about_heading, d.about_desc)}
${d.about_image ? `<img src="${esc(d.about_image)}" alt="${esc(d.about_heading)}" width="800" height="533" loading="lazy" />` : ''}
<p>${esc(d.about_founder_name)} — ${esc(d.about_founder_role)}</p>
${['mission', 'vision', 'goals'].map((k) => (d[`about_${k}_title`] ? `<h3>${esc(d[`about_${k}_title`])}</h3><p>${esc(d[`about_${k}_desc`])}</p>` : '')).join('')}
${link(d.about_btn_link, d.about_btn_text)}</section>`);
  // Services
  parts.push(`<section id="services">${sec(d.services_badge, d.services_heading, d.services_desc)}
<ul>${services.map((s) => `<li><h3><a href="/services/${esc(serviceSlug(s))}">${esc(s.title)}</a></h3><p>${esc(s.description)}</p></li>`).join('')}</ul>
${link(d.services_btn_link, d.services_btn_text)}</section>`);
  // Core features
  parts.push(`<section id="features">${sec(d.features_badge, d.features_heading, d.features_desc)}
<ul>${[1, 2, 3, 4, 5, 6].map((i) => (d[`feat${i}_title`] ? `<li><h3>${esc(d[`feat${i}_title`])}</h3><p>${esc(d[`feat${i}_desc`])}</p></li>` : '')).join('')}</ul></section>`);
  // Portfolio
  if (projects.length) {
    parts.push(`<section id="portfolio">${sec(d.portfolio_badge, d.portfolio_heading, d.portfolio_desc)}
<ul>${projects.slice(0, 6).map((p) => `<li><a href="/portfolio/${esc(projectSlug(p))}">${esc(p.title)}</a> — ${esc(p.category || '')}</li>`).join('')}</ul>
${link(d.portfolio_btn_link, d.portfolio_btn_text)}</section>`);
  }
  // Process
  parts.push(`<section id="process">${sec(d.process_badge, d.process_heading, d.process_desc)}
<ol>${[1, 2, 3, 4].map((i) => (d[`step${i}_title`] ? `<li><h3>${esc(d[`step${i}_title`])}</h3><p>${esc(d[`step${i}_desc`])}</p></li>` : '')).join('')}</ol>
${link(d.process_btn_link, d.process_btn_text)}</section>`);
  // Pricing
  parts.push(`<section id="pricing">${sec(d.pricing_badge, d.pricing_heading, d.pricing_desc)}
<ul>${[1, 2, 3].map((i) => (d[`plan${i}_name`] ? `<li><h3>${esc(d[`plan${i}_name`])}</h3><p>${esc(d[`plan${i}_desc`])}</p>${d[`plan${i}_price`] ? `<p>$${esc(d[`plan${i}_price`])}</p>` : ''}<ul>${lines(d[`plan${i}_features`]).map((f) => `<li>${esc(f)}</li>`).join('')}</ul></li>` : '')).join('')}</ul></section>`);
  // FAQ
  if (faqs.length) {
    parts.push(`<section id="faq">${sec(d.faq_badge, d.faq_heading, d.faq_desc)}
${faqs.map((f) => `<h3>${esc(f.question)}</h3><p>${esc(f.answer)}</p>`).join('')}</section>`);
  }
  // Testimonials
  if (testimonials.length) {
    parts.push(`<section id="testimonials">${sec(d.testimonials_badge, d.testimonials_heading, d.testimonials_desc)}
${testimonials.map((t) => `<blockquote><p>${esc(t.content || t.text || '')}</p><footer>${esc(t.name || '')}${t.role ? `, ${esc(t.role)}` : ''}</footer></blockquote>`).join('')}</section>`);
  }
  // Blog teaser
  if (posts.length) {
    parts.push(`<section id="blog">${sec(d.blogs_badge, d.blogs_heading, d.blogs_desc)}
<ul>${posts.map((p) => `<li><h3><a href="/blog/${esc(p.slug)}">${esc(p.title)}</a></h3><p>${esc(plain(p.meta_description || p.content, 160))}</p></li>`).join('')}</ul>
${link(d.blogs_btn_link, d.blogs_btn_text)}</section>`);
  }
  // CTA
  parts.push(`<section id="contact">${sec(d.cta_badge, d.cta_heading, d.cta_desc)}${link(d.cta_btn_link, d.cta_btn_text)}</section>`);

  const title = d.hero_title || STATIC_PAGES['/'].h1;
  const hl = d.hero_highlight_word;
  let titleHtml = esc(title);
  const at = hl ? title.toLowerCase().indexOf(String(hl).toLowerCase()) : -1;
  if (at >= 0) {
    const w = title.slice(at, at + String(hl).length);
    titleHtml = `${esc(title.slice(0, at))}<span class="text-[#e5432e] inline-block relative">${esc(w)}</span>${esc(title.slice(at + w.length))}`;
  }
  // Visible, styled hero (same markup/classes as Hero.tsx) so the LCP text paints from the HTML
  // instead of waiting for the JS bundle and the CMS request.
  const heroHtml = `<section id="home" class="relative min-h-[92vh] lg:min-h-screen bg-black flex flex-col justify-center pt-28 sm:pt-36 pb-16 overflow-hidden"><div class="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center"><div class="inline-flex items-center gap-2 bg-[#1B1B1B] border border-white/10 rounded-full px-4 py-1.5 mb-6 sm:mb-8 text-xs sm:text-sm text-zinc-300 shadow-inner"><span class="font-medium tracking-wide uppercase text-zinc-200">${esc(d.hero_badge)}</span></div><h1 class="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-extrabold tracking-tight text-white leading-[1.08] max-w-5xl">${titleHtml}</h1><p class="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-zinc-400 max-w-3xl font-normal leading-relaxed">${esc(d.hero_desc)}</p></div></section>`;
  return { body: parts.join('\n'), faqs, h1: title, heroHtml, cms: { 'page-home': d } };
}

// ---------- blog ----------
async function blogPage(sb, data) {
  const seo = data.seo_settings || {};
  const excerpt = data.excerpt || plain(data.content, 155);
  const canonical = `${SITE_URL}/blog/${data.slug}`;
  const image = abs(seo.socialImage || data.image) || DEFAULT_IMAGE;
  const alt = seo.imageAlt || data.image_alt || data.title;
  const cats = [data.category, ...String(data.tags || '').split(',')].map((x) => String(x || '').trim()).filter(Boolean);
  const faqs = pick(data.faqs, seo.schemaFaqs).map((f) => ({ question: f.q || f.question, answer: f.a || f.answer })).filter((f) => f.question && f.answer);
  const author = data.author && data.author !== 'admin' ? data.author : 'TechFNM Editorial';
  const body = `<article>
<p>By <span>${esc(author)}</span> · <time datetime="${esc(data.created_at || '')}">${esc(fmtDate(data.created_at))}</time>${data.category ? ` · <a href="/blog">${esc(data.category)}</a>` : ''}</p>
${data.image ? `<img src="${esc(data.image)}" alt="${esc(alt)}" width="1200" height="630" fetchpriority="high" />` : ''}
${safeHtml(data.content)}
${cats.length > 1 ? `<p>Tags: ${cats.slice(1).map(esc).join(', ')}</p>` : ''}
</article>`;
  return {
    title: seo.seoTitle || data.meta_title || data.title,
    description: seo.metaDescription || data.meta_description || excerpt,
    image,
    h1: data.title,
    body,
    canonical,
    type: 'article',
    schema: 'article',
    name: data.title,
    published: data.created_at,
    modified: data.updated_at || data.created_at,
    author,
    category: data.category,
    imageAlt: alt,
    // Only preload an image the page actually shows (the app renders data.image as the hero)
    lcpImage: data.image || '',
    faqs,
    crumbs: [['Blog', `${SITE_URL}/blog`], [data.title, canonical]],
  };
}

async function relatedPostsFor(sb, s) {
  const seo = s.seo_settings || {};
  const slugs = pick(s.related_posts, seo.related_posts);
  if (!slugs.length) return [];
  const rows = await q(sb.from('blogs').select('title,slug,status').in('slug', slugs), []);
  return rows.filter(isPublished);
}
const relatedHtml = (rows) =>
  rows.length ? `<h2>Related Guides</h2><ul>${rows.map((r) => `<li><a href="/blog/${esc(r.slug)}">${esc(r.title)}</a></li>`).join('')}</ul>` : '';

async function blogIndexHtml(sb) {
  if (!sb) return '';
  const rows = (await q(sb.from('blogs').select('title,slug,meta_description,content,status,created_at').order('created_at', { ascending: false }), [])).filter(isPublished);
  return rows.length
    ? `<ul>${rows.map((p) => `<li><h2><a href="/blog/${esc(p.slug)}">${esc(p.title)}</a></h2><p>${esc(plain(p.meta_description || p.content, 160))}</p></li>`).join('')}</ul>`
    : '';
}

// ---------- portfolio ----------
function projectPage(p) {
  const seo = p.seo_settings || {};
  const canonical = `${SITE_URL}/portfolio/${projectSlug(p)}`;
  const h1 = seo.h1 || `${p.title} – ${p.category || 'Project'} by TechFNM`;
  const alt = seo.imageAlt || `${p.title} ${p.category || ''} project by TechFNM`.replace(/\s+/g, ' ');
  const img = p.featured_image || p.image;
  return {
    title: seo.seoTitle || `${p.title} | ${p.category || 'Portfolio'} Project | TechFNM`,
    description: seo.metaDescription || plain(p.description || p.content, 155) || `${p.title}: a ${p.category || ''} project delivered by TechFNM.`,
    image: abs(seo.socialImage || img),
    h1,
    body: `${img ? `<img src="${esc(img)}" alt="${esc(alt)}" width="1200" height="800" fetchpriority="high" />` : ''}
<p>Category: ${esc(p.category || '')}${p.client_name ? ` · Client: ${esc(p.client_name)}` : ''}</p>
${p.description ? `<p>${esc(p.description)}</p>` : ''}${p.content ? safeHtml(p.content) : ''}
${p.project_url ? `<p><a href="${esc(p.project_url)}" rel="noopener">Visit project</a></p>` : ''}
<p><a href="/portfolio">Back to portfolio</a> · <a href="/contact">Start a similar project</a></p>`,
    canonical,
    lcpImage: img,
    crumbs: [['Portfolio', `${SITE_URL}/portfolio`], [p.title, canonical]],
  };
}
async function portfolioIndexHtml(sb) {
  const rows = await loadProjects(sb);
  return `<ul>${rows.map((p) => `<li><h2><a href="/portfolio/${esc(projectSlug(p))}">${esc(p.title)}</a></h2><p>${esc(p.category || '')}</p></li>`).join('')}</ul>`;
}
const servicesListHtml = (services) =>
  `<ul>${services.map((s) => `<li><h2><a href="/services/${esc(serviceSlug(s))}">${esc(s.title)}</a></h2><p>${esc(s.description)}</p></li>`).join('')}</ul>`;

// ---------- service sections (mirror ServiceDetail.tsx) ----------
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
  if (s.content) parts.push(safeHtml(s.content));
  return parts.join('\n');
}

// ---------- JSON-LD ----------
const faqLd = (faqs) => ({
  '@context': 'https://schema.org',
  '@type': 'FAQPage',
  mainEntity: faqs.map((f) => ({ '@type': 'Question', name: plain(f.question, 500), acceptedAnswer: { '@type': 'Answer', text: plain(f.answer, 2000) } })),
});

function buildSchema(page, title, description, image) {
  const out = [];
  const faqs = (page.faqs || []).filter((f) => f && f.question && f.answer);
  if (page.schema === 'service') {
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
  } else if (page.schema === 'article') {
    out.push({
      '@context': 'https://schema.org',
      '@type': 'Article',
      headline: String(page.name || title).slice(0, 110),
      description,
      image: [{ '@type': 'ImageObject', url: image, caption: page.imageAlt }],
      url: page.canonical,
      mainEntityOfPage: { '@type': 'WebPage', '@id': page.canonical },
      datePublished: isoDate(page.published),
      dateModified: isoDate(page.modified) || isoDate(page.published),
      articleSection: page.category || undefined,
      author: page.author === 'TechFNM Editorial'
        ? { '@type': 'Organization', name: 'TechFNM Editorial', url: `${SITE_URL}/` }
        : { '@type': 'Person', name: page.author },
      publisher: { '@type': 'Organization', '@id': `${SITE_URL}/#organization`, name: 'Tech FNM', logo: { '@type': 'ImageObject', url: LOGO } },
    });
  }
  if (faqs.length && !page.isHome) out.push(faqLd(faqs));
  if (page.crumbs && page.crumbs.length) {
    const crumbs = [['Home', `${SITE_URL}/`], ...page.crumbs];
    out.push({
      '@context': 'https://schema.org',
      '@type': 'BreadcrumbList',
      itemListElement: crumbs.map(([name, item], i) => ({ '@type': 'ListItem', position: i + 1, name, item })),
    });
  }
  return out;
}

function setMeta(html, attr, name, content) {
  const re = new RegExp(`<meta\\s+${attr}="${name.replace(/:/g, '\\:')}"[^>]*>`, 'i');
  const tag = `<meta ${attr}="${name}" content="${esc(content)}" data-rh="true" />`;
  return re.test(html) ? html.replace(re, tag) : html.replace('</head>', `  ${tag}\n</head>`);
}

const LD_RE = /<script type="application\/ld\+json">([\s\S]*?)<\/script>/i;

export default async function handler(req, res) {
  const [pathname, query = ''] = (req.url || '/').split('?');
  // /about/ and /about served the same page under two URLs; collapse to the canonical (no trailing slash).
  if (pathname.length > 1 && pathname.endsWith('/')) {
    res.setHeader('Location', `${pathname.replace(/\/+$/, '') || '/'}${query ? `?${query}` : ''}`);
    res.setHeader('Cache-Control', 'public, max-age=3600');
    return res.status(301).end();
  }
  let html = await getTemplate(req);
  const sb = getSupabase();
  let page = await resolvePage(pathname, sb);
  const status = page.notFound ? 404 : 200;
  if (page.notFound) {
    page = {
      title: 'Page Not Found | TechFNM',
      description: 'The page you are looking for does not exist.',
      h1: 'Page not found',
      body: '<p>The page you are looking for does not exist or has been moved.</p><p><a href="/">Go to Home</a> · <a href="/services">Our Services</a></p>',
      canonical: '',
      serviceLinks: page.serviceLinks || [],
      noindex: true,
    };
  }

  let title = page.title || STATIC_PAGES['/'].title;
  if (!/techfnm/i.test(title)) title = `${title} | TechFNM`;
  const description = page.description || STATIC_PAGES['/'].description;
  const image = abs(page.image) || DEFAULT_IMAGE;

  html = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${esc(title)}</title>`);
  html = setMeta(html, 'name', 'description', description);
  html = setMeta(html, 'name', 'title', title);
  html = setMeta(html, 'property', 'og:title', title);
  html = setMeta(html, 'property', 'og:description', description);
  html = setMeta(html, 'property', 'og:image', image);
  html = setMeta(html, 'property', 'og:type', page.type || 'website');
  html = setMeta(html, 'property', 'og:site_name', SITE_NAME);
  html = setMeta(html, 'property', 'og:locale', 'en_US');
  html = setMeta(html, 'name', 'twitter:card', 'summary_large_image');
  html = setMeta(html, 'name', 'twitter:title', title);
  html = setMeta(html, 'name', 'twitter:description', description);
  html = setMeta(html, 'name', 'twitter:image', image);
  if (page.imageAlt) {
    html = setMeta(html, 'property', 'og:image:alt', page.imageAlt);
    html = setMeta(html, 'name', 'twitter:image:alt', page.imageAlt);
  }
  // Blog/portfolio featured image is the LCP element: start downloading it before the JS runs
  if (page.lcpImage) {
    html = html.replace('</head>', `<link rel="preload" as="image" href="${esc(page.lcpImage)}" fetchpriority="high" />\n</head>`);
  }
  if (page.type === 'article' && isoDate(page.published)) {
    html = setMeta(html, 'property', 'article:published_time', isoDate(page.published));
    if (isoDate(page.modified)) html = setMeta(html, 'property', 'article:modified_time', isoDate(page.modified));
  }

  if (page.noindex) {
    // 404: no canonical, no og:url, robots noindex
    html = html.replace(/<link\s+rel="canonical"[^>]*>\s*/gi, '');
    html = html.replace(/<meta\s+(property="og:url"|name="twitter:url")[^>]*>\s*/gi, '');
    html = /<meta\s+name="robots"[^>]*>/i.test(html)
      ? html.replace(/<meta\s+name="robots"[^>]*>/i, '<meta name="robots" content="noindex" data-rh="true" />')
      : html.replace('</head>', '<meta name="robots" content="noindex" data-rh="true" />\n</head>');
  } else {
    html = setMeta(html, 'property', 'og:url', page.canonical);
    html = setMeta(html, 'name', 'twitter:url', page.canonical);
    const canonicalTag = `<link rel="canonical" href="${esc(page.canonical)}" data-rh="true" />`;
    html = /<link\s+rel="canonical"[^>]*>/i.test(html)
      ? html.replace(/<link\s+rel="canonical"[^>]*>/i, canonicalTag)
      : html.replace('</head>', `  ${canonicalTag}\n</head>`);
  }

  // Static site-wide schema in app.html (LocalBusiness/Organization/WebSite/WebPage + a static FAQPage).
  // Home: keep the business entities but replace the static FAQPage with one built from the live FAQ section.
  // Other pages: keep only Organization + WebSite (the entities every page's schema points at via @id);
  // the homepage WebPage/FAQ blocks would describe the wrong page.
  const m = html.match(LD_RE);
  if (m) {
    let replacement = '';
    try {
      let arr = JSON.parse(m[1]);
      arr = (Array.isArray(arr) ? arr : [arr]).filter((x) =>
        page.isHome ? x['@type'] !== 'FAQPage' : !page.noindex && (x['@type'] === 'Organization' || x['@type'] === 'WebSite')
      );
      if (page.isHome && page.faqs && page.faqs.length) arr.push(faqLd(page.faqs));
      if (arr.length) replacement = `<script type="application/ld+json">${JSON.stringify(arr).replace(/</g, '\\u003c')}</script>`;
    } catch {
      replacement = page.isHome ? m[0] : '';
    }
    html = html.replace(m[0], replacement);
  }
  const ld = buildSchema(page, title, description, image);
  if (ld.length) {
    html = html.replace('</head>', `<script type="application/ld+json">${JSON.stringify(ld).replace(/</g, '\\u003c')}</script>\n</head>`);
  }

  const nav = [
    ['/', 'Home'], ['/about', 'About Us'], ['/services', 'Services'], ['/portfolio', 'Portfolio'], ['/blog', 'Blog'],
    ['/faq', 'FAQ'], ['/contact', 'Contact'],
  ];
  const svcLinks = (page.serviceLinks || []).map((l) => `<li><a href="${esc(l.href)}">${esc(l.text)}</a></li>`).join('');
  // Crawlable mirror of the React page. It is replaced by the app as soon as JS runs.
  const ssr = `<div id="ssr-seo" style="position:absolute;width:1px;height:1px;overflow:hidden;clip:rect(0,0,0,0);white-space:nowrap"><header><nav>${nav.map(([h, t]) => `<a href="${h}">${t}</a>`).join(' ')}<ul>${svcLinks}</ul></nav></header>
<main>${page.heroHtml ? '' : `<h1>${esc(page.h1)}</h1>`}
${page.body || `<p>${esc(description)}</p>`}
</main>
<footer><h2>Our Services</h2><ul>${svcLinks}</ul><h2>Quick Links</h2><ul>${nav.map(([h, t]) => `<li><a href="${h}">${t}</a></li>`).join('')}</ul>
<p>TechFNM – Digital Marketing Agency in Pakistan. Karachi, Pakistan. Phone: 0313-9023118. Email: techhfnm@gmail.com</p></footer></div>`;
  const rootHtml = (page.heroHtml || '') + ssr;
  html = html.replace('<!--SSR_CONTENT-->', rootHtml);
  if (!html.includes(rootHtml)) html = html.replace('<div id="root"></div>', `<div id="root">${rootHtml}</div>`);
  // Hand the CMS content the server already loaded to the app, so the first client render
  // matches the HTML (no text swap / layout shift after the Supabase request).
  if (page.cms) {
    html = html.replace('</head>', `<script>window.__CMS_PAGES__=${JSON.stringify(page.cms).replace(/</g, '\\u003c')}</script>\n</head>`);
  }

  res.setHeader('Content-Type', 'text/html; charset=utf-8');
  // Short CDN cache so CMS edits go live within ~1 minute, plus a per-URL cache tag that
  // /api/revalidate purges instantly when the admin saves a page/service/post.
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.setHeader('CDN-Cache-Control', 'public, s-maxage=60, stale-while-revalidate=30');
  res.setHeader('Vercel-Cache-Tag', `page:${pathname.replace(/\/$/, '') || '/'}`);
  res.status(status).send(html);
}

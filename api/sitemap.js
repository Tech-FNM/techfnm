// Dynamic sitemap built from the database: static pages (site_pages), services, published blog posts
// and portfolio projects, each with a real <lastmod>. /admin and unknown/404 URLs are never listed.
import { createClient } from '@supabase/supabase-js';
import { PROJECTS } from './_lib/defaults.js';
import { SITE_URL, isLiveService, isPublishedProject, isPublishedPost, serviceSlug } from '../src/lib/seoDefaults.js';

const STATIC_PAGES = [
  { path: '/', id: 'page-home', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', id: 'page-about', priority: '0.8', changefreq: 'monthly' },
  { path: '/services', id: 'page-services', priority: '0.9', changefreq: 'weekly' },
  { path: '/portfolio', id: 'page-portfolio', priority: '0.8', changefreq: 'weekly' },
  { path: '/blog', id: 'page-blog', priority: '0.9', changefreq: 'daily' },
  { path: '/contact', id: 'page-contact', priority: '0.7', changefreq: 'monthly' },
  { path: '/faq', id: 'page-faq', priority: '0.6', changefreq: 'monthly' },
  { path: '/request-service', id: 'page-request-service', priority: '0.7', changefreq: 'monthly' },
];

const FALLBACK_SERVICES = ['digital-marketing', 'content-writing', 'ecommerce', 'social-media', 'web-development', 'app-development', 'seo-services'];

const day = (d) => {
  try {
    return d ? new Date(d).toISOString().split('T')[0] : null;
  } catch {
    return null;
  }
};
const latest = (...ds) => ds.map(day).filter(Boolean).sort().pop() || null;
const slugify = (s = '') => String(s || '').toLowerCase().replace(/['’]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');
const xmlEsc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

const entry = (loc, lastmod, changefreq, priority) =>
  `  <url>\n    <loc>${xmlEsc(loc)}</loc>\n${lastmod ? `    <lastmod>${lastmod}</lastmod>\n` : ''}    <changefreq>${changefreq}</changefreq>\n    <priority>${priority}</priority>\n  </url>`;

async function rows(sb, table, cols) {
  try {
    const { data, error } = await sb.from(table).select(cols);
    return error ? null : data;
  } catch {
    return null;
  }
}

export default async function handler(req, res) {
  const urls = [];
  const seen = new Set();
  const add = (p, lastmod, cf, pr) => {
    if (!p || p.startsWith('/admin') || seen.has(p)) return;
    seen.add(p);
    urls.push(entry(`${SITE_URL}${p}`, lastmod, cf, pr));
  };

  const url = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.VITE_SUPABASE_URL;
  const key = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.VITE_SUPABASE_ANON_KEY;
  const sb = url && key ? createClient(url, key) : null;

  const [pages, services, blogs, projects] = sb
    ? await Promise.all([
        rows(sb, 'site_pages', '*'),
        rows(sb, 'services', '*'),
        rows(sb, 'blogs', 'slug, created_at, updated_at, status'),
        rows(sb, 'projects', '*'),
      ])
    : [null, null, null, null];

  const blogList = (blogs || []).filter((b) => b.slug && isPublishedPost(b));
  const newestPost = latest(...blogList.map((b) => b.updated_at || b.created_at));

  for (const p of STATIC_PAGES) {
    const row = (pages || []).find((x) => x.id === p.id);
    let lm = latest(row && (row.updated_at || row.created_at));
    if (p.path === '/blog' || p.path === '/') lm = latest(lm, newestPost);
    add(p.path, lm, p.changefreq, p.priority);
  }

  // Drafted/trashed services 404 in api/render.js, so they must not be listed here.
  const svcList = (services && services.length ? services : FALLBACK_SERVICES.map((slug) => ({ slug }))).filter(isLiveService);
  if (!svcList.some((s) => serviceSlug(s) === 'seo-services')) svcList.push({ slug: 'seo-services' });
  for (const s of svcList) {
    add(`/services/${serviceSlug(s)}`, latest(s.updated_at || s.created_at), 'weekly', '0.8');
  }

  for (const b of blogList) add(`/blog/${b.slug}`, latest(b.updated_at || b.created_at), 'monthly', '0.7');

  // An empty projects table falls back to the defaults (same rule as api/render.js)
  for (const p of (projects && projects.length ? projects : PROJECTS).filter(isPublishedProject)) {
    add(`/portfolio/${String(p.slug || '').replace(/^\/?(portfolio\/)?/, '').replace(/\/$/, '') || `${slugify(p.title)}-${p.id}`}`, latest(p.updated_at || p.created_at), 'monthly', '0.6');
  }

  const xml = `<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n${urls.join('\n')}\n</urlset>`;
  res.setHeader('Content-Type', 'application/xml; charset=utf-8');
  res.setHeader('Cache-Control', 'public, max-age=0, must-revalidate');
  res.setHeader('CDN-Cache-Control', 'public, s-maxage=300, stale-while-revalidate=60');
  res.setHeader('Vercel-Cache-Tag', 'sitemap');
  res.status(200).send(xml);
}

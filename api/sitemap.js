import { createClient } from '@supabase/supabase-js';

const SITE_URL = 'https://techfnm.com';

// Static pages with their priorities and change frequencies
const STATIC_PAGES = [
  { path: '/', priority: '1.0', changefreq: 'weekly' },
  { path: '/about', priority: '0.8', changefreq: 'monthly' },
  { path: '/services', priority: '0.9', changefreq: 'weekly' },
  { path: '/portfolio', priority: '0.8', changefreq: 'weekly' },
  { path: '/blog', priority: '0.9', changefreq: 'daily' },
  { path: '/contact', priority: '0.7', changefreq: 'monthly' },
  { path: '/faq', priority: '0.6', changefreq: 'monthly' },
  { path: '/request-service', priority: '0.7', changefreq: 'monthly' },
];

// Fallback service slugs (in case Supabase is unavailable)
const FALLBACK_SERVICES = [
  'digital-marketing',
  'content-writing',
  'ecommerce',
  'social-media',
  'web-development',
  'app-development',
  'seo-services',
];

// Fallback blog slugs (in case Supabase is unavailable)
const FALLBACK_BLOGS = [
  'how-we-build-scalable-cloud-native-applications',
  'ai-powered-digital-transformation',
  'data-driven-seo-performance-marketing',
];

function formatDate(dateStr) {
  if (!dateStr) return new Date().toISOString().split('T')[0];
  try {
    return new Date(dateStr).toISOString().split('T')[0];
  } catch {
    return new Date().toISOString().split('T')[0];
  }
}

function buildUrlEntry(loc, lastmod, changefreq, priority) {
  return `  <url>
    <loc>${loc}</loc>
    <lastmod>${lastmod}</lastmod>
    <changefreq>${changefreq}</changefreq>
    <priority>${priority}</priority>
  </url>`;
}

export default async function handler(req, res) {
  const today = new Date().toISOString().split('T')[0];
  const urls = [];

  // 1. Add static pages
  for (const page of STATIC_PAGES) {
    urls.push(buildUrlEntry(`${SITE_URL}${page.path}`, today, page.changefreq, page.priority));
  }

  // 2. Fetch dynamic data from Supabase
  let serviceSlugs = FALLBACK_SERVICES;
  let blogEntries = FALLBACK_BLOGS.map(slug => ({ slug, created_at: null }));

  try {
    const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
    const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY || process.env.SUPABASE_SERVICE_ROLE_KEY;

    if (supabaseUrl && supabaseKey) {
      const supabase = createClient(supabaseUrl, supabaseKey);

      // Fetch live services
      const { data: services } = await supabase
        .from('services')
        .select('slug, updated_at, created_at')
        .order('id', { ascending: true });

      if (services && services.length > 0) {
        serviceSlugs = services.map(s => {
          // Clean slug - remove leading /services/ or / if present
          let slug = (s.slug || '').replace(/^\/services\//, '').replace(/^\//, '');
          return { slug, date: s.updated_at || s.created_at };
        });
      } else {
        // Use fallbacks as objects
        serviceSlugs = FALLBACK_SERVICES.map(slug => ({ slug, date: null }));
      }

      // Fetch live published blogs
      const { data: blogs } = await supabase
        .from('blogs')
        .select('slug, created_at, updated_at, status')
        .order('created_at', { ascending: false });

      if (blogs && blogs.length > 0) {
        // Only include published/live blogs (exclude drafts if status field exists)
        blogEntries = blogs
          .filter(b => !b.status || b.status === 'published' || b.status === 'live')
          .map(b => ({ slug: b.slug, created_at: b.updated_at || b.created_at }));
      }
    }
  } catch (err) {
    console.error('Sitemap: Error fetching from Supabase, using fallbacks:', err.message);
  }

  // 3. Add service detail pages
  for (const service of serviceSlugs) {
    const slug = typeof service === 'string' ? service : service.slug;
    const date = typeof service === 'string' ? today : formatDate(service.date);
    if (slug) {
      urls.push(buildUrlEntry(`${SITE_URL}/services/${slug}`, date, 'weekly', '0.8'));
    }
  }

  // 4. Add blog detail pages
  for (const blog of blogEntries) {
    const slug = typeof blog === 'string' ? blog : blog.slug;
    const date = typeof blog === 'string' ? today : formatDate(blog.created_at);
    if (slug) {
      urls.push(buildUrlEntry(`${SITE_URL}/blog/${slug}`, date, 'monthly', '0.7'));
    }
  }

  // 5. Build sitemap XML
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${urls.join('\n')}
</urlset>`;

  // Set proper headers
  res.setHeader('Content-Type', 'application/xml');
  res.setHeader('Cache-Control', 'public, max-age=3600, s-maxage=3600, stale-while-revalidate=86400');
  res.status(200).send(sitemap);
}

// Purges the CDN copy of server-rendered URLs after an admin save.
// Called by the /admin managers (pages, services, posts, portfolio) with the affected paths.
// api/render.js tags every response with `page:<path>`, so we delete exactly those entries
// (plus the sitemap). Even without this call, CDN entries expire after 60 seconds.
import { dangerouslyDeleteByTag } from '@vercel/functions';

export default async function handler(req, res) {
  if (req.method !== 'POST') return res.status(405).json({ error: 'POST only' });
  let body = req.body;
  if (typeof body === 'string') {
    try {
      body = JSON.parse(body);
    } catch {
      body = {};
    }
  }
  const paths = (Array.isArray(body?.paths) ? body.paths : [])
    .map((p) => String(p || '').split('?')[0].replace(/\/$/, '') || '/')
    .filter((p) => p.startsWith('/') && !p.startsWith('/admin') && p.length < 300)
    .slice(0, 50);
  if (!paths.length) return res.status(400).json({ error: 'No paths' });

  const tags = [...new Set([...paths.map((p) => `page:${p}`), 'sitemap'])];
  try {
    await dangerouslyDeleteByTag(tags);
    return res.status(200).json({ purged: tags });
  } catch (e) {
    return res.status(200).json({ purged: [], note: 'CDN purge unavailable; pages refresh within 60s', error: String(e?.message || e) });
  }
}

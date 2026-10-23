import { useState } from 'react';
import { supabase } from '../../lib/supabase';
import { revalidatePaths } from '../../lib/revalidate';

const DEFAULT_URL = 'https://raw.githubusercontent.com/Tech-FNM/techfnm/main/content/cms-import.json';

/**
 * Admin-only bulk import. Loads a JSON file ({ blogs, services, projects }) and writes it with the
 * signed-in admin's Supabase session:
 *  - blogs:    inserted, or updated when a post with the same slug already exists
 *  - services: seo_settings.related_posts merged into the service with that slug
 *  - projects: slug / image / seo_settings merged into the project with that id
 */
export default function BulkImport() {
  const [open, setOpen] = useState(false);
  const [url, setUrl] = useState(DEFAULT_URL);
  const [busy, setBusy] = useState(false);
  const [log, setLog] = useState<string[]>([]);

  const run = async () => {
    setBusy(true);
    const out: string[] = [];
    const push = (m: string) => { out.push(m); setLog([...out]); };
    const paths: string[] = ['/', '/blog', '/portfolio', '/services'];
    try {
      const data = await (await fetch(url, { cache: 'no-store' })).json();

      for (const post of data.blogs || []) {
        const { data: existing } = await supabase.from('blogs').select('id').eq('slug', post.slug).maybeSingle();
        const row = { ...post, updated_at: new Date().toISOString() };
        const res = existing
          ? await supabase.from('blogs').update(row).eq('id', existing.id)
          : await supabase.from('blogs').insert([{ ...row, created_at: new Date().toISOString() }]);
        push(`${res.error ? '✗' : '✓'} post ${existing ? 'updated' : 'created'}: /blog/${post.slug}${res.error ? ` — ${res.error.message}` : ''}`);
        paths.push(`/blog/${post.slug}`);
      }

      for (const s of data.services || []) {
        const { data: row } = await supabase
          .from('services')
          .select('id, seo_settings')
          .or(`slug.eq.${s.slug},slug.eq./services/${s.slug},slug.eq./${s.slug}`)
          .maybeSingle();
        if (!row) { push(`✗ service not found: ${s.slug}`); continue; }
        const seo = { ...(row.seo_settings || {}), related_posts: s.related_posts };
        const res = await supabase.from('services').update({ seo_settings: seo, updated_at: new Date().toISOString() }).eq('id', row.id);
        push(`${res.error ? '✗' : '✓'} service related guides: /services/${s.slug}${res.error ? ` — ${res.error.message}` : ''}`);
        paths.push(`/services/${s.slug}`);
      }

      for (const p of data.projects || []) {
        const { data: row } = await supabase.from('projects').select('id, seo_settings').eq('id', p.id).maybeSingle();
        if (!row) { push(`✗ project not found: ${p.id}`); continue; }
        const patch: any = { seo_settings: { ...(row.seo_settings || {}), ...(p.seo_settings || {}) }, updated_at: new Date().toISOString() };
        if (p.slug) patch.slug = p.slug;
        if (p.image) patch.image = p.image;
        const res = await supabase.from('projects').update(patch).eq('id', p.id);
        push(`${res.error ? '✗' : '✓'} project: /portfolio/${p.slug || p.id}${res.error ? ` — ${res.error.message}` : ''}`);
        if (p.slug) paths.push(`/portfolio/${p.slug}`);
      }

      revalidatePaths(paths);
      push('Done. Server HTML for affected URLs purged.');
    } catch (e: any) {
      push(`✗ ${e?.message || e}`);
    } finally {
      setBusy(false);
    }
  };

  return (
    <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-4 text-xs text-zinc-300">
      <button type="button" onClick={() => setOpen(!open)} className="font-bold uppercase tracking-wider text-zinc-400 hover:text-white">
        {open ? '▾' : '▸'} Bulk import (JSON)
      </button>
      {open && (
        <div className="mt-3 space-y-3">
          <input
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full bg-[#141419] border border-zinc-800 rounded-xl px-3 py-2 font-mono"
          />
          <button
            type="button"
            disabled={busy}
            onClick={run}
            className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 disabled:opacity-50 text-white font-semibold"
          >
            {busy ? 'Importing…' : 'Run import'}
          </button>
          {log.length > 0 && <pre className="whitespace-pre-wrap bg-black/40 rounded-xl p-3 max-h-64 overflow-auto">{log.join('\n')}</pre>}
        </div>
      )}
    </div>
  );
}

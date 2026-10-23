import { useEffect, useState } from 'react';
import { supabase } from './supabase';
import { CANONICAL_SERVICES, getCached } from './canonicalData';

export interface NavService {
  id: number | string;
  title: string;
  slug: string;
}

const clean = (s: any) => String(s || '').replace(/^\/services\//, '').replace(/^\//, '');

const SEO_FALLBACK: NavService = { id: 7, title: 'SEO Services', slug: 'seo-services' };

function normalize(rows: any[]): NavService[] {
  const list = (rows || [])
    .filter((r) => r && r.title && r.status !== 'trash' && r.status !== 'draft')
    .map((r) => ({ id: r.id, title: r.title, slug: clean(r.slug) || String(r.id) }));
  if (!list.some((s) => s.slug === 'seo-services')) list.push(SEO_FALLBACK);
  return list;
}

/** Live list of services from the `services` table (used by the header dropdown and footer). */
export function useServices(): NavService[] {
  const [services, setServices] = useState<NavService[]>(() =>
    normalize(getCached<any[]>('techfnm_services_cache', CANONICAL_SERVICES))
  );

  useEffect(() => {
    let alive = true;
    supabase
      .from('services')
      .select('id,title,slug,status')
      .order('id', { ascending: true })
      .then(({ data }) => {
        if (alive && data && data.length) {
          setServices(normalize(data));
        }
      });
    return () => {
      alive = false;
    };
  }, []);

  return services;
}


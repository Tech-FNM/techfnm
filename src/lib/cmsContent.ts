import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { CANONICAL_PAGES_DATA, getCached, setCached } from './canonicalData';

export function getPageData(pageId: string): Record<string, any> {
  // Content the server already rendered into the HTML (api/render.js) wins over older caches
  const serverData = (typeof window !== 'undefined' && (window as any).__CMS_PAGES__?.[pageId]) || {};
  const canonical = { ...(CANONICAL_PAGES_DATA[pageId] || {}), ...serverData };
  const cachedPage = { ...getCached<Record<string, any>>(`techfnm_page_cache_${pageId}`, {}), ...serverData };

  try {
    const raw = localStorage.getItem('techfnm_site_pages_v2');
    if (raw) {
      const pages = JSON.parse(raw);
      const page = pages.find((p: any) => p.id === pageId);
      if (page && page.sectionsData && Object.keys(page.sectionsData).length > 0) {
        return {
          ...canonical,
          ...cachedPage,
          ...page.sectionsData,
          ...serverData
        };
      }
    }
  } catch (e) {
    // fallback
  }

  return {
    ...canonical,
    ...cachedPage
  };
}

const remoteCache: Record<string, Promise<Record<string, any>>> = {};

function loadRemote(pageId: string): Promise<Record<string, any>> {
  if (!remoteCache[pageId]) {
    remoteCache[pageId] = (async () => {
      const merged: Record<string, any> = {};
      try {
        const [{ data: pageRow }, { data: remoteData }] = await Promise.all([
          supabase.from('site_pages').select('sections_data').eq('id', pageId).maybeSingle(),
          supabase.from('pages_content').select('*'),
        ]);
        if (pageRow && pageRow.sections_data && Object.keys(pageRow.sections_data).length > 0) {
          Object.assign(merged, pageRow.sections_data);
          setCached(`techfnm_page_cache_${pageId}`, pageRow.sections_data);
        }
        (remoteData || []).forEach((item: any) => {
          if (item && item.content) Object.assign(merged, item.content);
        });
      } catch {
        delete remoteCache[pageId];
      }
      return merged;
    })();
  }
  return remoteCache[pageId];
}

export function usePageContent(pageId: string, defaultData: Record<string, any> = {}) {
  const [data, setData] = useState<Record<string, any>>(() => {
    const canonical = CANONICAL_PAGES_DATA[pageId] || {};
    const local = getPageData(pageId);
    return {
      ...defaultData,
      ...canonical,
      ...local
    };
  });

  useEffect(() => {
    // 1. Initial quick load from local cache
    const local = getPageData(pageId);
    if (local && Object.keys(local).length > 0) {
      setData(prev => ({ ...prev, ...local }));
    }

    // 2. Fetch from Supabase once per page id (all sections share the same request),
    //    instead of every section firing its own queries + realtime websocket.
    let alive = true;
    loadRemote(pageId).then((remote) => {
      if (alive && remote && Object.keys(remote).length > 0) {
        setData(prev => ({ ...prev, ...remote }));
      }
    });

    // 4. Local storage event listener (for intra-tab communication)
    const handleStorageUpdate = () => {
      const updated = getPageData(pageId);
      if (updated && Object.keys(updated).length > 0) {
        setData(prev => ({ ...prev, ...updated }));
      }
    };

    window.addEventListener('storage', handleStorageUpdate);
    window.addEventListener('techfnm_content_updated', handleStorageUpdate);

    return () => {
      alive = false;
      window.removeEventListener('storage', handleStorageUpdate);
      window.removeEventListener('techfnm_content_updated', handleStorageUpdate);
    };
  }, [pageId]);

  return data;
}

export function triggerContentUpdate() {
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new Event('techfnm_content_updated'));
  }
}

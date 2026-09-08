import { useState, useEffect } from 'react';
import { supabase } from './supabase';
import { CANONICAL_PAGES_DATA, getCached, setCached } from './canonicalData';

export function getPageData(pageId: string): Record<string, any> {
  const canonical = CANONICAL_PAGES_DATA[pageId] || {};
  const cachedPage = getCached<Record<string, any>>(`techfnm_page_cache_${pageId}`, {});

  try {
    const raw = localStorage.getItem('techfnm_site_pages_v2');
    if (raw) {
      const pages = JSON.parse(raw);
      const page = pages.find((p: any) => p.id === pageId);
      if (page && page.sectionsData && Object.keys(page.sectionsData).length > 0) {
        return {
          ...canonical,
          ...cachedPage,
          ...page.sectionsData
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

    // 2. Fetch directly from Supabase Database (both site_pages & pages_content)
    const fetchRemote = async () => {
      try {
        // A. Check site_pages for full page sections_data
        const { data: pageRow } = await supabase
          .from('site_pages')
          .select('sections_data')
          .eq('id', pageId)
          .maybeSingle();

        if (pageRow && pageRow.sections_data && Object.keys(pageRow.sections_data).length > 0) {
          setData(prev => ({ ...prev, ...pageRow.sections_data }));
          setCached(`techfnm_page_cache_${pageId}`, pageRow.sections_data);
        }

        // B. Check pages_content for individual section entries
        const { data: remoteData } = await supabase.from('pages_content').select('*');
        if (remoteData && remoteData.length > 0) {
          const remoteObj: Record<string, any> = {};
          remoteData.forEach((item: any) => {
            if (item.content) {
              Object.assign(remoteObj, item.content);
            }
          });
          if (Object.keys(remoteObj).length > 0) {
            setData(prev => ({ ...prev, ...remoteObj }));
          }
        }
      } catch (err) {
        // silent fallback
      }
    };

    fetchRemote();

    // 3. Setup Supabase Realtime WebSocket subscription for live database changes!
    const channel = supabase
      .channel(`realtime_${pageId}_${Date.now()}`)
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'pages_content' },
        (payload: any) => {
          if (payload.new && payload.new.content) {
            setData(prev => ({ ...prev, ...payload.new.content }));
          } else {
            fetchRemote();
          }
        }
      )
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'site_pages' },
        (payload: any) => {
          if (payload.new && payload.new.id === pageId && payload.new.sections_data) {
            setData(prev => ({ ...prev, ...payload.new.sections_data }));
            setCached(`techfnm_page_cache_${pageId}`, payload.new.sections_data);
          } else {
            fetchRemote();
          }
        }
      )
      .subscribe();

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
      supabase.removeChannel(channel);
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

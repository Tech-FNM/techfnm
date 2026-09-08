import { useState, useEffect } from 'react';
import { supabase } from './supabase';

export function getPageData(pageId: string): Record<string, any> {
  try {
    const raw = localStorage.getItem('techfnm_site_pages_v2');
    if (raw) {
      const pages = JSON.parse(raw);
      const page = pages.find((p: any) => p.id === pageId);
      if (page && page.sectionsData) {
        return page.sectionsData;
      }
    }
  } catch (e) {
    // fallback
  }
  return {};
}

export function usePageContent(pageId: string, defaultData: Record<string, any> = {}) {
  const [data, setData] = useState<Record<string, any>>(() => ({
    ...defaultData,
    ...getPageData(pageId)
  }));

  useEffect(() => {
    // 1. Initial load from localStorage
    const local = getPageData(pageId);
    if (local && Object.keys(local).length > 0) {
      setData(prev => ({ ...prev, ...local }));
    }

    // 2. Fetch from Supabase pages_content
    const fetchRemote = async () => {
      try {
        const { data: remoteData } = await supabase.from('pages_content').select('*');
        if (remoteData && remoteData.length > 0) {
          const remoteObj: Record<string, any> = {};
          remoteData.forEach((item: any) => {
            if (item.content) {
              Object.assign(remoteObj, item.content);
            }
          });
          setData(prev => ({ ...prev, ...remoteObj }));
        }
      } catch (err) {
        // silent fallback
      }
    };
    fetchRemote();

    // 3. Listen to local storage changes or custom event
    const handleStorageUpdate = () => {
      const updated = getPageData(pageId);
      if (updated && Object.keys(updated).length > 0) {
        setData(prev => ({ ...prev, ...updated }));
      }
    };

    window.addEventListener('storage', handleStorageUpdate);
    window.addEventListener('techfnm_content_updated', handleStorageUpdate);
    return () => {
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

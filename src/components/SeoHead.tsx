import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface SeoHeadProps {
  pageId?: string; // e.g. 'home', 'about'
  title?: string;
  description?: string;
}

export default function SeoHead({ pageId, title, description }: SeoHeadProps) {
  const [dbSeo, setDbSeo] = useState<{title?: string, description?: string}>({});
  const [indexingEnabled, setIndexingEnabled] = useState(true);

  useEffect(() => {
    if (pageId) {
      const fetchSeo = async () => {
        const { data } = await supabase.from('seo_settings').select('*').eq('id', pageId).maybeSingle();
        if (data) setDbSeo({ title: data.title, description: data.description });
      };
      fetchSeo();
    }
  }, [pageId]);

  useEffect(() => {
    const fetchIndexing = async () => {
      try {
        const { data } = await supabase.from('site_settings').select('*').eq('key', 'seo_indexing_enabled').maybeSingle();
        if (data) {
          setIndexingEnabled(data.value === 'true');
        }
      } catch (err) {
        console.error(err);
      }
    };
    fetchIndexing();
  }, []);

  const defaultTitle = "TechFNM | Digital Agency";
  const defaultDescription = "We specialize in custom web development, mobile apps, and SEO solutions. We develop digital future.";
  
  const finalTitle = title || dbSeo.title || defaultTitle;
  const finalDescription = description || dbSeo.description || defaultDescription;

  // Append site name if not present
  const currentTitle = finalTitle.includes('TechFNM') ? finalTitle : `${finalTitle} | TechFNM`;

  return (
    <Helmet>
      <title>{currentTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="robots" content={indexingEnabled ? "index, follow" : "noindex, nofollow"} />
      <meta property="og:title" content={currentTitle} />
      <meta property="og:description" content={finalDescription} />
      <meta name="twitter:title" content={currentTitle} />
      <meta name="twitter:description" content={finalDescription} />
    </Helmet>
  );
}

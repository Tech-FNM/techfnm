import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';

interface SeoHeadProps {
  pageId?: string; // e.g. 'home', 'about', 'services', 'portfolio', 'faq', 'contact'
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  seoSettings?: any;
}

export default function SeoHead({
  pageId,
  title,
  description,
  image,
  url,
  seoSettings: directSeo
}: SeoHeadProps) {
  const [dbSeo, setDbSeo] = useState<any>({});
  const [indexingEnabled, setIndexingEnabled] = useState<boolean>(() => {
    try {
      const local = localStorage.getItem('techfnm_site_settings');
      if (local) {
        const parsed = JSON.parse(local);
        if (typeof parsed.seoIndexingEnabled === 'boolean') {
          return parsed.seoIndexingEnabled;
        }
      }
    } catch {}
    return false; // Default strictly to noindex
  });

  useEffect(() => {
    if (pageId) {
      const fetchSeo = async () => {
        try {
          const fullPageId = pageId.startsWith('page-') ? pageId : `page-${pageId}`;
          const { data } = await supabase
            .from('site_pages')
            .select('title, seo_settings')
            .eq('id', fullPageId)
            .maybeSingle();

          if (data && data.seo_settings) {
            setDbSeo(data.seo_settings);
          }
        } catch (err) {
          // ignore
        }
      };
      fetchSeo();
    }
  }, [pageId]);

  useEffect(() => {
    const fetchIndexing = async () => {
      try {
        const { data } = await supabase
          .from('site_settings')
          .select('*')
          .eq('id', 'global_settings')
          .maybeSingle();

        if (data && data.content && typeof data.content.seo_indexing_enabled === 'boolean') {
          setIndexingEnabled(data.content.seo_indexing_enabled);
        }
      } catch (err) {
        // ignore
      }
    };
    fetchIndexing();

    const handleSettingsUpdate = (e: any) => {
      if (e.detail && typeof e.detail.seoIndexingEnabled === 'boolean') {
        setIndexingEnabled(e.detail.seoIndexingEnabled);
      }
    };
    window.addEventListener('techfnm_settings_updated', handleSettingsUpdate);
    return () => window.removeEventListener('techfnm_settings_updated', handleSettingsUpdate);
  }, []);

  // Guarantee that the raw HTML document head robots meta tag is synchronized
  useEffect(() => {
    const robotVal = indexingEnabled ? 'index, follow' : 'noindex, nofollow';
    let metaRobots = document.querySelector('meta[name="robots"]');
    if (metaRobots) {
      metaRobots.setAttribute('content', robotVal);
    } else {
      metaRobots = document.createElement('meta');
      metaRobots.setAttribute('name', 'robots');
      metaRobots.setAttribute('content', robotVal);
      document.head.appendChild(metaRobots);
    }
  }, [indexingEnabled]);

  const activeSeo = directSeo || dbSeo || {};

  const defaultTitle = 'TechFNM | Production Software, Modern Web & Digital Growth';
  const defaultDescription =
    'TechFNM builds modern web applications, scalable cloud software, and high-conversion digital assets.';
  const defaultImage =
    'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800';

  const finalTitle = activeSeo.seoTitle || title || defaultTitle;
  const finalDescription = activeSeo.metaDescription || description || defaultDescription;
  const finalImage = activeSeo.socialImage || image || defaultImage;
  const currentTitle = finalTitle.includes('TechFNM') ? finalTitle : `${finalTitle} | TechFNM`;

  const socialTitle = activeSeo.socialTitle || currentTitle;
  const socialDescription = activeSeo.socialDescription || finalDescription;
  const twitterTitle = activeSeo.twitterTitle || socialTitle;
  const twitterDescription = activeSeo.twitterDescription || socialDescription;

  // JSON-LD Structured Data (FAQ Schema generator)
  const faqs = activeSeo.schemaFaqs || [];
  const faqSchema =
    faqs.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faqs.map((f: any) => ({
            '@type': 'Question',
            name: f.question,
            acceptedAnswer: {
              '@type': 'Answer',
              text: f.answer
            }
          }))
        }
      : null;

  return (
    <Helmet>
      <title>{currentTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="robots" content={indexingEnabled ? 'index, follow' : 'noindex, nofollow'} />

      {/* OpenGraph */}
      <meta property="og:title" content={socialTitle} />
      <meta property="og:description" content={socialDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:type" content={activeSeo.schemaPageType || 'website'} />

      {/* Twitter Card */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={twitterTitle} />
      <meta name="twitter:description" content={twitterDescription} />
      <meta name="twitter:image" content={finalImage} />

      {/* FAQ Schema JSON-LD */}
      {faqSchema && (
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      )}
    </Helmet>
  );
}

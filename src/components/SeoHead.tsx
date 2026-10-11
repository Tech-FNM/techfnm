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
    return true; // Default to index enabled
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

  // Ensure there is strictly only ONE robots meta tag in the entire document head
  useEffect(() => {
    const robotVal = indexingEnabled ? 'index, follow' : 'noindex, nofollow';
    const allRobots = document.querySelectorAll('meta[name="robots"]');
    if (allRobots.length > 1) {
      allRobots.forEach((tag, idx) => {
        if (idx > 0) tag.remove();
        else tag.setAttribute('content', robotVal);
      });
    } else if (allRobots.length === 1) {
      allRobots[0].setAttribute('content', robotVal);
    }
  }, [indexingEnabled]);

  const activeSeo = directSeo || dbSeo || {};

  const defaultTitle = 'TechFNM | Production Software, Modern Web & Digital Growth';
  const defaultDescription =
    'TechFNM builds modern web applications, scalable cloud software, and high-conversion digital assets.';
  const defaultImage = 'https://techfnm.com/og-preview.png';

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

      {/* OpenGraph & Social Image Preview */}
      <meta property="og:title" content={socialTitle} />
      <meta property="og:description" content={socialDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:secure_url" content={finalImage} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content="1200" />
      <meta property="og:image:height" content="630" />
      <meta property="og:image:alt" content={socialTitle} />
      <meta property="og:url" content={url || (typeof window !== 'undefined' ? window.location.href : 'https://techfnm.com/')} />
      <meta property="og:type" content={activeSeo.schemaPageType || 'website'} />

      {/* Twitter Card & Image Preview */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={twitterTitle} />
      <meta name="twitter:description" content={twitterDescription} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:image:alt" content={twitterTitle} />

      {/* FAQ Schema JSON-LD */}
      {faqSchema && (
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      )}
    </Helmet>
  );
}

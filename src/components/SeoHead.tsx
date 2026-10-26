import { Helmet } from 'react-helmet-async';
import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { SITE_URL, SITE_NAME, DEFAULT_OG_IMAGE, pageDefaultsById } from '../lib/seoDefaults.js';

interface SeoHeadProps {
  pageId?: string; // e.g. 'home', 'about', 'services', 'portfolio', 'faq', 'contact'
  title?: string;
  description?: string;
  image?: string;
  url?: string;
  seoSettings?: any;
  type?: 'website' | 'article';
}

const absoluteUrl = (u?: string) => (!u ? '' : /^https?:\/\//.test(u) ? u : `${SITE_URL}${u.startsWith('/') ? '' : '/'}${u}`);

// Canonicals are always https://techfnm.com/<path> with no trailing slash, query or hash.
const normalizeCanonical = (u: string) => {
  try {
    const parsed = new URL(u, SITE_URL);
    const path = parsed.pathname.replace(/\/{2,}/g, '/').replace(/\/$/, '') || '/';
    return `${SITE_URL}${path}`;
  } catch {
    return `${SITE_URL}/`;
  }
};

// api/render.js already puts the page's FAQPage JSON-LD in the HTML; a second copy from Helmet
// makes Search Console report "Duplicate field FAQPage".
const serverHasFaqSchema = () =>
  typeof document !== 'undefined' &&
  Array.from(document.querySelectorAll('script[type="application/ld+json"]:not([data-rh])')).some((s) =>
    (s.textContent || '').includes('"FAQPage"')
  );

export default function SeoHead({
  pageId,
  title,
  description,
  image,
  url,
  seoSettings: directSeo,
  type
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
    const robotVal = indexingEnabled ? 'index, follow, max-image-preview:large, max-snippet:-1' : 'noindex, nofollow';
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

  // Per-item SEO (service/blog) must win over page-level SEO stored in site_pages.
  // Previously `directSeo || dbSeo` + `activeSeo.metaDescription || description` meant the
  // page-level description silently overrode every item's own description.
  const activeSeo = { ...(dbSeo || {}), ...(directSeo || {}) };

  // Same defaults the server renders (src/lib/seoDefaults.js), so hydration never swaps the
  // keyword-targeted server title for a generic one.
  const pageDefaults = pageDefaultsById(pageId || '') || pageDefaultsById('home')!;

  const finalTitle = directSeo?.seoTitle || title || dbSeo?.seoTitle || pageDefaults.title;
  const finalDescription = directSeo?.metaDescription || description || dbSeo?.metaDescription || pageDefaults.description;
  const finalImage = absoluteUrl(directSeo?.socialImage || image || dbSeo?.socialImage) || DEFAULT_OG_IMAGE;
  const currentTitle = /techfnm/i.test(finalTitle) ? finalTitle : `${finalTitle} | ${SITE_NAME}`;

  const socialTitle = activeSeo.socialTitle || currentTitle;
  const socialDescription = activeSeo.socialDescription || finalDescription;
  const twitterTitle = activeSeo.twitterTitle || socialTitle;
  const twitterDescription = activeSeo.twitterDescription || socialDescription;
  const imageAlt = activeSeo.imageAlt || socialTitle;
  const isDefaultImage = finalImage === DEFAULT_OG_IMAGE;

  // JSON-LD Structured Data (FAQ Schema generator)
  const faqs = (activeSeo.schemaFaqs || []).filter((f: any) => f && f.question && f.answer);
  const faqSchema =
    faqs.length > 0 && !serverHasFaqSchema()
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

  const canonicalUrl = normalizeCanonical(
    url || (typeof window !== 'undefined' ? window.location.pathname : pageDefaults.path)
  );

  return (
    <Helmet>
      <link rel="canonical" href={canonicalUrl} />
      <title>{currentTitle}</title>
      <meta name="description" content={finalDescription} />
      <meta name="robots" content={indexingEnabled ? 'index, follow, max-image-preview:large, max-snippet:-1' : 'noindex, nofollow'} />

      {/* OpenGraph & Social Image Preview */}
      <meta property="og:site_name" content={SITE_NAME} />
      <meta property="og:locale" content="en_US" />
      <meta property="og:title" content={socialTitle} />
      <meta property="og:description" content={socialDescription} />
      <meta property="og:image" content={finalImage} />
      <meta property="og:image:secure_url" content={finalImage} />
      {/* Dimensions/type are only known for the default share image */}
      {isDefaultImage && <meta property="og:image:type" content="image/png" />}
      {isDefaultImage && <meta property="og:image:width" content="1200" />}
      {isDefaultImage && <meta property="og:image:height" content="630" />}
      <meta property="og:image:alt" content={imageAlt} />
      <meta property="og:url" content={canonicalUrl} />
      <meta property="og:type" content={type || activeSeo.schemaPageType || 'website'} />

      {/* Twitter Card & Image Preview */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={twitterTitle} />
      <meta name="twitter:description" content={twitterDescription} />
      <meta name="twitter:image" content={finalImage} />
      <meta name="twitter:image:alt" content={imageAlt} />

      {/* FAQ Schema JSON-LD */}
      {faqSchema && (
        <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
      )}
    </Helmet>
  );
}

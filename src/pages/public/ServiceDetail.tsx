import React, { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'motion/react';
import {
  Code,
  Smartphone,
  Globe,
  PenTool,
  ShoppingCart,
  Share2,
  ArrowRight,
  ArrowLeft,
  Shield,
  Zap,
  Sparkles,
  CheckCircle2,
  Star,
  Check,
  MapPin,
  ChevronDown,
  ChevronUp,
  Send,
  Layers,
  Laptop,
  Users,
  TrendingUp,
  BarChart3,
  HelpCircle,
  Clock,
  ExternalLink,
  Target,
  Search,
  Award,
  Building,
  Briefcase
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SeoHead from '../../components/SeoHead';
import NotFound from './NotFound';
import { CANONICAL_SERVICES, getCached } from '../../lib/canonicalData';
import { useServices, isLiveService, serviceSlug } from '../../lib/useServices';

const iconMap: Record<string, any> = {
  Code,
  Smartphone,
  Globe,
  PenTool,
  ShoppingCart,
  Share2,
  TrendingUp,
  BarChart3,
  Search,
  Target,
  Briefcase
};

const featIconMap: Record<string, any> = {
  Code,
  Smartphone,
  Globe,
  PenTool,
  ShoppingCart,
  Share2,
  Shield,
  Zap,
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Layers,
  Laptop,
  Target,
  BarChart3,
  Users,
  Search,
  Award,
  Building
};

import {
  defaultHeroBullets,
  defaultCorePillars,
  defaultCapabilities,
  defaultBenefits,
  defaultProcessSteps,
  defaultCaseWins,
  defaultTargetIndustries,
  defaultTools,
  defaultServiceFaqs,
  defaultPricingPlans
} from '../../lib/serviceDefaults.js';

const clientLogos = [
  'Redtail Roofing',
  'Raise Up Youth',
  'Precision Gutters',
  'Corporate Hiring',
  'Cooper Land Co',
  'Burks Milling',
  'Adams Plumbing',
  'All-Stars Exterior'
];

const countriesServed = [
  'United States',
  'United Kingdom',
  'Canada',
  'Australia',
  'Germany',
  'United Arab Emirates',
  'Saudi Arabia',
  'Spain',
  'France',
  'Italy',
  'Belgium',
  'Singapore'
];

// Icon + one-liner for the "Connected Growth" cards, keyed by service slug. The cards themselves come
// from the live services list — the old hard-coded list linked to /services/seo and
// /services/ui-ux-design, which don't exist (404s on every service page).
const relatedServiceMeta: Record<string, { icon: any; desc: string }> = {
  'seo-services': { icon: Search, desc: 'Climb organic search rankings with data-driven on-page and technical SEO.' },
  'web-development': { icon: Code, desc: 'High-performance web applications engineered for speed and conversions.' },
  'app-development': { icon: Smartphone, desc: 'Fast, scalable mobile and web apps tailored to your business.' },
  'digital-marketing': { icon: Target, desc: 'Targeted campaigns optimized for a positive return on ad spend.' },
  'social-media': { icon: Share2, desc: 'Build loyal brand communities and creative digital engagement.' },
  'ecommerce': { icon: ShoppingCart, desc: 'High-conversion digital storefronts with secure payment integrations.' },
  'content-writing': { icon: PenTool, desc: 'SEO-friendly content that captures your brand voice and converts readers.' }
};

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const navServices = useServices();

  // Hero Lead Form State
  const [leadForm, setLeadForm] = useState({
    name: '',
    email: '',
    website: '',
    message: ''
  });
  const [submittingLead, setSubmittingLead] = useState(false);
  const [leadSubmitted, setLeadSubmitted] = useState(false);
  const [leadError, setLeadError] = useState('');

  // Active FAQ Accordion item
  const [openFaqIndex, setOpenFaqIndex] = useState<number | null>(0);
  const [relatedGuides, setRelatedGuides] = useState<Array<{ title: string; slug: string }>>([]);

  // Related blog guides chosen in the service's SEO settings (seo_settings.related_posts = [slug, ...])
  useEffect(() => {
    const slugs: string[] = service?.seo_settings?.related_posts || service?.related_posts || [];
    if (!Array.isArray(slugs) || !slugs.length) { setRelatedGuides([]); return; }
    supabase.from('blogs').select('title,slug,status').in('slug', slugs).then(({ data }) => {
      setRelatedGuides((data || []).filter((b: any) => !b.status || b.status === 'published'));
    });
  }, [service?.id, service?.seo_settings?.related_posts]);

  useEffect(() => {
    fetchServiceDetail();
    window.scrollTo(0, 0);

    // 1. Supabase Realtime WebSocket subscription for live database changes!
    const channel = supabase
      .channel(`public_services_realtime_${Date.now()}`)
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, () => {
        fetchServiceDetail(true);
      })
      .subscribe();

    // 2. Intra-tab / cross-tab live storage events for instant live updates!
    const handleLiveSync = () => {
      fetchServiceDetail(true);
    };

    window.addEventListener('storage', handleLiveSync);
    window.addEventListener('techfnm_content_updated', handleLiveSync);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('storage', handleLiveSync);
      window.removeEventListener('techfnm_content_updated', handleLiveSync);
    };
  }, [id]);

  const fetchServiceDetail = async (silent = false) => {
    try {
      if (!silent && !service) setLoading(true);
      const cleanParam = (id || '').trim();

      // Check cache first for 0ms instant display without flash
      const cached = getCached<any[]>('techfnm_services_cache', CANONICAL_SERVICES);
      const matchInCache = cached?.find((item: any) => {
        const sId = String(item.id);
        const sSlug = String(item.slug || '').replace(/^\/services\//, '').replace(/^\//, '');
        const cleanP = cleanParam.replace(/^\/services\//, '').replace(/^\//, '');
        return sId === cleanP || sSlug === cleanP || item.slug === cleanParam || item.slug === `/services/${cleanParam}`;
      });

      if (matchInCache) {
        setService(matchInCache);
        if (!silent) setLoading(false);
      }

      let serviceData: any = null;

      // 1. Try Supabase query by numeric id or slug
      if (!isNaN(Number(cleanParam))) {
        const { data: byId } = await supabase
          .from('services')
          .select('*')
          .eq('id', Number(cleanParam))
          .maybeSingle();
        if (byId) serviceData = byId;
      }

      // Only slug-safe characters go into the PostgREST filter: a comma or parenthesis in the URL
      // would otherwise break (or extend) the .or() expression.
      if (!serviceData && /^[a-z0-9_-]+$/i.test(cleanParam)) {
        const { data: bySlug } = await supabase
          .from('services')
          .select('*')
          .or(`slug.eq.${cleanParam},slug.eq./services/${cleanParam},slug.eq./${cleanParam}`)
          .limit(1);
        if (bySlug && bySlug[0]) serviceData = bySlug[0];
      }

      if (serviceData) {
        setService(serviceData);
      } else if (!matchInCache) {
        // 2. Check cached or canonical services
        const cached = getCached('techfnm_services_cache', CANONICAL_SERVICES);
        const match = cached?.find((item: any) => {
          const sId = String(item.id);
          const sSlug = String(item.slug || '').replace(/^\/services\//, '').replace(/^\//, '');
          const cleanP = cleanParam.replace(/^\/services\//, '').replace(/^\//, '');
          return sId === cleanP || sSlug === cleanP || item.slug === cleanParam || item.slug === `/services/${cleanParam}`;
        });

        if (match) {
          setService(match);
        } else {
          // 3. Fallback matching
          const fallbacks = [
            {
              id: '1',
              title: 'Digital Marketing',
              slug: 'digital-marketing',
              description: 'Drive targeted traffic and boost your brand visibility with our data-driven marketing strategies designed for high growth.',
              icon: 'Globe',
              color: 'bg-red-500/10 text-red-500'
            },
            {
              id: '2',
              title: 'Content Writing',
              slug: 'content-writing',
              description: 'We craft compelling, SEO-friendly stories that capture your brand voice and turn casual readers into loyal customers.',
              icon: 'PenTool',
              color: 'bg-red-500/10 text-red-500'
            },
            {
              id: '3',
              title: 'Ecommerce',
              slug: 'ecommerce',
              description: 'Launch a powerful online store with seamless navigation and secure payment gateways to maximize your global sales.',
              icon: 'ShoppingCart',
              color: 'bg-red-500/10 text-red-500'
            },
            {
              id: '4',
              title: 'Social Media',
              slug: 'social-media',
              description: 'Build a thriving community and increase engagement across platforms with creative campaigns that get people talking.',
              icon: 'Share2',
              color: 'bg-red-500/10 text-red-500'
            },
            {
              id: '5',
              title: 'Web Development',
              slug: 'web-development',
              description: 'Get a high-performance, responsive website built with the latest tech to ensure a smooth user experience on any device.',
              icon: 'Code',
              color: 'bg-red-500/10 text-red-500'
            },
            {
              id: '6',
              title: 'App Development',
              slug: 'app-development',
              description: 'Build fast, scalable mobile and web apps tailored to your business needs — delivering smooth performance across all platforms worldwide.',
              icon: 'Smartphone',
              color: 'bg-red-500/10 text-red-500'
            }
          ];
          const fMatch = fallbacks.find(item => String(item.id) === cleanParam || item.slug === cleanParam);
          if (fMatch) {
            setService(fMatch);
          }
        }
      }
    } catch (err) {
      console.error('Error fetching service detail:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLeadError('');
    if (!leadForm.name || !leadForm.email) {
      setLeadError('Please fill in your name and email.');
      return;
    }

    setSubmittingLead(true);
    const payload = {
      name: leadForm.name.trim(),
      email: leadForm.email.trim(),
      phone: '',
      business_name: service?.title || 'Service Page Inquiry',
      business_website: leadForm.website.trim() || null,
      business_type: 'Service Lead',
      service: service?.title || 'General Service',
      seo_issues: [],
      description: leadForm.message.trim() || `Inquiry for ${service?.title} via Hero Form`,
      how_found: 'Website Service Hero Form',
      preferred_contact: 'Email'
    };

    // Save the lead AND email it. The old code showed "received" even when the insert failed,
    // silently losing the lead; now success means at least one channel actually got it.
    const saved = await supabase
      .from('service_requests')
      .insert([payload])
      .then(({ error }) => {
        if (error) console.error('Lead insert failed:', error);
        return !error;
      }, () => false);
    const emailed = await fetch('/api/send-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    })
      .then(async (r) => r.ok && (await r.json().catch(() => ({}))).success === true)
      .catch(() => false);

    setSubmittingLead(false);
    if (saved || emailed) {
      setLeadSubmitted(true);
      setLeadForm({ name: '', email: '', website: '', message: '' });
    } else {
      setLeadError('Submission failed. Please try again, or email techhfnm@gmail.com.');
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-400" role="status" aria-label="Loading">
        <div className="w-8 h-8 border-2 border-red-500 border-t-transparent rounded-full animate-spin"></div>
      </div>
    );
  }

  // Unknown, drafted or trashed services get the real 404 page (noindex), matching the server's 404
  if (!service || !isLiveService(service)) {
    return <NotFound />;
  }

  const Icon = iconMap[service.icon] || Code;

  // Resolve extended fields with fallbacks
  const seoData = service.seo_settings || {};
  const heroBadge = service.hero_badge || seoData.hero_badge || 'High-Growth Solutions';
  const heroAccent = service.hero_accent || seoData.hero_accent || 'That Turn Searches Into Loyal Customers';
  // H1 = the hero headline (e.g. "Web Development Company in Pakistan"), same rule as api/render.js
  const heroHeadline: string = (() => {
    const explicit = service.hero_title || seoData.hero_title || seoData.h1;
    if (explicit) return String(explicit).trim();
    const mt = String(service.meta_title || seoData.seoTitle || '').split('|')[0].trim();
    if (mt && mt.toLowerCase() !== String(service.title).toLowerCase() && mt.split(' ').length >= 3) return mt;
    return '';
  })();
  const heroBullets: string[] = (service.hero_bullets && service.hero_bullets.length > 0)
    ? service.hero_bullets
    : (seoData.hero_bullets && seoData.hero_bullets.length > 0)
      ? seoData.hero_bullets
      : defaultHeroBullets;

  const corePillars = (service.core_pillars && service.core_pillars.length > 0)
    ? service.core_pillars
    : (seoData.core_pillars && seoData.core_pillars.length > 0)
      ? seoData.core_pillars
      : defaultCorePillars;

  const capabilities = (service.capabilities && service.capabilities.length > 0)
    ? service.capabilities
    : (service.features && service.features.length > 0)
      ? service.features
      : (seoData.capabilities || defaultCapabilities);

  const strategicBenefits = (service.benefits && service.benefits.length > 0)
    ? service.benefits
    : (seoData.benefits || defaultBenefits);

  const processSteps = (service.process_steps && service.process_steps.length > 0)
    ? service.process_steps
    : (seoData.process_steps || defaultProcessSteps);

  const caseWins = (service.case_wins && service.case_wins.length > 0)
    ? service.case_wins
    : (seoData.case_wins || defaultCaseWins);

  const targetIndustries = (service.target_industries && service.target_industries.length > 0)
    ? service.target_industries
    : (seoData.target_industries || defaultTargetIndustries);

  const toolsList: string[] = (service.tools_used && service.tools_used.length > 0)
    ? service.tools_used
    : (seoData.tools_used || defaultTools);

  const serviceFaqs = (service.faqs && service.faqs.length > 0)
    ? service.faqs
    : (seoData.faqs || defaultServiceFaqs);

  const pricingPlans = (service.pricing && service.pricing.length > 0)
    ? service.pricing
    : (seoData.pricing || defaultPricingPlans);

  const currentSlug = serviceSlug(service);
  const servicesCache = getCached<any[]>('techfnm_services_cache', CANONICAL_SERVICES);
  const otherServicesList = navServices
    .filter((s) => s.slug !== currentSlug && String(s.id) !== String(service.id))
    .slice(0, 6)
    .map((s) => {
      const meta = relatedServiceMeta[s.slug];
      const full = servicesCache.find((x: any) => serviceSlug(x) === s.slug);
      return {
        title: s.title,
        slug: s.slug,
        icon: meta?.icon || iconMap[full?.icon] || Globe,
        desc: meta?.desc || full?.description || ''
      };
    });

  return (
    <div className="min-h-screen bg-[#09090b] font-sans text-zinc-100 scroll-smooth overflow-x-hidden w-full flex flex-col justify-between selection:bg-red-500/30 selection:text-white">
      <SeoHead
        title={service.meta_title || seoData.seoTitle || `${service.title} Services | TechFNM`}
        description={service.meta_description || seoData.metaDescription || service.description}
        image={service.image}
        url={`/services/${currentSlug}`}
        seoSettings={seoData}
      />
      <Header />

      <main className="flex-grow pt-24">
        {/* 1. BREADCRUMBS BAR */}
        <div className="bg-zinc-950/60 backdrop-blur-md">
          <nav aria-label="Breadcrumb" className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 flex items-center gap-2 text-xs text-zinc-400">
            <Link to="/" className="hover:text-white transition-colors">Home</Link>
            <span className="text-zinc-600" aria-hidden="true">/</span>
            <Link to="/services" className="hover:text-white transition-colors">Services</Link>
            <span className="text-zinc-600" aria-hidden="true">/</span>
            <span className="text-red-400 font-medium truncate" aria-current="page">{service.title}</span>
          </nav>
        </div>

        {/* 2. HIGH-CONVERTING 2-COLUMN HERO SECTION */}
        <section className="relative overflow-hidden bg-gradient-to-b from-black via-zinc-950 to-[#0a0a0e] py-12 md:py-20">
          {/* Ambient background glows */}
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-red-600/10 rounded-full blur-3xl pointer-events-none -z-10" />
          <div className="absolute bottom-0 right-10 w-96 h-96 bg-rose-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* LEFT COLUMN: Copy, Highlights, Bullets, CTA */}
              <div className="lg:col-span-7 space-y-6">
                {/* Hero Badge */}
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-semibold uppercase tracking-wider">
                  <Sparkles size={13} className="text-red-400 animate-pulse" />
                  <span>{heroBadge}</span>
                </div>

                {/* H1 Heading with Colored Accent Span */}
                <h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-5xl font-extrabold tracking-tight text-white leading-tight">
                  {heroHeadline ? (
                    heroHeadline
                  ) : (
                    <>
                      {service.title}{' '}
                      <span className="text-red-500">
                        {heroAccent}
                      </span>
                    </>
                  )}
                </h1>

                {/* Main Value Proposition Copy */}
                <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-2xl">
                  {service.description}
                </p>

                {/* Key Deliverables Checkmark Bullets */}
                <div className="space-y-3 pt-2">
                  {heroBullets.map((bullet, idx) => (
                    <div key={idx} className="flex items-start gap-3 text-zinc-200 text-sm sm:text-base">
                      <div className="w-5 h-5 rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center shrink-0 mt-0.5 text-emerald-400">
                        <Check size={12} strokeWidth={3} />
                      </div>
                      <span className="font-medium leading-tight">{bullet}</span>
                    </div>
                  ))}
                </div>

                {/* Action Buttons */}
                <div className="pt-4 flex flex-wrap items-center gap-4">
                  <a
                    href="#consultation-card"
                    className="btn-primary inline-flex items-center justify-center gap-2 w-full sm:w-auto text-white px-7 py-3.5 rounded-full font-semibold text-sm"
                  >
                    <span>Get Free Consultation</span>
                    <ArrowRight size={16} />
                  </a>

                  <Link
                    to={`/request-service?service=${encodeURIComponent(service.title)}`}
                    className="btn-secondary inline-flex items-center justify-center gap-2 w-full sm:w-auto text-zinc-300 hover:text-white px-6 py-3.5 rounded-full font-semibold text-sm"
                  >
                    <span>Request Custom Scope</span>
                  </Link>
                </div>
              </div>

              {/* RIGHT COLUMN: Interactive Lead Consultation Form */}
              <div id="consultation-card" className="lg:col-span-5">
                <div className="relative rounded-3xl bg-gradient-to-b from-[#14141a] to-[#0c0c10] border border-zinc-800 p-6 sm:p-8 shadow-2xl shadow-red-950/10 backdrop-blur-xl">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-red-600/10 rounded-full blur-2xl pointer-events-none -z-10" />

                  <div className="space-y-2 mb-6">
                    <span className="text-[11px] font-bold text-red-400 uppercase tracking-wider block">
                      Direct Strategy Session
                    </span>
                    <h2 className="text-xl sm:text-2xl font-bold text-white">
                      Let’s Talk About Your Project
                    </h2>
                    <p className="text-xs text-zinc-400">
                      Fill out the form and our technical team will map your roadmap.
                    </p>
                  </div>

                  {leadSubmitted ? (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95 }}
                      animate={{ opacity: 1, scale: 1 }}
                      className="py-8 text-center space-y-4"
                    >
                      <div className="w-14 h-14 mx-auto rounded-full bg-emerald-500/10 border border-emerald-500/30 flex items-center justify-center text-emerald-400 shadow-lg shadow-emerald-950/20">
                        <CheckCircle2 size={28} />
                      </div>
                      <div className="space-y-1">
                        <h4 className="text-lg font-bold text-white">Consultation Request Received</h4>
                        <p className="text-xs text-zinc-400 max-w-xs mx-auto">
                          Thank you! An engineering lead from TechFNM will review your project details and reach out within 24 hours.
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => setLeadSubmitted(false)}
                        className="inline-flex items-center gap-1.5 text-xs text-red-400 hover:text-red-300 font-semibold pt-2"
                      >
                        <span>Send another message</span>
                        <ArrowRight size={12} />
                      </button>
                    </motion.div>
                  ) : (
                    <form onSubmit={handleLeadSubmit} className="space-y-4">
                      {leadError && (
                        <div className="p-3 rounded-xl bg-red-500/10 border border-red-500/20 text-red-400 text-xs">
                          {leadError}
                        </div>
                      )}

                      <div className="space-y-1">
                        <input
                          type="text"
                          required
                          value={leadForm.name}
                          onChange={e => setLeadForm({ ...leadForm, name: e.target.value })}
                          placeholder="Your Name *"
                          className="field"
                        />
                      </div>

                      <div className="space-y-1">
                        <input
                          type="email"
                          required
                          value={leadForm.email}
                          onChange={e => setLeadForm({ ...leadForm, email: e.target.value })}
                          placeholder="Business Email *"
                          className="field"
                        />
                      </div>

                      <div className="space-y-1">
                        <input
                          type="text"
                          value={leadForm.website}
                          onChange={e => setLeadForm({ ...leadForm, website: e.target.value })}
                          placeholder="Website or Project URL (Optional)"
                          className="field"
                        />
                      </div>

                      <div className="space-y-1">
                        <textarea
                          rows={3}
                          required
                          value={leadForm.message}
                          onChange={e => setLeadForm({ ...leadForm, message: e.target.value })}
                          placeholder="Tell us about your project goals, milestones, or current challenges... *"
                          className="field resize-none"
                        />
                      </div>

                      <button
                        type="submit"
                        disabled={submittingLead}
                        className="btn-primary w-full py-3.5 rounded-xl text-white font-semibold text-sm flex items-center justify-center gap-2"
                      >
                        {submittingLead ? (
                          <span>Submitting Request...</span>
                        ) : (
                          <>
                            <span>Get Free Consultation</span>
                            <Send size={13} />
                          </>
                        )}
                      </button>

                      <p className="text-xs text-zinc-500 text-center">
                        Zero spam. We respect your confidentiality and sign NDAs upon request.
                      </p>
                    </form>
                  )}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 3. CLIENT / PARTNER LOGO MARQUEE */}
        <section className="py-10 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <p className="text-xs uppercase tracking-widest text-zinc-500 font-semibold">
              Trusted by Ambitious Brands & Fast-Growing Enterprises
            </p>
            <div className="flex flex-wrap items-center justify-center gap-6 sm:gap-10 opacity-75">
              {clientLogos.map((client, idx) => (
                <div
                  key={idx}
                  className="px-4 py-2 rounded-xl bg-zinc-900/60 border border-zinc-800/80 text-zinc-400 font-semibold text-xs tracking-wider uppercase hover:text-zinc-200 hover:border-zinc-700 transition-all select-none"
                >
                  {client}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 4. THE 3 CORE PILLARS SECTION */}
        <section className="py-20 bg-black relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="eyebrow">
                Under the Hood
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
                What Really Happens Behind A High-Performing <span className="text-red-400">{service.title}</span> Asset
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                Algorithms and consumers reward relevance, distance, and prominence. We build three synchronized layers to turn rankings into measurable commercial return.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {corePillars.map((pillar: any, index: number) => {
                const FeatIcon = featIconMap[pillar.icon] || Sparkles;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="card-hover bg-[#111116] border border-zinc-800 rounded-3xl p-8 space-y-5 hover:border-red-500/40 group"
                  >
                    <div className="w-14 h-14 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-400 group-hover:scale-110 group-hover:bg-red-500/10 transition-all shadow-md">
                      <FeatIcon size={24} />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-red-300 transition-colors">
                      {pillar.title}
                    </h3>
                    <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                      {pillar.desc}
                    </p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 5. COMPREHENSIVE CAPABILITIES GRID (6 MODULES) */}
        <section className="py-20 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="eyebrow">
                Comprehensive Modules
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
                Every Part Of Your Project, Tuned To Pull In Qualified Leads
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                No two markets act identically; copy-paste templates never win. We calibrate every signal to ensure compounding lead generation.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {capabilities.map((cap: any, index: number) => {
                const CapIcon = featIconMap[cap.icon] || Code;
                return (
                  <div
                    key={index}
                    className="card-hover bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-6 sm:p-7 space-y-4 hover:border-zinc-700"
                  >
                    <div className="w-12 h-12 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-400">
                      <CapIcon size={20} />
                    </div>
                    <h3 className="text-base sm:text-lg font-bold text-white">{cap.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{cap.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 6. STRATEGIC BENEFITS / WHY THIS DECIDES WHO WINS (4 GRID) */}
        <section className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="eyebrow">
                Strategic Advantage
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
                Why Professional <span className="text-red-400">{service.title}</span> Quietly Decides Who Wins
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                Most clicks and conversions go to the top three verified providers. We ensure your brand sits front and center when customers make buying decisions.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {strategicBenefits.map((benefit: any, index: number) => {
                const BenIcon = featIconMap[benefit.icon] || TrendingUp;
                return (
                  <div
                    key={index}
                    className="card-hover bg-gradient-to-b from-[#141419] to-[#0c0c10] border border-zinc-800 rounded-3xl p-6 space-y-4 hover:border-red-500/30"
                  >
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-400">
                      <BenIcon size={20} />
                    </div>
                    <h3 className="text-base font-bold text-white">{benefit.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{benefit.desc}</p>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {/* 7. STEP-BY-STEP WORKING SYSTEM ROADMAP (01 - 06) */}
        <section className="py-20 bg-[#0a0a0f]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="eyebrow">
                Proven Framework
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
                The Step-By-Step System We Use To Deliver Predictable Results
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                Growth is never guesswork. Every account follows our disciplined 6-stage execution roadmap to climb positions reliably.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {processSteps.map((step: any, index: number) => (
                <div
                  key={index}
                  className="card-hover bg-[#111116] border border-zinc-800/90 rounded-2xl p-7 space-y-3 relative hover:border-red-500/30"
                >
                  <span className="text-3xl sm:text-4xl font-black text-red-500/20 font-mono block">
                    {step.step || `0${index + 1}`}
                  </span>
                  <h3 className="text-base sm:text-lg font-bold text-white">{step.title}</h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 8. REAL CLIENT WINS & METRICS SECTION */}
        <section className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="eyebrow">
                Measurable Impact
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
                Real Local & Global Wins We Have Delivered
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                Real metrics beat hollow promises. These brief case snapshots demonstrate how dedicated execution drives qualified leads and revenue.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {caseWins.map((win: any, index: number) => (
                <div
                  key={index}
                  className="card-hover bg-gradient-to-b from-[#13131a] to-[#0a0a0d] border border-zinc-800 rounded-3xl p-6 sm:p-7 space-y-4 hover:border-red-500/30 flex flex-col justify-between"
                >
                  <div className="space-y-2">
                    <span className="text-3xl sm:text-4xl font-black text-red-400 font-mono tracking-tight block">
                      {win.stat}
                    </span>
                    <h3 className="text-base font-bold text-white">{win.title}</h3>
                    <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full bg-zinc-800 text-[10px] font-semibold text-zinc-300">
                      <Clock size={11} className="text-red-400" />
                      <span>{win.timeframe}</span>
                    </div>
                  </div>
                  <p className="text-zinc-400 text-sm leading-relaxed pt-2 border-t border-zinc-800/80">
                    {win.story}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 9. TARGET INDUSTRIES WE SERVE */}
        <section className="py-20 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="eyebrow">
                Vertical Expertise
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
                Industries Where Strong Digital Execution Changes The Game
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                Different verticals search and decide differently. We tailor conversion signals based on exact customer behavioral dynamics.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {targetIndustries.map((ind: any, index: number) => (
                <div
                  key={index}
                  className="card-hover bg-[#111116] border border-zinc-800 rounded-2xl overflow-hidden group hover:border-zinc-700 flex flex-col"
                >
                  <div className="h-44 w-full overflow-hidden relative bg-zinc-900">
                    <img width={800} height={500}
                      src={ind.image}
                      alt={ind.title}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-[#111116] via-transparent to-transparent" />
                  </div>
                  <div className="p-5 space-y-2 flex-grow flex flex-col justify-between">
                    <div className="space-y-1.5">
                      <h3 className="text-base font-bold text-white group-hover:text-red-300 transition-colors">
                        {ind.title}
                      </h3>
                      <p className="text-zinc-400 text-sm leading-relaxed">
                        {ind.desc}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 10. TOOLS & TECH STACK USED */}
        <section className="py-16 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8 text-center">
            <div className="space-y-2">
              <span className="eyebrow">
                Telemetry & Technology
              </span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">
                The Data And Tools Behind Every Decision We Make
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
                Smart execution comes from real telemetry, not guesswork. We leverage industry-leading platforms to analyze and optimize continuously.
              </p>
            </div>

            <div className="flex flex-wrap items-center justify-center gap-3 pt-2">
              {toolsList.map((tool, idx) => (
                <span
                  key={idx}
                  className="px-4 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-300 hover:text-white hover:border-red-500/40 transition-all select-none"
                >
                  {tool}
                </span>
              ))}
            </div>
          </div>
        </section>

        {/* 11. AGENCY ADVANTAGE: WHY CHOOSE TECHFNM */}
        <section className="py-20 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="eyebrow">
                Agency Advantage
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
                Why Growing Businesses Trust TechFNM
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                Zero outsourcing, battle-tested modern architectures, and dedicated founder involvement on every single campaign.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="bg-[#111116] border border-zinc-800 rounded-3xl p-8 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                  <BarChart3 size={22} />
                </div>
                <h3 className="text-lg font-bold text-white">AI & Data-Driven Strategy</h3>
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                  We replace guesswork with verified search signals, machine-learning analytics, and conversion telemetry to pinpoint market opportunities and maximize clicks.
                </p>
              </div>

              <div className="bg-[#111116] border border-zinc-800 rounded-3xl p-8 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                  <Zap size={22} />
                </div>
                <h3 className="text-lg font-bold text-white">A Proven Execution Framework</h3>
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                  Our repeatable process stacks technical corrections, targeted copy, and authority in the exact sequence algorithms reward for sustainable growth.
                </p>
              </div>

              <div className="bg-[#111116] border border-zinc-800 rounded-3xl p-8 space-y-4">
                <div className="w-12 h-12 rounded-xl bg-red-500/10 border border-red-500/20 flex items-center justify-center text-red-400">
                  <Shield size={22} />
                </div>
                <h3 className="text-lg font-bold text-white">Clear, Honest Telemetry</h3>
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                  You always know where you stand. Our dashboards track qualified leads, search visibility, and revenue impact in simple, plain-English milestones.
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* 12. TRANSPARENT PRICING PLANS */}
        <section className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-14">
            <div className="text-center max-w-3xl mx-auto space-y-3">
              <span className="eyebrow">
                Transparent Packages
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
                Simple, High-Value Service Plans
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                Choose the level of execution that fits your market competition and revenue objectives.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 items-stretch">
              {pricingPlans.map((plan: any, index: number) => (
                <div
                  key={index}
                  className={`card-hover relative rounded-3xl p-8 border flex flex-col justify-between ${
                    plan.popular
                      ? 'bg-gradient-to-b from-[#1a1416] to-[#120f12] border-red-500/50 shadow-2xl shadow-red-950/20 scale-[1.02] z-10'
                      : 'bg-[#111116] border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  {plan.popular && (
                    <span className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-red-600 text-white text-[11px] uppercase font-bold tracking-widest px-3.5 py-1 rounded-full shadow-md shadow-red-950/30">
                      Most Popular
                    </span>
                  )}

                  <div className="space-y-6">
                    <div className="space-y-2">
                      <h3 className="text-base font-bold text-zinc-300 uppercase tracking-wider">{plan.name}</h3>
                      <div className="flex items-baseline gap-1">
                        <span className="text-3xl sm:text-4xl font-extrabold text-white">{plan.price}</span>
                        {plan.price !== 'Custom Quote' && (
                          <span className="text-xs text-zinc-500">/{plan.period === 'month' ? 'mo' : 'project'}</span>
                        )}
                      </div>
                    </div>

                    <div className="w-full h-[1px] bg-zinc-800" />

                    <ul className="space-y-3">
                      {(Array.isArray(plan.features) ? plan.features : []).map((feature: string, idx: number) => (
                        <li key={idx} className="flex items-start gap-2.5 text-zinc-300 text-sm">
                          <CheckCircle2 size={15} className="text-red-400 shrink-0 mt-0.5" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
                  </div>

                  <div className="pt-8">
                    <Link
                      to={`/request-service?service=${encodeURIComponent(service.title)}&plan=${encodeURIComponent(plan.name)}`}
                      className={`w-full flex items-center justify-center gap-2 py-3.5 rounded-full text-sm font-semibold ${
                        plan.popular
                          ? 'btn-primary'
                          : 'btn-secondary'
                      }`}
                    >
                      <span>Select {plan.name}</span>
                      <ArrowRight size={15} />
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* 13. SUPPORTING & RELATED SERVICES */}
        <section className="py-20 bg-zinc-950">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center max-w-2xl mx-auto space-y-3">
              <span className="eyebrow">
                Connected Growth
              </span>
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white">
                Services That Make Your Strategy Work Even Harder
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                Connect your brand across search, social, and modern engineering to build one unified client ingestion engine.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {otherServicesList.map((other, idx) => {
                const OtherIcon = other.icon;
                return (
                  <Link
                    key={idx}
                    to={`/services/${other.slug}`}
                    className="card-hover bg-[#111116] border border-zinc-800/80 rounded-2xl p-6 space-y-3 hover:border-red-500/40 group block"
                  >
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-400 group-hover:scale-110 transition-transform">
                      <OtherIcon size={18} />
                    </div>
                    <h3 className="text-base font-bold text-white group-hover:text-red-300 transition-colors flex items-center justify-between">
                      <span>{other.title}</span>
                      <ArrowRight size={14} className="opacity-0 group-hover:opacity-100 transition-opacity text-red-400" />
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{other.desc}</p>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>

        {/* 14. GLOBAL REACH & MARKETS SERVED */}
        <section className="py-20 bg-black">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
              <div className="lg:col-span-6 space-y-6">
                <span className="eyebrow">
                  {(service as any).worldwide_badge || (service.seo_settings as any)?.worldwide_badge || 'Worldwide Operations'}
                </span>
                <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
                  {(service as any).worldwide_title || (service.seo_settings as any)?.worldwide_title || 'Helping Businesses Get Found In Markets Around The World'}
                </h2>
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                  {(service as any).worldwide_desc || (service.seo_settings as any)?.worldwide_desc || 'Wherever you operate, our technical marketing and software solutions reach qualified local and international audiences. We adapt strategies to meet regional competition, search intent, and buyer habits.'}
                </p>

                <div className="space-y-3 pt-2">
                  <h4 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                    Countries & Regions We Actively Serve:
                  </h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                    {((Array.isArray((service as any).countries_served) && (service as any).countries_served.length > 0)
                      ? (service as any).countries_served
                      : typeof (service as any).countries_served === 'string' && (service as any).countries_served.trim().length > 0
                        ? (service as any).countries_served.split(',').map((s: string) => s.trim()).filter(Boolean)
                        : (Array.isArray((service.seo_settings as any)?.countries_served) && (service.seo_settings as any).countries_served.length > 0)
                          ? (service.seo_settings as any).countries_served
                          : typeof (service.seo_settings as any)?.countries_served === 'string' && (service.seo_settings as any).countries_served.trim().length > 0
                            ? (service.seo_settings as any).countries_served.split(',').map((s: string) => s.trim()).filter(Boolean)
                            : countriesServed
                    ).map((country: string, idx: number) => (
                      <div key={idx} className="flex items-center gap-2 text-xs text-zinc-300">
                        <MapPin size={12} className="text-red-500 shrink-0" />
                        <span>{country}</span>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="pt-2">
                  <Link
                    to="/contact"
                    className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-200 hover:text-white hover:border-zinc-700 transition-all"
                  >
                    <span>Contact Global Desk</span>
                    <ArrowRight size={13} />
                  </Link>
                </div>
              </div>

              {/* Map Preview Graphic in REAL Natural Color */}
              <div className="lg:col-span-6">
                <div className="relative rounded-3xl overflow-hidden border border-zinc-800 bg-[#111116] p-4 shadow-xl">
                  <div className="aspect-video w-full rounded-2xl overflow-hidden bg-zinc-900 relative">
                    <iframe
                      title="Worldwide Coverage"
                      src={`https://maps.google.com/maps?q=${encodeURIComponent((service as any).map_query || (service.seo_settings as any)?.map_query || 'United States')}&t=m&z=3&output=embed&iwloc=near`}
                      className="w-full h-full border-0 rounded-2xl"
                      loading="lazy"
                    />
                    <div className="absolute bottom-4 left-4 right-4 p-3.5 rounded-xl bg-zinc-950/90 border border-zinc-800/90 backdrop-blur-md flex items-center justify-between text-xs text-zinc-300">
                      <span className="font-semibold flex items-center gap-1.5">
                        <Globe size={14} className="text-red-400" />
                        {(service as any).map_status_text || (service.seo_settings as any)?.map_status_text || 'Global Deployment Ready'}
                      </span>
                      <span className="text-[11px] text-zinc-400 font-mono">24/7 Client Coverage</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* 15. FREQUENTLY ASKED QUESTIONS (ACCORDION) */}
        <section className="py-20 bg-zinc-950">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-12">
            <div className="text-center space-y-3">
              <span className="eyebrow">
                Clear Answers
              </span>
              <h2 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white">
                Frequently Asked Questions
              </h2>
              <p className="text-zinc-400 text-sm sm:text-base">
                Got questions before initiating your project? Find immediate details below.
              </p>
            </div>

            <div className="space-y-3">
              {serviceFaqs.map((faq: any, idx: number) => {
                const isOpen = openFaqIndex === idx;
                return (
                  <div
                    key={idx}
                    className="border border-zinc-850 rounded-2xl bg-[#111116] overflow-hidden transition-colors"
                  >
                    <button
                      type="button"
                      aria-expanded={isOpen}
                      onClick={() => setOpenFaqIndex(isOpen ? null : idx)}
                      className="w-full px-6 py-4.5 text-left flex items-center justify-between gap-4 cursor-pointer"
                    >
                      <span className="text-sm sm:text-base font-bold text-white">
                        {idx + 1}. {faq.q || faq.question}
                      </span>
                      <div className="w-8 h-8 rounded-full bg-zinc-900 border border-zinc-800 flex items-center justify-center shrink-0 text-zinc-400">
                        {isOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                      </div>
                    </button>

                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="px-6 pb-5 pt-1 text-sm sm:text-base text-zinc-400 leading-relaxed border-t border-zinc-850/60"
                        >
                          {faq.a || faq.answer}
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          </div>
        </section>

        {relatedGuides.length > 0 && (
          <section className="py-14 border-t border-zinc-900">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <h2 className="text-2xl sm:text-3xl font-extrabold text-white mb-6">Related Guides</h2>
              <ul className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {relatedGuides.map((g) => (
                  <li key={g.slug}>
                    <Link to={`/blog/${g.slug}`} className="block p-4 rounded-xl bg-zinc-950 border border-zinc-800 hover:border-red-500/40 text-zinc-200 hover:text-white transition-colors">
                      {g.title}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          </section>
        )}

        {/* 16. CLOSING CALL TO ACTION BANNER */}
        <section className="py-24 bg-gradient-to-b from-black to-[#0d0a0e] text-center px-4 sm:px-6 lg:px-8 relative overflow-hidden">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[300px] bg-red-600/10 rounded-full blur-3xl pointer-events-none -z-10" />

          <div className="max-w-3xl mx-auto space-y-6">
            <span className="eyebrow">
              Start Project
            </span>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight">
              Ready To Build Something Better?
            </h2>

            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed max-w-xl mx-auto">
              Whether you need strategic search optimization, custom web development, or a full digital transformation, TechFNM helps your brand capture customers and scale online.
            </p>

            <div className="pt-4 flex flex-wrap items-center justify-center gap-4">
              <a
                href="#consultation-card"
                className="btn-primary inline-flex items-center gap-2 text-white px-8 py-3.5 rounded-full font-semibold text-sm"
              >
                <span>Start Free Consultation</span>
                <ArrowRight size={16} />
              </a>

              <Link
                to="/contact"
                className="btn-secondary inline-flex items-center gap-2 text-zinc-300 hover:text-white px-7 py-3.5 rounded-full font-semibold text-sm"
              >
                <span>Speak With An Architect</span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

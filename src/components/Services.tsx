import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Code,
  Smartphone,
  Globe,
  PenTool,
  ShoppingCart,
  Share2,
  ArrowUpRight,
  TrendingUp,
  Search,
  Sparkles
} from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';
import { usePageContent } from '../lib/cmsContent';
import { CANONICAL_SERVICES, getCached, setCached } from '../lib/canonicalData';

const iconMap: any = {
  Code,
  Smartphone,
  Globe,
  PenTool,
  ShoppingCart,
  Share2,
  TrendingUp,
  Search,
  Sparkles
};

export default function Services() {
  const [services, setServices] = useState<any[]>(() => getCached('techfnm_services_cache', CANONICAL_SERVICES));
  const pageContent = usePageContent('page-home', {
    services_badge: 'Our Services',
    services_heading: 'Digital services designed for your growth',
    services_desc: 'We design and deliver digital solutions that align with your business helping you reach the right audience, scale effectively.',
    services_btn_text: 'View All Services',
    services_btn_link: '/services'
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase.from('services').select('*').order('id', { ascending: true });
        if (data && data.length > 0) {
          setServices(data);
          setCached('techfnm_services_cache', data);
        } else if (services.length === 0) {
          setServices(CANONICAL_SERVICES);
        }
      } catch (err) {
        console.error('Error in fetchServices:', err);
      }
    };
    fetchServices();

    const channel = supabase
      .channel('public:services')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'services' }, () => {
        fetchServices();
      })
      .subscribe();

    const handleLiveSync = () => {
      const cached = getCached('techfnm_services_cache', CANONICAL_SERVICES);
      if (cached && cached.length > 0) {
        setServices(cached);
      } else {
        fetchServices();
      }
    };

    window.addEventListener('storage', handleLiveSync);
    window.addEventListener('techfnm_content_updated', handleLiveSync);

    return () => {
      supabase.removeChannel(channel);
      window.removeEventListener('storage', handleLiveSync);
      window.removeEventListener('techfnm_content_updated', handleLiveSync);
    };
  }, []);

  return (
    <section id="services" className="py-24 sm:py-32 bg-black relative overflow-hidden">
      {/* Glow */}
      <div className="absolute top-1/3 right-0 w-[500px] h-[500px] bg-[#e5432e]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header with Two Column Flex */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-16 sm:mb-20">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#1B1B1B] border border-white/10 rounded-full px-4 py-1.5 mb-5 w-fit">
              <span className="w-2 h-2 rounded-full bg-[#e5432e]" />
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-zinc-300 uppercase">
                {pageContent.services_badge || 'Our Services'}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
              {pageContent.services_heading || 'Digital services designed for your growth'}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
              {pageContent.services_desc ||
                'We design and deliver digital solutions that align with your business helping you reach the right audience, scale effectively.'}
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link
              to={pageContent.services_btn_link || '/services'}
              className="group inline-flex items-center gap-3 bg-[#1B1B1B] hover:bg-[#222225] border border-white/15 hover:border-[#e5432e]/40 text-white px-6 py-3.5 rounded-full text-sm font-semibold transition-all duration-300"
            >
              <span>{pageContent.services_btn_text || 'View All Services'}</span>
              <span className="w-7 h-7 rounded-full bg-white/10 text-white group-hover:bg-[#e5432e] group-hover:text-white flex items-center justify-center transition-all duration-300">
                <ArrowUpRight size={15} />
              </span>
            </Link>
          </div>
        </div>

        {/* Services Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {services.slice(0, 6).map((service, index) => {
            const Icon = iconMap[service.icon] || Code;
            const rawSlug = service.slug || service.seo_settings?.slug;
            const cleanSlug =
              rawSlug && isNaN(Number(rawSlug))
                ? String(rawSlug).replace(/^\/services\//, '').replace(/^\//, '')
                : service.title
                ? service.title.toLowerCase().trim().replace(/\s+/g, '-').replace(/[^a-z0-9-_]/g, '')
                : String(service.id);
            const serviceLink = `/services/${cleanSlug}`;

            return (
              <motion.div
                key={service.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group relative bg-[#121214] rounded-3xl p-7 sm:p-8 border border-white/10 hover:border-[#e5432e]/40 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-[#e5432e]/5"
              >
                <div>
                  {/* Top Bar with Icon and Arrow Button */}
                  <div className="flex items-center justify-between mb-8">
                    <div className="w-14 h-14 rounded-2xl bg-[#1B1B1B] border border-white/10 flex items-center justify-center text-[#e5432e] group-hover:bg-[#e5432e] group-hover:text-white transition-all duration-300">
                      <Icon size={26} />
                    </div>

                    <Link
                      to={serviceLink}
                      className="w-10 h-10 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:bg-[#e5432e] group-hover:text-white group-hover:border-[#e5432e] transition-all duration-300"
                      aria-label={`View ${service.title}`}
                    >
                      <ArrowUpRight size={18} />
                    </Link>
                  </div>

                  {/* Title */}
                  <Link to={serviceLink} className="block group-hover:text-[#e5432e] transition-colors">
                    <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight">
                      {service.title}
                    </h3>
                  </Link>

                  {/* Description */}
                  <p className="text-zinc-400 text-sm sm:text-base leading-relaxed mb-6 font-normal">
                    {service.description}
                  </p>
                </div>

                {/* Bottom details link */}
                <div className="pt-4 border-t border-white/5 flex items-center justify-between">
                  <Link
                    to={serviceLink}
                    className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-zinc-300 group-hover:text-[#e5432e] transition-colors"
                  >
                    <span>View Details</span>
                    <ArrowUpRight size={14} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>

                  <span className="text-xs font-mono text-zinc-600">
                    0{index + 1}
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

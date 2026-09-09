import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Code, Smartphone, Globe, PenTool, ShoppingCart, Share2, ArrowRight } from 'lucide-react';
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
};

export default function Services() {
  const [services, setServices] = useState<any[]>(() => getCached('techfnm_services_cache', CANONICAL_SERVICES));
  const pageContent = usePageContent('page-home', {
    services_badge: 'What We Do',
    services_heading: 'Our Services',
    services_desc: 'We provide comprehensive digital solutions to help your business thrive in the modern world.'
  });

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase.from('services').select('*').order('id', { ascending: true });
        
        if (error) {
          console.error('Supabase error fetching services:', error);
        }

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

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section id="services" className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-red-500 font-semibold tracking-wider uppercase text-sm">
            {pageContent.services_badge || 'What We Do'}
          </span>
          <h2 className="mt-2 text-4xl font-bold text-white sm:text-5xl">
            {pageContent.services_heading || 'Our Services'}
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-400 mx-auto">
            {pageContent.services_desc || 'We provide comprehensive digital solutions to help your business thrive in the modern world.'}
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const Icon = iconMap[service.icon] || Code;
            const hasImage = service.image && service.image.length > 0;
            
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-zinc-900 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-zinc-800 group hover:border-red-500/30 overflow-hidden relative flex flex-col justify-between"
              >
                <div>
                  <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${service.color || 'bg-red-500/10 text-red-500'} group-hover:scale-110 transition-transform`}>
                    <Icon size={28} />
                  </div>
                  <Link to={`/services/${service.id}`} className="block">
                    <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-500 transition-colors">{service.title}</h3>
                  </Link>
                  <p className="text-gray-400 leading-relaxed text-sm">
                    {service.description}
                  </p>
                </div>
                <div className="pt-6">
                  <Link
                    to={`/services/${service.id}`}
                    className="inline-flex items-center gap-1.5 text-xs font-bold text-red-500 hover:text-red-400 transition-colors group/link"
                  >
                    <span>View Service Page</span>
                    <ArrowRight size={13} className="transform group-hover/link:translate-x-1 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

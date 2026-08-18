import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SeoHead from '../../components/SeoHead';
import { supabase } from '../../lib/supabase';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      const { data } = await supabase.from('services').select('*').order('created_at', { ascending: false });
      if (data) setServices(data);
    };
    fetchServices();
  }, []);

  return (
    <div className="min-h-screen bg-black font-sans text-white flex flex-col w-full">
      <SeoHead pageId="services" title="Our Services" />
      <Header />
      <main className="flex-grow pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-red-500 font-semibold tracking-wider uppercase text-sm">What We Do</span>
            <h1 className="mt-2 text-4xl md:text-5xl font-bold text-white">Our Services</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Code;
              return (
                <Link to={`/services/${service.slug || service.id}`} key={service.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="p-8 rounded-2xl bg-zinc-900 border border-zinc-800 hover:border-red-500/50 transition-all duration-300 h-full group"
                  >
                    <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 bg-red-600/10 text-red-500 group-hover:scale-110 transition-transform`}>
                      <IconComponent size={28} />
                    </div>
                    <h3 className="text-2xl font-bold text-white mb-4">{service.title}</h3>
                    <p className="text-gray-400 leading-relaxed mb-6">
                      {service.description}
                    </p>
                    <span className="text-red-500 font-medium flex items-center gap-2 group-hover:gap-3 transition-all">
                      Read More &rarr;
                    </span>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

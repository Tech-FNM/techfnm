import { useEffect, useState } from 'react';
import { Code, Smartphone, Globe, PenTool, ShoppingCart, Share2 } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';

const iconMap: any = {
  Code,
  Smartphone,
  Globe,
  PenTool,
  ShoppingCart,
  Share2,
};

export default function Services() {
  const [services, setServices] = useState<any[]>([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const { data, error } = await supabase.from('services').select('*');
        
        if (error) {
          console.error('Supabase error fetching services:', error);
          // Don't throw, just let it fall through to fallback
        }

        if (data && data.length > 0) {
          setServices(data);
        } else {
          console.log('No services found or error occurred, using fallback data.');
          setServices([
            {
              id: 1,
              title: 'Web Development',
              description: 'Get a high-performance, responsive website built with the latest tech to ensure a smooth user experience on any device.',
              icon: 'Code',
              color: 'bg-blue-500/10 text-white',
            },
            {
              id: 2,
              title: 'Content Writing',
              description: 'We craft compelling, SEO-friendly stories that capture your brand’s voice and turn casual readers into loyal customers.',
              icon: 'PenTool',
              color: 'bg-purple-500/10 text-white',
            },
            {
              id: 3,
              title: 'Digital Marketing',
              description: 'Drive targeted traffic and boost your brand visibility with our data-driven marketing strategies designed for high growth.',
              icon: 'Globe',
              color: 'bg-green-500/10 text-white',
            },
            {
              id: 4,
              title: 'UI/UX Design',
              description: 'Intuitive and visually appealing interfaces designed to maximize user engagement and satisfaction.',
              icon: 'PenTool',
              color: 'bg-pink-500/10 text-white',
            },
            {
              id: 5,
              title: 'E-Commerce',
              description: 'Launch a powerful online store with seamless navigation and secure payment gateways to maximize your global sales.',
              icon: 'ShoppingCart',
              color: 'bg-orange-500/10 text-white',
            },
            {
              id: 6,
              title: 'Social Media',
              description: 'Build a thriving community and increase engagement across platforms with creative campaigns that get people talking.',
              icon: 'Share2',
              color: 'bg-red-500/10 text-white',
            }
          ]);
        }
      } catch (err) {
        console.error('Error in fetchServices:', err);
      }
    };
    fetchServices();
  }, []);

  return (
    <section id="services" className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-red-500 font-semibold tracking-wider uppercase text-sm">What We Do</span>
          <h2 className="mt-2 text-4xl font-bold text-white sm:text-5xl">Our Services</h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-400 mx-auto">
            We provide comprehensive digital solutions to help your business thrive in the modern world.
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
                className="bg-zinc-900 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-zinc-800 group hover:border-red-500/30 overflow-hidden relative"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${service.color || 'text-red-500'} group-hover:scale-110 transition-transform`}>
                  <Icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-500 transition-colors">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed">
                  {service.description}
                </p>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

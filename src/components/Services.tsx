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
        const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: true });
        if (data && data.length > 0) {
          setServices(data);
        } else {
          // Fallback data if database is empty or not configured
          setServices([
            {
              id: 1,
              title: 'Web Development',
              description: 'Custom, responsive websites built with modern technologies to deliver exceptional user experiences.',
              icon: 'Code',
              color: 'bg-blue-500/10 text-blue-500',
            },
            {
              id: 2,
              title: 'Mobile Apps',
              description: 'Native and cross-platform mobile applications that engage users and drive business growth.',
              icon: 'Smartphone',
              color: 'bg-purple-500/10 text-purple-500',
            },
            {
              id: 3,
              title: 'Digital Marketing',
              description: 'Data-driven marketing strategies to increase your online visibility and reach your target audience.',
              icon: 'Globe',
              color: 'bg-green-500/10 text-green-500',
            },
            {
              id: 4,
              title: 'UI/UX Design',
              description: 'Intuitive and visually appealing interfaces designed to maximize user engagement and satisfaction.',
              icon: 'PenTool',
              color: 'bg-pink-500/10 text-pink-500',
            },
            {
              id: 5,
              title: 'E-Commerce',
              description: 'Scalable online stores with secure payment gateways and seamless shopping experiences.',
              icon: 'ShoppingCart',
              color: 'bg-orange-500/10 text-orange-500',
            },
            {
              id: 6,
              title: 'Social Media',
              description: 'Strategic social media management to build brand awareness and foster community engagement.',
              icon: 'Share2',
              color: 'bg-red-500/10 text-red-500',
            }
          ]);
        }
      } catch (err) {
        console.error('Error fetching services:', err);
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
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="bg-zinc-900 rounded-2xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-zinc-800 group hover:border-red-500/30"
              >
                <div className={`w-14 h-14 rounded-xl flex items-center justify-center mb-6 ${service.color} group-hover:scale-110 transition-transform`}>
                  <Icon size={28} />
                </div>
                <h3 className="text-xl font-bold text-white mb-3 group-hover:text-red-500 transition-colors">{service.title}</h3>
                <p className="text-gray-400 leading-relaxed mb-4">
                  {service.description}
                </p>
                <a href="#" className="inline-flex items-center text-red-500 font-medium hover:text-red-400 group-hover:translate-x-1 transition-transform">
                  Learn More <span className="ml-1">&rarr;</span>
                </a>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

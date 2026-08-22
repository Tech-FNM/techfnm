import { useEffect, useState } from 'react';
import { Code, Smartphone, Globe, PenTool, ShoppingCart, Share2, ArrowRight } from 'lucide-react';
import { motion } from 'motion/react';
import { supabase } from '../../lib/supabase';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SeoHead from '../../components/SeoHead';

const iconMap: any = {
  Code,
  Smartphone,
  Globe,
  PenTool,
  ShoppingCart,
  Share2,
};

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('services').select('*');
      if (data && data.length > 0) {
        setServices(data);
      } else {
        // Fallback static data
        setServices([
          {
            id: 1,
            title: 'Web Development',
            description: 'Get a high-performance, responsive website built with the latest tech to ensure a smooth user experience on any device.',
            icon: 'Code',
            color: 'bg-red-500/10 text-red-500',
          },
          {
            id: 2,
            title: 'Content Writing',
            description: 'We craft compelling, SEO-friendly stories that capture your brand’s voice and turn casual readers into loyal customers.',
            icon: 'PenTool',
            color: 'bg-red-500/10 text-red-500',
          },
          {
            id: 3,
            title: 'Digital Marketing',
            description: 'Drive targeted traffic and boost your brand visibility with our data-driven marketing strategies designed for high growth.',
            icon: 'Globe',
            color: 'bg-red-500/10 text-red-500',
          },
          {
            id: 4,
            title: 'UI/UX Design',
            description: 'Intuitive and visually appealing interfaces designed to maximize user engagement and satisfaction.',
            icon: 'PenTool',
            color: 'bg-red-500/10 text-red-500',
          },
          {
            id: 5,
            title: 'E-Commerce',
            description: 'Launch a powerful online store with seamless navigation and secure payment gateways to maximize your global sales.',
            icon: 'ShoppingCart',
            color: 'bg-red-500/10 text-red-500',
          },
          {
            id: 6,
            title: 'Social Media',
            description: 'Build a thriving community and increase engagement across platforms with creative campaigns that get people talking.',
            icon: 'Share2',
            color: 'bg-red-500/10 text-red-500',
          }
        ]);
      }
    } catch (err) {
      console.error('Error fetching services:', err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black font-sans text-white scroll-smooth overflow-x-hidden w-full flex flex-col justify-between">
      <SeoHead pageId="services" />
      <Header />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative min-h-[55vh] bg-black flex items-center justify-center overflow-hidden border-b border-zinc-900 px-4 sm:px-6 lg:px-8">
          {/* Background Shapes */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-red-900/30 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute top-0 -right-20 w-96 h-96 bg-orange-900/30 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-20 w-96 h-96 bg-red-800/30 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <span className="inline-block py-1 px-3 rounded-full bg-red-900/50 text-red-200 text-sm font-semibold mb-2 border border-red-500/30">
              Innovative Solutions
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
              Our Digital Offerings
            </h1>
            <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              We offer a wide spectrum of modern design, development, and strategic marketing capabilities to take your business to the next level.
            </p>
          </div>
        </section>

        {/* SERVICES GRID SECTION */}
        <section className="py-20 bg-zinc-950 px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
          <div className="max-w-7xl mx-auto">
            {loading ? (
              <div className="text-center py-20 text-zinc-500 font-mono tracking-wider">
                Loading Services...
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                {services.map((service, index) => {
                  const Icon = iconMap[service.icon] || Code;
                  return (
                    <motion.div
                      key={service.id}
                      initial={{ opacity: 0, y: 20 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      viewport={{ once: true }}
                      transition={{ delay: index * 0.1, duration: 0.4 }}
                      className="bg-zinc-900/20 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300 border border-zinc-850 group hover:border-red-650/30 overflow-hidden relative backdrop-blur-sm"
                    >
                      <div className={`w-14 h-14 rounded-2xl flex items-center justify-center mb-6 ${service.color || 'bg-red-500/10 text-red-500'} group-hover:scale-110 transition-transform shadow-lg shadow-black/20`}>
                        <Icon size={28} />
                      </div>
                      <h2 className="text-xl sm:text-2xl font-bold text-white mb-3 group-hover:text-red-500 transition-colors">
                        {service.title}
                      </h2>
                      <p className="text-zinc-450 text-sm sm:text-base leading-relaxed">
                        {service.description}
                      </p>
                    </motion.div>
                  );
                })}
              </div>
            )}
          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-24 bg-black text-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <span className="text-red-500 font-semibold tracking-wider uppercase text-sm block">
              Have a Project?
            </span>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Ready to launch your vision?
            </h2>
            
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
              Drop us a line and let's craft custom solutions that accelerate your business results.
            </p>

            <div className="pt-2">
              <a
                href="/request-service"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-full font-bold transition-all hover:scale-105 shadow-lg shadow-red-950/20"
              >
                <span>Get Started Now</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

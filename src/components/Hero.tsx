import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowRight } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Hero() {
  const [content, setContent] = useState<any>({
    title: 'We Build What You Imagine',
    subtitle: 'Creative Solutions',
    description: 'Expert web development, mobile app solutions, and result-driven SEO services to grow your business online.',
    cta1: 'Getting Started',
    cta2: 'Our Services'
  });

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase.from('pages_content').select('content').eq('id', 'home_hero').single();
      if (data && data.content && Object.keys(data.content).length > 0) {
        setContent((prev: any) => ({ ...prev, ...data.content }));
      }
    };
    fetchContent();
  }, []);

  return (
    <section id="home" className="relative h-screen bg-black flex items-center justify-center overflow-hidden">
      {/* Background Shapes */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
        <div className="absolute -top-20 -left-20 w-96 h-96 bg-red-900/30 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob"></div>
        <div className="absolute top-0 -right-20 w-96 h-96 bg-orange-900/30 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-32 left-20 w-96 h-96 bg-red-800/30 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
        >
          <span className="inline-block py-1 px-3 rounded-full bg-red-900/50 text-red-200 text-sm font-semibold mb-6 border border-red-500/30">
            {content.subtitle}
          </span>
          <h1 className="text-5xl md:text-7xl font-bold tracking-tight text-white mb-6">
            {content.title}
          </h1>
          <p className="mt-4 text-xl text-gray-400 max-w-2xl mx-auto mb-10">
            {content.description}
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <a href="#contact" className="inline-flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-full text-white bg-red-600 hover:bg-red-700 md:text-lg shadow-lg shadow-red-600/30 transition-all hover:scale-105">
              {content.cta1}
              <ArrowRight className="ml-2 -mr-1 w-5 h-5" />
            </a>
            <a href="#services" className="inline-flex items-center justify-center px-8 py-4 border border-white/20 text-base font-medium rounded-full text-white bg-transparent hover:bg-white/10 md:text-lg shadow-sm transition-all hover:scale-105">
              {content.cta2}
            </a>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

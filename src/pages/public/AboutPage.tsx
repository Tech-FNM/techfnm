import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SeoHead from '../../components/SeoHead';
import { motion } from 'motion/react';
import { CheckCircle, Target, Zap, Users } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AboutPage() {
  const [content, setContent] = useState<any>({
    about_hero: {
      title: 'Innovating the Digital World',
      description: 'We are a team of passionate technologists dedicated to building exceptional digital experiences. From startups to enterprises, we transform ideas into reality.'
    },
    about_story: {
      title: 'Our Story',
      content1: 'Founded with a vision to simplify technology, TechFNM started as a small group of developers who believed in the power of clean code and beautiful design.',
      content2: 'Over the years, we\'ve grown into a full-service digital agency, helping businesses navigate the complexities of the modern web. Our journey is defined by continuous learning, adapting to new frameworks, and consistently delivering value to our clients.'
    },
    about_mission: {
      mission: 'To empower businesses through innovative technological solutions. We strive to create digital products that are not only functional but also intuitive and engaging, driving real growth for our partners.',
      vision: 'To be the leading catalyst for digital transformation globally. We envision a future where technology seamlessly integrates with human potential, creating unprecedented opportunities and solving complex challenges.'
    }
  });

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase.from('pages_content').select('*').eq('page_name', 'about');
      if (data) {
        const formatted: Record<string, any> = {};
        data.forEach(item => {
          formatted[item.id] = item.content || {};
        });
        setContent((prev: any) => ({ ...prev, ...formatted }));
      }
    };
    fetchContent();
  }, []);

  return (
    <div className="min-h-screen bg-black font-sans text-white flex flex-col w-full">
      <SeoHead pageId="about" title="About Us - Our Story & Mission | TechFNM" />
      <Header />
      <main className="flex-grow pt-32 pb-0">
        
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-red-500 font-semibold tracking-wider uppercase text-sm">Discover TechFNM</span>
            <h1 className="mt-4 text-5xl md:text-7xl font-extrabold text-white tracking-tight">
              {content.about_hero?.title || 'Innovating the Digital World'}
            </h1>
            <p className="mt-6 text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
              {content.about_hero?.description}
            </p>
          </motion.div>
        </section>

        {/* Our Story Section */}
        <section className="py-24 bg-zinc-900/30 border-y border-zinc-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-5xl font-bold mb-8">{content.about_story?.title || 'Our Story'}</h2>
                <div className="space-y-6 text-zinc-400 text-lg leading-relaxed">
                  <p>{content.about_story?.content1}</p>
                  <p>{content.about_story?.content2}</p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative h-[400px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl shadow-red-500/5 border border-zinc-800"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-black/80 z-10 mix-blend-overlay" />
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
                  alt="TechFNM Team collaborating" 
                  className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Core Values / Team Section placeholder (New Section) */}
        <section className="py-24 border-b border-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
             <div className="mb-16">
              <span className="text-red-500 font-semibold tracking-wider uppercase text-sm">Behind the Code</span>
              <h2 className="mt-4 text-4xl md:text-5xl font-bold">Meet Our Team</h2>
              <p className="mt-6 text-zinc-400 max-w-2xl mx-auto text-xl">
                The brilliant minds driving innovation and delivering excellence every day.
              </p>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-8">
               {[1, 2, 3, 4].map((i) => (
                 <motion.div 
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: i * 0.1 }}
                    className="p-6 bg-zinc-900/50 rounded-2xl border border-zinc-800 group"
                 >
                    <div className="w-24 h-24 mx-auto bg-zinc-800 rounded-full mb-4 overflow-hidden">
                       <img src={`https://i.pravatar.cc/150?img=${i + 10}`} alt="Team Member" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-300"/>
                    </div>
                    <h4 className="font-bold text-lg">Team Member {i}</h4>
                    <p className="text-sm text-red-500">Expert Developer</p>
                 </motion.div>
               ))}
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-12 rounded-[2rem] bg-zinc-900 border border-zinc-800 hover:border-red-500/30 transition-colors group"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-8 group-hover:bg-red-500/20 transition-colors">
                <Target className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
              <p className="text-zinc-400 text-lg leading-relaxed">
                {content.about_mission?.mission}
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-12 rounded-[2rem] bg-zinc-900 border border-zinc-800 hover:border-red-500/30 transition-colors group"
            >
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-8 group-hover:bg-orange-500/20 transition-colors">
                <Zap className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Our Vision</h3>
              <p className="text-zinc-400 text-lg leading-relaxed">
                {content.about_mission?.vision}
              </p>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

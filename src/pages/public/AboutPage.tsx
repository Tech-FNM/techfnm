import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SeoHead from '../../components/SeoHead';
import { motion } from 'motion/react';
import { ArrowRight, Star } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AboutPage() {
  const [content, setContent] = useState<any>({
    about_hero: {
      title: 'We Turn Complexity & Intricacy...',
      subtitle: 'To Elegant Simplicity & Absolute Clarity',
      intro_italic: '*TechFNM* crafts state-of-the-art software solutions that empower developers and organizations to integrate, visualize, and analyze data across the technological vertical.'
    },
    about_existence: {
      title: 'Our Existence Explained',
      description: 'Founded with a vision to simplify digital infrastructure, we build tools that empower organizations to distill complex datasets into structured, visual intelligence. We believe clean code, strict patterns, and modern aesthetics allow startups and enterprises to work efficiently.',
      founded_label: 'Founded',
      founded_value: '2023',
      remote_label: 'Remote',
      remote_value: '100%',
      raised_label: 'Raised',
      raised_value: '$2.5M'
    },
    about_do_difference: {
      do_title: 'What We Do',
      do_desc: 'We forge technologies that manage simplicity, beautiful aesthetics, and clarity at their foundation. From database connectors to full-scale interface deployment, we build responsive pages that scale.',
      diff_title: 'Our Difference',
      diff_desc: 'We design for developers and pioneers. Our commitment to clean interfaces is not just about visual layouts; it is about how files, states, and components connect to empower creators globally.'
    },
    about_team_quality: {
      title: 'We care deeply about the quality of our work',
      description: 'TechFNM has always been a remote-first team. We are united by a shared passion for high-performance visual excellence, rigorous unit tests, and minimal dependencies.',
      image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
    },
    about_trust_numbers: {
      title: 'Trust backed by numbers',
      description: 'We have a big mission in front of us. Connect a billion systems together securely - and we can only achieve this with your trust.'
    },
    about_easy_start: {
      title: 'Starting has never been easier',
      buttonText: 'View TechFNM Services'
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
    <div className="min-h-screen bg-black font-sans text-white flex flex-col w-full selection:bg-red-500/30">
      <SeoHead pageId="about" title="About Us - Complexity to Simplicity | TechFNM" />
      <Header />
      <main className="flex-grow pt-32 pb-0 relative overflow-hidden">
        
        {/* Abstract Top Grid Decor */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[500px] bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none -z-10" />
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-red-600/10 blur-[120px] rounded-full pointer-events-none -z-10" />

        {/* 1. Hero Block (Complexity to Simplicity) */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-8"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-red-500/10 border border-red-500/25 rounded-full text-xs text-red-500 font-semibold tracking-wider uppercase">
              <Star size={10} className="fill-red-500" /> Towards
            </span>
            <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-tight">
              {content.about_hero?.title}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                {content.about_hero?.subtitle}
              </span>
            </h1>
            <p className="mt-8 text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed italic border-t border-zinc-900 pt-8">
              {content.about_hero?.intro_italic}
            </p>
          </motion.div>
        </section>

        {/* 2. Our Existence Explained Section */}
        <section className="py-24 border-t border-zinc-900 bg-zinc-950/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-5 space-y-6">
                <span className="text-xs text-red-500 font-semibold tracking-widest uppercase">Our Story</span>
                <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                  {content.about_existence?.title.split(' ').map((word: string, i: number, arr: string[]) => 
                    i === arr.length - 1 ? <span key={i} className="text-red-500"> {word}</span> : ` ${word}`
                  )}
                </h2>
                
                {/* Stats layout */}
                <div className="grid grid-cols-3 gap-4 pt-8 border-t border-zinc-900">
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-white">{content.about_existence?.founded_value}</div>
                    <div className="text-xs text-zinc-500">{content.about_existence?.founded_label}</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-white">{content.about_existence?.remote_value}</div>
                    <div className="text-xs text-zinc-500">{content.about_existence?.remote_label}</div>
                  </div>
                  <div>
                    <div className="text-2xl md:text-3xl font-bold text-white">{content.about_existence?.raised_value}</div>
                    <div className="text-xs text-zinc-500">{content.about_existence?.raised_label}</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 text-zinc-400 text-lg leading-relaxed font-light space-y-6 pt-4 lg:pt-12">
                <p className="whitespace-pre-line">{content.about_existence?.description}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 3. Split Block (What We Do & Our Difference) */}
        <section className="py-24 border-t border-zinc-900 bg-black">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              <div className="space-y-6 bg-zinc-950/30 p-8 rounded-3xl border border-zinc-900">
                <span className="text-[10px] text-red-500 tracking-wider uppercase font-bold">Our Craft</span>
                <h3 className="text-2xl font-bold text-white">
                  {content.about_do_difference?.do_title.split(' ').map((word: string, i: number, arr: string[]) => 
                    i === arr.length - 1 ? <span key={i} className="text-red-500">{word}</span> : `${word} `
                  )}
                </h3>
                <p className="text-zinc-400 leading-relaxed font-light text-sm">{content.about_do_difference?.do_desc}</p>
              </div>

              <div className="space-y-6 bg-zinc-950/30 p-8 rounded-3xl border border-zinc-900">
                <span className="text-[10px] text-red-500 tracking-wider uppercase font-bold">Our Shift</span>
                <h3 className="text-2xl font-bold text-white">
                  {content.about_do_difference?.diff_title.split(' ').map((word: string, i: number, arr: string[]) => 
                    i === arr.length - 1 ? <span key={i} className="text-red-500">{word}</span> : `${word} `
                  )}
                </h3>
                <p className="text-zinc-400 leading-relaxed font-light text-sm">{content.about_do_difference?.diff_desc}</p>
              </div>
            </div>
          </div>
        </section>

        {/* 4. Team Work Quality Section */}
        <section className="py-24 border-t border-zinc-900 bg-zinc-950/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="text-[10px] text-red-500 tracking-wider uppercase font-bold">Team Focus</span>
                <h2 className="text-3xl md:text-4xl font-extrabold text-white leading-tight">
                  {content.about_team_quality?.title}
                </h2>
                <p className="text-zinc-400 font-light leading-relaxed">{content.about_team_quality?.description}</p>
                <div className="pt-4">
                  <Link to="/portfolio" className="inline-flex items-center gap-2 text-white hover:text-red-500 transition-colors font-semibold text-sm">
                    View Portfolio <ArrowRight size={16} />
                  </Link>
                </div>
              </div>
              <div className="relative rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl h-80">
                <img src={content.about_team_quality?.image_url} alt="Our team workspace" className="w-full h-full object-cover" />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* 5. Trust Backed By Numbers Block */}
        <section className="py-24 border-t border-zinc-900 bg-black">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
            <div className="space-y-4">
              <span className="text-[10px] text-red-500 tracking-wider uppercase font-bold">Numbers</span>
              <h2 className="text-3xl md:text-5xl font-extrabold text-white">
                {content.about_trust_numbers?.title}
              </h2>
              <p className="text-zinc-400 max-w-2xl mx-auto text-sm font-light leading-relaxed">{content.about_trust_numbers?.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 max-w-4xl mx-auto">
              <div className="p-8 bg-zinc-950 border border-zinc-900 rounded-3xl space-y-2">
                <div className="text-4xl font-bold text-white">{content.about_existence?.founded_value}</div>
                <div className="text-xs text-zinc-500 uppercase tracking-widest">{content.about_existence?.founded_label}</div>
              </div>
              <div className="p-8 bg-zinc-950 border border-zinc-900 rounded-3xl space-y-2">
                <div className="text-4xl font-bold text-white">{content.about_existence?.remote_value}</div>
                <div className="text-xs text-zinc-500 uppercase tracking-widest">{content.about_existence?.remote_label}</div>
              </div>
              <div className="p-8 bg-zinc-950 border border-zinc-900 rounded-3xl space-y-2">
                <div className="text-4xl font-bold text-white">{content.about_existence?.raised_value}</div>
                <div className="text-xs text-zinc-500 uppercase tracking-widest">{content.about_existence?.raised_label}</div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Call to Action Banner (Starting is easier) */}
        <section className="py-24 border-t border-zinc-900 bg-[linear-gradient(to_bottom,transparent,#6b00000a)] relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800 flex items-center justify-center mx-auto">
              <span className="font-extrabold text-red-500">N</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              {content.about_easy_start?.title}
            </h2>
            <div className="pt-4">
              <Link to="/services" className="inline-flex items-center justify-center px-8 py-3 bg-white hover:bg-zinc-100 text-black font-bold rounded-full transition-transform hover:scale-105 shadow-xl">
                {content.about_easy_start?.buttonText}
              </Link>
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

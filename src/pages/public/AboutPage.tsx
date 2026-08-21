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
      intro_italic: '*1771 Technologies* crafts state-of-the-art software solutions that empower developers and organizations to integrate, visualize, and analyze data across the technological vertical.'
    },
    about_existence: {
      title: 'Our Existence Explained',
      description: 'Founded in 2023, we recognized a demand for solutions that empower enterprises to distill exponential information into its purest and most simple form.\n\nLooking to the next decade, we build software solutions that struggle to handle standard challenges, ever-changing data complexity, and new tech. We make sure this is fast, secure, and intuitive.\n\nExisting software is built on under-schemed platforms, leading to storage resource constraints, security issues, and slow response times. TechFNM solves this with high-performance architectures.\n\nWith a clear vision, we stand as a beacon of technology characterized by exceptional adaptability, absolute accuracy, and extreme security. Our solutions are designed to help enterprises, making them fit to manage large-scale data with ease and clarity.',
      founded_label: 'Founded',
      founded_value: '2023',
      remote_label: 'Remote',
      remote_value: '100%',
      raised_label: 'Raised',
      raised_value: '$2.5M'
    },
    about_do_difference: {
      do_title: 'What We Do',
      do_desc: 'We forge technologies that manage simplicity, beautiful aesthetics, and clarity at their foundation.\n\nFrom database connectors to full-scale interface deployment, we build APIs, libraries, and frameworks that handle the complex, multi-threaded, and large datasets.',
      diff_title: 'Our Difference',
      diff_desc: 'We design for developers, a Pioneer for Enterprises.\n\nAt 1771 Technologies, we believe in surrounding technology\'s power so that enterprises can manage their data efficiently and securely.\n\nOur commitment to innovation isn\'t only about what we make; it\'s about how we think. We design software to answer the most difficult questions so that all systems can operate smoothly.'
    },
    about_team_quality: {
      title: 'We care deeply about the quality of our work',
      description: 'TechFNM has always been a fully remote company. Today, our small but mighty team is distributed across North America and Europe. What unites us is a relentless focus, fast execution, and a passion for software craftsmanship. We are engineers at heart, and care deeply about the quality of our work, down to the smallest detail.',
      image_url: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80'
    },
    about_trust_numbers: {
      title: 'Trust backed by numbers',
      description: 'We have a big mission in front of us. Connect a billion systems together securely - and we can only achieve this with your trust.'
    },
    about_easy_start: {
      title: 'Starting has never been easier',
      buttonText: 'LyteNyte Grid Pricing'
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
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-7xl h-[600px] bg-[linear-gradient(to_right,#80808007_1px,transparent_1px),linear-gradient(to_bottom,#80808007_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none -z-10" />
        <div className="absolute top-32 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-cyan-500/5 blur-[140px] rounded-full pointer-events-none -z-10" />

        {/* 1. Hero Block (Complexity to Simplicity) */}
        <section className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center pt-16 pb-24">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="space-y-6"
          >
            <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-[10px] text-zinc-400 font-semibold tracking-wider uppercase">
              Towards
            </span>
            <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight text-white max-w-5xl mx-auto leading-tight">
              {content.about_hero?.title}<br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">
                {content.about_hero?.subtitle}
              </span>
            </h1>
            <p className="mt-8 text-sm md:text-base text-zinc-400 max-w-3xl mx-auto leading-relaxed border-t border-zinc-900 pt-8 font-light">
              {content.about_hero?.intro_italic}
            </p>
          </motion.div>
        </section>

        {/* 2. Our Existence Explained Section */}
        <section className="py-24 border-t border-zinc-900/60 bg-zinc-950/20">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 items-start">
              <div className="lg:col-span-5 space-y-6">
                <span className="inline-flex px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[9px] text-zinc-500 uppercase font-semibold">Our Story</span>
                <h2 className="text-3xl md:text-5xl font-extrabold text-white leading-tight">
                  Our Exist<span className="text-red-500">nce</span><br />
                  Explained
                </h2>
                
                {/* Stats layout */}
                <div className="flex gap-12 pt-8 border-t border-zinc-900">
                  <div>
                    <div className="text-3xl font-extrabold text-white">{content.about_existence?.founded_value}</div>
                    <div className="text-xs text-zinc-500 font-light mt-0.5">{content.about_existence?.founded_label}</div>
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold text-white">{content.about_existence?.remote_value}</div>
                    <div className="text-xs text-zinc-500 font-light mt-0.5">{content.about_existence?.remote_label}</div>
                  </div>
                  <div>
                    <div className="text-3xl font-extrabold text-white">{content.about_existence?.raised_value}</div>
                    <div className="text-xs text-zinc-500 font-light mt-0.5">{content.about_existence?.raised_label}</div>
                  </div>
                </div>
              </div>

              <div className="lg:col-span-7 text-zinc-400 text-sm leading-relaxed font-light space-y-6 pt-4 lg:pt-12">
                {content.about_existence?.description.split('\n\n').map((para: string, idx: number) => (
                  <p key={idx}>{para}</p>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* 3. Split Block (What We Do & Our Difference) */}
        <section className="py-24 border-t border-zinc-900/60 bg-black">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-16">
              
              <div className="space-y-6 bg-zinc-950/20 p-8 rounded-3xl border border-zinc-900/80">
                <span className="inline-flex px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[9px] text-zinc-500 uppercase font-semibold">Our Craft</span>
                <h3 className="text-2xl font-bold text-white">
                  What We <span className="text-red-500">Do</span>
                </h3>
                <p className="text-zinc-400 leading-relaxed font-light text-sm whitespace-pre-line">{content.about_do_difference?.do_desc}</p>
                <div className="pt-2">
                  <Link to="/services" className="inline-flex items-center gap-1.5 text-xs text-red-500 hover:text-red-400 transition-colors font-semibold">
                    Learn more About Our Platforms <ArrowRight size={12} />
                  </Link>
                </div>
              </div>

              <div className="space-y-6 bg-zinc-950/20 p-8 rounded-3xl border border-zinc-900/80">
                <span className="inline-flex px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[9px] text-zinc-500 uppercase font-semibold">Our Craft</span>
                <h3 className="text-2xl font-bold text-white">
                  Our Differ<span className="text-red-500">nce</span>
                </h3>
                <p className="text-zinc-400 leading-relaxed font-light text-sm whitespace-pre-line">{content.about_do_difference?.diff_desc}</p>
              </div>

            </div>
          </div>
        </section>

        {/* 4. Team Work Quality Section */}
        <section className="py-24 border-t border-zinc-900/60 bg-zinc-950/10">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div className="space-y-6">
                <span className="inline-flex px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[9px] text-zinc-500 uppercase font-semibold">Team</span>
                <h2 className="text-3xl font-extrabold text-white leading-tight">
                  We care deeply <span className="text-red-500">about</span><br />
                  the quality of our <span className="text-red-500">work</span>
                </h2>
                <p className="text-zinc-400 font-light text-sm leading-relaxed">{content.about_team_quality?.description}</p>
                <div className="pt-2">
                  <Link to="/portfolio" className="inline-flex items-center gap-2 px-4 py-2 border border-zinc-800 hover:border-zinc-700 rounded-xl text-white transition-colors font-semibold text-xs bg-zinc-900/40">
                    We're hiring <ArrowRight size={12} />
                  </Link>
                </div>
              </div>
              <div className="relative rounded-3xl overflow-hidden border border-zinc-900 shadow-2xl h-80">
                <img src={content.about_team_quality?.image_url} alt="Our team workspace" className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-500" />
                <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />
              </div>
            </div>
          </div>
        </section>

        {/* 5. Trust Backed By Numbers Block */}
        <section className="py-24 border-t border-zinc-900/60 bg-black">
          <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-12">
            <div className="space-y-4">
              <span className="inline-flex px-2 py-0.5 bg-zinc-900 border border-zinc-800 rounded text-[9px] text-zinc-500 uppercase font-semibold">Numbers</span>
              <h2 className="text-3xl md:text-4xl font-extrabold text-white">
                Trust backed <span className="text-red-500">by</span><br />
                numbers
              </h2>
              <p className="text-zinc-500 max-w-2xl mx-auto text-xs font-light leading-relaxed">{content.about_trust_numbers?.description}</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8 pt-8 max-w-3xl mx-auto">
              <div className="p-8 bg-zinc-950 border border-zinc-900/80 rounded-3xl space-y-2">
                <div className="text-4xl font-extrabold text-white">{content.about_existence?.founded_value}</div>
                <div className="text-xs text-zinc-500 uppercase tracking-widest font-light">{content.about_existence?.founded_label}</div>
              </div>
              <div className="p-8 bg-zinc-950 border border-zinc-900/80 rounded-3xl space-y-2">
                <div className="text-4xl font-extrabold text-white">{content.about_existence?.remote_value}</div>
                <div className="text-xs text-zinc-500 uppercase tracking-widest font-light">{content.about_existence?.remote_label}</div>
              </div>
              <div className="p-8 bg-zinc-950 border border-zinc-900/80 rounded-3xl space-y-2">
                <div className="text-4xl font-extrabold text-white">{content.about_existence?.raised_value}</div>
                <div className="text-xs text-zinc-500 uppercase tracking-widest font-light">{content.about_existence?.raised_label}</div>
              </div>
            </div>
          </div>
        </section>

        {/* 6. Call to Action Banner (Starting is easier) */}
        <section className="py-24 border-t border-zinc-900/60 bg-[linear-gradient(to_bottom,transparent,#6b00000a)] relative">
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-red-600/5 blur-[120px] rounded-full pointer-events-none" />
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-8 relative z-10">
            <div className="w-12 h-12 rounded-2xl bg-zinc-900 border border-zinc-800/80 flex items-center justify-center mx-auto">
              <span className="font-extrabold text-red-500 text-lg">N</span>
            </div>
            <h2 className="text-3xl md:text-5xl font-extrabold text-white tracking-tight">
              Starting has never been <span className="text-red-500">easier</span>
            </h2>
            <div className="pt-4">
              <Link to="/services" className="inline-flex items-center justify-center px-8 py-3 bg-white hover:bg-zinc-100 text-black font-bold rounded-full transition-transform hover:scale-105 shadow-xl text-xs">
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

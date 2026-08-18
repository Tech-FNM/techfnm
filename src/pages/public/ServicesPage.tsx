import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SeoHead from '../../components/SeoHead';
import { supabase } from '../../lib/supabase';
import { motion } from 'motion/react';
import * as LucideIcons from 'lucide-react';
import { ArrowRight, HelpCircle, ChevronDown } from 'lucide-react';

export default function ServicesPage() {
  const [services, setServices] = useState<any[]>([]);
  const [content, setContent] = useState<any>({
    services_hero: {
      title: 'Transforming Ideas into Digital Solutions',
      description: 'We offer comprehensive tech services designed to scale your business, optimize workflows, and engage your users with stunning experiences.'
    },
    services_process: {
      subtitle: 'A streamlined approach to ensure transparency, quality, and on-time delivery for every project.'
    }
  });
  const [activeFaq, setActiveFaq] = useState<number | null>(0);

  useEffect(() => {
    const fetchData = async () => {
      const { data: servicesData } = await supabase.from('services').select('*').order('created_at', { ascending: false });
      if (servicesData) setServices(servicesData);

      const { data: contentData } = await supabase.from('pages_content').select('*').eq('page_name', 'services');
      if (contentData) {
        const formatted: Record<string, any> = {};
        contentData.forEach(item => {
          formatted[item.id] = item.content || {};
        });
        setContent((prev: any) => ({ ...prev, ...formatted }));
      }
    };
    fetchData();
  }, []);

  const faqs = [
    { q: "Do you offer custom software development?", a: "Yes, we specialize in building custom software tailored to your specific business requirements from scratch." },
    { q: "How do you ensure code quality?", a: "We follow industry best practices, conduct rigorous code reviews, and implement automated testing pipelines for all our projects." },
    { q: "Can you help migrate our existing systems?", a: "Absolutely. We have extensive experience in legacy system modernization and seamless cloud migrations." },
  ];

  return (
    <div className="min-h-screen bg-black font-sans text-white flex flex-col w-full">
      <SeoHead pageId="services" title="Our Services - Web, App & Software Development | TechFNM" />
      <Header />
      
      <main className="flex-grow pt-32 pb-0">
        
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-red-500 font-semibold tracking-wider uppercase text-sm">What We Do</span>
            <h1 className="mt-4 text-5xl md:text-7xl font-extrabold text-white tracking-tight">
              {content.services_hero?.title?.split(' ').map((word: string, i: number, arr: string[]) => 
                i === arr.length - 2 || i === arr.length - 1 ? 
                <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500"> {word}</span> : 
                ` ${word}`
              ) || 'Transforming Ideas into Digital Solutions'}
            </h1>
            <p className="mt-6 text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
              {content.services_hero?.description}
            </p>
          </motion.div>
        </section>

        {/* Services Grid (Dynamic) */}
        <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {services.map((service, index) => {
              const IconComponent = (LucideIcons as any)[service.icon] || LucideIcons.Code;
              return (
                <Link to={`/services/${service.slug || service.id}`} key={service.id}>
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1 }}
                    className="p-10 rounded-[2rem] bg-zinc-900 border border-zinc-800 hover:border-red-500/50 transition-all duration-300 h-full group relative overflow-hidden flex flex-col"
                  >
                    <div className="absolute top-0 right-0 w-32 h-32 bg-red-500/5 rounded-full blur-3xl group-hover:bg-red-500/20 transition-colors duration-500" />
                    
                    <div className="w-16 h-16 rounded-2xl flex items-center justify-center mb-8 bg-zinc-950 border border-zinc-800 text-red-500 group-hover:scale-110 group-hover:border-red-500/30 transition-all duration-300 shadow-xl shrink-0">
                      <IconComponent size={32} strokeWidth={1.5} />
                    </div>
                    
                    <h3 className="text-2xl font-bold text-white mb-4 relative z-10">{service.title}</h3>
                    <p className="text-zinc-400 leading-relaxed mb-8 relative z-10">
                      {service.description}
                    </p>
                    
                    <div className="mt-auto pt-4 flex items-center gap-2 text-red-500 font-medium group-hover:gap-4 transition-all relative z-10">
                      Explore Service <ArrowRight className="w-4 h-4" />
                    </div>
                  </motion.div>
                </Link>
              );
            })}
          </div>
        </section>

        {/* How We Work (Process) */}
        <section className="py-24 bg-zinc-900/30 border-y border-zinc-800/50 relative overflow-hidden">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <span className="text-red-500 font-semibold tracking-wider uppercase text-sm">Our Process</span>
              <h2 className="mt-4 text-4xl md:text-5xl font-bold">How We Work</h2>
              <p className="mt-6 text-zinc-400 max-w-2xl mx-auto text-xl">
                {content.services_process?.subtitle}
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8 relative">
              <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-0.5 bg-gradient-to-r from-red-500/0 via-red-500/20 to-red-500/0 z-0" />
              
              {[
                { step: '01', title: 'Discovery', desc: 'Understanding your goals, target audience, and business requirements.' },
                { step: '02', title: 'Planning', desc: 'Creating wireframes, choosing the tech stack, and project roadmapping.' },
                { step: '03', title: 'Execution', desc: 'Agile development with regular updates, ensuring quality code.' },
                { step: '04', title: 'Delivery', desc: 'Rigorous testing followed by seamless deployment and launch.' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.15 }}
                  className="relative z-10 text-center"
                >
                  <div className="w-24 h-24 mx-auto bg-black border-2 border-zinc-800 rounded-full flex items-center justify-center mb-6 shadow-[0_0_30px_rgba(239,68,68,0.1)]">
                    <span className="text-3xl font-extrabold text-transparent bg-clip-text bg-gradient-to-br from-red-400 to-red-600">{item.step}</span>
                  </div>
                  <h3 className="text-2xl font-bold mb-3">{item.title}</h3>
                  <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Services FAQ (New Section) */}
        <section className="py-24 max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
           <div className="text-center mb-16">
              <HelpCircle className="w-12 h-12 text-red-500 mx-auto mb-6" />
              <h2 className="text-4xl font-bold">Service FAQs</h2>
            </div>
            <div className="space-y-4">
               {faqs.map((faq, idx) => (
                  <div key={idx} className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden transition-all duration-300">
                    <button 
                      onClick={() => setActiveFaq(activeFaq === idx ? null : idx)}
                      className="w-full px-6 py-5 text-left flex justify-between items-center hover:bg-zinc-800/50 transition-colors"
                    >
                       <span className="font-bold text-lg">{faq.q}</span>
                       <ChevronDown className={`w-5 h-5 text-red-500 transition-transform duration-300 ${activeFaq === idx ? 'rotate-180' : ''}`} />
                    </button>
                    {activeFaq === idx && (
                       <div className="px-6 pb-6 text-zinc-400">
                          {faq.a}
                       </div>
                    )}
                  </div>
               ))}
            </div>
        </section>
        
        {/* Call to Action */}
        <section className="py-24 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center border-t border-zinc-900">
           <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="p-12 md:p-20 rounded-[3rem] bg-gradient-to-b from-zinc-900 to-black border border-zinc-800 relative overflow-hidden"
           >
              <div className="absolute inset-0 bg-red-500/5 mix-blend-overlay blur-3xl" />
              <div className="relative z-10">
                <h2 className="text-4xl md:text-5xl font-bold mb-6">Ready to Build Something Amazing?</h2>
                <p className="text-xl text-zinc-400 mb-10 max-w-2xl mx-auto">
                  Let's discuss your project and see how we can bring your vision to life with modern technology.
                </p>
                <Link to="/contact" className="inline-flex items-center gap-2 px-8 py-4 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-all hover:scale-105 active:scale-95 shadow-lg shadow-red-600/20">
                  Start a Project <ArrowRight className="w-5 h-5" />
                </Link>
              </div>
           </motion.div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

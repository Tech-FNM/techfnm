import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, Star } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { usePageContent } from '../lib/cmsContent';
import { CANONICAL_FAQS, getCached, setCached } from '../lib/canonicalData';

const DEFAULT_FAQS = [
  {
    id: 1,
    question: 'What services does your digital agency offer?',
    answer: 'We provide end-to-end digital solutions including high-performance web development, mobile applications, search engine optimization (SEO), performance marketing, UI/UX design, and strategic branding.'
  },
  {
    id: 2,
    question: 'How long does it take to complete a project?',
    answer: 'A standard website or branding sprint typically takes between 2 to 4 weeks, while complex full-stack web applications and custom software can take 6 to 12 weeks depending on requirements.'
  },
  {
    id: 3,
    question: 'Do you offer customized solutions for businesses?',
    answer: 'Yes! Every project is tailor-made specifically for your business goals, target audience, and industry standards without relying on generic off-the-shelf templates.'
  },
  {
    id: 4,
    question: 'Do you provide maintenance and ongoing support?',
    answer: 'Absolutely. We provide comprehensive post-launch SLA support, monthly security updates, continuous SEO optimization, and infrastructure scaling.'
  },
  {
    id: 5,
    question: 'How do we get started with TechFNM?',
    answer: 'Getting started is effortless. Click "Get Free Quote" or fill out the request form to schedule a free 30-minute discovery call with our solutions team.'
  }
];

export default function FAQ() {
  const [faqs, setFaqs] = useState<any[]>(() => {
    const cached = getCached('techfnm_faqs_cache', CANONICAL_FAQS);
    return cached && cached.length > 0 ? cached : DEFAULT_FAQS;
  });
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const pageContent = usePageContent('page-home', {
    faq_badge: 'Frequently Asked Questions.',
    faq_heading: 'Find answers to common questions here',
    faq_desc: 'Explore clear and helpful answers to the most common questions about our services, process, and solutions.',
    faq_trust_score: '5.0/5',
    faq_trust_label: 'Rated 5.0 Stars on Google Reviews'
  });

  useEffect(() => {
    const fetchFaqs = async () => {
      try {
        const { data, error } = await supabase.from('faqs').select('*').order('created_at', { ascending: true });
        if (data && data.length > 0) {
          setFaqs(data);
          setCached('techfnm_faqs_cache', data);
        }
      } catch (err) {
        console.error('Error in fetchFaqs:', err);
      }
    };
    fetchFaqs();
  }, []);

  return (
    <section id="faq" className="py-24 sm:py-32 bg-black relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Heading, description & Trust Score Card */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="inline-flex items-center gap-2 bg-[#1B1B1B] border border-white/10 rounded-full px-4 py-1.5 mb-5 w-fit">
              <span className="w-2 h-2 rounded-full bg-[#e5432e]" />
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-zinc-300 uppercase">
                {pageContent.faq_badge || 'Frequently Asked Questions.'}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
              {pageContent.faq_heading || 'Find answers to common questions here'}
            </h2>

            <p className="text-base sm:text-lg text-zinc-400 font-normal leading-relaxed mb-8">
              {pageContent.faq_desc ||
                'Explore clear and helpful answers to the most common questions about our services, process, and solutions.'}
            </p>

            {/* Fexora Trust Score Card */}
            <a
              href="https://share.google/LRx2Rpfx8ATZzfWyH"
              target="_blank"
              rel="noopener noreferrer"
              className="bg-[#121214] border border-white/10 hover:border-[#e5432e]/50 rounded-3xl p-6 sm:p-7 flex items-center gap-5 transition-all group cursor-pointer"
            >
              <div className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight group-hover:text-[#e5432e] transition-colors">
                {pageContent.faq_trust_score || '5.0/5'}
              </div>
              <div className="border-l border-white/10 pl-5">
                <div className="flex items-center gap-1.5 mb-1">
                  <div className="flex items-center gap-1 text-[#e5432e]">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={15} fill="currentColor" stroke="none" />
                    ))}
                  </div>
                  <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded-full">Google</span>
                </div>
                <p className="text-xs sm:text-sm text-zinc-400 font-medium group-hover:text-zinc-200 transition-colors">
                  {pageContent.faq_trust_label || 'Rated 5.0 Stars on Google Reviews'}
                </p>
              </div>
            </a>
          </div>

          {/* Right Column: Accordion Items */}
          <div className="lg:col-span-7 space-y-4">
            {faqs.map((faq, index) => {
              const isOpen = activeIndex === index;
              return (
                <motion.div
                  key={faq.id || index}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: index * 0.06 }}
                  className={`bg-[#121214] rounded-2xl border transition-all duration-300 overflow-hidden ${
                    isOpen ? 'border-[#e5432e]/50 shadow-lg shadow-[#e5432e]/5' : 'border-white/10 hover:border-white/20'
                  }`}
                >
                  <button
                    onClick={() => setActiveIndex(isOpen ? null : index)}
                    className="w-full p-6 sm:p-7 flex items-center justify-between text-left gap-4 transition-colors"
                  >
                    <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                      {faq.question}
                    </span>
                    <div
                      className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 transition-all duration-300 ${
                        isOpen ? 'bg-[#e5432e] text-white rotate-180' : 'bg-white/5 text-zinc-400'
                      }`}
                    >
                      {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                    </div>
                  </button>

                  <AnimatePresence>
                    {isOpen && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.3 }}
                      >
                        <div className="px-6 sm:px-7 pb-6 text-zinc-400 text-sm sm:text-base leading-relaxed border-t border-white/5 pt-4">
                          {faq.answer}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

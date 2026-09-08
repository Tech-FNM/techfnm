import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, HelpCircle } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { usePageContent } from '../lib/cmsContent';
import { CANONICAL_FAQS, getCached, setCached } from '../lib/canonicalData';

export default function FAQ() {
  const [faqs, setFaqs] = useState<any[]>(() => getCached('techfnm_faqs_cache', CANONICAL_FAQS));
  const [activeIndex, setActiveIndex] = useState<number | null>(0);

  const pageContent = usePageContent('page-home', {
    faq_badge: 'Support Center',
    faq_heading: 'Frequently Asked Questions',
    faq_desc: 'Clear answers to common questions about working with our engineering team.'
  });

  useEffect(() => {
    fetchFaqs();

    const channel = supabase
      .channel('public:faqs')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'faqs' }, () => {
        fetchFaqs();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  const fetchFaqs = async () => {
    try {
      const { data, error } = await supabase.from('faqs').select('*').order('created_at', { ascending: true });
      if (data && data.length > 0) {
        setFaqs(data);
        setCached('techfnm_faqs_cache', data);
      } else if (faqs.length === 0) {
        setFaqs(CANONICAL_FAQS);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
  };

  const badge = pageContent.faq_badge || 'Support Center';
  const heading = pageContent.faq_heading || 'Frequently Asked Questions';
  const description = pageContent.faq_desc || 'Clear answers to common questions about working with our engineering team.';

  return (
    <section id="faqs" className="py-24 bg-black relative overflow-hidden">
      <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 blur-[120px] rounded-full -mr-48 -mt-48" />
      <div className="absolute bottom-0 left-0 w-96 h-96 bg-red-600/5 blur-[120px] rounded-full -ml-48 -mb-48" />

      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-red-500/10 border border-red-500/20 text-red-500 text-sm font-bold mb-4"
          >
            <HelpCircle size={16} />
            <span>{badge}</span>
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-4xl md:text-5xl font-bold text-white mb-6"
          >
            {heading}
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.2 }}
            className="text-gray-400 text-lg"
          >
            {description}
          </motion.p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={faq.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-900/50 border border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-sm"
            >
              <button
                onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-zinc-800/50 transition-colors"
              >
                <span className="text-lg font-bold text-white">{faq.question}</span>
                <div className={`p-2 rounded-lg transition-all ${activeIndex === index ? 'bg-red-600 text-white' : 'bg-zinc-800 text-gray-400'}`}>
                  {activeIndex === index ? <Minus size={20} /> : <Plus size={20} />}
                </div>
              </button>
              <AnimatePresence>
                {activeIndex === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.3, ease: 'easeInOut' }}
                  >
                    <div className="px-6 pb-6 text-gray-400 leading-relaxed border-t border-zinc-800/50 pt-4">
                      {faq.answer}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

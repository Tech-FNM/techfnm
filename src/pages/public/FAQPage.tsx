import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Plus, Minus, Search, HelpCircle, ArrowRight, MessageSquare } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SeoHead from '../../components/SeoHead';

export default function FAQPage() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeIndex, setActiveIndex] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('created_at', { ascending: true });
      if (data) {
        setFaqs(data);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    } finally {
      setLoading(false);
    }
  };

  const filteredFaqs = faqs.filter(
    (faq) =>
      faq.question.toLowerCase().includes(searchQuery.toLowerCase()) ||
      faq.answer.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="min-h-screen bg-black font-sans text-white scroll-smooth overflow-x-hidden w-full flex flex-col justify-between">
      <SeoHead pageId="faq" />
      <Header />

      <main className="flex-grow pt-28 pb-20">
        {/* HERO SECTION */}
        <section className="relative py-20 bg-black overflow-hidden flex flex-col items-center justify-center border-b border-zinc-900 px-4 sm:px-6 lg:px-8">
          {/* Subtle grid background */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#1f29370a_1px,transparent_1px),linear-gradient(to_bottom,#1f29370a_1px,transparent_1px)] bg-[size:3rem_3rem]" />
          {/* Glow effect */}
          <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-red-650/5 blur-[120px] rounded-full pointer-events-none" />

          <div className="max-w-3xl mx-auto text-center relative z-10 space-y-6">
            <span className="text-red-500 font-semibold tracking-wider uppercase text-sm block">
              Support Center
            </span>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
              Frequently Asked Questions
            </h1>

            <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Find answers to common questions about our web development, mobile app solutions, and digital marketing services.
            </p>

            {/* Search Bar */}
            <div className="max-w-md mx-auto pt-4 relative">
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-650" size={18} />
                <input
                  type="text"
                  placeholder="Search questions or answers..."
                  value={searchQuery}
                  onChange={(e) => {
                    setSearchQuery(e.target.value);
                    setActiveIndex(null);
                  }}
                  className="w-full bg-zinc-950/60 border border-zinc-850 hover:border-zinc-800 focus:border-red-650/40 rounded-full pl-12 pr-6 py-4 text-sm text-zinc-200 placeholder-zinc-700 outline-none transition-colors shadow-lg shadow-black/40"
                />
              </div>
            </div>
          </div>
        </section>

        {/* ACCORDION FAQ SECTION */}
        <section className="py-20 bg-zinc-950 relative border-b border-zinc-900 px-4 sm:px-6 lg:px-8">
          <div className="max-w-3xl mx-auto">
            {loading ? (
              <div className="text-center py-16 text-zinc-500 font-mono tracking-wider">
                Loading FAQs...
              </div>
            ) : filteredFaqs.length === 0 ? (
              <div className="text-center py-16 text-zinc-500 border border-zinc-850 rounded-2xl bg-zinc-900/10">
                <HelpCircle size={36} className="mx-auto text-zinc-700 mb-4 animate-bounce" />
                <p className="text-base font-semibold">No questions found</p>
                <p className="text-xs text-zinc-600 mt-1">Try refining your search terms.</p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredFaqs.map((faq, index) => (
                  <motion.div
                    key={faq.id}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4 }}
                    className="bg-zinc-900/30 border border-zinc-850 hover:border-zinc-800 rounded-2xl overflow-hidden backdrop-blur-md transition-colors"
                  >
                    <button
                      onClick={() => setActiveIndex(activeIndex === index ? null : index)}
                      className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-zinc-850/20 transition-colors"
                    >
                      <span className="text-base sm:text-lg font-bold text-white pr-4">{faq.question}</span>
                      <div className={`p-2 rounded-lg transition-all ${activeIndex === index ? 'bg-red-600 text-white shadow-md shadow-red-950/20' : 'bg-zinc-950 border border-zinc-800 text-zinc-500'}`}>
                        {activeIndex === index ? <Minus size={16} /> : <Plus size={16} />}
                      </div>
                    </button>
                    <AnimatePresence>
                      {activeIndex === index && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.25, ease: 'easeInOut' }}
                        >
                          <div className="px-6 pb-6 text-zinc-400 text-sm sm:text-base leading-relaxed border-t border-zinc-850/40 pt-4 bg-zinc-900/10">
                            {faq.answer}
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </section>

        {/* STILL HAVE QUESTIONS SECTION */}
        <section className="py-20 bg-black text-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <div className="inline-flex items-center justify-center p-3 rounded-2xl bg-zinc-900 border border-zinc-850 text-red-500 shadow-xl shadow-black/40">
              <MessageSquare size={24} />
            </div>
            
            <h2 className="text-2xl sm:text-3xl font-bold text-white">
              Still have questions?
            </h2>
            
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
              If you cannot find the answer to your question in our FAQ directory, please feel free to drop us a message.
            </p>

            <div className="pt-2">
              <a
                href="/contact"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-full font-bold transition-all hover:scale-105 shadow-lg shadow-red-950/20"
              >
                <span>Contact Our Team</span>
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

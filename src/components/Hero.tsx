import { motion } from 'motion/react';
import { ArrowUpRight, CheckCircle2, Star, Zap, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageContent } from '../lib/cmsContent';

export default function Hero() {
  const content = usePageContent('page-home', {
    hero_badge: 'Your Digital Growth Experts',
    hero_title: 'Growth Focused Digital Agency Solutions',
    hero_highlight_word: 'Digital',
    hero_desc: "We deliver data-driven digital strategies designed to accelerate your brand's growth. From marketing to creative execution, our solutions are built to maximize reach, and measurable results.",
    hero_cta1_text: 'Get Free Quote',
    hero_cta1_link: '/request-service',
    hero_cta2_text: 'Our Services',
    hero_cta2_link: '#services',
    hero_stat1_num: '95%',
    hero_stat1_lbl: 'Client Satisfaction Rate',
    hero_stat2_num: '50%',
    hero_stat2_lbl: 'Influencer collaboration',
    hero_stat3_num: '250+',
    hero_stat3_lbl: 'Projects Completed'
  });

  const badge = content.hero_badge || 'Your Digital Growth Experts';
  const fullTitle = content.hero_title || 'Growth Focused Digital Agency Solutions';
  const highlightWord = content.hero_highlight_word || 'Digital';
  const description = content.hero_desc || "We deliver data-driven digital strategies designed to accelerate your brand's growth.";
  const cta1Text = content.hero_cta1_text || 'Get Free Quote';
  const cta1Link = content.hero_cta1_link || '/request-service';
  const cta2Text = content.hero_cta2_text || 'Our Services';
  const cta2Link = content.hero_cta2_link || '#services';

  // Render title with highlighted word in lime
  const renderHighlightedTitle = () => {
    if (!highlightWord || !fullTitle.toLowerCase().includes(highlightWord.toLowerCase())) {
      return fullTitle;
    }
    const parts = fullTitle.split(new RegExp(`(${highlightWord})`, 'gi'));
    return parts.map((part, i) =>
      part.toLowerCase() === highlightWord.toLowerCase() ? (
        <span key={i} className="text-[#e5432e] inline-block relative">
          {part}
          <svg
            className="absolute -bottom-2 left-0 w-full text-[#e5432e]/30 hidden sm:block"
            height="8"
            viewBox="0 0 100 8"
            preserveAspectRatio="none"
          >
            <path d="M0,5 Q50,0 100,5" stroke="currentColor" strokeWidth="3" fill="none" />
          </svg>
        </span>
      ) : (
        part
      )
    );
  };

  return (
    <section id="home" className="relative min-h-[92vh] lg:min-h-screen bg-black flex flex-col justify-center pt-28 sm:pt-36 pb-16 overflow-hidden">
      {/* Dynamic Background Glows & Grid */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] sm:w-[850px] h-[400px] bg-[#e5432e]/10 rounded-full blur-[140px] opacity-70" />
        <div className="absolute top-1/3 left-10 w-[350px] h-[350px] bg-emerald-500/5 rounded-full blur-[100px]" />
        <div className="absolute top-1/2 right-10 w-[400px] h-[400px] bg-lime-400/5 rounded-full blur-[120px]" />
        {/* Subtle grid lines */}
        <div
          className="absolute inset-0 opacity-[0.03]"
          style={{
            backgroundImage:
              'linear-gradient(to right, #ffffff 1px, transparent 1px), linear-gradient(to bottom, #ffffff 1px, transparent 1px)',
            backgroundSize: '60px 60px'
          }}
        />
      </div>

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 text-center flex flex-col items-center">
        {/* Tagline Badge */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="inline-flex items-center gap-2 bg-[#1B1B1B] border border-white/10 rounded-full px-4 py-1.5 mb-6 sm:mb-8 text-xs sm:text-sm text-zinc-300 shadow-inner"
        >
          <span className="w-2 h-2 rounded-full bg-[#e5432e] animate-pulse" />
          <span className="font-medium tracking-wide uppercase text-zinc-200">{badge}</span>
          <Sparkles size={13} className="text-[#e5432e]" />
        </motion.div>

        {/* Big Bold Headline */}
        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl lg:text-[76px] font-extrabold tracking-tight text-white leading-[1.08] max-w-5xl"
        >
          {renderHighlightedTitle()}
        </motion.h1>

        {/* Lead Paragraph */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mt-6 sm:mt-8 text-base sm:text-lg md:text-xl text-zinc-400 max-w-3xl font-normal leading-relaxed"
        >
          {description}
        </motion.p>

        {/* CTA Actions */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mt-8 sm:mt-10 flex flex-wrap items-center justify-center gap-4"
        >
          <Link
            to={cta1Link}
            className="group inline-flex items-center gap-3 bg-[#e5432e] hover:bg-[#cc3622] text-white px-7 py-3.5 sm:py-4 rounded-full text-base font-semibold transition-all duration-300 transform hover:scale-105 shadow-xl shadow-[#e5432e]/20"
          >
            <span>{cta1Text}</span>
            <span className="w-8 h-8 rounded-full bg-white text-[#e5432e] flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight size={17} />
            </span>
          </Link>

          <a
            href={cta2Link}
            className="inline-flex items-center gap-2 bg-[#1B1B1B] hover:bg-[#252528] text-white px-7 py-3.5 sm:py-4 rounded-full text-base font-medium border border-white/10 hover:border-white/25 transition-all duration-300"
          >
            <span>{cta2Text}</span>
          </a>
        </motion.div>

        {/* 3 Funfact / Metric Counter Cards */}
        <motion.div
          initial={{ opacity: 0, y: 25 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.4 }}
          className="mt-14 sm:mt-20 w-full max-w-4xl grid grid-cols-1 sm:grid-cols-3 gap-4 sm:gap-6"
        >
          {/* Metric 1 */}
          <div className="bg-[#121214] border border-white/10 rounded-2xl p-5 sm:p-6 text-left flex items-center gap-4 transition-all duration-300 hover:border-[#e5432e]/40 hover:shadow-lg hover:shadow-[#e5432e]/5">
            <div className="w-12 h-12 rounded-xl bg-[#e5432e]/10 border border-[#e5432e]/20 flex items-center justify-center text-[#e5432e] flex-shrink-0">
              <CheckCircle2 size={24} />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {content.hero_stat1_num || '95%'}
              </div>
              <div className="text-xs sm:text-sm text-zinc-400 font-medium mt-0.5">
                {content.hero_stat1_lbl || 'Client Satisfaction Rate'}
              </div>
            </div>
          </div>

          {/* Metric 2 */}
          <div className="bg-[#121214] border border-white/10 rounded-2xl p-5 sm:p-6 text-left flex items-center gap-4 transition-all duration-300 hover:border-[#e5432e]/40 hover:shadow-lg hover:shadow-[#e5432e]/5">
            <div className="w-12 h-12 rounded-xl bg-[#e5432e]/10 border border-[#e5432e]/20 flex items-center justify-center text-[#e5432e] flex-shrink-0">
              <Star size={24} />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {content.hero_stat2_num || '50%'}
              </div>
              <div className="text-xs sm:text-sm text-zinc-400 font-medium mt-0.5">
                {content.hero_stat2_lbl || 'Influencer collaboration'}
              </div>
            </div>
          </div>

          {/* Metric 3 */}
          <div className="bg-[#121214] border border-white/10 rounded-2xl p-5 sm:p-6 text-left flex items-center gap-4 transition-all duration-300 hover:border-[#e5432e]/40 hover:shadow-lg hover:shadow-[#e5432e]/5">
            <div className="w-12 h-12 rounded-xl bg-[#e5432e]/10 border border-[#e5432e]/20 flex items-center justify-center text-[#e5432e] flex-shrink-0">
              <Zap size={24} />
            </div>
            <div>
              <div className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
                {content.hero_stat3_num || '250+'}
              </div>
              <div className="text-xs sm:text-sm text-zinc-400 font-medium mt-0.5">
                {content.hero_stat3_lbl || 'Projects Completed'}
              </div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}

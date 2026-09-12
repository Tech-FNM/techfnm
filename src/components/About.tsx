import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight, Target, Eye, Award, Sparkles, Check } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageContent } from '../lib/cmsContent';

export default function About() {
  const [activeTab, setActiveTab] = useState<'mission' | 'vision' | 'goals'>('mission');

  const content = usePageContent('page-home', {
    about_badge: 'About Our Agency',
    about_heading: 'We deliver result through digital innovation',
    about_desc: 'We combine creative thinking with cutting-edge technology to deliver innovative digital solutions that drive real, measurable results for your business.',
    about_founder_name: 'Muhammad Naeem',
    about_founder_role: 'Founder & CEO',
    about_founder_avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
    about_mission_title: 'Our Mission',
    about_mission_desc: 'Our mission is to empower brands with innovative digital solutions that drive growth, enhance visibility, and deliver measurable return on investment.',
    about_vision_title: 'Our Vision',
    about_vision_desc: 'To be a world-class digital agency transforming complex challenges into effortless growth platforms for visionary enterprises.',
    about_goals_title: 'Our Goals',
    about_goals_desc: 'Deliver state-of-the-art software, nurture long-term partnerships, and consistently exceed conversion expectations.',
    about_btn_text: 'More About Us',
    about_btn_link: '/about',
    about_image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'
  });

  const tabs = [
    {
      id: 'mission' as const,
      label: content.about_mission_title || 'Our Mission',
      icon: Target,
      content: content.about_mission_desc || 'Our mission is to empower brands with innovative digital solutions that drive growth, enhance visibility, and deliver.'
    },
    {
      id: 'vision' as const,
      label: content.about_vision_title || 'Our Vision',
      icon: Eye,
      content: content.about_vision_desc || 'To be a world-class digital agency transforming complex challenges into effortless growth platforms for visionary enterprises.'
    },
    {
      id: 'goals' as const,
      label: content.about_goals_title || 'Our Goals',
      icon: Award,
      content: content.about_goals_desc || 'Deliver state-of-the-art software, nurture long-term partnerships, and consistently exceed conversion expectations.'
    }
  ];

  const currentTabItem = tabs.find(t => t.id === activeTab) || tabs[0];

  return (
    <section id="about" className="py-24 sm:py-32 bg-black relative overflow-hidden">
      {/* Background Accent */}
      <div className="absolute top-1/2 left-0 w-[500px] h-[500px] bg-[#e5432e]/5 rounded-full blur-[140px] pointer-events-none -translate-y-1/2" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Visual Showcase & Founder Card */}
          <motion.div
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 relative"
          >
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#121214] shadow-2xl group">
              <img
                src={content.about_image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=800&q=80'}
                alt="TechFNM Team at Work"
                className="w-full h-[400px] sm:h-[480px] object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-95"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-transparent to-transparent opacity-60" />

              {/* Founder Overlay Pill / Card */}
              <div className="absolute bottom-5 left-5 right-5 sm:left-6 sm:right-6 bg-black/80 backdrop-blur-xl border border-white/15 p-4 sm:p-5 rounded-2xl flex items-center justify-between shadow-2xl">
                <div className="flex items-center gap-3.5">
                  <img
                    src={content.about_founder_avatar || 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80'}
                    alt={content.about_founder_name || 'Founder & CEO'}
                    className="w-12 h-12 rounded-full object-cover border-2 border-[#e5432e]"
                  />
                  <div>
                    <h4 className="text-white font-bold text-base sm:text-lg">
                      {content.about_founder_name || 'Muhammad Naeem'}
                    </h4>
                    <p className="text-xs sm:text-sm text-[#e5432e] font-medium">
                      {content.about_founder_role || 'Founder & CEO'}
                    </p>
                  </div>
                </div>

                <div className="hidden sm:flex items-center gap-1.5 bg-[#e5432e]/10 border border-[#e5432e]/25 text-[#e5432e] px-3 py-1 rounded-full text-xs font-semibold">
                  <Sparkles size={12} />
                  <span>Verified Agency</span>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Heading, Content & Interactive Mission/Vision/Goals Tabs */}
          <motion.div
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-6 flex flex-col"
          >
            {/* Section Tagline Badge */}
            <div className="inline-flex items-center gap-2 bg-[#1B1B1B] border border-white/10 rounded-full px-4 py-1.5 mb-5 w-fit">
              <span className="w-2 h-2 rounded-full bg-[#e5432e]" />
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-zinc-300 uppercase">
                {content.about_badge || 'About Our Agency'}
              </span>
            </div>

            {/* Main Section Heading */}
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
              {content.about_heading || 'We deliver result through digital innovation'}
            </h2>

            {/* Description Text */}
            <p className="text-base sm:text-lg text-zinc-400 font-normal leading-relaxed mb-8">
              {content.about_desc ||
                'We combine creative thinking with cutting-edge technology to deliver innovative digital solutions that drive real, measurable results for your business.'}
            </p>

            {/* Interactive Tabs: Mission / Vision / Goals */}
            <div className="bg-[#121214] border border-white/10 rounded-2xl p-2 sm:p-2.5 mb-6 flex gap-1.5 sm:gap-2">
              {tabs.map(tab => {
                const isActive = activeTab === tab.id;
                const Icon = tab.icon;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex-1 flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs sm:text-sm font-semibold transition-all duration-300 ${
                      isActive
                        ? 'bg-[#e5432e] text-white shadow-md'
                        : 'text-zinc-400 hover:text-white hover:bg-white/5'
                    }`}
                  >
                    <Icon size={16} />
                    <span>{tab.label}</span>
                  </button>
                );
              })}
            </div>

            {/* Tab Description Card */}
            <div className="bg-[#18181B]/80 border border-white/10 rounded-2xl p-5 sm:p-6 mb-8 min-h-[110px] flex items-start gap-4">
              <div className="w-10 h-10 rounded-xl bg-[#e5432e]/10 border border-[#e5432e]/20 text-[#e5432e] flex items-center justify-center flex-shrink-0 mt-0.5">
                <Check size={20} />
              </div>
              <AnimatePresence mode="wait">
                <motion.p
                  key={activeTab}
                  initial={{ opacity: 0, y: 6 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -6 }}
                  transition={{ duration: 0.2 }}
                  className="text-zinc-300 text-sm sm:text-base leading-relaxed"
                >
                  {currentTabItem.content}
                </motion.p>
              </AnimatePresence>
            </div>

            {/* Action CTA Button */}
            <div>
              <Link
                to={content.about_btn_link || '/about'}
                className="group inline-flex items-center gap-3 bg-[#e5432e] hover:bg-[#cc3622] text-white px-7 py-3.5 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-[#e5432e]/20"
              >
                <span>{content.about_btn_text || 'More About Us'}</span>
                <span className="w-7 h-7 rounded-full bg-white text-[#e5432e] flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight size={15} />
                </span>
              </Link>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

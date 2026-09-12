import { motion } from 'motion/react';
import { Award, Trophy, Star, ArrowUpRight } from 'lucide-react';
import { usePageContent } from '../lib/cmsContent';

export default function Awards() {
  const content = usePageContent('page-home', {
    awards_badge: 'Winning Awards',
    awards_heading: 'Honored for excellence in digital innovation',
    awards_desc: 'We take pride in being recognized for our commitment to innovation, creativity, and excellence in the digital space.',
    awards_count: '50+',
    awards_count_text: 'We have won 50+ awards believe in quality.',
    award1_title: 'Google Premier Partner',
    award1_desc: '3x Highlight of the day',
    award1_year: '2023',
    award2_title: 'Dribbble Design Award',
    award2_desc: 'Best Agency Interface of the Year',
    award2_year: '2024',
    award3_title: 'Clutch Global Leader',
    award3_desc: 'Top Web & Digital Agency Winner',
    award3_year: '2025'
  });

  const awards = [
    {
      title: content.award1_title || 'Google Premier Partner',
      desc: content.award1_desc || '3x Highlight of the day',
      year: content.award1_year || '2023'
    },
    {
      title: content.award2_title || 'Dribbble Design Award',
      desc: content.award2_desc || 'Best Agency Interface of the Year',
      year: content.award2_year || '2024'
    },
    {
      title: content.award3_title || 'Clutch Global Leader',
      desc: content.award3_desc || 'Top Web & Digital Agency Winner',
      year: content.award3_year || '2025'
    }
  ];

  return (
    <section className="py-24 sm:py-32 bg-black relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading, description & Large Counter Box */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="inline-flex items-center gap-2 bg-[#1B1B1B] border border-white/10 rounded-full px-4 py-1.5 mb-5 w-fit">
              <span className="w-2 h-2 rounded-full bg-[#e5432e]" />
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-zinc-300 uppercase">
                {content.awards_badge || 'Winning Awards'}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
              {content.awards_heading || 'Honored for excellence in digital innovation'}
            </h2>

            <p className="text-base sm:text-lg text-zinc-400 font-normal leading-relaxed mb-10">
              {content.awards_desc ||
                'We take pride in being recognized for our commitment to innovation, creativity, and excellence in the digital space.'}
            </p>

            {/* Fexora Style Award Highlight Card */}
            <div className="bg-[#121214] border-2 border-[#e5432e]/30 rounded-3xl p-8 relative overflow-hidden flex items-center gap-6 shadow-xl shadow-[#e5432e]/5">
              <div className="w-16 h-16 rounded-2xl bg-[#e5432e] text-white flex items-center justify-center flex-shrink-0">
                <Trophy size={32} />
              </div>
              <div>
                <div className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                  {content.awards_count || '50+'}
                </div>
                <div className="text-sm sm:text-base text-zinc-300 font-medium mt-1">
                  {content.awards_count_text || 'We have won 50+ awards believe in quality.'}
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Awards List */}
          <div className="lg:col-span-7 space-y-4">
            {awards.map((award, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.4, delay: index * 0.1 }}
                className="group bg-[#121214] border border-white/10 hover:border-[#e5432e]/50 rounded-2xl p-6 sm:p-7 flex items-center justify-between transition-all duration-300 hover:shadow-lg hover:shadow-[#e5432e]/5"
              >
                <div className="flex items-center gap-5">
                  <div className="w-12 h-12 rounded-xl bg-[#1B1B1B] border border-white/10 flex items-center justify-center text-[#e5432e] group-hover:bg-[#e5432e] group-hover:text-white transition-all">
                    <Award size={24} />
                  </div>
                  <div>
                    <h3 className="text-lg sm:text-xl font-bold text-white group-hover:text-[#e5432e] transition-colors">
                      {award.title}
                    </h3>
                    <p className="text-xs sm:text-sm text-zinc-400 mt-0.5">
                      {award.desc}
                    </p>
                  </div>
                </div>

                <div className="flex items-center gap-4">
                  <span className="font-mono text-xs sm:text-sm font-semibold text-zinc-400 bg-white/5 px-3 py-1 rounded-full border border-white/5">
                    {award.year}
                  </span>
                  <div className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 group-hover:bg-[#e5432e] group-hover:text-white transition-all">
                    <ArrowUpRight size={14} />
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}

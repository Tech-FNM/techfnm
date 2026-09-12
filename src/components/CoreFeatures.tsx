import { motion } from 'motion/react';
import {
  BarChart3,
  Share2,
  Search,
  Target,
  PenTool,
  Cpu,
  ArrowUpRight
} from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageContent } from '../lib/cmsContent';

export default function CoreFeatures() {
  const content = usePageContent('page-home', {
    features_badge: 'Core Feature',
    features_heading: 'Innovative features for modern digital solutions',
    features_desc: 'Everything you need to outperform your competitors with precision engineering and high-conversion creative strategy.',
    feat1_title: 'Data-Driven Strategy',
    feat1_desc: 'Smart strategies powered by data to drive better results and continuous growth.',
    feat2_title: 'Social Media Growth',
    feat2_desc: 'Scalable campaigns designed to engage target demographics and build brand loyalty.',
    feat3_title: 'Search Optimization',
    feat3_desc: 'Dominant organic search rankings engineered to convert visitors into loyal clients.',
    feat4_title: 'Paid Advertising',
    feat4_desc: 'High-ROI PPC campaigns calibrated for minimum cost per acquisition.',
    feat5_title: 'Brand Strategy',
    feat5_desc: 'Distinctive corporate visual identities that establish authority and trust.',
    feat6_title: 'Custom Digital Solutions',
    feat6_desc: 'Full-stack web applications, scalable APIs, and performance-tuned software.'
  });

  const features = [
    {
      icon: BarChart3,
      title: content.feat1_title || 'Data-Driven Strategy',
      desc: content.feat1_desc || 'Smart strategies powered by data to drive better results and continuous growth.'
    },
    {
      icon: Share2,
      title: content.feat2_title || 'Social Media Growth',
      desc: content.feat2_desc || 'Scalable campaigns designed to engage target demographics and build brand loyalty.'
    },
    {
      icon: Search,
      title: content.feat3_title || 'Search Optimization',
      desc: content.feat3_desc || 'Dominant organic search rankings engineered to convert visitors into loyal clients.'
    },
    {
      icon: Target,
      title: content.feat4_title || 'Paid Advertising',
      desc: content.feat4_desc || 'High-ROI PPC campaigns calibrated for minimum cost per acquisition.'
    },
    {
      icon: PenTool,
      title: content.feat5_title || 'Brand Strategy',
      desc: content.feat5_desc || 'Distinctive corporate visual identities that establish authority and trust.'
    },
    {
      icon: Cpu,
      title: content.feat6_title || 'Custom Digital Solutions',
      desc: content.feat6_desc || 'Full-stack web applications, scalable APIs, and performance-tuned software.'
    }
  ];

  return (
    <section className="py-24 sm:py-32 bg-black relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 bg-[#1B1B1B] border border-white/10 rounded-full px-4 py-1.5 mb-5">
            <span className="w-2 h-2 rounded-full bg-[#e5432e]" />
            <span className="text-xs sm:text-sm font-semibold tracking-wider text-zinc-300 uppercase">
              {content.features_badge || 'Core Feature'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            {content.features_heading || 'Innovative features for modern digital solutions'}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
            {content.features_desc ||
              'Everything you need to outperform your competitors with precision engineering and high-conversion creative strategy.'}
          </p>
        </div>

        {/* 6 Feature Bento Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {features.map((feat, index) => {
            const Icon = feat.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.08 }}
                className="group relative bg-[#121214] border border-white/10 hover:border-[#e5432e]/50 rounded-3xl p-7 sm:p-8 transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-[#e5432e]/5"
              >
                <div>
                  <div className="w-13 h-13 rounded-2xl bg-[#1B1B1B] border border-white/10 flex items-center justify-center text-[#e5432e] mb-6 group-hover:bg-[#e5432e] group-hover:text-white transition-all duration-300">
                    <Icon size={24} />
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-white mb-3 tracking-tight group-hover:text-[#e5432e] transition-colors">
                    {feat.title}
                  </h3>
                  <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-normal">
                    {feat.desc}
                  </p>
                </div>

                <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-500">
                  <span className="font-semibold text-zinc-400 group-hover:text-white transition-colors">
                    TechFNM Core
                  </span>
                  <span className="w-6 h-6 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 group-hover:bg-[#e5432e] group-hover:text-white transition-all">
                    <ArrowUpRight size={13} />
                  </span>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

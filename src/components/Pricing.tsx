import { motion } from 'motion/react';
import { ArrowUpRight, Check, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageContent } from '../lib/cmsContent';

export default function Pricing() {
  const content = usePageContent('page-home', {
    pricing_badge: 'Our Pricing Plan',
    pricing_heading: 'Choose the right plan for you',
    pricing_desc: "Explore flexible pricing options designed to suit businesses of all sizes and needs. Whether you're just starting out or looking to scale.",
    plan1_name: 'Basic Plan',
    plan1_desc: 'Ideal for growing businesses looking to expand online presence.',
    plan1_price: '29.00',
    plan1_features: 'Advanced SEO Optimization\nFull SEO & Marketing Setup\nMobile Responsive Design\n24/7 Technical Support',
    plan2_name: 'Standard Plan',
    plan2_desc: 'Best value for scaling businesses wanting aggressive online growth.',
    plan2_price: '49.00',
    plan2_badge: 'Popular Choice',
    plan2_features: 'Everything in Basic Plan\nCustom Web & Mobile Development\nMulti-Channel Social Growth\nDedicated Account Manager\nWeekly Performance Audits',
    plan3_name: 'Premium Plan',
    plan3_desc: 'Enterprise level digital transformation for market leaders.',
    plan3_price: '99.00',
    plan3_features: 'Full Suite Custom Digital Solutions\nDedicated Team of Engineers\nContinuous Conversion Optimization\nPriority 1-Hour SLA Support\nUnlimited Maintenance & Updates'
  });

  const parseFeatures = (text: string | string[]) => {
    if (Array.isArray(text)) return text;
    if (!text) return [];
    return text.split('\n').map(s => s.trim()).filter(Boolean);
  };

  const plans = [
    {
      name: content.plan1_name || 'Basic Plan',
      desc: content.plan1_desc || 'Ideal for growing businesses looking to expand online presence.',
      price: content.plan1_price || '29.00',
      period: '/Per Month',
      popular: false,
      features: parseFeatures(content.plan1_features)
    },
    {
      name: content.plan2_name || 'Standard Plan',
      desc: content.plan2_desc || 'Best value for scaling businesses wanting aggressive online growth.',
      price: content.plan2_price || '49.00',
      period: '/Per Month',
      popular: true,
      badge: content.plan2_badge || 'Popular Choice',
      features: parseFeatures(content.plan2_features)
    },
    {
      name: content.plan3_name || 'Premium Plan',
      desc: content.plan3_desc || 'Enterprise level digital transformation for market leaders.',
      price: content.plan3_price || '99.00',
      period: '/Per Month',
      popular: false,
      features: parseFeatures(content.plan3_features)
    }
  ];

  return (
    <section id="pricing" className="py-24 sm:py-32 bg-black relative overflow-hidden border-t border-white/5">
      {/* Background radial highlight */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#e5432e]/5 rounded-full blur-[160px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Header */}
        <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
          <div className="inline-flex items-center gap-2 bg-[#1B1B1B] border border-white/10 rounded-full px-4 py-1.5 mb-5">
            <span className="w-2 h-2 rounded-full bg-[#e5432e]" />
            <span className="text-xs sm:text-sm font-semibold tracking-wider text-zinc-300 uppercase">
              {content.pricing_badge || 'Our Pricing Plan'}
            </span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
            {content.pricing_heading || 'Choose the right plan for you'}
          </h2>
          <p className="mt-4 text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
            {content.pricing_desc ||
              "Explore flexible pricing options designed to suit businesses of all sizes and needs. Whether you're just starting out or looking to scale."}
          </p>
        </div>

        {/* 3 Pricing Cards */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-stretch">
          {plans.map((plan, index) => {
            const isPopular = plan.popular;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className={`relative rounded-3xl p-8 sm:p-9 flex flex-col justify-between transition-all duration-300 ${
                  isPopular
                    ? 'bg-[#161619] border-2 border-[#e5432e] shadow-2xl shadow-[#e5432e]/10 lg:-translate-y-3'
                    : 'bg-[#121214] border border-white/10 hover:border-white/25'
                }`}
              >
                {/* Popular Pill Badge */}
                {isPopular && (
                  <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-[#e5432e] text-white text-xs font-extrabold uppercase px-4 py-1 rounded-full shadow-md flex items-center gap-1.5">
                    <Sparkles size={12} />
                    <span>{plan.badge || 'Popular Choice'}</span>
                  </div>
                )}

                <div>
                  <div className="mb-6">
                    <h3 className="text-2xl font-bold text-white mb-2 tracking-tight">
                      {plan.name}
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">
                      {plan.desc}
                    </p>
                  </div>

                  {/* Price display */}
                  <div className="flex items-baseline gap-1 mb-8 pb-8 border-b border-white/10">
                    <span className="text-2xl font-bold text-zinc-400">$</span>
                    <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight">
                      {plan.price}
                    </span>
                    <span className="text-sm font-medium text-zinc-400 ml-1">
                      {plan.period}
                    </span>
                  </div>

                  {/* Feature Checklist */}
                  <ul className="space-y-4 mb-8">
                    {plan.features.map((feat, fIdx) => (
                      <li key={fIdx} className="flex items-start gap-3">
                        <div className="w-5 h-5 rounded-full bg-[#e5432e]/15 text-[#e5432e] flex items-center justify-center flex-shrink-0 mt-0.5">
                          <Check size={13} strokeWidth={3} />
                        </div>
                        <span className="text-sm sm:text-base text-zinc-300 leading-snug">
                          {feat}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                {/* Card Button */}
                <div className="pt-4">
                  <Link
                    to="/request-service"
                    className={`w-full group inline-flex items-center justify-center gap-2 px-6 py-4 rounded-full text-sm font-semibold transition-all duration-300 ${
                      isPopular
                        ? 'bg-[#e5432e] hover:bg-[#cc3622] text-white shadow-lg shadow-[#e5432e]/20'
                        : 'bg-[#1B1B1B] hover:bg-[#252528] text-white border border-white/10 hover:border-white/25'
                    }`}
                  >
                    <span>Choose A Plan</span>
                    <ArrowUpRight size={16} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>
    </section>
  );
}

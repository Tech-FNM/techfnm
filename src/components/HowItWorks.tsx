import { motion } from 'motion/react';
import { ArrowUpRight, CheckCircle2, Compass, Layers, Rocket } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageContent } from '../lib/cmsContent';

export default function HowItWorks() {
  const content = usePageContent('page-home', {
    process_badge: 'How It Work',
    process_heading: 'Simple process that drives real business results',
    process_desc: 'Our streamlined process is designed to deliver clarity, efficiency helping your business grow without unnecessary complexity.',
    process_btn_text: 'Get Started Now',
    process_btn_link: '/request-service',
    step1_num: 'Step - 01',
    step1_title: 'Discovery & Strategy',
    step1_desc: 'We carefully analyze your goals, target audience, and market trends to build a clear and effective roadmap.',
    step2_num: 'Step - 02',
    step2_title: 'Design & Development',
    step2_desc: 'Our specialists build bespoke, high-converting digital platforms with meticulous attention to detail.',
    step3_num: 'Step - 03',
    step3_title: 'Support & Growth',
    step3_desc: 'Continuous performance monitoring, conversion rate optimization, and agile scaling support.',
    process_image: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80'
  });

  const steps = [
    {
      num: content.step1_num || 'Step - 01',
      title: content.step1_title || 'Discovery & Strategy',
      desc: content.step1_desc || 'We carefully analyze your goals, target audience, and market trends to build a clear and effective roadmap.',
      icon: Compass
    },
    {
      num: content.step2_num || 'Step - 02',
      title: content.step2_title || 'Design & Development',
      desc: content.step2_desc || 'Our specialists build bespoke, high-converting digital platforms with meticulous attention to detail.',
      icon: Layers
    },
    {
      num: content.step3_num || 'Step - 03',
      title: content.step3_title || 'Support & Growth',
      desc: content.step3_desc || 'Continuous performance monitoring, conversion rate optimization, and agile scaling support.',
      icon: Rocket
    }
  ];

  return (
    <section className="py-24 sm:py-32 bg-black relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          {/* Left Column: Heading, Subtitle, Steps & CTA */}
          <div className="lg:col-span-7 flex flex-col">
            <div className="inline-flex items-center gap-2 bg-[#1B1B1B] border border-white/10 rounded-full px-4 py-1.5 mb-5 w-fit">
              <span className="w-2 h-2 rounded-full bg-[#e5432e]" />
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-zinc-300 uppercase">
                {content.process_badge || 'How It Work'}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
              {content.process_heading || 'Simple process that drives real business results'}
            </h2>

            <p className="text-base sm:text-lg text-zinc-400 font-normal leading-relaxed mb-10">
              {content.process_desc ||
                'Our streamlined process is designed to deliver clarity, efficiency helping your business grow without unnecessary complexity.'}
            </p>

            {/* 3 Step Cards */}
            <div className="space-y-4 sm:space-y-5 mb-10">
              {steps.map((step, idx) => {
                const Icon = step.icon;
                return (
                  <motion.div
                    key={idx}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.4, delay: idx * 0.1 }}
                    className="group bg-[#121214] border border-white/10 hover:border-[#e5432e]/40 p-6 sm:p-7 rounded-2xl transition-all duration-300 flex items-start gap-4 sm:gap-6 hover:shadow-lg hover:shadow-[#e5432e]/5"
                  >
                    <div className="w-12 h-12 rounded-xl bg-[#1B1B1B] border border-white/10 flex items-center justify-center text-[#e5432e] group-hover:bg-[#e5432e] group-hover:text-white transition-all duration-300 flex-shrink-0 mt-0.5">
                      <Icon size={22} />
                    </div>
                    <div>
                      <div className="flex items-center gap-3 mb-1.5">
                        <span className="text-xs font-mono font-bold text-[#e5432e] uppercase tracking-wider">
                          {step.num}
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold text-white tracking-tight">
                          {step.title}
                        </h3>
                      </div>
                      <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                        {step.desc}
                      </p>
                    </div>
                  </motion.div>
                );
              })}
            </div>

            {/* CTA Button */}
            <div>
              <Link
                to={content.process_btn_link || '/request-service'}
                className="group inline-flex items-center gap-3 bg-[#e5432e] hover:bg-[#cc3622] text-white px-7 py-3.5 rounded-full text-sm sm:text-base font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-[#e5432e]/20"
              >
                <span>{content.process_btn_text || 'Get Started Now'}</span>
                <span className="w-7 h-7 rounded-full bg-white text-[#e5432e] flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight size={15} />
                </span>
              </Link>
            </div>
          </div>

          {/* Right Column: Visual Process Image */}
          <div className="lg:col-span-5 relative">
            <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-[#121214] shadow-2xl group">
              <img
                src={content.process_image || 'https://images.unsplash.com/photo-1531482615713-2afd69097998?auto=format&fit=crop&w=800&q=80'}
                alt="Process Strategy"
                className="w-full h-[450px] sm:h-[550px] object-cover filter brightness-90 transition-transform duration-700 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent" />

              {/* Floating Badge on Image */}
              <div className="absolute bottom-6 left-6 right-6 bg-[#121214]/90 backdrop-blur-xl border border-white/15 p-5 rounded-2xl flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#e5432e] text-white flex items-center justify-center flex-shrink-0">
                  <CheckCircle2 size={24} />
                </div>
                <div>
                  <div className="text-white font-bold text-base">Agile Execution</div>
                  <div className="text-xs text-zinc-400 mt-0.5">Weekly sprint updates and continuous delivery</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

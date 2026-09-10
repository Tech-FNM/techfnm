import { motion } from 'motion/react';
import {
  Sparkles,
  ArrowRight,
  CheckCircle2,
  Target,
  Eye,
  Layers,
  Code,
  Smartphone,
  Globe,
  PenTool,
  ShoppingCart,
  Share2,
  Shield,
  Zap,
  TrendingUp,
  Award,
  BarChart3,
  Check,
  Building,
  Stethoscope,
  Home,
  Briefcase,
  Wrench,
  GraduationCap,
  UtensilsCrossed,
  Cpu
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SeoHead from '../../components/SeoHead';
import { usePageContent } from '../../lib/cmsContent';

export default function AboutPage() {
  const content = usePageContent('page-about', {
    hero_badge: 'ABOUT TECHFNM',
    hero_title: 'Digital Agency Where Strategy, Design, and Performance Work Together',
    hero_desc: "We don't just build websites or run ads — we build digital engines that turn clicks into clients, visitors into buyers, and ideas into market leaders.",
    hero_cta1_text: 'Start Your Project',
    hero_cta1_link: '/request-service',
    hero_cta2_text: 'Explore Our Work',
    hero_cta2_link: '/portfolio',
    hero_stat1_num: '3,000+',
    hero_stat1_lbl: 'Businesses Served Globally',
    hero_stat2_num: '4.9/5',
    hero_stat2_lbl: 'Client Rating',
    hero_stat3_num: 'Since 2023',
    hero_stat3_lbl: 'Continuous Innovation',
    hero_image: 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80',

    stat1_val: '3,000+',
    stat1_lbl: 'Businesses Served Globally',
    stat2_val: '50+',
    stat2_lbl: 'Industries Transformed',
    stat3_val: '2023',
    stat3_lbl: 'Established & Scaling',
    stat4_val: '4.9',
    stat4_lbl: 'Client Satisfaction Rating',
    stat5_val: '95%',
    stat5_lbl: 'Client Retention & Growth',

    story_badge: 'WHO WE ARE',
    story_heading: 'The People Behind Every Pixel and Profitable Click',
    story_p1: 'TechFNM is a specialized digital transformation agency where analytical strategy, luxury design, and full-stack engineering work in total harmony. We eliminate the guesswork from digital growth.',
    story_p2: 'Unlike traditional agencies that pass clients between endless account managers, at TechFNM you collaborate directly with senior designers and engineers who care deeply about your business metrics.',
    pill1_title: 'Strategy-First',
    pill1_desc: "We don't touch a pixel before thoroughly understanding your revenue model and growth targets.",
    pill2_title: 'Conversion-Focused',
    pill2_desc: 'Every design choice and code architecture is engineered to convert casual visitors into high-value clients.',
    pill3_title: 'Long-Term Partner',
    pill3_desc: 'We act as your dedicated engineering arm, refining and scaling your digital assets continuously.',
    story_image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80',
    story_exp_years: '5+',
    story_exp_text: 'Years Delivering Digital Excellence',

    mission_badge: 'PURPOSE & TRAJECTORY',
    mission_title: 'Our Mission',
    mission_text: 'To eliminate the guesswork in digital growth by providing modern enterprises with high-conversion software, custom web solutions, and measurable revenue acceleration.',
    vision_title: 'Our Vision',
    vision_text: 'To be the premier engineering partner for modern digital enterprises worldwide, recognized for unrivaled technical craftsmanship and transparent execution.',

    process_badge: 'THE PROCESS',
    process_heading: 'How We Turn Your Idea Into Real, Measurable Growth',
    process_desc: 'A battle-tested 4-step framework engineered for zero wasted budget and maximum speed to market.',
    step1_title: '1. Deep Discovery & Technical Audit',
    step1_desc: 'We dissect your business model, competitors, and revenue goals to uncover high-impact growth opportunities.',
    step2_title: '2. Strategic Roadmap & Architecture',
    step2_desc: 'We architect interactive wireframes, database models, and conversion pathways before writing a single line of code.',
    step3_title: '3. Precision Engineering & Agile Build',
    step3_desc: 'Senior full-stack developers build your solution using modern frameworks with zero bloat and clean, maintainable code.',
    step4_title: '4. Launch, Scale & Continuous Optimization',
    step4_desc: 'We execute zero-downtime deployment, SEO indexing, and telemetry tracking for compounding month-over-month ROI.',

    ind_badge: 'INDUSTRIES WE SERVE',
    ind_heading: 'Tailored Solutions for Every High-Growth Industry',
    ind_desc: 'We bring deep domain-specific knowledge to your project, understanding exactly what converts in your market.',

    why_badge: 'WHY TECHFNM',
    why_heading: 'Why Ambitious Brands Partner With TechFNM',
    diff1_title: 'Direct Founder & Engineer Access',
    diff1_desc: 'No account managers or junior liaisons. You speak directly to the technical architects building your product.',
    diff2_title: 'Transparent Milestones & No BS',
    diff2_desc: 'Clear bi-weekly deliverables, real-time code visibility, and accurate timelines with zero excuses.',
    diff3_title: 'Modern Architecture & Fast Stacks',
    diff3_desc: 'We build with React, Next.js, and cloud backends—giving you unmatched speed, security, and scalability.',
    diff4_title: '100% Code & Asset Ownership',
    diff4_desc: 'You retain complete ownership of all repositories, domains, designs, and credentials from day one.',
    diff_quote_text: 'TechFNM completely transformed our digital presence. Inbound qualified leads increased by over 300% in 90 days with seamless technical execution.',
    diff_quote_author: 'Alex Morgan',
    diff_quote_company: 'Managing Partner, Apex Ventures',

    founder_badge: 'LEADERSHIP',
    founder_heading: 'A Message From Our Leadership',
    founder_name: 'Naeem Haider',
    founder_role: 'Founder & Lead Technical Architect',
    founder_quote: 'We started TechFNM with a simple belief: businesses deserve digital partners who understand real engineering and business economics, not just pretty colors. We build tools that generate actual profit.',
    founder_image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',

    cta_badge: "LET'S BUILD SOMETHING EXTRAORDINARY",
    cta_heading: 'Ready to Scale Your Business With a Proven Digital Partner?',
    cta_desc: "Book a complimentary 30-minute discovery consultation. We'll analyze your digital footprint and present a custom growth blueprint.",
    cta_btn1_text: 'Start Your Project',
    cta_btn1_link: '/request-service',
    cta_btn2_text: 'Contact Our Team',
    cta_btn2_link: '/contact'
  });

  const fadeInUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.55, ease: 'easeOut' as const }
  };

  const industriesList = [
    { name: 'Healthcare & Clinics', desc: 'Medical practices, dental clinics & specialized health services.', icon: Stethoscope },
    { name: 'Real Estate & Living', desc: 'Luxury brokerage firms, property developers & listing portals.', icon: Home },
    { name: 'E-Commerce & Retail', desc: 'Direct-to-consumer high-growth stores & multi-vendor marketplaces.', icon: ShoppingCart },
    { name: 'Professional & Legal', desc: 'Law firms, financial advisers, consulting & corporate leaders.', icon: Briefcase },
    { name: 'Home & Trade Services', desc: 'Roofing, contractors, HVAC & local service emergency teams.', icon: Wrench },
    { name: 'SaaS & Tech Startups', desc: 'Cloud software MVPs, interactive dashboards & API engines.', icon: Cpu },
    { name: 'Hospitality & Dining', desc: 'Boutique hotels, gourmet dining & reservations engines.', icon: UtensilsCrossed },
    { name: 'Education & Training', desc: 'Online academies, certification programs & student LMS.', icon: GraduationCap }
  ];

  const coreServices = [
    { title: 'Full-Stack Web Development', desc: 'Lightning-fast React & Next.js architectures built for peak conversions.', icon: Code, link: '/services' },
    { title: 'Mobile App Engineering', desc: 'Native iOS & Android apps that engage users and scale effortlessly.', icon: Smartphone, link: '/services' },
    { title: 'Search Engine Optimization', desc: 'Dominating search keywords and local Google Business Profile visibility.', icon: Globe, link: '/services' },
    { title: 'High-Conversion UI/UX', desc: 'Clean, modern interfaces engineered around behavioral psychology.', icon: PenTool, link: '/services' },
    { title: 'E-Commerce Infrastructure', desc: 'Robust Shopify and custom stores built for high cart value and speed.', icon: ShoppingCart, link: '/services' },
    { title: 'Performance Ads & Funnels', desc: 'Data-driven paid media campaigns on Google and Meta that maximize ROI.', icon: Target, link: '/services' },
    { title: 'Brand Identity & Strategy', desc: 'Distinctive visual systems and positioning that command market authority.', icon: Award, link: '/services' },
    { title: 'Cloud & System Security', desc: 'Scalable cloud backends, database hardening, and automated CI/CD.', icon: Shield, link: '/services' }
  ];

  return (
    <div className="min-h-screen bg-[#070709] font-sans text-zinc-100 scroll-smooth overflow-x-hidden selection:bg-red-600 selection:text-white">
      <SeoHead pageId="about" />
      <Header />

      <main className="relative z-10 pt-24 lg:pt-28">
        {/* ── 1. HERO SECTION & TRUST BAR ── */}
        <section className="relative overflow-hidden border-b border-zinc-900/80 pb-20 pt-10 sm:pt-16">
          {/* Subtle Ambient Red Glows */}
          <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-red-600/10 blur-[140px] rounded-full" />
          <div className="pointer-events-none absolute right-0 top-1/3 w-[450px] h-[450px] bg-rose-900/10 blur-[130px] rounded-full" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-14 items-center">
              
              {/* Left Column: Heading & Value Proposition */}
              <div className="lg:col-span-7 space-y-6">
                <motion.div {...fadeInUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-red-500/10 border border-red-500/25 text-red-400 text-xs font-bold uppercase tracking-widest">
                  <Sparkles size={13} className="text-red-500" />
                  <span>{content.hero_badge || 'ABOUT TECHFNM'}</span>
                </motion.div>

                <motion.h1
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.1 }}
                  className="text-4xl sm:text-5xl lg:text-6xl font-black tracking-tight text-white leading-[1.1]"
                >
                  {content.hero_title || 'Digital Agency Where Strategy, Design, and Performance Work Together'}
                </motion.h1>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.2 }}
                  className="text-base sm:text-lg text-zinc-400 max-w-2xl leading-relaxed"
                >
                  {content.hero_desc || "We don't just build websites or run ads — we build digital engines that turn clicks into clients, visitors into buyers, and ideas into market leaders."}
                </motion.p>

                {/* CTA Action Buttons */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.3 }}
                  className="flex flex-wrap items-center gap-4 pt-2"
                >
                  <a
                    href={content.hero_cta1_link || '/request-service'}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-red-950/40 hover:shadow-red-900/60 transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <span>{content.hero_cta1_text || 'Start Your Project'}</span>
                    <ArrowRight size={16} />
                  </a>
                  <a
                    href={content.hero_cta2_link || '/portfolio'}
                    className="inline-flex items-center justify-center gap-2 px-7 py-3.5 rounded-xl bg-zinc-900/80 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-800 font-semibold text-sm transition-all hover:scale-[1.02] cursor-pointer"
                  >
                    <span>{content.hero_cta2_text || 'Explore Our Work'}</span>
                  </a>
                </motion.div>

                {/* Hero Trust Micro-Bar */}
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.65, delay: 0.4 }}
                  className="pt-6 border-t border-zinc-900 grid grid-cols-3 gap-4 max-w-lg"
                >
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-white">{content.hero_stat1_num || '3,000+'}</div>
                    <div className="text-[11px] text-zinc-500 font-medium">{content.hero_stat1_lbl || 'Businesses Served'}</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-white">{content.hero_stat2_num || '4.9/5'}</div>
                    <div className="text-[11px] text-zinc-500 font-medium">{content.hero_stat2_lbl || 'Client Rating'}</div>
                  </div>
                  <div>
                    <div className="text-xl sm:text-2xl font-black text-white">{content.hero_stat3_num || 'Since 2023'}</div>
                    <div className="text-[11px] text-zinc-500 font-medium">{content.hero_stat3_lbl || 'Continuous Innovation'}</div>
                  </div>
                </motion.div>
              </div>

              {/* Right Column: Hero Visual Asset */}
              <div className="lg:col-span-5 relative">
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.8, delay: 0.2 }}
                  className="relative rounded-3xl p-2.5 bg-gradient-to-b from-zinc-800/60 to-zinc-900/20 border border-zinc-800/80 shadow-2xl shadow-black/80"
                >
                  <div className="relative rounded-2xl overflow-hidden aspect-[4/3] bg-zinc-950">
                    <img
                      src={content.hero_image || 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80'}
                      alt="TechFNM Strategy & Engineering Team"
                      className="w-full h-full object-cover"
                      onError={(e: any) => {
                        e.target.src = 'https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1200&q=80';
                      }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
                    
                    {/* Floating Trust Card */}
                    <div className="absolute bottom-4 left-4 right-4 p-4 rounded-xl bg-zinc-950/90 backdrop-blur-md border border-zinc-800/90 flex items-center justify-between">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-lg bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-500 font-black">
                          FNM
                        </div>
                        <div>
                          <div className="text-xs font-bold text-white">Full-Service Digital Partner</div>
                          <div className="text-[11px] text-zinc-400">Strategy • Development • Growth</div>
                        </div>
                      </div>
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-500/10 border border-emerald-500/20 text-[10px] font-bold text-emerald-400">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                        Global Team
                      </span>
                    </div>
                  </div>
                </motion.div>
              </div>

            </div>
          </div>
        </section>

        {/* ── 2. METRIC RIBBON (5 HIGH-IMPACT STATS) ── */}
        <section className="relative py-12 bg-[#0a0a0d] border-b border-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 lg:gap-8">
              {[
                { val: content.stat1_val || '3,000+', lbl: content.stat1_lbl || 'Businesses Served' },
                { val: content.stat2_val || '50+', lbl: content.stat2_lbl || 'Industries Transformed' },
                { val: content.stat3_val || '2023', lbl: content.stat3_lbl || 'Established & Scaling' },
                { val: content.stat4_val || '4.9', lbl: content.stat4_lbl || 'Client Rating' },
                { val: content.stat5_val || '95%', lbl: content.stat5_lbl || 'Client Retention Rate' }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  {...fadeInUp}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="text-center p-4 rounded-2xl bg-zinc-900/30 border border-zinc-800/60 hover:border-red-600/40 transition-all"
                >
                  <div className="text-3xl sm:text-4xl font-black bg-gradient-to-r from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
                    {item.val}
                  </div>
                  <div className="text-xs text-zinc-400 font-medium mt-1 uppercase tracking-wider">
                    {item.lbl}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 3. WHO WE ARE & CULTURE SECTION ── */}
        <section className="py-20 lg:py-28 relative overflow-hidden border-b border-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Column: Visual Asset with Experience Badge */}
              <div className="lg:col-span-5 relative order-2 lg:order-1">
                <motion.div {...fadeInUp} className="relative rounded-3xl overflow-hidden border border-zinc-800 shadow-2xl bg-zinc-950">
                  <img
                    src={content.story_image || 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80'}
                    alt="Who We Are - TechFNM Agency"
                    className="w-full h-[460px] object-cover"
                    onError={(e: any) => {
                      e.target.src = 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=800&q=80';
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
                  
                  {/* Floating Experience Badge */}
                  <div className="absolute bottom-6 left-6 right-6 p-5 rounded-2xl bg-zinc-950/95 border border-zinc-800/90 shadow-2xl">
                    <div className="flex items-center gap-4">
                      <div className="text-4xl font-black text-red-500">
                        {content.story_exp_years || '5+'}
                      </div>
                      <div className="border-l border-zinc-800 pl-4">
                        <div className="text-xs font-bold text-white uppercase tracking-wider">
                          {content.story_exp_text || 'Years Delivering Digital Excellence'}
                        </div>
                        <div className="text-[11px] text-zinc-400 mt-0.5">
                          Trusted by fast-growing startups and enterprises.
                        </div>
                      </div>
                    </div>
                  </div>
                </motion.div>
              </div>

              {/* Right Column: Story Narrative & 3 Strategic Pillars */}
              <div className="lg:col-span-7 space-y-6 order-1 lg:order-2">
                <motion.div {...fadeInUp} className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider">
                  <span>{content.story_badge || 'WHO WE ARE'}</span>
                </motion.div>

                <motion.h2 {...fadeInUp} className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight">
                  {content.story_heading || 'The People Behind Every Pixel and Profitable Click'}
                </motion.h2>

                <motion.p {...fadeInUp} className="text-zinc-300 text-sm sm:text-base leading-relaxed">
                  {content.story_p1 || 'TechFNM is a specialized digital transformation agency where analytical strategy, luxury design, and full-stack engineering work in total harmony. We eliminate the guesswork from digital growth.'}
                </motion.p>

                <motion.p {...fadeInUp} className="text-zinc-400 text-sm leading-relaxed">
                  {content.story_p2 || 'Unlike traditional agencies that pass clients between endless account managers, at TechFNM you collaborate directly with senior designers and engineers who care deeply about your business metrics.'}
                </motion.p>

                {/* 3 Pillars List */}
                <div className="space-y-3.5 pt-2">
                  {[
                    { title: content.pill1_title || 'Strategy-First', desc: content.pill1_desc || "We don't touch a pixel before thoroughly understanding your revenue model and growth targets.", icon: Zap },
                    { title: content.pill2_title || 'Conversion-Focused', desc: content.pill2_desc || 'Every design choice and code architecture is engineered to convert casual visitors into high-value clients.', icon: Target },
                    { title: content.pill3_title || 'Long-Term Partner', desc: content.pill3_desc || 'We act as your dedicated engineering arm, refining and scaling your digital assets continuously.', icon: TrendingUp }
                  ].map((pill, idx) => {
                    const IconComp = pill.icon;
                    return (
                      <motion.div
                        key={idx}
                        {...fadeInUp}
                        transition={{ duration: 0.4, delay: idx * 0.1 }}
                        className="flex items-start gap-4 p-4 rounded-2xl bg-zinc-900/40 border border-zinc-800/80 hover:border-zinc-700 transition-all"
                      >
                        <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 shrink-0">
                          <IconComp size={18} />
                        </div>
                        <div>
                          <div className="text-sm font-bold text-white">{pill.title}</div>
                          <div className="text-xs text-zinc-400 mt-1 leading-relaxed">{pill.desc}</div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </div>

            </div>
          </div>
        </section>

        {/* ── 4. MISSION & VISION (DUAL CARDS) ── */}
        <section className="py-20 bg-[#09090c] border-b border-zinc-900 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-14 space-y-3">
              <span className="inline-block px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-red-400 text-xs font-bold uppercase tracking-wider">
                {content.mission_badge || 'PURPOSE & TRAJECTORY'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">Our Mission & Future Vision</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              {/* Mission Card */}
              <motion.div
                {...fadeInUp}
                className="p-8 sm:p-10 rounded-3xl bg-[#0f0f14] border border-zinc-800/80 relative overflow-hidden hover:border-red-600/40 transition-all shadow-xl group"
              >
                <div className="w-14 h-14 rounded-2xl bg-red-600/10 border border-red-500/30 flex items-center justify-center text-red-500 mb-6 group-hover:scale-110 transition-transform">
                  <Target size={26} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {content.mission_title || 'Our Mission'}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {content.mission_text || 'To eliminate the guesswork in digital growth by providing modern enterprises with high-conversion software, custom web solutions, and measurable revenue acceleration.'}
                </p>
                <div className="mt-6 flex items-center gap-2 text-red-500 text-xs font-bold">
                  <span>Guaranteed Execution</span>
                  <CheckCircle2 size={14} />
                </div>
              </motion.div>

              {/* Vision Card */}
              <motion.div
                {...fadeInUp}
                transition={{ duration: 0.55, delay: 0.1 }}
                className="p-8 sm:p-10 rounded-3xl bg-[#0f0f14] border border-zinc-800/80 relative overflow-hidden hover:border-red-600/40 transition-all shadow-xl group"
              >
                <div className="w-14 h-14 rounded-2xl bg-rose-600/10 border border-rose-500/30 flex items-center justify-center text-rose-400 mb-6 group-hover:scale-110 transition-transform">
                  <Eye size={26} />
                </div>
                <h3 className="text-2xl font-bold text-white mb-3">
                  {content.vision_title || 'Our Vision'}
                </h3>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {content.vision_text || 'To be the premier engineering partner for modern digital enterprises worldwide, recognized for unrivaled technical craftsmanship and transparent execution.'}
                </p>
                <div className="mt-6 flex items-center gap-2 text-rose-400 text-xs font-bold">
                  <span>Global Standard</span>
                  <Sparkles size={14} />
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── 5. WHAT WE DO (CORE SERVICES GRID) ── */}
        <section className="py-20 lg:py-28 border-b border-zinc-900 bg-[#070709]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="inline-block px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider">
                CORE CAPABILITIES
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                Everything You Need to Dominate Online
              </h2>
              <p className="text-zinc-400 text-sm">
                We eliminate the fragmentation of hiring multiple agencies. Every discipline is built in-house.
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {coreServices.map((srv, idx) => {
                const IconComp = srv.icon;
                return (
                  <motion.a
                    key={idx}
                    href={srv.link}
                    {...fadeInUp}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="p-6 rounded-2xl bg-[#0f0f13] border border-zinc-800/80 hover:border-red-600/50 hover:bg-[#13131a] transition-all group block"
                  >
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-500 group-hover:bg-red-600 group-hover:text-white transition-all mb-4">
                      <IconComp size={20} />
                    </div>
                    <h3 className="text-base font-bold text-white mb-2 group-hover:text-red-400 transition-colors">
                      {srv.title}
                    </h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">
                      {srv.desc}
                    </p>
                  </motion.a>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 6. OUR 4-STEP PROCESS ROADMAP ── */}
        <section className="py-20 lg:py-28 bg-[#0a0a0e] border-b border-zinc-900 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="inline-block px-3 py-1 rounded-full bg-zinc-900 border border-zinc-800 text-red-400 text-xs font-bold uppercase tracking-wider">
                {content.process_badge || 'THE PROCESS'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                {content.process_heading || 'How We Turn Your Idea Into Real, Measurable Growth'}
              </h2>
              <p className="text-zinc-400 text-sm">
                {content.process_desc || 'A battle-tested 4-step framework engineered for zero wasted budget and maximum speed to market.'}
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[
                { num: '01', title: content.step1_title || '1. Deep Discovery & Technical Audit', desc: content.step1_desc || 'We dissect your business model, competitors, and revenue goals to uncover high-impact growth opportunities.' },
                { num: '02', title: content.step2_title || '2. Strategic Roadmap & Architecture', desc: content.step2_desc || 'We architect interactive wireframes, database models, and conversion pathways before writing a single line of code.' },
                { num: '03', title: content.step3_title || '3. Precision Engineering & Agile Build', desc: content.step3_desc || 'Senior full-stack developers build your solution using modern frameworks with zero bloat and clean, maintainable code.' },
                { num: '04', title: content.step4_title || '4. Launch, Scale & Continuous Optimization', desc: content.step4_desc || 'We execute zero-downtime deployment, SEO indexing, and telemetry tracking for compounding month-over-month ROI.' }
              ].map((step, idx) => (
                <motion.div
                  key={idx}
                  {...fadeInUp}
                  transition={{ duration: 0.4, delay: idx * 0.08 }}
                  className="p-6 rounded-2xl bg-[#0f0f13] border border-zinc-800/80 hover:border-red-600/40 transition-all relative"
                >
                  <div className="text-3xl font-black text-red-500/30 mb-4 font-mono">
                    {step.num}
                  </div>
                  <h3 className="text-base font-bold text-white mb-2">
                    {step.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {step.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 7. INDUSTRIES WE KNOW INSIDE & OUT ── */}
        <section className="py-20 lg:py-28 border-b border-zinc-900 bg-[#070709]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
              <span className="inline-block px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider">
                {content.ind_badge || 'INDUSTRIES WE SERVE'}
              </span>
              <h2 className="text-3xl sm:text-4xl font-black text-white">
                {content.ind_heading || 'Tailored Solutions for Every High-Growth Industry'}
              </h2>
              <p className="text-zinc-400 text-sm">
                {content.ind_desc || 'We bring deep domain-specific knowledge to your project, understanding exactly what converts in your market.'}
              </p>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
              {industriesList.map((ind, idx) => {
                const IconComp = ind.icon;
                return (
                  <motion.div
                    key={idx}
                    {...fadeInUp}
                    transition={{ duration: 0.4, delay: idx * 0.05 }}
                    className="p-6 rounded-2xl bg-[#0f0f13] border border-zinc-800/80 hover:border-zinc-700 transition-all"
                  >
                    <div className="w-10 h-10 rounded-xl bg-zinc-900 border border-zinc-800 flex items-center justify-center text-red-400 mb-4">
                      <IconComp size={18} />
                    </div>
                    <h3 className="text-sm font-bold text-white mb-1.5">{ind.name}</h3>
                    <p className="text-xs text-zinc-400 leading-relaxed">{ind.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* ── 8. WHY BUSINESSES CHOOSE US & VERIFIED QUOTE ── */}
        <section className="py-20 lg:py-28 bg-[#0a0a0e] border-b border-zinc-900 relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
              
              {/* Left Column: 4 Key Differentiators */}
              <div className="lg:col-span-7 space-y-6">
                <span className="inline-block px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider">
                  {content.why_badge || 'WHY TECHFNM'}
                </span>
                <h2 className="text-3xl sm:text-4xl font-black text-white leading-tight">
                  {content.why_heading || 'Why Ambitious Brands Partner With TechFNM'}
                </h2>

                <div className="space-y-4 pt-2">
                  {[
                    { title: content.diff1_title || 'Direct Founder & Engineer Access', desc: content.diff1_desc || 'No account managers or junior liaisons. You speak directly to the technical architects building your product.' },
                    { title: content.diff2_title || 'Transparent Milestones & No BS', desc: content.diff2_desc || 'Clear bi-weekly deliverables, real-time code visibility, and accurate timelines with zero excuses.' },
                    { title: content.diff3_title || 'Modern Architecture & Fast Stacks', desc: content.diff3_desc || 'We build with React, Next.js, and cloud backends—giving you unmatched speed, security, and scalability.' },
                    { title: content.diff4_title || '100% Code & Asset Ownership', desc: content.diff4_desc || 'You retain complete ownership of all repositories, domains, designs, and credentials from day one.' }
                  ].map((diff, idx) => (
                    <motion.div
                      key={idx}
                      {...fadeInUp}
                      transition={{ duration: 0.35, delay: idx * 0.08 }}
                      className="flex items-start gap-3.5 p-4 rounded-xl bg-zinc-900/30 border border-zinc-800/70"
                    >
                      <Check className="text-emerald-400 shrink-0 mt-0.5" size={18} />
                      <div>
                        <div className="text-sm font-bold text-white">{diff.title}</div>
                        <div className="text-xs text-zinc-400 mt-1 leading-relaxed">{diff.desc}</div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>

              {/* Right Column: Highlighted Client Quote Card */}
              <div className="lg:col-span-5">
                <motion.div
                  {...fadeInUp}
                  className="p-8 sm:p-10 rounded-3xl bg-gradient-to-br from-[#121218] to-[#0a0a0e] border border-zinc-800 shadow-2xl relative"
                >
                  <div className="flex gap-1 text-amber-400 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <span key={i} className="text-base">★</span>
                    ))}
                  </div>

                  <blockquote className="text-base sm:text-lg text-zinc-200 font-medium italic leading-relaxed mb-6">
                    "{content.diff_quote_text || 'TechFNM completely transformed our digital presence. Inbound qualified leads increased by over 300% in 90 days with seamless technical execution.'}"
                  </blockquote>

                  <div className="border-t border-zinc-800 pt-5 flex items-center gap-3.5">
                    <div className="w-11 h-11 rounded-full bg-red-600/20 border border-red-500/30 flex items-center justify-center text-red-400 font-bold text-sm">
                      {content.diff_quote_author?.charAt(0) || 'A'}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">{content.diff_quote_author || 'Alex Morgan'}</div>
                      <div className="text-xs text-zinc-400">{content.diff_quote_company || 'Managing Partner, Apex Ventures'}</div>
                    </div>
                  </div>
                </motion.div>
              </div>

            </div>
          </div>
        </section>

        {/* ── 9. FOUNDER & LEADERSHIP SPOTLIGHT ── */}
        <section className="py-20 lg:py-28 border-b border-zinc-900 bg-[#070709] relative">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="p-8 sm:p-12 rounded-3xl bg-[#0e0e13] border border-zinc-800/90 shadow-2xl">
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-center">
                
                {/* Leader Portrait */}
                <div className="lg:col-span-4 flex justify-center">
                  <div className="relative w-52 h-52 sm:w-64 sm:h-64 rounded-3xl overflow-hidden border-2 border-red-600/40 shadow-2xl shadow-red-950/40 bg-zinc-900">
                    <img
                      src={content.founder_image || 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80'}
                      alt={content.founder_name || 'Naeem Haider'}
                      className="w-full h-full object-cover"
                      onError={(e: any) => {
                        e.target.src = 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80';
                      }}
                    />
                  </div>
                </div>

                {/* Leader Manifesto */}
                <div className="lg:col-span-8 space-y-4">
                  <span className="inline-block px-3 py-1 rounded-full bg-red-500/10 border border-red-500/20 text-red-400 text-xs font-bold uppercase tracking-wider">
                    {content.founder_badge || 'LEADERSHIP'}
                  </span>
                  <h3 className="text-2xl sm:text-3xl font-black text-white">
                    {content.founder_heading || 'A Message From Our Leadership'}
                  </h3>
                  <p className="text-zinc-300 text-sm sm:text-base leading-relaxed italic">
                    "{content.founder_quote || 'We started TechFNM with a simple belief: businesses deserve digital partners who understand real engineering and business economics, not just pretty colors. We build tools that generate actual profit.'}"
                  </p>
                  <div className="pt-2">
                    <div className="text-base font-bold text-white">{content.founder_name || 'Naeem Haider'}</div>
                    <div className="text-xs text-red-400 font-medium">{content.founder_role || 'Founder & Lead Technical Architect'}</div>
                  </div>
                </div>

              </div>
            </div>
          </div>
        </section>

        {/* ── 10. CLOSING PROJECT CTA BANNER ── */}
        <section className="py-20 lg:py-28 relative overflow-hidden bg-gradient-to-b from-[#0a0a0f] to-black">
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[350px] bg-red-600/15 blur-[140px] rounded-full" />
          
          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <motion.div {...fadeInUp} className="inline-block px-3.5 py-1.5 rounded-full bg-red-500/15 border border-red-500/30 text-red-400 text-xs font-bold uppercase tracking-wider">
              {content.cta_badge || "LET'S BUILD SOMETHING EXTRAORDINARY"}
            </motion.div>

            <motion.h2 {...fadeInUp} className="text-3xl sm:text-5xl font-black text-white tracking-tight max-w-3xl mx-auto leading-tight">
              {content.cta_heading || 'Ready to Scale Your Business With a Proven Digital Partner?'}
            </motion.h2>

            <motion.p {...fadeInUp} className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              {content.cta_desc || "Book a complimentary 30-minute discovery consultation. We'll analyze your digital footprint and present a custom growth blueprint."}
            </motion.p>

            <motion.div {...fadeInUp} className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <a
                href={content.cta_btn1_link || '/request-service'}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-sm shadow-xl shadow-red-950/40 hover:scale-[1.03] transition-all cursor-pointer"
              >
                <span>{content.cta_btn1_text || 'Start Your Project'}</span>
                <ArrowRight size={16} />
              </a>
              <a
                href={content.cta_btn2_link || '/contact'}
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-800 font-semibold text-sm hover:scale-[1.03] transition-all cursor-pointer"
              >
                <span>{content.cta_btn2_text || 'Contact Our Team'}</span>
              </a>
            </motion.div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

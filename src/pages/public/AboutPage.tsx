import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link } from 'react-router-dom';
import {
  ArrowRight,
  ArrowUpRight,
  Play,
  X,
  Plus,
  Minus,
  ChevronLeft,
  ChevronRight,
  Star,
  CheckCircle2,
  Sparkles,
  Users,
  Target,
  Zap,
  TrendingUp,
  Award
} from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SeoHead from '../../components/SeoHead';
import { usePageContent } from '../../lib/cmsContent';

const GMB_LINK = 'https://share.google/LRx2Rpfx8ATZzfWyH';

export default function AboutPage() {
  const content = usePageContent('page-about', {
    hero_title: 'About Us',
    hero_breadcrumb: 'Home / About Us',
    intro_badge: 'About Us',
    intro_heading: 'Dedicated expert working together to create impactful digital solutions and results',
    intro_exp_years: '25+',
    intro_exp_title: 'Year Digital Experience',
    intro_exp_desc: 'Years of Professional Experience in Digital Strategy, Design, and Marketing',
    intro_desc: 'We help businesses build a strong and impactful digital presence through creative strategies and innovative solutions tailored to their goals.',
    
    drives_badge: 'What Drives Us',
    drives_heading: 'Our purpose & direction',
    drives_desc: 'From strategy to execution, we focus on driving impactful outcomes that support your business expansion and long-term success.',
    
    mission_title: 'Our Mission',
    mission_desc: 'Our mission is to empower businesses with innovative digital solutions that enhance brand visibility, engage audiences, and drive sustainable long-term growth.',
    
    values_title: 'Our Values',
    values_desc: 'Our values are rooted in creativity, integrity, and relentless engineering innovation.',
    
    video_badge: 'Watch Our Story',
    video_heading: 'Discover the story behind our digital creativity',
    video_url: 'https://www.youtube.com/embed/Y-x0efG1seA?autoplay=1',
    
    features_badge: 'Our Core Features',
    features_heading: 'Smart digital strategy that deliver real results',
    features_desc: 'We combine creativity, technology, and strategic thinking to deliver digital solutions that help businesses grow and succeed online.',
    
    faq_badge: 'Frequently Asked Questions',
    faq_heading: 'Find helpful answers about our services & process',
    faq_desc: 'Explore our frequently asked questions to find helpful answers about our services, working process, and digital solutions.',
    
    testimonials_badge: 'Google Reviews',
    testimonials_heading: '5.0 Stars Rated on Google Business',
    testimonials_desc: 'Businesses trust Tech FNM to deliver high-performance digital engineering, web development, and measurable marketing ROI.',
    
    cta_badge: "LET'S BUILD SOMETHING EXTRAORDINARY",
    cta_heading: 'Ready to transform your digital presence? Let’s start digital growth',
    cta_desc: 'Book a complimentary 30-minute discovery consultation. We will analyze your digital footprint and architect a custom growth blueprint.'
  });

  // State for Video Modal
  const [isVideoOpen, setIsVideoOpen] = useState(false);

  // State for FAQ Accordion
  const [openFaq, setOpenFaq] = useState<number | null>(0);

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index);
  };

  // State for Testimonials Slider
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: 'ARK Roofing',
      role: 'Verified Google Review • Business Client',
      avatar: 'https://lh3.googleusercontent.com/a/ACg8ocJebTZef1PlAZ2KlnBvVinAYyAookncycfnwHyxCli_auWdeQ=w120-h120-p-rp-mo-br100',
      rating: 5,
      quote:
        "Honestly couldn't be happier with Tech FNM. Our site's stats are trending up continuously, and the guys are super friendly and responsive."
    },
    {
      name: 'Maroofa Mazher Ali',
      role: 'Verified Google Review • SEO & Web Client',
      avatar: 'https://lh3.googleusercontent.com/a/ACg8ocKs2DdJeBpkGCIYeU9nhyi8ZwqilMDD-tpaxKM0g26WQJ8htg=w120-h120-p-rp-mo-br100',
      rating: 5,
      quote:
        'Best team to handle web stuff and SEO! They actually get results without making things complicated. Super happy with their work.'
    },
    {
      name: 'Umais Gora',
      role: 'Verified Google Review • Client',
      avatar: 'https://lh3.googleusercontent.com/a/ACg8ocJ8LZrpGJ423x17SElxqvKDzVTHVuvDO-X_aiAjP8K_ccwC4g=w120-h120-p-rp-mo-br100',
      rating: 5,
      quote:
        'Had a really good experience with Tech FNM. The team was friendly, professional, and easy to communicate with. They understood what I needed and got the work done smoothly.'
    }
  ];

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev === 0 ? testimonials.length - 1 : prev - 1));
  };

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev === testimonials.length - 1 ? 0 : prev + 1));
  };

  // Auto-advance testimonial slider every 7 seconds
  useEffect(() => {
    const timer = setInterval(() => {
      nextTestimonial();
    }, 7000);
    return () => clearInterval(timer);
  }, []);

  const faqs = [
    {
      q: 'What services does your digital agency offer?',
      a: 'Our agency delivers comprehensive end-to-end digital solutions, including custom high-performance web development, mobile app engineering, SEO acceleration, luxury UI/UX design, cloud infrastructure, and data-driven PPC marketing campaigns.'
    },
    {
      q: 'How long does it take to complete a website project?',
      a: 'A bespoke high-converting website typically takes 2 to 4 weeks from discovery to deployment. For enterprise applications or complex custom software, we execute with bi-weekly milestone sprints to guarantee transparent, on-time delivery.'
    },
    {
      q: 'Do you work with startups and small businesses?',
      a: 'Yes, absolutely! We partner with ambitious early-stage startups as well as established global brands, tailoring our engineering and growth strategies to meet your exact budget and scaling requirements.'
    },
    {
      q: 'How can I start a project with your agency?',
      a: 'Getting started is seamless. Simply click "Start Your Project" or schedule a 30-minute discovery consultation. Our technical lead will audit your requirements and deliver a actionable project roadmap within 24 hours.'
    },
    {
      q: 'Can you redesign an existing website?',
      a: 'Yes. We specialize in modernizing outdated websites into sleek, lightning-fast React and Next.js applications engineered for maximum conversion, top Google rankings, and seamless user experiences.'
    }
  ];

  // Brand logos for ticker
  const brandLogos = [
    { name: 'Google Cloud', logo: 'https://demo.awaikenthemes.com/fexora/wp-content/uploads/2026/05/company-supports-logo-1-prime.svg' },
    { name: 'Shopify Plus', logo: 'https://demo.awaikenthemes.com/fexora/wp-content/uploads/2026/05/company-supports-logo-2-prime.svg' },
    { name: 'Webflow', logo: 'https://demo.awaikenthemes.com/fexora/wp-content/uploads/2026/05/company-supports-logo-3-prime.svg' },
    { name: 'Stripe', logo: 'https://demo.awaikenthemes.com/fexora/wp-content/uploads/2026/05/company-supports-logo-4-prime.svg' },
    { name: 'Amazon AWS', logo: 'https://demo.awaikenthemes.com/fexora/wp-content/uploads/2026/05/company-supports-logo-5-prime.svg' },
    { name: 'Meta Marketing', logo: 'https://demo.awaikenthemes.com/fexora/wp-content/uploads/2026/05/company-supports-logo-6-prime.svg' }
  ];

  const marqueeSkills = [
    'User Experience',
    'Web Development',
    'Growth Strategy',
    'Innovation Driven',
    'Custom Software',
    'Performance Ads',
    'Brand Identity'
  ];

  const fadeInUp = {
    initial: { opacity: 0, y: 24 },
    whileInView: { opacity: 1, y: 0 },
    viewport: { once: true, margin: '-60px' },
    transition: { duration: 0.5, ease: 'easeOut' as const }
  };

  return (
    <div className="min-h-screen bg-[#070709] text-zinc-100 font-sans selection:bg-[#e5432e] selection:text-white overflow-x-hidden">
      <SeoHead pageId="about" />
      <Header />

      <main className="relative z-10 pt-24 lg:pt-28">
        {/* ── 1. HERO BREADCRUMB BANNER ── */}
        <section className="relative py-16 sm:py-24 overflow-hidden border-b border-white/[0.08] bg-black">
          {/* Ambient Glows */}
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[350px] bg-[#e5432e]/12 blur-[140px] rounded-full" />
          <div className="pointer-events-none absolute right-10 top-0 w-80 h-80 bg-rose-900/10 blur-[120px] rounded-full" />

          <div className="relative z-10 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <motion.h1
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="text-4xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight"
            >
              {content.hero_title || 'About Us'}
            </motion.h1>

            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.15 }}
              className="flex items-center justify-center gap-2 mt-4 text-sm font-medium text-zinc-400"
            >
              <Link to="/" className="hover:text-white transition-colors">
                Home
              </Link>
              <span className="text-zinc-600">/</span>
              <span className="text-[#e5432e]">About Us</span>
            </motion.div>
          </div>
        </section>

        {/* ── 2. ABOUT US INTRO SECTION (FEXORA STYLE) ── */}
        <section className="py-20 sm:py-28 relative overflow-hidden bg-[#070709] border-b border-white/[0.08]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Top Badge & Main Headline */}
            <div className="max-w-4xl mb-14 sm:mb-20">
              <motion.div {...fadeInUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-bold tracking-wider text-zinc-300 uppercase mb-5">
                <span className="w-2 h-2 rounded-full bg-[#e5432e]" />
                <span>{content.intro_badge || 'About Us'}</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.65, delay: 0.1 }}
                className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight leading-[1.15]"
              >
                {content.intro_heading ||
                  'Dedicated expert working together to create impactful digital solutions and results'}
              </motion.h2>
            </div>

            {/* Split Content Row: Metric Experience + Narrative & Rotating Badge */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-14 items-center">
              {/* Left Column: Big Stat Highlight Box */}
              <motion.div
                {...fadeInUp}
                className="lg:col-span-5 p-8 sm:p-10 rounded-3xl bg-[#0f0f13] border border-white/10 relative overflow-hidden group hover:border-[#e5432e]/40 transition-all duration-300"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#e5432e]/10 blur-2xl rounded-full" />
                <div className="text-5xl sm:text-6xl font-black text-white tracking-tight mb-3">
                  {content.intro_exp_years || '25+'}
                </div>
                <div className="text-lg sm:text-xl font-bold text-white mb-2">
                  {content.intro_exp_title || 'Year Digital Experience'}
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed">
                  {content.intro_exp_desc ||
                    'Years of Professional Experience in Digital Strategy, Design, and Marketing.'}
                </p>

                <div className="mt-8 pt-6 border-t border-white/5 flex items-center justify-between">
                  <span className="text-xs font-semibold uppercase tracking-wider text-zinc-500">
                    Proven Track Record
                  </span>
                  <span className="w-8 h-8 rounded-full bg-[#e5432e]/20 text-[#e5432e] flex items-center justify-center font-bold text-xs">
                    ✓
                  </span>
                </div>
              </motion.div>

              {/* Right Column: Paragraph + Rotating Badge + Trust Score */}
              <div className="lg:col-span-7 space-y-8">
                <motion.p
                  {...fadeInUp}
                  className="text-base sm:text-lg text-zinc-300 leading-relaxed"
                >
                  {content.intro_desc ||
                    'We help businesses build a strong and impactful digital presence through creative strategies and innovative solutions tailored to their goals.'}
                </motion.p>

                <div className="flex flex-wrap items-center gap-8 pt-2">
                  {/* Rotating Circular Text Badge */}
                  <Link
                    to="/contact"
                    className="relative group w-28 h-28 flex items-center justify-center cursor-pointer shrink-0"
                  >
                    <div className="absolute inset-0 rounded-full border border-white/10 group-hover:border-[#e5432e] transition-colors" />
                    <svg
                      className="w-full h-full animate-[spin_16s_linear_infinite]"
                      viewBox="0 0 100 100"
                    >
                      <path
                        id="contactBadgePath"
                        d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                        fill="none"
                      />
                      <text className="text-[9.5px] uppercase font-bold tracking-[0.24em] fill-zinc-400 group-hover:fill-[#e5432e] transition-colors">
                        <textPath href="#contactBadgePath">
                          • CONTACT US • CONTACT US •
                        </textPath>
                      </text>
                    </svg>
                    <div className="w-10 h-10 rounded-full bg-[#e5432e] group-hover:bg-[#cc3622] text-white flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg shadow-[#e5432e]/30">
                      <ArrowUpRight size={18} />
                    </div>
                  </Link>

                  {/* Trust Rating Card linking to GMB */}
                  <a
                    href={GMB_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 sm:p-5 rounded-2xl bg-[#0f0f13] border border-white/10 hover:border-[#e5432e]/50 flex items-center gap-4 transition-all group cursor-pointer"
                  >
                    {/* Avatars Stack */}
                    <div className="flex -space-x-3 overflow-hidden">
                      {[
                        'https://lh3.googleusercontent.com/a/ACg8ocJebTZef1PlAZ2KlnBvVinAYyAookncycfnwHyxCli_auWdeQ=w120-h120-p-rp-mo-br100',
                        'https://lh3.googleusercontent.com/a/ACg8ocKs2DdJeBpkGCIYeU9nhyi8ZwqilMDD-tpaxKM0g26WQJ8htg=w120-h120-p-rp-mo-br100',
                        'https://lh3.googleusercontent.com/a/ACg8ocJ8LZrpGJ423x17SElxqvKDzVTHVuvDO-X_aiAjP8K_ccwC4g=w120-h120-p-rp-mo-br100'
                      ].map((img, i) => (
                        <img
                          key={i}
                          src={img}
                          alt="Google Reviewer"
                          className="w-10 h-10 rounded-full border-2 border-[#0f0f13] object-cover"
                        />
                      ))}
                    </div>

                    {/* Score & Stars */}
                    <div className="border-l border-white/10 pl-4">
                      <div className="flex items-center gap-1.5">
                        <span className="text-base font-black text-white group-hover:text-[#e5432e] transition-colors">5.0/5</span>
                        <div className="flex text-amber-400">
                          {[...Array(5)].map((_, i) => (
                            <Star key={i} size={12} fill="currentColor" stroke="none" />
                          ))}
                        </div>
                      </div>
                      <div className="text-xs text-zinc-400 mt-0.5 font-medium group-hover:text-zinc-200 transition-colors">
                        5.0 Rated on Google Reviews
                      </div>
                    </div>
                  </a>
                </div>
              </div>
            </div>

            {/* Client Logo Ticker */}
            <div className="mt-16 sm:mt-20 pt-10 border-t border-white/[0.08]">
              <div className="text-center mb-6 text-xs font-semibold tracking-widest uppercase text-zinc-500">
                Powered by Trusted Brand Partnerships
              </div>
              <div className="flex flex-wrap items-center justify-center gap-8 sm:gap-14 opacity-50 hover:opacity-100 transition-opacity">
                {brandLogos.map((brand, idx) => (
                  <div key={idx} className="flex items-center gap-2">
                    <img
                      src={brand.logo}
                      alt={brand.name}
                      className="h-7 w-auto max-w-[130px] object-contain filter grayscale hover:grayscale-0 transition-all"
                      onError={(e: any) => {
                        e.target.style.display = 'none';
                      }}
                    />
                    <span className="text-sm font-bold text-zinc-400 tracking-wide">
                      {brand.name}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── 3. WHAT DRIVES US (OUR PURPOSE & DIRECTION) ── */}
        <section className="py-20 sm:py-28 relative bg-black border-b border-white/[0.08]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="text-center max-w-3xl mx-auto mb-16 sm:mb-20">
              <motion.div {...fadeInUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-bold tracking-wider text-zinc-300 uppercase mb-4">
                <span className="w-2 h-2 rounded-full bg-[#e5432e]" />
                <span>{content.drives_badge || 'What Drives Us'}</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight"
              >
                {content.drives_heading || 'Our purpose & direction'}
              </motion.h2>

              <motion.p
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
                className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed"
              >
                {content.drives_desc ||
                  'From strategy to execution, we focus on driving impactful outcomes that support your business expansion and long-term success.'}
              </motion.p>
            </div>

            {/* 4-Item Purpose Bento Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
              {/* Card 1: Our Mission */}
              <motion.div
                {...fadeInUp}
                className="p-7 sm:p-8 rounded-3xl bg-[#0f0f13] border border-white/10 hover:border-[#e5432e]/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#1a1a22] border border-white/10 flex items-center justify-center text-[#e5432e] mb-6 group-hover:bg-[#e5432e] group-hover:text-white transition-all">
                    <Target size={22} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                    {content.mission_title || 'Our Mission'}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    {content.mission_desc ||
                      'Our mission is to empower businesses with innovative digital solutions that enhance brand visibility, engage audiences, and drive sustainable long-term growth.'}
                  </p>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-[#e5432e] text-xs font-bold">
                  <span>Guaranteed Execution</span>
                  <CheckCircle2 size={14} />
                </div>
              </motion.div>

              {/* Card 2: Our Values */}
              <motion.div
                {...fadeInUp}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="p-7 sm:p-8 rounded-3xl bg-[#0f0f13] border border-white/10 hover:border-[#e5432e]/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#1a1a22] border border-white/10 flex items-center justify-center text-[#e5432e] mb-6 group-hover:bg-[#e5432e] group-hover:text-white transition-all">
                    <Sparkles size={22} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                    {content.values_title || 'Our Values'}
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-4">
                    {content.values_desc ||
                      'Our values are rooted in creativity, integrity, and relentless engineering innovation.'}
                  </p>
                  <div className="flex flex-wrap gap-2">
                    {['Innovation', 'Integrity', 'Quality', 'Collaboration'].map((val, i) => (
                      <span
                        key={i}
                        className="px-2.5 py-1 rounded-full bg-white/5 text-[11px] font-semibold text-zinc-300 border border-white/10"
                      >
                        {val}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-zinc-500 text-xs font-semibold">
                  <span>02 • Core Principles</span>
                </div>
              </motion.div>

              {/* Card 3: Growth Capabilities */}
              <motion.div
                {...fadeInUp}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="p-7 sm:p-8 rounded-3xl bg-[#0f0f13] border border-white/10 hover:border-[#e5432e]/50 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#1a1a22] border border-white/10 flex items-center justify-center text-[#e5432e] mb-6 group-hover:bg-[#e5432e] group-hover:text-white transition-all">
                    <TrendingUp size={22} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                    Growth Mindset
                  </h3>
                  <div className="space-y-2.5">
                    {[
                      'Paid Advertising',
                      'Brand Strategy',
                      'Audience Targeting',
                      'Custom Digital Solutions'
                    ].map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2.5 text-xs font-medium text-zinc-300">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#e5432e]" />
                        <span>{item}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="mt-6 pt-4 border-t border-white/5 flex items-center gap-2 text-zinc-500 text-xs font-semibold">
                  <span>03 • Strategic Pillars</span>
                </div>
              </motion.div>

              {/* Card 4: Get Free Quote CTA */}
              <motion.div
                {...fadeInUp}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="p-7 sm:p-8 rounded-3xl bg-gradient-to-br from-[#1b1517] via-[#0f0f13] to-black border border-[#e5432e]/30 hover:border-[#e5432e] transition-all duration-300 flex flex-col justify-between relative overflow-hidden"
              >
                <div className="absolute top-0 right-0 w-32 h-32 bg-[#e5432e]/15 blur-2xl rounded-full pointer-events-none" />
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#e5432e]/20 border border-[#e5432e]/40 flex items-center justify-center text-[#e5432e] mb-6">
                    <Zap size={22} />
                  </div>
                  <h3 className="text-xl font-bold text-white mb-3 tracking-tight">
                    Let’s make something great work together
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed">
                    Have an ambitious project? We build tailored digital systems designed for high ROI.
                  </p>
                </div>

                <div className="pt-6">
                  <Link
                    to="/request-service"
                    className="inline-flex items-center justify-center gap-2 w-full py-3.5 px-5 rounded-xl bg-[#e5432e] hover:bg-[#cc3622] text-white font-bold text-sm shadow-lg shadow-[#e5432e]/30 transition-all hover:scale-[1.02]"
                  >
                    <span>Get Free Quote</span>
                    <ArrowRight size={16} />
                  </Link>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── 4. WATCH OUR STORY (VIDEO BANNER & INFINITE SKILL MARQUEE) ── */}
        <section className="py-20 sm:py-28 relative overflow-hidden bg-[#070709] border-b border-white/[0.08]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Header */}
            <div className="text-center max-w-3xl mx-auto mb-12 sm:mb-16">
              <motion.div {...fadeInUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-bold tracking-wider text-zinc-300 uppercase mb-4">
                <span className="w-2 h-2 rounded-full bg-[#e5432e]" />
                <span>{content.video_badge || 'Watch Our Story'}</span>
              </motion.div>

              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight"
              >
                {content.video_heading || 'Discover the story behind our digital creativity'}
              </motion.h2>
            </div>

            {/* Video Showcase Card with Ambient Backdrop */}
            <motion.div
              initial={{ opacity: 0, scale: 0.96 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 0.7 }}
              className="relative rounded-3xl overflow-hidden border border-white/10 bg-zinc-950 aspect-[16/9] max-h-[550px] shadow-2xl group"
            >
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?auto=format&fit=crop&w=1600&q=80"
                alt="TechFNM Story"
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-75"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent" />

              {/* Central Watch Video Play Badge */}
              <div className="absolute inset-0 flex items-center justify-center">
                <button
                  type="button"
                  onClick={() => setIsVideoOpen(true)}
                  className="relative group w-32 h-32 flex items-center justify-center cursor-pointer"
                  aria-label="Play Video"
                >
                  <div className="absolute inset-0 rounded-full border border-white/30 group-hover:border-[#e5432e] transition-colors" />
                  <svg
                    className="w-full h-full animate-[spin_18s_linear_infinite]"
                    viewBox="0 0 100 100"
                  >
                    <path
                      id="videoBadgePath"
                      d="M 50, 50 m -38, 0 a 38,38 0 1,1 76,0 a 38,38 0 1,1 -76,0"
                      fill="none"
                    />
                    <text className="text-[9px] uppercase font-bold tracking-[0.26em] fill-white group-hover:fill-[#e5432e] transition-colors">
                      <textPath href="#videoBadgePath">
                        • WATCH VIDEO • WATCH VIDEO •
                      </textPath>
                    </text>
                  </svg>
                  <div className="w-14 h-14 rounded-full bg-[#e5432e] group-hover:bg-[#cc3622] text-white flex items-center justify-center shadow-2xl shadow-[#e5432e]/50 group-hover:scale-110 transition-transform">
                    <Play size={22} fill="white" className="ml-1" />
                  </div>
                </button>
              </div>
            </motion.div>
          </div>

          {/* Marquee Ticker Track */}
          <div className="mt-14 sm:mt-20 border-y border-white/[0.08] bg-black py-5 overflow-hidden relative">
            <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-[#070709] to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-[#070709] to-transparent z-10 pointer-events-none" />

            <div className="flex shrink-0 animate-[marquee_20s_linear_infinite] hover:[animation-play-state:paused] items-center gap-8 sm:gap-14">
              {[...marqueeSkills, ...marqueeSkills, ...marqueeSkills].map((skill, index) => (
                <div key={index} className="flex items-center gap-4 text-white font-extrabold text-sm sm:text-base tracking-wider uppercase shrink-0">
                  <span className="text-[#e5432e] text-lg">✱</span>
                  <span>{skill}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 5. OUR CORE FEATURES (BENTO GRID) ── */}
        <section className="py-20 sm:py-28 relative bg-black border-b border-white/[0.08]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Header with Title and Contact Button */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 sm:mb-20">
              <div className="max-w-2xl">
                <motion.div {...fadeInUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-bold tracking-wider text-zinc-300 uppercase mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#e5432e]" />
                  <span>{content.features_badge || 'Our Core Features'}</span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight"
                >
                  {content.features_heading || 'Smart digital strategy that deliver real results'}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed"
                >
                  {content.features_desc ||
                    'We combine creativity, technology, and strategic thinking to deliver digital solutions that help businesses grow and succeed online.'}
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Link
                  to="/contact"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-[#e5432e] hover:bg-[#cc3622] text-white font-bold text-sm shadow-xl shadow-[#e5432e]/30 transition-all hover:scale-[1.02]"
                >
                  <span>Contact Us</span>
                  <ArrowRight size={16} />
                </Link>
              </motion.div>
            </div>

            {/* Bento Grid: 4 Cards */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 sm:gap-8">
              {/* Card 1: Seamless Collaboration (7 cols) */}
              <motion.div
                {...fadeInUp}
                className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-[#0f0f13] border border-white/10 hover:border-[#e5432e]/40 transition-all duration-300 flex flex-col justify-between group overflow-hidden relative"
              >
                <div className="relative z-10">
                  <div className="w-12 h-12 rounded-2xl bg-[#1b1b22] border border-white/10 flex items-center justify-center text-[#e5432e] mb-6 group-hover:bg-[#e5432e] group-hover:text-white transition-all">
                    <Users size={22} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                    Seamless Collaboration
                  </h3>
                  <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-lg mb-6">
                    We work directly alongside your executive team with zero intermediaries, providing transparent weekly sprints, live repositories, and continuous alignment.
                  </p>
                </div>

                <div className="relative rounded-2xl overflow-hidden border border-white/10 bg-black/60 p-4 mt-4">
                  <div className="flex items-center justify-between text-xs text-zinc-400 mb-3 border-b border-white/5 pb-2">
                    <span className="font-semibold text-white">Sprint Telemetry</span>
                    <span className="text-[#e5432e]">Live Sync</span>
                  </div>
                  <div className="grid grid-cols-3 gap-3 text-center">
                    <div className="p-2.5 rounded-xl bg-white/[0.03]">
                      <div className="text-lg font-black text-white">99.9%</div>
                      <div className="text-[10px] text-zinc-500 uppercase">Uptime</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.03]">
                      <div className="text-lg font-black text-[#e5432e]">3.2x</div>
                      <div className="text-[10px] text-zinc-500 uppercase">Growth</div>
                    </div>
                    <div className="p-2.5 rounded-xl bg-white/[0.03]">
                      <div className="text-lg font-black text-white">0.4s</div>
                      <div className="text-[10px] text-zinc-500 uppercase">Speed</div>
                    </div>
                  </div>
                </div>
              </motion.div>

              {/* Card 2: Visual Studio Asset (5 cols) */}
              <motion.div
                {...fadeInUp}
                transition={{ duration: 0.5, delay: 0.1 }}
                className="lg:col-span-5 rounded-3xl overflow-hidden border border-white/10 relative min-h-[350px] group shadow-xl"
              >
                <img
                  src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=1000&q=80"
                  alt="Creative Architecture"
                  className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-700 filter brightness-90"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/20 to-transparent" />
                <div className="absolute bottom-6 left-6 right-6 p-4 rounded-2xl bg-black/80 backdrop-blur-md border border-white/10">
                  <div className="text-sm font-bold text-white">Strategic Architecture</div>
                  <div className="text-xs text-zinc-400">High-conversion UI/UX & Cloud Infrastructure</div>
                </div>
              </motion.div>

              {/* Card 3: Experience & Expertise (5 cols) */}
              <motion.div
                {...fadeInUp}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="lg:col-span-5 p-8 sm:p-10 rounded-3xl bg-[#0f0f13] border border-white/10 hover:border-[#e5432e]/40 transition-all duration-300 flex flex-col justify-between group"
              >
                <div>
                  <div className="w-12 h-12 rounded-2xl bg-[#1b1b22] border border-white/10 flex items-center justify-center text-[#e5432e] mb-6 group-hover:bg-[#e5432e] group-hover:text-white transition-all">
                    <Award size={22} />
                  </div>
                  <h3 className="text-2xl font-bold text-white mb-3 tracking-tight">
                    25+ Years Combined Experience
                  </h3>
                  <p className="text-zinc-400 text-sm leading-relaxed mb-6">
                    Our leadership and senior architects have built platforms for venture-backed startups and Fortune 500 brands across dozens of industries.
                  </p>
                </div>
                <div className="flex items-center justify-between text-xs font-semibold text-zinc-400 border-t border-white/5 pt-4">
                  <span>Industry Expertise</span>
                  <span className="text-[#e5432e]">50+ Verticals</span>
                </div>
              </motion.div>

              {/* Card 4: Verified Client Trust Card (7 cols) */}
              <motion.div
                {...fadeInUp}
                transition={{ duration: 0.5, delay: 0.3 }}
                className="lg:col-span-7 p-8 sm:p-10 rounded-3xl bg-[#0f0f13] border border-white/10 hover:border-[#e5432e]/40 transition-all duration-300 flex flex-col justify-between"
              >
                <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
                  {/* Overlapping Google Reviewer Avatars */}
                  <div className="flex -space-x-3">
                    {[
                      'https://lh3.googleusercontent.com/a/ACg8ocJebTZef1PlAZ2KlnBvVinAYyAookncycfnwHyxCli_auWdeQ=w120-h120-p-rp-mo-br100',
                      'https://lh3.googleusercontent.com/a/ACg8ocKs2DdJeBpkGCIYeU9nhyi8ZwqilMDD-tpaxKM0g26WQJ8htg=w120-h120-p-rp-mo-br100',
                      'https://lh3.googleusercontent.com/a/ACg8ocJ8LZrpGJ423x17SElxqvKDzVTHVuvDO-X_aiAjP8K_ccwC4g=w120-h120-p-rp-mo-br100'
                    ].map((img, i) => (
                      <img
                        key={i}
                        src={img}
                        alt="Google Reviewer"
                        className="w-11 h-11 rounded-full border-2 border-[#0f0f13] object-cover"
                      />
                    ))}
                  </div>

                  {/* Rating Pill linking to GMB */}
                  <a
                    href={GMB_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] hover:bg-white/10 border border-white/10 transition-colors"
                  >
                    <span className="text-sm font-black text-white">5.0/5</span>
                    <div className="flex text-amber-400">
                      {[...Array(5)].map((_, i) => (
                        <Star key={i} size={13} fill="currentColor" stroke="none" />
                      ))}
                    </div>
                    <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider bg-white/5 px-2 py-0.5 rounded-full">Google</span>
                  </a>
                </div>

                <blockquote className="text-base sm:text-lg text-zinc-200 font-medium italic leading-relaxed mb-6">
                  “ Honestly couldn't be happier with Tech FNM. Our site's stats are trending up continuously, and the guys are super friendly and responsive. ”
                </blockquote>

                <div className="flex items-center justify-between text-xs text-zinc-400 border-t border-white/5 pt-4">
                  <a
                    href={GMB_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="hover:text-white transition-colors"
                  >
                    Verified Google Review • ARK Roofing
                  </a>
                  <a
                    href={GMB_LINK}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-emerald-400 font-bold hover:underline"
                  >
                    View on Google Maps →
                  </a>
                </div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* ── 6. FREQUENTLY ASKED QUESTIONS (FAQS) & IMPACT COUNTERS ── */}
        <section className="py-20 sm:py-28 relative bg-[#070709] border-b border-white/[0.08]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
              {/* Left Column: Sticky Title, Description & Rotating Badge */}
              <div className="lg:col-span-5 lg:sticky lg:top-36 space-y-6">
                <motion.div {...fadeInUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-bold tracking-wider text-zinc-300 uppercase">
                  <span className="w-2 h-2 rounded-full bg-[#e5432e]" />
                  <span>{content.faq_badge || 'Frequently Asked Questions'}</span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-3xl sm:text-4xl font-black text-white tracking-tight leading-tight"
                >
                  {content.faq_heading || 'Find helpful answers about our services & process'}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="text-zinc-400 text-sm sm:text-base leading-relaxed"
                >
                  {content.faq_desc ||
                    'Explore our frequently asked questions to find helpful answers about our services, working process, and digital solutions.'}
                </motion.p>

                {/* Rotating Contact Badge */}
                <div className="pt-4">
                  <Link
                    to="/contact"
                    className="relative group w-28 h-28 flex items-center justify-center cursor-pointer inline-flex"
                  >
                    <div className="absolute inset-0 rounded-full border border-white/10 group-hover:border-[#e5432e] transition-colors" />
                    <svg
                      className="w-full h-full animate-[spin_16s_linear_infinite]"
                      viewBox="0 0 100 100"
                    >
                      <path
                        id="faqContactBadgePath"
                        d="M 50, 50 m -37, 0 a 37,37 0 1,1 74,0 a 37,37 0 1,1 -74,0"
                        fill="none"
                      />
                      <text className="text-[9.5px] uppercase font-bold tracking-[0.24em] fill-zinc-400 group-hover:fill-[#e5432e] transition-colors">
                        <textPath href="#faqContactBadgePath">
                          • CONTACT US • CONTACT US •
                        </textPath>
                      </text>
                    </svg>
                    <div className="w-10 h-10 rounded-full bg-[#e5432e] group-hover:bg-[#cc3622] text-white flex items-center justify-center transition-transform group-hover:scale-110 shadow-lg shadow-[#e5432e]/30">
                      <ArrowUpRight size={18} />
                    </div>
                  </Link>
                </div>
              </div>

              {/* Right Column: Accordion */}
              <div className="lg:col-span-7 space-y-4">
                {faqs.map((faq, idx) => {
                  const isOpen = openFaq === idx;
                  return (
                    <motion.div
                      key={idx}
                      {...fadeInUp}
                      transition={{ duration: 0.4, delay: idx * 0.06 }}
                      className="rounded-2xl bg-[#0f0f13] border border-white/10 overflow-hidden transition-colors"
                    >
                      <button
                        type="button"
                        onClick={() => toggleFaq(idx)}
                        className="w-full p-6 text-left flex items-center justify-between gap-4 cursor-pointer"
                      >
                        <span className="text-base sm:text-lg font-bold text-white tracking-tight">
                          {faq.q}
                        </span>
                        <div
                          className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 transition-colors ${
                            isOpen
                              ? 'bg-[#e5432e] text-white'
                              : 'bg-white/5 text-zinc-400 hover:bg-white/10'
                          }`}
                        >
                          {isOpen ? <Minus size={16} /> : <Plus size={16} />}
                        </div>
                      </button>

                      <AnimatePresence initial={false}>
                        {isOpen && (
                          <motion.div
                            initial={{ height: 0, opacity: 0 }}
                            animate={{ height: 'auto', opacity: 1 }}
                            exit={{ height: 0, opacity: 0 }}
                            transition={{ duration: 0.3 }}
                          >
                            <div className="px-6 pb-6 text-sm text-zinc-400 leading-relaxed border-t border-white/5 pt-4">
                              {faq.a}
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.div>
                  );
                })}
              </div>
            </div>

            {/* Bottom Stats Ribbon: 3 Metric Cards */}
            <div className="mt-16 sm:mt-24 pt-12 border-t border-white/[0.08] grid grid-cols-1 md:grid-cols-3 gap-6">
              {[
                {
                  num: '120+',
                  title: 'Projects Successfully Completed',
                  desc: 'Delivering high-performance digital solutions across diverse industries.'
                },
                {
                  num: '98%',
                  title: 'Satisfied Clients Worldwide',
                  desc: 'Long-term partnerships backed by measurable ROI and responsive support.'
                },
                {
                  num: '60+',
                  title: 'Creative Experts on Our Team',
                  desc: 'Senior full-stack developers, UI/UX designers, and growth engineers.'
                }
              ].map((stat, idx) => (
                <motion.div
                  key={idx}
                  {...fadeInUp}
                  transition={{ duration: 0.4, delay: idx * 0.1 }}
                  className="p-7 rounded-3xl bg-[#0f0f13] border border-white/10 hover:border-[#e5432e]/40 transition-all duration-300"
                >
                  <div className="text-4xl sm:text-5xl font-black text-[#e5432e] tracking-tight mb-2">
                    {stat.num}
                  </div>
                  <div className="text-base font-bold text-white mb-1.5">
                    {stat.title}
                  </div>
                  <p className="text-xs text-zinc-400 leading-relaxed">
                    {stat.desc}
                  </p>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* ── 7. OUR TESTIMONIALS (CLIENT REVIEWS SLIDER) ── */}
        <section className="py-20 sm:py-28 relative bg-black border-b border-white/[0.08]">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
            {/* Header with Title and "View All Reviews" button */}
            <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-8 mb-16 sm:mb-20">
              <div className="max-w-2xl">
                <motion.div {...fadeInUp} className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/[0.05] border border-white/10 text-xs font-bold tracking-wider text-zinc-300 uppercase mb-4">
                  <span className="w-2 h-2 rounded-full bg-[#e5432e]" />
                  <span>{content.testimonials_badge || 'Our Testimonials'}</span>
                </motion.div>

                <motion.h2
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6 }}
                  className="text-3xl sm:text-4xl md:text-5xl font-black text-white tracking-tight"
                >
                  {content.testimonials_heading || 'What our clients say about our digital expertise'}
                </motion.h2>

                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                  className="mt-4 text-zinc-400 text-sm sm:text-base leading-relaxed"
                >
                  {content.testimonials_desc ||
                    'Businesses from different industries trust our team to deliver innovative digital solutions that improve their online presence.'}
                </motion.p>
              </div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <a
                  href={GMB_LINK}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-7 py-3.5 rounded-full bg-white/10 hover:bg-white/20 text-white font-bold text-sm border border-white/10 transition-all hover:scale-[1.02]"
                >
                  <span>View on Google Maps</span>
                  <ArrowRight size={16} />
                </a>
              </motion.div>
            </div>

            {/* Carousel Box */}
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Stack of Clients & Satisfaction Trust Badge */}
              <a
                href={GMB_LINK}
                target="_blank"
                rel="noopener noreferrer"
                className="lg:col-span-4 p-8 rounded-3xl bg-[#0f0f13] border border-white/10 hover:border-[#e5432e]/40 space-y-6 block transition-all group cursor-pointer"
              >
                <div className="flex -space-x-3 overflow-hidden">
                  {[
                    'https://lh3.googleusercontent.com/a/ACg8ocJebTZef1PlAZ2KlnBvVinAYyAookncycfnwHyxCli_auWdeQ=w120-h120-p-rp-mo-br100',
                    'https://lh3.googleusercontent.com/a/ACg8ocKs2DdJeBpkGCIYeU9nhyi8ZwqilMDD-tpaxKM0g26WQJ8htg=w120-h120-p-rp-mo-br100',
                    'https://lh3.googleusercontent.com/a/ACg8ocJ8LZrpGJ423x17SElxqvKDzVTHVuvDO-X_aiAjP8K_ccwC4g=w120-h120-p-rp-mo-br100'
                  ].map((img, i) => (
                    <img
                      key={i}
                      src={img}
                      alt="Google Reviewer"
                      className="w-12 h-12 rounded-full border-2 border-[#0f0f13] object-cover"
                    />
                  ))}
                </div>

                <div className="text-base font-bold text-white group-hover:text-[#e5432e] transition-colors leading-snug">
                  “ 5.0 Star Rated on Google Business with Verified Reviews. ”
                </div>

                <div className="pt-4 border-t border-white/5 flex items-center justify-between text-xs text-zinc-400">
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Live Google Business Profile</span>
                  </div>
                  <span className="text-[#e5432e] font-semibold">5.0 ★</span>
                </div>
              </a>

              {/* Right Column: Active Testimonial Card with Controls */}
              <div className="lg:col-span-8 p-8 sm:p-12 rounded-3xl bg-[#0f0f13] border border-white/10 relative overflow-hidden">
                <div className="flex items-center justify-between gap-4 mb-6">
                  {/* Star Rating & Google Badge */}
                  <div className="flex items-center gap-3">
                    <div className="flex text-amber-400">
                      {[...Array(testimonials[currentTestimonial].rating)].map((_, i) => (
                        <Star key={i} size={18} fill="currentColor" stroke="none" />
                      ))}
                    </div>
                    <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-white/5 text-[11px] font-bold text-emerald-400 border border-emerald-500/20">
                      Verified Google Review
                    </span>
                  </div>

                  {/* Navigation Arrows */}
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={prevTestimonial}
                      className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#e5432e] text-white flex items-center justify-center border border-white/10 transition-colors cursor-pointer"
                      aria-label="Previous Testimonial"
                    >
                      <ChevronLeft size={18} />
                    </button>
                    <button
                      type="button"
                      onClick={nextTestimonial}
                      className="w-10 h-10 rounded-full bg-white/5 hover:bg-[#e5432e] text-white flex items-center justify-center border border-white/10 transition-colors cursor-pointer"
                      aria-label="Next Testimonial"
                    >
                      <ChevronRight size={18} />
                    </button>
                  </div>
                </div>

                {/* Animated Quote */}
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentTestimonial}
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -15 }}
                    transition={{ duration: 0.35 }}
                    className="space-y-6"
                  >
                    <blockquote className="text-lg sm:text-xl text-zinc-200 font-medium leading-relaxed italic">
                      “ {testimonials[currentTestimonial].quote} ”
                    </blockquote>

                    <div className="flex items-center justify-between pt-4 border-t border-white/5">
                      <div className="flex items-center gap-4">
                        <img
                          src={testimonials[currentTestimonial].avatar}
                          alt={testimonials[currentTestimonial].name}
                          className="w-12 h-12 rounded-full object-cover border border-white/10"
                        />
                        <div>
                          <div className="text-base font-bold text-white">
                            {testimonials[currentTestimonial].name}
                          </div>
                          <div className="text-xs text-[#e5432e] font-semibold">
                            {testimonials[currentTestimonial].role}
                          </div>
                        </div>
                      </div>

                      <a
                        href={GMB_LINK}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="hidden sm:inline-flex items-center gap-1.5 text-xs text-zinc-400 hover:text-white transition-colors"
                      >
                        <span>View on Google</span>
                        <ArrowUpRight size={14} />
                      </a>
                    </div>
                  </motion.div>
                </AnimatePresence>
              </div>
            </div>
          </div>
        </section>

        {/* ── 8. CLOSING DIGITAL GROWTH CONSULTATION CTA ── */}
        <section className="py-20 sm:py-28 relative overflow-hidden bg-gradient-to-b from-[#0a0a0f] to-black">
          <div className="pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[380px] bg-[#e5432e]/15 blur-[140px] rounded-full" />

          <div className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center space-y-6">
            <motion.div {...fadeInUp} className="inline-block px-4 py-1.5 rounded-full bg-[#e5432e]/15 border border-[#e5432e]/30 text-[#e5432e] text-xs font-bold uppercase tracking-wider">
              {content.cta_badge || "LET'S BUILD SOMETHING EXTRAORDINARY"}
            </motion.div>

            <motion.h2
              {...fadeInUp}
              className="text-3xl sm:text-5xl lg:text-6xl font-black text-white tracking-tight max-w-4xl mx-auto leading-tight"
            >
              {content.cta_heading || 'Ready to transform your digital presence? Let’s start digital growth'}
            </motion.h2>

            <motion.p
              {...fadeInUp}
              className="text-sm sm:text-base text-zinc-400 max-w-2xl mx-auto leading-relaxed"
            >
              {content.cta_desc ||
                'Book a complimentary 30-minute discovery consultation. We will analyze your digital footprint and architect a custom growth blueprint.'}
            </motion.p>

            <motion.div {...fadeInUp} className="flex flex-wrap items-center justify-center gap-4 pt-4">
              <Link
                to="/request-service"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-[#e5432e] hover:bg-[#cc3622] text-white font-bold text-sm shadow-xl shadow-[#e5432e]/40 hover:scale-[1.03] transition-all cursor-pointer"
              >
                <span>Start Your Project</span>
                <ArrowRight size={16} />
              </Link>
              <Link
                to="/contact"
                className="inline-flex items-center gap-2 px-8 py-4 rounded-xl bg-zinc-900 hover:bg-zinc-800 text-zinc-200 hover:text-white border border-zinc-800 font-semibold text-sm hover:scale-[1.03] transition-all cursor-pointer"
              >
                <span>Contact Our Team</span>
              </Link>
            </motion.div>
          </div>
        </section>
      </main>

      {/* ── 9. VIDEO MODAL POPUP ── */}
      <AnimatePresence>
        {isVideoOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 sm:p-8"
            onClick={() => setIsVideoOpen(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              transition={{ type: 'spring', damping: 25, stiffness: 300 }}
              className="relative w-full max-w-4xl aspect-[16/9] bg-zinc-950 rounded-2xl overflow-hidden border border-white/20 shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                type="button"
                onClick={() => setIsVideoOpen(false)}
                className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full bg-black/70 hover:bg-[#e5432e] text-white flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close video"
              >
                <X size={20} />
              </button>

              <iframe
                src={content.video_url || 'https://www.youtube.com/embed/Y-x0efG1seA?autoplay=1'}
                title="Company Video"
                className="w-full h-full"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

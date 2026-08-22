import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { motion } from 'motion/react';
import { Code, Smartphone, Globe, PenTool, ShoppingCart, Share2, ArrowRight, ArrowLeft, Shield, Zap, Sparkles, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SeoHead from '../../components/SeoHead';

const iconMap: any = {
  Code,
  Smartphone,
  Globe,
  PenTool,
  ShoppingCart,
  Share2,
};

// Curated custom feature benefits based on service categories/names
// New services added in future will fallback to generic features dynamically
const serviceFeaturesFallback: any = {
  'web development': [
    { title: 'Custom Architectures', desc: 'Custom built codebases optimized for loading speeds, scalability, and security.', icon: Code },
    { title: 'Responsive Design', desc: 'Perfect layouts across mobile, tablet, and widescreen monitor displays.', icon: Smartphone },
    { title: 'SEO Optimized Structure', desc: 'Semantic markup designed to help search engine crawlers rank your site higher.', icon: Globe }
  ],
  'content writing': [
    { title: 'SEO Friendly Copy', desc: 'Crafting texts targeting organic search keywords while maintaining human engagement.', icon: Globe },
    { title: 'Brand Tone Alignment', desc: 'Aligning vocabulary and voice with your corporate values and targeted demographics.', icon: PenTool },
    { title: 'Proofread & Ready', desc: 'Flawless execution with ZERO grammatical errors or formatting issues.', icon: Sparkles }
  ],
  'digital marketing': [
    { title: 'Data-Driven Insights', desc: 'Targeting demographics based on real-time search trends and customer actions.', icon: Zap },
    { title: 'Lead Ingestion', desc: 'Converting traffic into actual prospects through structured funnels and CTAs.', icon: ArrowRight },
    { title: 'High ROI Campaigns', desc: 'Budget allocation focused on channels showing maximum click-through rates.', icon: Shield }
  ],
  'ui/ux design': [
    { title: 'Interactive Prototypes', desc: 'Before writing code, interact with high fidelity mockups to test workflows.', icon: Sparkles },
    { title: 'Aesthetic Interfaces', desc: 'Stunning layouts crafted using modern typography, glassmorphism, and color theory.', icon: PenTool },
    { title: 'User-Centric Journeys', desc: 'Flows designed to minimize friction and lead users straight to checkout or signup.', icon: CheckCircle2 }
  ],
  'e-commerce': [
    { title: 'Secure Payment Flow', desc: 'Integration with Stripe, PayPal, and local gateways prioritizing cardholder data safety.', icon: Shield },
    { title: 'Easy Catalog Updates', desc: 'Admin panel configured to easily update inventory, prices, and discounts.', icon: ShoppingCart },
    { title: 'Fast Checkouts', desc: 'Minimize cart abandonment with optimized, single-page checkout forms.', icon: Zap }
  ]
};

const genericFeatures = [
  { title: 'Tailored Strategy', desc: 'Solutions crafted specifically around your unique business objectives and target audience.', icon: Sparkles },
  { title: 'Performance First', desc: 'Optimized execution ensuring fast response times and high usability index.', icon: Zap },
  { title: 'Continuous Support', desc: 'Technical support post-delivery to ensure system updates and stable operation.', icon: Shield }
];

export default function ServiceDetail() {
  const { id } = useParams();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchServiceDetail();
  }, [id]);

  const fetchServiceDetail = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('services')
        .select('*')
        .eq('id', id)
        .single();

      if (data) {
        setService(data);
      } else {
        // Local fallback matching by ID
        const fallbacks = [
          {
            id: '1',
            title: 'Web Development',
            description: 'Get a high-performance, responsive website built with the latest tech to ensure a smooth user experience on any device.',
            icon: 'Code',
            color: 'bg-red-500/10 text-red-500',
          },
          {
            id: '2',
            title: 'Content Writing',
            description: 'We craft compelling, SEO-friendly stories that capture your brand’s voice and turn casual readers into loyal customers.',
            icon: 'PenTool',
            color: 'bg-red-500/10 text-red-500',
          },
          {
            id: '3',
            title: 'Digital Marketing',
            description: 'Drive targeted traffic and boost your brand visibility with our data-driven marketing strategies designed for high growth.',
            icon: 'Globe',
            color: 'bg-red-500/10 text-red-500',
          },
          {
            id: '4',
            title: 'UI/UX Design',
            description: 'Intuitive and visually appealing interfaces designed to maximize user engagement and satisfaction.',
            icon: 'PenTool',
            color: 'bg-red-500/10 text-red-500',
          },
          {
            id: '5',
            title: 'E-Commerce',
            description: 'Launch a powerful online store with seamless navigation and secure payment gateways to maximize your global sales.',
            icon: 'ShoppingCart',
            color: 'bg-red-500/10 text-red-500',
          },
          {
            id: '6',
            title: 'Social Media',
            description: 'Build a thriving community and increase engagement across platforms with creative campaigns that get people talking.',
            icon: 'Share2',
            color: 'bg-red-500/10 text-red-500',
          }
        ];
        const match = fallbacks.find(item => item.id === id);
        if (match) {
          setService(match);
        }
      }
    } catch (err) {
      console.error('Error fetching service detail:', err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center text-zinc-500 font-mono tracking-wider">
        Loading Service details...
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center space-y-6 text-center px-4">
        <h1 className="text-3xl font-bold text-white">Service Not Found</h1>
        <p className="text-zinc-400 max-w-sm">The service you are looking for might have been removed or renamed.</p>
        <Link to="/services" className="inline-flex items-center gap-2 bg-red-650 hover:bg-red-750 text-white px-6 py-3 rounded-full font-bold transition-all">
          <ArrowLeft size={16} /> Back to Services
        </Link>
      </div>
    );
  }

  const Icon = iconMap[service.icon] || Code;
  
  // Resolve features: check custom list, fallback to generic
  const resolvedFeatures = serviceFeaturesFallback[service.title.toLowerCase()] || genericFeatures;

  // Process timeline data
  const processSteps = [
    { step: '01', title: 'Consultation & Scope', desc: 'Understanding your product vision, key features, and growth metrics.' },
    { step: '02', title: 'Strategy & Mockups', desc: 'Creating structured layouts, interactive user paths, and wireframes.' },
    { step: '03', title: 'Agile Implementation', desc: 'Writing clean, production-ready code with continuous feature reviews.' },
    { step: '04', title: 'Deployment & Support', desc: 'Launching the system online followed by periodic optimization reports.' }
  ];

  return (
    <div className="min-h-screen bg-black font-sans text-white scroll-smooth overflow-x-hidden w-full flex flex-col justify-between animate-fadeIn">
      <SeoHead pageId="services" />
      <Header />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative min-h-[60vh] bg-black flex items-center justify-center overflow-hidden border-b border-zinc-900 px-4 sm:px-6 lg:px-8 pt-20">
          {/* Background Shapes */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-red-900/30 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute top-0 -right-20 w-96 h-96 bg-orange-900/30 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-20 w-96 h-96 bg-red-800/30 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative z-10 max-w-4xl mx-auto text-center space-y-6 flex flex-col items-center">
            
            {/* Back to services link */}
            <Link to="/services" className="inline-flex items-center gap-1.5 text-zinc-500 hover:text-white transition-colors text-xs font-semibold uppercase tracking-wider mb-2">
              <ArrowLeft size={12} /> Back to services
            </Link>

            {/* Dynamic Service Icon */}
            <div className="w-16 h-16 rounded-2xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500 shadow-xl shadow-red-950/10 mb-4 animate-pulse">
              <Icon size={32} />
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
              {service.title}
            </h1>
            
            <p className="text-zinc-400 text-base sm:text-lg max-w-2xl mx-auto leading-relaxed">
              {service.description}
            </p>
          </div>
        </section>

        {/* FEATURES GRID SECTION */}
        <section className="py-20 bg-zinc-950 px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
          <div className="max-w-6xl mx-auto space-y-12">
            <div className="text-center space-y-2">
              <span className="text-red-500 font-semibold tracking-wider uppercase text-sm block">Core Advantages</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">How This Service Helps You Grow</h2>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {resolvedFeatures.map((feature: any, index: number) => {
                const FeatIcon = feature.icon || Sparkles;
                return (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 15 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: index * 0.1, duration: 0.4 }}
                    className="bg-zinc-900/30 border border-zinc-850 p-8 rounded-3xl space-y-4 hover:border-red-650/20 transition-all backdrop-blur-sm"
                  >
                    <div className="w-12 h-12 rounded-xl bg-zinc-900 flex items-center justify-center text-red-500 border border-zinc-800 shadow-md">
                      <FeatIcon size={20} />
                    </div>
                    <h3 className="text-lg sm:text-xl font-bold text-white">{feature.title}</h3>
                    <p className="text-zinc-400 text-sm leading-relaxed">{feature.desc}</p>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </section>

        {/* PROCESS FLOW TIMELINE */}
        <section className="py-20 bg-black px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
          <div className="max-w-5xl mx-auto space-y-16">
            <div className="text-center space-y-2">
              <span className="text-red-500 font-semibold tracking-wider uppercase text-sm block">Working Process</span>
              <h2 className="text-2xl sm:text-3xl font-bold text-white">Our Step-by-Step Delivery</h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 relative">
              {processSteps.map((step, index) => (
                <div key={index} className="space-y-4 relative">
                  <div className="flex items-baseline justify-between">
                    <span className="text-4xl sm:text-5xl font-black text-red-900/40 select-none font-mono">
                      {step.step}
                    </span>
                    {index < 3 && (
                      <div className="hidden lg:block w-full h-[1px] bg-gradient-to-r from-zinc-800 to-transparent absolute top-6 left-28 z-0" />
                    )}
                  </div>
                  <h3 className="text-lg font-bold text-white relative z-10">{step.title}</h3>
                  <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed relative z-10">{step.desc}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* BOTTOM CALL TO ACTION */}
        <section className="py-24 bg-zinc-950 text-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <span className="text-red-500 font-semibold tracking-wider uppercase text-sm block">
              Start Project
            </span>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Ready to execute with TechFNM?
            </h2>
            
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
              Get in touch to request a customized service setup or schedule a design draft consultation.
            </p>

            <div className="pt-2">
              <Link
                to={`/request-service?service=${encodeURIComponent(service.title)}`}
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-full font-bold transition-all hover:scale-105 shadow-lg shadow-red-950/20"
              >
                <span>Order {service.title}</span>
                <ArrowRight size={16} />
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

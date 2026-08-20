import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SeoHead from '../../components/SeoHead';
import { supabase } from '../../lib/supabase';
import { Loader2, ArrowLeft, ArrowRight, BarChart2, Star, Target, CheckCircle } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function ServiceDetail() {
  const { slug } = useParams();
  const [service, setService] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchService = async () => {
      // First try slug, if no slug, try id
      let query = supabase.from('services').select('*').eq('slug', slug).maybeSingle();
      let { data, error } = await query;
      
      if (!data && !isNaN(Number(slug))) {
        const { data: idData } = await supabase.from('services').select('*').eq('id', slug).maybeSingle();
        data = idData;
      }
      
      setService(data);
      setLoading(false);
    };
    if (slug) fetchService();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-red-500" size={48} />
      </div>
    );
  }

  if (!service) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-bold mb-4">Service Not Found</h1>
        <Link to="/services" className="text-red-500 flex items-center gap-2 hover:underline"><ArrowLeft size={16} /> Back to Services</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black font-sans text-white flex flex-col w-full">
      <SeoHead 
        title={service.meta_title || service.title} 
        description={service.meta_description || service.description} 
      />
      <Header />
      <main className="flex-grow pt-32 pb-24">
        
        {/* Sleek Dark Hero Section */}
        <section className="relative overflow-hidden mb-16 py-12">
          <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 blur-[120px] rounded-full -mr-24 -mt-24" />
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <Link to="/services" className="inline-flex items-center text-red-500 hover:text-red-400 mb-8 transition-colors text-sm font-semibold tracking-wider">
              <ArrowLeft size={16} className="mr-2" /> ALL SERVICES
            </Link>
            
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
              <div>
                <span className="text-red-500 font-semibold tracking-widest uppercase text-xs">Premium Agency Service</span>
                <h1 className="text-4xl md:text-6xl font-extrabold text-white mt-4 mb-6 leading-tight">
                  {service.title}
                </h1>
                <p className="text-xl text-zinc-400 leading-relaxed font-light mb-8">
                  {service.description}
                </p>
                <div className="flex gap-4">
                  <Link to="/contact" className="inline-flex items-center justify-center px-6 py-3 bg-red-600 hover:bg-red-700 text-white font-bold rounded-full transition-all hover:scale-105 shadow-lg shadow-red-600/20">
                    Get Free Quote <ArrowRight className="ml-2 w-4 h-4" />
                  </Link>
                </div>
              </div>

              {/* Statistics & Badges layout (LyteNyte & Webflow style layout) */}
              <div className="grid grid-cols-2 gap-6 bg-zinc-900/40 p-8 rounded-3xl border border-zinc-800 backdrop-blur-sm">
                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                    <BarChart2 size={20} />
                  </div>
                  <h3 className="text-3xl font-extrabold text-white">99%</h3>
                  <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Success rate</p>
                </div>

                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                    <Star size={20} />
                  </div>
                  <h3 className="text-3xl font-extrabold text-white">4.9/5</h3>
                  <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Client Reviews</p>
                </div>

                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                    <Target size={20} />
                  </div>
                  <h3 className="text-3xl font-extrabold text-white">24h</h3>
                  <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Response Time</p>
                </div>

                <div className="space-y-2">
                  <div className="w-10 h-10 rounded-lg bg-red-500/10 flex items-center justify-center text-red-500">
                    <CheckCircle size={20} />
                  </div>
                  <h3 className="text-3xl font-extrabold text-white">100%</h3>
                  <p className="text-xs text-zinc-400 uppercase tracking-wider font-semibold">Clean Code</p>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Detailed Service Content */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="prose prose-invert prose-red max-w-none bg-zinc-900/20 p-8 md:p-12 rounded-[2.5rem] border border-zinc-800/80">
            {service.content ? (
              <ReactMarkdown>{service.content}</ReactMarkdown>
            ) : (
              <div className="space-y-6">
                <h3 className="text-2xl font-bold">Service Overview</h3>
                <p className="text-zinc-400">
                  Our professional team works closely with you to deploy high-fidelity {service.title.toLowerCase()} configurations. We utilize modern styling paradigms, scalable architecture, and strict security rules to guarantee robust project lifecycle delivery.
                </p>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-4">
                  {['Tailored business strategies', 'High-performance metrics', 'Expert assistance & support', 'Responsive & modern layouts'].map((feature, i) => (
                    <div key={i} className="flex items-center gap-3 text-zinc-300">
                      <CheckCircle className="w-5 h-5 text-red-500 shrink-0" />
                      <span className="text-sm font-semibold">{feature}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </section>
      </main>
      <Footer />
    </div>
  );
}

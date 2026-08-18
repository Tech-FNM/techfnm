import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SeoHead from '../../components/SeoHead';
import { supabase } from '../../lib/supabase';
import { Loader2, ArrowLeft } from 'lucide-react';
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
      <main className="flex-grow pt-32 pb-16">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/services" className="inline-flex items-center text-red-500 hover:text-red-400 mb-8 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Back to Services
          </Link>
          
          <h1 className="text-4xl md:text-5xl font-bold text-white mb-6">{service.title}</h1>
          <p className="text-xl text-gray-400 mb-12 leading-relaxed">
            {service.description}
          </p>
          
          <div className="prose prose-invert prose-red max-w-none">
            {service.content ? (
              <ReactMarkdown>{service.content}</ReactMarkdown>
            ) : (
              <p>Detailed content coming soon.</p>
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

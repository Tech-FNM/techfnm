import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SeoHead from '../../components/SeoHead';
import { supabase } from '../../lib/supabase';
import { Loader2, ArrowLeft, Calendar, User } from 'lucide-react';
import ReactMarkdown from 'react-markdown';

export default function BlogDetail() {
  const { slug } = useParams();
  const [blog, setBlog] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchBlog = async () => {
      const { data } = await supabase.from('blogs').select('*').eq('slug', slug).maybeSingle();
      setBlog(data);
      setLoading(false);
    };
    if (slug) fetchBlog();
  }, [slug]);

  if (loading) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center">
        <Loader2 className="animate-spin text-red-500" size={48} />
      </div>
    );
  }

  if (!blog) {
    return (
      <div className="min-h-screen bg-black flex flex-col items-center justify-center text-white">
        <h1 className="text-4xl font-bold mb-4">Post Not Found</h1>
        <Link to="/blog" className="text-red-500 flex items-center gap-2 hover:underline"><ArrowLeft size={16} /> Back to Blog</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black font-sans text-white flex flex-col w-full">
      <SeoHead 
        title={blog.meta_title || blog.title} 
        description={blog.meta_description} 
      />
      <Header />
      <main className="flex-grow pt-32 pb-16">
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
          <Link to="/blog" className="inline-flex items-center text-red-500 hover:text-red-400 mb-8 transition-colors">
            <ArrowLeft size={16} className="mr-2" /> Back to Blog
          </Link>
          
          <header className="mb-10 text-center">
            <div className="flex items-center justify-center gap-6 text-sm text-gray-400 mb-6">
              <span className="flex items-center gap-2"><Calendar size={16} /> {new Date(blog.created_at).toLocaleDateString()}</span>
              <span className="flex items-center gap-2"><User size={16} /> Admin</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-8 leading-tight">{blog.title}</h1>
          </header>

          {blog.image && (
            <div className="w-full aspect-video rounded-2xl overflow-hidden bg-zinc-900 mb-12 border border-zinc-800">
              <img src={blog.image} alt={blog.title} className="w-full h-full object-cover" />
            </div>
          )}
          
          <div className="prose prose-invert prose-red prose-lg max-w-none prose-img:rounded-xl">
            {blog.content ? (
              <ReactMarkdown>{blog.content}</ReactMarkdown>
            ) : (
              <p>No content provided.</p>
            )}
          </div>
        </article>
      </main>
      <Footer />
    </div>
  );
}

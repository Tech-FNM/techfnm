import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SeoHead from '../../components/SeoHead';
import { supabase } from '../../lib/supabase';
import { motion } from 'motion/react';
import { Calendar, User, ArrowRight } from 'lucide-react';

export default function BlogPage() {
  const [blogs, setBlogs] = useState<any[]>([]);

  useEffect(() => {
    const fetchBlogs = async () => {
      const { data } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
      if (data) setBlogs(data);
    };
    fetchBlogs();
  }, []);

  return (
    <div className="min-h-screen bg-black font-sans text-white flex flex-col w-full">
      <SeoHead pageId="blog" title="Blog & Insights" />
      <Header />
      <main className="flex-grow pt-32 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <span className="text-red-500 font-semibold tracking-wider uppercase text-sm">Our Insights</span>
            <h1 className="mt-2 text-4xl md:text-5xl font-bold text-white">Latest from the Blog</h1>
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {blogs.length === 0 ? (
              <div className="col-span-full text-center text-gray-500 py-12">No blog posts found.</div>
            ) : (
              blogs.map((blog, index) => (
                <motion.div
                  key={blog.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden hover:border-red-500/50 transition-all group flex flex-col"
                >
                  <Link to={`/blog/${blog.slug}`} className="block relative aspect-video overflow-hidden bg-zinc-800">
                    {blog.image ? (
                      <img 
                        src={blog.image} 
                        alt={blog.title} 
                        className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" 
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-zinc-600">No Image</div>
                    )}
                  </Link>
                  <div className="p-6 flex flex-col flex-grow">
                    <div className="flex items-center gap-4 text-xs text-gray-500 mb-4">
                      <span className="flex items-center gap-1"><Calendar size={14} /> {new Date(blog.created_at).toLocaleDateString()}</span>
                      <span className="flex items-center gap-1"><User size={14} /> Admin</span>
                    </div>
                    <Link to={`/blog/${blog.slug}`} className="block flex-grow">
                      <h2 className="text-xl font-bold text-white mb-3 group-hover:text-red-500 transition-colors line-clamp-2">
                        {blog.title}
                      </h2>
                    </Link>
                    <Link to={`/blog/${blog.slug}`} className="inline-flex items-center text-red-500 font-medium text-sm mt-4 hover:gap-2 transition-all">
                      Read Article <ArrowRight size={16} className="ml-1" />
                    </Link>
                  </div>
                </motion.div>
              ))
            )}
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

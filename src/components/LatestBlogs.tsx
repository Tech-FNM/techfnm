import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Calendar } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageContent } from '../lib/cmsContent';
import { supabase } from '../lib/supabase';

const BASELINE_FALLBACKS = [
  {
    id: 'f1',
    title: 'Stress-Free UK Airport Transfers: Why Pre-Booking Your Journey Makes Sense',
    date: 'Aug 18, 2026',
    category: 'General',
    image: 'https://rpnaqrmquddupmxvvcjg.supabase.co/storage/v1/object/public/agency-assets/blogs/0.6338765301290266.png',
    slug: 'stress-free-uk-airport-transfers'
  },
  {
    id: 'f2',
    title: '5 Digital Marketing Strategies to Grow Your Business Online',
    date: 'Aug 20, 2026',
    category: 'Digital Strategy',
    image: 'https://demo.awaikenthemes.com/fexora/wp-content/uploads/2026/05/post-1.jpg',
    slug: '5-digital-marketing-strategies'
  },
  {
    id: 'f3',
    title: 'The Power of Brand in Building a Strong Business Identity',
    date: 'Aug 21, 2026',
    category: 'Branding',
    image: 'https://demo.awaikenthemes.com/fexora/wp-content/uploads/2026/05/post-2.jpg',
    slug: 'the-power-of-brand'
  }
];

export default function LatestBlogs() {
  const content = usePageContent('page-home', {
    blogs_badge: 'Latest Blogs',
    blogs_heading: 'Insights tips & trends from the world of marketing',
    blogs_desc: 'Stay informed with valuable insights, practical tips, and the latest trends from the ever-evolving world of marketing.',
    blogs_btn_text: 'View All Blogs',
    blogs_btn_link: '/blog'
  });

  const [posts, setPosts] = useState<any[]>(() => {
    try {
      const cached = localStorage.getItem('techfnm_blogs_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const published = parsed.filter((p: any) => p.status === 'published' || !p.status);
          if (published.length >= 3) return published.slice(0, 3);
          const publishedSlugs = new Set(published.map((p: any) => p.slug || p.id));
          const complementary = BASELINE_FALLBACKS.filter(fb => !publishedSlugs.has(fb.slug));
          return [...published, ...complementary].slice(0, 3);
        }
      }
    } catch {}
    return BASELINE_FALLBACKS;
  });

  const fetchRealPosts = async () => {
    try {
      const { data } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        localStorage.setItem('techfnm_blogs_cache', JSON.stringify(data));
        const published = data.filter((p: any) => p.status === 'published' || !p.status);
        if (published.length >= 3) {
          setPosts(published.slice(0, 3));
        } else {
          const publishedSlugs = new Set(published.map((p: any) => p.slug || p.id));
          const complementary = BASELINE_FALLBACKS.filter(fb => !publishedSlugs.has(fb.slug));
          setPosts([...published, ...complementary].slice(0, 3));
        }
      }
    } catch (err) {
      console.error('Error fetching real blogs for homepage:', err);
    }
  };

  useEffect(() => {
    fetchRealPosts();

    const handleUpdate = () => fetchRealPosts();
    window.addEventListener('techfnm_blogs_updated', handleUpdate);
    window.addEventListener('techfnm_content_updated', handleUpdate);
    return () => {
      window.removeEventListener('techfnm_blogs_updated', handleUpdate);
      window.removeEventListener('techfnm_content_updated', handleUpdate);
    };
  }, []);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Recent';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  return (
    <section className="py-24 sm:py-32 bg-black relative overflow-hidden border-t border-white/5">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-14 sm:mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#1B1B1B] border border-white/10 rounded-full px-4 py-1.5 mb-5 w-fit">
              <span className="w-2 h-2 rounded-full bg-[#e5432e]" />
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-zinc-300 uppercase">
                {content.blogs_badge || 'Latest Blogs'}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
              {content.blogs_heading || 'Insights tips & trends from the world of marketing'}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
              {content.blogs_desc ||
                'Stay informed with valuable insights, practical tips, and the latest trends from the ever-evolving world of marketing.'}
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link
              to={content.blogs_btn_link && content.blogs_btn_link !== '/portfolio' ? content.blogs_btn_link : '/blog'}
              className="group inline-flex items-center gap-3 bg-[#1B1B1B] hover:bg-[#222225] border border-white/15 hover:border-[#e5432e]/40 text-white px-6 py-3.5 rounded-full text-sm font-semibold transition-all duration-300"
            >
              <span>{content.blogs_btn_text || 'View All Blogs'}</span>
              <span className="w-7 h-7 rounded-full bg-white/10 text-white group-hover:bg-[#e5432e] group-hover:text-white flex items-center justify-center transition-all duration-300">
                <ArrowUpRight size={15} />
              </span>
            </Link>
          </div>
        </div>

        {/* 3 Real Blog Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {posts.map((post, index) => {
            const linkTarget = `/blog/${post.slug || post.id}`;
            return (
              <motion.article
                key={post.id || index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="group bg-[#121214] border border-white/10 hover:border-[#e5432e]/50 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-[#e5432e]/10"
              >
                <Link to={linkTarget} className="block">
                  {/* Thumbnail Image */}
                  <div className="relative h-60 w-full overflow-hidden bg-zinc-900">
                    <img
                      src={post.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'}
                      alt={post.title}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-95"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.src = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80';
                      }}
                    />
                    <div className="absolute top-4 left-4">
                      <span className="bg-black/85 backdrop-blur-md border border-white/10 text-[#e5432e] text-xs font-semibold px-3 py-1 rounded-full">
                        {post.category || 'General'}
                      </span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-7">
                    <div className="flex items-center gap-2 text-xs text-zinc-400 mb-3">
                      <Calendar size={13} className="text-[#e5432e]" />
                      <span>{formatDate(post.created_at || post.date)}</span>
                    </div>
                    <h3 className="text-xl font-bold text-white group-hover:text-[#e5432e] transition-colors leading-snug line-clamp-2">
                      {post.title}
                    </h3>
                  </div>
                </Link>

                {/* Read More link */}
                <div className="px-7 pb-7 pt-2 flex items-center justify-between border-t border-white/5 mt-auto">
                  <Link
                    to={linkTarget}
                    className="text-xs sm:text-sm font-semibold text-zinc-300 group-hover:text-[#e5432e] transition-colors inline-flex items-center gap-2"
                  >
                    <span>Read Full Article</span>
                    <ArrowUpRight size={14} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                  </Link>
                  <Link
                    to={linkTarget}
                    className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 group-hover:bg-[#e5432e] group-hover:text-white transition-all"
                  >
                    <ArrowUpRight size={14} />
                  </Link>
                </div>
              </motion.article>
            );
          })}
        </div>
      </div>
    </section>
  );
}


import { useEffect, useState, useCallback } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Calendar, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';
import { usePageContent } from '../lib/cmsContent';
import { supabase } from '../lib/supabase';

export interface LiveBlogPost {
  id: string | number;
  title: string;
  slug?: string;
  image?: string;
  category?: string;
  created_at?: string;
  date?: string;
  status?: string;
  author?: string;
}

// Clean helper to filter out legacy dummy/fallback posts from stale local cache
const isDummyPost = (p: any): boolean => {
  if (!p) return true;
  const dummySlugs = [
    'stress-free-uk-airport-transfers',
    '5-digital-marketing-strategies',
    'the-power-of-brand',
    'mobile-friendly-websites'
  ];
  const dummyIds = ['f1', 'f2', 'f3', 'f4'];
  return (
    dummyIds.includes(String(p.id)) ||
    dummySlugs.includes(String(p.slug)) ||
    (typeof p.title === 'string' && p.title.toLowerCase().includes('uk airport transfers'))
  );
};

export default function LatestBlogs() {
  const content = usePageContent('page-home', {
    blogs_badge: 'Latest Blogs',
    blogs_heading: 'Insights tips & trends from the world of marketing',
    blogs_desc: 'Stay informed with valuable insights, practical tips, and the latest trends from the ever-evolving world of marketing.',
    blogs_btn_text: 'View All Blogs',
    blogs_btn_link: '/blog'
  });

  const [loading, setLoading] = useState(true);
  const [posts, setPosts] = useState<LiveBlogPost[]>(() => {
    try {
      const cached = localStorage.getItem('techfnm_blogs_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) {
          const liveOnly = parsed.filter(
            (p: any) => !isDummyPost(p) && (p.status === 'published' || !p.status)
          );
          if (liveOnly.length > 0) {
            return liveOnly.slice(0, 3);
          }
        }
      }
    } catch {
      // ignore
    }
    return [];
  });

  const fetchLiveBlogs = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) {
        console.error('Error fetching live blogs:', error);
        return;
      }

      if (Array.isArray(data)) {
        const publishedLive = data.filter(
          (p: any) => !isDummyPost(p) && (p.status === 'published' || !p.status)
        );

        setPosts(publishedLive.slice(0, 3));
        localStorage.setItem('techfnm_blogs_cache', JSON.stringify(publishedLive));
      }
    } catch (err) {
      console.error('Error in fetchLiveBlogs:', err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchLiveBlogs();

    // Listen to local app events when blog is created/updated in Admin
    const handleUpdate = () => {
      fetchLiveBlogs();
    };

    window.addEventListener('techfnm_blogs_updated', handleUpdate);
    window.addEventListener('techfnm_content_updated', handleUpdate);

    // Supabase Realtime subscription for live sync
    const channel = supabase
      .channel('homepage_blogs_live_sync')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'blogs' },
        () => {
          fetchLiveBlogs();
        }
      )
      .subscribe();

    return () => {
      window.removeEventListener('techfnm_blogs_updated', handleUpdate);
      window.removeEventListener('techfnm_content_updated', handleUpdate);
      supabase.removeChannel(channel);
    };
  }, [fetchLiveBlogs]);

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
              <span className="w-2 h-2 rounded-full bg-[#e5432e] animate-pulse" />
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

        {/* Blog Cards Grid */}
        {loading && posts.length === 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {[1, 2, 3].map((n) => (
              <div
                key={n}
                className="bg-[#121214] border border-white/5 rounded-3xl overflow-hidden animate-pulse flex flex-col justify-between"
              >
                <div className="h-60 w-full bg-zinc-800/50" />
                <div className="p-7 space-y-4">
                  <div className="h-3 w-24 bg-zinc-800 rounded" />
                  <div className="h-6 w-full bg-zinc-800 rounded" />
                  <div className="h-4 w-3/4 bg-zinc-800/70 rounded" />
                </div>
                <div className="px-7 pb-7 pt-4 border-t border-white/5 flex items-center justify-between">
                  <div className="h-4 w-28 bg-zinc-800 rounded" />
                  <div className="w-8 h-8 rounded-full bg-zinc-800" />
                </div>
              </div>
            ))}
          </div>
        ) : posts.length === 0 ? (
          <div className="text-center py-16 px-4 bg-[#121214]/60 border border-white/5 rounded-3xl max-w-xl mx-auto">
            <div className="w-12 h-12 rounded-full bg-[#1B1B1B] border border-white/10 flex items-center justify-center mx-auto mb-4 text-[#e5432e]">
              <Sparkles size={20} />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">No Articles Published Yet</h3>
            <p className="text-sm text-zinc-400">
              New industry insights and articles will appear here once published from the admin panel.
            </p>
          </div>
        ) : (
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
                      <img width={800} height={500} loading="lazy" decoding="async"
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
        )}
      </div>
    </section>
  );
}



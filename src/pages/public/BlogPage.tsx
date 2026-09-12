import { useEffect, useState, useMemo } from 'react';
import { motion } from 'motion/react';
import { ArrowUpRight, Calendar, Search, Tag } from 'lucide-react';
import { Link } from 'react-router-dom';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SeoHead from '../../components/SeoHead';
import { supabase } from '../../lib/supabase';

export interface BlogPost {
  id: string | number;
  title: string;
  slug: string;
  content: string;
  image: string;
  category?: string;
  author?: string;
  status?: string;
  created_at?: string;
  date?: string;
  meta_description?: string;
}

const FALLBACK_BLOGS: BlogPost[] = [
  {
    id: 'f1',
    title: 'Stress-Free UK Airport Transfers: Why Pre-Booking Your Journey Makes Sense',
    slug: 'stress-free-uk-airport-transfers',
    category: 'General',
    image: 'https://rpnaqrmquddupmxvvcjg.supabase.co/storage/v1/object/public/agency-assets/blogs/0.6338765301290266.png',
    content: 'Travelling to or from the airport should be simple, comfortable and reliable. Whether you are heading away for a holiday, travelling for business, or picking up family from the airport, arranging your transport in advance can make the entire journey much easier...',
    author: 'admin',
    created_at: new Date('2026-08-18T01:33:13Z').toISOString()
  },
  {
    id: 'f2',
    title: '5 Digital Marketing Strategies to Grow Your Business Online',
    slug: '5-digital-marketing-strategies',
    category: 'Digital Strategy',
    image: 'https://demo.awaikenthemes.com/fexora/wp-content/uploads/2026/05/post-1.jpg',
    content: 'Digital marketing continues to evolve at breakneck speeds. Explore the top five growth strategies ambitious brands are using today to accelerate conversions and organic reach...',
    author: 'admin',
    created_at: new Date('2026-08-20T10:00:00Z').toISOString()
  },
  {
    id: 'f3',
    title: 'The Power of Brand in Building a Strong Business Identity',
    slug: 'the-power-of-brand',
    category: 'Branding',
    image: 'https://demo.awaikenthemes.com/fexora/wp-content/uploads/2026/05/post-2.jpg',
    content: 'A powerful brand identity builds immediate trust and commands market authority. Discover how purposeful typography, colors, and messaging transform customer loyalty...',
    author: 'admin',
    created_at: new Date('2026-08-21T12:30:00Z').toISOString()
  },
  {
    id: 'f4',
    title: 'Why Mobile Friendly Websites Are Essential for SEO & Conversions',
    slug: 'mobile-friendly-websites',
    category: 'Web Engineering',
    image: 'https://demo.awaikenthemes.com/fexora/wp-content/uploads/2026/05/post-3.jpg',
    content: 'Over 65% of all web traffic originates from mobile devices. Learn why mobile-first design, speed optimization, and responsive architectures are non-negotiable for 2026...',
    author: 'admin',
    created_at: new Date('2026-08-22T14:15:00Z').toISOString()
  }
];

export default function BlogPage() {
  const [blogs, setBlogs] = useState<BlogPost[]>(() => {
    try {
      const cached = localStorage.getItem('techfnm_blogs_cache');
      if (cached) {
        const parsed = JSON.parse(cached);
        if (Array.isArray(parsed) && parsed.length > 0) return parsed;
      }
    } catch {}
    return FALLBACK_BLOGS;
  });

  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');

  const fetchBlogs = async () => {
    try {
      const { data } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (data && data.length > 0) {
        // If DB has posts, merge with fallbacks to ensure rich experience
        const realSlugs = new Set(data.map((p: any) => p.slug || p.id));
        const nonDuplicateFallbacks = FALLBACK_BLOGS.filter(fb => !realSlugs.has(fb.slug));
        const combined = [...data, ...nonDuplicateFallbacks];
        setBlogs(combined);
        localStorage.setItem('techfnm_blogs_cache', JSON.stringify(data));
      }
    } catch (err) {
      console.error('Error fetching blogs:', err);
    }
  };

  useEffect(() => {
    fetchBlogs();

    const onBlogsUpdated = () => fetchBlogs();
    window.addEventListener('techfnm_blogs_updated', onBlogsUpdated);
    return () => window.removeEventListener('techfnm_blogs_updated', onBlogsUpdated);
  }, []);

  // Categories list
  const categories = useMemo(() => {
    const set = new Set<string>();
    blogs.forEach(b => {
      if (b.category && b.category.trim()) set.add(b.category.trim());
    });
    return ['All', ...Array.from(set)];
  }, [blogs]);

  // Filtered blogs
  const filteredBlogs = useMemo(() => {
    return blogs.filter(blog => {
      const matchesCategory =
        selectedCategory === 'All' ||
        (blog.category && blog.category.toLowerCase() === selectedCategory.toLowerCase());

      const matchesSearch =
        !searchQuery.trim() ||
        blog.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        (blog.content && blog.content.toLowerCase().includes(searchQuery.toLowerCase())) ||
        (blog.category && blog.category.toLowerCase().includes(searchQuery.toLowerCase()));

      return matchesCategory && matchesSearch;
    });
  }, [blogs, selectedCategory, searchQuery]);

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Recent';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  const stripHtml = (html: string) => {
    if (!html) return '';
    return html.replace(/<[^>]*>?/gm, '').slice(0, 140) + '...';
  };

  return (
    <div className="min-h-screen bg-black font-sans text-white scroll-smooth overflow-x-hidden w-full flex flex-col justify-between">
      <SeoHead pageId="blog" />
      <Header />

      <main className="flex-grow pt-28 sm:pt-32 pb-24">
        {/* HERO SECTION */}
        <section className="relative overflow-hidden px-4 sm:px-6 lg:px-8 pb-16 sm:pb-20 border-b border-white/10">
          <div className="pointer-events-none absolute left-1/2 top-0 -translate-x-1/2 -translate-y-1/2 w-[700px] h-[500px] bg-[#e5432e]/10 blur-[140px] rounded-full" />

          <div className="max-w-7xl mx-auto relative z-10 text-center space-y-6">
            {/* Tagline Badge */}
            <div className="inline-flex items-center gap-2 bg-[#1B1B1B] border border-white/10 rounded-full px-4 py-1.5 w-fit mx-auto">
              <span className="w-2 h-2 rounded-full bg-[#e5432e]" />
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-zinc-300 uppercase">
                Articles & Insights
              </span>
            </div>

            <h1 className="text-4xl sm:text-5xl md:text-6xl font-extrabold text-white tracking-tight leading-[1.15] max-w-4xl mx-auto">
              Explore Our Latest <span className="text-[#e5432e]">Insights</span> & Industry Knowledge
            </h1>

            <p className="text-base sm:text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Stay ahead with curated perspectives on modern engineering, high-conversion web design, digital marketing, and business acceleration.
            </p>

            {/* Search & Category Filter Bar */}
            <div className="pt-6 max-w-2xl mx-auto space-y-5">
              {/* Search Box */}
              <div className="relative">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-zinc-400" size={18} />
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  placeholder="Search articles by title, topic, or keyword..."
                  className="w-full bg-[#121214] border border-white/15 focus:border-[#e5432e] text-white pl-11 pr-4 py-3.5 rounded-full text-sm outline-none transition-all placeholder:text-zinc-500 shadow-inner"
                />
              </div>

              {/* Category Pills */}
              <div className="flex flex-wrap items-center justify-center gap-2 pt-2">
                {categories.map((cat) => {
                  const active = selectedCategory.toLowerCase() === cat.toLowerCase();
                  return (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      type="button"
                      className={`px-4 py-1.5 rounded-full text-xs sm:text-sm font-medium transition-all duration-200 cursor-pointer ${
                        active
                          ? 'bg-[#e5432e] text-white shadow-lg shadow-[#e5432e]/25 font-semibold'
                          : 'bg-[#121214] text-zinc-400 hover:text-white border border-white/10 hover:border-white/20'
                      }`}
                    >
                      {cat}
                    </button>
                  );
                })}
              </div>
            </div>
          </div>
        </section>

        {/* BLOG GRID */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 sm:pt-20">
          {filteredBlogs.length === 0 ? (
            <div className="text-center py-20 bg-[#121214] border border-white/10 rounded-3xl p-10 max-w-md mx-auto space-y-4">
              <Tag size={40} className="mx-auto text-zinc-600" />
              <h3 className="text-lg font-bold text-white">No articles found</h3>
              <p className="text-sm text-zinc-400">
                Try searching for another keyword or selecting "All" categories.
              </p>
              <button
                onClick={() => {
                  setSearchQuery('');
                  setSelectedCategory('All');
                }}
                className="bg-[#e5432e] hover:bg-[#cc3622] text-white px-5 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer"
              >
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {filteredBlogs.map((blog, idx) => (
                <motion.article
                  key={blog.id || idx}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.4, delay: (idx % 6) * 0.08 }}
                  className="group bg-[#121214] border border-white/10 hover:border-[#e5432e]/50 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between hover:shadow-xl hover:shadow-[#e5432e]/10"
                >
                  <Link to={`/blog/${blog.slug || blog.id}`} className="block">
                    {/* Thumbnail Image */}
                    <div className="relative h-60 w-full overflow-hidden bg-zinc-900">
                      <img
                        src={blog.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'}
                        alt={blog.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-95"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.src = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80';
                        }}
                      />
                      <div className="absolute top-4 left-4">
                        <span className="bg-black/85 backdrop-blur-md border border-white/10 text-[#e5432e] text-xs font-semibold px-3 py-1 rounded-full">
                          {blog.category || 'General'}
                        </span>
                      </div>
                    </div>

                    {/* Content */}
                    <div className="p-7 space-y-3">
                      <div className="flex items-center gap-2 text-xs text-zinc-400">
                        <Calendar size={13} className="text-[#e5432e]" />
                        <span>{formatDate(blog.created_at || blog.date)}</span>
                        {blog.author && (
                          <>
                            <span>•</span>
                            <span className="capitalize">{blog.author}</span>
                          </>
                        )}
                      </div>

                      <h2 className="text-xl font-bold text-white group-hover:text-[#e5432e] transition-colors leading-snug line-clamp-2">
                        {blog.title}
                      </h2>

                      <p className="text-sm text-zinc-400 line-clamp-3 leading-relaxed">
                        {stripHtml(blog.content)}
                      </p>
                    </div>
                  </Link>

                  {/* Read Article Link */}
                  <div className="px-7 pb-7 pt-2 flex items-center justify-between border-t border-white/5 mt-auto">
                    <Link
                      to={`/blog/${blog.slug || blog.id}`}
                      className="text-xs sm:text-sm font-semibold text-zinc-300 group-hover:text-[#e5432e] transition-colors inline-flex items-center gap-2"
                    >
                      <span>Read Full Article</span>
                      <ArrowUpRight size={14} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>
                    <Link
                      to={`/blog/${blog.slug || blog.id}`}
                      className="w-8 h-8 rounded-full bg-white/5 flex items-center justify-center text-zinc-400 group-hover:bg-[#e5432e] group-hover:text-white transition-all"
                    >
                      <ArrowUpRight size={14} />
                    </Link>
                  </div>
                </motion.article>
              ))}
            </div>
          )}
        </section>

        {/* BOTTOM CONSULTATION CTA */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24">
          <div className="relative rounded-3xl bg-gradient-to-b from-[#18181B] to-[#121214] border border-white/10 p-8 sm:p-12 lg:p-16 overflow-hidden text-center space-y-6">
            <div className="pointer-events-none absolute inset-0 bg-radial from-[#e5432e]/10 to-transparent blur-2xl" />
            
            <span className="inline-block py-1 px-3.5 rounded-full bg-[#e5432e]/10 text-[#e5432e] text-xs font-bold uppercase tracking-wider border border-[#e5432e]/25">
              Let's Scale Your Digital Presence
            </span>

            <h3 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white tracking-tight max-w-2xl mx-auto">
              Ready to Turn These Ideas Into Real Growth For Your Business?
            </h3>

            <p className="text-zinc-400 text-sm sm:text-base max-w-xl mx-auto">
              Book a complimentary discovery call with our technical architects and discover how custom web software and digital marketing can multiply your revenue.
            </p>

            <div className="pt-2">
              <Link
                to="/request-service"
                className="group inline-flex items-center gap-3 bg-[#e5432e] hover:bg-[#cc3622] text-white px-7 py-3.5 rounded-full text-sm font-semibold transition-all duration-300 shadow-xl shadow-[#e5432e]/20 hover:scale-[1.02]"
              >
                <span>Book Free Strategy Session</span>
                <span className="w-6 h-6 rounded-full bg-white text-[#e5432e] flex items-center justify-center transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                  <ArrowUpRight size={13} />
                </span>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}

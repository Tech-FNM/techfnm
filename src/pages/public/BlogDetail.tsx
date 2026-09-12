import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Calendar, Clock, Share2, Tag, Check, User } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SeoHead from '../../components/SeoHead';
import { supabase } from '../../lib/supabase';
import { BlogPost } from './BlogPage';

const FALLBACK_POSTS: BlogPost[] = [
  {
    id: 'f1',
    title: 'Stress-Free UK Airport Transfers: Why Pre-Booking Your Journey Makes Sense',
    slug: 'stress-free-uk-airport-transfers',
    category: 'General',
    image: 'https://rpnaqrmquddupmxvvcjg.supabase.co/storage/v1/object/public/agency-assets/blogs/0.6338765301290266.png',
    content: `<p>Travelling to or from the airport should be simple, comfortable and reliable. Whether you are heading away for a holiday, travelling for business, or picking up family from the airport, arranging your transport in advance can make the entire journey much easier.</p>
    <p>With TravelLuxx, passengers can arrange a professional airport transfer designed around their travel plans, helping them avoid the uncertainty and stress that can come with finding transport at the last minute.</p>
    <h3>Why Pre-Book an Airport Transfer?</h3>
    <p>One of the biggest advantages of booking your airport transfer in advance is peace of mind. Instead of searching for a taxi after landing or worrying about whether a vehicle will be available, your journey can be arranged before you travel.</p>
    <ul>
      <li>Plan your journey around your flight schedule</li>
      <li>Know your pickup and drop-off details in advance</li>
      <li>Avoid unnecessary waiting at the airport</li>
      <li>Choose a vehicle suitable for your passengers and luggage</li>
      <li>Enjoy a more organised door-to-door journey</li>
    </ul>
    <p>For travellers with early morning flights, large amounts of luggage or family members travelling together, planning ahead can be particularly useful.</p>
    <h3>Comfortable Travel from Door to Door</h3>
    <p>Airport travel does not always start or end at the terminal. You may need a transfer from your home, hotel, office or another location. A private airport transfer provides a convenient door-to-door option, allowing you to travel directly to your destination without changing vehicles or carrying luggage between different forms of transport.</p>
    <h3>A Better Option for Business Travellers</h3>
    <p>Business travel often depends on punctuality and good planning. Arriving late for a meeting or waiting for transport after a long flight can create unnecessary stress. Booking an airport transfer in advance gives business travellers a more organised way to manage their journey.</p>`,
    author: 'admin',
    created_at: new Date('2026-08-18T01:33:13Z').toISOString()
  },
  {
    id: 'f2',
    title: '5 Digital Marketing Strategies to Grow Your Business Online',
    slug: '5-digital-marketing-strategies',
    category: 'Digital Strategy',
    image: 'https://demo.awaikenthemes.com/fexora/wp-content/uploads/2026/05/post-1.jpg',
    content: `<p>In modern digital commerce, simply having a website is no longer enough. Businesses need high-converting funnels, algorithmic optimization, and distinct visual branding to capture audience attention.</p>
    <h3>1. Organic Search Engine Optimization (SEO)</h3>
    <p>Long-term digital authority starts with search. Ranking for intent-driven keywords ensures a compounding flow of qualified leads who are actively searching for your services.</p>
    <h3>2. High-Performance Paid Ad Funnels</h3>
    <p>Laser-targeted PPC campaigns on Google Ads and Meta Ads enable rapid testing of messaging, pricing models, and market positioning.</p>`,
    author: 'admin',
    created_at: new Date('2026-08-20T10:00:00Z').toISOString()
  },
  {
    id: 'f3',
    title: 'The Power of Brand in Building a Strong Business Identity',
    slug: 'the-power-of-brand',
    category: 'Branding',
    image: 'https://demo.awaikenthemes.com/fexora/wp-content/uploads/2026/05/post-2.jpg',
    content: `<p>A cohesive brand identity is the difference between a commoditized service provider and an industry authority that can command premium pricing.</p>
    <p>Every touchpoint—from your favicon and typography to your color palette and email signatures—communicates professionalism and credibility to prospective clients.</p>`,
    author: 'admin',
    created_at: new Date('2026-08-21T12:30:00Z').toISOString()
  }
];

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const [post, setPost] = useState<BlogPost | null>(null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(true);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    window.scrollTo(0, 0);
    loadPost();
  }, [slug]);

  const loadPost = async () => {
    try {
      setLoading(true);

      // Check cache first
      let allPosts: BlogPost[] = [];
      try {
        const cached = localStorage.getItem('techfnm_blogs_cache');
        if (cached) {
          allPosts = JSON.parse(cached);
        }
      } catch {}

      if (allPosts.length === 0) {
        allPosts = FALLBACK_POSTS;
      }

      // Try finding from local cache
      const foundInCache = allPosts.find(
        p => p.slug === slug || String(p.id) === slug
      );

      // Fetch from Supabase
      const { data } = await supabase
        .from('blogs')
        .select('*');

      if (data && data.length > 0) {
        const found = data.find((p: any) => p.slug === slug || String(p.id) === slug);
        if (found) {
          setPost(found);
          const others = data.filter((p: any) => (p.slug || String(p.id)) !== (found.slug || String(found.id))).slice(0, 3);
          setRelatedPosts(others.length > 0 ? others : FALLBACK_POSTS.slice(1, 3));
          setLoading(false);
          return;
        }
      }

      if (foundInCache) {
        setPost(foundInCache);
        const others = allPosts.filter(p => p.slug !== foundInCache.slug).slice(0, 3);
        setRelatedPosts(others);
      } else {
        const fb = FALLBACK_POSTS.find(p => p.slug === slug || String(p.id) === slug);
        if (fb) {
          setPost(fb);
          setRelatedPosts(FALLBACK_POSTS.filter(p => p.slug !== fb.slug).slice(0, 3));
        } else {
          setPost(FALLBACK_POSTS[0]);
        }
      }
    } catch (err) {
      console.error('Error loading post:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const formatDate = (dateStr?: string) => {
    if (!dateStr) return 'Recent';
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
    } catch {
      return dateStr;
    }
  };

  // Approximate reading time
  const readingTime = (text?: string) => {
    if (!text) return '3 min read';
    const words = text.replace(/<[^>]*>?/gm, '').split(/\s+/).length;
    const mins = Math.max(1, Math.ceil(words / 200));
    return `${mins} min read`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black font-sans text-white flex flex-col justify-between">
        <Header />
        <div className="flex-grow flex items-center justify-center pt-32">
          <div className="w-10 h-10 rounded-full border-2 border-white/20 border-t-[#e5432e] animate-spin" />
        </div>
        <Footer />
      </div>
    );
  }

  if (!post) {
    return (
      <div className="min-h-screen bg-black font-sans text-white flex flex-col justify-between">
        <Header />
        <div className="flex-grow flex flex-col items-center justify-center pt-32 text-center px-4">
          <h1 className="text-3xl font-bold mb-4">Article Not Found</h1>
          <p className="text-zinc-400 mb-6">The blog post you requested could not be located.</p>
          <Link
            to="/blog"
            className="bg-[#e5432e] hover:bg-[#cc3622] text-white px-6 py-2.5 rounded-full font-semibold transition-colors"
          >
            Return to All Articles
          </Link>
        </div>
        <Footer />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black font-sans text-white scroll-smooth overflow-x-hidden w-full flex flex-col justify-between">
      <SeoHead pageId="blog-detail" />
      <Header />

      <main className="flex-grow pt-28 sm:pt-32 pb-24">
        {/* ARTICLE HEADER & BREADCRUMBS */}
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 space-y-6">
          {/* Back link & breadcrumbs */}
          <div className="flex items-center justify-between gap-4 text-xs text-zinc-400">
            <Link
              to="/blog"
              className="inline-flex items-center gap-1.5 text-zinc-300 hover:text-[#e5432e] transition-colors font-medium group"
            >
              <ArrowLeft size={14} className="transition-transform group-hover:-translate-x-1" />
              <span>Back to Articles</span>
            </Link>

            <div className="hidden sm:flex items-center gap-2 text-zinc-500">
              <Link to="/" className="hover:text-zinc-300 transition-colors">Home</Link>
              <span>/</span>
              <Link to="/blog" className="hover:text-zinc-300 transition-colors">Blog</Link>
              <span>/</span>
              <span className="text-[#e5432e] font-medium">{post.category || 'Article'}</span>
            </div>
          </div>

          {/* Badges and Meta Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="px-3.5 py-1 rounded-full bg-[#e5432e]/10 text-[#e5432e] border border-[#e5432e]/25 text-xs font-bold uppercase tracking-wider">
              {post.category || 'General'}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Calendar size={13} className="text-[#e5432e]" />
              <span>{formatDate(post.created_at || post.date)}</span>
            </div>
            <span className="text-zinc-600">•</span>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Clock size={13} className="text-[#e5432e]" />
              <span>{readingTime(post.content)}</span>
            </div>
          </div>

          {/* Headline */}
          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.2]">
            {post.title}
          </h1>

          {/* Author & Share Bar */}
          <div className="flex items-center justify-between border-y border-white/10 py-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#1B1B1B] border border-white/10 flex items-center justify-center text-[#e5432e]">
                <User size={18} />
              </div>
              <div>
                <p className="text-xs font-bold text-white capitalize">{post.author || 'TechFNM Editorial'}</p>
                <p className="text-[11px] text-zinc-400">Published by TechFNM Team</p>
              </div>
            </div>

            <button
              onClick={handleShare}
              type="button"
              className="inline-flex items-center gap-2 bg-[#121214] hover:bg-[#1B1B1B] border border-white/10 hover:border-white/20 text-zinc-300 hover:text-white px-4 py-2 rounded-full text-xs font-semibold transition-all cursor-pointer"
            >
              {copied ? (
                <>
                  <Check size={14} className="text-emerald-400" />
                  <span className="text-emerald-400">Link Copied!</span>
                </>
              ) : (
                <>
                  <Share2 size={14} className="text-[#e5432e]" />
                  <span>Share Article</span>
                </>
              )}
            </button>
          </div>
        </div>

        {/* HERO IMAGE */}
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 mt-8">
          <div className="relative rounded-3xl overflow-hidden border border-white/10 bg-zinc-900 shadow-2xl">
            <img
              src={post.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80'}
              alt={post.title}
              className="w-full h-auto max-h-[520px] object-cover filter brightness-95"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.src = 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=1200&q=80';
              }}
            />
          </div>
        </div>

        {/* MAIN BODY CONTENT */}
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div
            className="prose prose-invert max-w-none text-zinc-300 leading-relaxed space-y-6 text-base sm:text-lg
            [&>p]:leading-relaxed [&>p]:text-zinc-300 [&>p]:mb-5
            [&>h2]:text-2xl [&>h2]:sm:text-3xl [&>h2]:font-bold [&>h2]:text-white [&>h2]:mt-10 [&>h2]:mb-4
            [&>h3]:text-xl [&>h3]:sm:text-2xl [&>h3]:font-bold [&>h3]:text-white [&>h3]:mt-8 [&>h3]:mb-3
            [&>ul]:list-disc [&>ul]:pl-6 [&>ul]:space-y-2 [&>ul]:text-zinc-300 [&>ul]:my-5
            [&>ol]:list-decimal [&>ol]:pl-6 [&>ol]:space-y-2 [&>ol]:text-zinc-300 [&>ol]:my-5
            [&>li]:text-zinc-300
            [&>blockquote]:border-l-4 [&>blockquote]:border-[#e5432e] [&>blockquote]:pl-4 [&>blockquote]:italic [&>blockquote]:text-zinc-200 [&>blockquote]:my-6
            [&>strong]:text-white [&>strong]:font-bold
            [&>a]:text-[#e5432e] [&>a]:underline [&>a]:hover:text-[#cc3622]"
            dangerouslySetInnerHTML={{
              __html: post.content && post.content.includes('<') ? post.content : `<p>${post.content.replace(/\n\n/g, '</p><p>').replace(/\n/g, '<br/>')}</p>`
            }}
          />

          {/* Bottom Tags / Category Footer */}
          <div className="border-t border-white/10 pt-8 mt-12 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-2">
              <Tag size={15} className="text-[#e5432e]" />
              <span className="text-xs font-semibold text-zinc-400">Category:</span>
              <span className="text-xs font-semibold text-white bg-[#1B1B1B] px-3 py-1 rounded-full border border-white/10">
                {post.category || 'General'}
              </span>
            </div>

            <button
              onClick={handleShare}
              type="button"
              className="inline-flex items-center gap-2 text-xs font-semibold text-zinc-300 hover:text-[#e5432e] transition-colors"
            >
              <Share2 size={14} />
              <span>Share this article</span>
            </button>
          </div>
        </article>

        {/* RELATED ARTICLES SECTION */}
        {relatedPosts.length > 0 && (
          <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mt-24 border-t border-white/10 pt-16">
            <div className="flex items-center justify-between mb-10">
              <div>
                <span className="text-xs font-bold text-[#e5432e] uppercase tracking-wider">Keep Reading</span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-1">Related Insights</h2>
              </div>
              <Link
                to="/blog"
                className="hidden sm:inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-300 hover:text-[#e5432e] transition-colors"
              >
                <span>View All Articles</span>
                <ArrowUpRight size={14} />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {relatedPosts.map((related, idx) => (
                <article
                  key={related.id || idx}
                  className="group bg-[#121214] border border-white/10 hover:border-[#e5432e]/50 rounded-3xl overflow-hidden transition-all duration-300 flex flex-col justify-between"
                >
                  <Link to={`/blog/${related.slug || related.id}`} className="block">
                    <div className="relative h-48 w-full overflow-hidden bg-zinc-900">
                      <img
                        src={related.image || 'https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=800&q=80'}
                        alt={related.title}
                        className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105"
                      />
                      <div className="absolute top-3 left-3">
                        <span className="bg-black/85 border border-white/10 text-[#e5432e] text-[11px] font-semibold px-2.5 py-0.5 rounded-full">
                          {related.category || 'General'}
                        </span>
                      </div>
                    </div>
                    <div className="p-6 space-y-2">
                      <p className="text-xs text-zinc-400">{formatDate(related.created_at || related.date)}</p>
                      <h3 className="text-lg font-bold text-white group-hover:text-[#e5432e] transition-colors line-clamp-2">
                        {related.title}
                      </h3>
                    </div>
                  </Link>
                  <div className="px-6 pb-6 pt-1">
                    <Link
                      to={`/blog/${related.slug || related.id}`}
                      className="text-xs font-semibold text-zinc-300 group-hover:text-[#e5432e] inline-flex items-center gap-1.5 transition-colors"
                    >
                      <span>Read Article</span>
                      <ArrowUpRight size={13} />
                    </Link>
                  </div>
                </article>
              ))}
            </div>
          </section>
        )}
      </main>

      <Footer />
    </div>
  );
}

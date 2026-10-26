import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight, Calendar, Clock, Share2, Tag, Check, User } from 'lucide-react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SeoHead from '../../components/SeoHead';
import { supabase } from '../../lib/supabase';
import { BlogPost, readCachedPosts } from './BlogPage';
import { isPublishedPost } from '../../lib/seoDefaults.js';
import NotFound from './NotFound';

const matches = (p: any, slug?: string) => !!p && (p.slug === slug || String(p.id) === slug);

// CMS bodies are either HTML or plain text with blank-line paragraphs. The page already has an H1.
const renderBody = (content?: string) => {
  const body = String(content || '');
  if (!body.trim()) return '';
  if (/<[a-z][\s\S]*>/i.test(body)) return body.replace(/<h1(\s|>)/gi, '<h2$1').replace(/<\/h1>/gi, '</h2>');
  const escaped = body.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
  return `<p>${escaped.replace(/\n{2,}/g, '</p><p>').replace(/\n/g, '<br/>')}</p>`;
};

export default function BlogDetail() {
  const { slug } = useParams<{ slug: string }>();
  // Paint instantly from the cached list when we have it; the network copy replaces it.
  const [post, setPost] = useState<BlogPost | null>(() => readCachedPosts().find((p) => matches(p, slug)) || null);
  const [relatedPosts, setRelatedPosts] = useState<BlogPost[]>([]);
  const [loading, setLoading] = useState(() => !post);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    let alive = true;
    const cached = readCachedPosts();
    const fromCache = cached.find((p) => matches(p, slug)) || null;
    setPost(fromCache);
    setRelatedPosts(cached.filter((p) => !matches(p, slug)).slice(0, 3));
    setLoading(!fromCache);

    (async () => {
      try {
        const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
        if (!alive || error || !Array.isArray(data)) return;
        const live = data.filter(isPublishedPost);
        // Unknown or unpublished slugs are a real 404 (the server already answers 404 for them)
        const found = live.find((p: any) => matches(p, slug)) || null;
        setPost(found);
        setRelatedPosts(found ? live.filter((p: any) => !matches(p, slug)).slice(0, 3) : []);
      } catch (err) {
        console.error('Error loading post:', err);
      } finally {
        if (alive) setLoading(false);
      }
    })();

    return () => {
      alive = false;
    };
  }, [slug]);

  const handleShare = async () => {
    const shareData = { title: post?.title, url: window.location.href };
    try {
      if (navigator.share) {
        await navigator.share(shareData);
        return;
      }
      await navigator.clipboard.writeText(window.location.href);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // share sheet dismissed or clipboard blocked: nothing to do
    }
  };

  const formatDate = (dateStr?: string) => {
    const d = dateStr ? new Date(dateStr) : null;
    return d && !isNaN(d.getTime()) ? d.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' }) : 'Recent';
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
    // Real 404 page (noindex) instead of a soft-404 or a substitute article
    return <NotFound />;
  }

  return (
    <div className="min-h-screen bg-black font-sans text-white scroll-smooth overflow-x-hidden w-full flex flex-col justify-between">
      <SeoHead
        title={(post as any).seo_settings?.seoTitle || (post as any).meta_title || post.title}
        description={(post as any).seo_settings?.metaDescription || (post as any).meta_description || (post as any).excerpt || String(post.content || '').replace(/<[^>]*>/g, ' ').replace(/[#*_>`\[\]()!-]/g, '').replace(/\s+/g, ' ').trim().slice(0, 155)}
        image={post.image}
        url={`/blog/${post.slug || post.id}`}
        seoSettings={(post as any).seo_settings}
        type="article"
      />
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

            <nav aria-label="Breadcrumb" className="hidden sm:flex items-center gap-2 text-zinc-500">
              <Link to="/" className="hover:text-zinc-300 transition-colors">Home</Link>
              <span aria-hidden="true">/</span>
              <Link to="/blog" className="hover:text-zinc-300 transition-colors">Blog</Link>
              <span aria-hidden="true">/</span>
              <span className="text-[#e5432e] font-medium" aria-current="page">{post.category || 'Article'}</span>
            </nav>
          </div>

          {/* Badges and Meta Bar */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <span className="px-3.5 py-1 rounded-full bg-[#e5432e]/10 text-[#e5432e] border border-[#e5432e]/25 text-xs font-bold uppercase tracking-wider">
              {post.category || 'General'}
            </span>
            <div className="flex items-center gap-1.5 text-xs text-zinc-400">
              <Calendar size={13} className="text-[#e5432e]" />
              <time dateTime={post.created_at || post.date}>{formatDate(post.created_at || post.date)}</time>
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
                <p className="text-xs font-bold text-white capitalize">{post.author && post.author !== 'admin' ? post.author : 'TechFNM Editorial'}</p>
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
            <img decoding="async" fetchPriority="high" width={1200} height={630}
              src={post.image || '/og-preview.png'}
              alt={(post as any).seo_settings?.imageAlt || post.title}
              className="w-full h-auto max-h-[520px] object-cover filter brightness-95"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                if (target.dataset.fallback) return;
                target.dataset.fallback = '1';
                target.src = '/og-preview.png';
              }}
            />
          </div>
        </div>

        {/* MAIN BODY CONTENT */}
        <article className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 mt-12">
          <div
            className="article-content"
            dangerouslySetInnerHTML={{ __html: renderBody(post.content) }}
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
                      <img width={800} height={500} loading="lazy" decoding="async"
                        src={related.image || '/og-preview.png'}
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

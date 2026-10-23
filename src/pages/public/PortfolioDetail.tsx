import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, ArrowUpRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SeoHead from '../../components/SeoHead';
import NotFound from './NotFound';
import { CANONICAL_PROJECTS, getCached } from '../../lib/canonicalData';
import { projectSlug } from '../../lib/revalidate';

// Individual project page: /portfolio/:slug  (slug from the CMS, or "<title>-<id>" when none is set)
export default function PortfolioDetail() {
  const { slug = '' } = useParams();
  const [projects, setProjects] = useState<any[]>(() => getCached('techfnm_projects_cache', CANONICAL_PROJECTS));
  const [loaded, setLoaded] = useState(false);

  useEffect(() => {
    supabase
      .from('projects')
      .select('*')
      .order('id', { ascending: true })
      .then(({ data }) => {
        if (data && data.length) setProjects(data);
        setLoaded(true);
      });
  }, []);

  const p = projects.find((x) => projectSlug(x) === slug || String(x.id) === slug);
  if (!p) return loaded ? <NotFound /> : <div className="min-h-screen bg-black" />;

  const seo = p.seo_settings || {};
  const h1 = seo.h1 || `${p.title} – ${p.category || 'Project'} by TechFNM`;
  const alt = seo.imageAlt || `${p.title} ${p.category || ''} project by TechFNM`;
  const img = p.featured_image || p.image;
  const description =
    seo.metaDescription || String(p.description || '').trim() || `${p.title}: a ${p.category || ''} project delivered by TechFNM.`;

  return (
    <div className="min-h-screen bg-black font-sans text-white flex flex-col justify-between">
      <SeoHead
        title={seo.seoTitle || `${p.title} | ${p.category || 'Portfolio'} Project | TechFNM`}
        description={description}
        image={seo.socialImage || img}
        url={`https://techfnm.com/portfolio/${projectSlug(p)}`}
        seoSettings={seo}
      />
      <Header />
      <main className="flex-grow pt-32 pb-24">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
          <nav className="flex items-center gap-2 text-xs text-zinc-500">
            <Link to="/" className="hover:text-zinc-300">Home</Link>
            <span>/</span>
            <Link to="/portfolio" className="hover:text-zinc-300">Portfolio</Link>
            <span>/</span>
            <span className="text-zinc-300">{p.title}</span>
          </nav>
          <span className="inline-block text-xs font-bold text-red-500 uppercase tracking-wider">{p.category}</span>
          <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight leading-tight">{h1}</h1>
          {img && (
            <img
              src={img}
              alt={alt}
              width={1200}
              height={800}
              fetchPriority="high"
              decoding="async"
              className="w-full h-auto rounded-3xl border border-white/10 bg-zinc-900"
            />
          )}
          <div className="grid gap-6 sm:grid-cols-3 text-sm">
            {p.client_name && (
              <div><span className="block text-zinc-500">Client</span><span className="text-white font-semibold">{p.client_name}</span></div>
            )}
            <div><span className="block text-zinc-500">Service</span><span className="text-white font-semibold">{p.category}</span></div>
            {p.project_url && (
              <div>
                <span className="block text-zinc-500">Live project</span>
                <a href={p.project_url} target="_blank" rel="noopener noreferrer" className="text-red-400 hover:text-red-300 inline-flex items-center gap-1">
                  Visit <ArrowUpRight size={14} />
                </a>
              </div>
            )}
          </div>
          {p.description && <p className="text-zinc-300 text-lg leading-relaxed">{p.description}</p>}
          {p.content && (
            <div className="prose prose-invert max-w-none text-zinc-300" dangerouslySetInnerHTML={{ __html: p.content }} />
          )}
          <div className="flex flex-wrap gap-3 pt-6">
            <Link to="/portfolio" className="inline-flex items-center gap-2 px-5 py-2.5 rounded-full border border-zinc-700 hover:border-zinc-500 font-semibold">
              <ArrowLeft size={16} /> All projects
            </Link>
            <Link to="/contact" className="px-5 py-2.5 rounded-full bg-red-600 hover:bg-red-500 font-semibold">Start a similar project</Link>
          </div>
        </div>
      </main>
      <Footer />
    </div>
  );
}

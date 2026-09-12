import { useEffect, useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { usePageContent } from '../lib/cmsContent';
import { CANONICAL_PROJECTS, getCached, setCached } from '../lib/canonicalData';

const DEFAULT_PROJECTS = [
  {
    id: 1,
    title: 'E-Commerce Growth Platform',
    category: 'Web Development',
    description: 'Custom scalable headless commerce platform with 140% surge in online conversions.',
    image: 'https://demo.awaikenthemes.com/fexora/wp-content/uploads/2026/05/project-1.jpg',
    link: '/portfolio'
  },
  {
    id: 2,
    title: 'Corporate Website Redesign',
    category: 'UI/UX Design',
    description: 'High performance enterprise digital ecosystem with interactive motion architecture.',
    image: 'https://demo.awaikenthemes.com/fexora/wp-content/uploads/2026/05/project-2.jpg',
    link: '/portfolio'
  },
  {
    id: 3,
    title: 'Corporate Brand Identity',
    category: 'Branding & Identity',
    description: 'Complete visual positioning, logo architecture, typography system and guidelines.',
    image: 'https://demo.awaikenthemes.com/fexora/wp-content/uploads/2026/05/project-3.jpg',
    link: '/portfolio'
  }
];

export default function Portfolio() {
  const [projects, setProjects] = useState<any[]>(() => {
    const cached = getCached('techfnm_projects_cache', CANONICAL_PROJECTS);
    return cached && cached.length > 0 ? cached : DEFAULT_PROJECTS;
  });
  const [selectedCategory, setSelectedCategory] = useState<string>('All');

  const pageContent = usePageContent('page-home', {
    portfolio_badge: 'Our Featured Works',
    portfolio_heading: 'Turn ideas into powerful digital experience',
    portfolio_desc: 'We combine creativity, technology, and strategic thinking to deliver digital solutions that help businesses grow and succeed online.',
    portfolio_btn_text: 'View Projects',
    portfolio_btn_link: '/portfolio'
  });

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase.from('projects').select('*').order('id', { ascending: true });
        if (data && data.length > 0) {
          setProjects(data);
          setCached('techfnm_projects_cache', data);
        }
      } catch (err) {
        console.error('Error fetching projects:', err);
      }
    };
    fetchProjects();
  }, []);

  const categories = useMemo(() => {
    const set = new Set<string>();
    projects.forEach(p => {
      if (p.category) set.add(p.category);
    });
    return ['All', ...Array.from(set)];
  }, [projects]);

  const filteredProjects = useMemo(() => {
    if (selectedCategory === 'All') return projects.slice(0, 6);
    return projects.filter(p => p.category === selectedCategory);
  }, [projects, selectedCategory]);

  return (
    <section id="portfolio" className="py-24 sm:py-32 bg-black relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Section Top Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 mb-12 sm:mb-16">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 bg-[#1B1B1B] border border-white/10 rounded-full px-4 py-1.5 mb-5 w-fit">
              <span className="w-2 h-2 rounded-full bg-[#e5432e]" />
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-zinc-300 uppercase">
                {pageContent.portfolio_badge || 'Our Featured Works'}
              </span>
            </div>
            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15]">
              {pageContent.portfolio_heading || 'Turn ideas into powerful digital experience'}
            </h2>
            <p className="mt-4 text-base sm:text-lg text-zinc-400 font-normal leading-relaxed">
              {pageContent.portfolio_desc ||
                'We combine creativity, technology, and strategic thinking to deliver digital solutions that help businesses grow and succeed online.'}
            </p>
          </div>

          <div className="flex-shrink-0">
            <Link
              to={pageContent.portfolio_btn_link || '/portfolio'}
              className="group inline-flex items-center gap-3 bg-[#1B1B1B] hover:bg-[#222225] border border-white/15 hover:border-[#e5432e]/40 text-white px-6 py-3.5 rounded-full text-sm font-semibold transition-all duration-300"
            >
              <span>{pageContent.portfolio_btn_text || 'View Projects'}</span>
              <span className="w-7 h-7 rounded-full bg-white/10 text-white group-hover:bg-[#e5432e] group-hover:text-white flex items-center justify-center transition-all duration-300">
                <ArrowUpRight size={15} />
              </span>
            </Link>
          </div>
        </div>

        {/* Category Filters Pills */}
        <div className="flex flex-wrap items-center gap-2 mb-12">
          {categories.map((cat, idx) => (
            <button
              key={idx}
              onClick={() => setSelectedCategory(cat)}
              className={`px-5 py-2 rounded-full text-xs sm:text-sm font-semibold transition-all duration-200 ${
                selectedCategory === cat
                  ? 'bg-[#e5432e] text-white shadow-md shadow-[#e5432e]/10'
                  : 'bg-[#121214] border border-white/10 text-zinc-400 hover:text-white hover:border-white/20'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Project Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <AnimatePresence mode="popLayout">
            {filteredProjects.map((project, index) => (
              <motion.div
                key={project.id || index}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.4 }}
                className="group relative bg-[#121214] border border-white/10 hover:border-[#e5432e]/40 rounded-3xl overflow-hidden transition-all duration-500 flex flex-col justify-between hover:shadow-xl hover:shadow-[#e5432e]/5"
              >
                {/* Image Container with Hover Zoom */}
                <div className="relative h-64 sm:h-72 w-full overflow-hidden bg-zinc-900">
                  <img
                    src={project.image || 'https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&q=80&w=800'}
                    alt={project.title}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105 filter brightness-95"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-[#121214] via-transparent to-transparent opacity-80" />

                  {/* Category Badge Pill */}
                  <div className="absolute top-4 left-4">
                    <span className="bg-black/80 backdrop-blur-md border border-white/10 text-[#e5432e] text-xs font-semibold px-3.5 py-1.5 rounded-full">
                      {project.category || 'Featured'}
                    </span>
                  </div>
                </div>

                {/* Content Details */}
                <div className="p-6 sm:p-7 flex flex-col justify-between flex-grow">
                  <div>
                    <h3 className="text-xl font-bold text-white mb-2 group-hover:text-[#e5432e] transition-colors tracking-tight">
                      {project.title}
                    </h3>
                    <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2">
                      {project.description}
                    </p>
                  </div>

                  <div className="mt-6 pt-4 border-t border-white/5 flex items-center justify-between">
                    <Link
                      to={project.link || '/portfolio'}
                      className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-zinc-300 group-hover:text-[#e5432e] transition-colors"
                    >
                      <span>Explore Work</span>
                      <ArrowUpRight size={15} className="transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
                    </Link>

                    <div className="w-8 h-8 rounded-full bg-white/5 border border-white/10 flex items-center justify-center text-zinc-400 group-hover:bg-[#e5432e] group-hover:text-white group-hover:border-[#e5432e] transition-all duration-300">
                      <ArrowUpRight size={14} />
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>
    </section>
  );
}

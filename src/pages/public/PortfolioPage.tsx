import { useEffect, useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { ArrowRight, Eye, Briefcase, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SeoHead from '../../components/SeoHead';

export default function PortfolioPage() {
  const [projects, setProjects] = useState<any[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [loading, setLoading] = useState(true);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  // Available categories for filtering
  const categories = ['All', 'Web Development', 'Mobile App', 'UI/UX Design', 'Digital Marketing'];

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('projects').select('*');
      if (data && data.length > 0) {
        setProjects(data);
      } else {
        // Fallback static data
        setProjects([
          {
            id: 1,
            title: 'E-Commerce Platform',
            category: 'Web Development',
            image: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&q=80&w=800',
            description: 'A robust online shopping platform optimized for performance and sales.'
          },
          {
            id: 2,
            title: 'Fitness Tracking App',
            category: 'Mobile App',
            image: 'https://images.unsplash.com/photo-1526506114642-903c5e470580?auto=format&fit=crop&q=80&w=800',
            description: 'Intuitive iOS & Android application tracking real-time health metrics.'
          },
          {
            id: 3,
            title: 'Corporate Dashboard',
            category: 'UI/UX Design',
            image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
            description: 'High-fidelity dashboard designed for comprehensive business insights.'
          },
          {
            id: 4,
            title: 'Real Estate Portal',
            category: 'Web Development',
            image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800',
            description: 'Feature-rich property search engine and catalog for real estate.'
          },
          {
            id: 5,
            title: 'Food Delivery App',
            category: 'Mobile App',
            image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800',
            description: 'Fast, location-based food ordering and tracking application.'
          },
          {
            id: 6,
            title: 'Marketing Campaign',
            category: 'Digital Marketing',
            image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
            description: 'A data-driven SEO & advertising program maximizing brand reach.'
          }
        ]);
      }
    } catch (err) {
      console.error('Error fetching projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const filteredProjects = selectedCategory === 'All'
    ? projects
    : projects.filter(project => project.category?.toLowerCase() === selectedCategory.toLowerCase());

  return (
    <div className="min-h-screen bg-black font-sans text-white scroll-smooth overflow-x-hidden w-full flex flex-col justify-between">
      <SeoHead pageId="portfolio" />
      <Header />

      <main className="flex-grow">
        {/* HERO SECTION */}
        <section className="relative min-h-[55vh] bg-black flex items-center justify-center overflow-hidden border-b border-zinc-900 px-4 sm:px-6 lg:px-8">
          {/* Background Shapes */}
          <div className="absolute top-0 left-0 w-full h-full overflow-hidden z-0">
            <div className="absolute -top-20 -left-20 w-96 h-96 bg-red-900/30 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob"></div>
            <div className="absolute top-0 -right-20 w-96 h-96 bg-orange-900/30 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-2000"></div>
            <div className="absolute -bottom-32 left-20 w-96 h-96 bg-red-800/30 rounded-full mix-blend-screen filter blur-3xl opacity-50 animate-blob animation-delay-4000"></div>
          </div>

          <div className="relative z-10 max-w-3xl mx-auto text-center space-y-6">
            <span className="inline-block py-1 px-3 rounded-full bg-red-900/50 text-red-200 text-sm font-semibold mb-2 border border-red-500/30">
              Selected Works
            </span>
            <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold tracking-tight text-white leading-tight">
              Our Digital Showcase
            </h1>
            <p className="text-zinc-400 text-base sm:text-lg max-w-xl mx-auto leading-relaxed">
              Explore our latest projects and see how we've helped businesses design, build, and scale their digital products.
            </p>
          </div>
        </section>

        {/* PORTFOLIO GRID SECTION */}
        <section className="py-20 bg-zinc-950 px-4 sm:px-6 lg:px-8 border-b border-zinc-900">
          <div className="max-w-7xl mx-auto space-y-12">
            
            {/* Filter Tabs */}
            <div className="flex flex-wrap justify-center gap-3">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-6 py-2.5 rounded-full text-sm font-semibold transition-all border ${
                    selectedCategory === category
                      ? 'bg-red-600 border-red-600 text-white shadow-lg shadow-red-950/30'
                      : 'bg-zinc-900 border-zinc-800 hover:border-zinc-700 text-zinc-400 hover:text-white'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Grid of Projects */}
            {loading ? (
              <div className="text-center py-20 text-zinc-500 font-mono tracking-wider">
                Loading Projects...
              </div>
            ) : filteredProjects.length === 0 ? (
              <div className="text-center py-20 text-zinc-500 border border-zinc-850 rounded-3xl bg-zinc-900/10">
                <Briefcase size={36} className="mx-auto text-zinc-700 mb-4" />
                <p className="text-base font-semibold">No projects found</p>
                <p className="text-xs text-zinc-650 mt-1">Check back later or try another category.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
                <AnimatePresence mode="popLayout">
                  {filteredProjects.map((project, index) => (
                    <motion.div
                      layout
                      key={project.id}
                      initial={{ opacity: 0, scale: 0.9 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.9 }}
                      transition={{ duration: 0.4 }}
                      onClick={() => setSelectedProject(project)}
                      className="group relative overflow-hidden rounded-2xl border border-zinc-850 hover:border-red-650/30 shadow-lg bg-zinc-900/20 backdrop-blur-sm cursor-pointer transition-all"
                    >
                      <div className="relative aspect-[4/3] w-full overflow-hidden">
                        <img
                          src={project.image || 'https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&q=80&w=800'}
                          alt={project.title}
                          className="w-full h-full object-cover transform group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                          <div className="bg-red-600 text-white p-3 rounded-full shadow-lg transform translate-y-4 group-hover:translate-y-0 transition-transform">
                            <Eye size={20} />
                          </div>
                        </div>
                      </div>

                      {/* Content block */}
                      <div className="p-6 space-y-2">
                        <span className="text-xs font-bold text-red-500 uppercase tracking-wider">
                          {project.category}
                        </span>
                        <h3 className="text-lg sm:text-xl font-bold text-white leading-tight">
                          {project.title}
                        </h3>
                        {project.description && (
                          <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2">
                            {project.description}
                          </p>
                        )}
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            )}

          </div>
        </section>

        {/* CTA SECTION */}
        <section className="py-24 bg-black text-center px-4 sm:px-6 lg:px-8">
          <div className="max-w-2xl mx-auto space-y-6">
            <span className="text-red-500 font-semibold tracking-wider uppercase text-sm block">
              Let's Collaborate
            </span>
            
            <h2 className="text-3xl sm:text-4xl font-bold text-white">
              Have a project in mind?
            </h2>
            
            <p className="text-zinc-400 text-sm sm:text-base leading-relaxed max-w-md mx-auto">
              Partner with us to create premium web solutions that delight users and drive real business growth.
            </p>

            <div className="pt-2">
              <a
                href="/request-service"
                className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-8 py-3.5 rounded-full font-bold transition-all hover:scale-105 shadow-lg shadow-red-950/20"
              >
                <span>Request a Service</span>
                <ArrowRight size={16} />
              </a>
            </div>
          </div>
        </section>
      </main>

      {/* Lightbox Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedProject(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-4xl w-full bg-zinc-950 border border-zinc-850 rounded-3xl overflow-hidden p-3 shadow-2xl flex flex-col justify-between cursor-default"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-6 right-6 z-10 bg-black/60 hover:bg-black text-white p-2 rounded-full border border-zinc-800 transition-colors"
              >
                <X size={20} />
              </button>

              <div className="aspect-[16/10] w-full overflow-hidden rounded-2xl border border-zinc-850">
                <img
                  src={selectedProject.image}
                  alt={selectedProject.title}
                  className="w-full h-full object-cover"
                />
              </div>

              <div className="p-6 space-y-2">
                <span className="text-xs font-bold text-red-500 uppercase tracking-wider">
                  {selectedProject.category}
                </span>
                <h3 className="text-xl sm:text-2xl font-bold text-white">
                  {selectedProject.title}
                </h3>
                {selectedProject.description && (
                  <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                    {selectedProject.description}
                  </p>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      <Footer />
    </div>
  );
}

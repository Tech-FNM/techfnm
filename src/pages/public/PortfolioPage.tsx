import { useEffect, useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SeoHead from '../../components/SeoHead';
import { supabase } from '../../lib/supabase';
import { motion } from 'motion/react';
import { ArrowUpRight, MessageSquareQuote, CheckCircle } from 'lucide-react';

export default function PortfolioPage() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase.from('projects').select('*');
        if (data && data.length > 0) {
          setProjects(data);
        } else {
          setProjects([
            { id: 1, title: 'E-Commerce Platform', category: 'Web Development', image: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&q=80&w=800', description: 'A fully custom headless commerce solution.' },
            { id: 2, title: 'Fitness Tracking App', category: 'Mobile App', image: 'https://images.unsplash.com/photo-1526506114642-903c5e470580?auto=format&fit=crop&q=80&w=800', description: 'Cross-platform app for fitness enthusiasts.' },
            { id: 3, title: 'Corporate Dashboard', category: 'UI/UX Design', image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800', description: 'Internal data visualization tool.' },
            { id: 4, title: 'Real Estate Portal', category: 'Web Development', image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800', description: 'Property listing and management system.' },
            { id: 5, title: 'Food Delivery App', category: 'Mobile App', image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800', description: 'Real-time tracking and ordering.' },
            { id: 6, title: 'Marketing Campaign', category: 'Digital Marketing', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800', description: 'Comprehensive SEO and SEM strategy.' }
          ]);
        }
      } catch (err) {}
    };
    fetchProjects();
  }, []);

  return (
    <div className="min-h-screen bg-black font-sans text-white flex flex-col w-full">
      <SeoHead pageId="portfolio" title="Our Portfolio & Case Studies | TechFNM" />
      <Header />
      
      <main className="flex-grow pt-32 pb-0">
        
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-red-500 font-semibold tracking-wider uppercase text-sm">Portfolio & Case Studies</span>
            <h1 className="mt-4 text-5xl md:text-7xl font-extrabold text-white tracking-tight">
              Work We Are <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Proud Of</span>
            </h1>
            <p className="mt-6 text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
              Explore our diverse range of successful projects. We combine creativity and technology to deliver outstanding results for our clients.
            </p>
          </motion.div>
        </section>

        {/* Featured Case Study (Static for visual impact) */}
        <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="group relative rounded-[2.5rem] overflow-hidden bg-zinc-900 border border-zinc-800 flex flex-col lg:flex-row"
          >
            <div className="lg:w-1/2 p-12 md:p-16 flex flex-col justify-center">
              <span className="inline-block px-4 py-1.5 rounded-full bg-red-500/10 text-red-500 font-medium text-sm mb-6 w-max">Featured Case Study</span>
              <h2 className="text-3xl md:text-4xl font-bold mb-6">Global FinTech Transformation</h2>
              <p className="text-zinc-400 text-lg leading-relaxed mb-8">
                We partnered with a leading financial institution to modernize their legacy systems, resulting in a 40% increase in user engagement and significantly reduced load times.
              </p>
              <ul className="space-y-3 mb-10">
                {['React & Node.js Stack', 'AWS Cloud Infrastructure', 'Bank-grade Security'].map((feature, i) => (
                  <li key={i} className="flex items-center gap-3 text-zinc-300">
                    <CheckCircle className="w-5 h-5 text-red-500" /> {feature}
                  </li>
                ))}
              </ul>
              <button className="inline-flex items-center gap-2 text-white font-bold hover:text-red-500 transition-colors w-max">
                Read Full Case Study <ArrowUpRight className="w-5 h-5" />
              </button>
            </div>
            <div className="lg:w-1/2 relative min-h-[400px]">
              <div className="absolute inset-0 bg-gradient-to-r from-zinc-900 via-transparent to-transparent z-10 hidden lg:block" />
              <img 
                src="https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=1200" 
                alt="Fintech Dashboard" 
                className="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
              />
            </div>
          </motion.div>
        </section>

        {/* Portfolio Grid */}
        <section className="py-24 bg-zinc-900/30 border-y border-zinc-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-4xl font-bold">More Projects</h2>
              <p className="mt-4 text-zinc-400 text-lg">A selection of our recent web and mobile applications.</p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: index * 0.1 }}
                  className="group relative overflow-hidden rounded-3xl bg-zinc-900 border border-zinc-800 cursor-pointer"
                >
                  <div className="h-64 overflow-hidden relative">
                    <img
                      src={project.image || 'https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&q=80&w=800'}
                      alt={project.title}
                      className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                      referrerPolicy="no-referrer"
                    />
                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-red-600 flex items-center justify-center text-white transform translate-y-4 group-hover:translate-y-0 transition-transform duration-300">
                        <ArrowUpRight className="w-6 h-6" />
                      </div>
                    </div>
                  </div>
                  <div className="p-8">
                    <span className="text-red-500 text-sm font-semibold tracking-wider uppercase block mb-2">{project.category || 'Project'}</span>
                    <h3 className="text-white text-2xl font-bold mb-3">{project.title}</h3>
                    {project.description && (
                      <p className="text-zinc-400 line-clamp-2">{project.description}</p>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Client Success / Testimonial */}
        <section className="py-24 bg-black">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
            <MessageSquareQuote className="w-16 h-16 text-red-500/20 mx-auto mb-8" />
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
            >
              <p className="text-2xl md:text-4xl font-medium leading-relaxed text-zinc-300 mb-10">
                "TechFNM completely revolutionized our digital presence. Their team didn't just build a website; they built a scalable platform that drove our sales up by 150% in the first quarter."
              </p>
              <div className="flex items-center justify-center gap-4">
                <img 
                  src="https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-1.2.1&auto=format&fit=facearea&facepad=2&w=256&h=256&q=80" 
                  alt="Client" 
                  className="w-14 h-14 rounded-full border-2 border-red-500 object-cover"
                />
                <div className="text-left">
                  <h4 className="text-white font-bold text-lg">Michael Chen</h4>
                  <span className="text-zinc-500">CEO, TechNova Inc.</span>
                </div>
              </div>
            </motion.div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

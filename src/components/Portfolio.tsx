import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Portfolio() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    const fetchProjects = async () => {
      try {
        const { data, error } = await supabase.from('projects').select('*');
        
        if (error) {
          console.error('Supabase error fetching projects:', error);
        }

        if (data && data.length > 0) {
          setProjects(data);
        } else {
          console.log('No projects found or error occurred, using fallback data.');
          setProjects([
            {
              id: 1,
              title: 'E-Commerce Platform',
              category: 'Web Development',
              image: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&q=80&w=800',
            },
            {
              id: 2,
              title: 'Fitness Tracking App',
              category: 'Mobile App',
              image: 'https://images.unsplash.com/photo-1526506114642-903c5e470580?auto=format&fit=crop&q=80&w=800',
            },
            {
              id: 3,
              title: 'Corporate Dashboard',
              category: 'UI/UX Design',
              image: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800',
            },
            {
              id: 4,
              title: 'Real Estate Portal',
              category: 'Web Development',
              image: 'https://images.unsplash.com/photo-1560518883-ce09059eeffa?auto=format&fit=crop&q=80&w=800',
            },
            {
              id: 5,
              title: 'Food Delivery App',
              category: 'Mobile App',
              image: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&q=80&w=800',
            },
            {
              id: 6,
              title: 'Marketing Campaign',
              category: 'Digital Marketing',
              image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800',
            }
          ]);
        }
      } catch (err) {
        console.error('Error in fetchProjects:', err);
      }
    };
    fetchProjects();
  }, []);

  return (
    <section id="portfolio" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-red-500 font-semibold tracking-wider uppercase text-sm">Portfolio & Project</span>
          <h2 className="mt-2 text-4xl font-bold text-white sm:text-5xl">Our Works</h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-400 mx-auto">
            Explore our latest projects and see how we've helped businesses achieve their goals.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {projects.map((project, index) => (
            <motion.div
              key={project.id}
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="group relative overflow-hidden rounded-2xl shadow-lg cursor-pointer border border-white/10"
            >
              <img
                src={project.image || 'https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&q=80&w=800'}
                alt={project.title}
                className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
                referrerPolicy="no-referrer"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-red-400 text-sm font-medium mb-2">{project.category || 'Project'}</span>
                <h3 className="text-white text-xl font-bold mb-2">{project.title}</h3>
                <span className="text-white-400 text-sm font-medium mb-2">{project.Description}</span>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

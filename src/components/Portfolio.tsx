import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';
import axios from 'axios';

export default function Portfolio() {
  const [projects, setProjects] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/api/projects').then(res => setProjects(res.data));
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
                src={project.image}
                alt={project.title}
                className="w-full h-64 object-cover transform group-hover:scale-110 transition-transform duration-500"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/50 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col justify-end p-6">
                <span className="text-red-400 text-sm font-medium mb-2">{project.category}</span>
                <h3 className="text-white text-xl font-bold mb-2">{project.title}</h3>
                <div className="flex items-center text-white/80 text-sm font-medium">
                  View Project <ExternalLink size={16} className="ml-2" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
        
        <div className="text-center mt-12">
          <a href="#" className="inline-flex items-center justify-center px-8 py-3 border border-red-600 text-base font-medium rounded-full text-red-500 bg-transparent hover:bg-red-900/20 transition-colors">
            View All Projects
          </a>
        </div>
      </div>
    </section>
  );
}

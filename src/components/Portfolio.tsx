import { motion } from 'motion/react';
import { ExternalLink } from 'lucide-react';

const projects = [
  {
    title: 'E-commerce Platform',
    category: 'Web Development',
    image: 'https://images.unsplash.com/photo-1557821552-17105176677c?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  },
  {
    title: 'Mobile Banking App',
    category: 'App Development',
    image: 'https://images.unsplash.com/photo-1551650975-87deedd944c3?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  },
  {
    title: 'Digital Marketing Campaign',
    category: 'Marketing',
    image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  },
  {
    title: 'Corporate Branding',
    category: 'Branding',
    image: 'https://images.unsplash.com/photo-1542744173-8e7e53415bb0?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  },
  {
    title: 'Social Media Strategy',
    category: 'Social Media',
    image: 'https://images.unsplash.com/photo-1611162617474-5b21e879e113?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  },
  {
    title: 'Content Creation',
    category: 'Content',
    image: 'https://images.unsplash.com/photo-1499750310159-5b9883e73975?ixlib=rb-1.2.1&auto=format&fit=crop&w=1350&q=80',
  },
];

export default function Portfolio() {
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
              key={index}
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

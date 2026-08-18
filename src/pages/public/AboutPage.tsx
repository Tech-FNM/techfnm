import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SeoHead from '../../components/SeoHead';
import { motion } from 'motion/react';
import { CheckCircle, Target, Zap } from 'lucide-react';

export default function AboutPage() {
  return (
    <div className="min-h-screen bg-black font-sans text-white flex flex-col w-full">
      <SeoHead pageId="about" title="About Us - Our Story & Mission | TechFNM" />
      <Header />
      <main className="flex-grow pt-32 pb-0">
        
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-red-500 font-semibold tracking-wider uppercase text-sm">Discover TechFNM</span>
            <h1 className="mt-4 text-5xl md:text-7xl font-extrabold text-white tracking-tight">
              Innovating the <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Digital World</span>
            </h1>
            <p className="mt-6 text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
              We are a team of passionate technologists dedicated to building exceptional digital experiences. From startups to enterprises, we transform ideas into reality.
            </p>
          </motion.div>
        </section>

        {/* Our Story Section */}
        <section className="py-24 bg-zinc-900/30 border-y border-zinc-800/50">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <h2 className="text-3xl md:text-5xl font-bold mb-8">Our Story</h2>
                <div className="space-y-6 text-zinc-400 text-lg leading-relaxed">
                  <p>
                    Founded with a vision to simplify technology, TechFNM started as a small group of developers who believed in the power of clean code and beautiful design.
                  </p>
                  <p>
                    Over the years, we've grown into a full-service digital agency, helping businesses navigate the complexities of the modern web. Our journey is defined by continuous learning, adapting to new frameworks, and consistently delivering value to our clients.
                  </p>
                  <p>
                    Today, we stand at the forefront of digital innovation, leveraging cutting-edge tools to build scalable, secure, and stunning applications.
                  </p>
                </div>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="relative h-[400px] md:h-[600px] rounded-3xl overflow-hidden shadow-2xl shadow-red-500/5 border border-zinc-800"
              >
                <div className="absolute inset-0 bg-gradient-to-br from-red-600/20 to-black/80 z-10 mix-blend-overlay" />
                <img 
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-4.0.3&auto=format&fit=crop&w=2000&q=80" 
                  alt="TechFNM Team collaborating" 
                  className="w-full h-full object-cover scale-105 hover:scale-100 transition-transform duration-700"
                />
              </motion.div>
            </div>
          </div>
        </section>

        {/* Mission & Vision */}
        <section className="py-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="p-12 rounded-[2rem] bg-zinc-900 border border-zinc-800 hover:border-red-500/30 transition-colors group"
            >
              <div className="w-16 h-16 rounded-2xl bg-red-500/10 flex items-center justify-center mb-8 group-hover:bg-red-500/20 transition-colors">
                <Target className="w-8 h-8 text-red-500" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Our Mission</h3>
              <p className="text-zinc-400 text-lg leading-relaxed">
                To empower businesses through innovative technological solutions. We strive to create digital products that are not only functional but also intuitive and engaging, driving real growth for our partners.
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: 0.2 }}
              className="p-12 rounded-[2rem] bg-zinc-900 border border-zinc-800 hover:border-red-500/30 transition-colors group"
            >
              <div className="w-16 h-16 rounded-2xl bg-orange-500/10 flex items-center justify-center mb-8 group-hover:bg-orange-500/20 transition-colors">
                <Zap className="w-8 h-8 text-orange-500" />
              </div>
              <h3 className="text-3xl font-bold mb-4">Our Vision</h3>
              <p className="text-zinc-400 text-lg leading-relaxed">
                To be the leading catalyst for digital transformation globally. We envision a future where technology seamlessly integrates with human potential, creating unprecedented opportunities and solving complex challenges.
              </p>
            </motion.div>
          </div>
        </section>

        {/* Why Choose Us */}
        <section className="py-24 bg-zinc-950 border-t border-zinc-900">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-20">
              <span className="text-red-500 font-semibold tracking-wider uppercase text-sm">The TechFNM Advantage</span>
              <h2 className="mt-4 text-4xl md:text-5xl font-bold">Why Choose Us</h2>
              <p className="mt-6 text-zinc-400 max-w-2xl mx-auto text-xl">
                We don't just write code; we build strategic solutions tailored to your unique business needs.
              </p>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-x-8 gap-y-12">
              {[
                { title: 'Expert Team', desc: 'Industry veterans with deep knowledge in modern, scalable tech stacks.' },
                { title: 'Agile Process', desc: 'Iterative delivery ensuring you stay in the loop at every stage.' },
                { title: 'Scalable Architecture', desc: 'Applications built to grow with your business from day one.' },
                { title: 'Premium Design', desc: 'Aesthetics that wow your users and build instant trust.' },
                { title: 'SEO Optimized', desc: 'Rank higher and get found organically by your target audience.' },
                { title: '24/7 Support', desc: 'We are here when you need us the most, with proactive monitoring.' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, scale: 0.95 }}
                  whileInView={{ opacity: 1, scale: 1 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="flex items-start gap-5 p-6 rounded-3xl bg-zinc-900/40 border border-zinc-800/50 hover:bg-zinc-900 transition-colors"
                >
                  <div className="mt-1 bg-red-500/10 p-2 rounded-full text-red-500 shrink-0">
                    <CheckCircle className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xl font-bold text-white mb-3">{item.title}</h4>
                    <p className="text-zinc-400 leading-relaxed">{item.desc}</p>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

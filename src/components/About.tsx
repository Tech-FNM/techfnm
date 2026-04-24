import { motion } from 'motion/react';
import { CheckCircle } from 'lucide-react';

export default function About() {
  return (
    <section id="about" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="lg:grid lg:grid-cols-2 lg:gap-16 items-center">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="mb-12 lg:mb-0 relative"
          >
            <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-zinc-800">
              <img
                src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80"
                alt="Team working together"
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-red-600/10 mix-blend-multiply"></div>
            </div>
            <div className="absolute -bottom-6 -right-6 bg-zinc-900 p-6 rounded-xl shadow-xl hidden md:block border border-zinc-800">
              <div className="flex items-center gap-4">
                <div className="bg-red-900/20 p-3 rounded-full text-red-500 font-bold text-xl">5+</div>
                <div>
                  <p className="text-white font-bold">Years Experience</p>
                  <p className="text-gray-400 text-sm">In Digital Solutions</p>
                </div>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
          >
            <span className="text-red-500 font-semibold tracking-wider uppercase text-sm">About Us</span>
            <h2 className="mt-2 text-4xl font-bold text-white sm:text-5xl mb-6">
              We Are Creative Digital Agency
            </h2>
            <p className="text-gray-400 text-lg mb-6 leading-relaxed">
              TechFNM is a leading software company in Pakistan, dedicated to providing top-notch web development, mobile app solutions, and digital marketing services. We believe in building long-term relationships with our clients by delivering quality work.
            </p>
            <p className="text-gray-400 text-lg mb-8 leading-relaxed">
              Our team of experts is passionate about technology and innovation. We stay up-to-date with the latest trends to ensure that our clients get the best possible solutions for their business needs.
            </p>

            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <CheckCircle className="text-red-500 flex-shrink-0" size={20} />
                <span className="text-gray-300 font-medium">Professional & Experienced Team</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-red-500 flex-shrink-0" size={20} />
                <span className="text-gray-300 font-medium">Customized Solutions for Every Business</span>
              </div>
              <div className="flex items-center gap-3">
                <CheckCircle className="text-red-500 flex-shrink-0" size={20} />
                <span className="text-gray-300 font-medium">24/7 Support & Maintenance</span>
              </div>
            </div>

            <a href="#contact" className="inline-flex items-center justify-center px-8 py-3 border border-transparent text-base font-medium rounded-full text-white bg-red-600 hover:bg-red-700 shadow-lg shadow-red-600/30 transition-all hover:scale-105">
              Discover More
            </a>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

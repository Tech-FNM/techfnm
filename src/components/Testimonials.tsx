import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Quote } from 'lucide-react';
import axios from 'axios';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    axios.get('/api/testimonials').then(res => setTestimonials(res.data));
  }, []);

  return (
    <section id="testimonials" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-red-500 font-semibold tracking-wider uppercase text-sm">What Clients Say?</span>
          <h2 className="mt-2 text-4xl font-bold text-white sm:text-5xl">Testimonials</h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-400 mx-auto">
            Don't just take our word for it. Hear what our satisfied clients have to say about our services.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {testimonials.map((testimonial, index) => (
            <motion.div
              key={testimonial.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-900 rounded-2xl p-8 relative shadow-sm hover:shadow-md transition-shadow border border-zinc-800"
            >
              <Quote className="absolute top-6 right-6 text-red-900/30 w-12 h-12" />
              <div className="flex items-center mb-6">
                <img
                  src={testimonial.image}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-zinc-700 shadow-sm"
                />
                <div>
                  <h4 className="text-lg font-bold text-white">{testimonial.name}</h4>
                  <p className="text-sm text-red-500">{testimonial.role}</p>
                </div>
              </div>
              <p className="text-gray-400 italic leading-relaxed relative z-10">
                "{testimonial.content}"
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { motion } from 'motion/react';
import { Quote } from 'lucide-react';

const testimonials = [
  {
    name: 'Sarah Malik',
    role: 'Business Owner',
    content: 'TechFNM built a stunning website for my business; fast, responsive, and SEO-friendly. Their communication was smooth, and everything was delivered on time.',
    image: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Ahmed Raza',
    role: 'Startup Founder',
    content: 'We got our mobile app developed by TechFNM, and the results exceeded our expectations. The UI/UX was modern, and the performance was flawless. Great work!',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
  {
    name: 'Fatima Khan',
    role: 'Marketing Director',
    content: 'The digital marketing strategies implemented by TechFNM have significantly increased our online visibility and lead generation. Highly recommended!',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?ixlib=rb-1.2.1&auto=format&fit=crop&w=800&q=80',
  },
];

export default function Testimonials() {
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
              key={index}
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

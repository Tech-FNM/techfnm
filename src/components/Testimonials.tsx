import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Quote } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>([]);

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase.from('testimonials').select('*').order('created_at', { ascending: true });
        if (data && data.length > 0) {
          setTestimonials(data);
        } else {
          setTestimonials([
            {
              id: 1,
              name: 'David Chen',
              role: 'Tech Startup Founder',
              content: 'Working with this team was a game-changer for our business. They delivered a high-quality product on time and within budget.',
              image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200',
            },
            {
              id: 2,
              name: 'Emily Rodriguez',
              role: 'E-commerce Director',
              content: 'The redesign of our online store resulted in a 40% increase in conversions. Their attention to detail and user experience is unmatched.',
              image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?auto=format&fit=crop&q=80&w=200',
            },
            {
              id: 3,
              name: 'Michael Chang',
              role: 'Marketing Manager',
              content: 'Their digital marketing strategies helped us reach a wider audience and significantly boost our brand awareness across all platforms.',
              image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&q=80&w=200',
            }
          ]);
        }
      } catch (err) {
        console.error('Error fetching testimonials:', err);
      }
    };
    fetchTestimonials();
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

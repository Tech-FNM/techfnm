import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Quote } from 'lucide-react';
import { supabase } from '../lib/supabase';
import { usePageContent } from '../lib/cmsContent';
import { CANONICAL_TESTIMONIALS, getCached, setCached } from '../lib/canonicalData';

export default function Testimonials() {
  const [testimonials, setTestimonials] = useState<any[]>(() => getCached('techfnm_testimonials_cache', CANONICAL_TESTIMONIALS));
  const pageContent = usePageContent('page-home', {
    testimonials_badge: 'Client Voices',
    testimonials_heading: 'What Founders Say About Us',
    testimonials_desc: 'Trusted by forward-thinking companies worldwide.'
  });

  useEffect(() => {
    const fetchTestimonials = async () => {
      try {
        const { data, error } = await supabase.from('testimonials').select('*');
        
        if (error) {
          console.error('Supabase error fetching testimonials:', error);
        }

        if (data && data.length > 0) {
          setTestimonials(data);
          setCached('techfnm_testimonials_cache', data);
        } else if (testimonials.length === 0) {
          setTestimonials(CANONICAL_TESTIMONIALS);
        }
      } catch (err) {
        console.error('Error in fetchTestimonials:', err);
      }
    };
    fetchTestimonials();

    const channel = supabase
      .channel('public:testimonials')
      .on('postgres_changes', { event: '*', schema: 'public', table: 'testimonials' }, (payload: any) => {
        fetchTestimonials();
      })
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section id="testimonials" className="py-24 bg-black">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-red-500 font-semibold tracking-wider uppercase text-sm">
            {pageContent.testimonials_badge || 'What Clients Say?'}
          </span>
          <h2 className="mt-2 text-4xl font-bold text-white sm:text-5xl">
            {pageContent.testimonials_heading || 'Testimonials'}
          </h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-400 mx-auto">
            {pageContent.testimonials_desc || "Don't just take our word for it. Hear what our satisfied clients have to say about our services."}
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
                  src={testimonial.image || 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&q=80&w=200'}
                  alt={testimonial.name}
                  className="w-14 h-14 rounded-full object-cover mr-4 border-2 border-zinc-700 shadow-sm"
                  referrerPolicy="no-referrer"
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

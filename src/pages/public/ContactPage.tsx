import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SeoHead from '../../components/SeoHead';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      setIsSubmitted(true);
      setTimeout(() => setIsSubmitted(false), 5000);
    }, 1500);
  };

  return (
    <div className="min-h-screen bg-black font-sans text-white flex flex-col w-full">
      <SeoHead pageId="contact" title="Contact Us - Get in Touch | TechFNM" />
      <Header />
      
      <main className="flex-grow pt-32 pb-0">
        
        {/* Hero Section */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-24">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="text-red-500 font-semibold tracking-wider uppercase text-sm">Let's Connect</span>
            <h1 className="mt-4 text-5xl md:text-7xl font-extrabold text-white tracking-tight">
              Get in <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Touch</span>
            </h1>
            <p className="mt-6 text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
              Have a project in mind or just want to say hi? We'd love to hear from you. Drop us a line and our team will get back to you within 24 hours.
            </p>
          </motion.div>
        </section>

        {/* Contact Info & Form */}
        <section className="pb-24 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-5 gap-12 lg:gap-8">
            
            {/* Contact Information (Left Side) */}
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-2 space-y-6"
            >
              <div className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-[2rem]">
                <h3 className="text-2xl font-bold mb-8 flex items-center gap-3">
                  <MessageCircle className="text-red-500 w-6 h-6" /> Contact Info
                </h3>
                
                <div className="space-y-8">
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 shrink-0">
                      <Mail className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-sm text-zinc-500 font-medium uppercase tracking-wider block mb-1">Email Us</span>
                      <a href="mailto:hello@techfnm.com" className="text-lg text-white hover:text-red-500 transition-colors">hello@techfnm.com</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-sm text-zinc-500 font-medium uppercase tracking-wider block mb-1">Call Us</span>
                      <a href="tel:+1234567890" className="text-lg text-white hover:text-red-500 transition-colors">+1 (234) 567-890</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-sm text-zinc-500 font-medium uppercase tracking-wider block mb-1">Visit Us</span>
                      <p className="text-lg text-white">123 Tech Avenue, Suite 400<br/>San Francisco, CA 94105</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Interactive Form (Right Side) */}
            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3 bg-zinc-900 border border-zinc-800 p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl" />
              
              <h2 className="text-3xl font-bold mb-8 relative z-10">Send a Message</h2>
              
              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-zinc-400">Full Name</label>
                    <input 
                      type="text" 
                      id="name" 
                      required
                      className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-zinc-600"
                      placeholder="John Doe"
                    />
                  </div>
                  <div className="space-y-2">
                    <label htmlFor="email" className="text-sm font-medium text-zinc-400">Email Address</label>
                    <input 
                      type="email" 
                      id="email" 
                      required
                      className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-zinc-600"
                      placeholder="john@example.com"
                    />
                  </div>
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="subject" className="text-sm font-medium text-zinc-400">Subject</label>
                  <input 
                    type="text" 
                    id="subject" 
                    required
                    className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-zinc-600"
                    placeholder="How can we help you?"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-zinc-400">Message</label>
                  <textarea 
                    id="message" 
                    rows={5}
                    required
                    className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-zinc-600 resize-none"
                    placeholder="Tell us about your project..."
                  ></textarea>
                </div>
                
                <button 
                  type="submit"
                  disabled={isSubmitting || isSubmitted}
                  className="w-full bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 text-white font-bold rounded-xl px-6 py-4 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : isSubmitted ? (
                    'Message Sent Successfully!'
                  ) : (
                    <>Send Message <Send className="w-5 h-5" /></>
                  )}
                </button>
              </form>
            </motion.div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="py-24 bg-zinc-950 border-t border-zinc-900">
          <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold">Frequently Asked Questions</h2>
            </div>
            
            <div className="space-y-6">
              {[
                { q: "What is your typical project timeline?", a: "Timelines vary depending on the complexity of the project. A standard web application usually takes 4-8 weeks from discovery to launch." },
                { q: "Do you offer post-launch support?", a: "Yes, we offer comprehensive maintenance and support packages to ensure your application runs smoothly and stays up-to-date." },
                { q: "What technologies do you specialize in?", a: "We primarily focus on the modern JavaScript ecosystem (React, Node.js, Next.js) but are proficient in various other stacks depending on the project requirements." }
              ].map((faq, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  className="bg-zinc-900/50 border border-zinc-800 p-8 rounded-2xl"
                >
                  <h4 className="text-xl font-bold text-white mb-3">{faq.q}</h4>
                  <p className="text-zinc-400 leading-relaxed">{faq.a}</p>
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

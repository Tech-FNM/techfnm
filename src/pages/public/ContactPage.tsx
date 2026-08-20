import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SeoHead from '../../components/SeoHead';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [content, setContent] = useState<any>({
    contact_hero: {
      title: 'Get in Touch',
      description: 'Have a project in mind or just want to say hi? We\'d love to hear from you. Drop us a line and our team will get back to you within 24 hours.'
    },
    contact_info: {
      email: 'hello@techfnm.com',
      phone: '+1 (234) 567-890',
      address: '123 Tech Avenue, Suite 400\nSan Francisco, CA 94105'
    }
  });

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase.from('pages_content').select('*').eq('page_name', 'contact');
      if (data) {
        const formatted: Record<string, any> = {};
        data.forEach(item => {
          formatted[item.id] = item.content || {};
        });
        setContent((prev: any) => ({ ...prev, ...formatted }));
      }
    };
    fetchContent();
  }, []);

  const [errorMessage, setErrorMessage] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const formElement = e.target as HTMLFormElement;
      const formData = {
        name: (formElement.elements.namedItem('name') as HTMLInputElement).value,
        email: (formElement.elements.namedItem('email') as HTMLInputElement).value,
        subject: (formElement.elements.namedItem('subject') as HTMLInputElement).value,
        message: (formElement.elements.namedItem('message') as HTMLTextAreaElement).value,
      };

      const response = await fetch('/api/send-contact-email', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });

      const resData = await response.json();
      if (!response.ok) throw new Error(resData.error || 'Failed to send message');

      setIsSubmitted(true);
      formElement.reset();
      setTimeout(() => setIsSubmitted(false), 5000);
    } catch (err: any) {
      console.error('Error sending message:', err);
      setErrorMessage(err.message || 'Failed to send message. Please check server connections and try again.');
    } finally {
      setIsSubmitting(false);
    }
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
              {content.contact_hero?.title?.split(' ').map((word: string, i: number, arr: string[]) => 
                i === arr.length - 1 ? 
                <span key={i} className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500"> {word}</span> : 
                ` ${word}`
              ) || 'Get in Touch'}
            </h1>
            <p className="mt-6 text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed">
              {content.contact_hero?.description}
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
                      <a href={`mailto:${content.contact_info?.email}`} className="text-lg text-white hover:text-red-500 transition-colors">{content.contact_info?.email}</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 shrink-0">
                      <Phone className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-sm text-zinc-500 font-medium uppercase tracking-wider block mb-1">Call Us</span>
                      <a href={`tel:${content.contact_info?.phone}`} className="text-lg text-white hover:text-red-500 transition-colors">{content.contact_info?.phone}</a>
                    </div>
                  </div>
                  
                  <div className="flex items-start gap-4">
                    <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500 shrink-0">
                      <MapPin className="w-6 h-6" />
                    </div>
                    <div>
                      <span className="text-sm text-zinc-500 font-medium uppercase tracking-wider block mb-1">Visit Us</span>
                      <p className="text-lg text-white whitespace-pre-line">{content.contact_info?.address}</p>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="lg:col-span-3 bg-zinc-900 border border-zinc-800 p-8 md:p-12 rounded-[2.5rem] relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl" />
              
              <h2 className="text-3xl font-bold mb-8 relative z-10">Send a Message</h2>
              
              {errorMessage && (
                <div className="mb-6 p-4 bg-red-500/10 border border-red-500/20 text-red-400 text-sm rounded-xl">
                  {errorMessage}
                </div>
              )}

              <form onSubmit={handleSubmit} className="space-y-6 relative z-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <label htmlFor="name" className="text-sm font-medium text-zinc-400">Full Name</label>
                    <input 
                      type="text" 
                      id="name"
                      name="name"
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
                      name="email"
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
                    name="subject"
                    required
                    className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-zinc-600"
                    placeholder="How can we help you?"
                  />
                </div>
                
                <div className="space-y-2">
                  <label htmlFor="message" className="text-sm font-medium text-zinc-400">Message</label>
                  <textarea 
                    id="message"
                    name="message"
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

      </main>
      <Footer />
    </div>
  );
}

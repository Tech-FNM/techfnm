import { useState, useEffect } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SeoHead from '../../components/SeoHead';
import { motion } from 'motion/react';
import { Mail, Phone, MapPin, Send, MessageCircle, Headphones } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function ContactPage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [content, setContent] = useState<any>({
    contact_hero: {
      title: 'Lets Have a Chat 🤝',
      description: 'Questions about our products/services, orders, or just want to say hello? We\'re here to help'
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

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMessage('');
    
    try {
      const formElement = e.target as HTMLFormElement;
      const formData = {
        name: (formElement.elements.namedItem('first_name') as HTMLInputElement).value + ' ' + (formElement.elements.namedItem('last_name') as HTMLInputElement).value,
        email: (formElement.elements.namedItem('email') as HTMLInputElement).value,
        subject: (formElement.elements.namedItem('phone_number') as HTMLInputElement).value,
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
      setErrorMessage(err.message || 'Failed to send message. Please check server connections.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black font-sans text-white flex flex-col w-full selection:bg-red-500/30 relative">
      <SeoHead pageId="contact" title="Contact Us - Let's Have a Chat | TechFNM" />
      <Header />
      
      {/* Curved background shade panel (Riter style) */}
      <div className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] aspect-[2/1] rounded-t-[100%] bg-zinc-900/10 border-t border-zinc-800/20 pointer-events-none -z-10" />

      <main className="flex-grow pt-36 pb-24 relative z-10 max-w-4xl mx-auto px-4 w-full">
        
        {/* Support Online Banner Badge */}
        <div className="flex justify-center mb-6">
          <span className="inline-flex items-center gap-1.5 px-3 py-1 bg-zinc-900 border border-zinc-800 rounded-full text-xs text-zinc-400 font-medium">
            <Headphones size={13} className="text-red-500" /> 4 Support online <span className="text-zinc-600">|</span> <span className="text-white underline cursor-pointer">Join us</span>
          </span>
        </div>

        {/* Hero Headers */}
        <section className="text-center mb-12 space-y-4">
          <h1 className="text-4xl md:text-6xl font-extrabold text-white tracking-tight">
            {content.contact_hero?.title}
          </h1>
          <p className="text-zinc-400 text-sm md:text-base max-w-xl mx-auto font-light">
            {content.contact_hero?.description}
          </p>
        </section>

        {/* Riter Center Form Panel */}
        <section className="max-w-2xl mx-auto">
          {errorMessage && (
            <div className="mb-6 p-3 bg-red-500/10 border border-red-500/20 text-red-400 text-xs rounded-xl text-center">
              {errorMessage}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-400">First name</label>
                <input 
                  type="text" 
                  name="first_name"
                  required
                  className="w-full bg-zinc-900/50 border border-zinc-800/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500 text-sm"
                  placeholder="Jonathan"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-400">Last name</label>
                <input 
                  type="text" 
                  name="last_name"
                  required
                  className="w-full bg-zinc-900/50 border border-zinc-800/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500 text-sm"
                  placeholder="James"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-400">Email</label>
                <input 
                  type="email" 
                  name="email"
                  required
                  className="w-full bg-zinc-900/50 border border-zinc-800/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500 text-sm"
                  placeholder="Jonathan2718@gmail.com"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-semibold text-zinc-400">Phone number</label>
                <input 
                  type="text" 
                  name="phone_number"
                  className="w-full bg-zinc-900/50 border border-zinc-800/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500 text-sm"
                  placeholder="Subject"
                />
              </div>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400">Message</label>
              <textarea 
                name="message"
                rows={5}
                required
                className="w-full bg-zinc-900/50 border border-zinc-800/80 rounded-xl px-3 py-2 text-white focus:outline-none focus:border-red-500 text-sm resize-none"
                placeholder="Hey i have some issues activating my account..."
              />
            </div>

            <button 
              type="submit"
              disabled={isSubmitting || isSubmitted}
              className="w-full bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 py-3 rounded-xl font-bold transition-all flex items-center justify-center gap-2 text-xs"
            >
              {isSubmitting ? (
                <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
              ) : isSubmitted ? (
                'Message Sent Successfully!'
              ) : (
                'Send message'
              )}
            </button>
          </form>

          {/* Social icons bottom row */}
          <div className="flex justify-center gap-4 mt-8 text-zinc-650">
            <span className="hover:text-white cursor-pointer transition-colors text-xs font-mono">𝕏</span>
            <span className="hover:text-white cursor-pointer transition-colors text-xs font-mono">Instagram</span>
            <span className="hover:text-white cursor-pointer transition-colors text-xs font-mono">Discord</span>
          </div>
        </section>

      </main>
      <Footer />
    </div>
  );
}

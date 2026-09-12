import { motion } from 'motion/react';
import { Mail, MapPin, Phone, Send, Loader2, CheckCircle2, AlertCircle, ArrowUpRight } from 'lucide-react';
import { useState } from 'react';
import { usePageContent } from '../lib/cmsContent';

export default function Contact() {
  const pageContent = usePageContent('page-home', {
    cta_badge: "Let's start digital growth",
    cta_heading: 'Ready to transform your brand into a digital powerhouse?',
    cta_desc: 'Schedule a free strategy session with our senior digital architects and discover how we can accelerate your revenue.',
    phone_number: '0313-9023118',
    email_address: 'techhfnm@gmail.com',
    location_address: 'Karachi, Pakistan'
  });

  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [errorMessage, setErrorMessage] = useState('');

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData(prev => ({
      ...prev,
      [e.target.id]: e.target.value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setErrorMessage('');

    try {
      const response = await fetch("https://formsubmit.co/ajax/techhfnm@gmail.com", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: formData.name,
          email: formData.email,
          subject: formData.subject,
          message: formData.message,
          _subject: `New Contact Form Submission: ${formData.subject}`
        })
      });

      if (!response.ok) throw new Error('Failed to send message');

      setStatus('success');
      setFormData({ name: '', email: '', subject: '', message: '' });
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err: any) {
      console.error('Error submitting form:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section id="contact" className="py-24 sm:py-32 bg-black relative overflow-hidden border-t border-white/5">
      {/* Background glow */}
      <div className="absolute bottom-0 right-0 w-[500px] h-[500px] bg-[#e5432e]/5 rounded-full blur-[140px] pointer-events-none" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left Column: Direct Info & Fexora CTA */}
          <div className="lg:col-span-5 flex flex-col">
            <div className="inline-flex items-center gap-2 bg-[#1B1B1B] border border-white/10 rounded-full px-4 py-1.5 mb-5 w-fit">
              <span className="w-2 h-2 rounded-full bg-[#e5432e]" />
              <span className="text-xs sm:text-sm font-semibold tracking-wider text-zinc-300 uppercase">
                {pageContent.cta_badge || "Let's start digital growth"}
              </span>
            </div>

            <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-white tracking-tight leading-[1.15] mb-6">
              {pageContent.cta_heading || 'Ready to transform your brand into a digital powerhouse?'}
            </h2>

            <p className="text-base sm:text-lg text-zinc-400 font-normal leading-relaxed mb-10">
              {pageContent.cta_desc ||
                'Schedule a free strategy session with our senior digital architects and discover how we can accelerate your revenue.'}
            </p>

            {/* Contact Info Cards */}
            <div className="space-y-4">
              <div className="bg-[#121214] border border-white/10 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#1B1B1B] border border-white/10 text-[#e5432e] flex items-center justify-center flex-shrink-0">
                  <Phone size={20} />
                </div>
                <div>
                  <div className="text-xs text-zinc-500 font-medium">Call Us Directly</div>
                  <a href={`tel:${pageContent.phone_number || '0313-9023118'}`} className="text-white font-bold hover:text-[#e5432e] transition-colors">
                    {pageContent.phone_number || '0313-9023118'}
                  </a>
                </div>
              </div>

              <div className="bg-[#121214] border border-white/10 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#1B1B1B] border border-white/10 text-[#e5432e] flex items-center justify-center flex-shrink-0">
                  <Mail size={20} />
                </div>
                <div>
                  <div className="text-xs text-zinc-500 font-medium">Email Inquiry</div>
                  <a href={`mailto:${pageContent.email_address || 'techhfnm@gmail.com'}`} className="text-white font-bold hover:text-[#e5432e] transition-colors">
                    {pageContent.email_address || 'techhfnm@gmail.com'}
                  </a>
                </div>
              </div>

              <div className="bg-[#121214] border border-white/10 rounded-2xl p-5 flex items-center gap-4">
                <div className="w-12 h-12 rounded-xl bg-[#1B1B1B] border border-white/10 text-[#e5432e] flex items-center justify-center flex-shrink-0">
                  <MapPin size={20} />
                </div>
                <div>
                  <div className="text-xs text-zinc-500 font-medium">Headquarters</div>
                  <div className="text-white font-bold">
                    {pageContent.location_address || 'Karachi, Pakistan'}
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Column: Contact Lead Form */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 bg-[#121214] border border-white/10 rounded-3xl p-8 sm:p-10 shadow-2xl"
          >
            <h3 className="text-2xl sm:text-3xl font-bold text-white mb-2 tracking-tight">
              Get in Touch
            </h3>
            <p className="text-zinc-400 text-sm mb-8">
              Fill out the form below and we'll reply within 24 business hours.
            </p>

            {status === 'success' && (
              <div className="mb-6 bg-[#e5432e]/10 border border-[#e5432e]/30 text-[#e5432e] p-4 rounded-xl flex items-center gap-3">
                <CheckCircle2 size={20} className="shrink-0" />
                <p className="text-sm font-medium">Thank you! Your message has been sent successfully.</p>
              </div>
            )}

            {status === 'error' && (
              <div className="mb-6 bg-red-500/10 border border-red-500/30 text-red-400 p-4 rounded-xl flex items-center gap-3">
                <AlertCircle size={20} className="shrink-0" />
                <p className="text-sm font-medium">{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                <div>
                  <label htmlFor="name" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    Your Name
                  </label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl bg-[#1B1B1B] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#e5432e] transition-colors text-sm"
                    placeholder="John Doe"
                    disabled={status === 'submitting'}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                    Email Address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3.5 rounded-xl bg-[#1B1B1B] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#e5432e] transition-colors text-sm"
                    placeholder="john@example.com"
                    disabled={status === 'submitting'}
                  />
                </div>
              </div>

              <div>
                <label htmlFor="subject" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Project Subject
                </label>
                <input
                  type="text"
                  id="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-xl bg-[#1B1B1B] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#e5432e] transition-colors text-sm"
                  placeholder="Website Redesign & SEO"
                  disabled={status === 'submitting'}
                />
              </div>

              <div>
                <label htmlFor="message" className="block text-xs font-semibold uppercase tracking-wider text-zinc-400 mb-2">
                  Project Details
                </label>
                <textarea
                  id="message"
                  required
                  rows={4}
                  value={formData.message}
                  onChange={handleChange}
                  className="w-full px-4 py-3.5 rounded-xl bg-[#1B1B1B] border border-white/10 text-white placeholder-zinc-500 focus:outline-none focus:border-[#e5432e] transition-colors text-sm resize-none"
                  placeholder="Tell us about your business goals, timeline, and requirements..."
                  disabled={status === 'submitting'}
                />
              </div>

              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full group inline-flex items-center justify-center gap-3 bg-[#e5432e] hover:bg-[#cc3622] text-white px-8 py-4 rounded-full text-base font-semibold transition-all duration-300 transform hover:scale-[1.01] shadow-lg shadow-[#e5432e]/20 disabled:opacity-50 cursor-pointer"
              >
                {status === 'submitting' ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    <span>Sending Message...</span>
                  </>
                ) : (
                  <>
                    <span>Send Message</span>
                    <span className="w-7 h-7 rounded-full bg-white text-[#e5432e] flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                      <ArrowUpRight size={15} />
                    </span>
                  </>
                )}
              </button>
            </form>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

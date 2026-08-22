import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Loader2, Facebook, Youtube, Instagram, Linkedin, Github } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SeoHead from '../../components/SeoHead';

export default function ContactPage() {
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    subject: '',
    message: ''
  });
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName || !formData.email || !formData.message) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('/api/send-contact-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          name: `${formData.firstName} ${formData.lastName}`.trim(),
          email: formData.email,
          subject: formData.subject || 'General Inquiry',
          message: formData.message
        }),
      });

      const result = await response.json();
      if (result.success) {
        toast.success('Your message has been sent successfully!');
        setFormData({
          firstName: '',
          lastName: '',
          email: '',
          subject: '',
          message: ''
        });
      } else {
        throw new Error(result.error || 'Failed to send message.');
      }
    } catch (error: any) {
      console.error('Contact submit error:', error);
      toast.error(error.message || 'Something went wrong. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-black font-sans text-white scroll-smooth overflow-x-hidden w-full flex flex-col justify-between">
      <SeoHead pageId="contact" />
      <Toaster position="top-right" toastOptions={{ style: { background: '#18181b', color: '#fff', border: '1px solid #27272a' } }} />
      <Header />

      <main className="flex-grow pt-28 pb-16 flex items-center justify-center relative">
        {/* Background Visual Wrapper with circular curved bottom shape */}
        <div className="absolute inset-0 bg-black overflow-hidden pointer-events-none z-0">
          {/* Circular bottom curve/arc overlay using CSS radial gradient / border radius */}
          <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[160vw] h-[110vh] bg-gradient-to-b from-zinc-950/80 via-zinc-900/10 to-transparent rounded-b-[100%] border-b border-white/5 shadow-2xl shadow-red-950/5" />
          
          {/* Vertical subtle stripes */}
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#ffffff02_1px,transparent_1px)] bg-[size:4rem_100%] opacity-30" />
          
          {/* Center glow behind form */}
          <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-[400px] h-[400px] bg-red-650/5 blur-[100px] rounded-full pointer-events-none" />
        </div>

        <div className="max-w-3xl w-full mx-auto px-4 sm:px-6 lg:px-8 relative z-10 py-10 flex flex-col items-center">
          
          {/* Header pill */}
          <motion.div
            initial={{ opacity: 0, y: -15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-zinc-950/90 border border-zinc-800/80 text-xs font-semibold shadow-xl shadow-black/40 mb-6 text-red-500 uppercase tracking-wider"
          >
            <span>Contact Us</span>
          </motion.div>

          {/* Heading and subtext */}
          <div className="text-center max-w-lg mb-10 space-y-3">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white"
            >
              Lets Have a Chat
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-zinc-400 text-sm sm:text-base leading-relaxed"
            >
              Questions about our products/services, orders, or just want to say hello? We're here to help
            </motion.p>
          </div>

          {/* Form */}
          <motion.form
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            onSubmit={handleSubmit}
            className="w-full space-y-6"
          >
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              
              {/* First Name */}
              <div className="space-y-2">
                <label htmlFor="firstName" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  First name
                </label>
                <input
                  type="text"
                  id="firstName"
                  name="firstName"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="First name"
                  required
                  className="w-full bg-zinc-950/60 border border-zinc-850 hover:border-zinc-800 focus:border-red-650/40 rounded-xl px-4 py-3.5 text-zinc-200 placeholder-zinc-700 outline-none transition-colors"
                />
              </div>

              {/* Last Name */}
              <div className="space-y-2">
                <label htmlFor="lastName" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Last name
                </label>
                <input
                  type="text"
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Last name"
                  className="w-full bg-zinc-950/60 border border-zinc-850 hover:border-zinc-800 focus:border-red-650/40 rounded-xl px-4 py-3.5 text-zinc-200 placeholder-zinc-700 outline-none transition-colors"
                />
              </div>

              {/* Email */}
              <div className="space-y-2">
                <label htmlFor="email" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Email
                </label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email"
                  required
                  className="w-full bg-zinc-950/60 border border-zinc-850 hover:border-zinc-800 focus:border-red-650/40 rounded-xl px-4 py-3.5 text-zinc-200 placeholder-zinc-700 outline-none transition-colors"
                />
              </div>

              {/* Phone/Subject */}
              <div className="space-y-2">
                <label htmlFor="subject" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Phone number
                </label>
                <input
                  type="text"
                  id="subject"
                  name="subject"
                  value={formData.subject}
                  onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                  placeholder="Phone number"
                  className="w-full bg-zinc-950/60 border border-zinc-850 hover:border-zinc-800 focus:border-red-650/40 rounded-xl px-4 py-3.5 text-zinc-200 placeholder-zinc-700 outline-none transition-colors"
                />
              </div>

            </div>

            {/* Message */}
            <div className="space-y-2">
              <label htmlFor="message" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                Message
              </label>
              <textarea
                id="message"
                name="message"
                rows={5}
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                placeholder="Message"
                required
                className="w-full bg-zinc-950/60 border border-zinc-850 hover:border-zinc-800 focus:border-red-650/40 rounded-xl px-4 py-3.5 text-zinc-200 placeholder-zinc-700 outline-none transition-colors resize-none"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl shadow-lg shadow-red-950/20 transition-all hover:scale-[1.01] disabled:opacity-70 disabled:cursor-not-allowed border border-red-500/20"
              >
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin" />
                ) : (
                  <>
                    <span>Send message</span>
                    <Send size={15} />
                  </>
                )}
              </button>
            </div>
          </motion.form>

          {/* Social Links */}
          <div className="flex gap-6 mt-10 text-zinc-500 border-t border-zinc-850/60 pt-6 w-full justify-center">
            <a href="https://facebook.com/techfnm" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">
              <Facebook size={18} />
            </a>
            <a href="https://youtube.com/@techhfnm" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">
              <Youtube size={18} />
            </a>
            <a href="https://instagram.com/techfnm" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">
              <Instagram size={18} />
            </a>
            <a href="https://linkedin.com/company/techfnm" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">
              <Linkedin size={18} />
            </a>
            <a href="https://github.com/Tech-FNM" target="_blank" rel="noopener noreferrer" className="hover:text-red-500 transition-colors">
              <Github size={18} />
            </a>
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

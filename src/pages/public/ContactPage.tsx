import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Send, Loader2, Facebook, Youtube, Instagram, Linkedin, Github } from 'lucide-react';
import { toast, Toaster } from 'react-hot-toast';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SeoHead from '../../components/SeoHead';
import { usePageContent } from '../../lib/cmsContent';
import { supabase } from '../../lib/supabase';

const SOCIALS = [
  { href: 'https://www.facebook.com/techfnm', label: 'TechFNM on Facebook', Icon: Facebook },
  { href: 'https://www.youtube.com/@techhfnm', label: 'TechFNM on YouTube', Icon: Youtube },
  { href: 'https://www.instagram.com/techfnm', label: 'TechFNM on Instagram', Icon: Instagram },
  { href: 'https://www.linkedin.com/company/techfnm', label: 'TechFNM on LinkedIn', Icon: Linkedin },
  { href: 'https://github.com/Tech-FNM', label: 'TechFNM on GitHub', Icon: Github },
];

export default function ContactPage() {
  const pageContent = usePageContent('page-contact', {
    hero_badge: 'Contact Us',
    hero_title: "Let's Have a Chat",
    hero_desc: "Questions about our products/services, orders, or just want to say hello? We're here to help"
  });

  const emptyForm = { firstName: '', lastName: '', email: '', phone: '', message: '' };
  const [formData, setFormData] = useState(emptyForm);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.firstName.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error('Please fill in all required fields.');
      return;
    }

    setLoading(true);
    const name = `${formData.firstName} ${formData.lastName}`.trim();

    // 1. Save as a lead (shows up in Admin → Leads) so a message is never lost if email delivery fails
    const saved = await supabase
      .from('service_requests')
      .insert([{
        name,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        business_name: 'Contact Form',
        business_type: 'Contact Form',
        service: 'General Inquiry',
        seo_issues: [],
        how_found: 'Website Contact Page',
        description: formData.message.trim(),
        preferred_contact: formData.phone.trim() ? 'Phone' : 'Email',
      }])
      .then(({ error }) => !error, () => false);

    // 2. Email notification. The phone number used to be sent as the email *subject*.
    const emailed = await fetch('/api/send-contact-email', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        name,
        email: formData.email.trim(),
        phone: formData.phone.trim(),
        subject: 'Website Contact Form',
        message: formData.message.trim()
      }),
    })
      .then(async (r) => r.ok && (await r.json().catch(() => ({}))).success === true)
      .catch(() => false);

    if (saved || emailed) {
      toast.success("Thanks! Your message has been sent. We'll get back to you within 24 hours.");
      setFormData(emptyForm);
    } else {
      toast.error('Sorry, we could not send your message. Please email techhfnm@gmail.com or call 0313-9023118.');
    }
    setLoading(false);
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
            className="eyebrow mb-6"
          >
            <span>{pageContent.hero_badge || 'Contact Us'}</span>
          </motion.div>

          {/* Heading and subtext */}
          <div className="text-center max-w-lg mb-10 space-y-3">
            <motion.h1
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
              className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white"
            >
              {pageContent.hero_title || "Let's Have a Chat"}
            </motion.h1>
            <motion.p
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
              className="text-zinc-400 text-sm sm:text-base leading-relaxed"
            >
              {pageContent.hero_desc || "Questions about our products/services, orders, or just want to say hello? We're here to help"}
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
                  autoComplete="given-name"
                  value={formData.firstName}
                  onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                  placeholder="First name"
                  required
                  className="field py-3.5"
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
                  autoComplete="family-name"
                  value={formData.lastName}
                  onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                  placeholder="Last name"
                  className="field py-3.5"
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
                  autoComplete="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  placeholder="Email"
                  required
                  className="field py-3.5"
                />
              </div>

              {/* Phone */}
              <div className="space-y-2">
                <label htmlFor="phone" className="block text-xs font-semibold text-zinc-400 uppercase tracking-wider">
                  Phone number
                </label>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  autoComplete="tel"
                  value={formData.phone}
                  onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                  placeholder="Phone number"
                  className="field py-3.5"
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
                className="field py-3.5 resize-none"
              />
            </div>

            {/* Submit Button */}
            <div>
              <button
                type="submit"
                disabled={loading}
                className="btn-primary w-full flex items-center justify-center gap-2 text-white font-semibold py-4 rounded-xl"
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
            {SOCIALS.map(({ href, label, Icon }) => (
              <a key={href} href={href} target="_blank" rel="noopener noreferrer" aria-label={label} title={label} className="hover:text-red-500 transition-colors">
                <Icon size={18} />
              </a>
            ))}
          </div>

        </div>
      </main>

      <Footer />
    </div>
  );
}

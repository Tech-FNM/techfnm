import { useState } from 'react';
import Header from '../../components/Header';
import Footer from '../../components/Footer';
import SeoHead from '../../components/SeoHead';
import { motion } from 'motion/react';
import { Send, CheckCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const BUSINESS_TYPES = [
  'E-Commerce',
  'Service Provider',
  'Blogging',
  'Economic',
  'News',
];

const SERVICES = [
  'Development',
  'On Page SEO',
  'Off Page SEO',
  'Technical SEO',
  'Local SEO',
  'SEO Audit',
  'Ads (PPC)',
  'Social Media Marketing (SMM)',
  'Graphic Designing',
  'Content Writing',
  'Other',
];

const SEO_ISSUES = [
  'Keyword Ranking',
  'Traffic',
  'Backlink Issue',
  'Page Speed',
  'Mobile Optimization',
  'Other',
];

const CONTACT_METHODS = [
  'Email',
  'Phone',
  'WhatsApp',
];

const HOW_FOUND = [
  'Google Search',
  'Social Media',
  'Referral / Word of Mouth',
  'Online Advertisement',
  'Blog / Article',
  'Other',
];

export default function RequestServicePage() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    business_name: '',
    business_website: '',
    business_type: '',
    service: '',
    seo_issues: [] as string[],
    why_choose_us: '',
    how_found: '',
    description: '',
    preferred_contact: '',
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleCheckbox = (issue: string) => {
    setFormData(prev => ({
      ...prev,
      seo_issues: prev.seo_issues.includes(issue)
        ? prev.seo_issues.filter(i => i !== issue)
        : [...prev.seo_issues, issue]
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    try {
      // 1. Save to Supabase Dashboard
      const { error } = await supabase.from('service_requests').insert([{
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        business_name: formData.business_name,
        business_website: formData.business_website || null,
        business_type: formData.business_type,
        service: formData.service,
        seo_issues: formData.seo_issues,
        why_choose_us: formData.why_choose_us || null,
        how_found: formData.how_found,
        description: formData.description,
        preferred_contact: formData.preferred_contact,
      }]);

      if (error) throw error;

      // 2. Send Email via Web3Forms (if access key is configured)
      const accessKey = import.meta.env.VITE_WEB3FORMS_ACCESS_KEY;
      if (accessKey) {
        await fetch('https://api.web3forms.com/submit', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
          body: JSON.stringify({
            access_key: accessKey,
            subject: `New Service Request from ${formData.name} - TechFNM`,
            from_name: 'TechFNM Leads',
            ...formData,
            seo_issues: formData.seo_issues.join(', ')
          })
        });
      }

      setIsSubmitted(true);
    } catch (err: any) {
      console.error(err);
      alert('Something went wrong. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black font-sans text-white flex flex-col w-full">
      <SeoHead pageId="request-service" title="Request a Service - Get a Free Quote | TechFNM" />
      <Header />

      <main className="flex-grow pt-32 pb-24">
        {/* Hero */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center mb-16">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="text-red-500 font-semibold tracking-wider uppercase text-sm">Get Started</span>
            <h1 className="mt-4 text-4xl md:text-6xl font-extrabold text-white tracking-tight">
              Request a <span className="text-transparent bg-clip-text bg-gradient-to-r from-red-500 to-orange-500">Service</span>
            </h1>
            <p className="mt-6 text-lg text-zinc-400 max-w-2xl mx-auto leading-relaxed">
              Tell us about your business and what you need. We'll get back to you with a tailored solution and a free quote within 24 hours.
            </p>
          </motion.div>
        </section>

        {/* Form */}
        <section className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
          {isSubmitted ? (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              className="text-center py-20 bg-zinc-900 border border-zinc-800 rounded-3xl"
            >
              <CheckCircle className="mx-auto text-green-500 mb-6" size={64} />
              <h2 className="text-3xl font-bold mb-4">Thank You!</h2>
              <p className="text-zinc-400 text-lg max-w-md mx-auto">
                Your service request has been submitted successfully. Our team will review it and reach out to you within 24 hours.
              </p>
            </motion.div>
          ) : (
            <motion.form
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              onSubmit={handleSubmit}
              className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 md:p-12 space-y-8 relative overflow-hidden"
            >
              <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/5 rounded-full blur-3xl" />
              <div className="absolute bottom-0 left-0 w-48 h-48 bg-orange-500/5 rounded-full blur-3xl" />

              {/* Personal Info */}
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-white mb-4 pb-2 border-b border-zinc-800">Personal Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1.5">Full Name <span className="text-red-500">*</span></label>
                    <input name="name" required value={formData.name} onChange={handleChange}
                      className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-zinc-600"
                      placeholder="John Doe" />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1.5">Email Address <span className="text-red-500">*</span></label>
                    <input name="email" type="email" required value={formData.email} onChange={handleChange}
                      className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-zinc-600"
                      placeholder="john@example.com" />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1.5">Phone Number <span className="text-red-500">*</span></label>
                    <input name="phone" type="tel" required value={formData.phone} onChange={handleChange}
                      className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-zinc-600"
                      placeholder="+1 (234) 567-890" />
                  </div>
                </div>
              </div>

              {/* Business Info */}
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-white mb-4 pb-2 border-b border-zinc-800">Business Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1.5">Business Name <span className="text-red-500">*</span></label>
                    <input name="business_name" required value={formData.business_name} onChange={handleChange}
                      className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-zinc-600"
                      placeholder="Your Business Name" />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1.5">Business Website <span className="text-zinc-600">(Optional)</span></label>
                    <input name="business_website" value={formData.business_website} onChange={handleChange}
                      className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-zinc-600"
                      placeholder="https://yourbusiness.com" />
                  </div>
                  <div className="md:col-span-2">
                    <label className="block text-sm text-zinc-400 mb-1.5">Business Type <span className="text-red-500">*</span></label>
                    <select name="business_type" required value={formData.business_type} onChange={handleChange}
                      className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-all appearance-none cursor-pointer">
                      <option value="" className="bg-zinc-900">Select your business type</option>
                      {BUSINESS_TYPES.map(t => <option key={t} value={t} className="bg-zinc-900">{t}</option>)}
                    </select>
                  </div>
                </div>
              </div>

              {/* Service Selection */}
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-white mb-4 pb-2 border-b border-zinc-800">Service Required</h3>
                <div>
                  <label className="block text-sm text-zinc-400 mb-1.5">Select a Service <span className="text-red-500">*</span></label>
                  <select name="service" required value={formData.service} onChange={handleChange}
                    className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-all appearance-none cursor-pointer">
                    <option value="" className="bg-zinc-900">Choose a service</option>
                    {SERVICES.map(s => <option key={s} value={s} className="bg-zinc-900">{s}</option>)}
                  </select>
                </div>
              </div>

              {/* SEO Issues */}
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-white mb-4 pb-2 border-b border-zinc-800">SEO Issues You Are Facing</h3>
                <p className="text-sm text-zinc-500 mb-3">Select all that apply:</p>
                <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                  {SEO_ISSUES.map(issue => (
                    <label key={issue} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      formData.seo_issues.includes(issue)
                        ? 'border-red-500 bg-red-500/10 text-white'
                        : 'border-zinc-800 bg-black/30 text-zinc-400 hover:border-zinc-700'
                    }`}>
                      <input type="checkbox" checked={formData.seo_issues.includes(issue)} onChange={() => handleCheckbox(issue)}
                        className="accent-red-500 w-4 h-4" />
                      <span className="text-sm">{issue}</span>
                    </label>
                  ))}
                </div>
              </div>

              {/* Additional Info */}
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-white mb-4 pb-2 border-b border-zinc-800">Additional Information</h3>
                <div className="space-y-5">
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1.5">Why Did You Choose Us? <span className="text-zinc-600">(Optional)</span></label>
                    <input name="why_choose_us" value={formData.why_choose_us} onChange={handleChange}
                      className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-zinc-600"
                      placeholder="What made you reach out to us?" />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1.5">How Did You Find Us? <span className="text-red-500">*</span></label>
                    <select name="how_found" required value={formData.how_found} onChange={handleChange}
                      className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-all appearance-none cursor-pointer">
                      <option value="" className="bg-zinc-900">Select an option</option>
                      {HOW_FOUND.map(h => <option key={h} value={h} className="bg-zinc-900">{h}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1.5">Brief Description of Your Query or Concern <span className="text-red-500">*</span></label>
                    <textarea name="description" required rows={5} value={formData.description} onChange={handleChange}
                      className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 focus:ring-1 focus:ring-red-500 transition-all placeholder:text-zinc-600 resize-none"
                      placeholder="Tell us more about your project, goals, and any specific requirements..." />
                  </div>
                  <div>
                    <label className="block text-sm text-zinc-400 mb-1.5">Preferred Method of Contact <span className="text-red-500">*</span></label>
                    <div className="flex gap-4 flex-wrap">
                      {CONTACT_METHODS.map(method => (
                        <label key={method} className={`flex items-center gap-2 px-5 py-3 rounded-xl border cursor-pointer transition-all ${
                          formData.preferred_contact === method
                            ? 'border-red-500 bg-red-500/10 text-white'
                            : 'border-zinc-800 bg-black/30 text-zinc-400 hover:border-zinc-700'
                        }`}>
                          <input type="radio" name="preferred_contact" value={method}
                            checked={formData.preferred_contact === method}
                            onChange={handleChange}
                            className="accent-red-500 w-4 h-4" />
                          <span className="text-sm font-medium">{method}</span>
                        </label>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Submit */}
              <div className="relative z-10 pt-4 border-t border-zinc-800">
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full md:w-auto bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 text-white font-bold rounded-xl px-10 py-4 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shadow-lg shadow-red-600/20"
                >
                  {isSubmitting ? (
                    <span className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  ) : (
                    <>Submit Request <Send className="w-5 h-5" /></>
                  )}
                </button>
                <p className="text-xs text-zinc-600 mt-3">By submitting, you agree to our terms and privacy policy.</p>
              </div>
            </motion.form>
          )}
        </section>
      </main>

      <Footer />
    </div>
  );
}

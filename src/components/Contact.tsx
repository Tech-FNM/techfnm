import { motion } from 'motion/react';
import { Mail, MapPin, Phone, Send, Loader2, CheckCircle2, AlertCircle } from 'lucide-react';
import { useState } from 'react';
import { supabase } from '../lib/supabase';

export default function Contact() {
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
      
      // Reset success message after 5 seconds
      setTimeout(() => setStatus('idle'), 5000);
    } catch (err: any) {
      console.error('Error submitting form:', err);
      setStatus('error');
      setErrorMessage(err.message || 'Something went wrong. Please try again.');
    }
  };

  return (
    <section id="contact" className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-red-500 font-semibold tracking-wider uppercase text-sm">Get In Touch</span>
          <h2 className="mt-2 text-4xl font-bold text-white sm:text-5xl">Contact Us</h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-400 mx-auto">
            Have a project in mind or want to learn more about our services? We'd love to hear from you.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="bg-zinc-900 rounded-2xl shadow-lg p-8 md:p-12 border border-zinc-800"
          >
            <h3 className="text-2xl font-bold text-white mb-8">Send Us a Message</h3>
            
            {status === 'success' && (
              <div className="mb-6 bg-emerald-500/10 border border-emerald-500/20 text-emerald-400 p-4 rounded-lg flex items-start gap-3">
                <CheckCircle2 className="shrink-0 mt-0.5" size={20} />
                <p>Thank you for your message! We will get back to you shortly.</p>
              </div>
            )}

            {status === 'error' && (
              <div className="mb-6 bg-red-500/10 border border-red-500/20 text-red-400 p-4 rounded-lg flex items-start gap-3">
                <AlertCircle className="shrink-0 mt-0.5" size={20} />
                <p>{errorMessage}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label htmlFor="name" className="block text-sm font-medium text-gray-300 mb-2">Name</label>
                  <input
                    type="text"
                    id="name"
                    required
                    value={formData.name}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all placeholder-gray-500"
                    placeholder="Your Name"
                    disabled={status === 'submitting'}
                  />
                </div>
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-gray-300 mb-2">Email</label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={formData.email}
                    onChange={handleChange}
                    className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all placeholder-gray-500"
                    placeholder="Your Email"
                    disabled={status === 'submitting'}
                  />
                </div>
              </div>
              <div>
                <label htmlFor="subject" className="block text-sm font-medium text-gray-300 mb-2">Subject</label>
                <input
                  type="text"
                  id="subject"
                  required
                  value={formData.subject}
                  onChange={handleChange}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all placeholder-gray-500"
                  placeholder="Subject"
                  disabled={status === 'submitting'}
                />
              </div>
              <div>
                <label htmlFor="message" className="block text-sm font-medium text-gray-300 mb-2">Message</label>
                <textarea
                  id="message"
                  required
                  value={formData.message}
                  onChange={handleChange}
                  rows={5}
                  className="w-full px-4 py-3 rounded-lg bg-zinc-800 border border-zinc-700 text-white focus:outline-none focus:ring-2 focus:ring-red-500 focus:border-transparent transition-all resize-none placeholder-gray-500"
                  placeholder="Your Message"
                  disabled={status === 'submitting'}
                ></textarea>
              </div>
              <button
                type="submit"
                disabled={status === 'submitting'}
                className="w-full bg-red-600 text-white px-6 py-4 rounded-lg font-bold text-lg hover:bg-red-700 transition-colors shadow-lg shadow-red-600/30 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? (
                  <Loader2 size={20} className="animate-spin" />
                ) : (
                  <Send size={20} />
                )}
                {status === 'submitting' ? 'Sending...' : 'Send Message'}
              </button>
            </form>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 50 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            className="space-y-8"
          >
            <div className="bg-zinc-900 rounded-2xl shadow-sm p-8 flex items-start gap-6 hover:shadow-md transition-shadow border border-zinc-800">
              <div className="bg-red-900/20 p-4 rounded-full text-red-500">
                <MapPin size={24} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Our Location</h4>
                <p className="text-gray-400 leading-relaxed">
                  Pakistan
                </p>
                <a href="https://maps.app.goo.gl/ieJ4Ko2D1zhtWhRA6" target="_blank" rel="noopener noreferrer" className="text-red-500 hover:text-red-400 font-medium mt-2 inline-block">
                  View on Map &rarr;
                </a>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-2xl shadow-sm p-8 flex items-start gap-6 hover:shadow-md transition-shadow border border-zinc-800">
              <div className="bg-red-900/20 p-4 rounded-full text-red-500">
                <Phone size={24} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Phone Number</h4>
                <p className="text-gray-400 leading-relaxed mb-2">
                  Call us directly for immediate assistance.
                </p>
                <a href="tel:0313-9023118" className="text-lg font-bold text-white hover:text-red-500 transition-colors">
                  0313-9023118
                </a>
              </div>
            </div>

            <div className="bg-zinc-900 rounded-2xl shadow-sm p-8 flex items-start gap-6 hover:shadow-md transition-shadow border border-zinc-800">
              <div className="bg-red-900/20 p-4 rounded-full text-red-500">
                <Mail size={24} />
              </div>
              <div>
                <h4 className="text-xl font-bold text-white mb-2">Email Address</h4>
                <p className="text-gray-400 leading-relaxed mb-2">
                  Send us an email and we'll get back to you shortly.
                </p>
                <a href="mailto:techhfnm@gmail.com" className="text-lg font-bold text-white hover:text-red-500 transition-colors">
                  techhfnm@gmail.com
                </a>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}

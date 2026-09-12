import { Mail, MapPin, Phone, Facebook, Youtube, Instagram, Linkedin, Github, CheckCircle2, Loader2, ArrowUpRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [settings, setSettings] = useState({
    description: 'We are a creative digital agency dedicated to delivering innovative solutions that drive real business growth.',
    facebookUrl: 'https://www.facebook.com/techfnm',
    youtubeUrl: 'https://www.youtube.com/@techhfnm',
    instagramUrl: 'https://www.instagram.com/techfnm',
    linkedinUrl: 'https://www.linkedin.com/company/techfnm',
    githubUrl: 'https://github.com/Tech-FNM',
    address: 'Karachi, Pakistan',
    phone: '0313-9023118',
    email: 'techhfnm@gmail.com',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data } = await supabase
        .from('site_settings')
        .select('content')
        .eq('id', 'footer_settings')
        .maybeSingle();

      if (data && data.content) {
        setSettings(prev => ({ ...prev, ...data.content }));
      }
    } catch (err) {
      console.error('Error fetching footer settings:', err);
    }
  };

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;
    
    setStatus('submitting');
    try {
      const response = await fetch("https://formsubmit.co/ajax/techhfnm@gmail.com", {
        method: "POST",
        headers: { 
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          email: email,
          _subject: "New Newsletter Subscription from Fexora Footer!"
        })
      });

      if (!response.ok) throw new Error('Failed to subscribe');

      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 3000);
    }
  };

  return (
    <footer className="bg-black text-white pt-20 pb-12 border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-16 border-b border-white/10">
          {/* Column 1: Brand & Bio (4 cols) */}
          <div className="lg:col-span-4">
            <div className="mb-6 flex items-center gap-2">
              <img 
                src="/image/agency-assets/projects/0.569918561129375.png" 
                alt="TechFNM Logo" 
                className="h-10 w-auto object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="text-2xl font-bold text-white tracking-tight">
                Tech<span className="text-[#e5432e] ml-1">FNM</span>
              </div>
            </div>

            <p className="text-zinc-400 mb-6 text-sm sm:text-base leading-relaxed">
              {settings.description}
            </p>

            {/* Social Pill Icons */}
            <div className="flex flex-wrap gap-2.5">
              {settings.facebookUrl && (
                <a
                  href={settings.facebookUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Facebook"
                  className="w-10 h-10 rounded-full bg-[#121214] border border-white/10 hover:border-[#e5432e] hover:bg-[#e5432e] hover:text-white text-zinc-400 flex items-center justify-center transition-all duration-300"
                >
                  <Facebook size={17} />
                </a>
              )}
              {settings.instagramUrl && (
                <a
                  href={settings.instagramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="Instagram"
                  className="w-10 h-10 rounded-full bg-[#121214] border border-white/10 hover:border-[#e5432e] hover:bg-[#e5432e] hover:text-white text-zinc-400 flex items-center justify-center transition-all duration-300"
                >
                  <Instagram size={17} />
                </a>
              )}
              {settings.linkedinUrl && (
                <a
                  href={settings.linkedinUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="LinkedIn"
                  className="w-10 h-10 rounded-full bg-[#121214] border border-white/10 hover:border-[#e5432e] hover:bg-[#e5432e] hover:text-white text-zinc-400 flex items-center justify-center transition-all duration-300"
                >
                  <Linkedin size={17} />
                </a>
              )}
              {settings.youtubeUrl && (
                <a
                  href={settings.youtubeUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="YouTube"
                  className="w-10 h-10 rounded-full bg-[#121214] border border-white/10 hover:border-[#e5432e] hover:bg-[#e5432e] hover:text-white text-zinc-400 flex items-center justify-center transition-all duration-300"
                >
                  <Youtube size={17} />
                </a>
              )}
              {settings.githubUrl && (
                <a
                  href={settings.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  aria-label="GitHub"
                  className="w-10 h-10 rounded-full bg-[#121214] border border-white/10 hover:border-[#e5432e] hover:bg-[#e5432e] hover:text-white text-zinc-400 flex items-center justify-center transition-all duration-300"
                >
                  <Github size={17} />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links (2.5 cols) */}
          <div className="lg:col-span-2">
            <h3 className="text-base font-bold text-white mb-5 uppercase tracking-wider text-xs">
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="text-zinc-400 hover:text-[#e5432e] transition-colors">Home</Link></li>
              <li><Link to="/about" className="text-zinc-400 hover:text-[#e5432e] transition-colors">About Us</Link></li>
              <li><Link to="/services" className="text-zinc-400 hover:text-[#e5432e] transition-colors">Services</Link></li>
              <li><Link to="/portfolio" className="text-zinc-400 hover:text-[#e5432e] transition-colors">Portfolio</Link></li>
              <li><Link to="/blog" className="text-zinc-400 hover:text-[#e5432e] transition-colors">Blog & Insights</Link></li>
              <li><Link to="/faq" className="text-zinc-400 hover:text-[#e5432e] transition-colors">FAQs</Link></li>
              <li><Link to="/contact" className="text-zinc-400 hover:text-[#e5432e] transition-colors">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Our Services (2.5 cols) */}
          <div className="lg:col-span-3">
            <h3 className="text-base font-bold text-white mb-5 uppercase tracking-wider text-xs">
              Our Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/services" className="text-zinc-400 hover:text-[#e5432e] transition-colors">Web Design & Development</Link></li>
              <li><Link to="/services" className="text-zinc-400 hover:text-[#e5432e] transition-colors">Mobile App Engineering</Link></li>
              <li><Link to="/services" className="text-zinc-400 hover:text-[#e5432e] transition-colors">Search Engine Optimization</Link></li>
              <li><Link to="/services" className="text-zinc-400 hover:text-[#e5432e] transition-colors">Social Media Marketing</Link></li>
              <li><Link to="/services" className="text-zinc-400 hover:text-[#e5432e] transition-colors">Brand Identity & Strategy</Link></li>
            </ul>
          </div>

          {/* Column 4: Newsletter Subscription (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className="text-base font-bold text-white mb-5 uppercase tracking-wider text-xs">
              Subscribe Newsletter
            </h3>
            <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
              Subscribe to our newsletter to get the latest digital trends delivered to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                disabled={status === 'submitting' || status === 'success'}
                className="w-full bg-[#121214] text-white px-4 py-3 rounded-xl focus:outline-none focus:border-[#e5432e] border border-white/10 text-sm placeholder-zinc-500 transition-colors"
              />
              <button
                type="submit"
                disabled={status === 'submitting' || status === 'success'}
                className="w-full group inline-flex items-center justify-center gap-2 bg-[#e5432e] hover:bg-[#cc3622] text-white px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 shadow-md shadow-[#e5432e]/20"
              >
                {status === 'submitting' ? (
                  <Loader2 size={16} className="animate-spin" />
                ) : status === 'success' ? (
                  <>
                    <CheckCircle2 size={16} />
                    <span>Subscribed!</span>
                  </>
                ) : (
                  <>
                    <span>Subscribe Now</span>
                    <ArrowUpRight size={15} />
                  </>
                )}
              </button>
            </form>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>
            Copyright &copy; {new Date().getFullYear()} <span className="text-white font-medium">TechFNM</span>. All rights reserved.
          </p>
          <div className="flex items-center gap-6">
            <Link to="/about" className="hover:text-zinc-300 transition-colors">Privacy Policy</Link>
            <Link to="/about" className="hover:text-zinc-300 transition-colors">Terms of Service</Link>
            <Link to="/contact" className="hover:text-zinc-300 transition-colors">Support</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

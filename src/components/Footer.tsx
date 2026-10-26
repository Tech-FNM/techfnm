import { Mail, MapPin, Phone, Facebook, Youtube, Instagram, Linkedin, Github, CheckCircle2, Loader2, ArrowUpRight } from 'lucide-react';
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useServices } from '../lib/useServices';
import { telHref } from '../lib/phone';

export default function Footer() {
  const services = useServices();
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
          _subject: "New Newsletter Subscription - TechFNM Website",
          _template: "table"
        })
      });

      if (!response.ok) throw new Error('Failed to subscribe');

      setStatus('success');
      setEmail('');
      setTimeout(() => setStatus('idle'), 3000);
    } catch (error) {
      setStatus('error');
      setTimeout(() => setStatus('idle'), 5000);
    }
  };

  const headingCls = 'text-xs font-bold text-white mb-5 uppercase tracking-wider';

  return (
    <footer className="bg-black text-white pt-20 pb-12 border-t border-white/10 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-10 lg:gap-12 pb-16 border-b border-white/10">
          {/* Column 1: Brand & Bio (4 cols) */}
          <div className="lg:col-span-4">
            <div className="mb-6 flex items-center">
              <Link to="/">
                <img width={160} height={40} loading="lazy" decoding="async" 
                  src="/image/agency-assets/projects/0.569918561129375.png" 
                  alt="TechFNM Logo" 
                  className="h-10 w-auto object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
                <div className="hidden text-2xl font-bold text-white tracking-tight">
                  Tech<span className="text-[#e5432e] ml-1">FNM</span>
                </div>
              </Link>
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
                  className="w-10 h-10 rounded-full bg-[#121214] border border-white/10 hover:border-[#e5432e] hover:bg-[#e5432e] hover:text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#e5432e]/25 text-zinc-400 flex items-center justify-center transition-all duration-300"
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
                  className="w-10 h-10 rounded-full bg-[#121214] border border-white/10 hover:border-[#e5432e] hover:bg-[#e5432e] hover:text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#e5432e]/25 text-zinc-400 flex items-center justify-center transition-all duration-300"
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
                  className="w-10 h-10 rounded-full bg-[#121214] border border-white/10 hover:border-[#e5432e] hover:bg-[#e5432e] hover:text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#e5432e]/25 text-zinc-400 flex items-center justify-center transition-all duration-300"
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
                  className="w-10 h-10 rounded-full bg-[#121214] border border-white/10 hover:border-[#e5432e] hover:bg-[#e5432e] hover:text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#e5432e]/25 text-zinc-400 flex items-center justify-center transition-all duration-300"
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
                  className="w-10 h-10 rounded-full bg-[#121214] border border-white/10 hover:border-[#e5432e] hover:bg-[#e5432e] hover:text-white hover:-translate-y-0.5 hover:shadow-lg hover:shadow-[#e5432e]/25 text-zinc-400 flex items-center justify-center transition-all duration-300"
                >
                  <Github size={17} />
                </a>
              )}
            </div>
          </div>

          {/* Column 2: Quick Links (2.5 cols) */}
          <div className="lg:col-span-2">
            <h3 className={headingCls}>
              Quick Links
            </h3>
            <ul className="space-y-2.5 text-sm">
              <li><Link to="/" className="text-zinc-400 hover:text-[#e5432e] inline-block transition-[color,translate] duration-200 hover:translate-x-1">Home</Link></li>
              <li><Link to="/about" className="text-zinc-400 hover:text-[#e5432e] inline-block transition-[color,translate] duration-200 hover:translate-x-1">About Us</Link></li>
              <li><Link to="/services" className="text-zinc-400 hover:text-[#e5432e] inline-block transition-[color,translate] duration-200 hover:translate-x-1">Services</Link></li>
              <li><Link to="/portfolio" className="text-zinc-400 hover:text-[#e5432e] inline-block transition-[color,translate] duration-200 hover:translate-x-1">Portfolio</Link></li>
              <li><Link to="/blog" className="text-zinc-400 hover:text-[#e5432e] inline-block transition-[color,translate] duration-200 hover:translate-x-1">Blog & Insights</Link></li>
              <li><Link to="/faq" className="text-zinc-400 hover:text-[#e5432e] inline-block transition-[color,translate] duration-200 hover:translate-x-1">FAQs</Link></li>
              <li><Link to="/contact" className="text-zinc-400 hover:text-[#e5432e] inline-block transition-[color,translate] duration-200 hover:translate-x-1">Contact Us</Link></li>
            </ul>
          </div>

          {/* Column 3: Our Services (2.5 cols) */}
          <div className="lg:col-span-3">
            <h3 className={headingCls}>
              Our Services
            </h3>
            <ul className="space-y-2.5 text-sm">
              {services.map((s) => (
                <li key={s.slug}>
                  <Link to={`/services/${s.slug}`} className="text-zinc-400 hover:text-[#e5432e] inline-block transition-[color,translate] duration-200 hover:translate-x-1">{s.title}</Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Column 4: Newsletter Subscription (3 cols) */}
          <div className="lg:col-span-3">
            <h3 className={headingCls}>
              Subscribe Newsletter
            </h3>
            <p className="text-zinc-400 text-sm mb-4 leading-relaxed">
              Subscribe to our newsletter to get the latest digital trends delivered to your inbox.
            </p>

            <form onSubmit={handleSubscribe} className="space-y-3">
              <label htmlFor="footer-newsletter-email" className="sr-only">Email address</label>
              <input
                id="footer-newsletter-email"
                type="email"
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email address"
                required
                disabled={status === 'submitting' || status === 'success'}
                className="field text-sm"
              />
              <button
                type="submit"
                disabled={status === 'submitting' || status === 'success'}
                className="btn-primary w-full group inline-flex items-center justify-center gap-2 text-white px-5 py-3 rounded-xl text-sm font-semibold"
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
              <p role="status" aria-live="polite" className="text-xs min-h-[1rem]">
                {status === 'error' && (
                  <span className="text-red-400">Subscription failed. Please try again or email us directly.</span>
                )}
              </p>
            </form>

            {/* Direct contact details (also helps local SEO: consistent name/address/phone on every page) */}
            <ul className="mt-6 space-y-2.5 text-sm text-zinc-400">
              <li className="flex items-center gap-2.5">
                <MapPin size={15} className="text-[#e5432e] shrink-0" />
                <span>{settings.address}</span>
              </li>
              <li className="flex items-center gap-2.5">
                <Phone size={15} className="text-[#e5432e] shrink-0" />
                <a href={`tel:${telHref(settings.phone)}`} className="hover:text-white transition-colors">{settings.phone}</a>
              </li>
              <li className="flex items-center gap-2.5">
                <Mail size={15} className="text-[#e5432e] shrink-0" />
                <a href={`mailto:${settings.email}`} className="hover:text-white transition-colors">{settings.email}</a>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-zinc-500">
          <p>
            Copyright &copy; {new Date().getFullYear()} <span className="text-white font-medium">TechFNM</span>. All rights reserved.
          </p>
          {/* "Privacy Policy" / "Terms" used to point at /about — there are no such pages yet, so link real ones */}
          <nav aria-label="Footer" className="flex items-center gap-6">
            <Link to="/faq" className="hover:text-zinc-300 transition-colors">FAQ</Link>
            <Link to="/request-service" className="hover:text-zinc-300 transition-colors">Get a Quote</Link>
            <Link to="/contact" className="hover:text-zinc-300 transition-colors">Support</Link>
          </nav>
        </div>
      </div>
    </footer>
  );
}

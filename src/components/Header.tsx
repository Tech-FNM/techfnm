import { Menu, X, ArrowUpRight, ChevronDown } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';
import { useServices } from '../lib/useServices';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const services = useServices();
  const [svcOpen, setSvcOpen] = useState(false);
  const [content, setContent] = useState<any>({
    logo_text: 'Tech',
    logo_highlight: 'FNM',
    nav_links: [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/about' },
      { label: 'Services', href: '/services' },
      { label: 'Portfolio', href: '/portfolio' },
      { label: 'Blog', href: '/blog' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact Us', href: '/contact' },
    ],
    cta_text: 'Get Free Quote',
    cta_link: '/request-service',
  });

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close menus on navigation (back/forward, in-page links) and with the Escape key
  useEffect(() => {
    setIsOpen(false);
    setSvcOpen(false);
  }, [location.pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
        setSvcOpen(false);
      }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, []);

  useEffect(() => {
    const loadHeader = () => {
      try {
        const local = localStorage.getItem('techfnm_header_content');
        if (local) {
          setContent((prev: any) => ({ ...prev, ...JSON.parse(local) }));
        }
      } catch {}
    };
    loadHeader();

    const fetchHeader = async () => {
      try {
        const { data } = await supabase.from('pages_content').select('content').eq('id', 'site_header').maybeSingle();
        if (data && data.content && Object.keys(data.content).length > 0) {
          setContent((prev: any) => ({ ...prev, ...data.content }));
        }
      } catch {}
    };
    fetchHeader();

    window.addEventListener('techfnm_content_updated', loadHeader);
    return () => window.removeEventListener('techfnm_content_updated', loadHeader);
  }, []);

  // "/blog" is active on "/blog" and "/blog/post", but not on "/blogging"
  const isActive = (path: string) => {
    if (!path || path.startsWith('#') || /^https?:/.test(path)) return false;
    if (path === '/') return location.pathname === '/';
    return location.pathname === path || location.pathname.startsWith(`${path.replace(/\/$/, '')}/`);
  };

  return (
    <header className="fixed top-0 left-0 right-0 z-50 transition-all duration-300 py-3 sm:py-4 px-4 sm:px-6 lg:px-8">
      <div
        className={`max-w-7xl mx-auto rounded-full px-5 sm:px-8 py-3 transition-all duration-300 border flex justify-between items-center ${
          scrolled
            ? 'bg-black/85 backdrop-blur-xl border-white/15 shadow-2xl shadow-black/80'
            : 'bg-[#121214]/75 backdrop-blur-lg border-white/10'
        }`}
      >
        {/* Logo */}
        <div className="flex-shrink-0 flex items-center">
          <Link to="/" className="flex items-center gap-2 group">
            <img width={160} height={40}
              src="/image/agency-assets/projects/0.569918561129375.png"
              alt="TechFNM Logo"
              className="h-9 sm:h-10 w-auto object-contain transition-transform group-hover:scale-105"
              onError={(e) => {
                const target = e.target as HTMLImageElement;
                target.style.display = 'none';
                target.nextElementSibling?.classList.remove('hidden');
              }}
            />
            <div className="hidden text-xl sm:text-2xl font-bold tracking-tight text-white">
              {content.logo_text}
              <span className="text-[#e5432e] ml-1 font-extrabold">{content.logo_highlight}</span>
            </div>
          </Link>
        </div>

        {/* Desktop Navigation Links */}
        <nav aria-label="Main" className="hidden lg:flex items-center space-x-1 sm:space-x-2 bg-black/40 border border-white/5 px-4 py-1.5 rounded-full">
          {(Array.isArray(content.nav_links) ? content.nav_links : []).map((link: any, idx: number) => {
            const active = isActive(link.href);
            const cls = `relative px-3.5 py-1.5 rounded-full text-sm font-medium transition-all duration-200 ${
              active
                ? 'text-white bg-[#e5432e] font-semibold shadow-sm'
                : 'text-zinc-300 hover:text-white hover:bg-white/5'
            }`;
            if (link.href === '/services') {
              return (
                <div
                  key={idx}
                  className="relative"
                  onMouseEnter={() => setSvcOpen(true)}
                  onMouseLeave={() => setSvcOpen(false)}
                  onFocus={() => setSvcOpen(true)}
                  onBlur={(e) => { if (!e.currentTarget.contains(e.relatedTarget as Node)) setSvcOpen(false); }}
                >
                  <Link to={link.href} className={`${cls} inline-flex items-center gap-1`} aria-haspopup="true" aria-expanded={svcOpen}>
                    {link.label}
                    <ChevronDown size={14} />
                  </Link>
                  <div className={`absolute left-0 top-full pt-3 ${svcOpen ? 'block' : 'hidden'}`}>
                    <ul className="min-w-[240px] rounded-2xl bg-[#121214] border border-white/10 p-2 shadow-2xl shadow-black/80">
                      {services.map((s) => (
                        <li key={s.slug}>
                          <Link
                            to={`/services/${s.slug}`}
                            onClick={() => setSvcOpen(false)}
                            className="block px-3 py-2 rounded-xl text-sm text-zinc-300 hover:text-white hover:bg-white/5"
                          >
                            {s.title}
                          </Link>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              );
            }
            return (
              <Link key={idx} to={link.href} className={cls} aria-current={active ? 'page' : undefined}>
                {link.label}
              </Link>
            );
          })}
        </nav>

        {/* CTA Button */}
        <div className="hidden md:flex items-center gap-3">
          <Link
            to={content.cta_link}
            className="group inline-flex items-center gap-2 bg-[#e5432e] hover:bg-[#cc3622] text-white px-5 py-2.5 rounded-full text-sm font-semibold transition-all duration-300 transform hover:scale-[1.02] shadow-lg shadow-[#e5432e]/20"
          >
            <span>{content.cta_text}</span>
            <span className="w-7 h-7 rounded-full bg-white text-[#e5432e] flex items-center justify-center transition-transform duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
              <ArrowUpRight size={15} />
            </span>
          </Link>
        </div>

        {/* Mobile Menu Button */}
        <div className="lg:hidden flex items-center">
          <button
            type="button"
            onClick={() => setIsOpen(!isOpen)}
            className="p-2 rounded-full bg-white/5 border border-white/10 text-zinc-300 hover:text-[#e5432e] transition-colors"
            aria-label={isOpen ? 'Close menu' : 'Open menu'}
            aria-expanded={isOpen}
            aria-controls="mobile-menu"
          >
            {isOpen ? <X size={20} /> : <Menu size={20} />}
          </button>
        </div>
      </div>

      {/* Mobile Offcanvas / Dropdown */}
      <AnimatePresence>
        {isOpen && (
          <motion.nav
            id="mobile-menu"
            aria-label="Mobile"
            initial={{ opacity: 0, y: -15, scale: 0.98 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -15, scale: 0.98 }}
            transition={{ duration: 0.2 }}
            className="lg:hidden mt-2 max-w-7xl mx-auto rounded-3xl bg-[#121214] border border-white/15 p-5 shadow-2xl shadow-black backdrop-blur-2xl"
          >
            <div className="flex flex-col space-y-2">
              {(Array.isArray(content.nav_links) ? content.nav_links : []).map((link: any, idx: number) => {
                const active = isActive(link.href);
                return (
                  <div key={idx} className="flex flex-col">
                  <Link
                    to={link.href}
                    className={`px-4 py-2.5 rounded-xl text-base font-medium transition-colors ${
                      active
                        ? 'bg-[#e5432e] text-white font-semibold'
                        : 'text-zinc-300 hover:text-white hover:bg-white/5'
                    }`}
                    onClick={() => setIsOpen(false)}
                  >
                    {link.label}
                  </Link>
                  {link.href === '/services' && (
                    <div className="pl-4 flex flex-col">
                      {services.map((s) => (
                        <Link
                          key={s.slug}
                          to={`/services/${s.slug}`}
                          onClick={() => setIsOpen(false)}
                          className="px-4 py-2 rounded-xl text-sm text-zinc-400 hover:text-white hover:bg-white/5"
                        >
                          {s.title}
                        </Link>
                      ))}
                    </div>
                  )}
                  </div>
                );
              })}
              <div className="pt-3 border-t border-white/10">
                <Link
                  to={content.cta_link}
                  onClick={() => setIsOpen(false)}
                  className="flex items-center justify-center gap-2 w-full bg-[#e5432e] text-white px-5 py-3 rounded-xl font-semibold hover:bg-[#cc3622] transition-colors"
                >
                  <span>{content.cta_text}</span>
                  <ArrowUpRight size={16} />
                </Link>
              </div>
            </div>
          </motion.nav>
        )}
      </AnimatePresence>
    </header>
  );
}

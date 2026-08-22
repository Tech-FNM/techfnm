import { Menu, Phone, X } from 'lucide-react';
import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Link, useLocation } from 'react-router-dom';
import { supabase } from '../lib/supabase';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const location = useLocation();
  const [content, setContent] = useState<any>({
    logo_text: 'Tech',
    logo_highlight: 'FNM',
    nav_links: [
      { label: 'Home', href: '/' },
      { label: 'About Us', href: '/about' },
      { label: 'Services', href: '/#services' },
      { label: 'Portfolio', href: '/#portfolio' },
      { label: 'FAQ', href: '/faq' },
      { label: 'Contact Us', href: '/contact' },
      { label: 'Request Service', href: '/request-service' },
    ],
    cta_text: '0313-9023118',
    cta_link: 'tel:0313-9023118',
  });

  useEffect(() => {
    const fetchHeader = async () => {
      const { data } = await supabase.from('pages_content').select('content').eq('id', 'site_header').maybeSingle();
      if (data && data.content && Object.keys(data.content).length > 0) {
        setContent((prev: any) => ({ ...prev, ...data.content }));
      }
    };
    fetchHeader();
  }, []);

  const isActive = (path: string) => {
    if (path === '/' && location.pathname !== '/') return false;
    return location.pathname.startsWith(path);
  };

  return (
    <header className="fixed w-full bg-black/90 backdrop-blur-md z-50 shadow-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <Link to="/" className="block">
              <img 
                src="/image/agency-assets/projects/0.569918561129375.png" 
                alt="TechFNM Logo" 
                className="h-10 md:h-12 w-auto object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden text-2xl font-bold text-white">
                {content.logo_text}<span className="text-red-600 ml-1 font-extrabold">{content.logo_highlight}</span>
              </div>
            </Link>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden lg:flex space-x-6">
            {content.nav_links.map((link: any, idx: number) => (
              <Link 
                key={idx}
                to={link.href} 
                className={`${isActive(link.href) ? 'text-red-500' : 'text-gray-300'} hover:text-red-500 font-medium transition-colors text-sm`}
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center">
            <a href={content.cta_link} className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 text-sm">
              <Phone size={16} />
              <span>{content.cta_text}</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="lg:hidden flex items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="text-gray-300 hover:text-red-500 focus:outline-none"
            >
              {isOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="lg:hidden bg-gray-900 border-t border-gray-800 shadow-lg max-h-[80vh] overflow-y-auto"
        >
          <div className="px-4 pt-2 pb-6 space-y-1">
            {content.nav_links.map((link: any, idx: number) => (
              <Link 
                key={idx}
                to={link.href} 
                className={`block px-3 py-3 text-base font-medium rounded-md ${isActive(link.href) ? 'text-red-500 bg-gray-800' : 'text-gray-300 hover:text-red-500 hover:bg-gray-800'}`}
                onClick={() => setIsOpen(false)}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4">
              <a href={content.cta_link} className="flex items-center justify-center gap-2 w-full bg-red-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">
                <Phone size={18} />
                <span>{content.cta_text}</span>
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}

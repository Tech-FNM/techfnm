import { Menu, Phone, X } from 'lucide-react';
import { useState } from 'react';
import { motion } from 'motion/react';

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <header className="fixed w-full bg-black/90 backdrop-blur-md z-50 shadow-sm border-b border-white/10">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-20">
          {/* Logo */}
          <div className="flex-shrink-0 flex items-center">
            <a href="/" className="block">
              <img 
                src="https://rpnaqrmquddupmxvvcjg.supabase.co/storage/v1/object/public/agency-assets/projects/0.569918561129375.png" 
                alt="TechFNM Logo" 
                className="h-10 md:h-12 w-auto object-contain"
                onError={(e) => {
                  const target = e.target as HTMLImageElement;
                  target.style.display = 'none';
                  target.nextElementSibling?.classList.remove('hidden');
                }}
              />
              <div className="hidden text-2xl font-bold text-white">
                Tech<span className="text-red-600 ml-1 font-extrabold">FNM</span>
              </div>
            </a>
          </div>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex space-x-8">
            <a href="#home" className="text-gray-300 hover:text-red-500 font-medium transition-colors">Home</a>
            <a href="#about" className="text-gray-300 hover:text-red-500 font-medium transition-colors">About Us</a>
            <a href="#services" className="text-gray-300 hover:text-red-500 font-medium transition-colors">Services</a>
            <a href="#portfolio" className="text-gray-300 hover:text-red-500 font-medium transition-colors">Portfolio</a>
            <a href="#contact" className="text-gray-300 hover:text-red-500 font-medium transition-colors">Contact Us</a>
          </nav>

          {/* CTA Button */}
          <div className="hidden md:flex items-center">
            <a href="tel:0313-9023118" className="flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-full font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20">
              <Phone size={18} />
              <span>0313-9023118</span>
            </a>
          </div>

          {/* Mobile Menu Button */}
          <div className="md:hidden flex items-center">
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
          className="md:hidden bg-gray-900 border-t border-gray-800 shadow-lg"
        >
          <div className="px-4 pt-2 pb-6 space-y-1">
            <a href="#home" className="block px-3 py-3 text-base font-medium text-gray-300 hover:text-red-500 hover:bg-gray-800 rounded-md" onClick={() => setIsOpen(false)}>Home</a>
            <a href="#about" className="block px-3 py-3 text-base font-medium text-gray-300 hover:text-red-500 hover:bg-gray-800 rounded-md" onClick={() => setIsOpen(false)}>About Us</a>
            <a href="#services" className="block px-3 py-3 text-base font-medium text-gray-300 hover:text-red-500 hover:bg-gray-800 rounded-md" onClick={() => setIsOpen(false)}>Services</a>
            <a href="#portfolio" className="block px-3 py-3 text-base font-medium text-gray-300 hover:text-red-500 hover:bg-gray-800 rounded-md" onClick={() => setIsOpen(false)}>Portfolio</a>
            <a href="#contact" className="block px-3 py-3 text-base font-medium text-gray-300 hover:text-red-500 hover:bg-gray-800 rounded-md" onClick={() => setIsOpen(false)}>Contact Us</a>
            <div className="pt-4">
              <a href="tel:0313-9023118" className="flex items-center justify-center gap-2 w-full bg-red-600 text-white px-5 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors">
                <Phone size={18} />
                <span>Call Us Today</span>
              </a>
            </div>
          </div>
        </motion.div>
      )}
    </header>
  );
}

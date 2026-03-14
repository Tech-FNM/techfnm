import { Mail, MapPin, Phone, Facebook, Youtube, Instagram, MessageCircle, CheckCircle2, Loader2 } from 'lucide-react';
import { useState } from 'react';

export default function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');

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
            _subject: "New Newsletter Subscription!"
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
    <footer className="bg-zinc-950 text-white pt-16 pb-8 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div>
            <div className="mb-6">
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
              <h3 className="hidden text-2xl font-bold">Tech<span className="text-red-600">FNM</span></h3>
            </div>
            <p className="text-gray-400 mb-6 leading-relaxed">
              We specialize in custom web development, mobile apps, and SEO solutions. We develop digital future.
            </p>
            <div className="flex space-x-4">
              <a href="https://www.facebook.com/techfnm" target="_blank" rel="noopener noreferrer" className="bg-zinc-900 p-2 rounded-full hover:bg-blue-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="https://www.youtube.com/@techhfnm" target="_blank" rel="noopener noreferrer" className="bg-zinc-900 p-2 rounded-full hover:bg-red-600 transition-colors">
                <Youtube size={20} />
              </a>
              <a href="https://www.instagram.com/techfnm" target="_blank" rel="noopener noreferrer" className="bg-zinc-900 p-2 rounded-full hover:bg-pink-600 transition-colors">
                <Instagram size={20} />
              </a>
              <a href="https://wa.me/+923139023118" target="_blank" rel="noopener noreferrer" className="bg-zinc-900 p-2 rounded-full hover:bg-green-600 transition-colors">
                <MessageCircle size={20} />
              </a>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-xl font-bold mb-6 border-b-2 border-red-500 inline-block pb-2">Quick Links</h3>
            <ul className="space-y-3">
              <li><a href="#home" className="text-gray-400 hover:text-red-500 transition-colors flex items-center"><span className="mr-2">›</span> Home</a></li>
              <li><a href="#about" className="text-gray-400 hover:text-red-500 transition-colors flex items-center"><span className="mr-2">›</span> About Us</a></li>
              <li><a href="#services" className="text-gray-400 hover:text-red-500 transition-colors flex items-center"><span className="mr-2">›</span> Services</a></li>
              <li><a href="#portfolio" className="text-gray-400 hover:text-red-500 transition-colors flex items-center"><span className="mr-2">›</span> Portfolio</a></li>
              <li><a href="#contact" className="text-gray-400 hover:text-red-500 transition-colors flex items-center"><span className="mr-2">›</span> Contact</a></li>
              <li><a href="#faqs" className="text-gray-400 hover:text-red-500 transition-colors flex items-center"><span className="mr-2">›</span> FAQs</a></li>
            </ul>
          </div>

          {/* Contact Info */}
          <div>
            <h3 className="text-xl font-bold mb-6 border-b-2 border-red-500 inline-block pb-2">Contact Info</h3>
            <ul className="space-y-4">
              <li className="flex items-start">
                <MapPin className="text-red-500 mr-3 mt-1 flex-shrink-0" size={20} />
                <span className="text-gray-400">Korangi Karachi Pakistan</span>
              </li>
              <li className="flex items-center">
                <Phone className="text-red-500 mr-3 flex-shrink-0" size={20} />
                <a href="tel:0313-9023118" className="text-gray-400 hover:text-white transition-colors">0313-9023118</a>
              </li>
              <li className="flex items-center">
                <Mail className="text-red-500 mr-3 flex-shrink-0" size={20} />
                <a href="mailto:techhfnm@gmail.com" className="text-gray-400 hover:text-white transition-colors">techhfnm@gmail.com</a>
              </li>
            </ul>
          </div>

          {/* Subscribe */}
          <div>
            <h3 className="text-xl font-bold mb-6 border-b-2 border-red-500 inline-block pb-2">Subscribe</h3>
            <p className="text-gray-400 mb-4">
              Subscribe to our newsletter. Stay informed about technology news and events with our newsletter.
            </p>
            <form onSubmit={handleSubscribe} className="flex flex-col space-y-3 relative">
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Your Email Address"
                required
                disabled={status === 'submitting' || status === 'success'}
                className="bg-zinc-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 border border-zinc-800 disabled:opacity-50"
              />
              <button
                type="submit"
                disabled={status === 'submitting' || status === 'success'}
                className="bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20 flex items-center justify-center gap-2 disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {status === 'submitting' ? <Loader2 size={18} className="animate-spin" /> : null}
                {status === 'success' ? <><CheckCircle2 size={18} /> Subscribed!</> : 'Subscribe Now'}
              </button>
              {status === 'error' && (
                <p className="text-red-500 text-sm mt-2">Something went wrong. Please try again.</p>
              )}
            </form>
          </div>
        </div>

        <div className="border-t border-zinc-900 pt-8 text-center">
          <p className="text-gray-500">
            &copy; {new Date().getFullYear()} <span className="text-white font-medium">TechFNM</span>. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
}

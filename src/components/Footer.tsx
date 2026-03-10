import { Mail, MapPin, Phone, Facebook, Twitter, Linkedin, Instagram } from 'lucide-react';

export default function Footer() {
  return (
    <footer className="bg-zinc-950 text-white pt-16 pb-8 border-t border-zinc-900">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* About */}
          <div>
            <h3 className="text-2xl font-bold mb-6">Tech<span className="text-red-600">FNM</span></h3>
            <p className="text-gray-400 mb-6 leading-relaxed">
              We specialize in custom web development, mobile apps, and SEO solutions. We develop digital future.
            </p>
            <div className="flex space-x-4">
              <a href="#" className="bg-zinc-900 p-2 rounded-full hover:bg-red-600 transition-colors">
                <Facebook size={20} />
              </a>
              <a href="#" className="bg-zinc-900 p-2 rounded-full hover:bg-red-400 transition-colors">
                <Twitter size={20} />
              </a>
              <a href="#" className="bg-zinc-900 p-2 rounded-full hover:bg-red-700 transition-colors">
                <Linkedin size={20} />
              </a>
              <a href="#" className="bg-zinc-900 p-2 rounded-full hover:bg-pink-600 transition-colors">
                <Instagram size={20} />
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
              <li><a href="/admindash/login" className="text-gray-400 hover:text-red-500 transition-colors flex items-center"><span className="mr-2">›</span> Admin Login</a></li>
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
            <form className="flex flex-col space-y-3">
              <input
                type="email"
                placeholder="Your Email Address"
                className="bg-zinc-900 text-white px-4 py-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-red-500 border border-zinc-800"
              />
              <button
                type="submit"
                className="bg-red-600 text-white px-4 py-3 rounded-lg font-medium hover:bg-red-700 transition-colors shadow-lg shadow-red-600/20"
              >
                Subscribe Now
              </button>
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

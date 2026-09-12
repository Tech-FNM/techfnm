import { useEffect, useState } from 'react';
import { supabase } from '../lib/supabase';
import { usePageContent } from '../lib/cmsContent';

const DEFAULT_LOGOS = [
  { name: 'Google Cloud', logo: 'https://demo.awaikenthemes.com/fexora/wp-content/uploads/2026/05/company-supports-logo-1-prime.svg' },
  { name: 'Shopify Plus', logo: 'https://demo.awaikenthemes.com/fexora/wp-content/uploads/2026/05/company-supports-logo-2-prime.svg' },
  { name: 'Webflow', logo: 'https://demo.awaikenthemes.com/fexora/wp-content/uploads/2026/05/company-supports-logo-3-prime.svg' },
  { name: 'Stripe', logo: 'https://demo.awaikenthemes.com/fexora/wp-content/uploads/2026/05/company-supports-logo-4-prime.svg' },
  { name: 'Amazon AWS', logo: 'https://demo.awaikenthemes.com/fexora/wp-content/uploads/2026/05/company-supports-logo-5-prime.svg' },
  { name: 'Meta Marketing', logo: 'https://demo.awaikenthemes.com/fexora/wp-content/uploads/2026/05/company-supports-logo-6-prime.svg' },
];

export default function Clients() {
  const [clients, setClients] = useState<any[]>(DEFAULT_LOGOS);
  const pageData = usePageContent('page-home', {
    clients_badge: 'Trusted By 200+ Global Brands & Visionary Startups'
  });

  useEffect(() => {
    const fetchClients = async () => {
      try {
        const { data } = await supabase.from('clients').select('*');
        if (data && data.length > 0) {
          const valid = data.filter((c: any) => c.logo || c.name);
          if (valid.length > 0) setClients(valid);
        }
      } catch {}
    };
    fetchClients();
  }, []);

  const badgeText = pageData.clients_badge || 'Trusted By 200+ Global Brands & Visionary Startups';

  // Duplicate list to create a seamless infinite marquee loop
  const marqueeItems = [...clients, ...clients, ...clients, ...clients];

  return (
    <section className="py-12 bg-black border-y border-white/[0.08] overflow-hidden relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 mb-6 text-center">
        <p className="text-xs sm:text-sm font-semibold tracking-widest text-zinc-500 uppercase">
          {badgeText}
        </p>
      </div>

      {/* Marquee Ticker Track with Gradient Fades */}
      <div className="relative w-full overflow-hidden flex items-center">
        <div className="absolute left-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-r from-black to-transparent z-10 pointer-events-none" />
        <div className="absolute right-0 top-0 bottom-0 w-24 sm:w-40 bg-gradient-to-l from-black to-transparent z-10 pointer-events-none" />

        <div className="flex shrink-0 animate-[marquee_25s_linear_infinite] hover:[animation-play-state:paused] items-center gap-12 sm:gap-20">
          {marqueeItems.map((item, index) => (
            <div
              key={index}
              className="flex items-center justify-center opacity-40 hover:opacity-100 transition-opacity duration-300 filter grayscale hover:grayscale-0 flex-shrink-0"
            >
              {item.logo ? (
                <img
                  src={item.logo}
                  alt={item.name || 'Client Logo'}
                  className="h-8 sm:h-10 w-auto max-w-[140px] object-contain"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.style.display = 'none';
                    target.nextElementSibling?.classList.remove('hidden');
                  }}
                />
              ) : null}
              <span className={`${item.logo ? 'hidden' : 'block'} text-lg font-bold tracking-wider text-zinc-400`}>
                {item.name}
              </span>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

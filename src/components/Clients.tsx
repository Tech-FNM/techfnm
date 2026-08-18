import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { supabase } from '../lib/supabase';

export default function Clients() {
  const [clients, setClients] = useState<any[]>([]);

  useEffect(() => {
    const fetchClients = async () => {
      const { data } = await supabase.from('clients').select('*');
      if (data) setClients(data);
    };
    fetchClients();
  }, []);

  if (clients.length === 0) return null;

  return (
    <section id="clients" className="py-16 bg-zinc-950 border-t border-zinc-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-12">
          <span className="text-red-500 font-semibold tracking-wider uppercase text-sm">Partners & Sponsors</span>
          <h2 className="mt-2 text-3xl font-bold text-white">Our Clients</h2>
        </div>

        <div className="flex flex-wrap justify-center items-center gap-8 md:gap-16 lg:gap-20">
          {clients.map((client, index) => (
            <motion.div
              key={client.id}
              initial={{ opacity: 0, y: 10 }}
              whileInView={{ opacity: 0.5, y: 0 }}
              whileHover={{ opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="flex items-center justify-center w-24 md:w-32 lg:w-40"
            >
            {(() => {
                const content = client.logo ? (
                  <img
                    src={client.logo}
                    alt={client.name}
                    className="h-12 md:h-16 w-full object-contain hover:scale-105 transition-transform duration-300"
                    referrerPolicy="no-referrer"
                  />
                ) : (
                  <div className="text-center w-full">
                    <span className="text-zinc-500 font-bold text-sm md:text-base opacity-50 block truncate w-full">{client.name}</span>
                  </div>
                );

                const websiteUrl = client.website && !client.website.startsWith('http') 
                  ? `https://${client.website}` 
                  : client.website;

                return websiteUrl ? (
                  <a href={websiteUrl} target="_blank" rel="noopener noreferrer" className="block w-full">
                    {content}
                  </a>
                ) : content;
              })()}
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Linkedin, Twitter, Facebook } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Team() {
  const [team, setTeam] = useState<any[]>([]);

  useEffect(() => {
    supabase.from('team').select('*').order('id').then(({ data }) => {
      if (data) setTeam(data);
    });
  }, []);

  return (
    <section id="team" className="py-24 bg-zinc-950">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <span className="text-red-500 font-semibold tracking-wider uppercase text-sm">Creative Staff</span>
          <h2 className="mt-2 text-4xl font-bold text-white sm:text-5xl">Meet Team</h2>
          <p className="mt-4 max-w-2xl text-xl text-gray-400 mx-auto">
            Our talented team of experts is dedicated to delivering exceptional results for your business.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {team.map((member, index) => (
            <motion.div
              key={member.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="bg-zinc-900 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl transition-all duration-300 group border border-zinc-800"
            >
              <div className="relative overflow-hidden">
                <img
                  src={member.image}
                  alt={member.name}
                  className="w-full h-80 object-cover object-top transform group-hover:scale-105 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-red-600/80 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center space-x-4">
                  <a href="#" className="text-white hover:text-red-100 transition-colors bg-white/20 p-2 rounded-full backdrop-blur-sm">
                    <Linkedin size={20} />
                  </a>
                  <a href="#" className="text-white hover:text-red-100 transition-colors bg-white/20 p-2 rounded-full backdrop-blur-sm">
                    <Twitter size={20} />
                  </a>
                  <a href="#" className="text-white hover:text-red-100 transition-colors bg-white/20 p-2 rounded-full backdrop-blur-sm">
                    <Facebook size={20} />
                  </a>
                </div>
              </div>
              <div className="p-6 text-center">
                <h3 className="text-xl font-bold text-white">{member.name}</h3>
                <p className="text-red-500 font-medium mt-1">{member.role}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}

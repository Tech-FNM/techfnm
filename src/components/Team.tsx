import { useEffect, useState } from 'react';
import { motion } from 'motion/react';
import { Linkedin, Twitter, Facebook, Quote } from 'lucide-react';
import { supabase } from '../lib/supabase';

export default function Team() {
  const [team, setTeam] = useState<any[]>([]);
  const [leader, setLeader] = useState<any>(null);
  const [headers, setHeaders] = useState({
    subtitle: 'Our Leadership',
    title: 'Veteran-Owned & Mission-Driven',
    description: 'Battlefield discipline meets boardroom precision. Eagle Revolution brings honor, integrity, and craftsmanship back to the remodeling industry.'
  });

  useEffect(() => {
    const fetchTeam = async () => {
      try {
        // Fetch Section Headers
        const { data: settingsData } = await supabase
          .from('site_settings')
          .select('content')
          .eq('id', 'team_section')
          .single();
        
        if (settingsData) {
          setHeaders(settingsData.content);
        }

        const { data, error } = await supabase.from('team').select('*').order('created_at', { ascending: true });
        
        if (error) {
          console.error('Supabase error fetching team:', error);
        }

        // Fetch headers from locally saved data if available
        const savedHeaders = localStorage.getItem('team_section_headers');
        if (savedHeaders) {
          setHeaders(JSON.parse(savedHeaders));
        }

        if (data && data.length > 0) {
          // Find the first member or one marked as is_leader
          const mainLeader = data.find((m: any) => m.is_leader) || data[0];
          setLeader(mainLeader);
          setTeam(data.filter((m: any) => m.id !== mainLeader.id));
        } else {
          const fallbackLeader = {
            id: 1,
            name: 'Brandon Anderson',
            role: 'Founder',
            sub_titles: 'U.S. ARMY VETERAN | GLOBALLY LICENSED COMBAT SPORTS OFFICIAL',
            quote: 'Eagle Revolution was built to be more than just a remodeling company. It was built to lead a movement.',
            bio: 'Based in O\'Fallon, Missouri, Eagle Revolution was founded by Brandon Anderson, an Army veteran and globally licensed combat sports official who brings discipline, precision, and accountability to every project. With years of leadership experience at some of the largest home improvement companies in North North America, Brandon saw firsthand how the industry had shifted away from homeowners and toward profits, leaving people with high prices, poor communication, and broken trust.',
            badge_text: 'ProVia | IKO | CertainTeed',
            image: 'https://images.unsplash.com/photo-1560250097-0b93528c311a?auto=format&fit=crop&q=80&w=800',
            is_leader: true
          };
          setLeader(fallbackLeader);
          setTeam([]);
        }
      } catch (err) {
        console.error('Error in fetchTeam:', err);
      }
    };
    fetchTeam();
  }, []);

  return (
    <section id="team" className="py-24 bg-zinc-950 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Header */}
        <div className="text-center mb-20">
          <div className="flex items-center justify-center gap-4 mb-4">
            <div className="h-[1px] w-12 bg-red-500"></div>
            <span className="text-red-500 font-bold tracking-[0.2em] uppercase text-xs">{headers.subtitle}</span>
            <div className="h-[1px] w-12 bg-red-500"></div>
          </div>
          <h2 className="text-5xl md:text-6xl font-bold text-white leading-tight">
            {headers.title}
          </h2>
          <p className="mt-8 max-w-3xl text-lg text-gray-400 mx-auto leading-relaxed font-light">
            {headers.description}
          </p>
        </div>

        {/* Leader Profile */}
        {leader && (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20 items-center mb-24">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="relative"
            >
              <div className="aspect-[4/5] rounded-[2rem] overflow-hidden shadow-2xl relative border border-zinc-800">
                <img
                  src={leader.image}
                  alt={leader.name}
                  className="w-full h-full object-cover object-top"
                  referrerPolicy="no-referrer"
                />
                
                {/* Badge */}
                <div className="absolute bottom-8 left-1/2 -translate-x-1/2 bg-zinc-900/90 backdrop-blur-md px-6 py-3 rounded-full shadow-lg border border-red-500/30 flex items-center gap-3 whitespace-nowrap">
                  <div className="w-2 h-2 rounded-full bg-red-500 animate-pulse"></div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider">
                    {leader.badge_text || 'Premium Partner'}
                  </span>
                </div>
              </div>
              
              {/* Decorative background elements */}
              <div className="absolute -z-10 top-12 -left-12 w-full h-full bg-red-500/5 rounded-[2rem]"></div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              className="space-y-8"
            >
              <div>
                <h3 className="text-5xl font-bold text-white mb-2">{leader.name}</h3>
                <p className="text-red-500 font-mono text-xs uppercase tracking-[0.2em] font-bold">
                  {leader.role} {leader.sub_titles ? `| ${leader.sub_titles}` : ''}
                </p>
              </div>

              {leader.quote && (
                <div className="flex gap-4 items-start bg-zinc-900/50 p-6 rounded-2xl border border-zinc-800">
                  <Quote className="text-red-500/30 flex-shrink-0" size={48} strokeWidth={1} />
                  <p className="text-xl font-medium text-gray-200 leading-snug italic">
                    "{leader.quote}"
                  </p>
                </div>
              )}

              <div className="space-y-6 text-gray-400 leading-relaxed font-light">
                {leader.bio ? (
                  leader.bio.split('\n').filter((p: string) => p.trim() !== '').map((para: string, i: number) => (
                    <p key={i}>{para}</p>
                  ))
                ) : (
                  <p>Our leadership is committed to delivering exceptional results through years of professional expertise.</p>
                )}
              </div>

              <div className="flex space-x-4 pt-4">
                <a href="#" className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center hover:bg-red-600 hover:border-red-600 hover:text-white transition-all text-gray-500">
                  <Linkedin size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center hover:bg-red-600 hover:border-red-600 hover:text-white transition-all text-gray-500">
                  <Twitter size={18} />
                </a>
                <a href="#" className="w-10 h-10 rounded-full border border-zinc-800 flex items-center justify-center hover:bg-red-600 hover:border-red-600 hover:text-white transition-all text-gray-500">
                  <Facebook size={18} />
                </a>
              </div>
            </motion.div>
          </div>
        )}

        {/* Other Team Members */}
        {team.length > 0 && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-12 border-t border-zinc-900 pt-20">
            {team.map((member, index) => (
              <motion.div
                key={member.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                className="group relative"
              >
                <div className="aspect-square rounded-3xl overflow-hidden mb-6 border border-zinc-800">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-700"
                    referrerPolicy="no-referrer"
                  />
                </div>
                <h4 className="text-xl font-bold text-white group-hover:text-red-500 transition-colors">{member.name}</h4>
                <p className="text-red-500 text-sm font-medium uppercase tracking-wider">{member.role}</p>
              </motion.div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
}

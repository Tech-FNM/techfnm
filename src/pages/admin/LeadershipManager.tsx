import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Edit, Check, Image as ImageIcon, Briefcase, Award, MessageSquare, User } from 'lucide-react';

export default function LeadershipManager() {
  const [loading, setLoading] = useState(false);
  const [leader, setLeader] = useState({
    id: '',
    name: '',
    role: '',
    image: '',
    sub_titles: '',
    quote: '',
    bio: '',
    badge_text: '',
  });

  const [sectionHeaders, setSectionHeaders] = useState({
    subtitle: 'Our Leadership',
    title: 'Veteran-Owned & Mission-Driven',
    description: 'Battlefield discipline meets boardroom precision.'
  });

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      // 1. Fetch section headers
      const { data: settingsData } = await supabase
        .from('site_settings')
        .select('content')
        .eq('id', 'leadership_section')
        .maybeSingle();
      
      if (settingsData) {
        setSectionHeaders(settingsData.content);
      }

      // 2. Fetch Leader Data
      const { data: leaderData } = await supabase
        .from('leadership')
        .select('*')
        .limit(1)
        .maybeSingle();

      if (leaderData) {
        setLeader({
          id: leaderData.id,
          name: leaderData.name || '',
          role: leaderData.role || '',
          image: leaderData.image || '',
          sub_titles: leaderData.sub_titles || '',
          quote: leaderData.quote || '',
          bio: leaderData.bio || '',
          badge_text: leaderData.badge_text || '',
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const saveSectionHeaders = async () => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ id: 'leadership_section', content: sectionHeaders });

      if (error) throw error;
      alert('Section headers saved successfully!');
    } catch (error: any) {
      alert('Error saving headers: ' + error.message);
    }
  };

  const saveLeaderDetail = async () => {
    setLoading(true);
    try {
      const payload = {
        name: leader.name,
        role: leader.role,
        image: leader.image,
        sub_titles: leader.sub_titles,
        quote: leader.quote,
        bio: leader.bio,
        badge_text: leader.badge_text,
      };

      let error;
      if (leader.id) {
        const { error: updateError } = await supabase
          .from('leadership')
          .update(payload)
          .eq('id', leader.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase
          .from('leadership')
          .insert([payload]);
        error = insertError;
      }

      if (error) throw error;
      alert('Owner info updated successfully!');
      fetchData();
    } catch (error: any) {
      alert('Error saving info: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Owner Info / Leadership</h1>

      {/* Section Text Settings */}
      <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 mb-12 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-white mb-6">Main Headers</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Small Subtitle (Red Link)</label>
              <input
                type="text"
                value={sectionHeaders.subtitle}
                onChange={(e) => setSectionHeaders({ ...sectionHeaders, subtitle: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Headline</label>
              <input
                type="text"
                value={sectionHeaders.title}
                onChange={(e) => setSectionHeaders({ ...sectionHeaders, title: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Section Paragraph</label>
            <textarea
              rows={4}
              value={sectionHeaders.description}
              onChange={(e) => setSectionHeaders({ ...sectionHeaders, description: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
            />
          </div>
        </div>
        <button 
          onClick={saveSectionHeaders}
          className="mt-6 text-white bg-orange-600 hover:bg-orange-700 font-bold px-8 py-3 rounded-xl transition-all shadow-lg"
        >
          Save Headers
        </button>
      </div>

      {/* Owner Detail Form */}
      <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 mb-12 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          <Edit size={20} className="text-blue-500" />
          Edit Detail
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1 text-xs uppercase tracking-wider font-bold">Owner Name</label>
              <div className="relative">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder="e.g. Brandon Anderson"
                  value={leader.name}
                  onChange={(e) => setLeader({ ...leader, name: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1 text-xs uppercase tracking-wider font-bold">Main Role</label>
              <div className="relative">
                <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder="e.g. Founder"
                  value={leader.role}
                  onChange={(e) => setLeader({ ...leader, role: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1 text-xs uppercase tracking-wider font-bold">Sub-Titles</label>
              <input
                type="text"
                placeholder="e.g. U.S. ARMY VETERAN | GLOBALLY LICENSED"
                value={leader.sub_titles}
                onChange={(e) => setLeader({ ...leader, sub_titles: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1 text-xs uppercase tracking-wider font-bold">Profile Picture URL</label>
              <div className="relative">
                <ImageIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder="Paste Unsplash or direct image link"
                  value={leader.image}
                  onChange={(e) => setLeader({ ...leader, image: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1 text-xs uppercase tracking-wider font-bold">Badge Text (Logo labels)</label>
              <div className="relative">
                <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder="e.g. IKO | CertainTeed | Pella"
                  value={leader.badge_text}
                  onChange={(e) => setLeader({ ...leader, badge_text: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
                />
              </div>
            </div>
            {leader.image && (
              <div className="pt-2">
                 <img src={leader.image} alt="Preview" className="w-16 h-16 rounded-xl object-cover border border-zinc-700" />
              </div>
            )}
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1 text-xs uppercase tracking-wider font-bold">Inspiring Quote</label>
            <div className="relative">
              <MessageSquare className="absolute left-4 top-4 text-gray-500" size={18} />
              <textarea
                rows={2}
                placeholder="A strong sentence that appears next to the quote icon"
                value={leader.quote}
                onChange={(e) => setLeader({ ...leader, quote: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-12 pr-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1 text-xs uppercase tracking-wider font-bold">Full Biography</label>
            <textarea
              rows={6}
              placeholder="Full story for the leadership section..."
              value={leader.bio}
              onChange={(e) => setLeader({ ...leader, bio: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50"
            />
          </div>
        </div>

        <div className="mt-10">
          <button 
            onClick={saveLeaderDetail} 
            disabled={loading}
            className="bg-red-600 text-white px-10 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            <Check size={20} /> {loading ? 'Saving...' : 'Save Info'}
          </button>
        </div>
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { supabase } from '../../lib/supabase';
import { Save, Edit, Check, Image as ImageIcon, Briefcase, Award, MessageSquare, User, Upload, Linkedin, Twitter, Facebook } from 'lucide-react';

export default function LeadershipManager() {
  const [loading, setLoading] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [leader, setLeader] = useState({
    id: '',
    name: '',
    role: '',
    image: '',
    sub_titles: '',
    quote: '',
    bio: '',
    badge_text: '',
    linkedin_url: '',
    twitter_url: '',
    facebook_url: '',
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
          linkedin_url: leaderData.linkedin_url || '',
          twitter_url: leaderData.twitter_url || '',
          facebook_url: leaderData.facebook_url || '',
        });
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  const compressAndGetBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event) => {
        const img = new Image();
        img.src = event.target?.result as string;
        img.onload = () => {
          const canvas = document.createElement('canvas');
          const MAX_WIDTH = 800;
          const MAX_HEIGHT = 800;
          let width = img.width;
          let height = img.height;

          if (width > height) {
            if (width > MAX_WIDTH) {
              height *= MAX_WIDTH / width;
              width = MAX_WIDTH;
            }
          } else {
            if (height > MAX_HEIGHT) {
              width *= MAX_HEIGHT / height;
              height = MAX_HEIGHT;
            }
          }

          canvas.width = width;
          canvas.height = height;
          const ctx = canvas.getContext('2d');
          if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            const compressedBase64 = canvas.toDataURL('image/jpeg', 0.7); // 70% quality JPEG
            resolve(compressedBase64);
          } else {
            resolve(event.target?.result as string);
          }
        };
        img.onerror = (err) => {
          reject(err);
        };
      };
      reader.onerror = (err) => {
        reject(err);
      };
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      const file = e.target.files?.[0];
      if (!file) return;

      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `leadership/${fileName}`;

      let uploadSuccess = false;
      let finalUrl = '';

      // Try 1: Try uploading to 'agency-assets' bucket (the primary bucket used in other managers)
      try {
        const { data: uploadData, error: uploadError } = await supabase.storage
          .from('agency-assets')
          .upload(filePath, file, { upsert: true });

        if (!uploadError) {
          const { data } = supabase.storage
            .from('agency-assets')
            .getPublicUrl(filePath);
          
          finalUrl = data.publicUrl;
          uploadSuccess = true;
        }
      } catch (err) {
        console.warn('Attempt to upload to agency-assets failed, trying leadership_images...', err);
      }

      // Try 2: If 'agency-assets' failed, try 'leadership_images' bucket
      if (!uploadSuccess) {
        try {
          const { data: uploadData, error: uploadError } = await supabase.storage
            .from('leadership_images')
            .upload(filePath, file, { upsert: true });

          if (!uploadError) {
            const { data } = supabase.storage
              .from('leadership_images')
              .getPublicUrl(filePath);

            finalUrl = data.publicUrl;
            uploadSuccess = true;
          }
        } catch (err) {
          console.warn('Attempt to upload to leadership_images failed...', err);
        }
      }

      // Try 3 (Bulletproof Fallback): Compress image & store as Base64 in DB直接!
      if (!uploadSuccess) {
        try {
          const compressedBase64 = await compressAndGetBase64(file);
          setLeader({ ...leader, image: compressedBase64 });
          alert('Image uploaded successfully! (Stored as compressed direct data due to Supabase Storage RLS restrictions)');
          return;
        } catch (base64Err: any) {
          throw new Error('All upload mechanisms failed: ' + base64Err.message);
        }
      }

      setLeader({ ...leader, image: finalUrl });
      alert('Image uploaded successfully to storage!');
    } catch (error: any) {
      alert('Error uploading image: ' + error.message);
    } finally {
      setUploading(false);
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
        linkedin_url: leader.linkedin_url,
        twitter_url: leader.twitter_url,
        facebook_url: leader.facebook_url,
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 text-xs uppercase tracking-wider font-bold">Owner Name</label>
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
              <label className="block text-sm font-medium text-gray-400 mb-2 text-xs uppercase tracking-wider font-bold">Main Role</label>
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
              <label className="block text-sm font-medium text-gray-400 mb-2 text-xs uppercase tracking-wider font-bold">Social Media Links</label>
              <div className="space-y-3">
                <div className="relative">
                  <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 text-[#0077B5]" size={18} />
                  <input
                    type="text"
                    placeholder="LinkedIn Profile URL"
                    value={leader.linkedin_url}
                    onChange={(e) => setLeader({ ...leader, linkedin_url: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-12 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 text-sm"
                  />
                </div>
                <div className="relative">
                  <Twitter className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1DA1F2]" size={18} />
                  <input
                    type="text"
                    placeholder="Twitter Profile URL"
                    value={leader.twitter_url}
                    onChange={(e) => setLeader({ ...leader, twitter_url: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-12 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 text-sm"
                  />
                </div>
                <div className="relative">
                  <Facebook className="absolute left-4 top-1/2 -translate-y-1/2 text-[#1877F2]" size={18} />
                  <input
                    type="text"
                    placeholder="Facebook Profile URL"
                    value={leader.facebook_url}
                    onChange={(e) => setLeader({ ...leader, facebook_url: e.target.value })}
                    className="w-full bg-zinc-800 border border-zinc-700 rounded-xl pl-12 pr-4 py-2 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 text-sm"
                  />
                </div>
              </div>
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 text-xs uppercase tracking-wider font-bold">Profile Picture</label>
              <div className="flex items-start gap-4">
                <div className="w-24 h-24 rounded-2xl bg-zinc-800 border-2 border-dashed border-zinc-700 flex items-center justify-center overflow-hidden">
                  {leader.image ? (
                    <img src={leader.image} alt="Preview" className="w-full h-full object-cover" />
                  ) : (
                    <ImageIcon className="text-zinc-600" size={32} />
                  )}
                </div>
                <div className="flex-1">
                  <label className="flex items-center justify-center gap-2 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white font-bold py-3 px-4 rounded-xl cursor-pointer transition-all">
                    <Upload size={18} />
                    {uploading ? 'Uploading...' : 'Upload Photo'}
                    <input type="file" className="hidden" accept="image/*" onChange={handleFileUpload} disabled={uploading} />
                  </label>
                  <p className="text-[10px] text-gray-500 mt-2">Recommended: 800x1000px portrait</p>
                </div>
              </div>
              <div className="mt-3">
                <label className="block text-xs text-zinc-500 mb-1">Or paste Unsplash URL:</label>
                <input
                  type="text"
                  placeholder="https://..."
                  value={leader.image}
                  onChange={(e) => setLeader({ ...leader, image: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white text-xs focus:outline-none focus:ring-1 focus:ring-zinc-600"
                />
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-2 text-xs uppercase tracking-wider font-bold">Badge Text (Logo labels)</label>
              <div className="relative">
                <Award className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500" size={18} />
                <input
                  type="text"
                  placeholder="e.g. ProVia | IKO | CertainTeed"
                  value={leader.badge_text}
                  onChange={(e) => setLeader({ ...leader, badge_text: e.target.value })}
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
        </div>

        <div className="mt-8 space-y-6">
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

        <div className="mt-10 pt-6 border-t border-zinc-800">
          <button 
            onClick={saveLeaderDetail} 
            disabled={loading}
            className="bg-red-600 text-white px-10 py-4 rounded-xl font-bold flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg active:scale-95 disabled:opacity-50"
          >
            <Check size={20} /> {loading ? 'Saving...' : 'Save All Changes'}
          </button>
        </div>
      </div>
    </div>
  );
}

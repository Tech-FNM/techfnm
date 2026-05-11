import { useEffect, useState } from 'react';
import { Plus, Trash, Edit, Check, X, Upload, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function TeamManager() {
  const [team, setTeam] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentMember, setCurrentMember] = useState<any>({
    name: '',
    role: '',
    image: '',
    sub_titles: '',
    quote: '',
    bio: '',
    badge_text: '',
    is_leader: false,
  });

  const [sectionHeaders, setSectionHeaders] = useState({
    subtitle: 'Our Leadership',
    title: 'Veteran-Owned & Mission-Driven',
    description: 'Battlefield discipline meets boardroom precision. Eagle Revolution brings honor, integrity, and craftsmanship back to the remodeling industry.'
  });

  useEffect(() => {
    fetchTeam();
  }, []);

  const saveSectionHeaders = async () => {
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({ id: 'team_section', content: sectionHeaders });

      if (error) throw error;
      alert('Section headers saved to database!');
    } catch (error: any) {
      alert('Error saving headers: ' + error.message);
    }
  };

  const fetchTeam = async () => {
    try {
      // Fetch section headers from Supabase
      const { data: settingsData } = await supabase
        .from('site_settings')
        .select('content')
        .eq('id', 'team_section')
        .single();
      
      if (settingsData) {
        setSectionHeaders(settingsData.content);
      }

      const { data, error } = await supabase.from('team').select('*').order('created_at', { ascending: true });
      if (data && data.length > 0) {
        setTeam(data);
        // Automatically load the first member (owner) for editing
        const m = data.find((member: any) => member.is_leader) || data[0];
        
        // Ensure null values from DB are converted to empty strings for form inputs
        setCurrentMember({
          id: m.id,
          name: m.name || '',
          role: m.role || '',
          image: m.image || '',
          sub_titles: m.sub_titles || '',
          quote: m.quote || '',
          bio: m.bio || '',
          badge_text: m.badge_text || '',
          is_leader: !!m.is_leader,
        });
        setIsEditing(true);
      }
    } catch (error) {
      console.error('Error fetching team:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;
      
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `team/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('agency-assets')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('agency-assets')
        .getPublicUrl(filePath);

      setCurrentMember({ ...currentMember, image: publicUrl });
      alert('Image uploaded successfully!');
    } catch (error: any) {
      console.error('Upload error details:', error);
      alert('Upload failed: ' + (error.message || 'Unknown error') + '\n\nIf the bucket exists, please check your Storage Policies (RLS) in Supabase.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!currentMember.name || !currentMember.role) {
      alert('Please fill in Name and Role');
      return;
    }

    try {
      let error;
      const payload = {
        name: currentMember.name,
        role: currentMember.role,
        image: currentMember.image,
        sub_titles: currentMember.sub_titles,
        quote: currentMember.quote,
        bio: currentMember.bio,
        badge_text: currentMember.badge_text,
        is_leader: currentMember.is_leader,
      };

      if (isEditing) {
        const { error: updateError } = await supabase.from('team').update(payload).eq('id', currentMember.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from('team').insert([payload]);
        error = insertError;
      }
      
      if (error) {
        console.error('Supabase error:', error);
        alert(`Error saving team member: ${error.message}\n\nNote: You may need to add columns (sub_titles, quote, bio, badge_text, is_leader) to your 'team' table in Supabase.`);
      } else {
        alert(isEditing ? 'Team member updated successfully!' : 'Team member added successfully!');
        setIsEditing(false);
        setCurrentMember({ name: '', role: '', image: '', sub_titles: '', quote: '', bio: '', badge_text: '', is_leader: false });
        fetchTeam();
      }
    } catch (error: any) {
      console.error('Error saving team member:', error);
      alert('An unexpected error occurred. Check the console for details.');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      try {
        const { error } = await supabase.from('team').delete().eq('id', id);
        if (!error) {
          fetchTeam();
        }
      } catch (error) {
        console.error('Error deleting team member:', error);
      }
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Owner Info / Leadership</h1>

      {/* Section Headers Settings */}
      <div className="bg-zinc-900/50 p-8 rounded-2xl border border-zinc-800 mb-12 backdrop-blur-sm">
        <h2 className="text-xl font-bold text-white mb-6">Section Text Content</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Small Subtitle</label>
              <input
                type="text"
                value={sectionHeaders.subtitle}
                onChange={(e) => setSectionHeaders({ ...sectionHeaders, subtitle: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Main Section Title</label>
              <input
                type="text"
                value={sectionHeaders.title}
                onChange={(e) => setSectionHeaders({ ...sectionHeaders, title: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
              />
            </div>
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Section Paragraph</label>
            <textarea
              rows={4}
              value={sectionHeaders.description}
              onChange={(e) => setSectionHeaders({ ...sectionHeaders, description: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
            />
          </div>
        </div>
        <div className="mt-6">
          <button 
            onClick={saveSectionHeaders}
            className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
          >
            Save Section Text
          </button>
        </div>
      </div>

      {/* Form Section */}
      <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 mb-12 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          {isEditing ? <Edit size={20} className="text-blue-500" /> : <Plus size={20} className="text-red-500" />}
          {isEditing ? 'Update Detail' : 'Edit Detail'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="e.g. Brandon Anderson"
                value={currentMember.name}
                onChange={(e) => setCurrentMember({ ...currentMember, name: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Main Role / Position</label>
              <input
                type="text"
                placeholder="e.g. Founder"
                value={currentMember.role}
                onChange={(e) => setCurrentMember({ ...currentMember, role: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Sub-Titles (Optional)</label>
              <input
                type="text"
                placeholder="e.g. U.S. ARMY VETERAN | GLOBALLY LICENSED"
                value={currentMember.sub_titles}
                onChange={(e) => setCurrentMember({ ...currentMember, sub_titles: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Profile Picture</label>
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="team-image-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="team-image-upload"
                    className={`flex items-center justify-center gap-2 w-full bg-zinc-800 border-2 border-dashed border-zinc-700 rounded-xl px-4 py-3 text-gray-400 cursor-pointer hover:border-red-500/50 hover:text-white transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {uploading ? 'Uploading...' : <><Upload size={18} /> Attach Photo</>}
                  </label>
                </div>
                {currentMember.image && (
                  <div className="w-16 h-16 rounded-3xl overflow-hidden border border-zinc-700 bg-zinc-800 flex items-center justify-center">
                    <img src={currentMember.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Badge Text (e.g. ProVia | CertainTeed)</label>
              <input
                type="text"
                placeholder="Displayed on the image"
                value={currentMember.badge_text}
                onChange={(e) => setCurrentMember({ ...currentMember, badge_text: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
              />
            </div>
            <div className="flex items-center gap-2 pt-2">
              <input
                type="checkbox"
                id="is-leader"
                checked={currentMember.is_leader}
                onChange={(e) => setCurrentMember({ ...currentMember, is_leader: e.target.checked })}
                className="w-5 h-5 rounded bg-zinc-800 border-zinc-700 text-red-600 focus:ring-red-500/50"
              />
              <label htmlFor="is-leader" className="text-white font-medium cursor-pointer">Show as Spotlight Leader</label>
            </div>
          </div>
        </div>

        <div className="mt-6 space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Inspiring Quote (Optional)</label>
            <input
              type="text"
              placeholder="e.g. Eagle Revolution was built to be more than just a remodeling company..."
              value={currentMember.quote}
              onChange={(e) => setCurrentMember({ ...currentMember, quote: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Full Biography / Long Description</label>
            <textarea
              rows={5}
              placeholder="Tell the founder's story..."
              value={currentMember.bio}
              onChange={(e) => setCurrentMember({ ...currentMember, bio: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
            />
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button 
            onClick={handleSave} 
            className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
          >
            <Check size={20} /> {isEditing ? 'Save Detail' : 'Save Info'}
          </button>
          {isEditing && (
            <button 
              onClick={() => { setIsEditing(false); setCurrentMember({ name: '', role: '', image: '', sub_titles: '', quote: '', bio: '', badge_text: '', is_leader: false }); }} 
              className="bg-zinc-800 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-700 transition-all"
            >
              <X size={20} /> Cancel
            </button>
          )}
        </div>
      </div>

      {/* List Section Removed */}
    </div>
  );
}

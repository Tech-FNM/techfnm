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
  });

  useEffect(() => {
    fetchTeam();
  }, []);

  const fetchTeam = async () => {
    try {
      const { data, error } = await supabase.from('team').select('*');
      if (data) {
        setTeam(data);
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
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('agency-assets')
        .getPublicUrl(filePath);

      setCurrentMember({ ...currentMember, image: publicUrl });
      alert('Image uploaded successfully!');
    } catch (error: any) {
      alert('Error uploading image: ' + error.message + '\nMake sure you have created a public bucket named "agency-assets" in Supabase Storage.');
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
        image: currentMember.image
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
        alert(`Error saving team member: ${error.message}`);
      } else {
        alert(isEditing ? 'Team member updated successfully!' : 'Team member added successfully!');
        setIsEditing(false);
        setCurrentMember({ name: '', role: '', image: '' });
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
      <h1 className="text-3xl font-bold text-white mb-8">Manage Team</h1>

      {/* Form Section */}
      <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 mb-12 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          {isEditing ? <Edit size={20} className="text-blue-500" /> : <Plus size={20} className="text-red-500" />}
          {isEditing ? 'Edit Team Member' : 'Add New Member'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Full Name</label>
              <input
                type="text"
                placeholder="e.g. John Doe"
                value={currentMember.name}
                onChange={(e) => setCurrentMember({ ...currentMember, name: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Role / Position</label>
              <input
                type="text"
                placeholder="e.g. Senior Developer"
                value={currentMember.role}
                onChange={(e) => setCurrentMember({ ...currentMember, role: e.target.value })}
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
                  <div className="w-16 h-16 rounded-full overflow-hidden border border-zinc-700 bg-zinc-800 flex items-center justify-center">
                    <img src={currentMember.image} alt="Preview" className="w-full h-full object-cover" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button 
            onClick={handleSave} 
            className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
          >
            <Check size={20} /> {isEditing ? 'Update Member' : 'Add Member'}
          </button>
          {isEditing && (
            <button 
              onClick={() => { setIsEditing(false); setCurrentMember({ name: '', role: '', image: '' }); }} 
              className="bg-zinc-800 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-700 transition-all"
            >
              <X size={20} /> Cancel
            </button>
          )}
        </div>
      </div>

      {/* List Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white mb-4">Current Team</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {team.length === 0 ? (
            <div className="col-span-2 text-center py-12 bg-zinc-900 rounded-2xl border border-zinc-800 text-gray-500">
              No team members found. Add your first member above.
            </div>
          ) : (
            team.map((member) => (
              <div key={member.id} className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 flex items-center justify-between group hover:border-zinc-700 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-700">
                    {member.image ? (
                      <img src={member.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="text-zinc-600" size={20} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{member.name}</h3>
                    <p className="text-red-500 text-xs font-semibold uppercase">{member.role}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setIsEditing(true); setCurrentMember(member); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(member.id)} 
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Delete"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

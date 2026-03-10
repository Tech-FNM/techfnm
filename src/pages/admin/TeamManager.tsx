import { useEffect, useState } from 'react';
import { Plus, Trash, Edit, Check, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function TeamManager() {
  const [team, setTeam] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
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
      const response = await fetch('/api/team');
      if (response.ok) {
        const data = await response.json();
        setTeam(data);
      }
    } catch (error) {
      console.error('Error fetching team:', error);
    }
  };

  const handleSave = async () => {
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `/api/team/${currentMember.id}` : '/api/team';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentMember),
      });

      if (response.ok) {
        setIsEditing(false);
        setCurrentMember({ name: '', role: '', image: '' });
        fetchTeam();
      }
    } catch (error) {
      console.error('Error saving team member:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      try {
        const response = await fetch(`/api/team/${id}`, { method: 'DELETE' });
        if (response.ok) {
          fetchTeam();
        }
      } catch (error) {
        console.error('Error deleting team member:', error);
      }
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Manage Team</h1>

      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 mb-8">
        <h2 className="text-xl font-bold text-white mb-4">{isEditing ? 'Edit Member' : 'Add New Member'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={currentMember.name}
            onChange={(e) => setCurrentMember({ ...currentMember, name: e.target.value })}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
          />
          <input
            type="text"
            placeholder="Role"
            value={currentMember.role}
            onChange={(e) => setCurrentMember({ ...currentMember, role: e.target.value })}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={currentMember.image}
            onChange={(e) => setCurrentMember({ ...currentMember, image: e.target.value })}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white col-span-2"
          />
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={handleSave} className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700">
            <Check size={18} /> Save
          </button>
          {isEditing && (
            <button onClick={() => { setIsEditing(false); setCurrentMember({ name: '', role: '', image: '' }); }} className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-700">
              <X size={18} /> Cancel
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {team.map((member) => (
          <div key={member.id} className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 relative group">
            <img src={member.image} alt={member.name} className="w-full h-48 object-cover rounded-lg mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{member.name}</h3>
            <p className="text-gray-400 text-sm mb-4">{member.role}</p>
            <div className="flex gap-2 absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setIsEditing(true); setCurrentMember(member); }} className="bg-blue-600 p-2 rounded-lg text-white hover:bg-blue-700">
                <Edit size={16} />
              </button>
              <button onClick={() => handleDelete(member.id)} className="bg-red-600 p-2 rounded-lg text-white hover:bg-red-700">
                <Trash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

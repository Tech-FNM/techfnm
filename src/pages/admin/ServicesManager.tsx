import { useEffect, useState } from 'react';
import { Plus, Trash, Edit, Check, X } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function ServicesManager() {
  const [services, setServices] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentService, setCurrentService] = useState<any>({
    title: '',
    description: '',
    icon: 'Code',
    color: 'bg-red-900/20 text-red-400',
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase.from('services').select('*').order('created_at', { ascending: true });
      if (data) {
        setServices(data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleSave = async () => {
    if (!currentService.title || !currentService.description) {
      alert('Please fill in all required fields');
      return;
    }

    try {
      let error;
      if (isEditing) {
        const { error: updateError } = await supabase.from('services').update({
          title: currentService.title,
          description: currentService.description,
          icon: currentService.icon,
          color: currentService.color
        }).eq('id', currentService.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from('services').insert([{
          title: currentService.title,
          description: currentService.description,
          icon: currentService.icon,
          color: currentService.color
        }]);
        error = insertError;
      }
      
      if (error) {
        console.error('Supabase error:', error);
        alert(`Error saving service: ${error.message}. Make sure the 'services' table exists in Supabase.`);
      } else {
        alert(isEditing ? 'Service updated successfully!' : 'Service added successfully!');
        setIsEditing(false);
        setCurrentService({ title: '', description: '', icon: 'Code', color: 'bg-red-900/20 text-red-400' });
        fetchServices();
      }
    } catch (error: any) {
      console.error('Error saving service:', error);
      alert('An unexpected error occurred. Check the console for details.');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      try {
        const { error } = await supabase.from('services').delete().eq('id', id);
        if (!error) {
          fetchServices();
        }
      } catch (error) {
        console.error('Error deleting service:', error);
      }
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Manage Services</h1>

      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 mb-8">
        <h2 className="text-xl font-bold text-white mb-4">{isEditing ? 'Edit Service' : 'Add New Service'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Title"
            value={currentService.title}
            onChange={(e) => setCurrentService({ ...currentService, title: e.target.value })}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
          />
          <input
            type="text"
            placeholder="Icon (e.g., Code, Globe)"
            value={currentService.icon}
            onChange={(e) => setCurrentService({ ...currentService, icon: e.target.value })}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
          />
          <input
            type="text"
            placeholder="Color Class (e.g., bg-red-900/20 text-red-400)"
            value={currentService.color}
            onChange={(e) => setCurrentService({ ...currentService, color: e.target.value })}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
          />
          <textarea
            placeholder="Description"
            value={currentService.description}
            onChange={(e) => setCurrentService({ ...currentService, description: e.target.value })}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white col-span-2"
          />
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={handleSave} className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700">
            <Check size={18} /> Save
          </button>
          {isEditing && (
            <button onClick={() => { setIsEditing(false); setCurrentService({ title: '', description: '', icon: 'Code', color: '' }); }} className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-700">
              <X size={18} /> Cancel
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {services.map((service) => (
          <div key={service.id} className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 relative group">
            <h3 className="text-xl font-bold text-white mb-2">{service.title}</h3>
            <p className="text-gray-400 text-sm mb-4">{service.description}</p>
            <div className="flex gap-2 absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setIsEditing(true); setCurrentService(service); }} className="bg-blue-600 p-2 rounded-lg text-white hover:bg-blue-700">
                <Edit size={16} />
              </button>
              <button onClick={() => handleDelete(service.id)} className="bg-red-600 p-2 rounded-lg text-white hover:bg-red-700">
                <Trash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

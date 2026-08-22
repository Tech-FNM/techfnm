import React, { useEffect, useState } from 'react';
import { Briefcase, Plus, Trash2, Edit2, ChevronLeft, HelpCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast, Toaster } from 'react-hot-toast';

export default function ServicesManager() {
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedService, setSelectedService] = useState<any>(null);
  
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [icon, setIcon] = useState('Code');
  const [color, setColor] = useState('bg-red-500/10 text-red-500');

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('services').select('*').order('id', { ascending: true });
      if (data && data.length > 0) {
        setServices(data);
      } else {
        // Fallback default mockup services list
        setServices([
          { id: 1, title: 'Web Development', description: 'Get a high-performance, responsive website built with Next.js/Vite.', icon: 'Code', color: 'bg-red-500/10 text-red-500' },
          { id: 2, title: 'Content Writing', description: 'We craft SEO optimized blogs to capture your brand tone.', icon: 'PenTool', color: 'bg-red-500/10 text-red-500' }
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (service: any) => {
    setSelectedService(service);
    setTitle(service.title || '');
    setDescription(service.description || '');
    setIcon(service.icon || 'Code');
    setColor(service.color || 'bg-red-500/10 text-red-500');
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title,
        description,
        icon,
        color,
      };

      if (selectedService) {
        // Update logic
        const { error } = await supabase.from('services').update(payload).eq('id', selectedService.id);
        if (error) {
          setServices(services.map(s => s.id === selectedService.id ? { ...s, ...payload } : s));
        } else {
          fetchServices();
        }
        toast.success('Service details updated');
      } else {
        // Create logic
        const { error } = await supabase.from('services').insert([payload]);
        if (error) {
          setServices([...services, { id: Date.now(), ...payload }]);
        } else {
          fetchServices();
        }
        toast.success('New service offering published');
      }
      setIsEditing(false);
      setSelectedService(null);
    } catch (err: any) {
      toast.error(err.message || 'Error saving service');
    }
  };

  const handleDelete = async (id: any) => {
    if (!window.confirm('Are you sure you want to delete this service?')) return;
    try {
      const { error } = await supabase.from('services').delete().eq('id', id);
      if (error) {
        setServices(services.filter(s => s.id !== id));
      } else {
        fetchServices();
      }
      toast.success('Service removed');
    } catch (err: any) {
      toast.error(err.message || 'Error removing service');
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" toastOptions={{ style: { background: '#18181b', color: '#fff' } }} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white">All Services</h2>
          <p className="text-xs text-zinc-500">Add, edit, or remove service packages offered on the website.</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => {
              setSelectedService(null);
              setTitle('');
              setDescription('');
              setIcon('Code');
              setColor('bg-red-500/10 text-red-500');
              setIsEditing(true);
            }}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all text-sm"
          >
            <Plus size={16} />
            <span>Add Service</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-xl space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <h3 className="text-lg font-bold text-white">{selectedService ? 'Edit Service' : 'Add New Service'}</h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors text-xs font-semibold"
            >
              <ChevronLeft size={16} /> Back to list
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Service Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Web Development"
              className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-650/40 rounded-xl px-4 py-3 text-zinc-200 outline-none text-sm transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Description</label>
            <textarea
              rows={4}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a short description..."
              className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-650/40 rounded-xl px-4 py-3 text-zinc-200 outline-none text-sm transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Icon (Lucide Class)</label>
              <select
                value={icon}
                onChange={(e) => setIcon(e.target.value)}
                className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-650/40 rounded-xl px-4 py-3 text-zinc-200 outline-none text-sm transition-all"
              >
                <option value="Code">Code / Developer</option>
                <option value="Smartphone">Smartphone / Mobile</option>
                <option value="Globe">Globe / Marketing</option>
                <option value="PenTool">PenTool / Design</option>
                <option value="ShoppingCart">ShoppingCart / Store</option>
                <option value="Share2">Share2 / Social Media</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Color Class</label>
              <input
                type="text"
                value={color}
                onChange={(e) => setColor(e.target.value)}
                placeholder="bg-red-500/10 text-red-500"
                className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-650/40 rounded-xl px-4 py-3 text-zinc-200 outline-none text-sm transition-all"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm"
            >
              Publish Service
            </button>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="bg-zinc-950 border border-zinc-800 hover:bg-zinc-850 text-zinc-400 px-6 py-3 rounded-xl transition-all text-sm"
            >
              Cancel
            </button>
          </div>
        </form>
      ) : loading ? (
        <div className="text-center py-20 text-zinc-500 font-mono">Loading services...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {services.map((s) => (
            <div key={s.id} className="bg-zinc-900 border border-zinc-850 rounded-3xl p-6 hover:border-zinc-800 transition-all flex flex-col justify-between">
              <div className="space-y-4">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 rounded-xl bg-red-600/10 border border-red-500/20 flex items-center justify-center text-red-500">
                    <Briefcase size={18} />
                  </div>
                  <h3 className="text-lg font-bold text-white leading-tight">{s.title}</h3>
                </div>
                <p className="text-zinc-400 text-sm leading-relaxed line-clamp-2">{s.description}</p>
              </div>

              <div className="flex gap-2 justify-end border-t border-zinc-850/50 pt-4 mt-6">
                <button
                  onClick={() => handleEdit(s)}
                  className="bg-zinc-950 border border-zinc-850 hover:bg-zinc-850 hover:text-white text-zinc-500 p-2.5 rounded-xl transition-all inline-flex"
                >
                  <Edit2 size={13} />
                </button>
                <button
                  onClick={() => handleDelete(s.id)}
                  className="bg-zinc-950 border border-zinc-850 hover:bg-zinc-850 hover:text-red-500 text-zinc-500 p-2.5 rounded-xl transition-all inline-flex"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

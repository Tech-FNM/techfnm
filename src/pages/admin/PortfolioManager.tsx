import React, { useEffect, useState } from 'react';
import { Briefcase, Plus, Trash2, Edit2, ChevronLeft } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast, Toaster } from 'react-hot-toast';

export default function PortfolioManager() {
  const [projects, setProjects] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedProject, setSelectedProject] = useState<any>(null);

  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Web Development');
  const [image, setImage] = useState('');
  const [description, setDescription] = useState('');

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('projects').select('*').order('id', { ascending: true });
      if (data && data.length > 0) {
        setProjects(data);
      } else {
        // Fallback default mockup projects list
        setProjects([
          { id: 1, title: 'E-Commerce Platform', category: 'Web Development', image: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&q=80&w=800', description: 'A robust online shopping platform.' },
          { id: 2, title: 'Fitness Tracking App', category: 'Mobile App', image: 'https://images.unsplash.com/photo-1526506114642-903c5e470580?auto=format&fit=crop&q=80&w=800', description: 'Real-time health metric tracker.' }
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (project: any) => {
    setSelectedProject(project);
    setTitle(project.title || '');
    setCategory(project.category || 'Web Development');
    setImage(project.image || '');
    setDescription(project.description || '');
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title,
        category,
        image,
        description,
      };

      if (selectedProject) {
        // Update logic
        const { error } = await supabase.from('projects').update(payload).eq('id', selectedProject.id);
        if (error) {
          setProjects(projects.map(p => p.id === selectedProject.id ? { ...p, ...payload } : p));
        } else {
          fetchProjects();
        }
        toast.success('Project details updated');
      } else {
        // Create logic
        const { error } = await supabase.from('projects').insert([payload]);
        if (error) {
          setProjects([...projects, { id: Date.now(), ...payload }]);
        } else {
          fetchProjects();
        }
        toast.success('New work added to showcase');
      }
      setIsEditing(false);
      setSelectedProject(null);
    } catch (err: any) {
      toast.error(err.message || 'Error saving project');
    }
  };

  const handleDelete = async (id: any) => {
    if (!window.confirm('Are you sure you want to delete this portfolio project?')) return;
    try {
      const { error } = await supabase.from('projects').delete().eq('id', id);
      if (error) {
        setProjects(projects.filter(p => p.id !== id));
      } else {
        fetchProjects();
      }
      toast.success('Project removed');
    } catch (err: any) {
      toast.error(err.message || 'Error removing project');
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" toastOptions={{ style: { background: '#18181b', color: '#fff' } }} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white">Portfolio Showcase</h2>
          <p className="text-xs text-zinc-500">Manage all projects displayed in the digital showcase gallery.</p>
        </div>
        {!isEditing && (
          <button
            onClick={() => {
              setSelectedProject(null);
              setTitle('');
              setCategory('Web Development');
              setImage('');
              setDescription('');
              setIsEditing(true);
            }}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2.5 rounded-xl font-bold transition-all text-sm"
          >
            <Plus size={16} />
            <span>Add Project</span>
          </button>
        )}
      </div>

      {isEditing ? (
        <form onSubmit={handleSave} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 max-w-xl space-y-6">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <h3 className="text-lg font-bold text-white">{selectedProject ? 'Edit Project' : 'Add New Project'}</h3>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors text-xs font-semibold"
            >
              <ChevronLeft size={16} /> Back to list
            </button>
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Project Title</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="E-Commerce Solution"
              className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-600/40 rounded-xl px-4 py-3 text-zinc-200 outline-none text-sm transition-all"
            />
          </div>

          <div className="space-y-1">
            <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Description</label>
            <textarea
              rows={3}
              required
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Write a brief overview..."
              className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-600/40 rounded-xl px-4 py-3 text-zinc-200 outline-none text-sm transition-all resize-none"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Category</label>
              <input
                type="text"
                required
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                placeholder="E.g., Web Development"
                className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-600/40 rounded-xl px-4 py-3 text-zinc-200 outline-none text-sm transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Image Link / URL</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-600/40 rounded-xl px-4 py-3 text-zinc-200 outline-none text-sm transition-all"
              />
            </div>
          </div>

          <div className="flex gap-4 pt-4">
            <button
              type="submit"
              className="bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm"
            >
              Publish Project
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
        <div className="text-center py-20 text-zinc-500 font-mono">Loading projects...</div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {projects.map((p) => (
            <div key={p.id} className="bg-zinc-900 border border-zinc-850 rounded-3xl overflow-hidden hover:border-zinc-800 transition-all flex flex-col justify-between">
              <div>
                <img
                  src={p.image || 'https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&q=80&w=800'}
                  alt={p.title}
                  className="w-full h-44 object-cover border-b border-zinc-850"
                />
                <div className="p-5 space-y-2">
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-wider block">
                    {p.category}
                  </span>
                  <h3 className="text-base font-bold text-white leading-tight line-clamp-1">{p.title}</h3>
                  <p className="text-zinc-300 text-xs leading-relaxed line-clamp-2">{p.description}</p>
                </div>
              </div>

              <div className="p-5 pt-0 flex gap-2 justify-end border-t border-zinc-850/50 mt-4">
                <button
                  onClick={() => handleEdit(p)}
                  className="bg-zinc-950 border border-zinc-850 hover:bg-zinc-850 hover:text-white text-zinc-500 p-2 rounded-xl transition-all inline-flex"
                >
                  <Edit2 size={12} />
                </button>
                <button
                  onClick={() => handleDelete(p.id)}
                  className="bg-zinc-950 border border-zinc-850 hover:bg-zinc-850 hover:text-red-500 text-zinc-500 p-2 rounded-xl transition-all inline-flex"
                >
                  <Trash2 size={12} />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

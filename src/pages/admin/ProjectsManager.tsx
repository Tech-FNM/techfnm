import { useEffect, useState } from 'react';
import { Plus, Trash, Edit, Check, X, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function ProjectsManager() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<any>({
    title: '',
    category: 'Web Development',
    image: '',
    description: '',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      const { data, error } = await supabase.from('projects').select('*');
      if (data) {
        setProjects(data);
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
    }
  };

  const handleSave = async () => {
    if (!currentProject.title || !currentProject.category) {
      alert('Please fill in Title and Category');
      return;
    }

    try {
      let error;
      const payload = {
        title: currentProject.title,
        category: currentProject.category,
        image: currentProject.image,
        description: currentProject.description
      };

      if (isEditing) {
        const { error: updateError } = await supabase.from('projects').update(payload).eq('id', currentProject.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from('projects').insert([payload]);
        error = insertError;
      }
      
      if (error) {
        console.error('Supabase error:', error);
        alert(`Error saving project: ${error.message}`);
      } else {
        alert(isEditing ? 'Project updated successfully!' : 'Project added successfully!');
        setIsEditing(false);
        setCurrentProject({ title: '', category: 'Web Development', image: '', description: '' });
        fetchProjects();
      }
    } catch (error: any) {
      console.error('Error saving project:', error);
      alert('An unexpected error occurred.');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      try {
        const { error } = await supabase.from('projects').delete().eq('id', id);
        if (!error) {
          fetchProjects();
        }
      } catch (error) {
        console.error('Error deleting project:', error);
      }
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Manage Projects</h1>

      {/* Form Section */}
      <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 mb-12 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          {isEditing ? <Edit size={20} className="text-blue-500" /> : <Plus size={20} className="text-red-500" />}
          {isEditing ? 'Edit Project' : 'Add New Project'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Project Title</label>
              <input
                type="text"
                placeholder="e.g. E-Commerce Platform"
                value={currentProject.title}
                onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
              <select
                value={currentProject.category}
                onChange={(e) => setCurrentProject({ ...currentProject, category: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
              >
                <option value="Web Development">Web Development</option>
                <option value="Mobile App">Mobile App</option>
                <option value="UI/UX Design">UI/UX Design</option>
                <option value="Digital Marketing">Digital Marketing</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Project Image URL (Optional)</label>
              <input
                type="text"
                placeholder="https://example.com/image.jpg"
                value={currentProject.image}
                onChange={(e) => setCurrentProject({ ...currentProject, image: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
              />
              {currentProject.image && (
                <div className="mt-4 w-32 h-20 rounded-lg overflow-hidden border border-zinc-700 bg-zinc-800 flex items-center justify-center">
                  <img src={currentProject.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Short Description</label>
              <textarea
                placeholder="Describe this project..."
                rows={6}
                value={currentProject.description}
                onChange={(e) => setCurrentProject({ ...currentProject, description: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all resize-none"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button 
            onClick={handleSave} 
            className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
          >
            <Check size={20} /> {isEditing ? 'Update Project' : 'Create Project'}
          </button>
          {isEditing && (
            <button 
              onClick={() => { setIsEditing(false); setCurrentProject({ title: '', category: 'Web Development', image: '', description: '' }); }} 
              className="bg-zinc-800 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-700 transition-all"
            >
              <X size={20} /> Cancel
            </button>
          )}
        </div>
      </div>

      {/* List Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white mb-4">Existing Projects</h2>
        <div className="grid grid-cols-1 gap-4">
          {projects.length === 0 ? (
            <div className="text-center py-12 bg-zinc-900 rounded-2xl border border-zinc-800 text-gray-500">
              No projects found. Add your first project above.
            </div>
          ) : (
            projects.map((project) => (
              <div key={project.id} className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 flex items-center justify-between group hover:border-zinc-700 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden">
                    {project.image ? (
                      <img src={project.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="text-zinc-600" size={20} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{project.title}</h3>
                    <div className="flex items-center gap-2">
                      <span className="text-red-500 text-xs font-semibold uppercase">{project.category}</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setIsEditing(true); setCurrentProject(project); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(project.id)} 
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

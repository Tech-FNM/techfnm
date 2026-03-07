import { useEffect, useState } from 'react';
import axios from 'axios';
import { Plus, Trash, Edit, Check, X } from 'lucide-react';

export default function ProjectsManager() {
  const [projects, setProjects] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentProject, setCurrentProject] = useState<any>({
    title: '',
    category: '',
    image: '',
  });

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    const res = await axios.get('/api/projects');
    setProjects(res.data);
  };

  const handleSave = async () => {
    if (isEditing) {
      await axios.put(`/api/projects/${currentProject.id}`, currentProject);
    } else {
      await axios.post('/api/projects', currentProject);
    }
    setIsEditing(false);
    setCurrentProject({ title: '', category: '', image: '' });
    fetchProjects();
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      await axios.delete(`/api/projects/${id}`);
      fetchProjects();
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Manage Projects</h1>

      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 mb-8">
        <h2 className="text-xl font-bold text-white mb-4">{isEditing ? 'Edit Project' : 'Add New Project'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Title"
            value={currentProject.title}
            onChange={(e) => setCurrentProject({ ...currentProject, title: e.target.value })}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
          />
          <input
            type="text"
            placeholder="Category"
            value={currentProject.category}
            onChange={(e) => setCurrentProject({ ...currentProject, category: e.target.value })}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={currentProject.image}
            onChange={(e) => setCurrentProject({ ...currentProject, image: e.target.value })}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white col-span-2"
          />
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={handleSave} className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700">
            <Check size={18} /> Save
          </button>
          {isEditing && (
            <button onClick={() => { setIsEditing(false); setCurrentProject({ title: '', category: '', image: '' }); }} className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-700">
              <X size={18} /> Cancel
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {projects.map((project) => (
          <div key={project.id} className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 relative group">
            <img src={project.image} alt={project.title} className="w-full h-48 object-cover rounded-lg mb-4" />
            <h3 className="text-xl font-bold text-white mb-2">{project.title}</h3>
            <p className="text-gray-400 text-sm mb-4">{project.category}</p>
            <div className="flex gap-2 absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setIsEditing(true); setCurrentProject(project); }} className="bg-blue-600 p-2 rounded-lg text-white hover:bg-blue-700">
                <Edit size={16} />
              </button>
              <button onClick={() => handleDelete(project.id)} className="bg-red-600 p-2 rounded-lg text-white hover:bg-red-700">
                <Trash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Plus, Trash, Edit, Check, X, Code, Smartphone, Globe, PenTool, ShoppingCart, Share2, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const iconList = [
  { name: 'Code', icon: Code },
  { name: 'Smartphone', icon: Smartphone },
  { name: 'Globe', icon: Globe },
  { name: 'PenTool', icon: PenTool },
  { name: 'ShoppingCart', icon: ShoppingCart },
  { name: 'Share2', icon: Share2 },
];

export default function ServicesManager() {
  const [services, setServices] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
    const [currentService, setCurrentService] = useState<any>({
    title: '',
    description: '',
    icon: 'Code',
    color: 'bg-red-500/10 text-red-500',
    slug: '',
    content: '',
    meta_title: '',
    meta_description: ''
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const { data, error } = await supabase.from('services').select('*');
      if (data) {
        setServices(data);
      }
    } catch (error) {
      console.error('Error fetching services:', error);
    }
  };

  const handleSave = async () => {
    if (!currentService.title || !currentService.description) {
      alert('Please fill in Title and Description');
      return;
    }

    try {
      let error;
      const payload = {
        title: currentService.title,
        description: currentService.description,
        icon: currentService.icon,
        color: currentService.color,
        slug: currentService.slug,
        content: currentService.content,
        meta_title: currentService.meta_title,
        meta_description: currentService.meta_description
      };

      if (isEditing) {
        const { error: updateError } = await supabase.from('services').update(payload).eq('id', currentService.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from('services').insert([payload]);
        error = insertError;
      }
      
      if (error) {
        console.error('Supabase error:', error);
        alert(`Error saving service: ${error.message}`);
      } else {
        alert(isEditing ? 'Service updated successfully!' : 'Service added successfully!');
        setIsEditing(false);
        setCurrentService({ title: '', description: '', icon: 'Code', color: 'bg-red-500/10 text-red-500', slug: '', content: '', meta_title: '', meta_description: '' });
        fetchServices();
      }
    } catch (error: any) {
      console.error('Error saving service:', error);
      alert('An unexpected error occurred.');
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
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Manage Services</h1>

      {/* Form Section */}
      <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 mb-12 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          {isEditing ? <Edit size={20} className="text-blue-500" /> : <Plus size={20} className="text-red-500" />}
          {isEditing ? 'Edit Service' : 'Add New Service'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Service Title</label>
              <input
                type="text"
                placeholder="e.g. Web Development"
                value={currentService.title}
                onChange={(e) => {
                  const title = e.target.value;
                  const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                  setCurrentService({ ...currentService, title, slug: currentService.slug ? currentService.slug : slug });
                }}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Slug</label>
              <input
                type="text"
                value={currentService.slug}
                onChange={(e) => setCurrentService({ ...currentService, slug: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-3">Select Icon</label>
              <div className="grid grid-cols-3 gap-3">
                {iconList.map((item) => {
                  const Icon = item.icon;
                  return (
                    <button
                      key={item.name}
                      onClick={() => setCurrentService({ ...currentService, icon: item.name })}
                      className={`flex flex-col items-center justify-center p-4 rounded-xl border transition-all ${currentService.icon === item.name ? 'bg-red-500/20 border-red-500 text-red-500' : 'bg-zinc-800 border-zinc-700 text-gray-400 hover:border-zinc-600'}`}
                    >
                      <Icon size={24} />
                      <span className="text-xs mt-2">{item.name}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Short Description</label>
              <textarea
                placeholder="Describe this service for the card..."
                rows={3}
                value={currentService.description}
                onChange={(e) => setCurrentService({ ...currentService, description: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all resize-none"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Full Content (Markdown Supported)</label>
              <textarea
                placeholder="Detailed content for the service page..."
                rows={5}
                value={currentService.content || ''}
                onChange={(e) => setCurrentService({ ...currentService, content: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all font-mono text-sm"
              />
            </div>
            
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">SEO Title</label>
                <input
                  type="text"
                  value={currentService.meta_title || ''}
                  onChange={(e) => setCurrentService({ ...currentService, meta_title: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">SEO Description</label>
                <input
                  type="text"
                  value={currentService.meta_description || ''}
                  onChange={(e) => setCurrentService({ ...currentService, meta_description: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-2 text-white text-sm focus:outline-none focus:ring-2 focus:ring-red-500/50"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button 
            onClick={handleSave} 
            className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
          >
            <Check size={20} /> {isEditing ? 'Update Service' : 'Create Service'}
          </button>
          {isEditing && (
            <button 
              onClick={() => { setIsEditing(false); setCurrentService({ title: '', description: '', icon: 'Code', color: 'bg-red-500/10 text-red-500' }); }} 
              className="bg-zinc-800 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-700 transition-all"
            >
              <X size={20} /> Cancel
            </button>
          )}
        </div>
      </div>

      {/* List Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white mb-4">Existing Services</h2>
        <div className="grid grid-cols-1 gap-4">
          {services.length === 0 ? (
            <div className="text-center py-12 bg-zinc-900 rounded-2xl border border-zinc-800 text-gray-500">
              No services found. Add your first service above.
            </div>
          ) : (
            services.map((service) => (
              <div key={service.id} className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 flex items-center justify-between group hover:border-zinc-700 transition-all">
                <div className="flex items-center gap-4">
                  <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${service.color || 'bg-zinc-800 text-gray-400'}`}>
                    <Code size={20} />
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{service.title}</h3>
                    <p className="text-gray-500 text-xs">{service.icon}</p>
                  </div>
                </div>
                
                <div className="flex gap-2">
                  <button 
                    onClick={() => { setIsEditing(true); setCurrentService(service); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(service.id)} 
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

import { useEffect, useState } from 'react';
import { Plus, Trash, Edit, Check, X, Upload, Image as ImageIcon } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function ServicesManager() {
  const [services, setServices] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentService, setCurrentService] = useState<any>({
    title: '',
    slug: '',
    description: '',
    icon: 'Code',
    color: 'bg-red-900/20 text-red-400',
    image: '',
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

  const generateSlug = (text: string) => {
    return text
      .toLowerCase()
      .replace(/[^\w ]+/g, '')
      .replace(/ +/g, '-');
  };

  const handleTitleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const title = e.target.value;
    setCurrentService({
      ...currentService,
      title,
      slug: isEditing ? currentService.slug : generateSlug(title)
    });
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;
      
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `services/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('agency-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('agency-assets')
        .getPublicUrl(filePath);

      setCurrentService({ ...currentService, image: publicUrl });
      alert('Image uploaded successfully!');
    } catch (error: any) {
      alert('Error uploading image: ' + error.message + '\nMake sure you have created a public bucket named "agency-assets" in Supabase Storage.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!currentService.title || !currentService.description || !currentService.slug) {
      alert('Please fill in all required fields (Title, Slug, Description)');
      return;
    }

    try {
      let error;
      const payload = {
        title: currentService.title,
        slug: currentService.slug,
        description: currentService.description,
        icon: currentService.icon,
        color: currentService.color,
        image: currentService.image
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
        alert(`Error saving service: ${error.message}. Make sure the 'services' table has 'slug' and 'image' columns.`);
      } else {
        alert(isEditing ? 'Service updated successfully!' : 'Service added successfully!');
        setIsEditing(false);
        setCurrentService({ title: '', slug: '', description: '', icon: 'Code', color: 'bg-red-900/20 text-red-400', image: '' });
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
                onChange={handleTitleChange}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Slug (URL friendly)</label>
              <input
                type="text"
                placeholder="e.g. web-development"
                value={currentService.slug}
                onChange={(e) => setCurrentService({ ...currentService, slug: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Icon Name</label>
                <input
                  type="text"
                  placeholder="Code, Globe, etc."
                  value={currentService.icon}
                  onChange={(e) => setCurrentService({ ...currentService, icon: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Color Class</label>
                <input
                  type="text"
                  placeholder="Tailwind classes"
                  value={currentService.color}
                  onChange={(e) => setCurrentService({ ...currentService, color: e.target.value })}
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Description</label>
              <textarea
                placeholder="Describe this service..."
                rows={4}
                value={currentService.description}
                onChange={(e) => setCurrentService({ ...currentService, description: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all resize-none"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Service Image</label>
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="image-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="image-upload"
                    className={`flex items-center justify-center gap-2 w-full bg-zinc-800 border-2 border-dashed border-zinc-700 rounded-xl px-4 py-3 text-gray-400 cursor-pointer hover:border-red-500/50 hover:text-white transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {uploading ? 'Uploading...' : <><Upload size={18} /> Attach Image</>}
                  </label>
                </div>
                {currentService.image && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-zinc-700 bg-zinc-800 flex items-center justify-center">
                    <img src={currentService.image} alt="Preview" className="w-full h-full object-cover" />
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
            <Check size={20} /> {isEditing ? 'Update Service' : 'Create Service'}
          </button>
          {isEditing && (
            <button 
              onClick={() => { setIsEditing(false); setCurrentService({ title: '', slug: '', description: '', icon: 'Code', color: 'bg-red-900/20 text-red-400', image: '' }); }} 
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
                  <div className="w-12 h-12 rounded-lg bg-zinc-800 flex items-center justify-center overflow-hidden">
                    {service.image ? (
                      <img src={service.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <ImageIcon className="text-zinc-600" size={20} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{service.title}</h3>
                    <p className="text-gray-500 text-xs font-mono">{service.slug}</p>
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

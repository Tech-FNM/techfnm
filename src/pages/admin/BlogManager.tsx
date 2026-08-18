import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Pencil, Trash2, X, Image as ImageIcon, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

export default function BlogManager() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  
  const [formData, setFormData] = useState({
    id: '',
    title: '',
    slug: '',
    content: '',
    image: '',
    meta_title: '',
    meta_description: ''
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
    if (error) toast.error('Failed to load blogs');
    else setBlogs(data || []);
    setIsLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `blogs/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('agency-assets')
        .upload(filePath, file);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('agency-assets')
        .getPublicUrl(filePath);

      setFormData(prev => ({ ...prev, image: publicUrl }));
      toast.success('Image uploaded successfully');
    } catch (error) {
      toast.error('Error uploading image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      if (formData.id) {
        const { error } = await supabase.from('blogs').update({
          title: formData.title,
          slug: formData.slug,
          content: formData.content,
          image: formData.image,
          meta_title: formData.meta_title,
          meta_description: formData.meta_description
        }).eq('id', formData.id);
        if (error) throw error;
        toast.success('Blog updated successfully');
      } else {
        const { error } = await supabase.from('blogs').insert([{
          title: formData.title,
          slug: formData.slug,
          content: formData.content,
          image: formData.image,
          meta_title: formData.meta_title,
          meta_description: formData.meta_description
        }]);
        if (error) throw error;
        toast.success('Blog created successfully');
      }
      setIsEditing(false);
      fetchBlogs();
    } catch (error: any) {
      toast.error(error.message || 'Error saving blog');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this blog?')) return;
    
    const { error } = await supabase.from('blogs').delete().eq('id', id);
    if (error) toast.error('Error deleting blog');
    else {
      toast.success('Blog deleted successfully');
      fetchBlogs();
    }
  };

  const resetForm = () => {
    setFormData({ id: '', title: '', slug: '', content: '', image: '', meta_title: '', meta_description: '' });
    setIsEditing(true);
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-red-500" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Blog Manager</h1>
        {!isEditing && (
          <button onClick={resetForm} className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
            <Plus size={20} /> Add Blog
          </button>
        )}
      </div>

      {isEditing ? (
        <div className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-white">{formData.id ? 'Edit Blog' : 'New Blog'}</h2>
            <button onClick={() => setIsEditing(false)} className="text-gray-400 hover:text-white"><X size={24} /></button>
          </div>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Title</label>
                <input required type="text" value={formData.title} onChange={e => {
                    const title = e.target.value;
                    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
                    setFormData({...formData, title, slug: formData.slug ? formData.slug : slug});
                  }} 
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Slug</label>
                <input required type="text" value={formData.slug} onChange={e => setFormData({...formData, slug: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
              </div>
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Content (Markdown Supported)</label>
              <textarea required rows={10} value={formData.content} onChange={e => setFormData({...formData, content: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white font-mono text-sm"></textarea>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Featured Image</label>
              <div className="flex items-center gap-4">
                {formData.image && <img src={formData.image} alt="Preview" className="h-16 w-16 object-cover rounded" />}
                <label className="cursor-pointer bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white px-4 py-2 rounded-lg flex items-center gap-2">
                  <ImageIcon size={20} /> Upload Image
                  <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                </label>
                {formData.image && (
                  <input type="text" value={formData.image} onChange={e => setFormData({...formData, image: e.target.value})} className="flex-1 bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white" placeholder="Or enter image URL" />
                )}
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">SEO Title</label>
                <input type="text" value={formData.meta_title} onChange={e => setFormData({...formData, meta_title: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">SEO Description</label>
                <input type="text" value={formData.meta_description} onChange={e => setFormData({...formData, meta_description: e.target.value})} className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white" />
              </div>
            </div>

            <div className="flex justify-end gap-4 pt-4 border-t border-zinc-800">
              <button type="button" onClick={() => setIsEditing(false)} className="px-4 py-2 text-gray-400 hover:text-white">Cancel</button>
              <button type="submit" disabled={isSaving} className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg flex items-center gap-2">
                {isSaving ? <Loader2 className="animate-spin" size={20} /> : 'Save Blog'}
              </button>
            </div>
          </form>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4">
          {blogs.map(blog => (
            <div key={blog.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-4 flex items-center justify-between">
              <div className="flex items-center gap-4">
                {blog.image ? (
                  <img src={blog.image} alt="" className="w-16 h-16 rounded object-cover" />
                ) : (
                  <div className="w-16 h-16 rounded bg-zinc-800 flex items-center justify-center"><ImageIcon className="text-zinc-600" /></div>
                )}
                <div>
                  <h3 className="text-white font-bold text-lg">{blog.title}</h3>
                  <p className="text-gray-400 text-sm">/{blog.slug}</p>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button onClick={() => { setFormData(blog); setIsEditing(true); }} className="p-2 text-gray-400 hover:text-white bg-zinc-800 hover:bg-zinc-700 rounded-lg"><Pencil size={18} /></button>
                <button onClick={() => handleDelete(blog.id)} className="p-2 text-gray-400 hover:text-red-500 bg-zinc-800 hover:bg-zinc-700 rounded-lg"><Trash2 size={18} /></button>
              </div>
            </div>
          ))}
          {blogs.length === 0 && <div className="text-center text-gray-500 py-8">No blogs created yet.</div>}
        </div>
      )}
    </div>
  );
}

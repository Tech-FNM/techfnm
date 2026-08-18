import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Loader2, Save } from 'lucide-react';
import toast from 'react-hot-toast';

export default function SeoManager() {
  const [seoData, setSeoData] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);

  const pages = [
    { id: 'home', name: 'Home Page' },
    { id: 'about', name: 'About Page' },
    { id: 'services', name: 'Services Listing Page' },
    { id: 'portfolio', name: 'Portfolio Page' },
    { id: 'blog', name: 'Blog Listing Page' },
    { id: 'faq', name: 'FAQ Page' },
    { id: 'contact', name: 'Contact Page' }
  ];

  useEffect(() => {
    fetchSeo();
  }, []);

  const fetchSeo = async () => {
    setIsLoading(true);
    const { data } = await supabase.from('seo_settings').select('*');
    if (data) {
      // Map to ensure all pages exist in state
      const mapped = pages.map(page => {
        const found = data.find(d => d.id === page.id);
        return found ? { ...page, ...found } : { ...page, title: '', description: '' };
      });
      setSeoData(mapped);
    }
    setIsLoading(false);
  };

  const handleUpdate = (id: string, field: string, value: string) => {
    setSeoData(prev => prev.map(item => item.id === id ? { ...item, [field]: value } : item));
  };

  const handleSave = async (item: any) => {
    setIsSaving(true);
    const { error } = await supabase.from('seo_settings').upsert({
      id: item.id,
      title: item.title,
      description: item.description
    });
    if (error) toast.error(`Failed to save SEO for ${item.name}`);
    else toast.success(`Saved SEO for ${item.name}`);
    setIsSaving(false);
  };

  if (isLoading) return <div className="flex justify-center p-8"><Loader2 className="animate-spin text-red-500" /></div>;

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-2xl font-bold text-white">Global SEO Settings</h1>
      </div>
      <p className="text-gray-400">Manage the meta title and description for each static page.</p>

      <div className="space-y-6">
        {seoData.map(item => (
          <div key={item.id} className="bg-zinc-900 border border-zinc-800 rounded-xl p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-bold text-white">{item.name}</h3>
              <button 
                onClick={() => handleSave(item)}
                disabled={isSaving}
                className="bg-zinc-800 hover:bg-zinc-700 text-white px-4 py-2 rounded-lg flex items-center gap-2 transition-colors text-sm"
              >
                <Save size={16} /> Save
              </button>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Meta Title</label>
                <input 
                  type="text" 
                  value={item.title || ''} 
                  onChange={(e) => handleUpdate(item.id, 'title', e.target.value)}
                  placeholder="e.g. About Us | TechFNM"
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white" 
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-400 mb-1">Meta Description</label>
                <textarea 
                  rows={3}
                  value={item.description || ''} 
                  onChange={(e) => handleUpdate(item.id, 'description', e.target.value)}
                  placeholder="Page description for search engines..."
                  className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white" 
                />
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

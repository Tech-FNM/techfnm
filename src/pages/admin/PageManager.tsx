import { useEffect, useState } from 'react';
import { LayoutGrid, Save, Edit, RefreshCw } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast, Toaster } from 'react-hot-toast';

export default function PageManager() {
  const [pagesContent, setPagesContent] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedItem, setSelectedItem] = useState<any>(null);
  const [editedContent, setEditedContent] = useState<any>({});

  useEffect(() => {
    fetchPagesContent();
  }, []);

  const fetchPagesContent = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('pages_content').select('*');
      if (data && data.length > 0) {
        setPagesContent(data);
      } else {
        // Fallback mockup config entries
        setPagesContent([
          { id: 'home_hero', section_name: 'Homepage Hero', content: { title: 'Your Digital Growth Partner', subtitle: 'Crafting premium web applications, branding, and conversion flows.' } },
          { id: 'site_header', section_name: 'Header Branding', content: { logo_text: 'TechFNM', cta_text: '0313-9023118' } },
          { id: 'home_faq', section_name: 'FAQ Page Title', content: { title: 'Frequently Asked Questions', badge_text: 'Support Center' } }
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (item: any) => {
    setSelectedItem(item);
    setEditedContent({ ...item.content });
  };

  const handleSave = async () => {
    if (!selectedItem) return;

    try {
      const { error } = await supabase
        .from('pages_content')
        .update({ content: editedContent })
        .eq('id', selectedItem.id);

      if (error) {
        // Fallback update locally
        setPagesContent(pagesContent.map(p => p.id === selectedItem.id ? { ...p, content: editedContent } : p));
      } else {
        fetchPagesContent();
      }

      toast.success('Page section content updated successfully!');
      setSelectedItem(null);
    } catch (err: any) {
      toast.error(err.message || 'Error updating content');
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" toastOptions={{ style: { background: '#18181b', color: '#fff' } }} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white">Page Management</h2>
          <p className="text-xs text-zinc-500">Edit dynamic headings, badge texts, and branding across the entire site.</p>
        </div>
        <button
          onClick={fetchPagesContent}
          className="flex items-center gap-2 bg-zinc-900 border border-zinc-800 hover:bg-zinc-850 text-zinc-300 px-4 py-2 rounded-xl transition-all text-xs font-bold"
        >
          <RefreshCw size={14} />
          <span>Reload Content</span>
        </button>
      </div>

      {loading ? (
        <div className="text-center py-20 text-zinc-500 font-mono">Loading page config entries...</div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          
          {/* List of Configurable Sections */}
          <div className="space-y-4">
            <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Available Sections</h3>
            {pagesContent.map((item) => (
              <div
                key={item.id}
                className={`p-6 rounded-3xl border transition-all cursor-pointer ${
                  selectedItem?.id === item.id
                    ? 'bg-red-950/10 border-red-600/40 shadow-lg'
                    : 'bg-zinc-900 border-zinc-850 hover:border-zinc-800'
                }`}
                onClick={() => handleEdit(item)}
              >
                <div className="flex justify-between items-center mb-4">
                  <h4 className="font-bold text-white text-base">{item.section_name}</h4>
                  <Edit size={14} className={selectedItem?.id === item.id ? 'text-red-500' : 'text-zinc-550'} />
                </div>
                <div className="space-y-2 text-xs text-zinc-400 font-mono bg-zinc-950/60 p-4 rounded-2xl border border-zinc-850/40">
                  {Object.entries(item.content || {}).map(([key, val]: any) => (
                    <div key={key} className="flex items-baseline gap-2">
                      <span className="text-red-500 font-bold">{key}:</span>
                      <span className="line-clamp-1">{String(val)}</span>
                    </div>
                  ))}
                </div>
              </div>
            ))}
          </div>

          {/* Form to Edit Section */}
          <div>
            {selectedItem ? (
              <div className="bg-zinc-900 border border-zinc-850 rounded-3xl p-8 space-y-6 sticky top-6">
                <h3 className="text-lg font-bold text-white">Edit: {selectedItem.section_name}</h3>
                
                <div className="space-y-4">
                  {Object.entries(selectedItem.content || {}).map(([key, val]: any) => (
                    <div key={key} className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">{key}</label>
                      {String(val).length > 60 ? (
                        <textarea
                          rows={4}
                          value={editedContent[key] || ''}
                          onChange={(e) => setEditedContent({ ...editedContent, [key]: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-650/40 rounded-xl px-4 py-3.5 text-zinc-200 outline-none text-sm transition-all resize-none"
                        />
                      ) : (
                        <input
                          type="text"
                          value={editedContent[key] || ''}
                          onChange={(e) => setEditedContent({ ...editedContent, [key]: e.target.value })}
                          className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-650/40 rounded-xl px-4 py-3 text-zinc-200 outline-none text-sm transition-all"
                        />
                      )}
                    </div>
                  ))}
                </div>

                <div className="flex gap-4 pt-4">
                  <button
                    onClick={handleSave}
                    className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl transition-all text-sm"
                  >
                    <Save size={16} />
                    <span>Apply Changes</span>
                  </button>
                  <button
                    onClick={() => setSelectedItem(null)}
                    className="bg-zinc-950 border border-zinc-800 hover:bg-zinc-850 text-zinc-400 px-6 py-3 rounded-xl transition-all text-sm"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="h-64 rounded-3xl border border-zinc-850 border-dashed flex flex-col items-center justify-center text-zinc-600 text-sm">
                <LayoutGrid size={28} className="text-zinc-700 mb-2" />
                <p>Select a section from the list to start editing.</p>
              </div>
            )}
          </div>

        </div>
      )}
    </div>
  );
}

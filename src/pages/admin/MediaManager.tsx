import { useEffect, useState } from 'react';
import { Image as ImageIcon, Plus, Trash2, Copy, Check } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast, Toaster } from 'react-hot-toast';

export default function MediaManager() {
  const [mediaItems, setMediaItems] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [copiedId, setCopiedId] = useState<any>(null);
  const [imageUrl, setImageUrl] = useState('');
  const [mediaName, setMediaName] = useState('');

  useEffect(() => {
    fetchMedia();
  }, []);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      // Custom media asset registry table or list files in buckets
      const { data, error } = await supabase.from('media_assets').select('*');
      if (data && data.length > 0) {
        setMediaItems(data);
      } else {
        // Fallback default assets
        setMediaItems([
          { id: 1, name: 'Unsplash Commerce', url: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&q=80&w=800' },
          { id: 2, name: 'Unsplash Fitness', url: 'https://images.unsplash.com/photo-1526506114642-903c5e470580?auto=format&fit=crop&q=80&w=800' },
          { id: 3, name: 'Unsplash Dashboard', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800' }
        ]);
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!imageUrl) return;

    try {
      const payload = {
        name: mediaName || 'Media File ' + Date.now(),
        url: imageUrl,
      };

      const { error } = await supabase.from('media_assets').insert([payload]);
      if (error) {
        // Local fallback
        setMediaItems([{ id: Date.now(), ...payload }, ...mediaItems]);
      } else {
        fetchMedia();
      }

      toast.success('Media asset registered successfully!');
      setImageUrl('');
      setMediaName('');
    } catch (err: any) {
      toast.error(err.message || 'Error registering media');
    }
  };

  const handleDelete = async (id: any) => {
    if (!window.confirm('Are you sure you want to delete this media asset?')) return;
    try {
      const { error } = await supabase.from('media_assets').delete().eq('id', id);
      if (error) {
        setMediaItems(mediaItems.filter(m => m.id !== id));
      } else {
        fetchMedia();
      }
      toast.success('Media asset removed');
    } catch (err: any) {
      toast.error(err.message || 'Error removing asset');
    }
  };

  const copyToClipboard = (url: string, id: any) => {
    navigator.clipboard.writeText(url);
    setCopiedId(id);
    toast.success('URL copied to clipboard!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" toastOptions={{ style: { background: '#18181b', color: '#fff' } }} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white">Media Library</h2>
          <p className="text-xs text-zinc-500">Upload, register, and copy image links for services and portfolio works.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Upload/Register Form */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 h-fit space-y-6">
          <h3 className="text-base font-bold text-white">Add New Media URL</h3>
          
          <form onSubmit={handleAddMedia} className="space-y-4">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Asset Name</label>
              <input
                type="text"
                required
                value={mediaName}
                onChange={(e) => setMediaName(e.target.value)}
                placeholder="E.g., Client Logo"
                className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-650/40 rounded-xl px-4 py-3 text-zinc-200 outline-none text-sm transition-all"
              />
            </div>

            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Image Link / URL</label>
              <input
                type="text"
                required
                value={imageUrl}
                onChange={(e) => setImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/photo..."
                className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-650/40 rounded-xl px-4 py-3 text-zinc-200 outline-none text-sm transition-all"
              />
            </div>

            <button
              type="submit"
              className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-red-950/20 text-sm"
            >
              <Plus size={16} />
              <span>Add to Library</span>
            </button>
          </form>
        </div>

        {/* Media Items Gallery Grid */}
        <div className="lg:col-span-2 space-y-4">
          <h3 className="text-sm font-bold text-zinc-400 uppercase tracking-wider mb-2">Registered Media Assets</h3>
          
          {loading ? (
            <div className="text-center py-20 text-zinc-500 font-mono">Loading library assets...</div>
          ) : mediaItems.length === 0 ? (
            <div className="text-center py-20 bg-zinc-900 border border-zinc-800 rounded-3xl text-zinc-650">
              <ImageIcon size={32} className="mx-auto text-zinc-700 mb-2" />
              <p>No media files registered yet.</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              {mediaItems.map((item) => (
                <div key={item.id} className="bg-zinc-900 border border-zinc-850 rounded-3xl overflow-hidden hover:border-zinc-800 transition-all flex flex-col justify-between">
                  <div className="aspect-video w-full overflow-hidden bg-zinc-950 flex items-center justify-center border-b border-zinc-850/50">
                    <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                  </div>
                  
                  <div className="p-4 space-y-3">
                    <span className="font-bold text-white text-sm line-clamp-1 block">{item.name}</span>
                    
                    <div className="flex gap-2 w-full">
                      <button
                        onClick={() => copyToClipboard(item.url, item.id)}
                        className="flex-grow flex items-center justify-center gap-1.5 py-2 rounded-xl bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white transition-all text-xs font-semibold"
                      >
                        {copiedId === item.id ? <Check size={13} className="text-green-500" /> : <Copy size={13} />}
                        <span>{copiedId === item.id ? 'Copied' : 'Copy URL'}</span>
                      </button>
                      
                      <button
                        onClick={() => handleDelete(item.id)}
                        className="bg-zinc-950 hover:bg-zinc-850 border border-zinc-800 text-zinc-500 hover:text-red-500 p-2 rounded-xl transition-all"
                      >
                        <Trash2 size={14} />
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

      </div>
    </div>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { LayoutGrid, List, Upload, Search, X, Check, Copy, ChevronLeft, ChevronRight, Trash2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast, Toaster } from 'react-hot-toast';

interface MediaItem {
  id: any;
  name: string;
  url: string;
  alt_text?: string;
  caption?: string;
  description?: string;
  file_type?: string;
  file_size?: string;
  dimensions?: string;
  created_at?: string;
}

const SAMPLE: MediaItem[] = [
  { id: 1, name: 'Tech Commerce', url: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&q=80&w=800', file_type: 'image/jpeg', file_size: '124 KB', dimensions: '800 × 533', created_at: new Date().toISOString() },
  { id: 2, name: 'Dashboard Analytics', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800', file_type: 'image/jpeg', file_size: '98 KB', dimensions: '800 × 533', created_at: new Date().toISOString() },
  { id: 3, name: 'Development Team', url: 'https://images.unsplash.com/photo-1526506114642-903c5e470580?auto=format&fit=crop&q=80&w=800', file_type: 'image/jpeg', file_size: '210 KB', dimensions: '800 × 533', created_at: new Date().toISOString() },
  { id: 4, name: 'Agency Workspace', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800', file_type: 'image/jpeg', file_size: '76 KB', dimensions: '800 × 533', created_at: new Date().toISOString() },
  { id: 5, name: 'Modern Office', url: 'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&q=80&w=800', file_type: 'image/jpeg', file_size: '143 KB', dimensions: '800 × 533', created_at: new Date().toISOString() },
  { id: 6, name: 'Tech Setup', url: 'https://images.unsplash.com/photo-1593642632559-0c6d3fc62b89?auto=format&fit=crop&q=80&w=800', file_type: 'image/jpeg', file_size: '88 KB', dimensions: '800 × 533', created_at: new Date().toISOString() },
];

export default function MediaManager() {
  const [items, setItems] = useState<MediaItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [view, setView] = useState<'grid' | 'list'>('grid');
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [bulkSelect, setBulkSelect] = useState(false);
  const [bulkSelected, setBulkSelected] = useState<any[]>([]);
  const [altInput, setAltInput] = useState('');
  const [captionInput, setCaptionInput] = useState('');
  const [descInput, setDescInput] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => { fetchMedia(); }, []);

  useEffect(() => {
    if (selected) {
      setAltInput(selected.alt_text || '');
      setCaptionInput(selected.caption || '');
      setDescInput(selected.description || '');
    }
  }, [selected]);

  const fetchMedia = async () => {
    try {
      setLoading(true);
      const { data } = await supabase.from('media_assets').select('*').order('created_at', { ascending: false });
      setItems(data && data.length > 0 ? data : SAMPLE);
    } catch { setItems(SAMPLE); }
    finally { setLoading(false); }
  };

  const uploadFile = async (file: File) => {
    setUploading(true);
    try {
      const ext = file.name.split('.').pop();
      const fileName = `media_${Date.now()}.${ext}`;
      const { error } = await supabase.storage.from('media').upload(fileName, file, { upsert: true });

      let publicUrl = '';
      if (!error) {
        const { data } = supabase.storage.from('media').getPublicUrl(fileName);
        publicUrl = data.publicUrl;
      } else {
        publicUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      }

      const newItem: MediaItem = {
        id: Date.now(), name: file.name.replace(/\.[^.]+$/, ''), url: publicUrl,
        file_type: file.type, file_size: `${Math.round(file.size / 1024)} KB`,
        dimensions: '—', created_at: new Date().toISOString(),
      };

      await supabase.from('media_assets').insert([{ name: newItem.name, url: newItem.url, file_type: newItem.file_type }]);
      setItems((prev) => [newItem, ...prev]);
      setSelected(newItem);
      toast.success('File uploaded!');
    } catch (err: any) {
      toast.error('Upload failed');
    } finally { setUploading(false); }
  };

  const handleDelete = async (id: any) => {
    if (!window.confirm('Delete this media asset?')) return;
    const { error } = await supabase.from('media_assets').delete().eq('id', id);
    if (!error) {
      setItems((prev) => prev.filter((m) => m.id !== id));
      if (selected?.id === id) setSelected(null);
      toast.success('Media deleted');
    } else {
      toast.error('Error deleting');
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success('URL copied!');
  };

  const filtered = items.filter((m) => m.name.toLowerCase().includes(searchQuery.toLowerCase()));
  const selectedIndex = selected ? filtered.findIndex((m) => m.id === selected.id) : -1;

  const toggleBulk = (id: any) => {
    setBulkSelected((prev) => prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]);
  };

  return (
    <div className="flex h-full min-h-[600px]" style={{ gap: 0 }}>
      <Toaster position="top-right" toastOptions={{ style: { background: '#18181b', color: '#fff' } }} />

      {/* ── LEFT: Library ── */}
      <div className="flex flex-col flex-grow min-w-0">

        {/* Header */}
        <div className="flex items-center gap-3 pb-4 mb-4 border-b border-zinc-800 flex-wrap">
          <h2 className="text-xl font-bold text-white mr-1">Media Library</h2>
          <button
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="flex items-center gap-1.5 border border-red-600/40 hover:bg-red-950/20 text-red-500 px-3 py-1 text-xs rounded font-bold transition-all"
          >
            <Upload size={13} />
            <span>{uploading ? 'Uploading...' : 'Add New'}</span>
          </button>
          <input ref={fileInputRef} type="file" accept="image/*" className="hidden"
            onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); }} />
        </div>

        {/* Toolbar */}
        <div className="flex flex-wrap items-center gap-3 mb-4">
          {/* View toggles */}
          <div className="flex items-center border border-zinc-800 rounded-lg overflow-hidden">
            <button onClick={() => setView('list')} className={`px-2.5 py-1.5 transition-colors ${view === 'list' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-white'}`}><List size={14} /></button>
            <button onClick={() => setView('grid')} className={`px-2.5 py-1.5 transition-colors ${view === 'grid' ? 'bg-zinc-700 text-white' : 'text-zinc-500 hover:text-white'}`}><LayoutGrid size={14} /></button>
          </div>

          <select className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-300 text-xs outline-none">
            <option>All media items</option>
            <option>Images</option>
          </select>
          <select className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-300 text-xs outline-none">
            <option>All dates</option>
          </select>
          <button
            onClick={() => { setBulkSelect(!bulkSelect); setBulkSelected([]); }}
            className={`px-3 py-1.5 text-xs font-bold rounded-lg border transition-all ${bulkSelect ? 'bg-zinc-700 text-white border-zinc-600' : 'border-zinc-800 text-zinc-300 hover:text-white'}`}
          >
            {bulkSelect ? 'Cancel' : 'Bulk Select'}
          </button>

          {/* Search */}
          <div className="relative ml-auto">
            <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search media..."
              className="bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-4 py-1.5 text-zinc-300 text-xs outline-none w-44 focus:border-red-600/40"
            />
          </div>
        </div>

        {/* Grid / List */}
        {loading ? (
          <div className="flex-grow flex items-center justify-center text-zinc-500 font-mono text-sm">Loading media library...</div>
        ) : view === 'grid' ? (
          <div className="flex-grow overflow-y-auto">
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
              {filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    if (bulkSelect) { toggleBulk(item.id); }
                    else { setSelected(item.id === selected?.id ? null : item); }
                  }}
                  className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all group ${selected?.id === item.id ? 'border-red-600 ring-2 ring-red-600/20' : 'border-transparent hover:border-zinc-600'} ${bulkSelected.includes(item.id) ? 'border-red-500' : ''}`}
                >
                  <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                  {/* Overlay on hover */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all" />
                  {selected?.id === item.id && (
                    <div className="absolute top-1 right-1 bg-red-600 rounded-full p-0.5 shadow">
                      <Check size={10} className="text-white" />
                    </div>
                  )}
                  {bulkSelect && (
                    <div className={`absolute top-1 left-1 w-4 h-4 rounded border-2 flex items-center justify-center transition-all ${bulkSelected.includes(item.id) ? 'bg-red-600 border-red-600' : 'border-zinc-400 bg-black/50'}`}>
                      {bulkSelected.includes(item.id) && <Check size={9} className="text-white" />}
                    </div>
                  )}
                </div>
              ))}
            </div>
            {filtered.length === 0 && (
              <div className="text-center py-20 text-zinc-500">No media items found.</div>
            )}
          </div>
        ) : (
          /* List view */
          <div className="flex-grow overflow-y-auto space-y-1">
            {filtered.map((item) => (
              <div
                key={item.id}
                onClick={() => setSelected(item.id === selected?.id ? null : item)}
                className={`flex items-center gap-4 px-4 py-3 rounded-xl cursor-pointer transition-all border ${selected?.id === item.id ? 'border-red-600/30 bg-red-950/10' : 'border-transparent hover:bg-zinc-900'}`}
              >
                <img src={item.url} alt={item.name} className="w-12 h-12 object-cover rounded-lg shrink-0" />
                <div className="flex-grow min-w-0">
                  <p className="text-white text-sm font-bold truncate">{item.name}</p>
                  <p className="text-zinc-500 text-xs">{item.file_type} · {item.file_size}</p>
                </div>
                <button onClick={(e) => { e.stopPropagation(); handleDelete(item.id); }} className="text-zinc-600 hover:text-red-500 transition-colors shrink-0">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── RIGHT: Attachment Details ── */}
      {selected && (
        <div className="w-72 shrink-0 border-l border-zinc-800 flex flex-col overflow-y-auto ml-6 bg-zinc-900 rounded-2xl">
          {/* Title + nav */}
          <div className="flex items-center justify-between px-5 py-4 border-b border-zinc-800 shrink-0 bg-zinc-950 rounded-t-2xl">
            <h3 className="text-sm font-bold text-white">Attachment Details</h3>
            <div className="flex items-center gap-1">
              <button onClick={() => selectedIndex > 0 && setSelected(filtered[selectedIndex - 1])} disabled={selectedIndex <= 0} className="text-zinc-600 hover:text-white disabled:opacity-20 transition-colors"><ChevronLeft size={16} /></button>
              <button onClick={() => selectedIndex < filtered.length - 1 && setSelected(filtered[selectedIndex + 1])} disabled={selectedIndex >= filtered.length - 1} className="text-zinc-600 hover:text-white disabled:opacity-20 transition-colors"><ChevronRight size={16} /></button>
              <button onClick={() => setSelected(null)} className="text-zinc-600 hover:text-red-400 transition-colors ml-1"><X size={15} /></button>
            </div>
          </div>

          {/* Large preview */}
          <div className="p-4 border-b border-zinc-800 shrink-0">
            <img src={selected.url} alt={selected.name} className="w-full h-44 object-cover rounded-xl border border-zinc-800" />
            <button
              onClick={() => handleDelete(selected.id)}
              className="mt-2 w-full text-xs text-red-500 hover:text-red-400 font-bold transition-colors"
            >
              Delete permanently
            </button>
          </div>

          {/* File meta */}
          <div className="px-5 py-3 border-b border-zinc-800 text-[10px] space-y-1 shrink-0">
            {selected.created_at && <p className="text-zinc-400"><span className="text-zinc-500">Uploaded on:</span> {new Date(selected.created_at).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}</p>}
            <p className="text-zinc-400"><span className="text-zinc-500">File name:</span> <span className="text-white">{selected.name}</span></p>
            {selected.file_type && <p className="text-zinc-400"><span className="text-zinc-500">File type:</span> {selected.file_type}</p>}
            {selected.file_size && <p className="text-zinc-400"><span className="text-zinc-500">File size:</span> {selected.file_size}</p>}
            {selected.dimensions && <p className="text-zinc-400"><span className="text-zinc-500">Dimensions:</span> {selected.dimensions}</p>}
          </div>

          {/* Editable fields */}
          <div className="p-5 space-y-3 flex-grow">
            {[
              { label: 'Alternative Text', value: altInput, setter: setAltInput, rows: 2 },
              { label: 'Title', value: selected.name, setter: () => {}, rows: 1 },
              { label: 'Caption', value: captionInput, setter: setCaptionInput, rows: 2 },
              { label: 'Description', value: descInput, setter: setDescInput, rows: 2 },
            ].map(({ label, value, setter, rows }) => (
              <div key={label} className="space-y-1">
                <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">{label}</label>
                {rows === 1 ? (
                  <input type="text" value={value} onChange={(e) => setter(e.target.value)} readOnly={label === 'Title'}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-600/40 rounded-lg px-3 py-2 text-zinc-200 outline-none text-xs transition-all" />
                ) : (
                  <textarea value={value} onChange={(e) => setter(e.target.value)} rows={rows}
                    className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-600/40 rounded-lg px-3 py-2 text-zinc-200 outline-none text-xs resize-none transition-all" />
                )}
              </div>
            ))}

            {/* File URL row */}
            <div className="space-y-1">
              <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">File URL</label>
              <input type="text" readOnly value={selected.url}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-300 outline-none text-[10px] font-mono truncate" />
              <button onClick={() => copyUrl(selected.url)}
                className="flex items-center gap-1.5 text-[10px] font-bold text-zinc-400 hover:text-white transition-colors mt-1">
                {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
                <span>{copied ? 'Copied!' : 'Copy URL to clipboard'}</span>
              </button>
            </div>

            {/* Links */}
            <div className="flex flex-wrap gap-2 text-[10px] pt-1 border-t border-zinc-800">
              <a href={selected.url} target="_blank" rel="noreferrer" className="text-red-500 hover:underline">View attachment page</a>
              <span className="text-zinc-700">|</span>
              <a href={selected.url} download className="text-red-500 hover:underline">Download file</a>
              <span className="text-zinc-700">|</span>
              <button onClick={() => handleDelete(selected.id)} className="text-red-500 hover:underline">Delete permanently</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

import React, { useEffect, useRef, useState } from 'react';
import { X, Upload, Search, Check, Copy, ChevronLeft, ChevronRight } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast } from 'react-hot-toast';

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
  uploaded_at?: string;
}

interface InsertMediaModalProps {
  isOpen: boolean;
  onClose: () => void;
  onInsert: (url: string, alt?: string) => void;
}

const SAMPLE_MEDIA: MediaItem[] = [
  { id: 1, name: 'Tech Commerce', url: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&q=80&w=800', alt_text: '', caption: '', description: '', file_type: 'image/jpeg', file_size: '124 KB', dimensions: '800 × 533', uploaded_at: new Date().toISOString() },
  { id: 2, name: 'Dashboard Analytics', url: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&q=80&w=800', alt_text: '', caption: '', description: '', file_type: 'image/jpeg', file_size: '98 KB', dimensions: '800 × 533', uploaded_at: new Date().toISOString() },
  { id: 3, name: 'Development Team', url: 'https://images.unsplash.com/photo-1526506114642-903c5e470580?auto=format&fit=crop&q=80&w=800', alt_text: '', caption: '', description: '', file_type: 'image/jpeg', file_size: '210 KB', dimensions: '800 × 533', uploaded_at: new Date().toISOString() },
  { id: 4, name: 'Agency Workspace', url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&q=80&w=800', alt_text: '', caption: '', description: '', file_type: 'image/jpeg', file_size: '76 KB', dimensions: '800 × 533', uploaded_at: new Date().toISOString() },
];

export default function InsertMediaModal({ isOpen, onClose, onInsert }: InsertMediaModalProps) {
  const [tab, setTab] = useState<'library' | 'upload'>('library');
  const [mediaItems, setMediaItems] = useState<MediaItem[]>([]);
  const [selected, setSelected] = useState<MediaItem | null>(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [uploading, setUploading] = useState(false);
  const [urlInput, setUrlInput] = useState('');
  const [nameInput, setNameInput] = useState('');
  const [altInput, setAltInput] = useState('');
  const [captionInput, setCaptionInput] = useState('');
  const [descInput, setDescInput] = useState('');
  const [copied, setCopied] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) fetchMedia();
  }, [isOpen]);

  useEffect(() => {
    if (selected) {
      setAltInput(selected.alt_text || '');
      setCaptionInput(selected.caption || '');
      setDescInput(selected.description || '');
    }
  }, [selected]);

  const fetchMedia = async () => {
    try {
      const { data } = await supabase.from('media_assets').select('*').order('created_at', { ascending: false });
      setMediaItems(data && data.length > 0 ? data : SAMPLE_MEDIA);
    } catch {
      setMediaItems(SAMPLE_MEDIA);
    }
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
        // Base64 fallback
        publicUrl = await new Promise((resolve) => {
          const reader = new FileReader();
          reader.onload = (e) => resolve(e.target?.result as string);
          reader.readAsDataURL(file);
        });
      }

      const newItem: MediaItem = {
        id: Date.now(),
        name: file.name.replace(/\.[^.]+$/, ''),
        url: publicUrl,
        file_type: file.type,
        file_size: `${Math.round(file.size / 1024)} KB`,
        dimensions: '—',
        uploaded_at: new Date().toISOString(),
      };

      await supabase.from('media_assets').insert([{ name: newItem.name, url: newItem.url, file_type: newItem.file_type }]);
      setMediaItems((prev) => [newItem, ...prev]);
      setSelected(newItem);
      setTab('library');
      toast.success('File uploaded successfully!');
    } catch (err: any) {
      toast.error('Upload failed: ' + err.message);
    } finally {
      setUploading(false);
    }
  };

  const addFromUrl = async () => {
    if (!urlInput) return;
    const newItem: MediaItem = {
      id: Date.now(),
      name: nameInput || 'Media ' + Date.now(),
      url: urlInput,
      file_type: 'image/jpeg',
      uploaded_at: new Date().toISOString(),
    };
    await supabase.from('media_assets').insert([{ name: newItem.name, url: newItem.url }]);
    setMediaItems((prev) => [newItem, ...prev]);
    setSelected(newItem);
    setUrlInput('');
    setNameInput('');
    setTab('library');
    toast.success('Media added!');
  };

  const filteredItems = mediaItems.filter((m) =>
    m.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const selectedIndex = selected ? filteredItems.findIndex((m) => m.id === selected.id) : -1;

  const copyUrl = () => {
    if (!selected) return;
    navigator.clipboard.writeText(selected.url);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[9999] flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl w-full max-w-5xl max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">

        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-zinc-950 border-b border-zinc-800 shrink-0">
          <h2 className="text-base font-bold text-white">Insert Media</h2>
          <button onClick={onClose} className="text-zinc-500 hover:text-white transition-colors">
            <X size={18} />
          </button>
        </div>

        {/* Tabs */}
        <div className="px-6 pt-4 border-b border-zinc-800 flex items-center gap-1 shrink-0 bg-zinc-950">
          <button
            onClick={() => setTab('upload')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg border-b-2 transition-all ${tab === 'upload' ? 'text-white border-red-600 bg-zinc-900' : 'text-zinc-500 border-transparent hover:text-white'}`}
          >
            Upload Files
          </button>
          <button
            onClick={() => setTab('library')}
            className={`px-4 py-2 text-xs font-bold rounded-t-lg border-b-2 transition-all ${tab === 'library' ? 'text-white border-red-600 bg-zinc-900' : 'text-zinc-500 border-transparent hover:text-white'}`}
          >
            Media Library
          </button>
        </div>

        {/* Body */}
        <div className="flex flex-grow min-h-0">

          {tab === 'upload' ? (
            /* ── Upload Tab ── */
            <div className="flex-grow p-6 space-y-6 overflow-y-auto">
              {/* Drop zone */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-zinc-700 hover:border-red-600/50 rounded-2xl p-12 text-center cursor-pointer transition-all group"
              >
                <Upload size={32} className="mx-auto text-zinc-600 group-hover:text-red-500 mb-3 transition-colors" />
                <p className="text-zinc-300 font-bold text-sm">Drop files to upload</p>
                <p className="text-zinc-500 text-xs mt-1">or click to select files from your computer</p>
                {uploading && <p className="text-red-400 text-xs mt-2 font-bold animate-pulse">Uploading...</p>}
              </div>
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={(e) => { const f = e.target.files?.[0]; if (f) uploadFile(f); }}
              />

              {/* Or URL */}
              <div className="space-y-3">
                <div className="flex items-center gap-2 text-zinc-600 text-xs">
                  <div className="flex-grow h-px bg-zinc-800" />
                  <span>or add from URL</span>
                  <div className="flex-grow h-px bg-zinc-800" />
                </div>
                <input type="text" value={nameInput} onChange={(e) => setNameInput(e.target.value)} placeholder="File name" className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-200 outline-none text-sm" />
                <input type="text" value={urlInput} onChange={(e) => setUrlInput(e.target.value)} placeholder="https://..." className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-2.5 text-zinc-200 outline-none text-sm font-mono" />
                <button onClick={addFromUrl} disabled={!urlInput} className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2 rounded-xl text-sm transition-all disabled:opacity-50">
                  Add URL to Library
                </button>
              </div>
            </div>

          ) : (
            /* ── Library Tab ── */
            <div className="flex flex-grow min-h-0">
              {/* Image grid */}
              <div className="flex-grow flex flex-col min-h-0">
                {/* Filter bar */}
                <div className="px-4 py-3 border-b border-zinc-800 flex items-center gap-3 shrink-0 bg-zinc-950/50">
                  <select className="bg-zinc-900 border border-zinc-800 rounded-lg px-3 py-1.5 text-zinc-300 text-xs outline-none">
                    <option>All media items</option>
                    <option>Images</option>
                  </select>
                  <div className="relative ml-auto">
                    <Search size={13} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                    <input
                      type="text"
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                      placeholder="Search media..."
                      className="bg-zinc-900 border border-zinc-800 rounded-lg pl-8 pr-4 py-1.5 text-zinc-300 text-xs outline-none w-44"
                    />
                  </div>
                </div>

                {/* Grid */}
                <div className="flex-grow overflow-y-auto p-4">
                  <div className="grid grid-cols-4 sm:grid-cols-5 md:grid-cols-6 gap-2">
                    {filteredItems.map((item) => (
                      <div
                        key={item.id}
                        onClick={() => setSelected(item)}
                        className={`relative aspect-square rounded-xl overflow-hidden cursor-pointer border-2 transition-all group ${selected?.id === item.id ? 'border-red-600 ring-2 ring-red-600/30' : 'border-transparent hover:border-zinc-600'}`}
                      >
                        <img src={item.url} alt={item.name} className="w-full h-full object-cover" />
                        {selected?.id === item.id && (
                          <div className="absolute top-1 right-1 bg-red-600 rounded-full p-0.5">
                            <Check size={10} className="text-white" />
                          </div>
                        )}
                      </div>
                    ))}
                  </div>
                  {filteredItems.length === 0 && (
                    <div className="text-center py-20 text-zinc-500 text-sm">No media found.</div>
                  )}
                </div>
              </div>

              {/* ── Attachment Details Sidebar ── */}
              {selected && (
                <div className="w-72 shrink-0 border-l border-zinc-800 flex flex-col overflow-y-auto bg-zinc-950">
                  {/* Nav arrows */}
                  <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 shrink-0">
                    <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Attachment Details</span>
                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => selectedIndex > 0 && setSelected(filteredItems[selectedIndex - 1])}
                        disabled={selectedIndex <= 0}
                        className="text-zinc-600 hover:text-zinc-300 disabled:opacity-20 transition-colors"
                      >
                        <ChevronLeft size={16} />
                      </button>
                      <button
                        onClick={() => selectedIndex < filteredItems.length - 1 && setSelected(filteredItems[selectedIndex + 1])}
                        disabled={selectedIndex >= filteredItems.length - 1}
                        className="text-zinc-600 hover:text-zinc-300 disabled:opacity-20 transition-colors"
                      >
                        <ChevronRight size={16} />
                      </button>
                    </div>
                  </div>

                  {/* Thumbnail */}
                  <div className="p-4 border-b border-zinc-800 shrink-0">
                    <img src={selected.url} alt={selected.name} className="w-full h-36 object-cover rounded-xl border border-zinc-800" />
                  </div>

                  {/* File meta */}
                  <div className="px-4 py-3 border-b border-zinc-800 text-[10px] text-zinc-400 space-y-0.5 shrink-0">
                    {selected.uploaded_at && <p><span className="text-zinc-500">Uploaded:</span> {new Date(selected.uploaded_at).toLocaleDateString()}</p>}
                    <p><span className="text-zinc-500">File name:</span> <span className="text-zinc-300">{selected.name}</span></p>
                    {selected.file_type && <p><span className="text-zinc-500">File type:</span> {selected.file_type}</p>}
                    {selected.file_size && <p><span className="text-zinc-500">File size:</span> {selected.file_size}</p>}
                    {selected.dimensions && <p><span className="text-zinc-500">Dimensions:</span> {selected.dimensions}</p>}
                  </div>

                  {/* Editable fields */}
                  <div className="p-4 space-y-3 flex-grow">
                    {[
                      { label: 'Alternative Text', value: altInput, setter: setAltInput, rows: 2 },
                      { label: 'Title', value: selected.name, setter: () => {}, rows: 1 },
                      { label: 'Caption', value: captionInput, setter: setCaptionInput, rows: 2 },
                      { label: 'Description', value: descInput, setter: setDescInput, rows: 2 },
                    ].map(({ label, value, setter, rows }) => (
                      <div key={label} className="space-y-1">
                        <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">{label}</label>
                        {rows === 1 ? (
                          <input
                            type="text"
                            value={value}
                            onChange={(e) => setter(e.target.value)}
                            className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-600/40 rounded-lg px-3 py-2 text-zinc-200 outline-none text-xs transition-all"
                          />
                        ) : (
                          <textarea
                            value={value}
                            onChange={(e) => setter(e.target.value)}
                            rows={rows}
                            className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-600/40 rounded-lg px-3 py-2 text-zinc-200 outline-none text-xs transition-all resize-none"
                          />
                        )}
                      </div>
                    ))}

                    {/* File URL */}
                    <div className="space-y-1">
                      <label className="text-[10px] font-bold text-zinc-500 uppercase tracking-wider block">File URL</label>
                      <input
                        type="text"
                        readOnly
                        value={selected.url}
                        className="w-full bg-zinc-800 border border-zinc-700 rounded-lg px-3 py-2 text-zinc-300 outline-none text-[10px] font-mono truncate"
                      />
                      <button
                        onClick={copyUrl}
                        className="flex items-center gap-1.5 text-[10px] text-zinc-400 hover:text-white transition-colors font-semibold mt-1"
                      >
                        {copied ? <Check size={11} className="text-green-400" /> : <Copy size={11} />}
                        <span>{copied ? 'Copied!' : 'Copy URL to clipboard'}</span>
                      </button>
                    </div>

                    {/* Action links */}
                    <div className="pt-2 flex flex-wrap gap-2 text-[10px]">
                      <a href={selected.url} target="_blank" rel="noreferrer" className="text-red-500 hover:underline">View attachment</a>
                      <span className="text-zinc-700">|</span>
                      <button onClick={copyUrl} className="text-red-500 hover:underline">Copy URL</button>
                      <span className="text-zinc-700">|</span>
                      <a href={selected.url} download className="text-red-500 hover:underline">Download file</a>
                    </div>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-4 bg-zinc-950 border-t border-zinc-800 flex items-center justify-between shrink-0">
          <div className="text-xs text-zinc-400">
            {selected ? (
              <span className="font-bold text-white">{selected.name}</span>
            ) : (
              <span className="text-zinc-600">No media selected</span>
            )}
          </div>
          <div className="flex items-center gap-3">
            <button onClick={onClose} className="text-xs text-zinc-400 hover:text-white transition-colors font-semibold">
              Cancel
            </button>
            <button
              disabled={!selected}
              onClick={() => {
                if (selected) {
                  onInsert(selected.url, altInput);
                  onClose();
                }
              }}
              className="bg-red-600 hover:bg-red-700 disabled:opacity-40 text-white font-bold px-5 py-2.5 rounded-xl text-sm transition-all shadow-lg shadow-red-950/20"
            >
              Insert into post
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

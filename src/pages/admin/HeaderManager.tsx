import React, { useEffect, useRef, useState } from 'react';
import { Plus, Trash2, GripVertical, Save, Link as LinkIcon, Image, Phone, Upload } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast, Toaster } from 'react-hot-toast';

interface NavLink {
  label: string;
  href: string;
}

const DEFAULT_CONTENT = {
  logo_text: 'Tech',
  logo_highlight: 'FNM',
  logo_image: '/image/agency-assets/projects/0.569918561129375.png',
  nav_links: [
    { label: 'Home', href: '/' },
    { label: 'About Us', href: '/about' },
    { label: 'Services', href: '/services' },
    { label: 'Portfolio', href: '/portfolio' },
    { label: 'FAQ', href: '/faq' },
    { label: 'Contact Us', href: '/contact' },
    { label: 'Request Service', href: '/request-service' },
  ],
  cta_text: '0313-9023118',
  cta_link: 'tel:0313-9023118',
};

export default function HeaderManager() {
  const [content, setContent] = useState<any>(DEFAULT_CONTENT);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // New menu item form
  const [newLabel, setNewLabel] = useState('');
  const [newHref, setNewHref] = useState('');

  useEffect(() => {
    fetchHeader();
  }, []);

  const fetchHeader = async () => {
    try {
      setLoading(true);
      const { data } = await supabase
        .from('pages_content')
        .select('content')
        .eq('id', 'site_header')
        .maybeSingle();
      if (data && data.content && Object.keys(data.content).length > 0) {
        setContent({ ...DEFAULT_CONTENT, ...data.content });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async () => {
    try {
      setSaving(true);

      // First try UPDATE (row may already exist)
      const { data: updated, error: updateError } = await supabase
        .from('pages_content')
        .update({ content })
        .eq('id', 'site_header')
        .select();

      if (updateError) throw updateError;

      // If no row was updated, INSERT a new one
      if (!updated || updated.length === 0) {
        const { error: insertError } = await supabase
          .from('pages_content')
          .insert([{ id: 'site_header', section_name: 'Header Settings', content }]);

        if (insertError) throw insertError;
      }

      toast.success('Header settings saved successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Error saving header settings');
    } finally {
      setSaving(false);
    }
  };

  const uploadLogoImage = async (file: File) => {
    try {
      setUploading(true);
      const ext = file.name.split('.').pop();
      const fileName = `logo_${Date.now()}.${ext}`;
      const { error: uploadError } = await supabase.storage
        .from('media')
        .upload(fileName, file, { upsert: true });

      if (uploadError) {
        // Fallback: use base64 data URL if storage fails
        const reader = new FileReader();
        reader.onload = (e) => {
          const dataUrl = e.target?.result as string;
          setContent((prev: any) => ({ ...prev, logo_image: dataUrl }));
          toast.success('Logo loaded (base64 mode)');
        };
        reader.readAsDataURL(file);
      } else {
        const { data } = supabase.storage.from('media').getPublicUrl(fileName);
        setContent((prev: any) => ({ ...prev, logo_image: data.publicUrl }));
        toast.success('Logo uploaded successfully!');
      }
    } catch (err: any) {
      // Always fallback to base64
      const reader = new FileReader();
      reader.onload = (e) => {
        setContent((prev: any) => ({ ...prev, logo_image: e.target?.result as string }));
        toast.success('Logo loaded!');
      };
      reader.readAsDataURL(file);
    } finally {
      setUploading(false);
    }
  };

  const addNavLink = () => {
    if (!newLabel || !newHref) return;
    setContent({
      ...content,
      nav_links: [...(content.nav_links || []), { label: newLabel, href: newHref }],
    });
    setNewLabel('');
    setNewHref('');
  };

  const removeNavLink = (index: number) => {
    const updated = [...(content.nav_links || [])];
    updated.splice(index, 1);
    setContent({ ...content, nav_links: updated });
  };

  const updateNavLink = (index: number, field: 'label' | 'href', value: string) => {
    const updated = [...(content.nav_links || [])];
    updated[index] = { ...updated[index], [field]: value };
    setContent({ ...content, nav_links: updated });
  };

  const moveLink = (index: number, direction: -1 | 1) => {
    const updated = [...(content.nav_links || [])];
    const target = index + direction;
    if (target < 0 || target >= updated.length) return;
    [updated[index], updated[target]] = [updated[target], updated[index]];
    setContent({ ...content, nav_links: updated });
  };

  if (loading) return <div className="text-center py-20 text-zinc-500 font-mono">Loading header configuration...</div>;

  return (
    <div className="space-y-8">
      <Toaster position="top-right" toastOptions={{ style: { background: '#18181b', color: '#fff' } }} />

      {/* Page title + Save */}
      <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white">Header Management</h2>
          <p className="text-xs text-zinc-500">Configure logo, navigation menu items, and the CTA button.</p>
        </div>
        <button
          onClick={handleSave}
          disabled={saving}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-red-950/20 text-sm disabled:opacity-70"
        >
          <Save size={15} />
          <span>{saving ? 'Saving...' : 'Save Changes'}</span>
        </button>
      </div>

      {/* Live Preview */}
      <div className="bg-black border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="px-4 py-2 bg-zinc-950 border-b border-zinc-800">
          <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider">Live Preview</span>
        </div>
        <div className="px-6 py-4 flex items-center justify-between gap-4">
          {/* Logo preview */}
          <div className="flex items-center gap-2">
            {content.logo_image && (
              <img
                src={content.logo_image}
                alt="Logo"
                className="h-9 w-auto object-contain"
                onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
              />
            )}
            <span className="text-white font-bold text-lg">
              {content.logo_text}
              <span className="text-red-600 ml-0.5 font-extrabold">{content.logo_highlight}</span>
            </span>
          </div>

          {/* Nav preview */}
          <div className="hidden md:flex items-center gap-4 text-xs font-medium">
            {(content.nav_links || []).slice(0, 6).map((link: NavLink, i: number) => (
              <span key={i} className={`${i === 0 ? 'text-red-500' : 'text-zinc-400'}`}>{link.label}</span>
            ))}
            {(content.nav_links || []).length > 6 && <span className="text-zinc-600">+{(content.nav_links || []).length - 6} more</span>}
          </div>

          {/* CTA preview */}
          <div className="flex items-center gap-2 bg-red-600 text-white px-4 py-2 rounded-full text-xs font-bold shrink-0">
            <Phone size={13} />
            <span>{content.cta_text}</span>
          </div>
        </div>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">

        {/* LEFT: Menu structure */}
        <div className="xl:col-span-2 space-y-6">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
            <div className="px-6 py-4 bg-zinc-950 border-b border-zinc-800">
              <h3 className="font-bold text-white text-sm">Menu Structure</h3>
              <p className="text-xs text-zinc-500 mt-0.5">Drag items or use arrows to reorder. Click labels to edit.</p>
            </div>

            {/* Menu items list */}
            <div className="divide-y divide-zinc-850">
              {(content.nav_links || []).map((link: NavLink, index: number) => (
                <div key={index} className="flex items-center gap-3 px-6 py-4 group hover:bg-zinc-850/20 transition-colors">
                  {/* Drag handle / arrows */}
                  <div className="flex flex-col gap-0.5 shrink-0">
                    <button
                      onClick={() => moveLink(index, -1)}
                      disabled={index === 0}
                      className="text-zinc-700 hover:text-zinc-400 disabled:opacity-20 transition-colors text-[10px] leading-none"
                    >▲</button>
                    <GripVertical size={14} className="text-zinc-700 mx-auto" />
                    <button
                      onClick={() => moveLink(index, 1)}
                      disabled={index === (content.nav_links || []).length - 1}
                      className="text-zinc-700 hover:text-zinc-400 disabled:opacity-20 transition-colors text-[10px] leading-none"
                    >▼</button>
                  </div>

                  {/* Label input */}
                  <div className="flex-grow grid grid-cols-2 gap-3">
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider block">Navigation Label</label>
                      <input
                        type="text"
                        value={link.label}
                        onChange={(e) => updateNavLink(index, 'label', e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-600/40 rounded-lg px-3 py-2 text-zinc-200 outline-none text-sm transition-all"
                      />
                    </div>
                    <div className="space-y-0.5">
                      <label className="text-[10px] font-bold text-zinc-600 uppercase tracking-wider block">URL / Path</label>
                      <div className="relative">
                        <LinkIcon size={12} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-600" />
                        <input
                          type="text"
                          value={link.href}
                          onChange={(e) => updateNavLink(index, 'href', e.target.value)}
                          className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-600/40 rounded-lg pl-8 pr-3 py-2 text-zinc-200 outline-none text-sm transition-all font-mono"
                        />
                      </div>
                    </div>
                  </div>

                  {/* Delete */}
                  <button
                    onClick={() => removeNavLink(index)}
                    className="bg-zinc-950 border border-zinc-850 hover:bg-zinc-850 hover:text-red-500 text-zinc-600 p-2 rounded-xl transition-all shrink-0"
                  >
                    <Trash2 size={14} />
                  </button>
                </div>
              ))}
            </div>

            {/* Add new item */}
            <div className="px-6 py-5 bg-zinc-950/50 border-t border-zinc-850 space-y-3">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Add Menu Item</span>
              <div className="flex flex-col sm:flex-row gap-3">
                <input
                  type="text"
                  value={newLabel}
                  onChange={(e) => setNewLabel(e.target.value)}
                  placeholder="Label (e.g. Blog)"
                  className="flex-grow bg-zinc-950 border border-zinc-850 focus:border-red-600/40 rounded-xl px-4 py-2.5 text-zinc-200 outline-none text-sm transition-all"
                />
                <input
                  type="text"
                  value={newHref}
                  onChange={(e) => setNewHref(e.target.value)}
                  placeholder="Path (e.g. /blog)"
                  className="flex-grow bg-zinc-950 border border-zinc-850 focus:border-red-600/40 rounded-xl px-4 py-2.5 text-zinc-200 outline-none text-sm transition-all font-mono"
                />
                <button
                  onClick={addNavLink}
                  disabled={!newLabel || !newHref}
                  className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2.5 rounded-xl transition-all text-sm shrink-0 disabled:opacity-50"
                >
                  <Plus size={15} />
                  <span>Add to Menu</span>
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: Logo + CTA Settings */}
        <div className="space-y-4">

          {/* Logo Settings */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
            <div className="px-5 py-4 bg-zinc-950 border-b border-zinc-800">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Image size={15} className="text-red-500" />
                Logo Settings
              </h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-2">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Logo Image</label>

                {/* Image preview / placeholder */}
                <div className="w-full bg-zinc-800/50 border border-zinc-800 rounded-xl flex items-center justify-center h-24 overflow-hidden">
                  {content.logo_image ? (
                    <img
                      src={content.logo_image}
                      alt="Logo preview"
                      className="h-full w-full object-contain p-2"
                      onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                    />
                  ) : (
                    <span className="text-zinc-500 text-xs">No logo selected</span>
                  )}
                </div>

                {/* Hidden file input */}
                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) uploadLogoImage(file);
                  }}
                />

                {/* Upload button */}
                <button
                  type="button"
                  onClick={() => fileInputRef.current?.click()}
                  disabled={uploading}
                  className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:opacity-60 text-white text-xs font-bold px-4 py-2.5 rounded-xl transition-all"
                >
                  <Upload size={13} />
                  <span>{uploading ? 'Uploading...' : 'Upload Logo Image'}</span>
                </button>

                {/* Or paste URL */}
                <div className="flex items-center gap-2 text-zinc-600 text-[10px]">
                  <div className="flex-grow h-px bg-zinc-800" />
                  <span>or paste URL</span>
                  <div className="flex-grow h-px bg-zinc-800" />
                </div>
                <input
                  type="text"
                  value={content.logo_image || ''}
                  onChange={(e) => setContent({ ...content, logo_image: e.target.value })}
                  placeholder="/image/logo.png or https://..."
                  className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-600/40 rounded-xl px-3 py-2.5 text-zinc-200 outline-none text-xs transition-all font-mono"
                />
              </div>


              <div className="grid grid-cols-2 gap-3">
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Text (white)</label>
                  <input
                    type="text"
                    value={content.logo_text}
                    onChange={(e) => setContent({ ...content, logo_text: e.target.value })}
                    placeholder="Tech"
                    className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-600/40 rounded-xl px-3 py-2.5 text-zinc-200 outline-none text-sm transition-all"
                  />
                </div>
                <div className="space-y-1">
                  <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Highlight (red)</label>
                  <input
                    type="text"
                    value={content.logo_highlight}
                    onChange={(e) => setContent({ ...content, logo_highlight: e.target.value })}
                    placeholder="FNM"
                    className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-600/40 rounded-xl px-3 py-2.5 text-zinc-200 outline-none text-sm transition-all"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* CTA Button Settings */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl overflow-hidden">
            <div className="px-5 py-4 bg-zinc-950 border-b border-zinc-800">
              <h3 className="font-bold text-white text-sm flex items-center gap-2">
                <Phone size={15} className="text-red-500" />
                Header Button (CTA)
              </h3>
            </div>
            <div className="p-5 space-y-4">
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Button Label / Text</label>
                <input
                  type="text"
                  value={content.cta_text}
                  onChange={(e) => setContent({ ...content, cta_text: e.target.value })}
                  placeholder="0313-9023118"
                  className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-600/40 rounded-xl px-4 py-2.5 text-zinc-200 outline-none text-sm transition-all"
                />
              </div>
              <div className="space-y-1">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">Button Link / Action</label>
                <input
                  type="text"
                  value={content.cta_link}
                  onChange={(e) => setContent({ ...content, cta_link: e.target.value })}
                  placeholder="tel:0313-9023118 or /contact"
                  className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-600/40 rounded-xl px-4 py-2.5 text-zinc-200 outline-none text-sm transition-all font-mono"
                />
              </div>

              {/* Live CTA preview */}
              <div className="pt-2">
                <span className="text-[10px] text-zinc-600 uppercase font-bold tracking-wider block mb-2">Preview</span>
                <a
                  href={content.cta_link}
                  className="inline-flex items-center gap-2 bg-red-600 text-white px-5 py-2.5 rounded-full font-bold text-sm shadow-lg shadow-red-950/20"
                  onClick={(e) => e.preventDefault()}
                >
                  <Phone size={14} />
                  <span>{content.cta_text || '0313-9023118'}</span>
                </a>
              </div>
            </div>
          </div>

          {/* Save button (bottom) */}
          <button
            onClick={handleSave}
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-3.5 rounded-xl transition-all shadow-lg shadow-red-950/20 text-sm disabled:opacity-70"
          >
            <Save size={15} />
            <span>{saving ? 'Saving...' : 'Save All Changes'}</span>
          </button>
        </div>

      </div>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import {
  Briefcase,
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Search,
  Check,
  X,
  Eye,
  Save,
  RotateCcw,
  ArrowLeft,
  Calendar,
  User,
  Sparkles,
  Image as ImageIcon,
  Type,
  AlignLeft,
  Globe,
  Upload,
  Layers,
  Code,
  Smartphone,
  PenTool,
  ShoppingCart,
  Share2,
  CheckCircle2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast, Toaster } from 'react-hot-toast';
import SeoSettingsPanel, { SeoSettingsData } from '../../components/admin/SeoSettingsPanel';
import { setCached, CANONICAL_SERVICES } from '../../lib/canonicalData';
import { triggerContentUpdate } from '../../lib/cmsContent';

const AVAILABLE_ICONS = [
  { name: 'Code', icon: Code, label: 'Web / Code' },
  { name: 'Smartphone', icon: Smartphone, label: 'Mobile App' },
  { name: 'PenTool', icon: PenTool, label: 'Design / Writing' },
  { name: 'Globe', icon: Globe, label: 'SEO / Marketing' },
  { name: 'ShoppingCart', icon: ShoppingCart, label: 'E-Commerce' },
  { name: 'Share2', icon: Share2, label: 'Social Media' }
];

const COLOR_PRESETS = [
  { label: 'Red Glow', value: 'bg-red-500/10 text-red-500 border-red-500/30' },
  { label: 'Blue Sky', value: 'bg-blue-500/10 text-blue-400 border-blue-500/30' },
  { label: 'Purple Neon', value: 'bg-purple-500/10 text-purple-400 border-purple-500/30' },
  { label: 'Emerald Mint', value: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30' },
  { label: 'Amber Gold', value: 'bg-amber-500/10 text-amber-400 border-amber-500/30' },
  { label: 'Rose Pink', value: 'bg-rose-500/10 text-rose-400 border-rose-500/30' }
];

interface ServiceItem {
  id: any;
  title: string;
  slug: string;
  description: string;
  icon: string;
  color: string;
  image?: string;
  content?: string;
  author?: string;
  status?: 'published' | 'draft' | 'trash';
  updated_at?: string;
  seo_settings?: SeoSettingsData;
}

export default function ServicesManager() {
  const [services, setServices] = useState<ServiceItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'draft' | 'trash'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  const [bulkAction, setBulkAction] = useState('');

  // Full Editor State
  const [isFullEditing, setIsFullEditing] = useState(false);
  const [editingService, setEditingService] = useState<ServiceItem | null>(null);

  // Quick Edit State
  const [quickEditingId, setQuickEditingId] = useState<any | null>(null);
  const [quickEditData, setQuickEditData] = useState({
    title: '',
    slug: '',
    icon: 'Code',
    status: 'published' as 'published' | 'draft'
  });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('services').select('*').order('id', { ascending: true });
      if (data && data.length > 0) {
        const mapped: ServiceItem[] = data.map((row: any) => ({
          id: row.id,
          title: row.title || 'Untitled Service',
          slug: row.slug || `/services/${(row.title || '').toLowerCase().replace(/\s+/g, '-')}`,
          description: row.description || '',
          icon: row.icon || 'Code',
          color: row.color || 'bg-red-500/10 text-red-500',
          image: row.image || row.featured_image || '',
          content: row.content || '',
          author: row.author || 'admin',
          status: (row.status as any) || 'published',
          updated_at: row.updated_at || new Date().toISOString(),
          seo_settings: row.seo_settings || {
            seoTitle: row.meta_title,
            metaDescription: row.meta_description
          }
        }));
        setServices(mapped);
        setCached('techfnm_services_cache', data);
      } else {
        // Use canonical baseline
        setServices(
          CANONICAL_SERVICES.map((s: any) => ({
            ...s,
            slug: s.slug || `/services/${s.title.toLowerCase().replace(/\s+/g, '-')}`,
            author: 'admin',
            status: 'published',
            updated_at: new Date().toISOString()
          }))
        );
      }
    } catch (err) {
      console.error('Error loading services:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveServicesList = async (updated: ServiceItem[]) => {
    setServices(updated);
    setCached('techfnm_services_cache', updated);
    triggerContentUpdate();

    try {
      const rows = updated.map(s => ({
        id: typeof s.id === 'number' ? s.id : undefined,
        title: s.title,
        slug: s.slug,
        description: s.description,
        icon: s.icon,
        color: s.color,
        image: s.image,
        content: s.content,
        author: s.author || 'admin',
        status: s.status || 'published',
        meta_title: s.seo_settings?.seoTitle || s.title,
        meta_description: s.seo_settings?.metaDescription || s.description,
        seo_settings: s.seo_settings || {},
        updated_at: new Date().toISOString()
      }));

      // Upsert into Supabase services table
      for (const row of rows) {
        if (row.id) {
          await supabase.from('services').upsert(row);
        } else {
          await supabase.from('services').insert(row);
        }
      }
    } catch (err) {
      console.error('Error syncing services to Supabase:', err);
    }
  };

  // Counts for top tabs
  const counts = {
    all: services.filter(s => s.status !== 'trash').length,
    published: services.filter(s => s.status === 'published').length,
    draft: services.filter(s => s.status === 'draft').length,
    trash: services.filter(s => s.status === 'trash').length
  };

  // Filtered list
  const filteredServices = services.filter(service => {
    if (activeTab === 'all' && service.status === 'trash') return false;
    if (activeTab === 'published' && service.status !== 'published') return false;
    if (activeTab === 'draft' && service.status !== 'draft') return false;
    if (activeTab === 'trash' && service.status !== 'trash') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = service.title.toLowerCase().includes(q);
      const matchDesc = service.description?.toLowerCase().includes(q);
      if (!matchTitle && !matchDesc) return false;
    }
    return true;
  });

  // Bulk Actions
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredServices.map(s => s.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: any) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  const handleApplyBulkAction = async () => {
    if (selectedIds.length === 0) {
      toast.error('No services selected.');
      return;
    }

    if (bulkAction === 'trash') {
      const updated = services.map(s => (selectedIds.includes(s.id) ? { ...s, status: 'trash' as const } : s));
      saveServicesList(updated);
      setSelectedIds([]);
      toast.success(`${selectedIds.length} service(s) moved to Trash.`);
    } else if (bulkAction === 'restore') {
      const updated = services.map(s => (selectedIds.includes(s.id) ? { ...s, status: 'published' as const } : s));
      saveServicesList(updated);
      setSelectedIds([]);
      toast.success(`${selectedIds.length} service(s) restored.`);
    } else if (bulkAction === 'delete') {
      if (!window.confirm(`Permanently delete ${selectedIds.length} service(s)?`)) return;
      const updated = services.filter(s => !selectedIds.includes(s.id));
      for (const id of selectedIds) {
        await supabase.from('services').delete().eq('id', id);
      }
      saveServicesList(updated);
      setSelectedIds([]);
      toast.success(`${selectedIds.length} service(s) deleted permanently.`);
    }
  };

  // Full Editor Open
  const openFullEditor = (service?: ServiceItem) => {
    if (service) {
      setEditingService({
        ...service,
        seo_settings: service.seo_settings || {
          seoTitle: service.title,
          slug: service.slug,
          metaDescription: service.description
        }
      });
    } else {
      setEditingService({
        id: null,
        title: '',
        slug: '',
        description: '',
        icon: 'Code',
        color: 'bg-red-500/10 text-red-500',
        image: '',
        content: '',
        author: 'admin',
        status: 'published',
        updated_at: new Date().toISOString(),
        seo_settings: {}
      });
    }
    setIsFullEditing(true);
  };

  // Save Full Editor
  const saveFullEditor = async () => {
    if (!editingService || !editingService.title.trim()) {
      toast.error('Please enter a service title.');
      return;
    }

    const cleanSlug = editingService.slug.trim()
      ? editingService.slug.startsWith('/')
        ? editingService.slug
        : `/${editingService.slug}`
      : `/services/${editingService.title.toLowerCase().replace(/\s+/g, '-')}`;

    const updatedService: ServiceItem = {
      ...editingService,
      slug: cleanSlug,
      updated_at: new Date().toISOString()
    };

    let updatedList: ServiceItem[];
    if (updatedService.id) {
      updatedList = services.map(s => (s.id === updatedService.id ? updatedService : s));
      await supabase.from('services').update({
        title: updatedService.title,
        slug: updatedService.slug,
        description: updatedService.description,
        icon: updatedService.icon,
        color: updatedService.color,
        image: updatedService.image,
        content: updatedService.content,
        author: updatedService.author,
        status: updatedService.status,
        meta_title: updatedService.seo_settings?.seoTitle || updatedService.title,
        meta_description: updatedService.seo_settings?.metaDescription || updatedService.description,
        seo_settings: updatedService.seo_settings || {},
        updated_at: new Date().toISOString()
      }).eq('id', updatedService.id);
    } else {
      const { data: newRow } = await supabase.from('services').insert([{
        title: updatedService.title,
        slug: updatedService.slug,
        description: updatedService.description,
        icon: updatedService.icon,
        color: updatedService.color,
        image: updatedService.image,
        content: updatedService.content,
        author: updatedService.author,
        status: updatedService.status,
        meta_title: updatedService.seo_settings?.seoTitle || updatedService.title,
        meta_description: updatedService.seo_settings?.metaDescription || updatedService.description,
        seo_settings: updatedService.seo_settings || {},
        updated_at: new Date().toISOString()
      }]).select().single();

      if (newRow) {
        updatedService.id = newRow.id;
      } else {
        updatedService.id = Date.now();
      }
      updatedList = [updatedService, ...services];
    }

    setServices(updatedList);
    setCached('techfnm_services_cache', updatedList);
    triggerContentUpdate();

    setIsFullEditing(false);
    setEditingService(null);
    toast.success(`Service "${updatedService.title}" saved successfully!`);
  };

  // Quick Edit Save
  const saveQuickEdit = async () => {
    if (!quickEditingId) return;
    const updated = services.map(s => {
      if (s.id === quickEditingId) {
        return {
          ...s,
          title: quickEditData.title,
          slug: quickEditData.slug.startsWith('/') ? quickEditData.slug : `/${quickEditData.slug}`,
          icon: quickEditData.icon,
          status: quickEditData.status
        };
      }
      return s;
    });
    await saveServicesList(updated);
    setQuickEditingId(null);
    toast.success('Service updated.');
  };

  // Handle Featured Image Upload from PC
  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image must be under 5MB.');
      return;
    }
    const reader = new FileReader();
    reader.onload = uploadEvent => {
      const dataUrl = uploadEvent.target?.result as string;
      if (dataUrl && editingService) {
        setEditingService({ ...editingService, image: dataUrl });
        toast.success('Featured image loaded from PC!');
      }
    };
    reader.readAsDataURL(file);
  };

  // ── FULL EDITOR VIEW ──
  if (isFullEditing && editingService) {
    return (
      <div className="space-y-5 font-sans text-zinc-100 animate-in fade-in duration-150">
        <Toaster position="top-right" toastOptions={{ style: { background: '#18181b', color: '#fff' } }} />

        {/* TOP BAR: Back button & Title */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800/80 pb-3.5">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setIsFullEditing(false); setEditingService(null); }}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-850 transition-colors cursor-pointer"
              title="Return to Services list"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <Briefcase size={20} className="text-red-500" />
                <span>{editingService.id ? `Edit Service: ${editingService.title}` : 'Add New Service Offering'}</span>
              </h2>
              <p className="text-xs text-zinc-400">
                Configure service title, slug, styling, detailed offerings, and advanced SEO settings.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={saveFullEditor}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-950/40 transition-all cursor-pointer"
            >
              <Save size={14} />
              <span>{editingService.status === 'published' ? 'Update & Publish' : 'Save Service Draft'}</span>
            </button>
          </div>
        </div>

        {/* 2-COLUMN LAYOUT: 8 COLS LEFT, 4 COLS RIGHT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT 8 COLS */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. TITLE & SLUG CARD */}
            <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">Service Title</label>
                <input
                  type="text"
                  value={editingService.title}
                  onChange={e => {
                    const val = e.target.value;
                    const autoSlug = `/services/${val.toLowerCase().replace(/\s+/g, '-')}`;
                    setEditingService({
                      ...editingService,
                      title: val,
                      slug: editingService.slug ? editingService.slug : autoSlug
                    });
                  }}
                  placeholder="e.g. Web Development"
                  className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-xl px-4 py-3 text-base text-white font-bold placeholder-zinc-600 outline-none transition-all shadow-inner"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">Permalink / Slug</label>
                <div className="flex items-center bg-[#141419] border border-zinc-800 rounded-xl px-3.5 py-2 text-xs">
                  <span className="text-zinc-500 font-mono">https://techfnm.com</span>
                  <input
                    type="text"
                    value={editingService.slug}
                    onChange={e => setEditingService({ ...editingService, slug: e.target.value })}
                    placeholder="/services/web-development"
                    className="flex-1 bg-transparent text-red-400 font-mono outline-none px-2 text-xs"
                  />
                </div>
              </div>
            </div>

            {/* 2. SHORT SUMMARY DESCRIPTION */}
            <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-5 space-y-3 shadow-xl">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                Card Description (Shown on Homepage & Catalog Grid)
              </label>
              <textarea
                rows={3}
                value={editingService.description}
                onChange={e => setEditingService({ ...editingService, description: e.target.value })}
                placeholder="Get a high-performance, responsive website built with the latest tech..."
                className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-xl p-3.5 text-xs text-zinc-200 placeholder-zinc-600 outline-none transition-all resize-y"
              />
            </div>

            {/* 3. DETAILED CONTENT / NARRATIVE */}
            <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-5 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                  Detailed Service Overview / Case Breakdown
                </label>
                <span className="text-[11px] text-zinc-500">HTML / Markdown copy</span>
              </div>
              <textarea
                rows={8}
                value={editingService.content || ''}
                onChange={e => setEditingService({ ...editingService, content: e.target.value })}
                placeholder="Detailed explanation of technologies, process deliverables, guarantees, and workflows..."
                className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-xl p-4 text-xs text-zinc-200 placeholder-zinc-600 outline-none transition-all resize-y"
              />
            </div>

            {/* 4. YOAST / RANKMATH STYLE SEO SETTINGS PANEL */}
            <SeoSettingsPanel
              data={editingService.seo_settings || {}}
              onChange={updated => setEditingService({ ...editingService, seo_settings: updated })}
              defaultTitle={editingService.title}
              defaultSlug={editingService.slug}
              defaultDescription={editingService.description}
              defaultImage={editingService.image}
              contentType="service"
            />
          </div>

          {/* RIGHT 4 COLS (STICKY SIDEBAR) */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-4">
            {/* 1. PUBLISH CARD */}
            <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-4 py-3 bg-[#131319] border-b border-zinc-800/80 flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-zinc-300">Publish</span>
                <span className={`w-2 h-2 rounded-full ${editingService.status === 'published' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              </div>

              <div className="p-4 space-y-3.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 font-medium">Status:</span>
                  <select
                    value={editingService.status}
                    onChange={e => setEditingService({ ...editingService, status: e.target.value as any })}
                    className="bg-[#141419] border border-zinc-800 rounded-lg px-2.5 py-1 text-zinc-200 outline-none font-medium"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 font-medium">Visibility:</span>
                  <span className="text-zinc-200 font-medium">Public</span>
                </div>

                <div className="border-t border-zinc-800/80 pt-3 flex gap-2">
                  <button
                    type="button"
                    onClick={saveFullEditor}
                    className="flex-1 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-md transition-all cursor-pointer text-center"
                  >
                    {editingService.status === 'published' ? 'Update & Publish' : 'Save Draft'}
                  </button>
                </div>
              </div>
            </div>

            {/* 2. ICON & STYLING CARD */}
            <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-4 py-3 bg-[#131319] border-b border-zinc-800/80">
                <span className="font-bold text-xs uppercase tracking-wider text-zinc-300">Icon & Visual Theme</span>
              </div>
              <div className="p-4 space-y-3.5 text-xs">
                <div>
                  <label className="text-zinc-400 block mb-2 font-medium">Select Service Icon</label>
                  <div className="grid grid-cols-3 gap-2">
                    {AVAILABLE_ICONS.map(item => {
                      const IconComp = item.icon;
                      const isSelected = editingService.icon === item.name;
                      return (
                        <button
                          key={item.name}
                          type="button"
                          onClick={() => setEditingService({ ...editingService, icon: item.name })}
                          className={`p-2.5 rounded-xl border flex flex-col items-center gap-1.5 transition-all cursor-pointer ${
                            isSelected ? 'bg-red-500/20 border-red-500 text-white' : 'bg-zinc-900 border-zinc-800 text-zinc-400 hover:text-zinc-200'
                          }`}
                        >
                          <IconComp size={20} />
                          <span className="text-[10px] truncate max-w-full">{item.label}</span>
                        </button>
                      );
                    })}
                  </div>
                </div>

                <div>
                  <label className="text-zinc-400 block mb-2 font-medium">Color Badge Accent</label>
                  <select
                    value={editingService.color}
                    onChange={e => setEditingService({ ...editingService, color: e.target.value })}
                    className="w-full bg-[#141419] border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 outline-none font-medium"
                  >
                    {COLOR_PRESETS.map(preset => (
                      <option key={preset.value} value={preset.value}>
                        {preset.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* 3. FEATURED IMAGE CARD */}
            <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-4 py-3 bg-[#131319] border-b border-zinc-800/80 flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-zinc-300">Featured Image</span>
                <ImageIcon size={14} className="text-amber-400" />
              </div>
              <div className="p-4 space-y-3 text-xs">
                <label className="flex items-center justify-center gap-2 w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-red-650/20 to-red-900/20 hover:from-red-600/30 hover:to-red-900/30 border border-red-600/30 text-red-400 hover:text-red-300 font-bold text-xs cursor-pointer transition-all shadow-sm">
                  <Upload size={14} />
                  <span>Upload Image from Device</span>
                  <input type="file" accept="image/*" className="hidden" onChange={handleFileUpload} />
                </label>

                <div className="space-y-1.5">
                  <label className="text-zinc-400 block font-medium">Or Paste Image URL</label>
                  <input
                    type="text"
                    value={editingService.image || ''}
                    onChange={e => setEditingService({ ...editingService, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 outline-none"
                  />
                </div>

                {editingService.image && (
                  <div className="relative rounded-xl border border-zinc-800 overflow-hidden bg-zinc-950 aspect-video">
                    <img
                      src={editingService.image}
                      alt="Featured Preview"
                      className="w-full h-full object-cover"
                      onError={(e: any) => { e.target.style.display = 'none'; }}
                    />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  // ── LIST / TABLE VIEW (PAGE MANAGEMENT STYLE) ──
  return (
    <div className="space-y-6 font-sans text-zinc-100">
      <Toaster position="top-right" toastOptions={{ style: { background: '#18181b', color: '#fff' } }} />

      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <Briefcase className="text-red-500" size={24} />
            <span>Services Management</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Manage all customer-facing services, technical capabilities, pricing tiers, and SEO schema.
          </p>
        </div>

        <button
          onClick={() => openFullEditor()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-950/40 transition-all cursor-pointer"
        >
          <Plus size={15} />
          <span>Add New Service</span>
        </button>
      </div>

      {/* TOP TABS & STATS */}
      <div className="flex items-center gap-2 text-xs border-b border-zinc-800/80 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === 'all' ? 'bg-red-500/10 text-red-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          All <span className="text-zinc-500 font-mono">({counts.all})</span>
        </button>
        <span className="text-zinc-700">|</span>
        <button
          onClick={() => setActiveTab('published')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === 'published' ? 'bg-emerald-500/10 text-emerald-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Published <span className="text-zinc-500 font-mono">({counts.published})</span>
        </button>
        <span className="text-zinc-700">|</span>
        <button
          onClick={() => setActiveTab('draft')}
          className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
            activeTab === 'draft' ? 'bg-amber-500/10 text-amber-400 font-bold' : 'text-zinc-400 hover:text-zinc-200'
          }`}
        >
          Draft <span className="text-zinc-500 font-mono">({counts.draft})</span>
        </button>
        {counts.trash > 0 && (
          <>
            <span className="text-zinc-700">|</span>
            <button
              onClick={() => setActiveTab('trash')}
              className={`px-3 py-1.5 rounded-lg font-medium transition-all ${
                activeTab === 'trash' ? 'bg-red-500/20 text-red-300 font-bold' : 'text-zinc-400 hover:text-zinc-200'
              }`}
            >
              Trash <span className="text-zinc-500 font-mono">({counts.trash})</span>
            </button>
          </>
        )}
      </div>

      {/* FILTER CONTROLS (BULK ACTIONS & SEARCH) */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={bulkAction}
            onChange={e => setBulkAction(e.target.value)}
            className="bg-[#121217] border border-zinc-800 rounded-xl px-3 py-2 text-xs text-zinc-300 outline-none"
          >
            <option value="">Bulk actions</option>
            {activeTab !== 'trash' && <option value="trash">Move to Trash</option>}
            {activeTab === 'trash' && <option value="restore">Restore</option>}
            <option value="delete">Delete Permanently</option>
          </select>
          <button
            onClick={handleApplyBulkAction}
            className="px-3.5 py-2 bg-zinc-800/80 hover:bg-zinc-800 border border-zinc-700/60 rounded-xl text-xs font-semibold text-zinc-200 cursor-pointer transition-all"
          >
            Apply
          </button>
        </div>

        <div className="relative w-full sm:w-72">
          <Search size={14} className="absolute left-3.5 top-1/2 -translate-y-1/2 text-zinc-500" />
          <input
            type="text"
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            placeholder="Search services..."
            className="w-full bg-[#121217] border border-zinc-800 focus:border-red-600/50 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* TABLE LIST VIEW */}
      <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#14141a] border-b border-zinc-800/80 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4 w-10 text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={filteredServices.length > 0 && selectedIds.length === filteredServices.length}
                    className="rounded bg-zinc-900 border-zinc-700 text-red-600 focus:ring-0"
                  />
                </th>
                <th className="p-4">Title</th>
                <th className="p-4 w-28">Icon</th>
                <th className="p-4 w-32">Status</th>
                <th className="p-4 w-28">Author</th>
                <th className="p-4 w-36">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850">
              {filteredServices.length === 0 ? (
                <tr>
                  <td colSpan={6} className="p-10 text-center text-zinc-500 text-xs">
                    No services found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredServices.map(service => {
                  const isSelected = selectedIds.includes(service.id);
                  const isQuick = quickEditingId === service.id;

                  if (isQuick) {
                    return (
                      <tr key={service.id} className="bg-zinc-900/90 border-b border-zinc-700">
                        <td colSpan={6} className="p-5 space-y-4">
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                            <span className="font-bold text-xs uppercase tracking-wider text-red-400">
                              Quick Edit Service
                            </span>
                            <button
                              onClick={() => setQuickEditingId(null)}
                              className="text-zinc-500 hover:text-zinc-300"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                            <div className="space-y-1">
                              <label className="text-[11px] text-zinc-400 block font-medium">Title</label>
                              <input
                                type="text"
                                value={quickEditData.title}
                                onChange={e => setQuickEditData({ ...quickEditData, title: e.target.value })}
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] text-zinc-400 block font-medium">Slug</label>
                              <input
                                type="text"
                                value={quickEditData.slug}
                                onChange={e => setQuickEditData({ ...quickEditData, slug: e.target.value })}
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] text-zinc-400 block font-medium">Status</label>
                              <select
                                value={quickEditData.status}
                                onChange={e => setQuickEditData({ ...quickEditData, status: e.target.value as any })}
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white"
                              >
                                <option value="published">Published</option>
                                <option value="draft">Draft</option>
                              </select>
                            </div>
                          </div>
                          <div className="flex justify-end gap-2 pt-2">
                            <button
                              onClick={() => setQuickEditingId(null)}
                              className="px-3 py-1.5 rounded-lg border border-zinc-700 text-xs text-zinc-400 hover:text-white"
                            >
                              Cancel
                            </button>
                            <button
                              onClick={saveQuickEdit}
                              className="px-4 py-1.5 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs"
                            >
                              Update Service
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr
                      key={service.id}
                      className={`hover:bg-zinc-900/40 transition-colors group ${
                        isSelected ? 'bg-red-950/20' : ''
                      }`}
                    >
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(service.id)}
                          className="rounded bg-zinc-900 border-zinc-700 text-red-600 focus:ring-0"
                        />
                      </td>

                      <td className="p-4">
                        <div className="space-y-1">
                          <button
                            onClick={() => openFullEditor(service)}
                            className="font-bold text-sm text-white hover:text-red-400 text-left transition-colors cursor-pointer block"
                          >
                            {service.title}
                          </button>
                          <span className="text-[11px] text-zinc-500 font-mono block truncate max-w-md">
                            {service.slug}
                          </span>

                          {/* Action links */}
                          <div className="flex items-center gap-2 pt-1 opacity-0 group-hover:opacity-100 transition-opacity text-[11px]">
                            <button
                              onClick={() => openFullEditor(service)}
                              className="text-red-400 hover:underline cursor-pointer"
                            >
                              Edit
                            </button>
                            <span className="text-zinc-700">|</span>
                            <button
                              onClick={() => {
                                setQuickEditingId(service.id);
                                setQuickEditData({
                                  title: service.title,
                                  slug: service.slug,
                                  icon: service.icon,
                                  status: service.status === 'trash' ? 'draft' : (service.status as any)
                                });
                              }}
                              className="text-indigo-400 hover:underline cursor-pointer"
                            >
                              Quick Edit
                            </button>
                            <span className="text-zinc-700">|</span>
                            {service.status === 'trash' ? (
                              <button
                                onClick={() => {
                                  const updated = services.map(s => (s.id === service.id ? { ...s, status: 'published' as const } : s));
                                  saveServicesList(updated);
                                  toast.success('Service restored.');
                                }}
                                className="text-emerald-400 hover:underline cursor-pointer"
                              >
                                Restore
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  const updated = services.map(s => (s.id === service.id ? { ...s, status: 'trash' as const } : s));
                                  saveServicesList(updated);
                                  toast.success('Moved to Trash.');
                                }}
                                className="text-rose-400 hover:underline cursor-pointer"
                              >
                                Trash
                              </button>
                            )}
                            <span className="text-zinc-700">|</span>
                            <a
                              href={service.slug}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-zinc-400 hover:text-white flex items-center gap-1"
                            >
                              <span>View</span>
                              <ExternalLink size={11} />
                            </a>
                          </div>
                        </div>
                      </td>

                      <td className="p-4">
                        <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-lg text-xs font-semibold ${service.color || 'bg-red-500/10 text-red-500'}`}>
                          {service.icon}
                        </span>
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            service.status === 'published'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : service.status === 'draft'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${service.status === 'published' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                          {service.status}
                        </span>
                      </td>

                      <td className="p-4 text-zinc-400 font-medium">
                        {service.author || 'admin'}
                      </td>

                      <td className="p-4 text-zinc-400 text-[11px] font-mono">
                        {new Date(service.updated_at || Date.now()).toLocaleDateString('en-US', {
                          year: 'numeric',
                          month: 'short',
                          day: 'numeric'
                        })}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

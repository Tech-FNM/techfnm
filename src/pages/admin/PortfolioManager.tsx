import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import {
  FolderGit2,
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
  Link as LinkIcon,
  Tag
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast, Toaster } from 'react-hot-toast';
import { setCached, CANONICAL_PROJECTS } from '../../lib/canonicalData';
import { triggerContentUpdate } from '../../lib/cmsContent';

const DEFAULT_CATEGORIES = [
  'Web Development',
  'Mobile App',
  'UI/UX Design',
  'Digital Marketing',
  'Graphic Designing',
  'E-Commerce'
];

interface ProjectItem {
  id: any;
  title: string;
  slug: string;
  category: string;
  description: string;
  image: string;
  client_name?: string;
  project_url?: string;
  content?: string;
  author?: string;
  status?: 'published' | 'draft' | 'trash';
  updated_at?: string;
  seo_settings?: any;
}

export default function PortfolioManager() {
  const navigate = useNavigate();
  const { action, itemId } = useParams();

  const [projects, setProjects] = useState<ProjectItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'draft' | 'trash'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<any[]>([]);
  const [bulkAction, setBulkAction] = useState('');

  // Categories State
  const [categories, setCategories] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('techfnm_project_categories');
      if (stored) {
        const parsed = JSON.parse(stored);
        return Array.from(new Set([...DEFAULT_CATEGORIES, ...parsed]));
      }
    } catch {}
    return DEFAULT_CATEGORIES;
  });
  const [isAddingCategory, setIsAddingCategory] = useState(false);
  const [newCategoryName, setNewCategoryName] = useState('');

  // Full Editor State
  const [isFullEditing, setIsFullEditing] = useState(false);
  const [editingProject, setEditingProject] = useState<ProjectItem | null>(null);

  // Quick Edit State
  const [quickEditingId, setQuickEditingId] = useState<any | null>(null);
  const [quickEditData, setQuickEditData] = useState({
    title: '',
    category: 'Web Development',
    status: 'published' as 'published' | 'draft'
  });

  const handleCreateCategory = (initialName?: string) => {
    const name = (initialName || newCategoryName).trim();
    if (!name) {
      toast.error('Please enter a category name.');
      return;
    }
    if (!categories.includes(name)) {
      const updated = [...categories, name];
      setCategories(updated);
      try {
        localStorage.setItem('techfnm_project_categories', JSON.stringify(updated));
      } catch {}
    }
    if (editingProject) {
      setEditingProject({ ...editingProject, category: name });
    }
    setNewCategoryName('');
    setIsAddingCategory(false);
    toast.success(`Category "${name}" added and selected!`);
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  const fetchProjects = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase.from('projects').select('*').order('id', { ascending: true });
      if (data && data.length > 0) {
        const mapped: ProjectItem[] = data.map((row: any) => ({
          id: row.id,
          title: row.title || 'Untitled Project',
          slug: row.slug || `/portfolio/${(row.title || '').toLowerCase().replace(/\s+/g, '-')}`,
          category: row.category || 'Web Development',
          description: row.description || '',
          image: row.image || row.featured_image || '',
          client_name: row.client_name || '',
          project_url: row.link || row.project_url || '',
          content: row.content || '',
          author: row.author || 'admin',
          status: (row.status as any) || 'published',
          updated_at: row.updated_at || new Date().toISOString(),
          seo_settings: row.seo_settings || {}
        }));
        setProjects(mapped);
        setCached('techfnm_projects_cache', data);

        const extractedCats = data.map((p: any) => p.category).filter(Boolean);
        if (extractedCats.length > 0) {
          setCategories(prev => {
            const merged = Array.from(new Set([...prev, ...extractedCats]));
            try { localStorage.setItem('techfnm_project_categories', JSON.stringify(merged)); } catch {}
            return merged;
          });
        }
      } else {
        setProjects(
          CANONICAL_PROJECTS.map((p: any) => ({
            ...p,
            slug: p.slug || `/portfolio/${p.title.toLowerCase().replace(/\s+/g, '-')}`,
            author: 'admin',
            status: 'published',
            updated_at: new Date().toISOString()
          }))
        );
      }
    } catch (err) {
      console.error('Error loading projects:', err);
    } finally {
      setLoading(false);
    }
  };

  const saveProjectsList = async (updated: ProjectItem[]) => {
    setProjects(updated);
    setCached('techfnm_projects_cache', updated);
    triggerContentUpdate();

    try {
      const rows = updated.map(p => ({
        id: typeof p.id === 'number' ? p.id : undefined,
        title: p.title,
        slug: p.slug,
        category: p.category,
        description: p.description,
        image: p.image,
        link: p.project_url,
        project_url: p.project_url,
        client_name: p.client_name,
        content: p.content,
        author: p.author || 'admin',
        status: p.status || 'published',
        seo_settings: p.seo_settings || {},
        updated_at: new Date().toISOString()
      }));

      for (const row of rows) {
        if (row.id) {
          await supabase.from('projects').upsert(row);
        } else {
          await supabase.from('projects').insert(row);
        }
      }
    } catch (err) {
      console.error('Error syncing projects to Supabase:', err);
    }
  };

  // Counts for tabs
  const counts = {
    all: projects.filter(p => p.status !== 'trash').length,
    published: projects.filter(p => p.status === 'published').length,
    draft: projects.filter(p => p.status === 'draft').length,
    trash: projects.filter(p => p.status === 'trash').length
  };

  // Filtered
  const filteredProjects = projects.filter(proj => {
    if (activeTab === 'all' && proj.status === 'trash') return false;
    if (activeTab === 'published' && proj.status !== 'published') return false;
    if (activeTab === 'draft' && proj.status !== 'draft') return false;
    if (activeTab === 'trash' && proj.status !== 'trash') return false;

    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = proj.title.toLowerCase().includes(q);
      const matchCat = proj.category?.toLowerCase().includes(q);
      if (!matchTitle && !matchCat) return false;
    }
    return true;
  });

  // Bulk Actions
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredProjects.map(p => p.id));
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
      toast.error('No projects selected.');
      return;
    }

    if (bulkAction === 'trash') {
      const updated = projects.map(p => (selectedIds.includes(p.id) ? { ...p, status: 'trash' as const } : p));
      saveProjectsList(updated);
      setSelectedIds([]);
      toast.success(`${selectedIds.length} project(s) moved to Trash.`);
    } else if (bulkAction === 'restore') {
      const updated = projects.map(p => (selectedIds.includes(p.id) ? { ...p, status: 'published' as const } : p));
      saveProjectsList(updated);
      setSelectedIds([]);
      toast.success(`${selectedIds.length} project(s) restored.`);
    } else if (bulkAction === 'delete') {
      if (!window.confirm(`Permanently delete ${selectedIds.length} project(s)?`)) return;
      const updated = projects.filter(p => !selectedIds.includes(p.id));
      for (const id of selectedIds) {
        await supabase.from('projects').delete().eq('id', id);
      }
      saveProjectsList(updated);
      setSelectedIds([]);
      toast.success(`${selectedIds.length} project(s) deleted permanently.`);
    }
  };

  // Open Full Editor
  const openFullEditor = (project?: ProjectItem) => {
    if (project) {
      setEditingProject({
        ...project
      });
      if (String(project.id) !== itemId || action !== 'edit') {
        navigate(`/admin/portfolio/edit/${project.id}`);
      }
    } else {
      setEditingProject({
        id: null,
        title: '',
        slug: '',
        category: categories[0] || 'Web Development',
        description: '',
        image: '',
        client_name: '',
        project_url: '',
        content: '',
        author: 'admin',
        status: 'published',
        updated_at: new Date().toISOString(),
        seo_settings: {}
      });
      if (action !== 'new') {
        navigate('/admin/portfolio/new');
      }
    }
    setIsFullEditing(true);
  };

  const closeFullEditor = () => {
    setIsFullEditing(false);
    setEditingProject(null);
    if (action) {
      navigate('/admin/portfolio');
    }
  };

  useEffect(() => {
    if (projects.length === 0) return;
    if (action === 'edit' && itemId) {
      const target = projects.find(p => String(p.id) === itemId);
      if (target) {
        if (!editingProject || String(editingProject.id) !== String(target.id)) {
          openFullEditor(target);
        }
      }
    } else if (action === 'new') {
      if (!isFullEditing) {
        openFullEditor();
      }
    } else if (!action && isFullEditing) {
      setIsFullEditing(false);
      setEditingProject(null);
    }
  }, [action, itemId, projects.length]);

  // Save Full Editor
  const saveFullEditor = async () => {
    if (!editingProject || !editingProject.title.trim()) {
      toast.error('Please enter a project title.');
      return;
    }

    const cleanSlug = editingProject.slug?.trim()
      ? (editingProject.slug.startsWith('/') ? editingProject.slug : `/${editingProject.slug}`)
      : `/portfolio/${editingProject.title.toLowerCase().replace(/[^a-z0-9]+/g, '-')}`;

    const updatedProject: ProjectItem = {
      ...editingProject,
      slug: cleanSlug,
      updated_at: new Date().toISOString()
    };

    let updatedList: ProjectItem[];
    if (updatedProject.id) {
      updatedList = projects.map(p => (p.id === updatedProject.id ? updatedProject : p));
      await supabase.from('projects').update({
        title: updatedProject.title,
        slug: updatedProject.slug,
        category: updatedProject.category,
        description: updatedProject.description,
        image: updatedProject.image,
        link: updatedProject.project_url,
        project_url: updatedProject.project_url,
        client_name: updatedProject.client_name,
        content: updatedProject.content,
        author: updatedProject.author,
        status: updatedProject.status,
        updated_at: new Date().toISOString()
      }).eq('id', updatedProject.id);
    } else {
      const { data: newRow } = await supabase.from('projects').insert([{
        title: updatedProject.title,
        slug: updatedProject.slug,
        category: updatedProject.category,
        description: updatedProject.description,
        image: updatedProject.image,
        link: updatedProject.project_url,
        project_url: updatedProject.project_url,
        client_name: updatedProject.client_name,
        content: updatedProject.content,
        author: updatedProject.author,
        status: updatedProject.status,
        updated_at: new Date().toISOString()
      }]).select().single();

      if (newRow) {
        updatedProject.id = newRow.id;
      } else {
        updatedProject.id = Date.now();
      }
      updatedList = [updatedProject, ...projects];
    }

    setProjects(updatedList);
    setCached('techfnm_projects_cache', updatedList);
    triggerContentUpdate();

    closeFullEditor();
    toast.success(`Project "${updatedProject.title}" saved successfully!`);
  };

  // Quick Edit Save
  const saveQuickEdit = async () => {
    if (!quickEditingId) return;
    const updated = projects.map(p => {
      if (p.id === quickEditingId) {
        return {
          ...p,
          title: quickEditData.title,
          category: quickEditData.category,
          status: quickEditData.status
        };
      }
      return p;
    });
    await saveProjectsList(updated);
    setQuickEditingId(null);
    toast.success('Project updated.');
  };

  // Upload image from PC
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
      if (dataUrl && editingProject) {
        setEditingProject({ ...editingProject, image: dataUrl });
        toast.success('Project image loaded from PC!');
      }
    };
    reader.readAsDataURL(file);
  };

  // ── FULL EDITOR VIEW ──
  if (isFullEditing && editingProject) {
    return (
      <div className="space-y-5 font-sans text-zinc-100 animate-in fade-in duration-150">
        <Toaster position="top-right" toastOptions={{ style: { background: '#18181b', color: '#fff' } }} />

        {/* TOP BAR */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800/80 pb-3.5">
          <div className="flex items-center gap-3">
            <button
              onClick={closeFullEditor}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-850 transition-colors cursor-pointer"
              title="Return to Portfolio list"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <FolderGit2 size={20} className="text-red-500" />
                <span>{editingProject.id ? `Edit Project: ${editingProject.title}` : 'Add New Portfolio Work'}</span>
              </h2>
              <p className="text-xs text-zinc-400">
                Configure case study title, category, live links, and visual deliverables.
              </p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={saveFullEditor}
              className="flex items-center gap-2 px-5 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-950/40 transition-all cursor-pointer"
            >
              <Save size={14} />
              <span>{editingProject.status === 'published' ? 'Update & Publish' : 'Save Project Draft'}</span>
            </button>
          </div>
        </div>

        {/* 2-COLUMN LAYOUT */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
          {/* LEFT 8 COLS */}
          <div className="lg:col-span-8 space-y-6">
            {/* 1. TITLE CARD */}
            <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">Project Title</label>
                <input
                  type="text"
                  value={editingProject.title}
                  onChange={e => setEditingProject({ ...editingProject, title: e.target.value })}
                  placeholder="e.g. RBS Engineering System"
                  className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-xl px-4 py-3 text-base text-white font-bold placeholder-zinc-600 outline-none transition-all shadow-inner"
                />
              </div>
            </div>

            {/* 2. CLIENT & PROJECT URL */}
            <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-5 space-y-4 shadow-xl">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">Client / Organization</label>
                  <input
                    type="text"
                    value={editingProject.client_name || ''}
                    onChange={e => setEditingProject({ ...editingProject, client_name: e.target.value })}
                    placeholder="e.g. RBS Group UK"
                    className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 placeholder-zinc-600 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">Live Website / Demo URL</label>
                  <input
                    type="url"
                    value={editingProject.project_url || ''}
                    onChange={e => setEditingProject({ ...editingProject, project_url: e.target.value })}
                    placeholder="https://example.com"
                    className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 placeholder-zinc-600 outline-none font-mono"
                  />
                </div>
              </div>
            </div>

            {/* 3. SHORT SUMMARY DESCRIPTION */}
            <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-5 space-y-3 shadow-xl">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                Project Excerpt (Shown on Cards & Showcases)
              </label>
              <textarea
                rows={3}
                value={editingProject.description}
                onChange={e => setEditingProject({ ...editingProject, description: e.target.value })}
                placeholder="High-performance platform designed for international commerce and scale..."
                className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-xl p-3.5 text-xs text-zinc-200 placeholder-zinc-600 outline-none transition-all resize-y"
              />
            </div>

            {/* 4. DETAILED CASE STUDY CONTENT */}
            <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-5 space-y-3 shadow-xl">
              <div className="flex items-center justify-between">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                  Detailed Case Study Narrative / Scope
                </label>
                <span className="text-[11px] text-zinc-500">HTML / Markdown copy</span>
              </div>
              <textarea
                rows={8}
                value={editingProject.content || ''}
                onChange={e => setEditingProject({ ...editingProject, content: e.target.value })}
                placeholder="Comprehensive breakdown of client challenges, technical stack, architecture decisions, and ROI outcomes..."
                className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-xl p-4 text-xs text-zinc-200 placeholder-zinc-600 outline-none transition-all resize-y"
              />
            </div>
          </div>

          {/* RIGHT 4 COLS */}
          <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-4">
            {/* 1. PUBLISH CARD */}
            <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-4 py-3 bg-[#131319] border-b border-zinc-800/80 flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-zinc-300">Publish</span>
                <span className={`w-2 h-2 rounded-full ${editingProject.status === 'published' ? 'bg-emerald-400 animate-pulse' : 'bg-amber-400'}`} />
              </div>

              <div className="p-4 space-y-3.5 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 font-medium">Status:</span>
                  <select
                    value={editingProject.status}
                    onChange={e => setEditingProject({ ...editingProject, status: e.target.value as any })}
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
                    {editingProject.status === 'published' ? 'Update & Publish' : 'Save Draft'}
                  </button>
                </div>
              </div>
            </div>

            {/* 2. CATEGORY CARD WITH INLINE ADD */}
            <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-4 py-3 bg-[#131319] border-b border-zinc-800/80 flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-zinc-300">Project Category</span>
                <Tag size={14} className="text-red-400" />
              </div>
              <div className="p-4 space-y-3.5 text-xs">
                <div>
                  <label className="text-zinc-400 block font-medium mb-1.5">Discipline / Industry</label>
                  <select
                    value={editingProject.category}
                    onChange={e => setEditingProject({ ...editingProject, category: e.target.value })}
                    className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-lg px-3 py-2 text-zinc-200 outline-none font-medium"
                  >
                    {categories.map(cat => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                  </select>
                </div>

                {/* Inline Add Category */}
                {!isAddingCategory ? (
                  <button
                    type="button"
                    onClick={() => { setIsAddingCategory(true); setNewCategoryName(''); }}
                    className="inline-flex items-center gap-1.5 text-red-400 hover:text-red-300 font-semibold text-xs cursor-pointer transition-colors pt-1"
                  >
                    <Plus size={14} />
                    <span>+ Add New Category</span>
                  </button>
                ) : (
                  <div className="p-3 bg-[#14141a] border border-zinc-700/80 rounded-xl space-y-2.5">
                    <label className="text-[11px] text-zinc-300 font-medium block">New Category Name</label>
                    <input
                      type="text"
                      autoFocus
                      value={newCategoryName}
                      onChange={e => setNewCategoryName(e.target.value)}
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          handleCreateCategory();
                        } else if (e.key === 'Escape') {
                          setIsAddingCategory(false);
                        }
                      }}
                      placeholder="e.g. AI & Machine Learning"
                      className="w-full bg-zinc-950 border border-zinc-700 focus:border-red-500 rounded-lg px-2.5 py-1.5 text-xs text-white placeholder-zinc-500 outline-none"
                    />
                    <div className="flex items-center justify-end gap-2 pt-1">
                      <button
                        type="button"
                        onClick={() => setIsAddingCategory(false)}
                        className="px-2.5 py-1 rounded-lg border border-zinc-700 text-zinc-400 hover:text-white text-xs transition-colors cursor-pointer"
                      >
                        Cancel
                      </button>
                      <button
                        type="button"
                        onClick={() => handleCreateCategory()}
                        className="px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-colors shadow-sm cursor-pointer"
                      >
                        Add & Select
                      </button>
                    </div>
                  </div>
                )}
              </div>
            </div>

            {/* 3. FEATURED IMAGE CARD */}
            <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
              <div className="px-4 py-3 bg-[#131319] border-b border-zinc-800/80 flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-zinc-300">Project Showcase Image</span>
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
                    value={editingProject.image || ''}
                    onChange={e => setEditingProject({ ...editingProject, image: e.target.value })}
                    placeholder="https://images.unsplash.com/..."
                    className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-lg px-3 py-2 text-xs text-zinc-200 placeholder-zinc-600 outline-none"
                  />
                </div>

                {editingProject.image && (
                  <div className="relative rounded-xl border border-zinc-800 overflow-hidden bg-zinc-950 aspect-video">
                    <img
                      src={editingProject.image}
                      alt="Project Preview"
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

  // ── LIST / TABLE VIEW ──
  return (
    <div className="space-y-6 font-sans text-zinc-100">
      <Toaster position="top-right" toastOptions={{ style: { background: '#18181b', color: '#fff' } }} />

      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <FolderGit2 className="text-red-500" size={24} />
            <span>Portfolio Management</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Manage showcase projects, case studies, live links, and schema definitions.
          </p>
        </div>

        <button
          onClick={() => openFullEditor()}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-950/40 transition-all cursor-pointer"
        >
          <Plus size={15} />
          <span>Add New Project</span>
        </button>
      </div>

      {/* TOP TABS */}
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

      {/* FILTER CONTROLS */}
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
            placeholder="Search projects..."
            className="w-full bg-[#121217] border border-zinc-800 focus:border-red-600/50 rounded-xl pl-9 pr-4 py-2 text-xs text-zinc-200 placeholder-zinc-500 outline-none transition-all"
          />
        </div>
      </div>

      {/* TABLE */}
      <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="bg-[#14141a] border-b border-zinc-800/80 text-zinc-400 font-bold uppercase tracking-wider text-[10px]">
                <th className="p-4 w-10 text-center">
                  <input
                    type="checkbox"
                    onChange={handleSelectAll}
                    checked={filteredProjects.length > 0 && selectedIds.length === filteredProjects.length}
                    className="rounded bg-zinc-900 border-zinc-700 text-red-600 focus:ring-0"
                  />
                </th>
                <th className="p-4 w-20">Media</th>
                <th className="p-4">Title</th>
                <th className="p-4 w-36">Category</th>
                <th className="p-4 w-32">Status</th>
                <th className="p-4 w-28">Author</th>
                <th className="p-4 w-36">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-zinc-850">
              {filteredProjects.length === 0 ? (
                <tr>
                  <td colSpan={7} className="p-10 text-center text-zinc-500 text-xs">
                    No projects found matching your filter criteria.
                  </td>
                </tr>
              ) : (
                filteredProjects.map(proj => {
                  const isSelected = selectedIds.includes(proj.id);
                  const isQuick = quickEditingId === proj.id;

                  if (isQuick) {
                    return (
                      <tr key={proj.id} className="bg-zinc-900/90 border-b border-zinc-700">
                        <td colSpan={7} className="p-5 space-y-4">
                          <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                            <span className="font-bold text-xs uppercase tracking-wider text-red-400">
                              Quick Edit Project
                            </span>
                            <button
                              onClick={() => setQuickEditingId(null)}
                              className="text-zinc-500 hover:text-zinc-300"
                            >
                              <X size={16} />
                            </button>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-4 gap-4">
                            <div className="space-y-1 sm:col-span-2">
                              <label className="text-[11px] text-zinc-400 block font-medium">Title</label>
                              <input
                                type="text"
                                value={quickEditData.title}
                                onChange={e => setQuickEditData({ ...quickEditData, title: e.target.value })}
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white"
                              />
                            </div>
                            <div className="space-y-1">
                              <label className="text-[11px] text-zinc-400 block font-medium">Category</label>
                              <select
                                value={quickEditData.category}
                                onChange={e => setQuickEditData({ ...quickEditData, category: e.target.value })}
                                className="w-full bg-zinc-950 border border-zinc-700 rounded-lg px-3 py-1.5 text-xs text-white"
                              >
                                {categories.map(c => (
                                  <option key={c} value={c}>
                                    {c}
                                  </option>
                                ))}
                              </select>
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
                              Update Project
                            </button>
                          </div>
                        </td>
                      </tr>
                    );
                  }

                  return (
                    <tr
                      key={proj.id}
                      className={`hover:bg-zinc-900/40 transition-colors group ${
                        isSelected ? 'bg-red-950/20' : ''
                      }`}
                    >
                      <td className="p-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => handleSelectOne(proj.id)}
                          className="rounded bg-zinc-900 border-zinc-700 text-red-600 focus:ring-0"
                        />
                      </td>

                      <td className="p-4">
                        <div className="w-12 h-9 rounded-lg overflow-hidden bg-zinc-800 border border-zinc-700">
                          {proj.image ? (
                            <img src={proj.image} alt={proj.title} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-zinc-600">
                              <ImageIcon size={14} />
                            </div>
                          )}
                        </div>
                      </td>

                      <td className="p-4">
                        <div className="space-y-1">
                          <button
                            onClick={() => openFullEditor(proj)}
                            className="font-bold text-sm text-white hover:text-red-400 text-left transition-colors cursor-pointer block"
                          >
                            {proj.title}
                          </button>
                          {proj.client_name && (
                            <span className="text-[11px] text-zinc-500 block truncate max-w-md">
                              Client: {proj.client_name}
                            </span>
                          )}

                          <div className="flex items-center gap-2 pt-1 opacity-0 group-hover:opacity-100 transition-opacity text-[11px]">
                            <button
                              onClick={() => openFullEditor(proj)}
                              className="text-red-400 hover:underline cursor-pointer"
                            >
                              Edit
                            </button>
                            <span className="text-zinc-700">|</span>
                            <button
                              onClick={() => {
                                setQuickEditingId(proj.id);
                                setQuickEditData({
                                  title: proj.title,
                                  category: proj.category,
                                  status: proj.status === 'trash' ? 'draft' : (proj.status as any)
                                });
                              }}
                              className="text-indigo-400 hover:underline cursor-pointer"
                            >
                              Quick Edit
                            </button>
                            <span className="text-zinc-700">|</span>
                            {proj.status === 'trash' ? (
                              <button
                                onClick={() => {
                                  const updated = projects.map(p => (p.id === proj.id ? { ...p, status: 'published' as const } : p));
                                  saveProjectsList(updated);
                                  toast.success('Project restored.');
                                }}
                                className="text-emerald-400 hover:underline cursor-pointer"
                              >
                                Restore
                              </button>
                            ) : (
                              <button
                                onClick={() => {
                                  const updated = projects.map(p => (p.id === proj.id ? { ...p, status: 'trash' as const } : p));
                                  saveProjectsList(updated);
                                  toast.success('Moved to Trash.');
                                }}
                                className="text-rose-400 hover:underline cursor-pointer"
                              >
                                Trash
                              </button>
                            )}
                            <span className="text-zinc-700">|</span>
                            <a
                              href={proj.project_url || '/portfolio'}
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
                        <span className="inline-flex items-center px-2.5 py-1 rounded-lg text-xs font-semibold bg-zinc-800 text-zinc-300 border border-zinc-700">
                          {proj.category}
                        </span>
                      </td>

                      <td className="p-4">
                        <span
                          className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider ${
                            proj.status === 'published'
                              ? 'bg-emerald-500/10 text-emerald-400 border border-emerald-500/20'
                              : proj.status === 'draft'
                              ? 'bg-amber-500/10 text-amber-400 border border-amber-500/20'
                              : 'bg-rose-500/10 text-rose-400 border border-rose-500/20'
                          }`}
                        >
                          <span className={`w-1.5 h-1.5 rounded-full ${proj.status === 'published' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
                          {proj.status}
                        </span>
                      </td>

                      <td className="p-4 text-zinc-400 font-medium">
                        {proj.author || 'admin'}
                      </td>

                      <td className="p-4 text-zinc-400 text-[11px] font-mono">
                        {new Date(proj.updated_at || Date.now()).toLocaleDateString('en-US', {
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

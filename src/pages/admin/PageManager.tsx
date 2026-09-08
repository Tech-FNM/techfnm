import React, { useEffect, useState } from 'react';
import {
  Plus,
  Trash2,
  Edit2,
  ExternalLink,
  Search,
  MessageSquare,
  Check,
  X,
  ChevronDown,
  RotateCcw,
  Eye,
  FileText,
  Save,
  HelpCircle,
  SlidersHorizontal,
  ArrowLeft,
  Calendar,
  User,
  Layers,
  Sparkles,
  CheckCircle2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast, Toaster } from 'react-hot-toast';

interface PageItem {
  id: string;
  title: string;
  slug: string;
  author: string;
  status: 'published' | 'draft' | 'trash';
  date: string;
  commentsCount: number;
  isFrontPage?: boolean;
  content?: string;
  template?: string;
  sections?: Record<string, any>;
}

const DEFAULT_PAGES: PageItem[] = [
  {
    id: 'page-home',
    title: 'Home',
    slug: '/',
    author: 'admin',
    status: 'published',
    date: new Date(Date.now() - 2 * 60 * 1000).toISOString(), // 2 mins ago
    commentsCount: 0,
    isFrontPage: true,
    content: 'Crafting premium web applications, branding, and conversion flows.',
    template: 'Front Page',
    sections: {
      hero_title: 'Your Digital Growth Partner',
      hero_subtitle: 'We Build What You Imagine',
      cta_text: 'Getting Started'
    }
  },
  {
    id: 'page-about',
    title: 'About Us',
    slug: '/about',
    author: 'admin',
    status: 'published',
    date: new Date(Date.now() - 45 * 60 * 1000).toISOString(),
    commentsCount: 0,
    isFrontPage: false,
    content: 'Full-service digital transformation consultancy delivering custom web & mobile software.',
    template: 'Default Template'
  },
  {
    id: 'page-services',
    title: 'Services Catalog',
    slug: '/services',
    author: 'admin',
    status: 'published',
    date: new Date(Date.now() - 2 * 3600 * 1000).toISOString(),
    commentsCount: 0,
    isFrontPage: false,
    content: 'Enterprise software, modern web apps, full-stack architecture, and cloud solutions.',
    template: 'Default Template'
  },
  {
    id: 'page-portfolio',
    title: 'Portfolio Works',
    slug: '/portfolio',
    author: 'admin',
    status: 'published',
    date: new Date(Date.now() - 24 * 3600 * 1000).toISOString(),
    commentsCount: 0,
    isFrontPage: false,
    content: 'Case studies, verified deliveries, and production accomplishments.',
    template: 'Default Template'
  },
  {
    id: 'page-contact',
    title: 'Contact Us',
    slug: '/contact',
    author: 'admin',
    status: 'published',
    date: new Date(Date.now() - 48 * 3600 * 1000).toISOString(),
    commentsCount: 0,
    isFrontPage: false,
    content: 'Direct consultation booking and corporate inquiries.',
    template: 'Default Template'
  },
  {
    id: 'page-faq',
    title: 'Frequently Asked Questions',
    slug: '/faq',
    author: 'admin',
    status: 'published',
    date: new Date(Date.now() - 72 * 3600 * 1000).toISOString(),
    commentsCount: 1,
    isFrontPage: false,
    content: 'Everything clients need to know before initiating a development project.',
    template: 'Default Template',
    sections: {
      badge_text: 'Support Center',
      faq_title: 'Frequently Asked Questions'
    }
  },
  {
    id: 'page-request-service',
    title: 'Request a Service',
    slug: '/request-service',
    author: 'admin',
    status: 'published',
    date: new Date(Date.now() - 96 * 3600 * 1000).toISOString(),
    commentsCount: 0,
    isFrontPage: false,
    content: 'Interactive estimation form for bespoke development projects.',
    template: 'Default Template'
  },
  {
    id: 'page-privacy',
    title: 'Sample Page',
    slug: '/sample-page',
    author: 'admin',
    status: 'draft',
    date: new Date(Date.now() - 120 * 3600 * 1000).toISOString(),
    commentsCount: 1,
    isFrontPage: false,
    content: 'Sample draft template page for internal draft reviews.',
    template: 'Default Template'
  }
];

export default function PageManager() {
  const [pages, setPages] = useState<PageItem[]>([]);
  const [loading, setLoading] = useState(true);

  // Filter & Search
  const [activeTab, setActiveTab] = useState<'all' | 'published' | 'draft' | 'trash'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');
  const [dateFilter, setDateFilter] = useState('all');

  // Quick Edit State
  const [quickEditingId, setQuickEditingId] = useState<string | null>(null);
  const [quickEditData, setQuickEditData] = useState<{
    title: string;
    slug: string;
    status: 'published' | 'draft';
    author: string;
    template: string;
  }>({
    title: '',
    slug: '',
    status: 'published',
    author: 'admin',
    template: 'Default Template'
  });

  // Full Editor State (Add New or Edit)
  const [isFullEditing, setIsFullEditing] = useState(false);
  const [editingPage, setEditingPage] = useState<PageItem | null>(null);

  // Screen Options & Help toggles (authentic WP)
  const [showScreenOptions, setShowScreenOptions] = useState(false);
  const [showHelp, setShowHelp] = useState(false);

  useEffect(() => {
    loadPages();
  }, []);

  const loadPages = async () => {
    setLoading(true);
    try {
      // 1. Try to load from localStorage first
      const cached = localStorage.getItem('techfnm_site_pages');
      if (cached) {
        setPages(JSON.parse(cached));
      } else {
        // Also check supabase pages_content for any existing section updates
        const { data: contentData } = await supabase.from('pages_content').select('*');
        const initial = [...DEFAULT_PAGES];

        if (contentData && contentData.length > 0) {
          const heroContent = contentData.find(c => c.id === 'home_hero')?.content;
          if (heroContent) {
            initial[0].sections = { ...initial[0].sections, ...heroContent };
          }
          const faqContent = contentData.find(c => c.id === 'home_faq')?.content;
          if (faqContent) {
            const faqIdx = initial.findIndex(p => p.id === 'page-faq');
            if (faqIdx !== -1) initial[faqIdx].sections = { ...initial[faqIdx].sections, ...faqContent };
          }
        }

        setPages(initial);
        localStorage.setItem('techfnm_site_pages', JSON.stringify(initial));
      }
    } catch (err) {
      console.error(err);
      setPages(DEFAULT_PAGES);
    } finally {
      setLoading(false);
    }
  };

  const savePagesList = (updated: PageItem[]) => {
    setPages(updated);
    localStorage.setItem('techfnm_site_pages', JSON.stringify(updated));
  };

  // Counts for subnav
  const counts = {
    all: pages.filter(p => p.status !== 'trash').length,
    published: pages.filter(p => p.status === 'published').length,
    draft: pages.filter(p => p.status === 'draft').length,
    trash: pages.filter(p => p.status === 'trash').length,
  };

  // Filtered pages list
  const filteredPages = pages.filter((page) => {
    // Status filter
    if (activeTab === 'all' && page.status === 'trash') return false;
    if (activeTab === 'published' && page.status !== 'published') return false;
    if (activeTab === 'draft' && page.status !== 'draft') return false;
    if (activeTab === 'trash' && page.status !== 'trash') return false;

    // Search filter
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchTitle = page.title.toLowerCase().includes(q);
      const matchSlug = page.slug.toLowerCase().includes(q);
      if (!matchTitle && !matchSlug) return false;
    }

    return true;
  });

  // Select all toggle
  const handleSelectAll = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.checked) {
      setSelectedIds(filteredPages.map(p => p.id));
    } else {
      setSelectedIds([]);
    }
  };

  const handleSelectOne = (id: string) => {
    if (selectedIds.includes(id)) {
      setSelectedIds(selectedIds.filter(i => i !== id));
    } else {
      setSelectedIds([...selectedIds, id]);
    }
  };

  // Bulk Actions
  const handleApplyBulkAction = () => {
    if (selectedIds.length === 0) {
      toast.error('No pages selected.');
      return;
    }

    if (bulkAction === 'trash') {
      const updated = pages.map(p => selectedIds.includes(p.id) ? { ...p, status: 'trash' as const } : p);
      savePagesList(updated);
      setSelectedIds([]);
      toast.success(`${selectedIds.length} page(s) moved to Trash.`);
    } else if (bulkAction === 'restore') {
      const updated = pages.map(p => selectedIds.includes(p.id) ? { ...p, status: 'published' as const } : p);
      savePagesList(updated);
      setSelectedIds([]);
      toast.success(`${selectedIds.length} page(s) restored.`);
    } else if (bulkAction === 'delete') {
      if (!window.confirm(`Permanently delete ${selectedIds.length} page(s)?`)) return;
      const updated = pages.filter(p => !selectedIds.includes(p.id));
      savePagesList(updated);
      setSelectedIds([]);
      toast.success(`${selectedIds.length} page(s) deleted permanently.`);
    }
  };

  // Move to trash or delete single
  const handleTrashPage = (page: PageItem) => {
    if (page.status === 'trash') {
      if (!window.confirm(`Permanently delete "${page.title}"?`)) return;
      savePagesList(pages.filter(p => p.id !== page.id));
      toast.success(`"${page.title}" deleted permanently.`);
    } else {
      savePagesList(pages.map(p => p.id === page.id ? { ...p, status: 'trash' } : p));
      toast.success(`"${page.title}" moved to Trash.`);
    }
  };

  const handleRestorePage = (page: PageItem) => {
    savePagesList(pages.map(p => p.id === page.id ? { ...p, status: 'published' } : p));
    toast.success(`"${page.title}" restored.`);
  };

  // Quick Edit Handlers
  const startQuickEdit = (page: PageItem) => {
    setQuickEditingId(page.id);
    setQuickEditData({
      title: page.title,
      slug: page.slug,
      status: page.status === 'trash' ? 'draft' : page.status,
      author: page.author,
      template: page.template || 'Default Template'
    });
  };

  const saveQuickEdit = () => {
    if (!quickEditingId) return;
    const updated = pages.map(p => {
      if (p.id === quickEditingId) {
        return {
          ...p,
          title: quickEditData.title,
          slug: quickEditData.slug.startsWith('/') ? quickEditData.slug : `/${quickEditData.slug}`,
          status: quickEditData.status,
          author: quickEditData.author,
          template: quickEditData.template
        };
      }
      return p;
    });
    savePagesList(updated);
    setQuickEditingId(null);
    toast.success('Page updated successfully.');
  };

  // Full Editor Handlers (Add New or Edit)
  const openFullEditor = (page?: PageItem) => {
    if (page) {
      setEditingPage(page);
    } else {
      // New page template
      setEditingPage({
        id: `page-${Date.now()}`,
        title: '',
        slug: '',
        author: 'admin',
        status: 'published',
        date: new Date().toISOString(),
        commentsCount: 0,
        isFrontPage: false,
        content: '',
        template: 'Default Template'
      });
    }
    setIsFullEditing(true);
  };

  const saveFullEditor = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingPage || !editingPage.title.trim()) {
      toast.error('Please enter a valid page title.');
      return;
    }

    const cleanSlug = editingPage.slug.trim()
      ? (editingPage.slug.startsWith('/') ? editingPage.slug : `/${editingPage.slug}`)
      : `/${editingPage.title.toLowerCase().replace(/\s+/g, '-')}`;

    const updatedPage: PageItem = {
      ...editingPage,
      slug: cleanSlug,
      date: new Date().toISOString()
    };

    const exists = pages.some(p => p.id === updatedPage.id);
    const updatedList = exists
      ? pages.map(p => p.id === updatedPage.id ? updatedPage : p)
      : [updatedPage, ...pages];

    savePagesList(updatedList);

    // Also sync with Supabase if it has sections
    if (updatedPage.sections && updatedPage.id === 'page-home') {
      try {
        await supabase.from('pages_content').upsert({
          id: 'home_hero',
          section_name: 'Homepage Hero',
          content: {
            title: updatedPage.sections.hero_title || 'Your Digital Growth Partner',
            subtitle: updatedPage.sections.hero_subtitle || 'We Build What You Imagine'
          }
        });
      } catch (err) {
        // silent fallback
      }
    }

    setIsFullEditing(false);
    setEditingPage(null);
    toast.success(`Page "${updatedPage.title}" saved successfully!`);
  };

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString('en-US', { year: 'numeric', month: '2-digit', day: '2-digit' }).replace(/\//g, '/');
    } catch {
      return dateStr;
    }
  };

  // If in Full Editor mode, render WordPress Classic / Block style editor
  if (isFullEditing && editingPage) {
    return (
      <div className="space-y-6 font-sans">
        <Toaster position="top-right" toastOptions={{ style: { background: '#18181b', color: '#fff' } }} />

        {/* Top bar back button */}
        <div className="flex items-center justify-between border-b border-zinc-800/80 pb-4">
          <div className="flex items-center gap-3">
            <button
              onClick={() => { setIsFullEditing(false); setEditingPage(null); }}
              className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 text-zinc-400 hover:text-white hover:bg-zinc-850 transition-colors"
              title="Back to Pages"
            >
              <ArrowLeft size={16} />
            </button>
            <div>
              <h2 className="text-xl font-bold text-white flex items-center gap-2">
                <span>{editingPage.title ? `Edit Page: ${editingPage.title}` : 'Add New Page'}</span>
                {editingPage.isFrontPage && (
                  <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-red-950/40 text-red-400 border border-red-900/40">
                    Front Page
                  </span>
                )}
              </h2>
              <p className="text-xs text-zinc-400">Configure page content, permalink, and display templates.</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => { setIsFullEditing(false); setEditingPage(null); }}
              className="px-4 py-2 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-300 text-xs font-semibold border border-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={saveFullEditor}
              className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-bold shadow-lg shadow-red-950/40 transition-all cursor-pointer"
            >
              <Save size={14} />
              <span>{editingPage.status === 'published' ? 'Update Page' : 'Publish'}</span>
            </button>
          </div>
        </div>

        {/* Editor Two-Column Layout */}
        <form onSubmit={saveFullEditor} className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* Main Content Area (2 cols) */}
          <div className="lg:col-span-2 space-y-5">
            {/* Title */}
            <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-5 space-y-3">
              <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                Page Title
              </label>
              <input
                type="text"
                required
                value={editingPage.title}
                onChange={(e) => setEditingPage({ ...editingPage, title: e.target.value })}
                placeholder="Enter title here (e.g. About Us)"
                className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-xl px-4 py-3 text-lg font-bold text-white placeholder-zinc-600 outline-none transition-all"
              />

              {/* Permalink */}
              <div className="flex items-center gap-2 text-xs text-zinc-400 pt-1">
                <span className="font-semibold text-zinc-500">Permalink:</span>
                <span className="text-zinc-600">https://techfnm.com</span>
                <input
                  type="text"
                  value={editingPage.slug}
                  onChange={(e) => setEditingPage({ ...editingPage, slug: e.target.value })}
                  placeholder="/about"
                  className="bg-[#141419] border border-zinc-800 focus:border-red-600/40 rounded px-2 py-1 text-red-400 font-mono text-xs outline-none"
                />
                {editingPage.slug && (
                  <a
                    href={editingPage.slug}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-blue-400 hover:underline flex items-center gap-1"
                  >
                    <span>View</span>
                    <ExternalLink size={11} />
                  </a>
                )}
              </div>
            </div>

            {/* Page Content / Body */}
            <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-5 space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
                <label className="text-xs font-bold text-zinc-400 uppercase tracking-wider block">
                  Page Content / Copy
                </label>
                <span className="text-[11px] text-zinc-500 font-medium">Standard Editor</span>
              </div>
              <textarea
                rows={8}
                value={editingPage.content || ''}
                onChange={(e) => setEditingPage({ ...editingPage, content: e.target.value })}
                placeholder="Write page content, descriptions, or HTML markup here..."
                className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-xl p-4 text-sm text-zinc-200 placeholder-zinc-600 outline-none transition-all resize-y"
              />
            </div>

            {/* Dynamic Section Customizer (Preserving sections feature) */}
            {editingPage.sections && (
              <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-5 space-y-4">
                <div className="flex items-center justify-between border-b border-zinc-800/80 pb-2.5">
                  <div className="flex items-center gap-2">
                    <Layers size={16} className="text-red-400" />
                    <h3 className="text-xs font-bold text-zinc-300 uppercase tracking-wider">
                      Dynamic Section Variables
                    </h3>
                  </div>
                  <span className="text-[10px] font-bold text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded border border-emerald-900/30">
                    Live Reactive
                  </span>
                </div>

                <div className="space-y-3">
                  {Object.entries(editingPage.sections).map(([k, val]: any) => (
                    <div key={k} className="space-y-1">
                      <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">
                        {k.replace(/_/g, ' ')}
                      </label>
                      <input
                        type="text"
                        value={val || ''}
                        onChange={(e) => setEditingPage({
                          ...editingPage,
                          sections: { ...editingPage.sections, [k]: e.target.value }
                        })}
                        className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/40 rounded-xl px-3.5 py-2.5 text-xs text-zinc-200 outline-none"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Area (1 col) - WordPress style Publish & Page Attributes */}
          <div className="space-y-5">
            {/* Publish Box */}
            <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-lg">
              <div className="px-4 py-3 bg-[#121217] border-b border-zinc-800/80 flex items-center justify-between">
                <span className="font-bold text-xs uppercase tracking-wider text-zinc-300">Publish</span>
                <span className={`w-2 h-2 rounded-full ${editingPage.status === 'published' ? 'bg-emerald-400' : 'bg-amber-400'}`} />
              </div>

              <div className="p-4 space-y-4 text-xs">
                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 font-medium">Status:</span>
                  <select
                    value={editingPage.status}
                    onChange={(e) => setEditingPage({ ...editingPage, status: e.target.value as any })}
                    className="bg-[#141419] border border-zinc-800 rounded-lg px-2.5 py-1 text-zinc-200 outline-none"
                  >
                    <option value="published">Published</option>
                    <option value="draft">Draft</option>
                  </select>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 font-medium">Visibility:</span>
                  <span className="text-zinc-200 font-semibold">Public</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 font-medium">Author:</span>
                  <span className="text-zinc-200 font-semibold">{editingPage.author}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-zinc-400 font-medium">Front Page:</span>
                  <button
                    type="button"
                    onClick={() => setEditingPage({ ...editingPage, isFrontPage: !editingPage.isFrontPage })}
                    className={`px-2.5 py-1 rounded-md text-[11px] font-bold border transition-colors ${
                      editingPage.isFrontPage
                        ? 'bg-red-950/40 text-red-400 border-red-900/40'
                        : 'bg-zinc-900 text-zinc-500 border-zinc-800'
                    }`}
                  >
                    {editingPage.isFrontPage ? 'Yes (Front Page)' : 'No'}
                  </button>
                </div>

                <div className="pt-3 border-t border-zinc-800 flex justify-between items-center">
                  <button
                    type="button"
                    onClick={() => { handleTrashPage(editingPage); setIsFullEditing(false); }}
                    className="text-red-400 hover:text-red-300 text-xs font-semibold hover:underline"
                  >
                    Move to Trash
                  </button>

                  <button
                    type="submit"
                    className="px-4 py-2 rounded-xl bg-red-600 hover:bg-red-500 text-white font-bold text-xs transition-all cursor-pointer"
                  >
                    {editingPage.status === 'published' ? 'Update' : 'Publish'}
                  </button>
                </div>
              </div>
            </div>

            {/* Page Attributes */}
            <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-lg">
              <div className="px-4 py-3 bg-[#121217] border-b border-zinc-800/80">
                <span className="font-bold text-xs uppercase tracking-wider text-zinc-300">Page Attributes</span>
              </div>
              <div className="p-4 space-y-3 text-xs">
                <label className="text-zinc-400 font-medium block">Template</label>
                <select
                  value={editingPage.template || 'Default Template'}
                  onChange={(e) => setEditingPage({ ...editingPage, template: e.target.value })}
                  className="w-full bg-[#141419] border border-zinc-800 rounded-lg px-3 py-2 text-zinc-200 outline-none"
                >
                  <option value="Default Template">Default Template</option>
                  <option value="Front Page">Front Page Template</option>
                  <option value="Full Width">Full Width Page</option>
                  <option value="Contact Form Page">Contact Form Page</option>
                </select>
              </div>
            </div>

          </div>

        </form>
      </div>
    );
  }

  // DEFAULT VIEW: Exact WordPress Pages Table View
  return (
    <div className="space-y-4 font-sans text-zinc-200">
      <Toaster position="top-right" toastOptions={{ style: { background: '#18181b', color: '#fff' } }} />

      {/* TOP HEADER: Pages + Add New button + Screen Options & Help */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-3">
        <div className="flex items-center gap-3">
          <h1 className="text-2xl font-bold text-white tracking-tight">Pages</h1>
          <button
            onClick={() => openFullEditor()}
            className="px-3 py-1 bg-[#1a1d24] hover:bg-red-600 hover:text-white text-red-400 border border-red-500/30 rounded-lg text-xs font-semibold transition-all cursor-pointer flex items-center gap-1.5 shadow-sm"
          >
            <Plus size={13} />
            <span>Add New</span>
          </button>
        </div>

        {/* Screen Options & Help Toggles */}
        <div className="flex items-center gap-2 text-xs">
          <div className="relative">
            <button
              onClick={() => { setShowScreenOptions(!showScreenOptions); setShowHelp(false); }}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors text-[11px]"
            >
              <SlidersHorizontal size={12} />
              <span>Screen Options</span>
              <ChevronDown size={11} className={`transition-transform ${showScreenOptions ? 'rotate-180' : ''}`} />
            </button>
            {showScreenOptions && (
              <div className="absolute right-0 mt-1.5 w-64 bg-[#141419] border border-zinc-800 rounded-xl p-3.5 shadow-2xl z-30 text-xs space-y-2">
                <span className="font-bold text-zinc-300 block border-b border-zinc-800 pb-1.5 text-[11px] uppercase tracking-wider">
                  Columns Displayed
                </span>
                <label className="flex items-center gap-2 text-zinc-300 text-xs cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-red-600 rounded" />
                  <span>Author</span>
                </label>
                <label className="flex items-center gap-2 text-zinc-300 text-xs cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-red-600 rounded" />
                  <span>Comments</span>
                </label>
                <label className="flex items-center gap-2 text-zinc-300 text-xs cursor-pointer">
                  <input type="checkbox" defaultChecked className="accent-red-600 rounded" />
                  <span>Date</span>
                </label>
              </div>
            )}
          </div>

          <div className="relative">
            <button
              onClick={() => { setShowHelp(!showHelp); setShowScreenOptions(false); }}
              className="flex items-center gap-1 px-2.5 py-1 rounded bg-zinc-900 hover:bg-zinc-850 text-zinc-400 hover:text-zinc-200 border border-zinc-800 transition-colors text-[11px]"
            >
              <HelpCircle size={12} />
              <span>Help</span>
              <ChevronDown size={11} className={`transition-transform ${showHelp ? 'rotate-180' : ''}`} />
            </button>
            {showHelp && (
              <div className="absolute right-0 mt-1.5 w-72 bg-[#141419] border border-zinc-800 rounded-xl p-3.5 shadow-2xl z-30 text-xs space-y-2">
                <span className="font-bold text-zinc-300 block border-b border-zinc-800 pb-1.5 text-[11px] uppercase tracking-wider">
                  Pages Overview
                </span>
                <p className="text-zinc-400 text-xs leading-relaxed">
                  Pages are distinct from blog posts. They are static hierarchical documents used for Home, About, Services, Portfolio, and Contact.
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* SUBNAV / STATUS FILTERS */}
      <div className="flex items-center gap-2 text-xs text-zinc-400 border-b border-zinc-800/80 pb-2">
        <button
          onClick={() => setActiveTab('all')}
          className={`transition-colors cursor-pointer ${
            activeTab === 'all' ? 'text-red-400 font-bold' : 'hover:text-zinc-200'
          }`}
        >
          All <span className="text-zinc-500">({counts.all})</span>
        </button>
        <span className="text-zinc-700">|</span>

        <button
          onClick={() => setActiveTab('published')}
          className={`transition-colors cursor-pointer ${
            activeTab === 'published' ? 'text-red-400 font-bold' : 'hover:text-zinc-200'
          }`}
        >
          Published <span className="text-zinc-500">({counts.published})</span>
        </button>
        <span className="text-zinc-700">|</span>

        <button
          onClick={() => setActiveTab('draft')}
          className={`transition-colors cursor-pointer ${
            activeTab === 'draft' ? 'text-red-400 font-bold' : 'hover:text-zinc-200'
          }`}
        >
          Drafts <span className="text-zinc-500">({counts.draft})</span>
        </button>

        {counts.trash > 0 && (
          <>
            <span className="text-zinc-700">|</span>
            <button
              onClick={() => setActiveTab('trash')}
              className={`transition-colors cursor-pointer ${
                activeTab === 'trash' ? 'text-red-400 font-bold' : 'hover:text-zinc-200'
              }`}
            >
              Trash <span className="text-zinc-500">({counts.trash})</span>
            </button>
          </>
        )}
      </div>

      {/* TOP CONTROLS & SEARCH BAR */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs">
        {/* Bulk action & dates */}
        <div className="flex flex-wrap items-center gap-2 w-full sm:w-auto">
          <select
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            className="bg-[#121217] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-300 outline-none text-xs"
          >
            <option value="">Bulk Actions</option>
            {activeTab === 'trash' ? (
              <>
                <option value="restore">Restore</option>
                <option value="delete">Delete Permanently</option>
              </>
            ) : (
              <>
                <option value="trash">Move to Trash</option>
              </>
            )}
          </select>
          <button
            onClick={handleApplyBulkAction}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 font-medium transition-colors cursor-pointer"
          >
            Apply
          </button>

          <select
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="bg-[#121217] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-300 outline-none text-xs"
          >
            <option value="all">All dates</option>
            <option value="march2026">March 2026</option>
            <option value="feb2026">February 2026</option>
          </select>
          <button
            onClick={() => toast('Date filtering applied')}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 font-medium transition-colors cursor-pointer"
          >
            Filter
          </button>
        </div>

        {/* Search input & items counter */}
        <div className="flex items-center gap-2 w-full sm:w-auto justify-between sm:justify-end">
          <div className="flex items-center gap-1.5">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search Pages..."
              className="bg-[#121217] border border-zinc-800 focus:border-red-600/40 rounded-lg px-3 py-1.5 text-xs text-zinc-200 placeholder-zinc-500 outline-none w-40 sm:w-48 transition-all"
            />
            <button
              onClick={() => {}}
              className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 font-medium text-xs transition-colors cursor-pointer"
            >
              Search Pages
            </button>
          </div>
          <span className="text-xs text-zinc-400 whitespace-nowrap">
            {filteredPages.length} items
          </span>
        </div>
      </div>

      {/* WORDPRESS DATA TABLE */}
      <div className="rounded-2xl border border-zinc-800/90 overflow-hidden bg-[#0e0e12] shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs text-zinc-300 border-collapse">
            {/* Table Header */}
            <thead className="bg-[#14141a] text-zinc-400 font-bold border-b border-zinc-800 select-none">
              <tr>
                <th className="w-10 px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={filteredPages.length > 0 && selectedIds.length === filteredPages.length}
                    onChange={handleSelectAll}
                    className="accent-red-600 rounded cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 font-semibold text-zinc-300">Title</th>
                <th className="px-4 py-3 font-semibold text-zinc-400 w-36">Author</th>
                <th className="px-4 py-3 font-semibold text-zinc-400 w-20 text-center">
                  <MessageSquare size={13} className="mx-auto text-zinc-500" />
                </th>
                <th className="px-4 py-3 font-semibold text-zinc-400 w-44">Date</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-zinc-800/60">
              {loading ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-500 font-mono text-xs">
                    Loading pages database...
                  </td>
                </tr>
              ) : filteredPages.length === 0 ? (
                <tr>
                  <td colSpan={5} className="py-12 text-center text-zinc-400">
                    <p className="font-semibold text-zinc-300 text-sm">No pages found.</p>
                    <p className="text-xs text-zinc-500 mt-1">Try changing search query or status filter.</p>
                  </td>
                </tr>
              ) : (
                filteredPages.map((page) => {
                  const isQuickEditing = quickEditingId === page.id;
                  const isSelected = selectedIds.includes(page.id);

                  return (
                    <React.Fragment key={page.id}>
                      <tr className={`group transition-colors ${
                        isSelected ? 'bg-red-950/20' : 'hover:bg-[#16161d]/70'
                      }`}>
                        {/* Checkbox */}
                        <td className="px-4 py-3.5 text-center align-top">
                          <input
                            type="checkbox"
                            checked={isSelected}
                            onChange={() => handleSelectOne(page.id)}
                            className="accent-red-600 rounded cursor-pointer mt-1"
                          />
                        </td>

                        {/* Title & Action links */}
                        <td className="px-4 py-3.5 align-top">
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <button
                                onClick={() => openFullEditor(page)}
                                className="font-bold text-sm text-[#58a6ff] hover:text-[#79c0ff] hover:underline text-left cursor-pointer"
                              >
                                {page.title}
                              </button>
                              {page.isFrontPage && (
                                <span className="text-[11px] text-zinc-400 font-normal italic">
                                  — Front Page
                                </span>
                              )}
                              {page.status === 'draft' && (
                                <span className="text-[11px] text-amber-400/90 font-medium">
                                  — Draft
                                </span>
                              )}
                            </div>

                            {/* WordPress Hover Action Links */}
                            <div className="flex items-center gap-2 text-[11px] text-zinc-500 opacity-80 group-hover:opacity-100 transition-opacity">
                              {page.status === 'trash' ? (
                                <>
                                  <button
                                    onClick={() => handleRestorePage(page)}
                                    className="text-emerald-400 hover:underline cursor-pointer"
                                  >
                                    Restore
                                  </button>
                                  <span>|</span>
                                  <button
                                    onClick={() => handleTrashPage(page)}
                                    className="text-red-400 hover:underline cursor-pointer"
                                  >
                                    Delete Permanently
                                  </button>
                                </>
                              ) : (
                                <>
                                  <button
                                    onClick={() => openFullEditor(page)}
                                    className="text-[#58a6ff] hover:underline cursor-pointer"
                                  >
                                    Edit
                                  </button>
                                  <span>|</span>
                                  <button
                                    onClick={() => startQuickEdit(page)}
                                    className="text-[#58a6ff] hover:underline cursor-pointer"
                                  >
                                    Quick Edit
                                  </button>
                                  <span>|</span>
                                  <button
                                    onClick={() => handleTrashPage(page)}
                                    className="text-red-400 hover:underline cursor-pointer"
                                  >
                                    Trash
                                  </button>
                                  <span>|</span>
                                  <a
                                    href={page.slug}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-[#58a6ff] hover:underline flex items-center gap-0.5 cursor-pointer"
                                  >
                                    <span>View</span>
                                    <ExternalLink size={9} />
                                  </a>
                                </>
                              )}
                            </div>
                          </div>
                        </td>

                        {/* Author */}
                        <td className="px-4 py-3.5 align-top text-zinc-400 font-medium">
                          <span className="text-[#58a6ff] hover:underline cursor-pointer">
                            {page.author}
                          </span>
                        </td>

                        {/* Comments */}
                        <td className="px-4 py-3.5 align-top text-center text-zinc-500">
                          {page.commentsCount > 0 ? (
                            <span className="inline-flex items-center justify-center px-1.5 py-0.5 rounded-full text-[10px] font-bold bg-zinc-800 text-zinc-300">
                              {page.commentsCount}
                            </span>
                          ) : (
                            <span>—</span>
                          )}
                        </td>

                        {/* Date */}
                        <td className="px-4 py-3.5 align-top">
                          <div className="space-y-0.5">
                            <span className="text-zinc-300 block font-medium">
                              {page.status === 'published' ? 'Published' : 'Last Modified'}
                            </span>
                            <span className="text-[11px] text-zinc-500 font-mono block">
                              {formatDate(page.date)}
                            </span>
                          </div>
                        </td>
                      </tr>

                      {/* INLINE QUICK EDIT ROW (WordPress exact) */}
                      {isQuickEditing && (
                        <tr className="bg-[#121217] border-y-2 border-red-600/40">
                          <td colSpan={5} className="p-5">
                            <div className="space-y-4">
                              <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
                                <span className="font-bold text-xs uppercase tracking-wider text-red-400">
                                  Quick Edit: {page.title}
                                </span>
                                <button
                                  onClick={() => setQuickEditingId(null)}
                                  className="text-zinc-500 hover:text-white"
                                >
                                  <X size={14} />
                                </button>
                              </div>

                              <div className="grid grid-cols-1 md:grid-cols-3 gap-4 text-xs">
                                {/* Title & Slug */}
                                <div className="space-y-2">
                                  <label className="text-zinc-400 font-semibold block">Title</label>
                                  <input
                                    type="text"
                                    value={quickEditData.title}
                                    onChange={(e) => setQuickEditData({ ...quickEditData, title: e.target.value })}
                                    className="w-full bg-[#17171f] border border-zinc-700 rounded px-3 py-1.5 text-zinc-200 outline-none focus:border-red-500"
                                  />

                                  <label className="text-zinc-400 font-semibold block pt-1">Slug</label>
                                  <input
                                    type="text"
                                    value={quickEditData.slug}
                                    onChange={(e) => setQuickEditData({ ...quickEditData, slug: e.target.value })}
                                    className="w-full bg-[#17171f] border border-zinc-700 rounded px-3 py-1.5 text-zinc-200 font-mono outline-none focus:border-red-500"
                                  />
                                </div>

                                {/* Author & Status */}
                                <div className="space-y-2">
                                  <label className="text-zinc-400 font-semibold block">Author</label>
                                  <select
                                    value={quickEditData.author}
                                    onChange={(e) => setQuickEditData({ ...quickEditData, author: e.target.value })}
                                    className="w-full bg-[#17171f] border border-zinc-700 rounded px-3 py-1.5 text-zinc-200 outline-none"
                                  >
                                    <option value="admin">admin</option>
                                    <option value="editor">editor</option>
                                  </select>

                                  <label className="text-zinc-400 font-semibold block pt-1">Status</label>
                                  <select
                                    value={quickEditData.status}
                                    onChange={(e) => setQuickEditData({ ...quickEditData, status: e.target.value as any })}
                                    className="w-full bg-[#17171f] border border-zinc-700 rounded px-3 py-1.5 text-zinc-200 outline-none"
                                  >
                                    <option value="published">Published</option>
                                    <option value="draft">Draft</option>
                                  </select>
                                </div>

                                {/* Template */}
                                <div className="space-y-2">
                                  <label className="text-zinc-400 font-semibold block">Template</label>
                                  <select
                                    value={quickEditData.template}
                                    onChange={(e) => setQuickEditData({ ...quickEditData, template: e.target.value })}
                                    className="w-full bg-[#17171f] border border-zinc-700 rounded px-3 py-1.5 text-zinc-200 outline-none"
                                  >
                                    <option value="Default Template">Default Template</option>
                                    <option value="Front Page">Front Page</option>
                                    <option value="Full Width">Full Width</option>
                                  </select>
                                </div>
                              </div>

                              {/* Quick Edit Action Buttons */}
                              <div className="flex items-center justify-between pt-3 border-t border-zinc-800">
                                <button
                                  type="button"
                                  onClick={() => setQuickEditingId(null)}
                                  className="px-4 py-1.5 rounded bg-zinc-850 hover:bg-zinc-800 text-zinc-300 border border-zinc-700 font-semibold text-xs transition-colors cursor-pointer"
                                >
                                  Cancel
                                </button>
                                <button
                                  type="button"
                                  onClick={saveQuickEdit}
                                  className="px-5 py-1.5 rounded bg-red-600 hover:bg-red-500 text-white font-bold text-xs shadow-md shadow-red-950/40 transition-colors cursor-pointer"
                                >
                                  Update
                                </button>
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </React.Fragment>
                  );
                })
              )}
            </tbody>

            {/* Table Footer (Classic WordPress repeating header) */}
            <tfoot className="bg-[#14141a] text-zinc-400 font-bold border-t border-zinc-800 select-none">
              <tr>
                <th className="w-10 px-4 py-3 text-center">
                  <input
                    type="checkbox"
                    checked={filteredPages.length > 0 && selectedIds.length === filteredPages.length}
                    onChange={handleSelectAll}
                    className="accent-red-600 rounded cursor-pointer"
                  />
                </th>
                <th className="px-4 py-3 font-semibold text-zinc-300">Title</th>
                <th className="px-4 py-3 font-semibold text-zinc-400">Author</th>
                <th className="px-4 py-3 font-semibold text-zinc-400 text-center">
                  <MessageSquare size={13} className="mx-auto text-zinc-500" />
                </th>
                <th className="px-4 py-3 font-semibold text-zinc-400">Date</th>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* BOTTOM CONTROLS (Classic WordPress Bulk Actions bar repeat) */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 text-xs pt-1">
        <div className="flex items-center gap-2">
          <select
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            className="bg-[#121217] border border-zinc-800 rounded-lg px-2.5 py-1.5 text-zinc-300 outline-none text-xs"
          >
            <option value="">Bulk Actions</option>
            {activeTab === 'trash' ? (
              <>
                <option value="restore">Restore</option>
                <option value="delete">Delete Permanently</option>
              </>
            ) : (
              <>
                <option value="trash">Move to Trash</option>
              </>
            )}
          </select>
          <button
            onClick={handleApplyBulkAction}
            className="px-3 py-1.5 rounded-lg bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 font-medium transition-colors cursor-pointer"
          >
            Apply
          </button>
        </div>

        <span className="text-xs text-zinc-500">
          {filteredPages.length} items
        </span>
      </div>

      {/* WORDPRESS FOOTER BANNER */}
      <div className="pt-6 border-t border-zinc-800/60 flex flex-col sm:flex-row items-center justify-between gap-2 text-[11px] text-zinc-400">
        <p>
          Thank you for creating with <span className="text-white font-medium">WordPress</span> & <span className="text-red-400 font-bold">TechFNM Console</span>.
        </p>
        <span className="font-mono text-zinc-400">Version 6.4.2</span>
      </div>

    </div>
  );
}

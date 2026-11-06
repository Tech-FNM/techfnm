import React, { useEffect, useState } from 'react';
import {
  Code2,
  Plus,
  Trash2,
  Edit3,
  Copy,
  Check,
  Search,
  Filter,
  Save,
  ArrowLeft,
  ToggleLeft,
  ToggleRight,
  HelpCircle,
  FileCode,
  Tag,
  Clock,
  Sparkles,
  ExternalLink,
  AlertTriangle,
  Play
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast, Toaster } from 'react-hot-toast';

export type SnippetType = 'html' | 'javascript' | 'css' | 'text';
export type SnippetLocation = 'head' | 'body_top' | 'body_bottom' | 'footer';

export interface SnippetItem {
  id: string;
  title: string;
  description?: string;
  code: string;
  codeType: SnippetType;
  location: SnippetLocation;
  active: boolean;
  priority: number;
  tags: string[];
  createdAt: string;
  updatedAt: string;
}

const PRESET_LIBRARY: Array<Omit<SnippetItem, 'id' | 'createdAt' | 'updatedAt'>> = [
  {
    title: 'Google Analytics 4 (GA4)',
    description: 'Track visitor traffic and engagement metrics',
    codeType: 'html',
    location: 'head',
    active: true,
    priority: 10,
    tags: ['analytics', 'google', 'tracking'],
    code: `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>`
  },
  {
    title: 'Google Tag Manager (GTM Head)',
    description: 'Centralized tag management script for header',
    codeType: 'html',
    location: 'head',
    active: true,
    priority: 1,
    tags: ['analytics', 'gtm', 'marketing'],
    code: `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
<!-- End Google Tag Manager -->`
  },
  {
    title: 'Google Tag Manager (Body NoScript)',
    description: 'Fallback iframe for users with JavaScript disabled',
    codeType: 'html',
    location: 'body_top',
    active: true,
    priority: 1,
    tags: ['gtm', 'noscript'],
    code: `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`
  },
  {
    title: 'Meta (Facebook) Pixel',
    description: 'Track ad conversions and build custom audiences',
    codeType: 'html',
    location: 'head',
    active: true,
    priority: 15,
    tags: ['marketing', 'facebook', 'pixel'],
    code: `<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f.fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>`
  },
  {
    title: 'Google Search Console Verification',
    description: 'HTML meta tag for site ownership verification',
    codeType: 'html',
    location: 'head',
    active: true,
    priority: 20,
    tags: ['seo', 'verification', 'google'],
    code: `<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE_HERE" />`
  },
  {
    title: 'Tawk.to Live Chat Widget',
    description: 'Customer support live chat loaded at bottom of page',
    codeType: 'html',
    location: 'body_bottom',
    active: true,
    priority: 30,
    tags: ['chat', 'support', 'widget'],
    code: `<!-- Start of Tawk.to Script -->
<script type="text/javascript">
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/YOUR_PROPERTY_ID/default';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
</script>
<!-- End of Tawk.to Script -->`
  },
  {
    title: 'Custom Brand CSS Styles',
    description: 'Global CSS overrides and typography tweaks',
    codeType: 'css',
    location: 'head',
    active: true,
    priority: 50,
    tags: ['css', 'styling'],
    code: `/* WordPress-style Custom CSS */
:root {
  --wp-custom-accent: #2271b1;
}`
  }
];

export default function CustomSnippetsManager() {
  const [snippets, setSnippets] = useState<SnippetItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [viewMode, setViewMode] = useState<'list' | 'editor'>('list');
  const [selectedSnippet, setSelectedSnippet] = useState<SnippetItem | null>(null);

  // Filters & Search
  const [searchQuery, setSearchQuery] = useState('');
  const [filterStatus, setFilterStatus] = useState<'all' | 'active' | 'inactive'>('all');
  const [filterLocation, setFilterLocation] = useState<'all' | SnippetLocation>('all');
  const [selectedIds, setSelectedIds] = useState<string[]>([]);
  const [bulkAction, setBulkAction] = useState('');

  // Editor Form State
  const [formTitle, setFormTitle] = useState('');
  const [formDescription, setFormDescription] = useState('');
  const [formCode, setFormCode] = useState('');
  const [formCodeType, setFormCodeType] = useState<SnippetType>('html');
  const [formLocation, setFormLocation] = useState<SnippetLocation>('head');
  const [formActive, setFormActive] = useState(true);
  const [formPriority, setFormPriority] = useState(10);
  const [formTags, setFormTags] = useState('');
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSnippets();
  }, []);

  const fetchSnippets = async () => {
    try {
      setLoading(true);

      // Check localStorage first
      const local = localStorage.getItem('techfnm_wp_snippets');
      if (local) {
        try {
          const parsed = JSON.parse(local);
          if (Array.isArray(parsed) && parsed.length > 0) {
            setSnippets(parsed);
          }
        } catch {}
      }

      // Fetch from Supabase site_settings table
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'custom_scripts')
        .maybeSingle();

      if (!error && data && data.content) {
        const c = data.content;
        // If content has WordPress structured items array
        if (Array.isArray(c.snippets_list) && c.snippets_list.length > 0) {
          setSnippets(c.snippets_list);
          localStorage.setItem('techfnm_wp_snippets', JSON.stringify(c.snippets_list));
        } else if (c.head || c.bodyTop || c.bodyBottom || c.footer) {
          // Convert legacy raw buckets into individual WP snippet entries
          const migrated: SnippetItem[] = [];
          if (c.head) {
            migrated.push({
              id: 'snip-head-1',
              title: 'Header Injected Scripts',
              description: 'Migrated from Header bucket',
              code: c.head,
              codeType: 'html',
              location: 'head',
              active: true,
              priority: 10,
              tags: ['head', 'migrated'],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
          if (c.bodyTop) {
            migrated.push({
              id: 'snip-bodytop-1',
              title: 'Body Top Scripts',
              description: 'Migrated from Body Top bucket',
              code: c.bodyTop,
              codeType: 'html',
              location: 'body_top',
              active: true,
              priority: 10,
              tags: ['body', 'migrated'],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
          if (c.bodyBottom) {
            migrated.push({
              id: 'snip-bodybottom-1',
              title: 'Body Bottom Scripts',
              description: 'Migrated from Body Bottom bucket',
              code: c.bodyBottom,
              codeType: 'html',
              location: 'body_bottom',
              active: true,
              priority: 10,
              tags: ['footer', 'migrated'],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
          if (c.footer) {
            migrated.push({
              id: 'snip-footer-1',
              title: 'Footer Injected Scripts',
              description: 'Migrated from Footer bucket',
              code: c.footer,
              codeType: 'html',
              location: 'footer',
              active: true,
              priority: 10,
              tags: ['footer', 'migrated'],
              createdAt: new Date().toISOString(),
              updatedAt: new Date().toISOString(),
            });
          }
          if (migrated.length > 0) {
            setSnippets(migrated);
            localStorage.setItem('techfnm_wp_snippets', JSON.stringify(migrated));
          }
        }
      }
    } catch (err) {
      console.error('Error fetching WP snippets:', err);
    } finally {
      setLoading(false);
    }
  };

  // Compile active snippets into the 4 target locations for ScriptInjector.tsx
  const syncToTargetLocationsAndSave = async (updatedList: SnippetItem[]) => {
    // Sort by priority asc
    const sorted = [...updatedList].sort((a, b) => a.priority - b.priority);

    let headCode = '';
    let bodyTopCode = '';
    let bodyBottomCode = '';
    let footerCode = '';

    sorted.forEach((snip) => {
      if (!snip.active) return;
      let snippetRaw = snip.code.trim();
      if (!snippetRaw) return;

      // Wrap pure css in style tag if not already wrapped
      if (snip.codeType === 'css' && !snippetRaw.toLowerCase().startsWith('<style')) {
        snippetRaw = `<style data-snippet-id="${snip.id}">\n${snippetRaw}\n</style>`;
      }
      // Wrap pure js in script tag if not already wrapped
      if (snip.codeType === 'javascript' && !snippetRaw.toLowerCase().startsWith('<script')) {
        snippetRaw = `<script data-snippet-id="${snip.id}">\n${snippetRaw}\n</script>`;
      }

      const commentWrap = `\n<!-- [Snippet: ${snip.title}] -->\n${snippetRaw}\n`;

      if (snip.location === 'head') headCode += commentWrap;
      else if (snip.location === 'body_top') bodyTopCode += commentWrap;
      else if (snip.location === 'body_bottom') bodyBottomCode += commentWrap;
      else if (snip.location === 'footer') footerCode += commentWrap;
    });

    const payload = {
      id: 'custom_scripts',
      key: 'custom_scripts',
      content: {
        head: headCode,
        bodyTop: bodyTopCode,
        bodyBottom: bodyBottomCode,
        footer: footerCode,
        snippets_list: updatedList,
      },
      updated_at: new Date().toISOString(),
    };

    localStorage.setItem('techfnm_wp_snippets', JSON.stringify(updatedList));
    localStorage.setItem('techfnm_custom_scripts', JSON.stringify(payload.content));

    const { error } = await supabase.from('site_settings').upsert([payload]);
    if (error) console.warn('Supabase save warning:', error);

    window.dispatchEvent(new CustomEvent('techfnm_scripts_updated', { detail: payload.content }));
  };

  const handleToggleActive = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = snippets.map((s) => (s.id === id ? { ...s, active: !s.active } : s));
    setSnippets(updated);
    await syncToTargetLocationsAndSave(updated);
    const target = updated.find((s) => s.id === id);
    toast.success(`Snippet "${target?.title}" is now ${target?.active ? 'ACTIVE' : 'INACTIVE'}`);
  };

  const handleDelete = async (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (!window.confirm('Are you sure you want to delete this snippet?')) return;
    const updated = snippets.filter((s) => s.id !== id);
    setSnippets(updated);
    await syncToTargetLocationsAndSave(updated);
    toast.success('Snippet deleted successfully');
  };

  const handleOpenAdd = () => {
    setSelectedSnippet(null);
    setFormTitle('');
    setFormDescription('');
    setFormCode('');
    setFormCodeType('html');
    setFormLocation('head');
    setFormActive(true);
    setFormPriority(10);
    setFormTags('');
    setViewMode('editor');
  };

  const handleOpenEdit = (item: SnippetItem) => {
    setSelectedSnippet(item);
    setFormTitle(item.title);
    setFormDescription(item.description || '');
    setFormCode(item.code);
    setFormCodeType(item.codeType || 'html');
    setFormLocation(item.location || 'head');
    setFormActive(item.active);
    setFormPriority(item.priority || 10);
    setFormTags((item.tags || []).join(', '));
    setViewMode('editor');
  };

  const handleClone = async (item: SnippetItem, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const cloned: SnippetItem = {
      ...item,
      id: `snip-${Date.now()}`,
      title: `${item.title} (Copy)`,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };
    const updated = [cloned, ...snippets];
    setSnippets(updated);
    await syncToTargetLocationsAndSave(updated);
    toast.success(`Cloned "${item.title}"`);
  };

  const handleSaveForm = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) {
      toast.error('Snippet title is required');
      return;
    }

    setSaving(true);
    try {
      const now = new Date().toISOString();
      const tagsArray = formTags
        .split(',')
        .map((t) => t.trim())
        .filter(Boolean);

      let updatedList: SnippetItem[];

      if (selectedSnippet) {
        // Edit
        updatedList = snippets.map((s) =>
          s.id === selectedSnippet.id
            ? {
                ...s,
                title: formTitle,
                description: formDescription,
                code: formCode,
                codeType: formCodeType,
                location: formLocation,
                active: formActive,
                priority: Number(formPriority) || 10,
                tags: tagsArray,
                updatedAt: now,
              }
            : s
        );
        toast.success(`Snippet "${formTitle}" updated!`);
      } else {
        // Create new
        const newSnippet: SnippetItem = {
          id: `snip-${Date.now()}`,
          title: formTitle,
          description: formDescription,
          code: formCode,
          codeType: formCodeType,
          location: formLocation,
          active: formActive,
          priority: Number(formPriority) || 10,
          tags: tagsArray,
          createdAt: now,
          updatedAt: now,
        };
        updatedList = [newSnippet, ...snippets];
        toast.success(`Snippet "${formTitle}" created and activated!`);
      }

      setSnippets(updatedList);
      await syncToTargetLocationsAndSave(updatedList);
      setViewMode('list');
    } catch (err: any) {
      console.error('Error saving snippet:', err);
      toast.error(err.message || 'Error saving snippet');
    } finally {
      setSaving(false);
    }
  };

  const handleApplyPreset = (tpl: typeof PRESET_LIBRARY[number]) => {
    setFormTitle(tpl.title);
    setFormDescription(tpl.description || '');
    setFormCode(tpl.code);
    setFormCodeType(tpl.codeType);
    setFormLocation(tpl.location);
    setFormActive(tpl.active);
    setFormPriority(tpl.priority);
    setFormTags(tpl.tags.join(', '));
    toast.success(`Loaded preset "${tpl.title}"`);
  };

  const handleBulkAction = async () => {
    if (!bulkAction || selectedIds.length === 0) return;

    if (bulkAction === 'delete') {
      if (!window.confirm(`Delete ${selectedIds.length} selected snippets?`)) return;
      const updated = snippets.filter((s) => !selectedIds.includes(s.id));
      setSnippets(updated);
      setSelectedIds([]);
      await syncToTargetLocationsAndSave(updated);
      toast.success('Selected snippets deleted');
    } else if (bulkAction === 'activate') {
      const updated = snippets.map((s) => (selectedIds.includes(s.id) ? { ...s, active: true } : s));
      setSnippets(updated);
      setSelectedIds([]);
      await syncToTargetLocationsAndSave(updated);
      toast.success('Selected snippets activated');
    } else if (bulkAction === 'deactivate') {
      const updated = snippets.map((s) => (selectedIds.includes(s.id) ? { ...s, active: false } : s));
      setSnippets(updated);
      setSelectedIds([]);
      await syncToTargetLocationsAndSave(updated);
      toast.success('Selected snippets deactivated');
    }
    setBulkAction('');
  };

  const toggleSelectAll = () => {
    if (selectedIds.length === filteredSnippets.length) {
      setSelectedIds([]);
    } else {
      setSelectedIds(filteredSnippets.map((s) => s.id));
    }
  };

  // Filtered List
  const filteredSnippets = snippets.filter((s) => {
    const matchesSearch =
      s.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (s.description && s.description.toLowerCase().includes(searchQuery.toLowerCase())) ||
      s.code.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.tags.some((t) => t.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesStatus =
      filterStatus === 'all' ? true : filterStatus === 'active' ? s.active : !s.active;

    const matchesLocation = filterLocation === 'all' ? true : s.location === filterLocation;

    return matchesSearch && matchesStatus && matchesLocation;
  });

  const activeCount = snippets.filter((s) => s.active).length;
  const inactiveCount = snippets.filter((s) => !s.active).length;

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24 text-zinc-400 font-mono text-sm">
        <div className="w-5 h-5 border-2 border-red-500 border-t-transparent rounded-full animate-spin mr-3" />
        Loading WordPress Snippets Manager...
      </div>
    );
  }

  // ==========================================
  // VIEW 1: WORDPRESS-STYLE CODE EDITOR VIEW
  // ==========================================
  if (viewMode === 'editor') {
    return (
      <div className="space-y-5 max-w-6xl">
        <Toaster position="top-right" toastOptions={{ style: { background: '#18181b', color: '#fff' } }} />

        {/* Top WP Action Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 bg-zinc-900 border border-zinc-800 p-4 rounded-2xl shadow-md">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="flex items-center gap-2 bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-3 py-2 rounded-xl text-xs font-semibold transition-all cursor-pointer"
            >
              <ArrowLeft size={14} />
              <span>All Snippets</span>
            </button>
            <div className="h-4 w-px bg-zinc-800" />
            <h2 className="text-sm font-bold text-white flex items-center gap-2">
              <Code2 size={16} className="text-red-500" />
              <span>{selectedSnippet ? 'Edit Snippet' : 'Add New Snippet'}</span>
            </h2>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setViewMode('list')}
              className="text-xs text-zinc-400 hover:text-white px-3 py-2 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSaveForm}
              disabled={saving}
              className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 text-white font-bold px-5 py-2 rounded-xl text-xs shadow-lg shadow-red-950/40 cursor-pointer transition-all"
            >
              <Save size={14} className={saving ? 'animate-spin' : ''} />
              <span>{saving ? 'Saving...' : selectedSnippet ? 'Update Snippet' : 'Save & Activate'}</span>
            </button>
          </div>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSaveForm} className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          
          {/* Main 2 Cols: Title + Code Mirror Area */}
          <div className="lg:col-span-2 space-y-5">
            
            {/* Title Input (WordPress Style Big Bar) */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-3">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                Snippet Name <span className="text-red-500">*</span>
              </label>
              <input
                type="text"
                required
                value={formTitle}
                onChange={(e) => setFormTitle(e.target.value)}
                placeholder="e.g., Google Analytics 4 Global Site Tag"
                className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-600/50 focus:ring-1 focus:ring-red-600/50 rounded-xl px-4 py-3 text-white text-base font-medium outline-none transition-all placeholder:text-zinc-600"
              />
            </div>

            {/* Code Editor Box */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-3">
              <div className="flex items-center justify-between border-b border-zinc-800 pb-3">
                <div className="flex items-center gap-2">
                  <FileCode size={15} className="text-red-500" />
                  <span className="text-xs font-bold text-zinc-200 uppercase tracking-wider">Code Snippet Editor</span>
                </div>
                <div className="flex items-center gap-2">
                  {(['html', 'javascript', 'css', 'text'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => setFormCodeType(t)}
                      className={`px-2.5 py-1 rounded-md text-[11px] font-mono uppercase font-bold transition-all cursor-pointer ${
                        formCodeType === t
                          ? 'bg-red-600 text-white shadow-sm'
                          : 'bg-zinc-950 text-zinc-400 hover:text-white border border-zinc-800'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div className="relative">
                <textarea
                  value={formCode}
                  onChange={(e) => setFormCode(e.target.value)}
                  rows={18}
                  spellCheck={false}
                  placeholder={`<!-- Paste your custom ${formCodeType.toUpperCase()} code snippet here -->`}
                  className="w-full bg-[#0d1117] border border-zinc-850 focus:border-red-600/50 rounded-xl p-4 font-mono text-xs text-emerald-400 placeholder:text-zinc-600 outline-none leading-relaxed resize-y selection:bg-red-600/30 selection:text-white"
                />
                <div className="absolute right-3 bottom-3 text-[10px] text-zinc-400 font-mono bg-zinc-900/90 px-2.5 py-1 rounded-md border border-zinc-800 pointer-events-none">
                  Lines: {formCode ? formCode.split('\n').length : 0} | Chars: {formCode.length}
                </div>
              </div>

              <div className="text-[11px] text-zinc-400 flex items-center gap-1.5 pt-1">
                <HelpCircle size={13} className="text-zinc-400 shrink-0" />
                <span>
                  Tip: Enclose JavaScript code within <code className="text-red-400">&lt;script&gt;</code> tags and CSS within <code className="text-red-400">&lt;style&gt;</code> tags.
                </span>
              </div>
            </div>

            {/* Description & Notes */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-2">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">Description / Notes</label>
              <textarea
                value={formDescription}
                onChange={(e) => setFormDescription(e.target.value)}
                rows={2}
                placeholder="Optional notes explaining what this snippet does or who installed it..."
                className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-600/50 rounded-xl px-4 py-2.5 text-zinc-300 text-xs outline-none transition-all placeholder:text-zinc-600 resize-none"
              />
            </div>

          </div>

          {/* Right Sidebar: WordPress-style Meta Boxes */}
          <div className="space-y-5">
            
            {/* Meta Box 1: Insertion Location */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-2 flex items-center justify-between">
                <span>Placement / Location</span>
                <Sparkles size={14} className="text-red-500" />
              </h3>

              <div className="space-y-2.5">
                {[
                  { id: 'head', title: '<head> Section', desc: 'Loaded before </head> (Analytics, Meta, CSS)' },
                  { id: 'body_top', title: '<body> Top', desc: 'Immediate start of body (GTM NoScript)' },
                  { id: 'body_bottom', title: '<body> Bottom', desc: 'Before </body> closing (Chat, Analytics)' },
                  { id: 'footer', title: '<footer> Section', desc: 'Appended directly to page footer' },
                ].map((loc) => (
                  <label
                    key={loc.id}
                    className={`flex items-start gap-3 p-3 rounded-xl border cursor-pointer transition-all ${
                      formLocation === loc.id
                        ? 'bg-red-950/20 border-red-500/50 text-white'
                        : 'bg-zinc-950/50 border-zinc-850 text-zinc-400 hover:border-zinc-700'
                    }`}
                  >
                    <input
                      type="radio"
                      name="location"
                      value={loc.id}
                      checked={formLocation === loc.id}
                      onChange={() => setFormLocation(loc.id as SnippetLocation)}
                      className="mt-1 accent-red-600"
                    />
                    <div className="min-w-0">
                      <span className="text-xs font-bold block text-zinc-200">{loc.title}</span>
                      <p className="text-[11px] text-zinc-400 mt-0.5 leading-snug">{loc.desc}</p>
                    </div>
                  </label>
                ))}
              </div>
            </div>

            {/* Meta Box 2: Status & Priority */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-4">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-2">
                Execution Settings
              </h3>

              {/* Status Switch */}
              <div className="flex items-center justify-between py-1">
                <div>
                  <span className="text-xs font-semibold text-zinc-200 block">Status</span>
                  <span className="text-[11px] text-zinc-400">Enable or pause execution</span>
                </div>
                <button
                  type="button"
                  onClick={() => setFormActive(!formActive)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                    formActive
                      ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/30'
                      : 'bg-zinc-800 text-zinc-400 border border-zinc-700'
                  }`}
                >
                  {formActive ? (
                    <>
                      <ToggleRight size={18} />
                      <span>Active</span>
                    </>
                  ) : (
                    <>
                      <ToggleLeft size={18} />
                      <span>Inactive</span>
                    </>
                  )}
                </button>
              </div>

              {/* Priority */}
              <div className="space-y-1 pt-2">
                <div className="flex items-center justify-between">
                  <label className="text-xs font-semibold text-zinc-300">Execution Priority</label>
                  <span className="text-xs text-red-500 font-mono font-bold">{formPriority}</span>
                </div>
                <input
                  type="number"
                  min="1"
                  max="100"
                  value={formPriority}
                  onChange={(e) => setFormPriority(Number(e.target.value) || 10)}
                  className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-600/50 rounded-xl px-3 py-2 text-white text-xs outline-none"
                />
                <span className="text-[10px] text-zinc-400 block">Lower numbers run earlier (e.g., 1 runs first, 10 is normal)</span>
              </div>

              {/* Tags */}
              <div className="space-y-1 pt-2">
                <label className="text-xs font-semibold text-zinc-300 flex items-center gap-1.5">
                  <Tag size={13} className="text-zinc-400" />
                  <span>Tags (Comma-separated)</span>
                </label>
                <input
                  type="text"
                  value={formTags}
                  onChange={(e) => setFormTags(e.target.value)}
                  placeholder="analytics, tracking, google"
                  className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-600/50 rounded-xl px-3 py-2 text-white text-xs outline-none placeholder:text-zinc-600"
                />
              </div>

            </div>

            {/* Meta Box 3: Preset Templates Dropdown */}
            <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-5 shadow-sm space-y-3">
              <h3 className="text-xs font-bold text-white uppercase tracking-wider border-b border-zinc-800 pb-2">
                Quick Preset Loader
              </h3>
              <p className="text-[11px] text-zinc-400">Load verified snippet templates in one click:</p>
              
              <div className="space-y-1.5 max-h-48 overflow-y-auto pr-1">
                {PRESET_LIBRARY.map((tpl) => (
                  <button
                    key={tpl.title}
                    type="button"
                    onClick={() => handleApplyPreset(tpl)}
                    className="w-full text-left p-2 rounded-lg bg-zinc-950 hover:bg-zinc-800 border border-zinc-850 hover:border-zinc-700 text-xs text-zinc-300 hover:text-white transition-all flex items-center justify-between group cursor-pointer"
                  >
                    <span className="truncate pr-2 font-medium">{tpl.title}</span>
                    <span className="text-[10px] text-red-500 opacity-0 group-hover:opacity-100 transition-opacity">Load</span>
                  </button>
                ))}
              </div>
            </div>

          </div>

        </form>
      </div>
    );
  }

  // ==========================================
  // VIEW 2: WORDPRESS-STYLE ALL SNIPPETS LIST TABLE
  // ==========================================
  return (
    <div className="space-y-6">
      <Toaster position="top-right" toastOptions={{ style: { background: '#18181b', color: '#fff' } }} />

      {/* WordPress-style Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-white tracking-tight flex items-center gap-2.5">
              <span>Code Snippets</span>
              <span className="text-xs font-mono bg-red-600/10 text-red-400 border border-red-500/30 px-2 py-0.5 rounded-full font-bold">
                WP Edition
              </span>
            </h1>
            <button
              type="button"
              onClick={handleOpenAdd}
              className="flex items-center gap-1.5 bg-red-600 hover:bg-red-700 text-white font-bold px-3.5 py-1.5 rounded-xl text-xs transition-all shadow-md shadow-red-950/40 cursor-pointer"
            >
              <Plus size={14} />
              <span>Add New</span>
            </button>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            An easy, clean and powerful way to run code snippets on your website without touching theme templates.
          </p>
        </div>

        {/* Global Stats Callout */}
        <div className="flex items-center gap-2 text-xs">
          <span className="bg-zinc-900 border border-zinc-800 px-3 py-1.5 rounded-xl text-zinc-300">
            Total: <strong className="text-white">{snippets.length}</strong>
          </span>
          <span className="bg-emerald-950/40 border border-emerald-900/50 px-3 py-1.5 rounded-xl text-emerald-300">
            Active: <strong className="text-emerald-400">{activeCount}</strong>
          </span>
        </div>
      </div>

      {/* WordPress Subsubsub Filter Bar (All | Active | Inactive) */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-zinc-400">
          <button
            type="button"
            onClick={() => setFilterStatus('all')}
            className={`font-semibold transition-colors cursor-pointer ${
              filterStatus === 'all' ? 'text-red-500 underline underline-offset-4' : 'hover:text-zinc-200'
            }`}
          >
            All ({snippets.length})
          </button>
          <span>|</span>
          <button
            type="button"
            onClick={() => setFilterStatus('active')}
            className={`font-semibold transition-colors cursor-pointer ${
              filterStatus === 'active' ? 'text-red-500 underline underline-offset-4' : 'hover:text-zinc-200'
            }`}
          >
            Active ({activeCount})
          </button>
          <span>|</span>
          <button
            type="button"
            onClick={() => setFilterStatus('inactive')}
            className={`font-semibold transition-colors cursor-pointer ${
              filterStatus === 'inactive' ? 'text-red-500 underline underline-offset-4' : 'hover:text-zinc-200'
            }`}
          >
            Inactive ({inactiveCount})
          </button>
        </div>

        {/* Search Box */}
        <div className="relative min-w-[240px]">
          <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-zinc-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search installed snippets..."
            className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-600/50 rounded-xl pl-9 pr-3 py-1.5 text-xs text-white placeholder:text-zinc-600 outline-none transition-all"
          />
        </div>
      </div>

      {/* WordPress Bulk Actions & Filters Bar */}
      <div className="flex flex-wrap items-center justify-between gap-3 bg-zinc-900/90 border border-zinc-800 p-2.5 rounded-2xl">
        <div className="flex items-center gap-2">
          <select
            value={bulkAction}
            onChange={(e) => setBulkAction(e.target.value)}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-300 outline-none cursor-pointer"
          >
            <option value="">Bulk actions</option>
            <option value="activate">Activate</option>
            <option value="deactivate">Deactivate</option>
            <option value="delete">Delete</option>
          </select>
          <button
            type="button"
            onClick={handleBulkAction}
            disabled={!bulkAction || selectedIds.length === 0}
            className="bg-zinc-800 hover:bg-zinc-700 disabled:opacity-40 text-white font-semibold px-3 py-1.5 rounded-xl text-xs transition-all cursor-pointer"
          >
            Apply
          </button>

          <div className="h-4 w-px bg-zinc-800 mx-1 hidden sm:block" />

          {/* Location Dropdown Filter */}
          <select
            value={filterLocation}
            onChange={(e) => setFilterLocation(e.target.value as any)}
            className="bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-1.5 text-xs text-zinc-300 outline-none cursor-pointer hidden sm:block"
          >
            <option value="all">All Locations</option>
            <option value="head">&lt;head&gt; Section</option>
            <option value="body_top">&lt;body&gt; Top</option>
            <option value="body_bottom">&lt;body&gt; Bottom</option>
            <option value="footer">&lt;footer&gt; Section</option>
          </select>
        </div>

        <span className="text-[11px] text-zinc-400">
          Showing {filteredSnippets.length} of {snippets.length} items
        </span>
      </div>

      {/* WordPress-style Data Table */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            
            {/* Table Header */}
            <thead className="bg-zinc-950/80 border-b border-zinc-800 text-zinc-400 font-semibold uppercase tracking-wider text-[11px]">
              <tr>
                <th className="py-3 px-4 w-10 text-center">
                  <input
                    type="checkbox"
                    checked={filteredSnippets.length > 0 && selectedIds.length === filteredSnippets.length}
                    onChange={toggleSelectAll}
                    className="accent-red-600 rounded cursor-pointer"
                  />
                </th>
                <th className="py-3 px-3 w-16 text-center">Active</th>
                <th className="py-3 px-4">Name</th>
                <th className="py-3 px-4">Type</th>
                <th className="py-3 px-4">Location</th>
                <th className="py-3 px-4">Tags</th>
                <th className="py-3 px-3 w-16 text-center">Priority</th>
                <th className="py-3 px-4 text-right">Actions</th>
              </tr>
            </thead>

            {/* Table Body */}
            <tbody className="divide-y divide-zinc-800/60 font-normal">
              {filteredSnippets.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-zinc-500">
                    <div className="flex flex-col items-center justify-center space-y-2">
                      <Code2 size={28} className="text-zinc-600" />
                      <p className="text-sm font-medium text-zinc-400">No snippets found</p>
                      <p className="text-xs text-zinc-600">Click &ldquo;Add New&rdquo; above to create your first code snippet.</p>
                      <button
                        type="button"
                        onClick={handleOpenAdd}
                        className="mt-2 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-1.5 rounded-xl text-xs transition-all cursor-pointer"
                      >
                        + Add Snippet
                      </button>
                    </div>
                  </td>
                </tr>
              ) : (
                filteredSnippets.map((snip) => {
                  const isSelected = selectedIds.includes(snip.id);
                  return (
                    <tr
                      key={snip.id}
                      className={`group hover:bg-zinc-850/60 transition-colors ${
                        !snip.active ? 'opacity-70 bg-zinc-950/30' : ''
                      } ${isSelected ? 'bg-red-950/20' : ''}`}
                    >
                      {/* Checkbox */}
                      <td className="py-3.5 px-4 text-center">
                        <input
                          type="checkbox"
                          checked={isSelected}
                          onChange={() => {
                            setSelectedIds((prev) =>
                              prev.includes(snip.id) ? prev.filter((i) => i !== snip.id) : [...prev, snip.id]
                            );
                          }}
                          className="accent-red-600 rounded cursor-pointer"
                        />
                      </td>

                      {/* Active Toggle Switch */}
                      <td className="py-3.5 px-3 text-center">
                        <button
                          type="button"
                          onClick={(e) => handleToggleActive(snip.id, e)}
                          title={snip.active ? 'Click to Deactivate' : 'Click to Activate'}
                          className="cursor-pointer transition-transform active:scale-90 inline-flex items-center justify-center"
                        >
                          {snip.active ? (
                            <ToggleRight size={24} className="text-emerald-400" />
                          ) : (
                            <ToggleLeft size={24} className="text-zinc-600 hover:text-zinc-400" />
                          )}
                        </button>
                      </td>

                      {/* Name & WordPress Quick Row-Actions (Edit | Clone | Delete) */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-zinc-100 group-hover:text-white flex items-center gap-2">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(snip)}
                            className="hover:text-red-400 text-left font-bold transition-colors cursor-pointer"
                          >
                            {snip.title}
                          </button>
                        </div>
                        {snip.description && (
                          <p className="text-[11px] text-zinc-400 line-clamp-1 mt-0.5">{snip.description}</p>
                        )}

                        {/* WordPress-style Row-Actions hover menu */}
                        <div className="flex items-center gap-2 mt-1.5 text-[11px] opacity-80 group-hover:opacity-100 transition-opacity">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(snip)}
                            className="text-red-500 hover:text-red-400 font-semibold cursor-pointer"
                          >
                            Edit
                          </button>
                          <span className="text-zinc-700">|</span>
                          <button
                            type="button"
                            onClick={(e) => handleClone(snip, e)}
                            className="text-zinc-400 hover:text-zinc-200 cursor-pointer"
                          >
                            Clone
                          </button>
                          <span className="text-zinc-700">|</span>
                          <button
                            type="button"
                            onClick={(e) => handleToggleActive(snip.id, e)}
                            className="text-zinc-400 hover:text-zinc-200 cursor-pointer"
                          >
                            {snip.active ? 'Deactivate' : 'Activate'}
                          </button>
                          <span className="text-zinc-700">|</span>
                          <button
                            type="button"
                            onClick={(e) => handleDelete(snip.id, e)}
                            className="text-red-400 hover:text-red-300 cursor-pointer"
                          >
                            Delete
                          </button>
                        </div>
                      </td>

                      {/* Type Badge */}
                      <td className="py-3.5 px-4">
                        <span className="font-mono text-[10px] uppercase font-bold bg-zinc-800 text-zinc-300 px-2 py-0.5 rounded-md border border-zinc-700">
                          {snip.codeType || 'HTML'}
                        </span>
                      </td>

                      {/* Location */}
                      <td className="py-3.5 px-4">
                        <span className="text-[11px] font-mono text-zinc-300 bg-zinc-950 px-2 py-1 rounded-md border border-zinc-800">
                          {snip.location === 'head'
                            ? '<head>'
                            : snip.location === 'body_top'
                            ? '<body> Top'
                            : snip.location === 'body_bottom'
                            ? '<body> Bottom'
                            : '<footer>'}
                        </span>
                      </td>

                      {/* Tags */}
                      <td className="py-3.5 px-4">
                        {snip.tags && snip.tags.length > 0 ? (
                          <div className="flex flex-wrap gap-1">
                            {snip.tags.map((tag) => (
                              <span
                                key={tag}
                                className="text-[10px] bg-zinc-800 text-zinc-400 px-1.5 py-0.2 rounded"
                              >
                                #{tag}
                              </span>
                            ))}
                          </div>
                        ) : (
                          <span className="text-zinc-600">—</span>
                        )}
                      </td>

                      {/* Priority */}
                      <td className="py-3.5 px-3 text-center font-mono text-zinc-400">
                        {snip.priority || 10}
                      </td>

                      {/* Actions Buttons */}
                      <td className="py-3.5 px-4 text-right">
                        <div className="flex items-center justify-end gap-1.5">
                          <button
                            type="button"
                            onClick={() => handleOpenEdit(snip)}
                            title="Edit Snippet"
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-600 text-zinc-300 hover:text-white transition-all cursor-pointer"
                          >
                            <Edit3 size={13} />
                          </button>
                          <button
                            type="button"
                            onClick={(e) => handleDelete(snip.id, e)}
                            title="Delete Snippet"
                            className="p-1.5 rounded-lg bg-zinc-800 hover:bg-red-600 text-zinc-300 hover:text-white transition-all cursor-pointer"
                          >
                            <Trash2 size={13} />
                          </button>
                        </div>
                      </td>

                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>

        {/* Table Footer */}
        <div className="bg-zinc-950/90 border-t border-zinc-800 px-4 py-3 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-zinc-500">
          <div className="flex items-center gap-2">
            <Sparkles size={14} className="text-red-500" />
            <span>Built exactly like the popular WordPress Code Snippets plugin for maximum flexibility.</span>
          </div>
          <span>Active snippets are automatically injected on public pages.</span>
        </div>

      </div>
    </div>
  );
}

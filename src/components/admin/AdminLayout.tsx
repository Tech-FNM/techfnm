import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams, useSearchParams } from 'react-router-dom';
import {
  LayoutDashboard,
  Users,
  FileText,
  LayoutGrid,
  Image as ImageIcon,
  Settings,
  LogOut,
  Briefcase,
  FormInput,
  ExternalLink,
  PanelTop,
  Menu,
  X,
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Plus,
  Bell,
  Search,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
  FolderGit2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface AdminLayoutProps {
  children: React.ReactNode;
  activeTab?: string;
}

interface NavItem {
  id: string;
  label: string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  badge?: number | string;
  badgeColor?: string;
}

interface NavSection {
  title: string;
  items: NavItem[];
}

export default function AdminLayout({ children, activeTab }: AdminLayoutProps) {
  const navigate = useNavigate();
  const { tab: pathTab } = useParams();
  const [searchParams] = useSearchParams();
  const currentTab =
    activeTab ||
    (pathTab === 'dashboard' || pathTab === 'overview' ? 'overview' : pathTab) ||
    searchParams.get('tab') ||
    'overview';

  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [quickCreateOpen, setQuickCreateOpen] = useState(false);
  const [leadsCount, setLeadsCount] = useState<number>(0);
  const [currentUser, setCurrentUser] = useState<any>(() => {
    try {
      const raw = localStorage.getItem('techfnm_current_user');
      return raw ? JSON.parse(raw) : { name: 'Naeem Ur Rehman', role: 'Super Admin', email: 'naeem@techfnm.com' };
    } catch {
      return { name: 'Naeem Ur Rehman', role: 'Super Admin', email: 'naeem@techfnm.com' };
    }
  });
  const quickCreateRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    // Basic route guard
    const token = localStorage.getItem('techfnm_admin_token');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  useEffect(() => {
    // Fetch live leads count for badge
    const fetchLeadCount = async () => {
      try {
        const { count } = await supabase
          .from('service_requests')
          .select('*', { count: 'exact', head: true });
        if (count !== null) setLeadsCount(count);
      } catch (err) {
        // silent fallback
      }
    };
    fetchLeadCount();
  }, [currentTab]);

  // Click outside to close quick create dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (quickCreateRef.current && !quickCreateRef.current.contains(event.target as Node)) {
        setQuickCreateOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('techfnm_admin_token');
    navigate('/admin/login');
  };

  const navSections: NavSection[] = [
    {
      title: 'Core Operations',
      items: [
        { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
        {
          id: 'leads',
          label: 'Submissions & Leads',
          icon: FormInput,
          badge: leadsCount > 0 ? leadsCount : undefined,
          badgeColor: 'bg-red-500/20 text-red-400 border border-red-500/30'
        },
      ]
    },
    {
      title: 'Content & Media',
      items: [
        { id: 'services', label: 'Services', icon: Briefcase },
        { id: 'portfolio', label: 'Portfolio Works', icon: FolderGit2 },
        { id: 'posts', label: 'Posts & Blogs', icon: FileText },
        { id: 'pages', label: 'Page Management', icon: LayoutGrid },
        { id: 'media', label: 'Media Library', icon: ImageIcon },
      ]
    },
    {
      title: 'System & Branding',
      items: [
        { id: 'header', label: 'Header & Navigation', icon: PanelTop },
        { id: 'users', label: 'User Management', icon: Users },
        { id: 'settings', label: 'Global Settings', icon: Settings },
      ]
    }
  ];

  const currentTabLabel =
    navSections
      .flatMap(s => s.items)
      .find(i => i.id === currentTab)?.label || 'Dashboard';

  const selectTab = (tabId: string) => {
    if (tabId === 'overview' || tabId === 'dashboard') {
      navigate('/admin/dashboard');
    } else {
      navigate(`/admin/${tabId}`);
    }
    setMobileOpen(false);
  };

  return (
    <div className="min-h-screen bg-[#09090b] text-zinc-100 flex overflow-hidden font-sans antialiased selection:bg-red-500/30 selection:text-red-200">

      {/* MOBILE BACKDROP OVERLAY */}
      {mobileOpen && (
        <div
          className="fixed inset-0 bg-black/70 backdrop-blur-sm z-40 lg:hidden transition-opacity"
          onClick={() => setMobileOpen(false)}
        />
      )}

      {/* SIDEBAR */}
      <aside
        className={`fixed lg:static inset-y-0 left-0 z-50 flex flex-col justify-between bg-[#0e0e11] border-r border-zinc-800/80 transition-all duration-300 ease-in-out shrink-0 ${
          collapsed ? 'w-20' : 'w-72'
        } ${mobileOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}`}
      >
        <div className="flex flex-col h-full overflow-hidden">
          {/* BRAND HEADER */}
          <div className="h-16 px-5 border-b border-zinc-800/80 flex items-center justify-between bg-[#0e0e11] shrink-0">
            <div className="flex items-center gap-3 overflow-hidden">
              <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-red-600 via-rose-600 to-red-500 flex items-center justify-center shadow-lg shadow-red-600/25 shrink-0">
                <span className="font-extrabold text-white text-base tracking-tighter">FNM</span>
              </div>
              {!collapsed && (
                <div className="flex flex-col min-w-0">
                  <div className="flex items-center gap-1.5">
                    <span className="font-bold text-white tracking-tight text-sm truncate">TechFNM Console</span>
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                  </div>
                  <span className="text-[10px] uppercase font-semibold tracking-wider text-zinc-400 truncate">
                    CMS Management
                  </span>
                </div>
              )}
            </div>

            {/* Mobile close button */}
            <button
              onClick={() => setMobileOpen(false)}
              className="lg:hidden p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-800 transition-colors"
            >
              <X size={18} />
            </button>

            {/* Desktop Collapse Toggle */}
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="hidden lg:flex p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-850 border border-zinc-800/80 transition-colors"
              title={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
            >
              {collapsed ? <ChevronRight size={15} /> : <ChevronLeft size={15} />}
            </button>
          </div>

          {/* SIDEBAR NAVIGATION ITEMS */}
          <div className="flex-1 overflow-y-auto px-3 py-4 space-y-6 scrollbar-thin scrollbar-thumb-zinc-800">
            {navSections.map((section, sIndex) => (
              <div key={sIndex} className="space-y-1.5">
                {!collapsed && (
                  <div className="px-3 pb-1 text-[11px] font-bold uppercase tracking-wider text-zinc-400">
                    {section.title}
                  </div>
                )}
                {section.items.map((item) => {
                  const Icon = item.icon;
                  const isActive = currentTab === item.id;
                  return (
                    <button
                      key={item.id}
                      onClick={() => selectTab(item.id)}
                      title={collapsed ? item.label : undefined}
                      className={`group relative w-full flex items-center gap-3 px-3.5 py-2.5 rounded-xl text-sm font-medium transition-all duration-150 ${
                        isActive
                          ? 'bg-gradient-to-r from-red-600 via-rose-600 to-red-600 text-white font-semibold shadow-md shadow-red-950/40'
                          : 'text-zinc-300 hover:text-white hover:bg-zinc-850/80'
                      } ${collapsed ? 'justify-center' : 'justify-between'}`}
                    >
                      <div className="flex items-center gap-3 min-w-0">
                        <Icon
                          size={18}
                          className={`shrink-0 transition-transform group-hover:scale-105 ${
                            isActive ? 'text-white' : 'text-zinc-400 group-hover:text-red-400'
                          }`}
                        />
                        {!collapsed && <span className="truncate">{item.label}</span>}
                      </div>

                      {!collapsed && item.badge && (
                        <span className={`px-2 py-0.5 rounded-full text-[11px] font-bold ${item.badgeColor || 'bg-zinc-800 text-zinc-300'}`}>
                          {item.badge}
                        </span>
                      )}

                      {/* Tooltip on collapsed state */}
                      {collapsed && (
                        <div className="absolute left-full ml-2 px-2.5 py-1 bg-zinc-900 text-white text-xs rounded-lg shadow-xl border border-zinc-800 whitespace-nowrap opacity-0 pointer-events-none group-hover:opacity-100 transition-opacity z-50">
                          {item.label}
                          {item.badge && ` (${item.badge})`}
                        </div>
                      )}
                    </button>
                  );
                })}
              </div>
            ))}
          </div>

          {/* FOOTER USER & LOGOUT SECTION */}
          <div className="p-3 border-t border-zinc-800/80 bg-[#0c0c0f] shrink-0 space-y-2">
            {!collapsed ? (
              <div className="p-2.5 rounded-xl bg-zinc-900/90 border border-zinc-800/80 flex items-center justify-between">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-red-900/40 to-zinc-900 border border-red-900/40 flex items-center justify-center font-bold text-xs text-red-400 shrink-0">
                    {currentUser.name ? currentUser.name.substring(0, 2).toUpperCase() : 'AD'}
                  </div>
                  <div className="min-w-0">
                    <p className="text-xs font-semibold text-white truncate">{currentUser.name || 'Administrator'}</p>
                    <p className="text-[10px] text-zinc-400 truncate">{currentUser.role || 'Super Admin'}</p>
                  </div>
                </div>
                <button
                  onClick={handleLogout}
                  title="Logout"
                  className="p-1.5 text-zinc-400 hover:text-red-400 rounded-lg hover:bg-zinc-800 transition-colors cursor-pointer"
                >
                  <LogOut size={16} />
                </button>
              </div>
            ) : (
              <button
                onClick={handleLogout}
                title="Logout"
                className="w-full flex items-center justify-center py-2.5 text-zinc-400 hover:text-red-400 rounded-xl hover:bg-zinc-850 transition-colors"
              >
                <LogOut size={18} />
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* MAIN CONTENT AREA */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">

        {/* TOP NAVIGATION BAR */}
        <header className="h-16 bg-[#0e0e11]/90 backdrop-blur-md border-b border-zinc-800/80 flex items-center justify-between px-4 sm:px-8 z-20 shrink-0">
          {/* Left section: mobile hamburger & breadcrumbs */}
          <div className="flex items-center gap-3 sm:gap-4">
            <button
              onClick={() => setMobileOpen(true)}
              className="lg:hidden p-2 text-zinc-400 hover:text-white rounded-lg hover:bg-zinc-850 border border-zinc-800 transition-colors"
            >
              <Menu size={18} />
            </button>

            <div className="flex items-center gap-2 text-xs">
              <span className="text-zinc-400 font-medium hidden sm:inline">TechFNM</span>
              <span className="text-zinc-600 hidden sm:inline">/</span>
              <span className="text-zinc-400 font-medium">Console</span>
              <span className="text-zinc-600">/</span>
              <span className="text-white font-semibold px-2.5 py-1 rounded-lg bg-zinc-900 border border-zinc-800">
                {currentTabLabel}
              </span>
            </div>
          </div>

          {/* Right section: actions & live preview */}
          <div className="flex items-center gap-2.5 sm:gap-3">

            {/* Quick Create Dropdown */}
            <div className="relative" ref={quickCreateRef}>
              <button
                onClick={() => setQuickCreateOpen(!quickCreateOpen)}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white text-xs font-semibold shadow-md shadow-red-950/30 transition-all cursor-pointer"
              >
                <Plus size={14} />
                <span className="hidden sm:inline">Quick Action</span>
                <ChevronDown size={12} className={`transition-transform ${quickCreateOpen ? 'rotate-180' : ''}`} />
              </button>

              {quickCreateOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-[#121216] border border-zinc-800 rounded-2xl shadow-2xl p-1.5 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="px-3 py-1.5 text-[10px] font-bold text-zinc-400 uppercase tracking-wider">
                    Create & Manage
                  </div>
                  <button
                    onClick={() => { selectTab('services'); setQuickCreateOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    <Briefcase size={14} className="text-blue-400" />
                    <span>Add Service</span>
                  </button>
                  <button
                    onClick={() => { selectTab('portfolio'); setQuickCreateOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    <FolderGit2 size={14} className="text-emerald-400" />
                    <span>New Portfolio Item</span>
                  </button>
                  <button
                    onClick={() => { selectTab('posts'); setQuickCreateOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    <FileText size={14} className="text-purple-400" />
                    <span>Create Blog Post</span>
                  </button>
                  <button
                    onClick={() => { selectTab('media'); setQuickCreateOpen(false); }}
                    className="w-full flex items-center gap-2.5 px-3 py-2 rounded-xl text-xs text-zinc-200 hover:bg-zinc-800 hover:text-white transition-colors"
                  >
                    <ImageIcon size={14} className="text-amber-400" />
                    <span>Upload Media</span>
                  </button>
                </div>
              )}
            </div>

            {/* Visit Live Website button */}
            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 transition-colors text-xs font-medium"
            >
              <ExternalLink size={13} className="text-red-400" />
              <span className="hidden sm:inline">Visit Site</span>
            </a>

            {/* System Status Pill */}
            <div className="hidden md:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-emerald-950/20 border border-emerald-900/30 text-emerald-400 text-xs font-medium">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Live System</span>
            </div>

            {/* User Profile Pill */}
            <div className="flex items-center gap-2.5 pl-2 border-l border-zinc-800">
              <div className="w-8 h-8 rounded-xl bg-gradient-to-tr from-red-600/30 to-zinc-800 border border-red-500/30 flex items-center justify-center text-xs font-bold text-white shadow-inner">
                {currentUser.name ? currentUser.name.substring(0, 2).toUpperCase() : 'AD'}
              </div>
              <div className="hidden sm:block text-left">
                <p className="text-xs font-semibold text-white leading-tight">{currentUser.name || 'Admin'}</p>
                <p className="text-[10px] text-zinc-400 leading-tight">{currentUser.role || 'Super Admin'}</p>
              </div>
            </div>

          </div>
        </header>

        {/* MAIN WORKSPACE BODY */}
        <main className="flex-1 overflow-y-auto bg-[#09090b] p-4 sm:p-8">
          <div className="max-w-7xl mx-auto">
            {children}
          </div>
        </main>

      </div>

    </div>
  );
}


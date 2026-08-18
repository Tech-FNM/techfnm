import { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Briefcase, Users, MessageSquare, LogOut, 
  Layers, HelpCircle, Globe, Menu, X, Code, PanelBottom, 
  FileText, Search, ChevronDown, ChevronRight, ExternalLink, User,
  Image, Settings, Paintbrush, Star, Plus, Inbox
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface MenuItem {
  path: string;
  label: string;
}

interface MenuGroup {
  label: string;
  icon: any;
  path?: string;
  children?: MenuItem[];
}

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [collapsed, setCollapsed] = useState(false);
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({});

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admindash/login');
  };

  const toggleGroup = (label: string) => {
    setOpenGroups(prev => ({
      ...prev,
      [label]: !prev[label]
    }));
  };

  const menuGroups: MenuGroup[] = [
    { 
      label: 'Dashboard', 
      icon: LayoutDashboard, 
      path: '/admindash/dashboard' 
    },
    {
      label: 'Leads',
      icon: Inbox,
      path: '/admindash/leads'
    },
    {
      label: 'Posts',
      icon: FileText,
      children: [
        { path: '/admindash/blogs', label: 'All Posts' },
      ]
    },
    {
      label: 'Media',
      icon: Image,
      path: '/admindash/media',
    },
    {
      label: 'Pages',
      icon: Layers,
      children: [
        { path: '/admindash/homepage', label: 'Homepage' },
        { path: '/admindash/pages', label: 'Inner Pages' },
      ]
    },
    {
      label: 'Services',
      icon: Code,
      path: '/admindash/services',
    },
    {
      label: 'Projects',
      icon: Briefcase,
      path: '/admindash/projects',
    },
    {
      label: 'FAQs',
      icon: HelpCircle,
      path: '/admindash/faqs',
    },
    {
      label: 'Testimonials',
      icon: MessageSquare,
      path: '/admindash/testimonials',
    },
    {
      label: 'Clients',
      icon: Globe,
      path: '/admindash/clients',
    },
    {
      label: 'Leadership',
      icon: Users,
      path: '/admindash/leadership',
    },
    {
      label: 'Appearance',
      icon: Paintbrush,
      children: [
        { path: '/admindash/header', label: 'Header' },
        { path: '/admindash/footer', label: 'Footer' },
      ]
    },
    {
      label: 'Settings',
      icon: Settings,
      children: [
        { path: '/admindash/scripts', label: 'Custom Scripts' },
      ]
    },
  ];

  const isChildActive = (children?: MenuItem[]) => {
    if (!children) return false;
    return children.some(child => location.pathname === child.path);
  };

  // Auto-open groups that have active children
  useEffect(() => {
    menuGroups.forEach(group => {
      if (group.children && isChildActive(group.children)) {
        setOpenGroups(prev => ({ ...prev, [group.label]: true }));
      }
    });
  }, [location.pathname]);

  return (
    <div className="min-h-screen bg-zinc-950 flex flex-col font-sans text-sm">
      {/* Top Admin Bar */}
      <header className="sticky top-0 z-50 h-8 bg-zinc-950 border-b border-zinc-800/80 flex items-center justify-between px-3 text-zinc-400 text-xs">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-zinc-400 hover:text-white transition-colors">
              {isMobileMenuOpen ? <X size={16} /> : <Menu size={16} />}
            </button>
          </div>
          <Link to="/" target="_blank" className="flex items-center gap-1.5 hover:text-red-500 transition-colors">
            <span className="font-bold">Tech<span className="text-red-500">FNM</span></span>
          </Link>
          <Link to="/" target="_blank" className="hidden md:flex items-center gap-1 hover:text-white transition-colors">
            <ExternalLink size={12} />
            Visit Site
          </Link>
          <Link to="/admindash/blogs" className="hidden md:flex items-center gap-1 hover:text-white transition-colors">
            <Plus size={12} /> New
          </Link>
        </div>
        <div className="flex items-center gap-3">
          <span className="hidden sm:inline">Howdy, <span className="text-white">admin</span></span>
          <div className="w-5 h-5 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-700">
            <User size={12} className="text-zinc-500" />
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 top-8 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:top-0 md:translate-x-0 transition duration-200 ease-in-out z-40 ${collapsed ? 'w-10' : 'w-40 lg:w-44'} bg-zinc-900 border-r border-zinc-800/80 flex flex-col overflow-y-auto scrollbar-thin`}>
          <nav className="py-1 flex-1">
            {menuGroups.map((group, index) => {
              const hasChildren = group.children && group.children.length > 0;
              const isActive = location.pathname === group.path;
              const childActive = isChildActive(group.children);
              const isOpen = openGroups[group.label] || childActive;

              return (
                <div key={index}>
                  {/* Separator line between items */}
                  {index > 0 && <div className="border-t border-zinc-800/60 mx-0" />}
                  
                  {hasChildren ? (
                    <div>
                      <button
                        onClick={() => toggleGroup(group.label)}
                        className={`w-full flex items-center justify-between pl-3 pr-2 py-2 text-zinc-400 hover:bg-zinc-800/70 hover:text-white transition-colors ${childActive ? 'bg-zinc-800/50 text-white border-l-[3px] border-red-500 pl-[9px]' : ''}`}
                      >
                        <div className="flex items-center gap-2.5">
                          <group.icon size={16} className={`${childActive ? 'text-red-500' : ''} flex-shrink-0`} />
                          {!collapsed && <span>{group.label}</span>}
                        </div>
                        {!collapsed && (isOpen ? <ChevronDown size={14} /> : <ChevronRight size={14} />)}
                      </button>
                      
                      {isOpen && !collapsed && (
                        <div className="bg-zinc-950/50">
                          {group.children!.map(child => (
                            <Link
                              key={child.path}
                              to={child.path}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`block pl-9 pr-3 py-1.5 transition-colors ${
                                location.pathname === child.path
                                  ? 'text-red-500 font-medium'
                                  : 'text-zinc-500 hover:text-white'
                              }`}
                            >
                              {child.label}
                            </Link>
                          ))}
                        </div>
                      )}
                    </div>
                  ) : (
                    <Link
                      to={group.path!}
                      onClick={() => setIsMobileMenuOpen(false)}
                      className={`flex items-center gap-2.5 pl-3 pr-2 py-2 transition-colors ${
                        isActive
                          ? 'bg-zinc-800/50 text-white border-l-[3px] border-red-500 pl-[9px]'
                          : 'text-zinc-400 hover:bg-zinc-800/70 hover:text-white'
                      }`}
                    >
                      <group.icon size={16} className={`${isActive ? 'text-red-500' : ''} flex-shrink-0`} />
                      {!collapsed && <span>{group.label}</span>}
                    </Link>
                  )}
                </div>
              );
            })}
            
            <div className="border-t border-zinc-800/60" />
            <button
              onClick={handleLogout}
              className="w-full flex items-center gap-2.5 pl-3 pr-2 py-2 text-zinc-500 hover:text-red-500 hover:bg-zinc-800/70 transition-colors"
            >
              <LogOut size={16} className="flex-shrink-0" />
              {!collapsed && <span>Logout</span>}
            </button>
            
            <div className="border-t border-zinc-800/60" />
            <button
              onClick={() => setCollapsed(!collapsed)}
              className="w-full flex items-center gap-2.5 pl-3 pr-2 py-2 text-zinc-600 hover:text-white hover:bg-zinc-800/70 transition-colors"
            >
              <ChevronRight size={16} className={`flex-shrink-0 transition-transform ${collapsed ? '' : 'rotate-180'}`} />
              {!collapsed && <span>Collapse menu</span>}
            </button>
          </nav>
        </aside>

        {/* Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-30 md:hidden top-8" onClick={() => setIsMobileMenuOpen(false)} />
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-zinc-950 min-h-0">
          <Outlet />
        </main>
      </div>

      {/* Footer */}
      <footer className="border-t border-zinc-800/60 py-2 px-4 text-center text-zinc-600 text-xs">
        Thank you for creating with <Link to="/" className="text-red-500 hover:underline">TechFNM</Link>. Version 1.0.0
      </footer>
    </div>
  );
}

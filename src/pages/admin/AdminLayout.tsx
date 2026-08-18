import { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { 
  LayoutDashboard, Briefcase, Users, MessageSquare, LogOut, 
  Layers, HelpCircle, Globe, Menu, X, Code, PanelBottom, 
  FileText, Search, ChevronDown, ChevronRight, ExternalLink, User
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface MenuItem {
  path: string;
  label: string;
  icon?: any;
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
  const [openGroups, setOpenGroups] = useState<Record<string, boolean>>({
    'Pages': true,
    'Content': true,
    'Company': true,
    'Settings': true
  });

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
      label: 'Pages',
      icon: Layers,
      children: [
        { path: '/admindash/homepage', label: 'Homepage Content' },
        { path: '/admindash/pages', label: 'Inner Pages Content' },
      ]
    },
    {
      label: 'Content',
      icon: FileText,
      children: [
        { path: '/admindash/services', label: 'Services' },
        { path: '/admindash/projects', label: 'Projects' },
        { path: '/admindash/blogs', label: 'Blogs' },
        { path: '/admindash/faqs', label: 'FAQs' },
      ]
    },
    {
      label: 'Company',
      icon: Users,
      children: [
        { path: '/admindash/leadership', label: 'Leadership' },
        { path: '/admindash/testimonials', label: 'Testimonials' },
        { path: '/admindash/clients', label: 'Clients' },
      ]
    },
    {
      label: 'Settings',
      icon: Search,
      children: [
        { path: '/admindash/seo', label: 'SEO Settings' },
        { path: '/admindash/scripts', label: 'Custom Scripts' },
        { path: '/admindash/footer', label: 'Footer Layout' },
      ]
    }
  ];

  const isChildActive = (children?: MenuItem[]) => {
    if (!children) return false;
    return children.some(child => location.pathname === child.path);
  };

  return (
    <div className="min-h-screen bg-black flex flex-col font-sans text-sm">
      {/* Top Admin Bar (WordPress Style) */}
      <header className="sticky top-0 z-50 h-10 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-4 text-zinc-300">
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 md:hidden">
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-zinc-400 hover:text-white transition-colors">
              {isMobileMenuOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
          <Link to="/" target="_blank" className="flex items-center gap-2 hover:text-red-500 transition-colors font-medium">
            <span className="hidden md:inline font-bold">Tech<span className="text-red-500">FNM</span></span>
            <span className="md:hidden font-bold text-red-500">T</span>
            <ExternalLink size={14} />
            <span className="hidden sm:inline">Visit Site</span>
          </Link>
        </div>
        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 group cursor-pointer hover:text-white transition-colors">
            <span>Howdy, Admin</span>
            <div className="w-6 h-6 rounded-full bg-zinc-800 flex items-center justify-center overflow-hidden border border-zinc-700 group-hover:border-red-500">
              <User size={14} className="text-zinc-400 group-hover:text-red-500 transition-colors" />
            </div>
          </div>
        </div>
      </header>

      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className={`fixed inset-y-0 left-0 top-10 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-40 w-48 lg:w-56 bg-zinc-900 border-r border-zinc-800 flex flex-col overflow-y-auto`}>
          <nav className="py-3">
            {menuGroups.map((group, index) => {
              const hasChildren = group.children && group.children.length > 0;
              const isActive = location.pathname === group.path;
              const childActive = isChildActive(group.children);
              const isOpen = openGroups[group.label] || childActive;

              return (
                <div key={index} className="mb-1">
                  {hasChildren ? (
                    <div>
                      <button
                        onClick={() => toggleGroup(group.label)}
                        className={`w-full flex items-center justify-between px-4 py-2.5 text-zinc-400 hover:bg-zinc-800 hover:text-white transition-colors group ${childActive ? 'bg-zinc-800/50 text-white' : ''}`}
                      >
                        <div className="flex items-center gap-3">
                          <group.icon size={18} className={`${childActive ? 'text-red-500' : 'group-hover:text-white transition-colors'}`} />
                          <span className="font-medium">{group.label}</span>
                        </div>
                        {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                      </button>
                      
                      {/* Sub-menu */}
                      {isOpen && (
                        <div className="bg-zinc-900 py-1">
                          {group.children.map(child => (
                            <Link
                              key={child.path}
                              to={child.path}
                              onClick={() => setIsMobileMenuOpen(false)}
                              className={`block px-4 py-2 pl-11 transition-colors ${
                                location.pathname === child.path
                                  ? 'text-red-500 font-semibold'
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
                      className={`flex items-center gap-3 px-4 py-2.5 transition-colors group ${
                        isActive
                          ? 'bg-zinc-800 text-white'
                          : 'text-zinc-400 hover:bg-zinc-800 hover:text-white'
                      }`}
                    >
                      <group.icon size={18} className={`${isActive ? 'text-red-500' : 'group-hover:text-white transition-colors'}`} />
                      <span className="font-medium">{group.label}</span>
                    </Link>
                  )}
                </div>
              );
            })}
            
            <div className="px-4 mt-8">
               <button
                onClick={handleLogout}
                className="w-full flex items-center gap-3 py-2.5 text-zinc-500 hover:text-red-500 transition-colors"
              >
                <LogOut size={18} />
                <span className="font-medium">Logout</span>
              </button>
            </div>
          </nav>
        </aside>

        {/* Overlay */}
        {isMobileMenuOpen && (
          <div className="fixed inset-0 bg-black/50 z-30 md:hidden top-10" onClick={() => setIsMobileMenuOpen(false)} />
        )}

        {/* Main Content Area */}
        <main className="flex-1 overflow-y-auto bg-black p-4 md:p-6 lg:p-8">
          <Outlet />
        </main>
      </div>
    </div>
  );
}

import React, { useEffect } from 'react';
import { useNavigate, useSearchParams } from 'react-router-dom';
import { LayoutDashboard, Users, FileText, LayoutGrid, Image, Settings, LogOut, Briefcase, FormInput, ExternalLink } from 'lucide-react';

interface AdminLayoutProps {
  children: React.ReactNode;
}

export default function AdminLayout({ children }: AdminLayoutProps) {
  const navigate = useNavigate();
  const [searchParams, setSearchParams] = useSearchParams();
  const currentTab = searchParams.get('tab') || 'overview';

  useEffect(() => {
    // Basic route guard
    const token = localStorage.getItem('techfnm_admin_token');
    if (!token) {
      navigate('/admin/login');
    }
  }, [navigate]);

  const menuItems = [
    { id: 'overview', label: 'Dashboard', icon: LayoutDashboard },
    { id: 'leads', label: 'Leads', icon: FormInput },
    { id: 'users', label: 'User Management', icon: Users },
    { id: 'posts', label: 'Posts / Blogs', icon: FileText },
    { id: 'pages', label: 'Page Management', icon: LayoutGrid },
    { id: 'media', label: 'Media Management', icon: Image },
    { id: 'services', label: 'All Services', icon: Briefcase },
    { id: 'portfolio', label: 'All Portfolio', icon: Briefcase },
    { id: 'settings', label: 'Settings', icon: Settings },
  ];

  const handleLogout = () => {
    localStorage.removeItem('techfnm_admin_token');
    navigate('/admin/login');
  };

  return (
    <div className="min-h-screen bg-zinc-950 font-sans text-zinc-150 flex overflow-hidden">
      
      {/* WORDPRESS DARK SIDEBAR */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 flex flex-col justify-between shrink-0">
        <div>
          {/* Brand header */}
          <div className="h-16 px-6 border-b border-zinc-800 flex items-center justify-between bg-zinc-950">
            <div className="flex items-center gap-2">
              <div className="w-3.5 h-3.5 rounded-full bg-red-600 animate-pulse" />
              <span className="font-bold text-white tracking-wide text-sm uppercase">TechFNM Console</span>
            </div>
            <a href="/" target="_blank" rel="noopener noreferrer" className="text-zinc-550 hover:text-red-500 transition-colors">
              <ExternalLink size={14} />
            </a>
          </div>

          {/* Navigation */}
          <nav className="p-4 space-y-1">
            {menuItems.map((item) => {
              const Icon = item.icon;
              const isActive = currentTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setSearchParams({ tab: item.id })}
                  className={`w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    isActive
                      ? 'bg-red-600 text-white shadow-md shadow-red-950/20'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850/50'
                  }`}
                >
                  <Icon size={16} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>

        {/* Footer info & logout */}
        <div className="p-4 border-t border-zinc-800 bg-zinc-950">
          <button
            onClick={handleLogout}
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-red-500 font-semibold border border-zinc-800 hover:border-zinc-700 transition-all text-sm"
          >
            <LogOut size={15} />
            <span>Log out</span>
          </button>
        </div>
      </aside>

      {/* MAIN CONTAINER */}
      <div className="flex-grow flex flex-col min-w-0">
        
        {/* TOP BAR */}
        <header className="h-16 bg-zinc-900 border-b border-zinc-800 flex items-center justify-between px-8 z-10 shrink-0">
          <div className="flex items-center gap-4">
            <h1 className="text-white font-bold capitalize text-sm tracking-wide bg-zinc-950/80 px-3.5 py-1.5 rounded-lg border border-zinc-800/80">
              Console / {currentTab}
            </h1>
          </div>
          <div className="flex items-center gap-3">
            <span className="text-xs text-zinc-400 font-medium">Active User:</span>
            <span className="text-xs font-bold text-red-500 bg-red-950/20 border border-red-900/30 px-2.5 py-1 rounded-md">
              Administrator
            </span>
          </div>
        </header>

        {/* MAIN DISPLAY WORKSPACE */}
        <main className="flex-grow overflow-y-auto bg-zinc-950 p-8">
          {children}
        </main>
      </div>

    </div>
  );
}

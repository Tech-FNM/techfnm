import { useEffect, useState } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Users, MessageSquare, LogOut, Layers, HelpCircle, Globe, Menu, X, Code, PanelBottom } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLogout = async () => {
    await supabase.auth.signOut();
    navigate('/admindash/login');
  };

  const menuItems = [
    { path: '/admindash/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admindash/services', icon: Layers, label: 'Services' },
    { path: '/admindash/projects', icon: Briefcase, label: 'Projects' },
    { path: '/admindash/leadership', icon: Users, label: 'Leadership' },
    { path: '/admindash/testimonials', icon: MessageSquare, label: 'Testimonials' },
    { path: '/admindash/clients', icon: Globe, label: 'Clients' },
    { path: '/admindash/faqs', icon: HelpCircle, label: 'FAQs' },
    { path: '/admindash/scripts', icon: Code, label: 'Custom Scripts' },
    { path: '/admindash/footer', icon: PanelBottom, label: 'Footer' },
  ];

  return (
    <div className="min-h-screen bg-black flex flex-col md:flex-row">
      {/* Mobile Header */}
      <div className="md:hidden sticky top-0 left-0 right-0 h-16 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between px-4 z-40">
        <h2 className="text-xl font-bold text-white">Tech<span className="text-red-600">FNM</span></h2>
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="text-white p-2">
          {isMobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      {/* Sidebar */}
      <aside className={`fixed inset-y-0 left-0 transform ${isMobileMenuOpen ? 'translate-x-0' : '-translate-x-full'} md:relative md:translate-x-0 transition duration-200 ease-in-out z-50 w-64 bg-zinc-900 border-r border-zinc-800 h-screen flex flex-col`}>
        <div className="p-6 hidden md:block">
          <h2 className="text-2xl font-bold text-white">Tech<span className="text-red-600">FNM</span></h2>
          <p className="text-gray-500 text-sm mt-1">Admin Panel</p>
        </div>
        <nav className="mt-6 px-4 space-y-2 flex-1 overflow-y-auto">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
              onClick={() => setIsMobileMenuOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${
                location.pathname === item.path
                  ? 'bg-red-600 text-white'
                  : 'text-gray-400 hover:bg-zinc-800 hover:text-white'
              }`}
            >
              <item.icon size={20} />
              {item.label}
            </Link>
          ))}
          <button
            onClick={handleLogout}
            className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-gray-400 hover:bg-zinc-800 hover:text-white transition-colors mt-8"
          >
            <LogOut size={20} />
            Logout
          </button>
        </nav>
      </aside>

      {/* Overlay */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 bg-black/50 z-40 md:hidden" onClick={() => setIsMobileMenuOpen(false)} />
      )}

      {/* Main Content */}
      <main className="flex-1 p-4 md:p-8 overflow-y-auto w-full">
        <Outlet />
      </main>
    </div>
  );
}

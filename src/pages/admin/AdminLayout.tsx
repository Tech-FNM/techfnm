import { useEffect } from 'react';
import { Outlet, useNavigate, Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Briefcase, Users, MessageSquare, LogOut, Layers } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function AdminLayout() {
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const checkAuth = () => {
      const token = localStorage.getItem('admin_token');
      if (!token) {
        navigate('/admindash/login');
      }
    };
    checkAuth();
  }, [navigate]);

  const handleLogout = () => {
    localStorage.removeItem('admin_token');
    navigate('/admindash/login');
  };

  const menuItems = [
    { path: '/admindash/dashboard', icon: LayoutDashboard, label: 'Dashboard' },
    { path: '/admindash/services', icon: Layers, label: 'Services' },
    { path: '/admindash/projects', icon: Briefcase, label: 'Projects' },
    { path: '/admindash/team', icon: Users, label: 'Team' },
    { path: '/admindash/testimonials', icon: MessageSquare, label: 'Testimonials' },
  ];

  return (
    <div className="min-h-screen bg-black flex">
      {/* Sidebar */}
      <aside className="w-64 bg-zinc-900 border-r border-zinc-800 fixed h-full">
        <div className="p-6">
          <h2 className="text-2xl font-bold text-white">Tech<span className="text-red-600">FNM</span></h2>
          <p className="text-gray-500 text-sm mt-1">Admin Panel</p>
        </div>
        <nav className="mt-6 px-4 space-y-2">
          {menuItems.map((item) => (
            <Link
              key={item.path}
              to={item.path}
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

      {/* Main Content */}
      <main className="ml-64 flex-1 p-8 overflow-y-auto">
        <Outlet />
      </main>
    </div>
  );
}

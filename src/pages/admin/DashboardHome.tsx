import { useEffect, useState } from 'react';
import { Layers, Briefcase, Users, MessageSquare } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function DashboardHome() {
  const [stats, setStats] = useState({
    services: 0,
    projects: 0,
    team: 0,
    testimonials: 0,
  });

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    const [services, projects, team, testimonials] = await Promise.all([
      supabase.from('services').select('*', { count: 'exact', head: true }),
      supabase.from('projects').select('*', { count: 'exact', head: true }),
      supabase.from('team').select('*', { count: 'exact', head: true }),
      supabase.from('testimonials').select('*', { count: 'exact', head: true }),
    ]);

    setStats({
      services: services.count || 0,
      projects: projects.count || 0,
      team: team.count || 0,
      testimonials: testimonials.count || 0,
    });
  };

  const statCards = [
    { title: 'Total Services', value: stats.services, icon: Layers, color: 'text-blue-500' },
    { title: 'Total Projects', value: stats.projects, icon: Briefcase, color: 'text-green-500' },
    { title: 'Team Members', value: stats.team, icon: Users, color: 'text-purple-500' },
    { title: 'Testimonials', value: stats.testimonials, icon: MessageSquare, color: 'text-orange-500' },
  ];

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Dashboard Overview</h1>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, index) => (
          <div key={index} className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 flex items-center justify-between">
            <div>
              <p className="text-gray-400 text-sm">{stat.title}</p>
              <p className="text-3xl font-bold text-white mt-1">{stat.value}</p>
            </div>
            <stat.icon className={`${stat.color} w-10 h-10 opacity-80`} />
          </div>
        ))}
      </div>
    </div>
  );
}

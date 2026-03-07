import { useEffect, useState } from 'react';
import axios from 'axios';
import { Layers, Briefcase, Users, MessageSquare } from 'lucide-react';

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
      axios.get('/api/services'),
      axios.get('/api/projects'),
      axios.get('/api/team'),
      axios.get('/api/testimonials'),
    ]);

    setStats({
      services: services.data.length,
      projects: projects.data.length,
      team: team.data.length,
      testimonials: testimonials.data.length,
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

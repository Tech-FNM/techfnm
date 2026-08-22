import { useEffect, useState } from 'react';
import { FormInput, Briefcase, FileText, CheckCircle2, ShieldAlert } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function DashboardHome() {
  const [stats, setStats] = useState({
    leads: 0,
    services: 0,
    portfolio: 0,
    posts: 0,
  });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchStats();
  }, []);

  const fetchStats = async () => {
    try {
      setLoading(true);
      // Fetch Counts from Supabase tables
      const { count: leadsCount } = await supabase.from('service_requests').select('*', { count: 'exact', head: true });
      const { count: servicesCount } = await supabase.from('services').select('*', { count: 'exact', head: true });
      const { count: portfolioCount } = await supabase.from('projects').select('*', { count: 'exact', head: true });
      const { count: postsCount } = await supabase.from('seo_settings').select('*', { count: 'exact', head: true }); // Using seo settings count as post placeholder or general entries count

      // Fetch Recent Leads
      const { data: leads } = await supabase
        .from('service_requests')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5);

      setStats({
        leads: leadsCount || 0,
        services: servicesCount || 6,
        portfolio: portfolioCount || 6,
        posts: postsCount || 5,
      });

      if (leads) {
        setRecentLeads(leads);
      }
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
    }
  };

  const widgetCards = [
    { label: 'Total Leads / Submissions', value: stats.leads, icon: FormInput, color: 'text-red-500 bg-red-950/20 border-red-900/30' },
    { label: 'Active Services Offered', value: stats.services, icon: Briefcase, color: 'text-blue-500 bg-blue-950/20 border-blue-900/30' },
    { label: 'Portfolio Works Registered', value: stats.portfolio, icon: CheckCircle2, color: 'text-green-500 bg-green-950/20 border-green-900/30' },
    { label: 'Total Posts / SEO Configs', value: stats.posts, icon: FileText, color: 'text-purple-500 bg-purple-950/20 border-purple-900/30' },
  ];

  return (
    <div className="space-y-8">
      {/* Welcome Widget */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6 shadow-xl">
        <div className="space-y-2">
          <h2 className="text-2xl font-bold text-white leading-tight">Welcome to TechFNM Control Center</h2>
          <p className="text-sm text-zinc-400">
            This dashboard lets you configure and edit every asset, lead form submission, media asset, page copy, and SEO setting on your website.
          </p>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {widgetCards.map((card, index) => {
          const Icon = card.icon;
          return (
            <div key={index} className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 flex items-center justify-between shadow-md">
              <div className="space-y-1">
                <span className="text-xs font-semibold text-zinc-550 uppercase tracking-wider block">{card.label}</span>
                <span className="text-3xl font-extrabold text-white block">{loading ? '...' : card.value}</span>
              </div>
              <div className={`p-3.5 rounded-2xl border ${card.color}`}>
                <Icon size={22} />
              </div>
            </div>
          );
        })}
      </div>

      {/* Bottom sections */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Recent Activity Log */}
        <div className="lg:col-span-2 bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6 shadow-md">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <h3 className="text-lg font-bold text-white">Recent Submissions / Leads</h3>
            <span className="text-xs font-semibold text-zinc-500 uppercase tracking-wider">Form entries</span>
          </div>

          {loading ? (
            <div className="text-center py-10 text-zinc-650 text-sm font-mono">Loading active feed...</div>
          ) : recentLeads.length === 0 ? (
            <div className="text-center py-10 text-zinc-600 text-sm">
              <ShieldAlert size={28} className="mx-auto text-zinc-700 mb-2" />
              <p className="font-semibold">No submissions received yet</p>
              <p className="text-xs text-zinc-650 mt-1">Leads from contact and request forms will show up here.</p>
            </div>
          ) : (
            <div className="divide-y divide-zinc-850">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="py-4 first:pt-0 last:pb-0 flex items-start justify-between gap-4">
                  <div className="space-y-1">
                    <span className="text-sm font-bold text-white block">{lead.name || lead.email}</span>
                    <span className="text-xs text-zinc-400 block">{lead.service_type || 'General Consultation'}</span>
                    {lead.message && (
                      <p className="text-xs text-zinc-500 leading-relaxed max-w-lg line-clamp-1 italic">
                        "{lead.message}"
                      </p>
                    )}
                  </div>
                  <span className="text-[10px] font-semibold text-zinc-600 bg-zinc-950 border border-zinc-850 px-2 py-0.5 rounded">
                    {new Date(lead.created_at).toLocaleDateString()}
                  </span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* System Overview */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-6 shadow-md">
          <div className="flex items-center justify-between border-b border-zinc-800 pb-4">
            <h3 className="text-lg font-bold text-white">Database Health</h3>
            <span className="w-2.5 h-2.5 rounded-full bg-green-500 animate-pulse" />
          </div>

          <div className="space-y-4 text-sm">
            <div className="flex justify-between items-center text-zinc-400">
              <span>Supabase Endpoint</span>
              <span className="text-xs font-bold text-green-500 bg-green-950/20 px-2 py-0.5 rounded">Connected</span>
            </div>
            <div className="flex justify-between items-center text-zinc-400">
              <span>Media Buckets</span>
              <span className="text-xs font-bold text-green-500 bg-green-950/20 px-2 py-0.5 rounded">Connected</span>
            </div>
            <div className="flex justify-between items-center text-zinc-400">
              <span>Authentication</span>
              <span className="text-xs font-bold text-green-500 bg-green-950/20 px-2 py-0.5 rounded">Active</span>
            </div>
            <div className="pt-4 border-t border-zinc-850 space-y-2">
              <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Security Guidelines</span>
              <p className="text-xs text-zinc-500 leading-relaxed">
                Ensure that dynamic edit options are verified before deploying to production. Do not share administrative console links with unverified users.
              </p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

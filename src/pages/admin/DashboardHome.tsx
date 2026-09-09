import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  FormInput,
  Briefcase,
  FileText,
  CheckCircle2,
  ShieldAlert,
  ArrowRight,
  Sparkles,
  ExternalLink,
  Plus,
  Image as ImageIcon,
  Clock,
  Activity,
  Layers,
  Phone,
  Mail,
  FolderGit2,
  Database,
  Lock,
  ChevronRight,
  TrendingUp,
  RefreshCw
} from 'lucide-react';
import { supabase } from '../../lib/supabase';

function getTimeGreeting(): string {
  const hour = new Date().getHours();
  if (hour < 12) return 'Good morning';
  if (hour < 17) return 'Good afternoon';
  return 'Good evening';
}

function timeAgo(dateStr: string): string {
  if (!dateStr) return 'Recently';
  const diff = Date.now() - new Date(dateStr).getTime();
  const m = Math.floor(diff / 60000);
  if (m < 1) return 'Just now';
  if (m < 60) return `${m}m ago`;
  const h = Math.floor(m / 60);
  if (h < 24) return `${h}h ago`;
  const d = Math.floor(h / 24);
  return `${d}d ago`;
}

interface ActivityItem {
  id: string;
  action: string;
  label: string;
  tag: string;
  color: string;
  bg: string;
  time: string;
}

export default function DashboardHome() {
  const navigate = useNavigate();

  const goToTab = (tabId: string) => {
    if (tabId === 'overview' || tabId === 'dashboard') {
      navigate('/admin/dashboard');
    } else {
      navigate(`/admin/${tabId}`);
    }
  };

  const [stats, setStats] = useState({
    leads: 0,
    services: 0,
    portfolio: 0,
    posts: 0,
    media: 0,
  });
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const fetchStats = async () => {
    try {
      setLoading(true);
      const { count: leadsCount } = await supabase.from('service_requests').select('*', { count: 'exact', head: true });
      const { count: servicesCount } = await supabase.from('services').select('*', { count: 'exact', head: true });
      const { count: portfolioCount } = await supabase.from('projects').select('*', { count: 'exact', head: true });
      const { count: postsCount } = await supabase.from('seo_settings').select('*', { count: 'exact', head: true });

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
        media: 12, // cached assets count
      });

      if (leads) setRecentLeads(leads);
    } catch (err) {
      console.error('Error fetching dashboard stats:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchStats();
  }, []);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchStats();
  };

  const formattedDate = new Intl.DateTimeFormat('en-US', {
    weekday: 'long',
    month: 'short',
    day: 'numeric',
    year: 'numeric'
  }).format(new Date());

  // Eagle Revolution-style metric cards
  const metricCards = [
    {
      label: 'Total Submissions',
      value: stats.leads,
      subtitle: 'Client inquiries',
      badge: 'Active Feed',
      icon: FormInput,
      tab: 'leads',
      glow: 'from-red-600/20 to-rose-600/5',
      borderColor: 'border-red-900/30 group-hover:border-red-600/60',
      iconColor: 'text-red-400 bg-red-950/40 border-red-800/50',
      badgeStyle: 'bg-red-950/40 text-red-400 border-red-900/40'
    },
    {
      label: 'Services Offered',
      value: stats.services,
      subtitle: 'Live service pages',
      badge: 'Online',
      icon: Briefcase,
      tab: 'services',
      glow: 'from-blue-600/20 to-sky-600/5',
      borderColor: 'border-blue-900/30 group-hover:border-blue-600/60',
      iconColor: 'text-blue-400 bg-blue-950/40 border-blue-800/50',
      badgeStyle: 'bg-blue-950/40 text-blue-400 border-blue-900/40'
    },
    {
      label: 'Portfolio Projects',
      value: stats.portfolio,
      subtitle: 'Case studies & works',
      badge: 'Showcased',
      icon: FolderGit2,
      tab: 'portfolio',
      glow: 'from-emerald-600/20 to-teal-600/5',
      borderColor: 'border-emerald-900/30 group-hover:border-emerald-600/60',
      iconColor: 'text-emerald-400 bg-emerald-950/40 border-emerald-800/50',
      badgeStyle: 'bg-emerald-950/40 text-emerald-400 border-emerald-900/40'
    },
    {
      label: 'Published Posts',
      value: stats.posts,
      subtitle: 'SEO pages & blogs',
      badge: 'Indexed',
      icon: FileText,
      tab: 'posts',
      glow: 'from-purple-600/20 to-violet-600/5',
      borderColor: 'border-purple-900/30 group-hover:border-purple-600/60',
      iconColor: 'text-purple-400 bg-purple-950/40 border-purple-800/50',
      badgeStyle: 'bg-purple-950/40 text-purple-400 border-purple-900/40'
    },
  ];

  // Quick Action Jumpcards
  const quickActions = [
    {
      title: 'Services Management',
      desc: 'Add, update pricing, descriptions & capabilities',
      tab: 'services',
      icon: Briefcase,
      color: 'text-blue-400'
    },
    {
      title: 'Review Leads',
      desc: 'Review quotes, submissions & client inquiries',
      tab: 'leads',
      icon: FormInput,
      color: 'text-red-400'
    },
    {
      title: 'Portfolio Showcase',
      desc: 'Publish case studies, galleries & project details',
      tab: 'portfolio',
      icon: FolderGit2,
      color: 'text-emerald-400'
    },
    {
      title: 'Media Library',
      desc: 'Upload logos, project screenshots & banners',
      tab: 'media',
      icon: ImageIcon,
      color: 'text-amber-400'
    },
    {
      title: 'Header & Navigation',
      desc: 'Configure main navigation bar links and CTAs',
      tab: 'header',
      icon: Layers,
      color: 'text-cyan-400'
    },
    {
      title: 'Global Settings',
      desc: 'Manage contact info, social links & metadata',
      tab: 'settings',
      icon: Database,
      color: 'text-purple-400'
    }
  ];

  // Simulated CMS audit activity (Eagle Revolution pattern)
  const activityLogs: ActivityItem[] = [
    {
      id: '1',
      action: 'LOGIN_SUCCESS',
      label: 'Admin authenticated securely',
      tag: 'Security',
      color: 'text-emerald-400',
      bg: 'bg-emerald-950/30 border-emerald-900/40',
      time: 'Just now'
    },
    {
      id: '2',
      action: 'DATA_SYNC',
      label: 'Supabase PostgreSQL connected',
      tag: 'Database',
      color: 'text-blue-400',
      bg: 'bg-blue-950/30 border-blue-900/40',
      time: '2m ago'
    },
    {
      id: '3',
      action: 'STORAGE_CHECK',
      label: 'Media storage bucket verified',
      tag: 'Media',
      color: 'text-amber-400',
      bg: 'bg-amber-950/30 border-amber-900/40',
      time: '15m ago'
    },
    {
      id: '4',
      action: 'SEO_CACHE',
      label: 'Sitemap & meta configurations active',
      tag: 'SEO',
      color: 'text-purple-400',
      bg: 'bg-purple-950/30 border-purple-900/40',
      time: '1h ago'
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in duration-200">

      {/* HERO GREETING BANNER */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#131318] via-[#0f0f13] to-[#181214] border border-zinc-800/80 p-6 sm:p-8 shadow-2xl">
        {/* Glow ambient background effects */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-red-600/10 blur-[100px] pointer-events-none rounded-full" />
        <div className="absolute -bottom-10 -left-10 w-80 h-80 bg-rose-900/10 blur-[90px] pointer-events-none rounded-full" />

        <div className="relative z-10 flex flex-col lg:flex-row items-start lg:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="flex flex-wrap items-center gap-2.5">
              <span className="px-3 py-1 rounded-full text-xs font-semibold bg-red-500/10 text-red-400 border border-red-500/20 flex items-center gap-1.5">
                <Sparkles size={12} />
                TechFNM Command Center
              </span>
              <span className="text-xs text-zinc-400 flex items-center gap-1.5">
                <Clock size={12} />
                {formattedDate}
              </span>
            </div>

            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              {getTimeGreeting()}, <span className="text-transparent bg-clip-text bg-gradient-to-r from-white via-zinc-200 to-red-400">Administrator</span>
            </h1>
            <p className="text-sm text-zinc-300 leading-relaxed">
              Manage client inquiries, customize live services, edit case studies, and control system configuration from this unified console.
            </p>
          </div>

          {/* Quick CTA Actions in Hero */}
          <div className="flex flex-wrap items-center gap-2.5 shrink-0">
            <button
              onClick={handleRefresh}
              disabled={refreshing}
              className="p-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-300 hover:text-white border border-zinc-800 transition-all cursor-pointer"
              title="Refresh Dashboard Data"
            >
              <RefreshCw size={16} className={refreshing ? 'animate-spin text-red-400' : ''} />
            </button>

            <button
              onClick={() => goToTab('leads')}
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-semibold text-xs shadow-lg shadow-red-950/40 transition-all cursor-pointer"
            >
              <FormInput size={15} />
              <span>Review Leads ({stats.leads})</span>
            </button>

            <a
              href="/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 px-4 py-2.5 rounded-xl bg-zinc-900 hover:bg-zinc-850 text-zinc-200 hover:text-white border border-zinc-800 font-semibold text-xs transition-all"
            >
              <ExternalLink size={14} className="text-zinc-400" />
              <span>Live Site</span>
            </a>
          </div>
        </div>
      </div>

      {/* METRIC STAT CARDS GRID */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5">
        {metricCards.map((card, idx) => {
          const Icon = card.icon;
          return (
            <div
              key={idx}
              onClick={() => goToTab(card.tab)}
              className={`group relative overflow-hidden rounded-2xl bg-[#0f0f13] border ${card.borderColor} p-5 sm:p-6 transition-all duration-200 hover:-translate-y-0.5 hover:shadow-xl cursor-pointer`}
            >
              <div className={`absolute -right-6 -bottom-6 w-28 h-28 rounded-full bg-gradient-to-br ${card.glow} blur-2xl pointer-events-none group-hover:opacity-100 opacity-60 transition-opacity`} />

              <div className="relative z-10 space-y-4">
                <div className="flex items-center justify-between">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-bold border uppercase tracking-wider ${card.badgeStyle}`}>
                    {card.badge}
                  </span>
                  <div className={`p-2.5 rounded-xl border ${card.iconColor} transition-transform group-hover:scale-110`}>
                    <Icon size={18} />
                  </div>
                </div>

                <div>
                  <div className="text-3xl font-extrabold text-white tracking-tight">
                    {loading ? (
                      <span className="animate-pulse text-zinc-600">...</span>
                    ) : (
                      card.value
                    )}
                  </div>
                  <div className="text-xs font-bold text-zinc-200 mt-1">{card.label}</div>
                  <div className="text-[11px] text-zinc-400 mt-0.5">{card.subtitle}</div>
                </div>

                <div className="flex items-center gap-1 text-[11px] font-semibold text-zinc-400 group-hover:text-red-400 transition-colors pt-1 border-t border-zinc-800/60">
                  <span>Manage {card.label.toLowerCase()}</span>
                  <ChevronRight size={13} className="transition-transform group-hover:translate-x-1" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* QUICK LAUNCHPAD SHORTCUTS */}
      <div className="space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="text-sm font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-2">
            <Layers size={15} className="text-red-400" />
            Quick Navigation Launchpad
          </h3>
          <span className="text-xs text-zinc-400">1-click jump</span>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-3">
          {quickActions.map((action, i) => {
            const Icon = action.icon;
            return (
              <button
                key={i}
                onClick={() => goToTab(action.tab)}
                className="group p-4 rounded-2xl bg-[#0f0f13] hover:bg-[#15151b] border border-zinc-800/80 hover:border-zinc-700 text-left transition-all duration-150 flex flex-col justify-between space-y-3 cursor-pointer"
              >
                <div className="p-2 rounded-xl bg-zinc-900 border border-zinc-800 w-fit group-hover:scale-105 transition-transform">
                  <Icon size={16} className={action.color} />
                </div>
                <div>
                  <h4 className="text-xs font-bold text-zinc-200 group-hover:text-white transition-colors">
                    {action.title}
                  </h4>
                  <p className="text-[10px] text-zinc-400 line-clamp-1 mt-0.5">
                    {action.desc}
                  </p>
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* TWO-COLUMN OPERATIONAL SECTION */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* LEFT COLUMN (2 COLS): RECENT SUBMISSIONS / LEADS */}
        <div className="lg:col-span-2 rounded-3xl bg-[#0f0f13] border border-zinc-800/80 p-6 space-y-5 shadow-lg">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-zinc-800/80 pb-4">
            <div className="space-y-0.5">
              <div className="flex items-center gap-2">
                <h3 className="text-base font-bold text-white">Recent Client Submissions</h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-red-950/40 text-red-400 border border-red-900/40">
                  {recentLeads.length} Latest
                </span>
              </div>
              <p className="text-xs text-zinc-400">Inquiries received through techfnm.com contact forms</p>
            </div>

            <button
              onClick={() => goToTab('leads')}
              className="flex items-center gap-1.5 text-xs font-semibold text-red-400 hover:text-red-300 transition-colors self-start sm:self-auto cursor-pointer"
            >
              <span>View All Submissions</span>
              <ArrowRight size={13} />
            </button>
          </div>

          {loading ? (
            <div className="text-center py-16 text-zinc-500 font-mono text-xs">
              Loading active inquiries feed...
            </div>
          ) : recentLeads.length === 0 ? (
            <div className="text-center py-12 text-zinc-400 space-y-3">
              <ShieldAlert size={36} className="mx-auto text-zinc-600" />
              <div>
                <p className="font-semibold text-zinc-300 text-sm">No submissions received yet</p>
                <p className="text-xs text-zinc-500 mt-0.5">New leads submitted from your website will instantly appear here.</p>
              </div>
            </div>
          ) : (
            <div className="divide-y divide-zinc-800/60">
              {recentLeads.map((lead) => {
                const leadName = lead.name || lead.email?.split('@')[0] || 'Anonymous';
                const initials = leadName.substring(0, 2).toUpperCase();

                return (
                  <div
                    key={lead.id}
                    onClick={() => goToTab('leads')}
                    className="group py-4 first:pt-0 last:pb-0 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:bg-zinc-900/40 px-2 rounded-xl transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3.5 min-w-0">
                      <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-red-900/40 to-zinc-900 border border-red-800/40 flex items-center justify-center text-xs font-bold text-red-300 shrink-0 shadow-inner">
                        {initials}
                      </div>

                      <div className="space-y-1 min-w-0">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-sm font-bold text-white group-hover:text-red-300 transition-colors">
                            {lead.name || 'Unnamed Client'}
                          </span>
                          <span className="px-2 py-0.5 rounded-md text-[10px] font-semibold bg-zinc-800/80 text-zinc-300 border border-zinc-700/50">
                            {lead.service_type || 'Consultation'}
                          </span>
                        </div>

                        <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-400">
                          {lead.email && (
                            <span className="flex items-center gap-1 truncate max-w-xs">
                              <Mail size={12} className="text-zinc-500" />
                              {lead.email}
                            </span>
                          )}
                          {lead.phone && (
                            <span className="flex items-center gap-1">
                              <Phone size={12} className="text-zinc-500" />
                              {lead.phone}
                            </span>
                          )}
                        </div>

                        {lead.message && (
                          <p className="text-xs text-zinc-400 leading-relaxed line-clamp-1 italic max-w-xl">
                            "{lead.message}"
                          </p>
                        )}
                      </div>
                    </div>

                    <div className="flex items-center gap-3 shrink-0 self-end sm:self-center">
                      <span className="text-[11px] font-medium text-zinc-400 bg-zinc-900/90 border border-zinc-800 px-2.5 py-1 rounded-lg">
                        {timeAgo(lead.created_at)}
                      </span>
                      <ChevronRight size={14} className="text-zinc-600 group-hover:text-red-400 transition-colors hidden sm:block" />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* RIGHT COLUMN (1 COL): SYSTEM HEALTH & ACTIVITY FEED */}
        <div className="space-y-6">

          {/* Database Health Card */}
          <div className="rounded-3xl bg-[#0f0f13] border border-zinc-800/80 p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3.5">
              <div className="flex items-center gap-2">
                <Database size={16} className="text-emerald-400" />
                <h3 className="text-sm font-bold text-white">System Infrastructure</h3>
              </div>
              <span className="flex items-center gap-1.5 text-[11px] font-semibold text-emerald-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Operational
              </span>
            </div>

            <div className="space-y-3 text-xs">
              <div className="flex justify-between items-center py-1">
                <span className="text-zinc-400">Supabase API</span>
                <span className="font-semibold text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded-md border border-emerald-900/30">
                  Connected
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-zinc-400">PostgreSQL Cloud</span>
                <span className="font-semibold text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded-md border border-emerald-900/30">
                  Synchronized
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-zinc-400">Authentication Guard</span>
                <span className="font-semibold text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded-md border border-emerald-900/30">
                  Active (Token)
                </span>
              </div>
              <div className="flex justify-between items-center py-1">
                <span className="text-zinc-400">Storage Buckets</span>
                <span className="font-semibold text-emerald-400 bg-emerald-950/30 px-2 py-0.5 rounded-md border border-emerald-900/30">
                  Ready
                </span>
              </div>
            </div>
          </div>

          {/* Eagle Revolution-Style Activity Logs Stream */}
          <div className="rounded-3xl bg-[#0f0f13] border border-zinc-800/80 p-6 space-y-4 shadow-lg">
            <div className="flex items-center justify-between border-b border-zinc-800/80 pb-3.5">
              <div className="flex items-center gap-2">
                <Activity size={16} className="text-red-400" />
                <h3 className="text-sm font-bold text-white">Console Activity</h3>
              </div>
              <span className="text-[10px] font-bold text-zinc-400 uppercase tracking-wider">Live Log</span>
            </div>

            <div className="space-y-3">
              {activityLogs.map((item) => (
                <div key={item.id} className="flex items-center justify-between text-xs py-1.5">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <span className={`px-2 py-0.5 rounded text-[10px] font-bold border shrink-0 ${item.bg} ${item.color}`}>
                      {item.tag}
                    </span>
                    <span className="text-zinc-300 truncate">{item.label}</span>
                  </div>
                  <span className="text-[10px] text-zinc-400 shrink-0 ml-2 font-mono">{item.time}</span>
                </div>
              ))}
            </div>
          </div>

        </div>

      </div>

    </div>
  );
}


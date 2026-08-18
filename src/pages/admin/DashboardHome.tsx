import { useEffect, useState } from 'react';
import { Layers, Briefcase, Users, MessageSquare, Globe, HelpCircle, ChevronUp, ChevronDown, CheckCircle2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { Link } from 'react-router-dom';

const Widget = ({ title, children, defaultOpen = true }: { title: string, children: React.ReactNode, defaultOpen?: boolean }) => {
  const [isOpen, setIsOpen] = useState(defaultOpen);

  return (
    <div className="bg-zinc-900 border border-zinc-800 mb-6 shadow-sm">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800 bg-zinc-900/80">
        <h3 className="font-semibold text-white text-sm">{title}</h3>
        <div className="flex gap-2 text-zinc-500">
          <button onClick={() => setIsOpen(!isOpen)} className="hover:text-white transition-colors">
            {isOpen ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </button>
        </div>
      </div>
      {isOpen && (
        <div className="p-4 text-zinc-400 text-sm">
          {children}
        </div>
      )}
    </div>
  );
};

export default function DashboardHome() {
  const [stats, setStats] = useState({
    services: 0,
    projects: 0,
    blogs: 0,
    faqs: 0,
  });

  const [recentProjects, setRecentProjects] = useState<any[]>([]);

  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      const [servicesRes, projectsRes, faqsRes] = await Promise.all([
        supabase.from('services').select('*', { count: 'exact', head: true }),
        supabase.from('projects').select('*', { count: 'exact', head: true }),
        supabase.from('faqs').select('*', { count: 'exact', head: true }),
      ]);
      
      const { data: recent } = await supabase.from('projects').select('*').order('created_at', { ascending: false }).limit(2);
      
      setStats({
        services: servicesRes.count || 0,
        projects: projectsRes.count || 0,
        blogs: 0, // Placeholder
        faqs: faqsRes.count || 0,
      });

      if (recent) setRecentProjects(recent);

    } catch (error) {
      console.error('Error fetching data:', error);
    }
  };

  return (
    <div className="p-2 md:p-6 max-w-7xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-normal text-white">Dashboard</h1>
        <div className="flex gap-4">
          <button className="px-4 py-1.5 border border-zinc-700 rounded text-sm text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors">
            Screen Options ▼
          </button>
          <button className="px-4 py-1.5 border border-zinc-700 rounded text-sm text-zinc-400 hover:text-white hover:border-zinc-500 transition-colors">
            Help ▼
          </button>
        </div>
      </div>

      <div className="flex flex-col lg:flex-row gap-6">
        
        {/* Left Column */}
        <div className="w-full lg:w-1/2 flex flex-col">
          
          <Widget title="Site Health Status">
            <div className="flex items-start gap-4">
              <div className="w-1/3 flex justify-center items-center py-4 text-zinc-500">
                <CheckCircle2 size={48} className="text-zinc-700" />
              </div>
              <div className="w-2/3">
                <p className="mb-2">Your site's health is currently looking good.</p>
                <p>Site health checks run automatically to gather information about your site. You can also <Link to="#" className="text-red-500 hover:underline">visit the Site Health screen</Link> to gather information about your site now.</p>
              </div>
            </div>
          </Widget>

          <Widget title="At a Glance">
            <div className="flex flex-wrap text-sm gap-y-4">
              <div className="w-1/2 flex items-center gap-2 hover:text-red-500 transition-colors">
                <Layers size={18} />
                <Link to="/admindash/services">{stats.services} Services</Link>
              </div>
              <div className="w-1/2 flex items-center gap-2 hover:text-red-500 transition-colors">
                <Briefcase size={18} />
                <Link to="/admindash/projects">{stats.projects} Projects</Link>
              </div>
              <div className="w-1/2 flex items-center gap-2 hover:text-red-500 transition-colors">
                <FileText size={18} className="lucide-icon" />
                <Link to="/admindash/blogs">{stats.blogs} Blogs</Link>
              </div>
              <div className="w-1/2 flex items-center gap-2 hover:text-red-500 transition-colors">
                <HelpCircle size={18} />
                <Link to="/admindash/faqs">{stats.faqs} FAQs</Link>
              </div>
            </div>
            <p className="mt-6 text-zinc-500 text-xs">TechFNM CMS running <Link to="#" className="text-red-500 hover:underline">Custom Tech Theme</Link>.</p>
          </Widget>

          <Widget title="Activity">
            <div>
              <p className="font-semibold text-white mb-2 text-xs uppercase tracking-wide">Recently Published</p>
              <ul className="space-y-3 mb-6">
                {recentProjects.map((proj, idx) => (
                  <li key={idx} className="flex justify-between items-center">
                    <span>{new Date(proj.created_at).toLocaleDateString()}</span>
                    <Link to={`/admindash/projects`} className="text-red-500 hover:underline truncate ml-4 max-w-[60%]">{proj.title}</Link>
                  </li>
                ))}
                {recentProjects.length === 0 && <li>No recent activity.</li>}
              </ul>
              
              <div className="pt-4 border-t border-zinc-800">
                <p className="font-semibold text-white mb-2 text-xs uppercase tracking-wide">Recent Messages</p>
                <div className="flex gap-4 items-start bg-zinc-950 p-3 rounded-lg border border-zinc-800">
                  <div className="w-10 h-10 rounded-full bg-zinc-800 flex items-center justify-center text-red-500 flex-shrink-0">
                    <Users size={20} />
                  </div>
                  <div>
                    <p className="text-white text-sm">From <span className="text-red-500">John Doe</span> on Project Inquiry</p>
                    <p className="text-zinc-500 text-xs mt-1 line-clamp-2">Hi, I would like to get a quote for a new e-commerce website. Please contact me at your earliest convenience.</p>
                  </div>
                </div>
              </div>
            </div>
          </Widget>

        </div>

        {/* Right Column */}
        <div className="w-full lg:w-1/2 flex flex-col">
          
          <Widget title="Quick Draft">
            <form className="space-y-4" onSubmit={(e) => e.preventDefault()}>
              <div>
                <input 
                  type="text" 
                  placeholder="Title" 
                  className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500"
                />
              </div>
              <div>
                <textarea 
                  placeholder="What's on your mind?" 
                  rows={4}
                  className="w-full bg-black border border-zinc-800 rounded px-3 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500 resize-none"
                />
              </div>
              <button className="bg-zinc-800 hover:bg-zinc-700 text-zinc-300 hover:text-white px-4 py-1.5 rounded border border-zinc-700 transition-colors">
                Save Draft
              </button>
            </form>
          </Widget>

          <Widget title="TechFNM Events and News">
            <div className="mb-4">
              <label className="mr-2">City:</label>
              <input type="text" placeholder="London" className="bg-black border border-zinc-800 rounded px-2 py-1 focus:outline-none focus:border-red-500" />
              <button className="ml-2 px-3 py-1 border border-zinc-700 rounded hover:bg-zinc-800 transition-colors">Submit</button>
            </div>
            
            <ul className="space-y-4 border-t border-zinc-800 pt-4">
              <li>
                <Link to="#" className="text-red-500 hover:underline font-medium text-base">TechFNM Security and Maintenance Release</Link>
                <p className="text-zinc-500 mt-1">Important updates for your CMS platform.</p>
              </li>
              <li>
                <Link to="#" className="text-red-500 hover:underline font-medium text-base">New React Components Added</Link>
                <p className="text-zinc-500 mt-1">Explore the new components available in your design system.</p>
              </li>
              <li>
                <Link to="#" className="text-red-500 hover:underline font-medium text-base">Performance Tuning Guide</Link>
                <p className="text-zinc-500 mt-1">Learn how to optimize your site for faster load times.</p>
              </li>
            </ul>
          </Widget>

        </div>
      </div>
    </div>
  );
}

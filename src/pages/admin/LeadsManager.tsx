import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Trash2, Search, Eye, X } from 'lucide-react';
import toast from 'react-hot-toast';

export default function LeadsManager() {
  const [leads, setLeads] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  const [viewLead, setViewLead] = useState<any>(null);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    setIsLoading(true);
    const { data, error } = await supabase
      .from('service_requests')
      .select('*')
      .order('created_at', { ascending: false });
    
    if (!error) setLeads(data || []);
    setIsLoading(false);
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this lead?')) return;
    const { error } = await supabase.from('service_requests').delete().eq('id', id);
    if (!error) {
      toast.success('Lead deleted successfully');
      fetchLeads();
    } else {
      toast.error('Error deleting lead');
    }
  };

  const handleBulkDelete = async () => {
    if (selected.length === 0) return;
    if (!window.confirm(`Delete ${selected.length} leads?`)) return;
    
    let success = true;
    for (const id of selected) {
      const { error } = await supabase.from('service_requests').delete().eq('id', id);
      if (error) success = false;
    }
    
    setSelected([]);
    if (success) {
      toast.success('Leads deleted successfully');
    } else {
      toast.error('Error deleting some leads');
    }
    fetchLeads();
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selected.length === filteredLeads.length) setSelected([]);
    else setSelected(filteredLeads.map(l => l.id));
  };

  const filteredLeads = leads.filter(l => 
    l.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    l.business_name?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="p-4 md:p-6 relative">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-xl text-white font-normal">Service Leads</h1>
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-red-500">All ({leads.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search Leads" 
            className="bg-zinc-900 border border-zinc-800 px-2 py-1 text-sm text-white focus:outline-none focus:border-red-500 w-40 sm:w-60"
          />
          <button className="bg-zinc-800 border border-zinc-700 text-zinc-300 px-3 py-1 text-sm hover:text-white transition-colors">
            Search
          </button>
        </div>
      </div>

      {/* Bulk actions */}
      <div className="flex items-center gap-2 mb-2 text-sm">
        <select className="bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-1 text-sm focus:outline-none">
          <option>Bulk actions</option>
          <option value="delete">Delete</option>
        </select>
        <button onClick={handleBulkDelete} className="bg-zinc-800 border border-zinc-700 text-zinc-300 px-3 py-1 text-sm hover:text-white transition-colors">Apply</button>
        <span className="text-zinc-600 ml-auto">{filteredLeads.length} items</span>
      </div>

      {/* Table */}
      <div className="border border-zinc-800 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="p-2 w-8 text-center">
                <input type="checkbox" checked={selected.length === filteredLeads.length && filteredLeads.length > 0} onChange={toggleAll} className="accent-red-500" />
              </th>
              <th className="p-2 text-left text-zinc-400 font-medium">Name</th>
              <th className="p-2 text-left text-zinc-400 font-medium">Email</th>
              <th className="p-2 text-left text-zinc-400 font-medium hidden md:table-cell">Business</th>
              <th className="p-2 text-left text-zinc-400 font-medium hidden lg:table-cell">Service</th>
              <th className="p-2 text-left text-zinc-400 font-medium">Date</th>
            </tr>
          </thead>
          <tbody>
            {isLoading ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-zinc-500">Loading leads...</td>
              </tr>
            ) : filteredLeads.length === 0 ? (
              <tr>
                <td colSpan={6} className="p-6 text-center text-zinc-500">No leads found.</td>
              </tr>
            ) : (
              filteredLeads.map(lead => (
                <tr key={lead.id} className="border-b border-zinc-800/60 hover:bg-zinc-900/50 group">
                  <td className="p-2 text-center">
                    <input type="checkbox" checked={selected.includes(lead.id)} onChange={() => toggleSelect(lead.id)} className="accent-red-500" />
                  </td>
                  <td className="p-2">
                    <div>
                      <button onClick={() => setViewLead(lead)} className="text-white font-medium hover:text-red-500 transition-colors text-left">
                        {lead.name}
                      </button>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 mt-1 text-xs">
                        <button onClick={() => setViewLead(lead)} className="text-red-500 hover:underline">View</button>
                        <span className="text-zinc-700">|</span>
                        <button onClick={() => handleDelete(lead.id)} className="text-red-400 hover:underline">Trash</button>
                      </div>
                    </div>
                  </td>
                  <td className="p-2 text-zinc-300">
                    <a href={`mailto:${lead.email}`} className="hover:text-red-500">{lead.email}</a>
                  </td>
                  <td className="p-2 text-zinc-400 hidden md:table-cell">{lead.business_name}</td>
                  <td className="p-2 text-zinc-400 hidden lg:table-cell">
                    <span className="bg-zinc-800 px-2 py-1 rounded text-xs">{lead.service}</span>
                  </td>
                  <td className="p-2 text-zinc-500">
                    <div className="text-xs text-zinc-400">{new Date(lead.created_at).toLocaleDateString()}</div>
                    <div className="text-xs text-zinc-600">{new Date(lead.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>

      {/* View Lead Modal */}
      {viewLead && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 w-full max-w-2xl max-h-[90vh] overflow-y-auto rounded-lg shadow-xl">
            <div className="flex items-center justify-between px-6 py-4 border-b border-zinc-800 sticky top-0 bg-zinc-900/95 backdrop-blur z-10">
              <h2 className="text-white text-lg font-semibold">Lead Details</h2>
              <button onClick={() => setViewLead(null)} className="text-zinc-400 hover:text-white p-1 rounded-md hover:bg-zinc-800">
                <X size={20} />
              </button>
            </div>
            
            <div className="p-6 space-y-6">
              {/* Header Info */}
              <div className="flex flex-col sm:flex-row justify-between gap-4 pb-6 border-b border-zinc-800">
                <div>
                  <h3 className="text-2xl font-bold text-white mb-1">{viewLead.name}</h3>
                  <div className="flex items-center gap-3 text-sm text-zinc-400">
                    <a href={`mailto:${viewLead.email}`} className="hover:text-red-500 transition-colors">{viewLead.email}</a>
                    <span>•</span>
                    <a href={`tel:${viewLead.phone}`} className="hover:text-red-500 transition-colors">{viewLead.phone}</a>
                  </div>
                </div>
                <div className="text-left sm:text-right">
                  <div className="text-xs text-zinc-500 mb-1">Received On</div>
                  <div className="text-sm text-zinc-300">{new Date(viewLead.created_at).toLocaleString()}</div>
                  <div className="mt-2 inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-red-500/10 text-red-500 border border-red-500/20">
                    {viewLead.service}
                  </div>
                </div>
              </div>

              {/* Business Info */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 pb-6 border-b border-zinc-800">
                <div>
                  <div className="text-xs text-zinc-500 mb-1">Business Name</div>
                  <div className="text-sm text-white">{viewLead.business_name}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-500 mb-1">Business Type</div>
                  <div className="text-sm text-white">{viewLead.business_type}</div>
                </div>
                {viewLead.business_website && (
                  <div className="sm:col-span-2">
                    <div className="text-xs text-zinc-500 mb-1">Website</div>
                    <a href={viewLead.business_website.startsWith('http') ? viewLead.business_website : `https://${viewLead.business_website}`} target="_blank" rel="noopener noreferrer" className="text-sm text-red-500 hover:underline">
                      {viewLead.business_website}
                    </a>
                  </div>
                )}
              </div>

              {/* Query / Details */}
              <div className="space-y-6 pb-6 border-b border-zinc-800">
                <div>
                  <div className="text-xs text-zinc-500 mb-2">Description / Query</div>
                  <div className="text-sm text-zinc-300 bg-black/50 p-4 rounded-lg border border-zinc-800/50 whitespace-pre-wrap leading-relaxed">
                    {viewLead.description}
                  </div>
                </div>
                
                {viewLead.seo_issues && viewLead.seo_issues.length > 0 && (
                  <div>
                    <div className="text-xs text-zinc-500 mb-2">SEO Issues Facing</div>
                    <div className="flex flex-wrap gap-2">
                      {viewLead.seo_issues.map((issue: string, i: number) => (
                        <span key={i} className="bg-zinc-800 border border-zinc-700 px-2 py-1 rounded text-xs text-zinc-300">
                          {issue}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>

              {/* Metadata */}
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-sm bg-zinc-950 p-4 rounded-lg border border-zinc-800">
                <div>
                  <div className="text-xs text-zinc-500 mb-1">Preferred Contact</div>
                  <div className="text-zinc-300">{viewLead.preferred_contact}</div>
                </div>
                <div>
                  <div className="text-xs text-zinc-500 mb-1">Source</div>
                  <div className="text-zinc-300">{viewLead.how_found}</div>
                </div>
                {viewLead.why_choose_us && (
                  <div>
                    <div className="text-xs text-zinc-500 mb-1">Why Choose Us?</div>
                    <div className="text-zinc-300 italic">"{viewLead.why_choose_us}"</div>
                  </div>
                )}
              </div>
            </div>
            
            <div className="px-6 py-4 border-t border-zinc-800 bg-zinc-950/50 flex justify-end">
              <a 
                href={`mailto:${viewLead.email}?subject=Re: Your Service Request - TechFNM`}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
              >
                Reply via Email
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

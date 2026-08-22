import { useEffect, useState } from 'react';
import { Mail, Phone, Trash2, Calendar, ClipboardList } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast, Toaster } from 'react-hot-toast';

export default function LeadsManager() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchLeads();
  }, []);

  const fetchLeads = async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from('service_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (data) {
        setLeads(data);
      }
    } catch (err) {
      console.error('Error fetching leads:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    if (!window.confirm('Are you sure you want to delete this lead submission?')) return;

    try {
      const { error } = await supabase.from('service_requests').delete().eq('id', id);
      if (error) throw error;
      toast.success('Lead deleted successfully');
      fetchLeads();
    } catch (err: any) {
      toast.error(err.message || 'Error deleting lead');
    }
  };

  return (
    <div className="space-y-6">
      <Toaster position="top-right" toastOptions={{ style: { background: '#18181b', color: '#fff' } }} />

      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800 pb-4">
        <div className="space-y-1">
          <h2 className="text-xl font-bold text-white">Leads Manager</h2>
          <p className="text-xs text-zinc-500">Manage all requests submitted from request-service forms.</p>
        </div>
      </div>

      {loading ? (
        <div className="text-center py-20 text-zinc-500 font-mono">Loading leads feed...</div>
      ) : leads.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900 border border-zinc-800 rounded-3xl text-zinc-500">
          <ClipboardList size={36} className="mx-auto text-zinc-700 mb-4" />
          <p className="font-semibold text-white">No Lead Submissions Yet</p>
          <p className="text-xs text-zinc-650 mt-1">Form submissions will be captured and visible here.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6">
          {leads.map((lead) => (
            <div key={lead.id} className="bg-zinc-900 border border-zinc-850 rounded-3xl p-6 hover:border-zinc-800 transition-all flex flex-col justify-between md:flex-row md:items-center gap-6">
              
              <div className="space-y-3 max-w-xl">
                <div className="flex items-center gap-3">
                  <h3 className="font-bold text-white text-lg">{lead.name}</h3>
                  <span className="text-xs font-bold px-3 py-1 rounded-full bg-red-950/20 border border-red-900/30 text-red-500">
                    {lead.service_type || 'Consultation'}
                  </span>
                  {lead.plan && (
                    <span className="text-xs font-bold px-3 py-1 rounded-full bg-blue-950/20 border border-blue-900/30 text-blue-500">
                      Plan: {lead.plan}
                    </span>
                  )}
                </div>

                <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-xs text-zinc-500 font-medium">
                  <a href={`mailto:${lead.email}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                    <Mail size={13} className="text-red-500" />
                    <span>{lead.email}</span>
                  </a>
                  {lead.phone && (
                    <a href={`tel:${lead.phone}`} className="flex items-center gap-1.5 hover:text-white transition-colors">
                      <Phone size={13} className="text-red-500" />
                      <span>{lead.phone}</span>
                    </a>
                  )}
                  <div className="flex items-center gap-1.5">
                    <Calendar size={13} />
                    <span>{new Date(lead.created_at).toLocaleString()}</span>
                  </div>
                </div>

                {lead.message && (
                  <div className="bg-zinc-950/80 border border-zinc-850 p-4 rounded-xl text-zinc-400 text-sm italic leading-relaxed">
                    "{lead.message}"
                  </div>
                )}
              </div>

              <div className="flex justify-end md:justify-start">
                <button
                  onClick={() => handleDelete(lead.id)}
                  className="bg-zinc-950 border border-zinc-850 hover:bg-zinc-850 hover:text-red-500 text-zinc-500 p-3 rounded-2xl transition-colors"
                >
                  <Trash2 size={16} />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Mail, Phone, Trash2, Calendar, ClipboardList, Eye, X } from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { supabase } from '../../lib/supabase';
import { toast, Toaster } from 'react-hot-toast';

export default function LeadsManager() {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedLead, setSelectedLead] = useState<any>(null);

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

              <div className="flex justify-end md:justify-start gap-2">
                <button
                  onClick={() => setSelectedLead(lead)}
                  className="bg-zinc-950 border border-zinc-850 hover:bg-zinc-850 hover:text-white text-zinc-500 p-3 rounded-2xl transition-colors"
                  title="View Details"
                >
                  <Eye size={16} />
                </button>
                <button
                  onClick={() => handleDelete(lead.id)}
                  className="bg-zinc-950 border border-zinc-850 hover:bg-zinc-850 hover:text-red-500 text-zinc-500 p-3 rounded-2xl transition-colors"
                  title="Delete Lead"
                >
                  <Trash2 size={16} />
                </button>
              </div>

            </div>
          ))}
        </div>
      )}
      {/* Details Modal */}
      <AnimatePresence>
        {selectedLead && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setSelectedLead(null)}
            className="fixed inset-0 z-50 bg-black/90 backdrop-blur-md flex items-center justify-center p-4 cursor-zoom-out"
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              onClick={(e) => e.stopPropagation()}
              className="relative max-w-lg w-full bg-zinc-900 border border-zinc-800 rounded-3xl p-8 shadow-2xl space-y-6 cursor-default text-left"
            >
              {/* Close button */}
              <button
                onClick={() => setSelectedLead(null)}
                className="absolute top-6 right-6 bg-zinc-950 hover:bg-zinc-800 text-zinc-400 hover:text-white p-2 rounded-full border border-zinc-800 transition-colors"
              >
                <X size={16} />
              </button>

              <div className="space-y-4">
                <div className="space-y-1">
                  <span className="text-[10px] font-bold text-red-500 uppercase tracking-widest block">Submission Details</span>
                  <h3 className="text-xl font-bold text-white leading-tight">{selectedLead.name}</h3>
                </div>

                <div className="w-full h-[1px] bg-zinc-800" />

                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div className="space-y-1">
                    <span className="text-zinc-500 block">Service Requested</span>
                    <span className="font-bold text-white bg-red-950/20 border border-red-900/30 px-2 py-0.5 rounded text-[11px] inline-block text-red-500">
                      {selectedLead.service_type || 'Consultation'}
                    </span>
                  </div>
                  {selectedLead.plan && (
                    <div className="space-y-1">
                      <span className="text-zinc-500 block font-medium">Selected Plan</span>
                      <span className="font-bold text-white bg-blue-950/20 border border-blue-900/30 px-2 py-0.5 rounded text-[11px] inline-block text-blue-550">
                        {selectedLead.plan}
                      </span>
                    </div>
                  )}
                </div>

                <div className="space-y-3 text-xs sm:text-sm pt-2">
                  <div className="flex items-center gap-2">
                    <Mail size={14} className="text-red-500" />
                    <a href={`mailto:${selectedLead.email}`} className="text-zinc-300 hover:text-white transition-colors">{selectedLead.email}</a>
                  </div>
                  {selectedLead.phone && (
                    <div className="flex items-center gap-2">
                      <Phone size={14} className="text-red-500" />
                      <a href={`tel:${selectedLead.phone}`} className="text-zinc-300 hover:text-white transition-colors">{selectedLead.phone}</a>
                    </div>
                  )}
                  <div className="flex items-center gap-2 text-zinc-400">
                    <Calendar size={14} />
                    <span>{new Date(selectedLead.created_at).toLocaleString()}</span>
                  </div>
                </div>

                {selectedLead.message && (
                  <div className="space-y-1.5 pt-2">
                    <span className="text-xs text-zinc-550 font-bold uppercase tracking-wider block">Message Body</span>
                    <div className="bg-zinc-950 border border-zinc-850 p-4 rounded-2xl text-zinc-300 text-sm leading-relaxed max-h-48 overflow-y-auto whitespace-pre-wrap">
                      {selectedLead.message}
                    </div>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

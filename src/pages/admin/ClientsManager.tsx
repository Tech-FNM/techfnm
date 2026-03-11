import { useEffect, useState } from 'react';
import { Plus, Trash, Edit, Check, X, Upload, Globe } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function ClientsManager() {
  const [clients, setClients] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [currentClient, setCurrentClient] = useState<any>({
    name: '',
    logo: '',
    website: '',
  });

  useEffect(() => {
    fetchClients();
  }, []);

  const fetchClients = async () => {
    try {
      const { data, error } = await supabase.from('clients').select('*').order('created_at', { ascending: false });
      if (data) {
        setClients(data);
      }
    } catch (error) {
      console.error('Error fetching clients:', error);
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    try {
      setUploading(true);
      if (!e.target.files || e.target.files.length === 0) return;
      
      const file = e.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `clients/${fileName}`;

      const { error: uploadError } = await supabase.storage
        .from('agency-assets')
        .upload(filePath, file, { upsert: true });

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('agency-assets')
        .getPublicUrl(filePath);

      const customUrl = publicUrl.replace('https://rpnaqrmquddupmxvvcjg.supabase.co/storage/v1/object/public', '/image');

      setCurrentClient({ ...currentClient, logo: customUrl });
      alert('Logo uploaded successfully!');
    } catch (error: any) {
      console.error('Upload error details:', error);
      alert('Upload failed: ' + (error.message || 'Unknown error') + '\n\nIf the bucket exists, please check your Storage Policies (RLS) in Supabase.');
    } finally {
      setUploading(false);
    }
  };

  const handleSave = async () => {
    if (!currentClient.name) {
      alert('Please fill in Client Name');
      return;
    }

    try {
      let error;
      const payload = {
        name: currentClient.name,
        logo: currentClient.logo,
        website: currentClient.website,
      };

      if (isEditing) {
        const { error: updateError } = await supabase.from('clients').update(payload).eq('id', currentClient.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from('clients').insert([payload]);
        error = insertError;
      }
      
      if (error) {
        console.error('Supabase error:', error);
        alert(`Error saving client: ${error.message}`);
      } else {
        alert(isEditing ? 'Client updated successfully!' : 'Client added successfully!');
        setIsEditing(false);
        setCurrentClient({ name: '', logo: '', website: '' });
        fetchClients();
      }
    } catch (error: any) {
      console.error('Error saving client:', error);
      alert('An unexpected error occurred.');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      try {
        const { error } = await supabase.from('clients').delete().eq('id', id);
        if (!error) {
          fetchClients();
        }
      } catch (error) {
        console.error('Error deleting client:', error);
      }
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Manage Clients</h1>

      {/* Form Section */}
      <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 mb-12 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          {isEditing ? <Edit size={20} className="text-blue-500" /> : <Plus size={20} className="text-red-500" />}
          {isEditing ? 'Edit Client' : 'Add New Client'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Client Name</label>
              <input
                type="text"
                placeholder="e.g. Acme Corp"
                value={currentClient.name}
                onChange={(e) => setCurrentClient({ ...currentClient, name: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Website URL (Optional)</label>
              <input
                type="url"
                placeholder="https://example.com"
                value={currentClient.website}
                onChange={(e) => setCurrentClient({ ...currentClient, website: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Client Logo (Optional)</label>
              <div className="flex items-center gap-4">
                <div className="flex-1 relative">
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileUpload}
                    className="hidden"
                    id="client-logo-upload"
                    disabled={uploading}
                  />
                  <label
                    htmlFor="client-logo-upload"
                    className={`flex items-center justify-center gap-2 w-full bg-zinc-800 border-2 border-dashed border-zinc-700 rounded-xl px-4 py-3 text-gray-400 cursor-pointer hover:border-red-500/50 hover:text-white transition-all ${uploading ? 'opacity-50 cursor-not-allowed' : ''}`}
                  >
                    {uploading ? 'Uploading...' : <><Upload size={18} /> Attach Logo</>}
                  </label>
                </div>
                {currentClient.logo && (
                  <div className="w-16 h-16 rounded-lg overflow-hidden border border-zinc-700 bg-zinc-800 flex items-center justify-center p-2">
                    <img src={currentClient.logo} alt="Preview" className="max-w-full max-h-full object-contain" />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button 
            onClick={handleSave} 
            className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
          >
            <Check size={20} /> {isEditing ? 'Update Client' : 'Create Client'}
          </button>
          {isEditing && (
            <button 
              onClick={() => { setIsEditing(false); setCurrentClient({ name: '', logo: '', website: '' }); }} 
              className="bg-zinc-800 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-700 transition-all"
            >
              <X size={20} /> Cancel
            </button>
          )}
        </div>
      </div>

      {/* List Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white mb-4">Our Clients</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {clients.length === 0 ? (
            <div className="col-span-full text-center py-12 bg-zinc-900 rounded-2xl border border-zinc-800 text-gray-500">
              No clients found. Add your first client above.
            </div>
          ) : (
            clients.map((client) => (
              <div key={client.id} className="bg-zinc-900 p-4 rounded-2xl border border-zinc-800 flex items-center justify-between group hover:border-zinc-700 transition-all">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 rounded-lg bg-white/5 flex items-center justify-center overflow-hidden p-2">
                    {client.logo ? (
                      <img src={client.logo} alt="" className="max-w-full max-h-full object-contain" />
                    ) : (
                      <Globe className="text-zinc-600" size={20} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-bold text-sm truncate max-w-[120px]">{client.name}</h3>
                    {client.website && (
                      <a href={client.website} target="_blank" rel="noopener noreferrer" className="text-red-500 text-[10px] hover:underline flex items-center gap-1">
                        Visit Site <Globe size={8} />
                      </a>
                    )}
                  </div>
                </div>
                
                <div className="flex gap-1">
                  <button 
                    onClick={() => { setIsEditing(true); setCurrentClient(client); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                    title="Edit"
                  >
                    <Edit size={16} />
                  </button>
                  <button 
                    onClick={() => handleDelete(client.id)} 
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Delete"
                  >
                    <Trash size={16} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

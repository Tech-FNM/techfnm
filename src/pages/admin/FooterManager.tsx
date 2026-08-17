import { useEffect, useState } from 'react';
import { Save, PanelBottom, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface FooterSettings {
  description: string;
  facebookUrl: string;
  youtubeUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  whatsappUrl: string;
  address: string;
  phone: string;
  email: string;
}

export default function FooterManager() {
  const [loading, setLoading] = useState(false);
  const [fetching, setFetching] = useState(true);
  const [settings, setSettings] = useState<FooterSettings>({
    description: 'We specialize in custom web development, mobile apps, and SEO solutions. We develop digital future.',
    facebookUrl: 'https://www.facebook.com/techfnm',
    youtubeUrl: 'https://www.youtube.com/@techhfnm',
    instagramUrl: 'https://www.instagram.com/techfnm',
    linkedinUrl: 'https://www.linkedin.com/company/techfnm',
    whatsappUrl: 'https://wa.me/+923139023118',
    address: 'Pakistan',
    phone: '0313-9023118',
    email: 'techhfnm@gmail.com',
  });

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('content')
        .eq('id', 'footer_settings')
        .maybeSingle();

      if (data && data.content) {
        setSettings({ ...settings, ...data.content });
      }
    } catch (err) {
      console.error('Error fetching footer settings:', err);
    } finally {
      setFetching(false);
    }
  };

  const saveSettings = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          id: 'footer_settings',
          content: settings,
        });

      if (error) throw error;
      alert('Footer settings saved successfully!');
    } catch (err: any) {
      alert('Error saving footer settings: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setSettings(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  if (fetching) {
    return <div className="flex justify-center py-20"><Loader2 className="animate-spin text-red-500" size={32} /></div>;
  }

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-600/10 rounded-xl border border-red-500/20 text-red-500">
            <PanelBottom size={24} />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Footer Manager
            </h1>
            <p className="text-gray-400 mt-2 text-sm leading-relaxed">
              Manage the content and links displayed in the website footer.
            </p>
          </div>
        </div>
      </div>

      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8 space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-300 mb-2">Short Description</label>
          <textarea
            name="description"
            value={settings.description}
            onChange={handleChange}
            className="w-full bg-black border border-zinc-800 rounded-xl p-4 text-white focus:ring-2 focus:ring-red-500 focus:border-transparent outline-none h-24 resize-none"
            placeholder="Footer description"
          />
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Address</label>
            <input type="text" name="address" value={settings.address} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Phone</label>
            <input type="text" name="phone" value={settings.phone} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Email</label>
            <input type="text" name="email" value={settings.email} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white" />
          </div>
        </div>

        <h3 className="text-xl font-bold text-white border-b border-zinc-800 pb-2 pt-4">Social Links</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Facebook URL</label>
            <input type="text" name="facebookUrl" value={settings.facebookUrl} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">YouTube URL</label>
            <input type="text" name="youtubeUrl" value={settings.youtubeUrl} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">Instagram URL</label>
            <input type="text" name="instagramUrl" value={settings.instagramUrl} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">LinkedIn URL</label>
            <input type="text" name="linkedinUrl" value={settings.linkedinUrl} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white" />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-300 mb-2">WhatsApp URL</label>
            <input type="text" name="whatsappUrl" value={settings.whatsappUrl} onChange={handleChange} className="w-full bg-black border border-zinc-800 rounded-xl p-3 text-white" />
          </div>
        </div>

        <div className="pt-6">
          <button
            onClick={saveSettings}
            disabled={loading}
            className="flex items-center gap-2 bg-red-600 text-white px-6 py-3 rounded-xl hover:bg-red-700 transition-colors disabled:opacity-50 font-medium"
          >
            {loading ? <Loader2 size={20} className="animate-spin" /> : <Save size={20} />}
            Save Settings
          </button>
        </div>
      </div>
    </div>
  );
}

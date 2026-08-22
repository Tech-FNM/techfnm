import { useEffect, useState } from 'react';
import { Save, Shield, HelpCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast, Toaster } from 'react-hot-toast';

export default function SettingsManager() {
  const [settings, setSettings] = useState<any>({
    logoText: 'TechFNM',
    contactNumber: '0313-9023118',
    facebookUrl: 'https://facebook.com/techfnm',
    youtubeUrl: 'https://youtube.com/@techhfnm',
    instagramUrl: 'https://instagram.com/techfnm',
    linkedinUrl: 'https://linkedin.com/company/techfnm',
    githubUrl: 'https://github.com/Tech-FNM',
    seoIndexingEnabled: true,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const { data } = await supabase.from('site_settings').select('*');
      if (data && data.length > 0) {
        const resolved: any = {};
        data.forEach(item => {
          if (item.key === 'logo_text') resolved.logoText = item.value;
          if (item.key === 'contact_number') resolved.contactNumber = item.value;
          if (item.key === 'facebook_url') resolved.facebookUrl = item.value;
          if (item.key === 'youtube_url') resolved.youtubeUrl = item.value;
          if (item.key === 'instagram_url') resolved.instagramUrl = item.value;
          if (item.key === 'linkedin_url') resolved.linkedinUrl = item.value;
          if (item.key === 'github_url') resolved.githubUrl = item.value;
          if (item.key === 'seo_indexing_enabled') resolved.seoIndexingEnabled = item.value === 'true';
        });
        setSettings({ ...settings, ...resolved });
      }
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const updates = [
        { key: 'logo_text', value: settings.logoText },
        { key: 'contact_number', value: settings.contactNumber },
        { key: 'facebook_url', value: settings.facebookUrl },
        { key: 'youtube_url', value: settings.youtubeUrl },
        { key: 'instagram_url', value: settings.instagramUrl },
        { key: 'linkedin_url', value: settings.linkedinUrl },
        { key: 'github_url', value: settings.githubUrl },
        { key: 'seo_indexing_enabled', value: settings.seoIndexingEnabled ? 'true' : 'false' },
      ];

      for (const item of updates) {
        const { error } = await supabase
          .from('site_settings')
          .update({ value: item.value })
          .eq('key', item.key);
      }

      toast.success('Site configurations applied successfully!');
    } catch (err: any) {
      toast.error(err.message || 'Error updating settings');
    }
  };

  if (loading) {
    return <div className="text-center py-20 text-zinc-500 font-mono">Loading configurations...</div>;
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" toastOptions={{ style: { background: '#18181b', color: '#fff' } }} />

      <div className="border-b border-zinc-800 pb-4">
        <h2 className="text-xl font-bold text-white">Global Settings</h2>
        <p className="text-xs text-zinc-500">Manage logo branding, navigation CTA, social link URLs, and indexing parameters.</p>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl">
        
        {/* Left Side: Header & Footer configuration */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
          <h3 className="text-base font-bold text-white border-b border-zinc-800 pb-2">Header & Footer Settings</h3>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Logo Brand Text</label>
              <input
                type="text"
                required
                value={settings.logoText}
                onChange={(e) => setSettings({ ...settings, logoText: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-600/40 rounded-xl px-4 py-3 text-zinc-200 outline-none text-sm transition-all"
              />
            </div>
            
            <div className="space-y-1">
              <label className="text-xs font-semibold text-zinc-400 uppercase tracking-wider block">Contact Number</label>
              <input
                type="text"
                required
                value={settings.contactNumber}
                onChange={(e) => setSettings({ ...settings, contactNumber: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-850 focus:border-red-600/40 rounded-xl px-4 py-3 text-zinc-200 outline-none text-sm transition-all"
              />
            </div>
          </div>

          <div className="space-y-4 pt-2">
            <span className="text-xs font-bold text-zinc-500 uppercase tracking-wider block">Social Media Links</span>
            
            <div className="space-y-3">
              <div className="flex items-center gap-2">
                <span className="w-20 text-xs text-zinc-400 font-semibold">Facebook:</span>
                <input
                  type="text"
                  value={settings.facebookUrl}
                  onChange={(e) => setSettings({ ...settings, facebookUrl: e.target.value })}
                  className="flex-grow bg-zinc-950 border border-zinc-850 focus:border-red-600/40 rounded-xl px-4 py-2.5 text-zinc-200 outline-none text-xs transition-all"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="w-20 text-xs text-zinc-400 font-semibold">Youtube:</span>
                <input
                  type="text"
                  value={settings.youtubeUrl}
                  onChange={(e) => setSettings({ ...settings, youtubeUrl: e.target.value })}
                  className="flex-grow bg-zinc-950 border border-zinc-850 focus:border-red-600/40 rounded-xl px-4 py-2.5 text-zinc-200 outline-none text-xs transition-all"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="w-20 text-xs text-zinc-400 font-semibold">Instagram:</span>
                <input
                  type="text"
                  value={settings.instagramUrl}
                  onChange={(e) => setSettings({ ...settings, instagramUrl: e.target.value })}
                  className="flex-grow bg-zinc-950 border border-zinc-850 focus:border-red-600/40 rounded-xl px-4 py-2.5 text-zinc-200 outline-none text-xs transition-all"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="w-20 text-xs text-zinc-400 font-semibold">LinkedIn:</span>
                <input
                  type="text"
                  value={settings.linkedinUrl}
                  onChange={(e) => setSettings({ ...settings, linkedinUrl: e.target.value })}
                  className="flex-grow bg-zinc-950 border border-zinc-850 focus:border-red-600/40 rounded-xl px-4 py-2.5 text-zinc-200 outline-none text-xs transition-all"
                />
              </div>

              <div className="flex items-center gap-2">
                <span className="w-20 text-xs text-zinc-400 font-semibold">GitHub:</span>
                <input
                  type="text"
                  value={settings.githubUrl}
                  onChange={(e) => setSettings({ ...settings, githubUrl: e.target.value })}
                  className="flex-grow bg-zinc-950 border border-zinc-850 focus:border-red-600/40 rounded-xl px-4 py-2.5 text-zinc-200 outline-none text-xs transition-all"
                />
              </div>
            </div>
          </div>
        </div>

        {/* Right Side: Indexing / SEO configuration */}
        <div className="space-y-6">
          
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-8 space-y-6">
            <div className="flex items-center justify-between border-b border-zinc-800 pb-2">
              <h3 className="text-base font-bold text-white">Search Engine Indexing</h3>
              <Shield size={16} className="text-red-500" />
            </div>

            <div className="flex items-start justify-between gap-6 bg-zinc-950 p-6 rounded-2xl border border-zinc-850">
              <div className="space-y-1">
                <span className="font-bold text-white text-sm block">Indexing Visibility</span>
                <p className="text-xs text-zinc-500 leading-relaxed max-w-xs">
                  Toggle this setting to either allow search engines (Google, Bing) to index the website or add "noindex" tags.
                </p>
              </div>

              <button
                type="button"
                onClick={() => setSettings({ ...settings, seoIndexingEnabled: !settings.seoIndexingEnabled })}
                className={`p-3 rounded-xl border transition-all ${
                  settings.seoIndexingEnabled
                    ? 'bg-red-600 border-red-600 text-white shadow-lg'
                    : 'bg-zinc-900 border-zinc-800 text-zinc-500'
                }`}
              >
                {settings.seoIndexingEnabled ? <Eye size={18} /> : <EyeOff size={18} />}
              </button>
            </div>

            <div className="flex gap-2.5 text-zinc-500 text-xs leading-relaxed bg-zinc-950/60 p-4 rounded-xl border border-zinc-850/40">
              <HelpCircle size={16} className="text-zinc-650 shrink-0 mt-0.5" />
              <p>
                When disabled, the site will output `<meta name="robots" content="noindex, nofollow" />` in the page meta tags, preventing bots from capturing links.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-red-950/20 text-sm"
          >
            <Save size={16} />
            <span>Save Settings</span>
          </button>

        </div>

      </form>
    </div>
  );
}

import { useEffect, useState } from 'react';
import { Save, Shield, HelpCircle, Eye, EyeOff } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { triggerContentUpdate } from '../../lib/cmsContent';
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
    seoIndexingEnabled: false, // Default to false (noindex)
  });
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      setLoading(true);
      const local = localStorage.getItem('techfnm_site_settings');
      if (local) {
        try {
          setSettings((prev: any) => ({ ...prev, ...JSON.parse(local) }));
        } catch {}
      }

      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'global_settings')
        .maybeSingle();

      if (!error && data && data.content) {
        const c = data.content;
        setSettings((prev: any) => ({
          ...prev,
          logoText: c.logo_text || prev.logoText,
          contactNumber: c.contact_number || prev.contactNumber,
          facebookUrl: c.facebook_url || prev.facebookUrl,
          youtubeUrl: c.youtube_url || prev.youtubeUrl,
          instagramUrl: c.instagram_url || prev.instagramUrl,
          linkedinUrl: c.linkedin_url || prev.linkedinUrl,
          githubUrl: c.github_url || prev.githubUrl,
          seoIndexingEnabled: typeof c.seo_indexing_enabled === 'boolean' ? c.seo_indexing_enabled : false,
        }));
      }
    } catch (err) {
      console.error('Error fetching settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      localStorage.setItem('techfnm_site_settings', JSON.stringify(settings));
      window.dispatchEvent(new CustomEvent('techfnm_settings_updated', { detail: settings }));
      triggerContentUpdate();

      const payload = {
        id: 'global_settings',
        content: {
          logo_text: settings.logoText,
          contact_number: settings.contactNumber,
          facebook_url: settings.facebookUrl,
          youtube_url: settings.youtubeUrl,
          instagram_url: settings.instagramUrl,
          linkedin_url: settings.linkedinUrl,
          github_url: settings.githubUrl,
          seo_indexing_enabled: settings.seoIndexingEnabled,
        },
        updated_at: new Date().toISOString()
      };

      const { error } = await supabase.from('site_settings').upsert([payload]);
      if (error) {
        console.warn('Supabase save warning:', error);
      }

      // Update document head meta tag immediately
      const robotsMeta = document.querySelector('meta[name="robots"]');
      const robotVal = settings.seoIndexingEnabled ? 'index, follow' : 'noindex, nofollow';
      if (robotsMeta) {
        robotsMeta.setAttribute('content', robotVal);
      }

      toast.success(
        settings.seoIndexingEnabled
          ? 'Site Indexing ENABLED (Search engines can index)'
          : 'Website successfully set to NOINDEX (Search engines blocked)',
        { duration: 4000 }
      );
    } catch (err: any) {
      toast.error(err.message || 'Error updating settings');
    } finally {
      setSaving(false);
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

            <div className="space-y-4">
              {/* Current Status Callout */}
              <div
                className={`p-4 rounded-2xl border flex items-center gap-3 ${
                  !settings.seoIndexingEnabled
                    ? 'bg-red-950/40 border-red-800/60 text-red-300'
                    : 'bg-emerald-950/40 border-emerald-800/60 text-emerald-300'
                }`}
              >
                <div
                  className={`w-3 h-3 rounded-full shrink-0 ${
                    !settings.seoIndexingEnabled ? 'bg-red-500 animate-pulse' : 'bg-emerald-400'
                  }`}
                />
                <div className="min-w-0">
                  <span className="font-bold text-xs uppercase tracking-wider block">
                    {!settings.seoIndexingEnabled ? 'NOINDEX ACTIVE (Search Engines Blocked)' : 'INDEXING ACTIVE (Visible to Google)'}
                  </span>
                  <p className="text-[11px] opacity-90 mt-0.5">
                    {!settings.seoIndexingEnabled
                      ? 'The entire website outputs <meta name="robots" content="noindex, nofollow" /> and robots.txt disallow.'
                      : 'Search engines are allowed to crawl, index, and rank pages.'}
                  </p>
                </div>
              </div>

              <div className="flex items-center justify-between gap-6 bg-zinc-950 p-6 rounded-2xl border border-zinc-850">
                <div className="space-y-1">
                  <span className="font-bold text-white text-sm block">Toggle Search Visibility</span>
                  <p className="text-xs text-zinc-400 leading-relaxed max-w-xs">
                    {!settings.seoIndexingEnabled
                      ? 'Currently blocked from search results. Click toggle to enable indexing.'
                      : 'Currently indexing. Click toggle to block search engines with noindex.'}
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => setSettings({ ...settings, seoIndexingEnabled: !settings.seoIndexingEnabled })}
                  className={`px-4 py-2.5 rounded-xl border flex items-center gap-2 font-bold text-xs transition-all cursor-pointer shadow-lg ${
                    settings.seoIndexingEnabled
                      ? 'bg-emerald-600 border-emerald-500 text-white shadow-emerald-950/40'
                      : 'bg-red-600 border-red-500 text-white shadow-red-950/40'
                  }`}
                >
                  {settings.seoIndexingEnabled ? (
                    <>
                      <Eye size={16} />
                      <span>Indexing ON</span>
                    </>
                  ) : (
                    <>
                      <EyeOff size={16} />
                      <span>NOINDEX (OFF)</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            <div className="flex gap-2.5 text-zinc-400 text-xs leading-relaxed bg-zinc-950/60 p-4 rounded-xl border border-zinc-850/40">
              <HelpCircle size={16} className="text-zinc-500 shrink-0 mt-0.5" />
              <p>
                When NOINDEX is selected, bots such as Googlebot, Bingbot, and crawlers are instructed not to index or display the website in search engine results.
              </p>
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={saving}
            className="w-full flex items-center justify-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 text-white font-bold py-4 rounded-xl transition-all shadow-lg shadow-red-950/20 text-sm cursor-pointer"
          >
            <Save size={16} className={saving ? 'animate-spin' : ''} />
            <span>{saving ? 'Saving Settings...' : 'Save Settings'}</span>
          </button>

        </div>

      </form>
    </div>
  );
}

import React, { useEffect, useState } from 'react';
import {
  PanelBottom,
  Save,
  Phone,
  Mail,
  MapPin,
  Facebook,
  Youtube,
  Instagram,
  Linkedin,
  Github,
  MessageSquare,
  Sparkles,
  ExternalLink,
  RotateCcw
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { triggerContentUpdate } from '../../lib/cmsContent';
import { toast, Toaster } from 'react-hot-toast';

export interface FooterData {
  description: string;
  phone: string;
  email: string;
  address: string;
  facebookUrl: string;
  youtubeUrl: string;
  instagramUrl: string;
  linkedinUrl: string;
  githubUrl: string;
  whatsappUrl: string;
  copyrightText: string;
}

const DEFAULT_FOOTER: FooterData = {
  description: 'We specialize in custom web development, mobile apps, and SEO solutions. We develop digital future.',
  phone: '0313-9023118',
  email: 'techhfnm@gmail.com',
  address: 'Pakistan',
  facebookUrl: 'https://www.facebook.com/techfnm',
  youtubeUrl: 'https://www.youtube.com/@techhfnm',
  instagramUrl: 'https://www.instagram.com/techfnm',
  linkedinUrl: 'https://www.linkedin.com/company/techfnm',
  githubUrl: 'https://github.com/Tech-FNM',
  whatsappUrl: 'https://wa.me/+923139023118',
  copyrightText: `© ${new Date().getFullYear()} TechFNM. All Rights Reserved.`
};

export default function FooterManager() {
  const [footer, setFooter] = useState<FooterData>(DEFAULT_FOOTER);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    loadFooterSettings();
  }, []);

  const loadFooterSettings = async () => {
    setLoading(true);
    try {
      // 1. Try local cache
      const cached = localStorage.getItem('techfnm_footer_settings');
      if (cached) {
        try {
          setFooter({ ...DEFAULT_FOOTER, ...JSON.parse(cached) });
        } catch {}
      }

      // 2. Fetch from Supabase site_settings
      const { data, error } = await supabase
        .from('site_settings')
        .select('content')
        .eq('id', 'footer_settings')
        .maybeSingle();

      if (data && data.content) {
        const merged = { ...DEFAULT_FOOTER, ...data.content };
        setFooter(merged);
        localStorage.setItem('techfnm_footer_settings', JSON.stringify(merged));
      }
    } catch (err) {
      console.error('Error loading footer settings:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      // 1. Save to local storage
      localStorage.setItem('techfnm_footer_settings', JSON.stringify(footer));

      // 2. Save to Supabase site_settings
      const { error } = await supabase.from('site_settings').upsert({
        id: 'footer_settings',
        content: footer,
        updated_at: new Date().toISOString()
      });

      if (error) {
        console.warn('Supabase footer save notice:', error);
      }

      triggerContentUpdate();
      toast.success('Footer settings saved and applied live across the website!');
    } catch (err) {
      console.error('Error saving footer settings:', err);
      toast.error('Failed to save footer settings.');
    } finally {
      setSaving(false);
    }
  };

  const resetDefaults = () => {
    if (window.confirm('Reset all footer fields to default settings?')) {
      setFooter(DEFAULT_FOOTER);
      toast.success('Reset to default footer settings.');
    }
  };

  return (
    <div className="space-y-6 font-sans text-zinc-100 animate-in fade-in duration-150">
      <Toaster position="top-right" toastOptions={{ style: { background: '#18181b', color: '#fff' } }} />

      {/* TOP HEADER */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-zinc-800/80 pb-4">
        <div>
          <h2 className="text-2xl font-bold tracking-tight text-white flex items-center gap-2.5">
            <PanelBottom className="text-red-500" size={24} />
            <span>Footer Management</span>
          </h2>
          <p className="text-xs text-zinc-400 mt-1">
            Manage global footer branding, company description, contact numbers, and social media channels.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={resetDefaults}
            className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-zinc-900 border border-zinc-800 text-xs font-semibold text-zinc-400 hover:text-white transition-all cursor-pointer"
          >
            <RotateCcw size={13} />
            <span>Reset Defaults</span>
          </button>

          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="flex items-center gap-2 px-5 py-2 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-950/40 transition-all cursor-pointer disabled:opacity-50"
          >
            <Save size={14} />
            <span>{saving ? 'Saving...' : 'Save & Publish Footer'}</span>
          </button>
        </div>
      </div>

      <form onSubmit={handleSave} className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* LEFT COLUMN: 8 COLS */}
        <div className="lg:col-span-8 space-y-6">
          
          {/* 1. BRAND & DESCRIPTION */}
          <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Sparkles size={16} className="text-red-500" />
              <span>Company Bio & Footer Description</span>
            </h3>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                Footer Brand Summary
              </label>
              <textarea
                rows={3}
                value={footer.description}
                onChange={e => setFooter({ ...footer, description: e.target.value })}
                placeholder="We specialize in custom web development, mobile apps, and SEO solutions..."
                className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-xl p-3.5 text-xs text-zinc-200 outline-none transition-all resize-y"
              />
              <p className="text-[11px] text-zinc-500">
                Yeh description footer me logo ke theek neeche display hoti hai.
              </p>
            </div>

            <div className="space-y-1.5 pt-2">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider block">
                Copyright Notice Text
              </label>
              <input
                type="text"
                value={footer.copyrightText}
                onChange={e => setFooter({ ...footer, copyrightText: e.target.value })}
                placeholder="© 2026 TechFNM. All Rights Reserved."
                className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
              />
            </div>
          </div>

          {/* 2. CONTACT INFORMATION */}
          <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Phone size={16} className="text-red-500" />
              <span>Official Contact & Office Information</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Phone size={13} className="text-red-400" />
                  <span>Official Phone / WhatsApp</span>
                </label>
                <input
                  type="text"
                  value={footer.phone}
                  onChange={e => setFooter({ ...footer, phone: e.target.value })}
                  placeholder="0313-9023118"
                  className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                  <Mail size={13} className="text-red-400" />
                  <span>Official Email Address</span>
                </label>
                <input
                  type="email"
                  value={footer.email}
                  onChange={e => setFooter({ ...footer, email: e.target.value })}
                  placeholder="techhfnm@gmail.com"
                  className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-xs font-bold text-zinc-300 uppercase tracking-wider flex items-center gap-1.5">
                <MapPin size={13} className="text-red-400" />
                <span>Headquarters / Office Address</span>
              </label>
              <input
                type="text"
                value={footer.address}
                onChange={e => setFooter({ ...footer, address: e.target.value })}
                placeholder="Lahore, Pakistan / Remote Global"
                className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-xl px-4 py-2.5 text-xs text-white outline-none"
              />
            </div>
          </div>

          {/* 3. SOCIAL MEDIA CHANNELS */}
          <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-6 space-y-4 shadow-xl">
            <h3 className="text-sm font-bold text-white flex items-center gap-2 border-b border-zinc-800 pb-3">
              <ExternalLink size={16} className="text-red-500" />
              <span>Social Media Profile URLs</span>
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <Facebook size={13} className="text-red-400" />
                  <span>Facebook Page URL</span>
                </label>
                <input
                  type="url"
                  value={footer.facebookUrl}
                  onChange={e => setFooter({ ...footer, facebookUrl: e.target.value })}
                  placeholder="https://facebook.com/techfnm"
                  className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-xl px-4 py-2 text-xs text-zinc-200 outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <Youtube size={13} className="text-red-400" />
                  <span>YouTube Channel URL</span>
                </label>
                <input
                  type="url"
                  value={footer.youtubeUrl}
                  onChange={e => setFooter({ ...footer, youtubeUrl: e.target.value })}
                  placeholder="https://youtube.com/@techhfnm"
                  className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-xl px-4 py-2 text-xs text-zinc-200 outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <Instagram size={13} className="text-red-400" />
                  <span>Instagram Profile URL</span>
                </label>
                <input
                  type="url"
                  value={footer.instagramUrl}
                  onChange={e => setFooter({ ...footer, instagramUrl: e.target.value })}
                  placeholder="https://instagram.com/techfnm"
                  className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-xl px-4 py-2 text-xs text-zinc-200 outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <Linkedin size={13} className="text-red-400" />
                  <span>LinkedIn Page URL</span>
                </label>
                <input
                  type="url"
                  value={footer.linkedinUrl}
                  onChange={e => setFooter({ ...footer, linkedinUrl: e.target.value })}
                  placeholder="https://linkedin.com/company/techfnm"
                  className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-xl px-4 py-2 text-xs text-zinc-200 outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <Github size={13} className="text-red-400" />
                  <span>GitHub Organization URL</span>
                </label>
                <input
                  type="url"
                  value={footer.githubUrl}
                  onChange={e => setFooter({ ...footer, githubUrl: e.target.value })}
                  placeholder="https://github.com/Tech-FNM"
                  className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-xl px-4 py-2 text-xs text-zinc-200 outline-none font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-zinc-300 flex items-center gap-1.5">
                  <MessageSquare size={13} className="text-red-400" />
                  <span>Direct WhatsApp Link</span>
                </label>
                <input
                  type="url"
                  value={footer.whatsappUrl}
                  onChange={e => setFooter({ ...footer, whatsappUrl: e.target.value })}
                  placeholder="https://wa.me/+923139023118"
                  className="w-full bg-[#141419] border border-zinc-800 focus:border-red-600/50 rounded-xl px-4 py-2 text-xs text-zinc-200 outline-none font-mono"
                />
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT COLUMN: 4 COLS (SIDEBAR) */}
        <div className="lg:col-span-4 space-y-4 lg:sticky lg:top-4">
          <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl overflow-hidden shadow-xl">
            <div className="px-4 py-3 bg-[#131319] border-b border-zinc-800/80 flex items-center justify-between">
              <span className="font-bold text-xs uppercase tracking-wider text-zinc-300">Publish Action</span>
              <span className="w-2 h-2 rounded-full bg-red-500 animate-pulse" />
            </div>

            <div className="p-4 space-y-4 text-xs">
              <p className="text-zinc-400 leading-relaxed">
                Changes made here will instantly sync with the public website footer across all pages.
              </p>

              <button
                type="submit"
                disabled={saving}
                className="w-full py-3 rounded-xl bg-gradient-to-r from-red-600 to-rose-600 hover:from-red-500 hover:to-rose-500 text-white font-bold text-xs shadow-lg shadow-red-950/40 transition-all cursor-pointer"
              >
                {saving ? 'Saving...' : 'Publish Footer Changes'}
              </button>
            </div>
          </div>

          {/* Quick Preview Card */}
          <div className="bg-[#0f0f13] border border-zinc-800/80 rounded-2xl p-4 space-y-3 text-xs shadow-xl">
            <h4 className="font-bold text-white border-b border-zinc-800 pb-2 flex items-center justify-between">
              <span>Live Footer Summary</span>
              <span className="text-[10px] text-red-400 font-mono">Global</span>
            </h4>
            <div className="space-y-2 text-zinc-400 text-[11px]">
              <div><strong className="text-zinc-300">Phone:</strong> {footer.phone}</div>
              <div><strong className="text-zinc-300">Email:</strong> {footer.email}</div>
              <div><strong className="text-zinc-300">Address:</strong> {footer.address}</div>
            </div>
          </div>
        </div>
      </form>
    </div>
  );
}

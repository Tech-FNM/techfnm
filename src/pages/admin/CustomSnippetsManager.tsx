import { useEffect, useState } from 'react';
import {
  Code2,
  Save,
  CheckCircle2,
  AlertTriangle,
  Info,
  RotateCcw,
  Sparkles,
  ExternalLink,
  Copy,
  Check
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast, Toaster } from 'react-hot-toast';

interface CustomScripts {
  head: string;
  bodyTop: string;
  bodyBottom: string;
  footer: string;
}

const PRESET_TEMPLATES = [
  {
    name: 'Google Analytics 4 (GA4)',
    category: 'Analytics',
    target: 'head' as const,
    snippet: `<!-- Google tag (gtag.js) -->
<script async src="https://www.googletagmanager.com/gtag/js?id=G-XXXXXXXXXX"></script>
<script>
  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());
  gtag('config', 'G-XXXXXXXXXX');
</script>`
  },
  {
    name: 'Google Tag Manager (Head)',
    category: 'Analytics',
    target: 'head' as const,
    snippet: `<!-- Google Tag Manager -->
<script>(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
})(window,document,'script','dataLayer','GTM-XXXXXXX');</script>
<!-- End Google Tag Manager -->`
  },
  {
    name: 'Google Tag Manager (Body NoScript)',
    category: 'Analytics',
    target: 'bodyTop' as const,
    snippet: `<!-- Google Tag Manager (noscript) -->
<noscript><iframe src="https://www.googletagmanager.com/ns.html?id=GTM-XXXXXXX"
height="0" width="0" style="display:none;visibility:hidden"></iframe></noscript>
<!-- End Google Tag Manager (noscript) -->`
  },
  {
    name: 'Meta (Facebook) Pixel',
    category: 'Marketing',
    target: 'head' as const,
    snippet: `<!-- Meta Pixel Code -->
<script>
!function(f,b,e,v,n,t,s)
{if(f.fbq)return;n=f.fbq=function(){n.callMethod?
n.callMethod.apply(n,arguments):n.queue.push(arguments)};
if(!f._fbq)f.fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
n.queue=[];t=b.createElement(e);t.async=!0;
t.src=v;s=b.getElementsByTagName(e)[0];
s.parentNode.insertBefore(t,s)}(window, document,'script',
'https://connect.facebook.net/en_US/fbevents.js');
fbq('init', 'YOUR_PIXEL_ID');
fbq('track', 'PageView');
</script>`
  },
  {
    name: 'Google Search Console Verification',
    category: 'Verification',
    target: 'head' as const,
    snippet: `<meta name="google-site-verification" content="YOUR_VERIFICATION_CODE_HERE" />`
  },
  {
    name: 'Bing Webmaster Verification',
    category: 'Verification',
    target: 'head' as const,
    snippet: `<meta name="msvalidate.01" content="YOUR_BING_VERIFICATION_CODE" />`
  },
  {
    name: 'Tawk.to Live Chat',
    category: 'Live Chat',
    target: 'bodyBottom' as const,
    snippet: `<!-- Start of Tawk.to Script -->
<script type="text/javascript">
var Tawk_API=Tawk_API||{}, Tawk_LoadStart=new Date();
(function(){
var s1=document.createElement("script"),s0=document.getElementsByTagName("script")[0];
s1.async=true;
s1.src='https://embed.tawk.to/YOUR_PROPERTY_ID/default';
s1.charset='UTF-8';
s1.setAttribute('crossorigin','*');
s0.parentNode.insertBefore(s1,s0);
})();
</script>
<!-- End of Tawk.to Script -->`
  },
  {
    name: 'Custom CSS Styling',
    category: 'Styling',
    target: 'head' as const,
    snippet: `<style>
  /* Custom Global Styles */
  :root {
    --accent-custom: #10b981;
  }
</style>`
  }
];

export default function CustomSnippetsManager() {
  const [scripts, setScripts] = useState<CustomScripts>({
    head: '',
    bodyTop: '',
    bodyBottom: '',
    footer: '',
  });
  const [activeTab, setActiveTab] = useState<'head' | 'bodyTop' | 'bodyBottom' | 'footer'>('head');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [lastUpdated, setLastUpdated] = useState<string | null>(null);
  const [copiedIndex, setCopiedIndex] = useState<number | null>(null);

  useEffect(() => {
    fetchScripts();
  }, []);

  const fetchScripts = async () => {
    try {
      setLoading(true);

      // Check localStorage first
      const local = localStorage.getItem('techfnm_custom_scripts');
      if (local) {
        try {
          const parsed = JSON.parse(local);
          setScripts({
            head: parsed.head || '',
            bodyTop: parsed.bodyTop || '',
            bodyBottom: parsed.bodyBottom || '',
            footer: parsed.footer || '',
          });
        } catch {}
      }

      // Fetch from Supabase site_settings table (matches ScriptInjector.tsx)
      const { data, error } = await supabase
        .from('site_settings')
        .select('*')
        .eq('id', 'custom_scripts')
        .maybeSingle();

      if (!error && data && data.content) {
        const c = data.content;
        setScripts({
          head: c.head || '',
          bodyTop: c.bodyTop || '',
          bodyBottom: c.bodyBottom || '',
          footer: c.footer || '',
        });
        if (data.updated_at) {
          setLastUpdated(new Date(data.updated_at).toLocaleString());
        }
      }
    } catch (err) {
      console.error('Error fetching custom snippets:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleSave = async (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setSaving(true);
    try {
      // 1. Save to localStorage
      localStorage.setItem('techfnm_custom_scripts', JSON.stringify(scripts));

      // 2. Save to Supabase site_settings
      const payload = {
        id: 'custom_scripts',
        key: 'custom_scripts',
        content: {
          head: scripts.head,
          bodyTop: scripts.bodyTop,
          bodyBottom: scripts.bodyBottom,
          footer: scripts.footer,
        },
        updated_at: new Date().toISOString(),
      };

      const { error } = await supabase.from('site_settings').upsert([payload]);
      if (error) {
        console.warn('Supabase upsert warning:', error);
      }

      // 3. Dispatch event so live page or local listeners can react
      window.dispatchEvent(new CustomEvent('techfnm_scripts_updated', { detail: scripts }));

      setLastUpdated(new Date().toLocaleString());
      toast.success('Custom code snippets saved successfully! Changes are live on all public pages.');
    } catch (err: any) {
      console.error('Error saving snippets:', err);
      toast.error(err.message || 'Error saving snippets');
    } finally {
      setSaving(false);
    }
  };

  const handleAppendTemplate = (target: 'head' | 'bodyTop' | 'bodyBottom' | 'footer', snippet: string, index: number) => {
    setScripts(prev => {
      const current = prev[target] || '';
      const updated = current.trim() ? `${current}\n\n${snippet}` : snippet;
      return { ...prev, [target]: updated };
    });
    setActiveTab(target);
    setCopiedIndex(index);
    setTimeout(() => setCopiedIndex(null), 1800);
    toast.success(`Inserted template into ${target.toUpperCase()}`);
  };

  const handleClearSection = (target: 'head' | 'bodyTop' | 'bodyBottom' | 'footer') => {
    if (window.confirm(`Are you sure you want to clear all snippets in ${target}?`)) {
      setScripts(prev => ({ ...prev, [target]: '' }));
      toast.success(`Cleared ${target} snippets`);
    }
  };

  const tabLabels: Record<'head' | 'bodyTop' | 'bodyBottom' | 'footer', { title: string; subtitle: string; hint: string }> = {
    head: {
      title: '<head> Section',
      subtitle: 'Inside <head>...</head>',
      hint: 'Best for Meta tags, Google Analytics, Google Tag Manager, Pixel, Fonts, and SEO verifications.'
    },
    bodyTop: {
      title: '<body> Top',
      subtitle: 'Right after <body> opening',
      hint: 'Best for GTM noscript iframe, top banners, or early body tracking beacons.'
    },
    bodyBottom: {
      title: '<body> Bottom',
      subtitle: 'Before </body> closing',
      hint: 'Best for Live Chat widgets (Tawk.to, Crisp, WhatsApp), heavy analytics, defer-loaded tracking.'
    },
    footer: {
      title: '<footer> Section',
      subtitle: 'Appended to site footer',
      hint: 'Best for footer badges, trust seals, DMCA badges, or footer-specific scripts.'
    }
  };

  const currentTabSnippetCount = (target: 'head' | 'bodyTop' | 'bodyBottom' | 'footer') => {
    const val = scripts[target] || '';
    if (!val.trim()) return 0;
    const matches = val.match(/<(script|link|meta|style|noscript)/gi);
    return matches ? matches.length : 1;
  };

  if (loading) {
    return <div className="text-center py-20 text-zinc-500 font-mono">Loading custom snippets...</div>;
  }

  return (
    <div className="space-y-6">
      <Toaster position="top-right" toastOptions={{ style: { background: '#18181b', color: '#fff' } }} />

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-zinc-800 pb-5">
        <div>
          <div className="flex items-center gap-2.5">
            <div className="p-2 bg-red-600/10 border border-red-500/20 rounded-xl text-red-500">
              <Code2 size={22} />
            </div>
            <h2 className="text-2xl font-bold text-white tracking-tight">Custom Code Snippets</h2>
          </div>
          <p className="text-xs text-zinc-400 mt-1">
            Inject custom HTML, JavaScript, CSS, Google Analytics, Tag Manager, Facebook Pixel & live chat without touching source code.
          </p>
        </div>

        <div className="flex items-center gap-3">
          {lastUpdated && (
            <span className="text-[11px] text-zinc-500 hidden md:inline">
              Updated: {lastUpdated}
            </span>
          )}
          <button
            type="button"
            onClick={() => handleSave()}
            disabled={saving}
            className="flex items-center gap-2 bg-red-600 hover:bg-red-700 disabled:bg-zinc-800 text-white font-bold px-5 py-2.5 rounded-xl transition-all shadow-lg shadow-red-950/20 text-xs cursor-pointer"
          >
            <Save size={15} className={saving ? 'animate-spin' : ''} />
            <span>{saving ? 'Saving...' : 'Save Snippets'}</span>
          </button>
        </div>
      </div>

      {/* Security Alert Banner */}
      <div className="bg-amber-950/20 border border-amber-900/40 rounded-2xl p-4 flex items-start gap-3 text-amber-300">
        <AlertTriangle size={18} className="shrink-0 mt-0.5 text-amber-400" />
        <div className="text-xs space-y-1">
          <p className="font-semibold text-amber-200">Live Production Injection</p>
          <p className="text-amber-300/80 leading-relaxed">
            Code entered here runs on all public pages (never inside the admin dashboard). Always ensure custom scripts use valid HTML syntax (e.g. enclose JS in <code className="bg-amber-950 px-1 py-0.5 rounded text-amber-200">&lt;script&gt;...&lt;/script&gt;</code> and CSS in <code className="bg-amber-950 px-1 py-0.5 rounded text-amber-200">&lt;style&gt;...&lt;/style&gt;</code>).
          </p>
        </div>
      </div>

      {/* Main Layout: Editor & Preset Library */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

        {/* Left 2 Cols: Tabbed Code Editor */}
        <div className="lg:col-span-2 space-y-4">
          
          {/* Tabs */}
          <div className="flex flex-wrap gap-2 bg-zinc-900/70 p-1.5 rounded-2xl border border-zinc-800">
            {(['head', 'bodyTop', 'bodyBottom', 'footer'] as const).map((tab) => {
              const count = currentTabSnippetCount(tab);
              const isActive = activeTab === tab;
              return (
                <button
                  key={tab}
                  type="button"
                  onClick={() => setActiveTab(tab)}
                  className={`flex-1 min-w-[130px] flex items-center justify-center gap-2 py-2.5 px-3 rounded-xl text-xs font-semibold transition-all cursor-pointer ${
                    isActive
                      ? 'bg-zinc-800 text-white shadow-md border border-zinc-700/60'
                      : 'text-zinc-400 hover:text-zinc-200 hover:bg-zinc-850'
                  }`}
                >
                  <span>{tabLabels[tab].title}</span>
                  {count > 0 && (
                    <span className={`text-[10px] px-1.5 py-0.2 rounded-full font-bold ${
                      isActive ? 'bg-red-500/20 text-red-400 border border-red-500/30' : 'bg-zinc-800 text-zinc-400'
                    }`}>
                      {count}
                    </span>
                  )}
                </button>
              );
            })}
          </div>

          {/* Active Tab Panel */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-zinc-800 pb-3">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="text-sm font-bold text-white">{tabLabels[activeTab].title}</h3>
                  <span className="text-[11px] text-zinc-400 font-mono">({tabLabels[activeTab].subtitle})</span>
                </div>
                <p className="text-xs text-zinc-400 mt-0.5">{tabLabels[activeTab].hint}</p>
              </div>

              {scripts[activeTab] && (
                <button
                  type="button"
                  onClick={() => handleClearSection(activeTab)}
                  className="flex items-center gap-1.5 text-xs text-zinc-400 hover:text-red-400 transition-colors self-start sm:self-auto cursor-pointer"
                >
                  <RotateCcw size={13} />
                  <span>Clear</span>
                </button>
              )}
            </div>

            {/* Codearea */}
            <div className="relative">
              <textarea
                value={scripts[activeTab]}
                onChange={(e) => setScripts({ ...scripts, [activeTab]: e.target.value })}
                rows={16}
                spellCheck={false}
                placeholder={`<!-- Enter custom HTML / script snippet for ${tabLabels[activeTab].title} here -->\n<script>\n  // Your code here\n</script>`}
                className="w-full bg-zinc-950 border border-zinc-800 focus:border-red-600/50 rounded-2xl p-4 font-mono text-xs text-emerald-400 placeholder:text-zinc-600 outline-none leading-relaxed resize-y selection:bg-red-500/30 selection:text-white"
              />
              <div className="absolute right-4 bottom-4 text-[10px] text-zinc-600 font-mono bg-zinc-900/80 px-2 py-1 rounded-md border border-zinc-800 pointer-events-none">
                {scripts[activeTab].length} chars • {scripts[activeTab].split('\n').length} lines
              </div>
            </div>

            {/* Live Status indicator */}
            <div className="flex items-center justify-between pt-2">
              <div className="flex items-center gap-2 text-xs text-zinc-400">
                <CheckCircle2 size={14} className={scripts[activeTab].trim() ? 'text-emerald-400' : 'text-zinc-600'} />
                <span>
                  {scripts[activeTab].trim()
                    ? `Snippet configured and active for ${tabLabels[activeTab].title}`
                    : `No snippets in ${tabLabels[activeTab].title}`}
                </span>
              </div>
              <button
                type="button"
                onClick={() => handleSave()}
                disabled={saving}
                className="bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2 rounded-xl text-xs transition-all shadow-md cursor-pointer"
              >
                {saving ? 'Saving...' : 'Save & Publish'}
              </button>
            </div>
          </div>

          {/* Quick Info */}
          <div className="bg-zinc-900/50 border border-zinc-800/80 rounded-2xl p-4 flex items-center gap-3 text-xs text-zinc-400">
            <Info size={16} className="text-red-400 shrink-0" />
            <p>
              Scripts are dynamically injected and cleaned up on SPA page transitions via <span className="font-mono text-zinc-300">ScriptInjector.tsx</span>. No rebuild or redeployment required.
            </p>
          </div>
        </div>

        {/* Right Col: Preset Templates & Quick Insert */}
        <div className="space-y-4">
          <div className="bg-zinc-900 border border-zinc-800 rounded-3xl p-6 space-y-4 shadow-xl">
            <div className="flex items-center gap-2 border-b border-zinc-800 pb-3">
              <Sparkles size={16} className="text-red-500" />
              <h3 className="text-sm font-bold text-white">Preset Snippet Templates</h3>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Click <strong className="text-white">+ Insert</strong> on any preset to append it into the appropriate section automatically.
            </p>

            <div className="space-y-3 pt-1 max-h-[620px] overflow-y-auto pr-1">
              {PRESET_TEMPLATES.map((tpl, idx) => (
                <div
                  key={tpl.name}
                  className="bg-zinc-950 border border-zinc-850 hover:border-zinc-700 rounded-2xl p-3.5 space-y-2.5 transition-all group"
                >
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-xs font-bold text-white group-hover:text-red-400 transition-colors">
                      {tpl.name}
                    </span>
                    <span className="text-[10px] font-mono uppercase bg-zinc-900 border border-zinc-800 px-2 py-0.5 rounded text-zinc-400">
                      {tpl.target}
                    </span>
                  </div>

                  <div className="flex items-center justify-between gap-2 pt-1">
                    <span className="text-[10px] text-zinc-400">{tpl.category}</span>
                    <button
                      type="button"
                      onClick={() => handleAppendTemplate(tpl.target, tpl.snippet, idx)}
                      className="flex items-center gap-1 bg-red-600/10 hover:bg-red-600 border border-red-500/30 hover:border-red-600 text-red-400 hover:text-white px-2.5 py-1 rounded-lg text-[11px] font-semibold transition-all cursor-pointer"
                    >
                      {copiedIndex === idx ? (
                        <>
                          <Check size={12} />
                          <span>Inserted!</span>
                        </>
                      ) : (
                        <>
                          <Copy size={12} />
                          <span>+ Insert</span>
                        </>
                      )}
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}


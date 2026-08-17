import { useEffect, useState } from 'react';
import { Save, Code, AlertTriangle, Check, BookOpen } from 'lucide-react';
import { supabase } from '../../lib/supabase';

interface CustomScripts {
  head: string;
  bodyTop: string;
  bodyBottom: string;
  footer: string;
}

export default function ScriptsManager() {
  const [loading, setLoading] = useState(false);
  const [scripts, setScripts] = useState<CustomScripts>({
    head: '',
    bodyTop: '',
    bodyBottom: '',
    footer: '',
  });

  useEffect(() => {
    fetchScripts();
  }, []);

  const fetchScripts = async () => {
    try {
      const { data, error } = await supabase
        .from('site_settings')
        .select('content')
        .eq('id', 'custom_scripts')
        .maybeSingle();

      if (data && data.content) {
        setScripts({
          head: data.content.head || '',
          bodyTop: data.content.bodyTop || '',
          bodyBottom: data.content.bodyBottom || '',
          footer: data.content.footer || '',
        });
      }
    } catch (err) {
      console.error('Error fetching custom scripts:', err);
    }
  };

  const saveScripts = async () => {
    setLoading(true);
    try {
      const { error } = await supabase
        .from('site_settings')
        .upsert({
          id: 'custom_scripts',
          content: scripts,
        });

      if (error) throw error;
      alert('Custom scripts saved successfully! Instantly updated.');
    } catch (err: any) {
      alert('Error saving custom scripts: ' + err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-8 max-w-5xl mx-auto pb-12">
      {/* Header Info */}
      <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8">
        <div className="flex items-start gap-4">
          <div className="p-3 bg-red-600/10 rounded-xl border border-red-500/20 text-red-500">
            <Code size={24} />
          </div>
          <div className="flex-1">
            <h1 className="text-2xl md:text-3xl font-black text-white tracking-tight">
              Script & Meta Injection Manager
            </h1>
            <p className="text-gray-400 mt-2 text-sm leading-relaxed">
              Yahan se aap code snippets, Google Analytics, Microsoft Clarity, Facebook Pixel, Custom Meta tags, ya custom styles inject kar sakte hain. Ye direct home page par evaluate honge.
            </p>
          </div>
        </div>
        
        {/* Warning Banner in Roman Urdu & English */}
        <div className="mt-6 flex gap-3 bg-yellow-500/10 border border-yellow-500/20 text-yellow-400 rounded-xl p-4 text-xs md:text-sm leading-relaxed">
          <AlertTriangle className="flex-shrink-0 mt-0.5" size={18} />
          <div>
            <p className="font-bold mb-1">Aura / Warning:</p>
            <p>
              Ghalat JavaScript likhne se website crash ya blank ho sakti hai. Hamesha code ko correct tags ke sath wrap karein (jaise <code className="bg-zinc-800 px-1 py-0.5 rounded text-white font-mono">&lt;script&gt;...&lt;/script&gt;</code> ya <code className="bg-zinc-800 px-1 py-0.5 rounded text-white font-mono">&lt;meta ... /&gt;</code>).
            </p>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6">
        {/* Head Scripts */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="bg-zinc-800 text-gray-300 font-mono text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-bold">Slot: Head</span>
              <h3 className="text-lg font-bold text-white">Header Scripts (Inside &lt;head&gt;)</h3>
            </div>
            <span className="text-[11px] text-gray-500 hover:text-gray-400 cursor-help flex items-center gap-1">
              <BookOpen size={12} /> Google Analytics, Meta Tags, Links
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Ye code <code className="font-mono text-red-400">&lt;head&gt;</code> element ke aakhir me inject hoga. Meta tags, external stylesheet connections, ya CSS styling and structural verification scripts ke liye perfect hai.
          </p>
          <textarea
            value={scripts.head}
            onChange={(e) => setScripts({ ...scripts, head: e.target.value })}
            placeholder="<!-- Paste Google Analytics tag, Pixel code or Meta tags here -->&#10;<meta name='custom-meta' content='example'/>&#10;<script>&#10;  console.log('Head Script Injected Successfully');&#10;</script>"
            className="w-full h-44 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-red-500/50"
          />
        </div>

        {/* Body Top Scripts */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="bg-zinc-800 text-gray-300 font-mono text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-bold">Slot: Body Top</span>
              <h3 className="text-lg font-bold text-white">Body Top Scripts (Immediate &lt;body&gt; Start)</h3>
            </div>
            <span className="text-[11px] text-gray-500 flex items-center gap-1">
              <BookOpen size={12} /> Tag Manager &lt;noscript&gt; falls
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Ye code public domain page ke body start hone ke foran baad load hoga (Google Tag Manager noscript tags ke liye useful hai).
          </p>
          <textarea
            value={scripts.bodyTop}
            onChange={(e) => setScripts({ ...scripts, bodyTop: e.target.value })}
            placeholder="<!-- Google Tag Manager (noscript) -->&#10;<noscript><iframe src='...' height='0' width='0'></iframe></noscript>"
            className="w-full h-36 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-red-500/50"
          />
        </div>

        {/* Body Bottom Scripts */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="bg-zinc-800 text-gray-300 font-mono text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-bold">Slot: Body Bottom</span>
              <h3 className="text-lg font-bold text-white">Body Bottom Scripts (Before &lt;/body&gt;)</h3>
            </div>
            <span className="text-[11px] text-gray-500 flex items-center gap-1">
              <BookOpen size={12} /> Chat Widgets, Popups, Custom JS
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Page loading process speed slow hone se bachane ke liye non-critical external JavaScript files aur third-party pixels ko body ke bottom me place kiya jata hai.
          </p>
          <textarea
            value={scripts.bodyBottom}
            onChange={(e) => setScripts({ ...scripts, bodyBottom: e.target.value })}
            placeholder="<script>&#10;  console.log('Executed at the bottom of body');&#10;</script>"
            className="w-full h-44 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-red-500/50"
          />
        </div>

        {/* Footer Scripts */}
        <div className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 space-y-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <span className="bg-zinc-800 text-gray-300 font-mono text-[10px] px-2 py-0.5 rounded uppercase tracking-wider font-bold">Slot: Footer</span>
              <h3 className="text-lg font-bold text-white">Footer Blocks & Scripts</h3>
            </div>
            <span className="text-[11px] text-gray-500 flex items-center gap-1">
              <BookOpen size={12} /> Live Support, Custom Footer HTML
            </span>
          </div>
          <p className="text-xs text-gray-400 leading-relaxed">
            Ye code specific footer visual components ya custom chat widget load scripts ko handle karne me help karega.
          </p>
          <textarea
            value={scripts.footer}
            onChange={(e) => setScripts({ ...scripts, footer: e.target.value })}
            placeholder="<!-- Add live chat integrations like WhatsApp popup, Tawk.to, etc -->"
            className="w-full h-36 bg-zinc-950 border border-zinc-800 rounded-xl px-4 py-3 text-white font-mono text-xs focus:outline-none focus:ring-2 focus:ring-red-500/50"
          />
        </div>
      </div>

      {/* Save Button */}
      <div className="flex items-center justify-end border-t border-zinc-800 pt-6">
        <button
          onClick={saveScripts}
          disabled={loading}
          className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white font-bold px-8 py-3 rounded-xl transition-all shadow-lg shadow-red-600/20 active:scale-[0.98] disabled:opacity-50"
        >
          {loading ? (
            <>Saving...</>
          ) : (
            <>
              <Check size={20} /> Save All Script Settings
            </>
          )}
        </button>
      </div>
    </div>
  );
}

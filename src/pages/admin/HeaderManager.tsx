import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Save } from 'lucide-react';

export default function HeaderManager() {
  const [saving, setSaving] = useState(false);
  const [content, setContent] = useState<any>({
    logo_text: 'TechFNM',
    logo_highlight: 'FNM',
    nav_links: [
      { label: 'Home', href: '/' },
      { label: 'About', href: '/about' },
      { label: 'Services', href: '/services' },
      { label: 'Portfolio', href: '/portfolio' },
      { label: 'Blog', href: '/blog' },
      { label: 'Contact', href: '/contact' },
    ],
    cta_text: 'Get Started',
    cta_link: '#contact',
  });

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    const { data } = await supabase.from('pages_content').select('content').eq('id', 'site_header').single();
    if (data && data.content && Object.keys(data.content).length > 0) {
      setContent((prev: any) => ({ ...prev, ...data.content }));
    }
  };

  const handleSave = async () => {
    setSaving(true);
    const { error } = await supabase.from('pages_content').upsert({
      id: 'site_header',
      page_name: 'global',
      section_name: 'Header',
      content
    }, { onConflict: 'id' });
    setSaving(false);
    if (error) alert('Error saving');
    else alert('Header saved!');
  };

  const updateNavLink = (index: number, field: string, value: string) => {
    const newLinks = [...content.nav_links];
    newLinks[index] = { ...newLinks[index], [field]: value };
    setContent({ ...content, nav_links: newLinks });
  };

  const addNavLink = () => {
    setContent({ ...content, nav_links: [...content.nav_links, { label: '', href: '' }] });
  };

  const removeNavLink = (index: number) => {
    setContent({ ...content, nav_links: content.nav_links.filter((_: any, i: number) => i !== index) });
  };

  return (
    <div className="p-4 md:p-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-xl text-white font-normal">Header Settings</h1>
      </div>

      <div className="space-y-4">
        {/* Logo */}
        <div className="bg-zinc-900 border border-zinc-800">
          <div className="border-b border-zinc-800 px-3 py-2 text-white text-xs font-medium">Logo</div>
          <div className="p-4 space-y-3">
            <div className="flex gap-4">
              <div className="flex-1">
                <label className="text-xs text-zinc-500 block mb-1">Logo Text</label>
                <input type="text" value={content.logo_text} onChange={e => setContent({ ...content, logo_text: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 px-2 py-1.5 text-white text-sm focus:outline-none focus:border-red-500" />
              </div>
              <div className="flex-1">
                <label className="text-xs text-zinc-500 block mb-1">Highlighted Part</label>
                <input type="text" value={content.logo_highlight} onChange={e => setContent({ ...content, logo_highlight: e.target.value })}
                  className="w-full bg-zinc-950 border border-zinc-800 px-2 py-1.5 text-white text-sm focus:outline-none focus:border-red-500" />
              </div>
            </div>
          </div>
        </div>

        {/* Navigation Links */}
        <div className="bg-zinc-900 border border-zinc-800">
          <div className="border-b border-zinc-800 px-3 py-2 text-white text-xs font-medium">Navigation Links</div>
          <div className="p-4 space-y-2">
            {content.nav_links.map((link: any, i: number) => (
              <div key={i} className="flex gap-2 items-center">
                <input type="text" value={link.label} onChange={e => updateNavLink(i, 'label', e.target.value)}
                  placeholder="Label" className="flex-1 bg-zinc-950 border border-zinc-800 px-2 py-1.5 text-white text-sm focus:outline-none focus:border-red-500" />
                <input type="text" value={link.href} onChange={e => updateNavLink(i, 'href', e.target.value)}
                  placeholder="/path" className="flex-1 bg-zinc-950 border border-zinc-800 px-2 py-1.5 text-white text-sm focus:outline-none focus:border-red-500" />
                <button onClick={() => removeNavLink(i)} className="text-red-400 hover:text-red-300 text-xs px-2">✕</button>
              </div>
            ))}
            <button onClick={addNavLink} className="text-red-500 hover:underline text-sm mt-2">+ Add Link</button>
          </div>
        </div>

        {/* CTA Button */}
        <div className="bg-zinc-900 border border-zinc-800">
          <div className="border-b border-zinc-800 px-3 py-2 text-white text-xs font-medium">CTA Button</div>
          <div className="p-4 flex gap-4">
            <div className="flex-1">
              <label className="text-xs text-zinc-500 block mb-1">Button Text</label>
              <input type="text" value={content.cta_text} onChange={e => setContent({ ...content, cta_text: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 px-2 py-1.5 text-white text-sm focus:outline-none focus:border-red-500" />
            </div>
            <div className="flex-1">
              <label className="text-xs text-zinc-500 block mb-1">Button Link</label>
              <input type="text" value={content.cta_link} onChange={e => setContent({ ...content, cta_link: e.target.value })}
                className="w-full bg-zinc-950 border border-zinc-800 px-2 py-1.5 text-white text-sm focus:outline-none focus:border-red-500" />
            </div>
          </div>
        </div>

        <button onClick={handleSave} disabled={saving}
          className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50">
          <Save size={16} /> {saving ? 'Saving...' : 'Save Changes'}
        </button>
      </div>
    </div>
  );
}

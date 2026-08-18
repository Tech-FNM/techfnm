import { useEffect, useState } from 'react';
import { Save, Check, Search } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const SECTIONS = [
  {
    id: 'home_hero',
    name: 'Hero Section',
    fields: [
      { key: 'title', label: 'Main Title', type: 'text' },
      { key: 'subtitle', label: 'Highlighted Subtitle', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'cta1', label: 'Primary Button Text', type: 'text' },
      { key: 'cta2', label: 'Secondary Button Text', type: 'text' },
    ]
  },
  {
    id: 'home_about',
    name: 'About Summary',
    fields: [
      { key: 'subtitle', label: 'Small Subtitle', type: 'text' },
      { key: 'title', label: 'Main Title', type: 'text' },
      { key: 'description', label: 'Description Text', type: 'textarea' },
    ]
  },
  {
    id: 'home_cta',
    name: 'Bottom Call to Action',
    fields: [
      { key: 'title', label: 'Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
      { key: 'buttonText', label: 'Button Text', type: 'text' },
    ]
  }
];

export default function HomepageManager() {
  const [content, setContent] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pages_content')
      .select('*')
      .eq('page_name', 'home');
      
    if (data) {
      const formatted: Record<string, any> = {};
      data.forEach(item => {
        formatted[item.id] = item.content || {};
      });
      setContent(formatted);
    }
    setLoading(false);
  };

  const handleUpdateField = (sectionId: string, key: string, value: string) => {
    setContent(prev => ({
      ...prev,
      [sectionId]: {
        ...(prev[sectionId] || {}),
        [key]: value
      }
    }));
  };

  const handleSave = async (sectionId: string, sectionName: string) => {
    setSaving(true);
    const payload = {
      id: sectionId,
      page_name: 'home',
      section_name: sectionName,
      content: content[sectionId] || {}
    };

    const { error } = await supabase
      .from('pages_content')
      .upsert(payload, { onConflict: 'id' });

    setSaving(false);
    if (error) {
      alert('Error saving section');
      console.error(error);
    } else {
      alert('Section saved successfully');
    }
  };

  if (loading) {
    return <div className="text-white p-8">Loading content...</div>;
  }

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500">
          <Search size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Homepage Content</h1>
          <p className="text-gray-400 mt-1">Manage the text and sections of your public homepage.</p>
        </div>
      </div>

      <div className="space-y-8">
        {SECTIONS.map((section) => (
          <div key={section.id} className="bg-zinc-900 border border-zinc-800 rounded-2xl p-6 md:p-8">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-bold text-white">{section.name}</h2>
              <button
                onClick={() => handleSave(section.id, section.name)}
                disabled={saving}
                className="bg-red-600 hover:bg-red-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-2 disabled:opacity-50"
              >
                <Save size={16} /> Save Section
              </button>
            </div>

            <div className="grid grid-cols-1 gap-6">
              {section.fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-sm font-medium text-gray-400 mb-2">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      rows={4}
                      value={content[section.id]?.[field.key] || ''}
                      onChange={(e) => handleUpdateField(section.id, field.key, e.target.value)}
                      className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                    />
                  ) : (
                    <input
                      type="text"
                      value={content[section.id]?.[field.key] || ''}
                      onChange={(e) => handleUpdateField(section.id, field.key, e.target.value)}
                      className="w-full bg-black/50 border border-zinc-800 rounded-xl px-4 py-3 text-white focus:outline-none focus:border-red-500 transition-colors"
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                    />
                  )}
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

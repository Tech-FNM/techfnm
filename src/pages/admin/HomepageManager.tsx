import { useEffect, useState } from 'react';
import { Save } from 'lucide-react';
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
    name: 'About Summary Section',
    fields: [
      { key: 'subtitle', label: 'Small Subtitle', type: 'text' },
      { key: 'title', label: 'Main Title', type: 'text' },
      { key: 'description', label: 'Description Text', type: 'textarea' },
    ]
  },
  {
    id: 'home_services',
    name: 'Services Section',
    fields: [
      { key: 'subtitle', label: 'Small Subtitle', type: 'text' },
      { key: 'title', label: 'Main Title', type: 'text' },
      { key: 'description', label: 'Description Text', type: 'textarea' },
    ]
  },
  {
    id: 'home_portfolio',
    name: 'Portfolio Section',
    fields: [
      { key: 'subtitle', label: 'Small Subtitle', type: 'text' },
      { key: 'title', label: 'Main Title', type: 'text' },
      { key: 'description', label: 'Description Text', type: 'textarea' },
    ]
  },
  {
    id: 'home_leadership',
    name: 'Leadership / Team Section',
    fields: [
      { key: 'subtitle', label: 'Small Subtitle', type: 'text' },
      { key: 'title', label: 'Main Title', type: 'text' },
      { key: 'description', label: 'Description Text', type: 'textarea' },
    ]
  },
  {
    id: 'home_testimonials',
    name: 'Testimonials Section',
    fields: [
      { key: 'subtitle', label: 'Small Subtitle', type: 'text' },
      { key: 'title', label: 'Main Title', type: 'text' },
    ]
  },
  {
    id: 'home_clients',
    name: 'Clients Section',
    fields: [
      { key: 'subtitle', label: 'Small Subtitle', type: 'text' },
      { key: 'title', label: 'Main Title', type: 'text' },
    ]
  },
  {
    id: 'home_faq',
    name: 'FAQ Section',
    fields: [
      { key: 'subtitle', label: 'Small Subtitle', type: 'text' },
      { key: 'title', label: 'Main Title', type: 'text' },
    ]
  },
  {
    id: 'home_contact',
    name: 'Contact Section',
    fields: [
      { key: 'subtitle', label: 'Small Subtitle', type: 'text' },
      { key: 'title', label: 'Main Title', type: 'text' },
      { key: 'description', label: 'Description', type: 'textarea' },
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
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    fetchContent();
  }, []);

  const fetchContent = async () => {
    setLoading(true);
    const { data } = await supabase
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
    setSavingId(sectionId);
    const payload = {
      id: sectionId,
      page_name: 'home',
      section_name: sectionName,
      content: content[sectionId] || {}
    };

    const { error } = await supabase
      .from('pages_content')
      .upsert(payload, { onConflict: 'id' });

    setSavingId(null);
    if (error) {
      alert('Error saving section');
      console.error(error);
    } else {
      alert('Section saved successfully');
    }
  };

  if (loading) {
    return <div className="text-zinc-400 p-6">Loading content...</div>;
  }

  return (
    <div className="p-4 md:p-6 max-w-4xl">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-xl text-white font-normal">Edit Homepage</h1>
      </div>
      <p className="text-zinc-500 text-sm mb-6">
        Manage the text and content of all sections on the homepage. Changes will reflect on the public site after saving.
      </p>

      <div className="space-y-4">
        {SECTIONS.map((section) => (
          <div key={section.id} className="bg-zinc-900 border border-zinc-800">
            <div className="flex items-center justify-between border-b border-zinc-800 px-3 py-2">
              <h2 className="text-white text-xs font-medium">{section.name}</h2>
              <button
                onClick={() => handleSave(section.id, section.name)}
                disabled={savingId === section.id}
                className="bg-red-600 hover:bg-red-700 text-white px-3 py-1 text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50"
              >
                <Save size={12} /> {savingId === section.id ? 'Saving...' : 'Save'}
              </button>
            </div>

            <div className="p-4 space-y-3">
              {section.fields.map((field) => (
                <div key={field.key}>
                  <label className="block text-xs text-zinc-500 mb-1">{field.label}</label>
                  {field.type === 'textarea' ? (
                    <textarea
                      rows={3}
                      value={content[section.id]?.[field.key] || ''}
                      onChange={(e) => handleUpdateField(section.id, field.key, e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 px-2 py-1.5 text-white text-sm focus:outline-none focus:border-red-500 resize-none"
                      placeholder={`Enter ${field.label.toLowerCase()}...`}
                    />
                  ) : (
                    <input
                      type="text"
                      value={content[section.id]?.[field.key] || ''}
                      onChange={(e) => handleUpdateField(section.id, field.key, e.target.value)}
                      className="w-full bg-zinc-950 border border-zinc-800 px-2 py-1.5 text-white text-sm focus:outline-none focus:border-red-500"
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

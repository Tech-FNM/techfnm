import { useEffect, useState } from 'react';
import { Save, Layers } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const PAGE_SECTIONS: Record<string, any[]> = {
  about: [
    {
      id: 'about_hero',
      name: 'Hero Section',
      fields: [
        { key: 'title', label: 'Main Title', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
      ]
    },
    {
      id: 'about_story',
      name: 'Our Story',
      fields: [
        { key: 'title', label: 'Section Title', type: 'text' },
        { key: 'content1', label: 'Paragraph 1', type: 'textarea' },
        { key: 'content2', label: 'Paragraph 2', type: 'textarea' },
      ]
    },
    {
      id: 'about_mission',
      name: 'Mission & Vision',
      fields: [
        { key: 'mission', label: 'Mission Text', type: 'textarea' },
        { key: 'vision', label: 'Vision Text', type: 'textarea' },
      ]
    }
  ],
  services: [
    {
      id: 'services_hero',
      name: 'Hero Section',
      fields: [
        { key: 'title', label: 'Main Title', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
      ]
    },
    {
      id: 'services_process',
      name: 'Our Process Subtitle',
      fields: [
        { key: 'subtitle', label: 'Subtitle Description', type: 'textarea' },
      ]
    }
  ],
  portfolio: [
    {
      id: 'portfolio_hero',
      name: 'Hero Section',
      fields: [
        { key: 'title', label: 'Main Title', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
      ]
    }
  ],
  contact: [
    {
      id: 'contact_hero',
      name: 'Hero Section',
      fields: [
        { key: 'title', label: 'Main Title', type: 'text' },
        { key: 'description', label: 'Description', type: 'textarea' },
      ]
    },
    {
      id: 'contact_info',
      name: 'Contact Details',
      fields: [
        { key: 'email', label: 'Email', type: 'text' },
        { key: 'phone', label: 'Phone', type: 'text' },
        { key: 'address', label: 'Address', type: 'textarea' },
      ]
    }
  ]
};

export default function PagesContentManager() {
  const [activePage, setActivePage] = useState('about');
  const [content, setContent] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    fetchContent(activePage);
  }, [activePage]);

  const fetchContent = async (pageName: string) => {
    setLoading(true);
    const { data, error } = await supabase
      .from('pages_content')
      .select('*')
      .eq('page_name', pageName);
      
    if (data) {
      const formatted: Record<string, any> = {};
      data.forEach(item => {
        formatted[item.id] = item.content || {};
      });
      setContent(formatted);
    } else {
      setContent({});
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
      page_name: activePage,
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

  const currentSections = PAGE_SECTIONS[activePage] || [];

  return (
    <div className="p-8 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-8">
        <div className="w-12 h-12 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500">
          <Layers size={24} />
        </div>
        <div>
          <h1 className="text-3xl font-bold text-white">Pages Content</h1>
          <p className="text-gray-400 mt-1">Manage the text and sections of your inner pages.</p>
        </div>
      </div>

      {/* Page Tabs */}
      <div className="flex gap-4 mb-8 overflow-x-auto pb-2">
        {Object.keys(PAGE_SECTIONS).map((page) => (
          <button
            key={page}
            onClick={() => setActivePage(page)}
            className={`px-6 py-3 rounded-xl font-medium capitalize whitespace-nowrap transition-colors ${
              activePage === page 
                ? 'bg-red-600 text-white' 
                : 'bg-zinc-900 text-gray-400 hover:bg-zinc-800'
            }`}
          >
            {page} Page
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-white">Loading content...</div>
      ) : (
        <div className="space-y-8">
          {currentSections.map((section) => (
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
                {section.fields.map((field: any) => (
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
      )}
    </div>
  );
}

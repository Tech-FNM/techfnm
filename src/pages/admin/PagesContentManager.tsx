import { useEffect, useState } from 'react';
import { Save, Layers } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const PAGE_SECTIONS: Record<string, any[]> = {
  home: [
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
        { key: 'description', label: 'Description', type: 'textarea' },
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
  ],
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
  const [activePage, setActivePage] = useState('home');
  const [content, setContent] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(true);
  const [savingId, setSavingId] = useState<string | null>(null);

  useEffect(() => {
    fetchContent(activePage);
  }, [activePage]);

  const fetchContent = async (pageName: string) => {
    setLoading(true);
    const { data } = await supabase
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
    setSavingId(sectionId);
    const payload = {
      id: sectionId,
      page_name: activePage,
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

  const currentSections = PAGE_SECTIONS[activePage] || [];

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="flex items-center gap-4 mb-6">
        <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500">
          <Layers size={20} />
        </div>
        <div>
          <h1 className="text-2xl font-normal text-white">Pages Editor</h1>
          <p className="text-gray-500 text-xs mt-0.5">Manage inner page blocks and layout elements in order.</p>
        </div>
      </div>

      {/* Page Tabs */}
      <div className="flex gap-2 mb-6 overflow-x-auto pb-2 border-b border-zinc-800">
        {Object.keys(PAGE_SECTIONS).map((page) => (
          <button
            key={page}
            onClick={() => setActivePage(page)}
            className={`px-4 py-1.5 rounded-lg text-xs font-semibold capitalize whitespace-nowrap transition-colors ${
              activePage === page 
                ? 'bg-red-600 text-white' 
                : 'bg-zinc-900 text-gray-400 hover:bg-zinc-850'
            }`}
          >
            {page} Page
          </button>
        ))}
      </div>

      {loading ? (
        <div className="text-zinc-500 text-sm">Loading content...</div>
      ) : (
        <div className="space-y-6">
          {currentSections.map((section) => (
            <div key={section.id} className="bg-zinc-900 border border-zinc-800 rounded-xl">
              <div className="flex items-center justify-between border-b border-zinc-800 px-4 py-3">
                <h2 className="text-sm font-semibold text-white">{section.name}</h2>
                <button
                  onClick={() => handleSave(section.id, section.name)}
                  disabled={savingId === section.id}
                  className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors flex items-center gap-1.5 disabled:opacity-50"
                >
                  <Save size={14} /> {savingId === section.id ? 'Saving...' : 'Save Section'}
                </button>
              </div>

              <div className="p-4 space-y-4">
                {section.fields.map((field: any) => (
                  <div key={field.key}>
                    <label className="block text-xs font-medium text-gray-400 mb-1.5">{field.label}</label>
                    {field.type === 'textarea' ? (
                      <textarea
                        rows={4}
                        value={content[section.id]?.[field.key] || ''}
                        onChange={(e) => handleUpdateField(section.id, field.key, e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
                        placeholder={`Enter ${field.label.toLowerCase()}...`}
                      />
                    ) : (
                      <input
                        type="text"
                        value={content[section.id]?.[field.key] || ''}
                        onChange={(e) => handleUpdateField(section.id, field.key, e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 rounded-xl px-3 py-2 text-white text-sm focus:outline-none focus:border-red-500 transition-colors"
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

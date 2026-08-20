import { useEffect, useState } from 'react';
import { Save, Layers, Search, FileText } from 'lucide-react';
import { supabase } from '../../lib/supabase';

const PAGES_LIST = [
  { id: 'home', title: 'Home Page', author: 'admin', date: 'Published' },
  { id: 'about', title: 'About Page', author: 'admin', date: 'Published' },
  { id: 'services', title: 'Services Listing Page', author: 'admin', date: 'Published' },
  { id: 'portfolio', title: 'Portfolio Page', author: 'admin', date: 'Published' },
  { id: 'contact', title: 'Contact Page', author: 'admin', date: 'Published' }
];

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
  const [viewMode, setViewMode] = useState<'list' | 'edit'>('list');
  const [activePage, setActivePage] = useState('home');
  const [content, setContent] = useState<Record<string, any>>({});
  const [loading, setLoading] = useState(false);
  const [savingId, setSavingId] = useState<string | null>(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<string[]>([]);

  useEffect(() => {
    if (viewMode === 'edit') {
      fetchContent(activePage);
    }
  }, [activePage, viewMode]);

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

  const startEditingPage = (pageId: string) => {
    setActivePage(pageId);
    setViewMode('edit');
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selected.length === filteredPages.length) setSelected([]);
    else setSelected(filteredPages.map(p => p.id));
  };

  const filteredPages = PAGES_LIST.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const currentSections = PAGE_SECTIONS[activePage] || [];

  if (viewMode === 'list') {
    return (
      <div className="p-4 md:p-6">
        <div className="flex items-center gap-3 mb-4">
          <h1 className="text-xl text-white font-normal">Pages</h1>
          <button 
            onClick={() => { startEditingPage('home'); }}
            className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white px-3 py-1 text-sm transition-colors"
          >
            Add New
          </button>
        </div>

        {/* Filter bar */}
        <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
          <div className="flex items-center gap-2 text-sm">
            <span className="text-red-500">All ({PAGES_LIST.length})</span>
            <span className="text-zinc-650">|</span>
            <span className="text-zinc-500 hover:text-white cursor-pointer">Published ({PAGES_LIST.length})</span>
          </div>
          <div className="flex items-center gap-2">
            <input 
              type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
              placeholder="Search Pages" 
              className="bg-zinc-900 border border-zinc-800 px-2 py-1 text-sm text-white focus:outline-none focus:border-red-500 w-40"
            />
            <button className="bg-zinc-800 border border-zinc-700 text-zinc-300 px-3 py-1 text-sm hover:text-white transition-colors">
              Search Pages
            </button>
          </div>
        </div>

        {/* Bulk actions */}
        <div className="flex items-center gap-2 mb-2 text-sm">
          <select className="bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-1 text-sm focus:outline-none">
            <option>Bulk actions</option>
            <option>Edit</option>
          </select>
          <button className="bg-zinc-800 border border-zinc-700 text-zinc-300 px-3 py-1 text-sm hover:text-white transition-colors">Apply</button>
          <span className="text-zinc-600 ml-auto">{filteredPages.length} item{filteredPages.length !== 1 ? 's' : ''}</span>
        </div>

        {/* WordPress Style Table */}
        <div className="border border-zinc-800 overflow-x-auto bg-zinc-900/10">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-zinc-800 bg-zinc-900/50">
                <th className="p-2.5 w-8 text-center">
                  <input type="checkbox" checked={selected.length === filteredPages.length && filteredPages.length > 0} onChange={toggleAll} className="accent-red-500" />
                </th>
                <th className="p-2.5 text-left text-zinc-400 font-medium">Title</th>
                <th className="p-2.5 text-left text-zinc-400 font-medium">Author</th>
                <th className="p-2.5 text-left text-zinc-400 font-medium">Date</th>
              </tr>
            </thead>
            <tbody>
              {filteredPages.map(page => (
                <tr key={page.id} className="border-b border-zinc-800/60 hover:bg-zinc-900/50 group">
                  <td className="p-2.5 text-center">
                    <input type="checkbox" checked={selected.includes(page.id)} onChange={() => toggleSelect(page.id)} className="accent-red-500" />
                  </td>
                  <td className="p-2.5">
                    <div>
                      <button onClick={() => startEditingPage(page.id)} className="text-white font-medium hover:text-red-500 transition-colors text-left">
                        {page.title}
                      </button>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 mt-1 text-xs">
                        <button onClick={() => startEditingPage(page.id)} className="text-red-500 hover:underline">Edit</button>
                        <span className="text-zinc-800">|</span>
                        <span className="text-zinc-600">Quick Edit</span>
                        <span className="text-zinc-850">|</span>
                        <span className="text-zinc-600">Trash</span>
                        <span className="text-zinc-850">|</span>
                        <a href={page.id === 'home' ? '/' : `/${page.id}`} target="_blank" className="text-zinc-500 hover:underline">View</a>
                      </div>
                    </div>
                  </td>
                  <td className="p-2.5 text-zinc-500">{page.author}</td>
                  <td className="p-2.5 text-zinc-500">
                    <div>{page.date}</div>
                    <div className="text-xs text-zinc-600">2026/08/21</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div className="p-4 md:p-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-red-500/10 rounded-xl flex items-center justify-center text-red-500">
            <FileText size={20} />
          </div>
          <div>
            <h1 className="text-2xl font-normal text-white">Edit Page</h1>
            <p className="text-gray-500 text-xs mt-0.5">Edit page content blocks sequentially.</p>
          </div>
        </div>
        <button 
          onClick={() => setViewMode('list')}
          className="text-zinc-400 hover:text-white text-xs border border-zinc-800 px-3 py-1.5 rounded-lg"
        >
          ← Back to Pages List
        </button>
      </div>

      {loading ? (
        <div className="text-zinc-500 text-sm">Loading page sections...</div>
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

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
      name: 'Hero Header Block',
      fields: [
        { key: 'title', label: 'Main Complexity Title', type: 'text' },
        { key: 'subtitle', label: 'Subtitle Highlight', type: 'text' },
        { key: 'intro_italic', label: 'Italic Intro Quote', type: 'textarea' },
      ]
    },
    {
      id: 'about_existence',
      name: 'Our Existence Explained Section',
      fields: [
        { key: 'title', label: 'Section Title', type: 'text' },
        { key: 'description', label: 'Existence Paragraph', type: 'textarea' },
        { key: 'founded_label', label: 'Founded Label', type: 'text' },
        { key: 'founded_value', label: 'Founded Value', type: 'text' },
        { key: 'remote_label', label: 'Remote Label', type: 'text' },
        { key: 'remote_value', label: 'Remote Value', type: 'text' },
        { key: 'raised_label', label: 'Raised Label', type: 'text' },
        { key: 'raised_value', label: 'Raised Value', type: 'text' },
      ]
    },
    {
      id: 'about_do_difference',
      name: 'What We Do & Our Difference Block',
      fields: [
        { key: 'do_title', label: 'What We Do Title', type: 'text' },
        { key: 'do_desc', label: 'What We Do Description', type: 'textarea' },
        { key: 'diff_title', label: 'Our Difference Title', type: 'text' },
        { key: 'diff_desc', label: 'Our Difference Description', type: 'textarea' },
      ]
    },
    {
      id: 'about_team_quality',
      name: 'Quality of Our Work Block',
      fields: [
        { key: 'title', label: 'Team Header Title', type: 'text' },
        { key: 'description', label: 'Team Section Description', type: 'textarea' },
        { key: 'image_url', label: 'Team Image URL', type: 'text' },
      ]
    },
    {
      id: 'about_trust_numbers',
      name: 'Trust Backed By Numbers Block',
      fields: [
        { key: 'title', label: 'Numbers Section Title', type: 'text' },
        { key: 'description', label: 'Numbers Description text', type: 'textarea' },
      ]
    },
    {
      id: 'about_easy_start',
      name: 'Bottom Call to Action Block',
      fields: [
        { key: 'title', label: 'CTA Header Title', type: 'text' },
        { key: 'buttonText', label: 'CTA Button Text', type: 'text' },
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

  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const insertWysiwygText = (sectionId: string, key: string, tag: string, textEnd: string = '') => {
    const txtArea = document.getElementById(`wysiwyg-${sectionId}-${key}`) as HTMLTextAreaElement;
    if (!txtArea) return;
    const start = txtArea.selectionStart;
    const end = txtArea.selectionEnd;
    const selText = txtArea.value.substring(start, end);
    const replacement = tag + (selText || 'text') + textEnd;
    const newVal = txtArea.value.substring(0, start) + replacement + txtArea.value.substring(end);
    handleUpdateField(sectionId, key, newVal);
    setTimeout(() => {
      txtArea.focus();
      txtArea.setSelectionRange(start + tag.length, start + tag.length + (selText || 'text').length);
    }, 50);
  };

  return (
    <div className="p-4 md:p-6 max-w-7xl mx-auto space-y-6">
      
      {/* WordPress Editor Layout Heading */}
      <div className="flex items-center gap-3">
        <h1 className="text-2xl font-light text-white">Edit Page</h1>
        <button 
          onClick={() => { startEditingPage('home'); }}
          className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white px-2.5 py-1 text-xs transition-colors"
        >
          Add New
        </button>
      </div>

      {/* WordPress Backup Banner Notification */}
      <div className="bg-zinc-900 border-l-4 border-amber-500 p-4 flex items-center justify-between rounded-r-lg text-sm text-zinc-350">
        <div className="flex items-center gap-2">
          <span>The backup of this post in your browser is different from the version below.</span>
          <button className="bg-zinc-800 hover:bg-zinc-750 text-white text-xs px-2.5 py-1 border border-zinc-700 rounded font-medium">Restore the backup</button>
        </div>
        <button onClick={() => {}} className="text-zinc-500 hover:text-white">✕</button>
      </div>

      <div className="flex flex-col lg:flex-row gap-6 items-start">
        
        {/* Main Editor Columns (Left Side) */}
        <div className="flex-1 space-y-6 w-full">
          
          {/* WordPress Page Title & Permalink */}
          <div className="space-y-2 bg-zinc-900/40 p-4 rounded-xl border border-zinc-850">
            <input 
              type="text" 
              value={PAGES_LIST.find(p => p.id === activePage)?.title || ''} 
              readOnly
              className="w-full bg-zinc-950 border border-zinc-800 px-3 py-2 text-white text-xl font-bold focus:outline-none"
            />
            <div className="flex items-center gap-1.5 text-xs text-zinc-500">
              <span>Permalink:</span>
              <span className="text-red-500 underline cursor-pointer">http://techfnm.com/{activePage === 'home' ? '' : activePage}</span>
              <button className="bg-zinc-800 px-2 py-0.5 border border-zinc-700 rounded text-[10px] text-zinc-300">Edit</button>
            </div>
          </div>

          {loading ? (
            <div className="text-zinc-500 text-sm">Loading page content blocks...</div>
          ) : (
            <div className="space-y-4">
              {currentSections.map((section) => {
                const isOpen = expandedSection === section.id;
                return (
                  <div key={section.id} className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg">
                    <div 
                      onClick={() => setExpandedSection(isOpen ? null : section.id)}
                      className="flex items-center justify-between border-b border-zinc-800 bg-zinc-900/60 px-4 py-3 cursor-pointer hover:bg-zinc-800/40 transition-colors"
                    >
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-zinc-500">{isOpen ? '▼' : '▶'}</span>
                        <h2 className="text-xs font-semibold text-zinc-300">{section.name}</h2>
                      </div>
                      <span className="text-[10px] text-zinc-500 font-mono">#{section.id}</span>
                    </div>

                    {isOpen && (
                      <div className="p-4 space-y-4 border-t border-zinc-850 bg-zinc-900/10">
                        {section.fields.map((field: any) => (
                          <div key={field.key} className="space-y-2">
                            <label className="block text-xs font-medium text-gray-400">{field.label}</label>
                            {field.type === 'textarea' ? (
                              <div className="border border-zinc-800 rounded-xl bg-zinc-950 overflow-hidden">
                                <div className="border-b border-zinc-850 px-3 py-2 flex flex-wrap gap-1.5 items-center bg-zinc-900/80">
                                  <button type="button" onClick={() => insertWysiwygText(section.id, field.key, '# ', '\n')} className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-[10px] font-bold">H1</button>
                                  <button type="button" onClick={() => insertWysiwygText(section.id, field.key, '## ', '\n')} className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-[10px] font-bold">H2</button>
                                  <button type="button" onClick={() => insertWysiwygText(section.id, field.key, '### ', '\n')} className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-[10px] font-bold">H3</button>
                                  <span className="text-zinc-800">|</span>
                                  <button type="button" onClick={() => insertWysiwygText(section.id, field.key, '**', '**')} className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-[10px] font-bold">B</button>
                                  <button type="button" onClick={() => insertWysiwygText(section.id, field.key, '*', '*')} className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-[10px] italic">I</button>
                                  <span className="text-zinc-800">|</span>
                                  <button type="button" onClick={() => insertWysiwygText(section.id, field.key, '- ', '\n')} className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-[10px]">List</button>
                                  <button type="button" onClick={() => insertWysiwygText(section.id, field.key, '[', '](url)')} className="px-2 py-0.5 bg-zinc-800 hover:bg-zinc-700 text-white rounded text-[10px]">Link</button>
                                </div>
                                <textarea
                                  id={`wysiwyg-${section.id}-${field.key}`}
                                  rows={4}
                                  value={content[section.id]?.[field.key] || ''}
                                  onChange={(e) => handleUpdateField(section.id, field.key, e.target.value)}
                                  className="w-full bg-transparent px-3 py-2 text-white text-sm focus:outline-none resize-none font-mono"
                                  placeholder={`Enter ${field.label.toLowerCase()}...`}
                                />
                              </div>
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
                        
                        <div className="flex justify-end pt-2">
                          <button
                            type="button"
                            onClick={() => handleSave(section.id, section.name)}
                            disabled={savingId === section.id}
                            className="bg-red-600 hover:bg-red-700 text-white px-3 py-1.5 rounded-lg text-xs font-bold transition-all disabled:opacity-50 flex items-center gap-1"
                          >
                            <Save size={12} /> {savingId === section.id ? 'Saving...' : 'Save Section'}
                          </button>
                        </div>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>

        {/* Sidebar Metabox Panels (Right Side) */}
        <div className="w-full lg:w-72 space-y-4 shrink-0">
          
          {/* WordPress Publish Metabox Widget */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg">
            <div className="border-b border-zinc-800 px-3 py-2 text-zinc-300 text-xs font-semibold bg-zinc-900/60">
              Publish
            </div>
            <div className="p-3.5 space-y-3.5 text-xs">
              <div className="flex gap-2">
                <button type="button" onClick={() => {}} className="flex-1 bg-zinc-800 hover:bg-zinc-750 text-zinc-300 py-1.5 rounded font-medium border border-zinc-700">Preview Changes</button>
              </div>
              <div className="space-y-2 text-zinc-400">
                <div className="flex justify-between">
                  <span>Status:</span> <span className="text-white font-medium">Published</span>
                </div>
                <div className="flex justify-between">
                  <span>Visibility:</span> <span className="text-white font-medium">Public</span>
                </div>
                <div className="flex justify-between">
                  <span>Revisions:</span> <span className="text-white font-medium">13 revisions</span>
                </div>
              </div>
              <div className="flex items-center justify-between pt-2 border-t border-zinc-850">
                <button type="button" onClick={() => setViewMode('list')} className="text-red-500 hover:underline">Move to Trash</button>
                <button 
                  type="button" 
                  disabled={savingId !== null}
                  onClick={async () => {
                    for (const section of currentSections) {
                      await handleSave(section.id, section.name);
                    }
                  }}
                  className="bg-red-600 hover:bg-red-700 text-white px-4 py-1.5 rounded font-bold transition-all disabled:opacity-50"
                >
                  {savingId ? 'Updating...' : 'Update'}
                </button>
              </div>
            </div>
          </div>

          {/* WordPress Page Attributes Widget */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden shadow-lg">
            <div className="border-b border-zinc-800 px-3 py-2 text-zinc-300 text-xs font-semibold bg-zinc-900/60">
              Page Attributes
            </div>
            <div className="p-3.5 space-y-3 text-xs">
              <div>
                <label className="text-zinc-400 block mb-1">Parent</label>
                <select className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 p-1.5 focus:outline-none rounded">
                  <option>(no parent)</option>
                </select>
              </div>
              <div>
                <label className="text-zinc-400 block mb-1">Template</label>
                <select className="w-full bg-zinc-950 border border-zinc-800 text-zinc-300 p-1.5 focus:outline-none rounded">
                  <option>Default template</option>
                </select>
              </div>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}

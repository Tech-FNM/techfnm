import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Plus, Pencil, Trash2, X, Image as ImageIcon, Loader2, Search } from 'lucide-react';

export default function BlogManager() {
  const [blogs, setBlogs] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [selected, setSelected] = useState<string[]>([]);
  
  const [formData, setFormData] = useState<any>({
    id: '',
    title: '',
    slug: '',
    content: '',
    image: '',
    meta_title: '',
    meta_description: '',
    faqs: []
  });

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    setIsLoading(true);
    const { data, error } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
    if (!error) setBlogs(data || []);
    setIsLoading(false);
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    try {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random()}.${fileExt}`;
      const filePath = `blogs/${fileName}`;
      const { error: uploadError } = await supabase.storage.from('agency-assets').upload(filePath, file);
      if (uploadError) throw uploadError;
      const { data: { publicUrl } } = supabase.storage.from('agency-assets').getPublicUrl(filePath);
      setFormData((prev: any) => ({ ...prev, image: publicUrl }));
    } catch (error) {
      alert('Error uploading image');
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSaving(true);
    try {
      const payload = {
        title: formData.title,
        slug: formData.slug,
        content: formData.content,
        image: formData.image,
        meta_title: formData.meta_title,
        meta_description: formData.meta_description,
        faqs: Array.isArray(formData.faqs) ? formData.faqs : []
      };

      if (formData.id) {
        const { error } = await supabase.from('blogs').update(payload).eq('id', formData.id);
        if (error) throw error;
      } else {
        const { error } = await supabase.from('blogs').insert([payload]);
        if (error) throw error;
      }
      setIsEditing(false);
      setFormData({ id: '', title: '', slug: '', content: '', image: '', meta_title: '', meta_description: '', faqs: [] });
      fetchBlogs();
    } catch (error: any) {
      alert(error.message || 'Error saving blog');
    } finally {
      setIsSaving(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    const { error } = await supabase.from('blogs').delete().eq('id', id);
    if (!error) fetchBlogs();
  };

  const handleBulkDelete = async () => {
    if (selected.length === 0) return;
    if (!window.confirm(`Delete ${selected.length} posts?`)) return;
    for (const id of selected) {
      await supabase.from('blogs').delete().eq('id', id);
    }
    setSelected([]);
    fetchBlogs();
  };

  const toggleSelect = (id: string) => {
    setSelected(prev => prev.includes(id) ? prev.filter(s => s !== id) : [...prev, id]);
  };

  const toggleAll = () => {
    if (selected.length === filteredBlogs.length) setSelected([]);
    else setSelected(filteredBlogs.map(b => b.id));
  };

  const filteredBlogs = blogs.filter(b => 
    b.title?.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const addFaqItem = () => {
    const list = Array.isArray(formData.faqs) ? [...formData.faqs] : [];
    setFormData({ ...formData, faqs: [...list, { question: '', answer: '' }] });
  };

  const updateFaqItem = (index: number, key: string, value: string) => {
    const list = Array.isArray(formData.faqs) ? [...formData.faqs] : [];
    list[index] = { ...list[index], [key]: value };
    setFormData({ ...formData, faqs: list });
  };

  const removeFaqItem = (index: number) => {
    const list = Array.isArray(formData.faqs) ? [...formData.faqs] : [];
    setFormData({ ...formData, faqs: list.filter((_, i) => i !== index) });
  };

  const insertWysiwygText = (tag: string, textEnd: string = '') => {
    const txtArea = document.getElementById('wysiwyg-content') as HTMLTextAreaElement;
    if (!txtArea) return;
    const start = txtArea.selectionStart;
    const end = txtArea.selectionEnd;
    const selText = txtArea.value.substring(start, end);
    const replacement = tag + (selText || 'text') + textEnd;
    const newVal = txtArea.value.substring(0, start) + replacement + txtArea.value.substring(end);
    setFormData({ ...formData, content: newVal });
    setTimeout(() => {
      txtArea.focus();
      txtArea.setSelectionRange(start + tag.length, start + tag.length + (selText || 'text').length);
    }, 50);
  };

  if (isLoading) return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-red-500" size={32} /></div>;

  // EDITOR VIEW
  if (isEditing) {
    return (
      <div className="p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <h1 className="text-xl text-white font-normal">{formData.id ? 'Edit Post' : 'Add New Post'}</h1>
          <button onClick={() => { setIsEditing(false); setFormData({ id: '', title: '', slug: '', content: '', image: '', meta_title: '', meta_description: '', faqs: [] }); }} className="text-zinc-400 hover:text-white text-sm flex items-center gap-1">
            <X size={16} /> Back to all posts
          </button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <input 
            required type="text" value={formData.title} placeholder="Enter title here"
            onChange={e => {
              const title = e.target.value;
              const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)+/g, '');
              setFormData({ ...formData, title, slug: formData.id ? formData.slug : slug });
            }}
            className="w-full bg-zinc-900 border border-zinc-800 px-3 py-2.5 text-white text-xl focus:outline-none focus:border-red-500"
          />

          <div className="flex items-center gap-2 text-sm text-zinc-500">
            <span>Permalink:</span>
            <span className="text-zinc-400">/blog/</span>
            <input 
              type="text" value={formData.slug}
              onChange={e => setFormData({ ...formData, slug: e.target.value })}
              className="bg-zinc-900 border border-zinc-800 px-2 py-0.5 text-zinc-300 text-sm focus:outline-none focus:border-red-500"
            />
          </div>

          <div className="flex flex-col lg:flex-row gap-4">
            {/* Main Content */}
            <div className="flex-1 space-y-4">
              <div className="bg-zinc-900 border border-zinc-800">
                <div className="border-b border-zinc-800 px-3 py-2 flex flex-wrap gap-2 items-center bg-zinc-900/90 sticky top-0">
                  <button type="button" onClick={() => insertWysiwygText('# ', '\n')} className="px-2 py-1 bg-zinc-850 hover:bg-zinc-800 text-white rounded text-xs font-bold">H1</button>
                  <button type="button" onClick={() => insertWysiwygText('## ', '\n')} className="px-2 py-1 bg-zinc-850 hover:bg-zinc-800 text-white rounded text-xs font-bold">H2</button>
                  <button type="button" onClick={() => insertWysiwygText('### ', '\n')} className="px-2 py-1 bg-zinc-850 hover:bg-zinc-800 text-white rounded text-xs font-bold">H3</button>
                  <span className="text-zinc-800">|</span>
                  <button type="button" onClick={() => insertWysiwygText('**', '**')} className="px-2 py-1 bg-zinc-850 hover:bg-zinc-800 text-white rounded text-xs font-bold">B</button>
                  <button type="button" onClick={() => insertWysiwygText('*', '*')} className="px-2 py-1 bg-zinc-850 hover:bg-zinc-800 text-white rounded text-xs italic">I</button>
                  <span className="text-zinc-800">|</span>
                  <button type="button" onClick={() => insertWysiwygText('- ', '\n')} className="px-2 py-1 bg-zinc-850 hover:bg-zinc-800 text-white rounded text-xs">List</button>
                  <button type="button" onClick={() => insertWysiwygText('[', '](url)')} className="px-2 py-1 bg-zinc-850 hover:bg-zinc-800 text-white rounded text-xs">Link</button>
                  <button type="button" onClick={() => insertWysiwygText('![', '](img-url)')} className="px-2 py-1 bg-zinc-850 hover:bg-zinc-800 text-white rounded text-xs">Image</button>
                  <button type="button" onClick={() => insertWysiwygText('```\n', '\n```')} className="px-2 py-1 bg-zinc-850 hover:bg-zinc-800 text-white rounded text-xs">Code</button>
                  <button type="button" onClick={() => insertWysiwygText('| Header | Header |\n|------|------|\n| Cell | Cell |', '')} className="px-2 py-1 bg-zinc-850 hover:bg-zinc-800 text-white rounded text-xs">Table</button>
                </div>
                <textarea 
                  id="wysiwyg-content"
                  required rows={18} value={formData.content}
                  onChange={e => setFormData({ ...formData, content: e.target.value })}
                  className="w-full bg-transparent px-3 py-2 text-white font-mono text-sm focus:outline-none resize-none"
                  placeholder="Start writing rich post content block..."
                />
              </div>
            </div>

            {/* Sidebar Metaboxes */}
            <div className="w-full lg:w-72 space-y-4">
              {/* Publish Box */}
              <div className="bg-zinc-900 border border-zinc-800">
                <div className="border-b border-zinc-800 px-3 py-2 text-white text-xs font-medium">Publish</div>
                <div className="p-3 space-y-3">
                  <div className="flex items-center gap-2 text-sm text-zinc-400">
                    <span>Status:</span> <span className="text-white">Published</span>
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" disabled={isSaving} className="flex-1 bg-red-600 hover:bg-red-700 text-white py-1.5 text-sm font-medium transition-colors">
                      {isSaving ? 'Saving...' : formData.id ? 'Update' : 'Publish'}
                    </button>
                  </div>
                </div>
              </div>

              {/* Dynamic Post FAQs */}
              <div className="bg-zinc-900 border border-zinc-800">
                <div className="border-b border-zinc-800 px-3 py-2 text-white text-xs font-medium flex items-center justify-between">
                  <span>Post FAQs</span>
                  <button type="button" onClick={addFaqItem} className="text-red-500 hover:underline text-[10px]">+ Add FAQ</button>
                </div>
                <div className="p-3 space-y-3 max-h-60 overflow-y-auto">
                  {(formData.faqs || []).map((faq: any, idx: number) => (
                    <div key={idx} className="p-2 border border-zinc-850 bg-black/40 rounded-lg relative space-y-1">
                      <button type="button" onClick={() => removeFaqItem(idx)} className="absolute top-1 right-1 text-red-500 hover:text-red-300 text-[10px]">✕</button>
                      <input 
                        type="text" placeholder="Question" value={faq.question || faq.q || ''} 
                        onChange={e => updateFaqItem(idx, 'question', e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 px-1.5 py-0.5 text-xs text-white"
                      />
                      <textarea 
                        rows={2} placeholder="Answer" value={faq.answer || faq.a || ''} 
                        onChange={e => updateFaqItem(idx, 'answer', e.target.value)}
                        className="w-full bg-zinc-950 border border-zinc-800 px-1.5 py-0.5 text-xs text-white resize-none"
                      />
                    </div>
                  ))}
                  {(formData.faqs || []).length === 0 && (
                    <div className="text-zinc-600 text-xs text-center">No post FAQs added yet.</div>
                  )}
                </div>
              </div>

              {/* Featured Image */}
              <div className="bg-zinc-900 border border-zinc-800">
                <div className="border-b border-zinc-800 px-3 py-2 text-white text-xs font-medium">Featured Image</div>
                <div className="p-3">
                  {formData.image && (
                    <img src={formData.image} alt="Preview" className="w-full h-32 object-cover mb-2 border border-zinc-800" />
                  )}
                  <label className="cursor-pointer text-red-500 hover:underline text-sm flex items-center gap-1">
                    <ImageIcon size={14} /> {formData.image ? 'Change image' : 'Set featured image'}
                    <input type="file" accept="image/*" onChange={handleImageUpload} className="hidden" />
                  </label>
                  {!formData.image && (
                    <input type="text" value={formData.image} onChange={e => setFormData({ ...formData, image: e.target.value })}
                      className="w-full mt-2 bg-zinc-950 border border-zinc-800 px-2 py-1 text-sm text-white focus:outline-none focus:border-red-500"
                      placeholder="Or enter URL..."
                    />
                  )}
                </div>
              </div>

              {/* SEO Box */}
              <div className="bg-zinc-900 border border-zinc-800">
                <div className="border-b border-zinc-800 px-3 py-2 text-white text-xs font-medium">SEO Settings</div>
                <div className="p-3 space-y-3">
                  <div>
                    <label className="text-xs text-zinc-500 block mb-1">Meta Title</label>
                    <input type="text" value={formData.meta_title} onChange={e => setFormData({ ...formData, meta_title: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 px-2 py-1 text-sm text-white focus:outline-none focus:border-red-500" />
                  </div>
                  <div>
                    <label className="text-xs text-zinc-500 block mb-1">Meta Description</label>
                    <textarea rows={3} value={formData.meta_description} onChange={e => setFormData({ ...formData, meta_description: e.target.value })}
                      className="w-full bg-zinc-950 border border-zinc-800 px-2 py-1 text-sm text-white focus:outline-none focus:border-red-500 resize-none" />
                  </div>
                </div>
              </div>
            </div>
          </div>
        </form>
      </div>
    );
  }

  // TABLE LIST VIEW (WordPress style)
  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-xl text-white font-normal">Posts</h1>
        <button 
          onClick={() => { setFormData({ id: '', title: '', slug: '', content: '', image: '', meta_title: '', meta_description: '' }); setIsEditing(true); }}
          className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white px-3 py-1 text-sm transition-colors"
        >
          Add Post
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex items-center justify-between mb-3 flex-wrap gap-2">
        <div className="flex items-center gap-2 text-sm">
          <span className="text-red-500">All ({blogs.length})</span>
          <span className="text-zinc-600">|</span>
          <span className="text-zinc-500 hover:text-white cursor-pointer">Published ({blogs.length})</span>
        </div>
        <div className="flex items-center gap-2">
          <input 
            type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            placeholder="Search Posts" 
            className="bg-zinc-900 border border-zinc-800 px-2 py-1 text-sm text-white focus:outline-none focus:border-red-500 w-40"
          />
          <button className="bg-zinc-800 border border-zinc-700 text-zinc-300 px-3 py-1 text-sm hover:text-white transition-colors">
            Search Posts
          </button>
        </div>
      </div>

      {/* Bulk actions */}
      <div className="flex items-center gap-2 mb-2 text-sm">
        <select className="bg-zinc-900 border border-zinc-800 text-zinc-400 px-2 py-1 text-sm focus:outline-none">
          <option>Bulk actions</option>
          <option>Delete</option>
        </select>
        <button onClick={handleBulkDelete} className="bg-zinc-800 border border-zinc-700 text-zinc-300 px-3 py-1 text-sm hover:text-white transition-colors">Apply</button>
        <span className="text-zinc-600 ml-auto">{filteredBlogs.length} item{filteredBlogs.length !== 1 ? 's' : ''}</span>
      </div>

      {/* Table */}
      <div className="border border-zinc-800 overflow-x-auto">
        <table className="w-full text-sm">
          <thead>
            <tr className="border-b border-zinc-800 bg-zinc-900/50">
              <th className="p-2 w-8 text-center">
                <input type="checkbox" checked={selected.length === filteredBlogs.length && filteredBlogs.length > 0} onChange={toggleAll} className="accent-red-500" />
              </th>
              <th className="p-2 text-left text-zinc-400 font-medium">Title ↕</th>
              <th className="p-2 text-left text-zinc-400 font-medium hidden md:table-cell">Slug</th>
              <th className="p-2 text-left text-zinc-400 font-medium hidden lg:table-cell">Image</th>
              <th className="p-2 text-left text-zinc-400 font-medium">Date ↕</th>
            </tr>
          </thead>
          <tbody>
            {filteredBlogs.length === 0 ? (
              <tr>
                <td colSpan={5} className="p-6 text-center text-zinc-500">No posts found.</td>
              </tr>
            ) : (
              filteredBlogs.map(blog => (
                <tr key={blog.id} className="border-b border-zinc-800/60 hover:bg-zinc-900/50 group">
                  <td className="p-2 text-center">
                    <input type="checkbox" checked={selected.includes(blog.id)} onChange={() => toggleSelect(blog.id)} className="accent-red-500" />
                  </td>
                  <td className="p-2">
                    <div>
                      <button onClick={() => { setFormData(blog); setIsEditing(true); }} className="text-white font-medium hover:text-red-500 transition-colors text-left">
                        {blog.title}
                      </button>
                      <div className="opacity-0 group-hover:opacity-100 transition-opacity flex gap-2 mt-1 text-xs">
                        <button onClick={() => { setFormData(blog); setIsEditing(true); }} className="text-red-500 hover:underline">Edit</button>
                        <span className="text-zinc-700">|</span>
                        <button onClick={() => handleDelete(blog.id)} className="text-red-400 hover:underline">Trash</button>
                        <span className="text-zinc-700">|</span>
                        <a href={`/blog/${blog.slug}`} target="_blank" className="text-zinc-500 hover:underline">View</a>
                      </div>
                    </div>
                  </td>
                  <td className="p-2 text-zinc-500 hidden md:table-cell">/{blog.slug}</td>
                  <td className="p-2 hidden lg:table-cell">
                    {blog.image ? (
                      <img src={blog.image} alt="" className="w-10 h-10 object-cover border border-zinc-800" />
                    ) : (
                      <span className="text-zinc-700">—</span>
                    )}
                  </td>
                  <td className="p-2 text-zinc-500">
                    <div>Published</div>
                    <div className="text-xs text-zinc-600">{new Date(blog.created_at).toLocaleDateString()}</div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

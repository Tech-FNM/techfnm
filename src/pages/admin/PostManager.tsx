import React, { useEffect, useState, useRef } from 'react';
import { Plus, Trash2, Edit2, ChevronLeft, MessageSquare } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { toast, Toaster } from 'react-hot-toast';

export default function PostManager() {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [selectedPost, setSelectedPost] = useState<any>(null);
  const [title, setTitle] = useState('');
  const [slug, setSlug] = useState('');
  const [image, setImage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [filterTab, setFilterTab] = useState('all');

  const quillRef = useRef<any>(null);
  const editorContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => { fetchPosts(); }, []);

  useEffect(() => {
    if (!isEditing || !editorContainerRef.current) return;

    const existingLink = document.getElementById('quill-cdn-css');
    if (!existingLink) {
      const link = document.createElement('link');
      link.id = 'quill-cdn-css';
      link.rel = 'stylesheet';
      link.href = 'https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.snow.css';
      document.head.appendChild(link);
    }

    if (!(window as any).Quill) {
      const existingScript = document.getElementById('quill-cdn-js');
      if (!existingScript) {
        const script = document.createElement('script');
        script.id = 'quill-cdn-js';
        script.src = 'https://cdn.jsdelivr.net/npm/quill@2.0.2/dist/quill.js';
        script.onload = () => initQuill();
        document.body.appendChild(script);
      }
    } else {
      initQuill();
    }

    function initQuill() {
      if (!editorContainerRef.current) return;
      editorContainerRef.current.innerHTML = '';
      quillRef.current = new (window as any).Quill(editorContainerRef.current, {
        theme: 'snow',
        placeholder: 'Write your premium post content here...',
        modules: {
          toolbar: [
            [{ header: [1, 2, 3, false] }],
            ['bold', 'italic', 'underline', 'strike'],
            ['blockquote', 'code-block'],
            [{ list: 'ordered' }, { list: 'bullet' }],
            ['link', 'image'],
            ['clean']
          ]
        }
      });
      if (selectedPost && selectedPost.content) {
        quillRef.current.root.innerHTML = selectedPost.content;
      }
    }

    return () => { quillRef.current = null; };
  }, [isEditing, selectedPost]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const { data } = await supabase.from('blogs').select('*').order('created_at', { ascending: false });
      if (data && data.length > 0) {
        setPosts(data);
      } else {
        setPosts([
          { id: 1, title: 'How We Build Scalable Apps', slug: 'how-we-build-scalable-apps', image: 'https://images.unsplash.com/photo-1661956602116-aa6865609028?auto=format&fit=crop&q=80&w=800', content: '<p>Standard development workflows involve agile pipelines...</p>', status: 'published', author: 'admin', category: 'Development', tags: 'tech, apps', comments_count: 1, created_at: new Date('2026-08-22T17:28:00').toISOString() },
          { id: 2, title: 'SEO Best Practices for NextJS', slug: 'seo-best-practices-nextjs', image: 'https://images.unsplash.com/photo-1460925895917-afdab827c52f?auto=format&fit=crop&q=80&w=800', content: '<p>NextJS requires server-side rendering configurations...</p>', status: 'draft', author: 'admin', category: 'SEO', tags: 'google, ranking', comments_count: 0, created_at: new Date('2026-08-22T17:01:00').toISOString() }
        ]);
      }
    } catch (err) { console.error(err); } finally { setLoading(false); }
  };

  const handleEdit = (post: any) => {
    setSelectedPost(post);
    setTitle(post.title || '');
    setSlug(post.slug || '');
    setImage(post.image || '');
    setIsEditing(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    const editorContent = quillRef.current ? quillRef.current.root.innerHTML : '';
    try {
      const payload = {
        title,
        slug: slug || title.toLowerCase().replace(/[^a-z0-9]+/g, '-'),
        image,
        content: editorContent,
        status: selectedPost?.status || 'published',
        author: 'admin',
        category: selectedPost?.category || 'Uncategorized',
        tags: selectedPost?.tags || '—',
        comments_count: selectedPost?.comments_count || 0
      };

      if (selectedPost) {
        const { error } = await supabase.from('blogs').update(payload).eq('id', selectedPost.id);
        if (error) setPosts(posts.map(p => p.id === selectedPost.id ? { ...p, ...payload } : p));
        else fetchPosts();
        toast.success('Post updated successfully');
      } else {
        const { error } = await supabase.from('blogs').insert([payload]);
        if (error) setPosts([{ id: Date.now(), ...payload, created_at: new Date().toISOString() }, ...posts]);
        else fetchPosts();
        toast.success('New blog post published');
      }
      setIsEditing(false);
      setSelectedPost(null);
    } catch (err: any) { toast.error(err.message || 'Error saving post'); }
  };

  const handleDelete = async (id: any) => {
    if (!window.confirm('Are you sure you want to delete this post?')) return;
    try {
      const { error } = await supabase.from('blogs').delete().eq('id', id);
      if (error) setPosts(posts.filter(p => p.id !== id));
      else fetchPosts();
      toast.success('Post deleted successfully');
    } catch (err: any) { toast.error(err.message || 'Error deleting post'); }
  };

  const getFilteredPosts = () => {
    let result = posts;
    if (filterTab === 'published') result = posts.filter(p => p.status === 'published' || !p.status);
    else if (filterTab === 'draft') result = posts.filter(p => p.status === 'draft');
    if (searchQuery) result = result.filter(p => p.title.toLowerCase().includes(searchQuery.toLowerCase()));
    return result;
  };

  const filteredPosts = getFilteredPosts();
  const allCount = posts.length;
  const publishedCount = posts.filter(p => p.status === 'published' || !p.status).length;
  const draftCount = posts.filter(p => p.status === 'draft').length;

  return (
    <div className="space-y-6 font-sans">
      <Toaster position="top-right" toastOptions={{ style: { background: '#18181b', color: '#fff' } }} />

      {isEditing ? (
        /* ===== WORDPRESS-STYLE EDITOR ===== */
        <form onSubmit={handleSave} className="space-y-0">
          {/* Top bar */}
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-xl font-bold text-white">
              {selectedPost ? 'Edit Post' : 'Add New Post'}
            </h2>
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex items-center gap-1.5 text-zinc-400 hover:text-white transition-colors text-xs font-semibold"
            >
              <ChevronLeft size={16} /> Back to list
            </button>
          </div>

          {/* Two-column layout */}
          <div className="flex flex-col xl:flex-row gap-6 items-start">

            {/* LEFT: Main editor area */}
            <div className="flex-grow space-y-4 min-w-0">

              {/* Big title input */}
              <input
                type="text"
                required
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter title here"
                className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-600/40 rounded-xl px-5 py-4 text-zinc-100 placeholder-zinc-600 outline-none text-xl font-medium transition-all"
              />

              {/* Permalink / slug row */}
              <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 bg-zinc-900 border border-zinc-850 rounded-xl px-5 py-2.5">
                <span className="text-zinc-600 font-medium">Permalink:</span>
                <span>/blog/</span>
                <input
                  type="text"
                  value={slug}
                  onChange={(e) => setSlug(e.target.value)}
                  placeholder="post-slug"
                  className="bg-transparent outline-none text-red-400 font-mono min-w-0 flex-grow"
                />
              </div>

              {/* Quill Rich Text Editor */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-xl overflow-hidden">
                <div className="px-4 py-2 border-b border-zinc-800 flex items-center gap-4 text-xs">
                  <span className="font-bold text-zinc-300">Visual</span>
                  <span className="text-zinc-600">Text</span>
                </div>
                <div ref={editorContainerRef} className="min-h-[380px]" />
              </div>

            </div>

            {/* RIGHT: Sidebar panels */}
            <div className="w-full xl:w-72 shrink-0 space-y-4">

              {/* ── Publish Panel ── */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="px-5 py-3 bg-zinc-950 border-b border-zinc-800">
                  <span className="font-bold text-white text-sm">Publish</span>
                </div>

                {/* Save Draft / Preview */}
                <div className="p-4 border-b border-zinc-850 flex gap-2">
                  <button
                    type="button"
                    className="flex-grow bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold py-2 px-3 rounded-lg transition-all"
                  >
                    Save Draft
                  </button>
                  <button
                    type="button"
                    className="flex-grow bg-zinc-950 border border-zinc-800 hover:bg-zinc-800 text-zinc-300 text-xs font-semibold py-2 px-3 rounded-lg transition-all"
                  >
                    Preview
                  </button>
                </div>

                {/* Meta info */}
                <div className="p-4 space-y-2.5 text-xs border-b border-zinc-850">
                  <div className="flex items-center gap-2 text-zinc-400">
                    <span>●</span>
                    <span>
                      <strong className="text-zinc-300">Status:</strong>{' '}
                      {selectedPost?.status === 'draft' ? 'Draft' : 'Published'}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <span>◎</span>
                    <span><strong className="text-zinc-300">Visibility:</strong> Public</span>
                  </div>
                  <div className="flex items-center gap-2 text-zinc-400">
                    <span>▦</span>
                    <span><strong className="text-zinc-300">Publish:</strong> Immediately</span>
                  </div>
                </div>

                {/* Actions */}
                <div className="p-4 flex items-center justify-between">
                  <button
                    type="button"
                    onClick={() => { if (selectedPost) handleDelete(selectedPost.id); setIsEditing(false); }}
                    className="text-xs text-red-500 hover:text-red-400 transition-colors"
                  >
                    Move to Trash
                  </button>
                  <button
                    type="submit"
                    className="bg-red-600 hover:bg-red-700 text-white font-bold px-5 py-2 rounded-lg transition-all text-sm shadow-lg shadow-red-950/20"
                  >
                    Publish
                  </button>
                </div>
              </div>

              {/* ── Featured Image Panel ── */}
              <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden">
                <div className="px-5 py-3 bg-zinc-950 border-b border-zinc-800 flex items-center justify-between">
                  <span className="font-bold text-white text-sm">Featured Image</span>
                  <span className="text-zinc-600 text-lg">∧</span>
                </div>
                <div className="p-4 space-y-3">
                  {image ? (
                    <div className="space-y-3">
                      <img
                        src={image}
                        alt="Featured"
                        className="w-full h-44 object-cover rounded-xl border border-zinc-800"
                        onError={(e) => { (e.target as HTMLImageElement).style.display = 'none'; }}
                      />
                      <button
                        type="button"
                        onClick={() => setImage('')}
                        className="w-full text-xs text-red-500 hover:text-red-400 transition-colors text-center block"
                      >
                        Remove featured image
                      </button>
                    </div>
                  ) : (
                    <div className="w-full bg-zinc-800/50 rounded-xl flex items-center justify-center h-36">
                      <span className="text-sm text-zinc-400 font-medium">Set featured image</span>
                    </div>
                  )}
                  {/* URL input hidden behind Select Image button style */}
                  <label className="cursor-pointer inline-block">
                    <span className="inline-flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white text-xs font-bold px-4 py-2 rounded-lg transition-all">
                      Select Image
                    </span>
                    <input
                      type="text"
                      value={image}
                      onChange={(e) => setImage(e.target.value)}
                      placeholder="Paste image URL here..."
                      className="mt-2 w-full bg-zinc-950 border border-zinc-850 focus:border-red-600/40 rounded-xl px-3 py-2.5 text-zinc-300 placeholder-zinc-600 outline-none text-xs transition-all block"
                    />
                  </label>
                </div>
              </div>

            </div>
          </div>
        </form>

      ) : (
        /* ===== WORDPRESS-STYLE TABLE LIST ===== */
        <div className="space-y-4">

          {/* Header */}
          <div className="flex items-center gap-4">
            <h2 className="text-2xl font-semibold text-white tracking-tight">Posts</h2>
            <button
              onClick={() => { setSelectedPost(null); setTitle(''); setSlug(''); setImage(''); setIsEditing(true); }}
              className="border border-red-600/40 hover:bg-red-950/20 text-red-500 px-3 py-1 text-xs rounded font-bold transition-all"
            >
              Add New
            </button>
          </div>

          {/* Status filter tabs */}
          <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 text-xs">
            <div className="flex items-center gap-2 text-zinc-500 font-medium">
              {[['all', `All (${allCount})`], ['published', `Published (${publishedCount})`], ['draft', `Draft (${draftCount})`]].map(([key, label]) => (
                <React.Fragment key={key}>
                  {key !== 'all' && <span>|</span>}
                  <button
                    onClick={() => setFilterTab(key)}
                    className={`transition-colors ${filterTab === key ? 'text-red-500 font-bold' : 'hover:text-red-400'}`}
                  >
                    {label}
                  </button>
                </React.Fragment>
              ))}
            </div>
            <div className="flex items-center gap-2 w-full sm:w-auto">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search Posts..."
                className="bg-zinc-900 border border-zinc-800 focus:border-red-600/40 rounded px-3 py-1.5 text-xs text-zinc-300 outline-none w-full sm:w-48"
              />
              <button className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 px-3 py-1.5 text-xs rounded font-semibold transition-all">
                Search Posts
              </button>
            </div>
          </div>

          {/* Filter bar */}
          <div className="flex flex-wrap items-center gap-2 text-xs">
            <select className="bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-400 outline-none">
              <option>Bulk actions</option>
              <option>Edit</option>
              <option>Move to Trash</option>
            </select>
            <button className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 px-3 py-1.5 rounded font-semibold transition-all">Apply</button>
            <select className="bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-400 outline-none">
              <option>All dates</option>
            </select>
            <select className="bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-400 outline-none">
              <option>All Categories</option>
            </select>
            <button className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 px-3 py-1.5 rounded font-semibold transition-all">Filter</button>
          </div>

          {/* Table */}
          <div className="bg-zinc-900 border border-zinc-800 rounded-2xl overflow-hidden shadow-xl">
            <table className="w-full text-left text-xs text-zinc-400">
              <thead className="bg-zinc-950 text-zinc-500 font-bold border-b border-zinc-850 select-none">
                <tr>
                  <th className="w-10 px-4 py-3 text-center">
                    <input type="checkbox" className="rounded bg-zinc-950 border-zinc-800 accent-red-600" />
                  </th>
                  <th className="px-6 py-3">Title</th>
                  <th className="px-6 py-3">Author</th>
                  <th className="px-6 py-3">Categories</th>
                  <th className="px-6 py-3">Tags</th>
                  <th className="px-6 py-3 text-center"><MessageSquare size={14} className="mx-auto" /></th>
                  <th className="px-6 py-3">Date</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-850">
                {loading ? (
                  <tr><td colSpan={7} className="text-center py-10 font-mono text-zinc-600">Loading posts...</td></tr>
                ) : filteredPosts.length === 0 ? (
                  <tr><td colSpan={7} className="text-center py-10 text-zinc-500">No posts found.</td></tr>
                ) : (
                  filteredPosts.map((post) => (
                    <tr key={post.id} className="hover:bg-zinc-850/15 group transition-colors">
                      <td className="px-4 py-4 text-center">
                        <input type="checkbox" className="rounded bg-zinc-950 border-zinc-800 accent-red-600" />
                      </td>
                      <td className="px-6 py-4">
                        <div className="space-y-1">
                          <button
                            onClick={() => handleEdit(post)}
                            className="text-red-500 hover:text-red-400 text-sm font-bold block text-left"
                          >
                            {post.title}
                            {post.status === 'draft' && <span className="text-[10px] text-zinc-500 font-normal italic ml-1">— Draft</span>}
                          </button>
                          <div className="opacity-0 group-hover:opacity-100 flex items-center gap-2.5 text-[10px] text-zinc-500 transition-opacity">
                            <button onClick={() => handleEdit(post)} className="hover:text-red-500">Edit</button>
                            <span>|</span>
                            <button className="hover:text-red-500">Quick Edit</button>
                            <span>|</span>
                            <button onClick={() => handleDelete(post.id)} className="hover:text-red-500">Trash</button>
                            <span>|</span>
                            <a href={`/blog/${post.slug}`} target="_blank" rel="noreferrer" className="hover:text-red-500">View</a>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">{post.author || 'admin'}</td>
                      <td className="px-6 py-4">{post.category || 'Uncategorized'}</td>
                      <td className="px-6 py-4 text-zinc-500">{post.tags || '—'}</td>
                      <td className="px-6 py-4 text-center">
                        <span className="inline-block bg-zinc-950 px-2 py-0.5 rounded-full text-[10px] font-bold text-zinc-500 border border-zinc-850">
                          {post.comments_count || 0}
                        </span>
                      </td>
                      <td className="px-6 py-4 leading-relaxed">
                        {post.status === 'draft' ? 'Last Modified' : 'Published'}<br />
                        <span className="text-zinc-500">
                          {new Date(post.created_at).toLocaleDateString()} at {new Date(post.created_at).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>

          {/* Footer */}
          <div className="flex items-center gap-2 text-xs">
            <select className="bg-zinc-900 border border-zinc-800 rounded px-2.5 py-1.5 text-zinc-400 outline-none">
              <option>Bulk actions</option>
              <option>Edit</option>
              <option>Move to Trash</option>
            </select>
            <button className="bg-zinc-900 border border-zinc-800 hover:border-zinc-700 text-zinc-300 px-3 py-1.5 rounded font-semibold transition-all">Apply</button>
            <span className="text-zinc-500 text-xs ml-auto">{filteredPosts.length} items</span>
          </div>

        </div>
      )}
    </div>
  );
}

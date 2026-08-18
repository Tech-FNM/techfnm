import { useState, useEffect } from 'react';
import { supabase } from '../../lib/supabase';
import { Upload, X, Grid, List, Search, Trash2, Copy, ExternalLink } from 'lucide-react';

export default function MediaManager() {
  const [files, setFiles] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isDragging, setIsDragging] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [selectedFile, setSelectedFile] = useState<any>(null);
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchFiles();
  }, []);

  const fetchFiles = async () => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase.storage.from('agency-assets').list('media', {
        limit: 100,
        sortBy: { column: 'created_at', order: 'desc' }
      });
      if (data) {
        const filesWithUrls = data.filter(f => f.name !== '.emptyFolderPlaceholder').map(f => ({
          ...f,
          url: supabase.storage.from('agency-assets').getPublicUrl(`media/${f.name}`).data.publicUrl
        }));
        setFiles(filesWithUrls);
      }
    } catch (err) {
      console.error(err);
    }
    setIsLoading(false);
  };

  const handleUpload = async (fileList: FileList) => {
    setUploading(true);
    for (const file of Array.from(fileList)) {
      const fileExt = file.name.split('.').pop();
      const fileName = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${fileExt}`;
      const filePath = `media/${fileName}`;
      
      const { error } = await supabase.storage.from('agency-assets').upload(filePath, file);
      if (error) {
        alert(`Error uploading ${file.name}`);
        console.error(error);
      }
    }
    setUploading(false);
    fetchFiles();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files);
    }
  };

  const handleDelete = async (name: string) => {
    if (!confirm('Delete this file permanently?')) return;
    const { error } = await supabase.storage.from('agency-assets').remove([`media/${name}`]);
    if (!error) {
      setSelectedFile(null);
      fetchFiles();
    }
  };

  const copyUrl = (url: string) => {
    navigator.clipboard.writeText(url);
    alert('URL copied to clipboard!');
  };

  const filteredFiles = files.filter(f => f.name.toLowerCase().includes(searchTerm.toLowerCase()));

  return (
    <div className="p-4 md:p-6">
      <div className="flex items-center gap-3 mb-4">
        <h1 className="text-xl text-white font-normal">Media Library</h1>
        <label className="bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white px-3 py-1 text-sm cursor-pointer transition-colors">
          Add Media File
          <input type="file" multiple accept="image/*,video/*" onChange={e => e.target.files && handleUpload(e.target.files)} className="hidden" />
        </label>
      </div>

      {/* Drop Zone */}
      <div
        onDragOver={e => { e.preventDefault(); setIsDragging(true); }}
        onDragLeave={() => setIsDragging(false)}
        onDrop={handleDrop}
        className={`border-2 border-dashed rounded-sm p-8 text-center mb-6 transition-colors ${
          isDragging ? 'border-red-500 bg-red-500/5' : 'border-zinc-800 bg-zinc-900/30'
        }`}
      >
        <Upload className="mx-auto mb-3 text-zinc-600" size={36} />
        <p className="text-zinc-400 text-lg">Drop files to upload</p>
        <p className="text-zinc-600 text-sm mt-1">or</p>
        <label className="inline-block mt-3 bg-zinc-800 hover:bg-zinc-700 border border-zinc-700 text-white px-4 py-2 text-sm cursor-pointer transition-colors">
          Select Files
          <input type="file" multiple accept="image/*,video/*" onChange={e => e.target.files && handleUpload(e.target.files)} className="hidden" />
        </label>
        <p className="text-zinc-700 text-xs mt-3">Maximum upload file size: 60 MB.</p>
      </div>

      {uploading && (
        <div className="mb-4 bg-zinc-900 border border-zinc-800 p-3 text-sm text-zinc-400 flex items-center gap-2">
          <div className="w-4 h-4 border-2 border-red-500/30 border-t-red-500 rounded-full animate-spin" />
          Uploading files...
        </div>
      )}

      {/* Toolbar */}
      <div className="flex items-center justify-between mb-4 flex-wrap gap-2">
        <div className="flex items-center gap-2">
          <button onClick={() => setViewMode('grid')} className={`p-1.5 border ${viewMode === 'grid' ? 'border-red-500 text-red-500' : 'border-zinc-800 text-zinc-500 hover:text-white'}`}>
            <Grid size={16} />
          </button>
          <button onClick={() => setViewMode('list')} className={`p-1.5 border ${viewMode === 'list' ? 'border-red-500 text-red-500' : 'border-zinc-800 text-zinc-500 hover:text-white'}`}>
            <List size={16} />
          </button>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-zinc-600 text-sm">Search media:</span>
          <input 
            type="text" value={searchTerm} onChange={e => setSearchTerm(e.target.value)}
            className="bg-zinc-900 border border-zinc-800 px-2 py-1 text-sm text-white focus:outline-none focus:border-red-500 w-40"
          />
        </div>
      </div>

      {isLoading ? (
        <div className="text-center py-12 text-zinc-500">Loading media...</div>
      ) : filteredFiles.length === 0 ? (
        <div className="text-center py-12 text-zinc-500">No media files found. Upload some files above.</div>
      ) : (
        <>
          {/* Grid View */}
          {viewMode === 'grid' && (
            <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 lg:grid-cols-6 gap-2">
              {filteredFiles.map(file => (
                <button
                  key={file.name}
                  onClick={() => setSelectedFile(file)}
                  className={`aspect-square bg-zinc-900 border-2 overflow-hidden group relative transition-colors ${
                    selectedFile?.name === file.name ? 'border-red-500' : 'border-zinc-800 hover:border-zinc-700'
                  }`}
                >
                  <img src={file.url} alt={file.name} className="w-full h-full object-cover" 
                    onError={(e) => { (e.target as HTMLImageElement).src = ''; (e.target as HTMLImageElement).alt = file.name; }}
                  />
                  {selectedFile?.name === file.name && (
                    <div className="absolute top-1 right-1 w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs">✓</span>
                    </div>
                  )}
                </button>
              ))}
            </div>
          )}

          {/* List View */}
          {viewMode === 'list' && (
            <div className="border border-zinc-800">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-zinc-800 bg-zinc-900/50">
                    <th className="p-2 text-left text-zinc-400 font-medium">File</th>
                    <th className="p-2 text-left text-zinc-400 font-medium hidden md:table-cell">Name</th>
                    <th className="p-2 text-left text-zinc-400 font-medium hidden lg:table-cell">Date</th>
                    <th className="p-2 text-right text-zinc-400 font-medium">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredFiles.map(file => (
                    <tr key={file.name} className="border-b border-zinc-800/60 hover:bg-zinc-900/50">
                      <td className="p-2">
                        <img src={file.url} alt="" className="w-12 h-12 object-cover border border-zinc-800" />
                      </td>
                      <td className="p-2 text-zinc-300 hidden md:table-cell">{file.name}</td>
                      <td className="p-2 text-zinc-500 hidden lg:table-cell">{file.created_at ? new Date(file.created_at).toLocaleDateString() : '—'}</td>
                      <td className="p-2 text-right">
                        <button onClick={() => setSelectedFile(file)} className="text-red-500 hover:underline text-xs mr-3">Details</button>
                        <button onClick={() => handleDelete(file.name)} className="text-red-400 hover:underline text-xs">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}

      <p className="text-zinc-600 text-sm text-center mt-4">Showing {filteredFiles.length} of {files.length} media items</p>

      {/* Attachment Details Modal */}
      {selectedFile && (
        <div className="fixed inset-0 bg-black/80 z-50 flex items-center justify-center p-4">
          <div className="bg-zinc-900 border border-zinc-800 max-w-4xl w-full max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
              <h2 className="text-white font-medium">Attachment details</h2>
              <button onClick={() => setSelectedFile(null)} className="text-zinc-400 hover:text-white">
                <X size={20} />
              </button>
            </div>
            <div className="flex flex-col md:flex-row">
              {/* Image Preview */}
              <div className="md:w-1/2 p-6 flex items-center justify-center bg-zinc-950">
                <img src={selectedFile.url} alt={selectedFile.name} className="max-w-full max-h-[50vh] object-contain" />
              </div>
              {/* Details */}
              <div className="md:w-1/2 p-6 space-y-4 text-sm">
                <div className="text-zinc-400 space-y-1">
                  <p><span className="text-zinc-500">File name:</span> {selectedFile.name}</p>
                  <p><span className="text-zinc-500">File type:</span> image</p>
                </div>

                <div className="space-y-3 pt-4 border-t border-zinc-800">
                  <div>
                    <label className="text-zinc-500 block mb-1">Title</label>
                    <input type="text" defaultValue={selectedFile.name.split('.')[0]} className="w-full bg-zinc-950 border border-zinc-800 px-2 py-1 text-white focus:outline-none focus:border-red-500" />
                  </div>
                  <div>
                    <label className="text-zinc-500 block mb-1">File URL</label>
                    <div className="flex gap-2">
                      <input type="text" readOnly value={selectedFile.url} className="flex-1 bg-zinc-950 border border-zinc-800 px-2 py-1 text-zinc-400 text-xs focus:outline-none" />
                      <button onClick={() => copyUrl(selectedFile.url)} className="bg-zinc-800 border border-zinc-700 text-zinc-300 px-2 py-1 text-xs hover:text-white flex items-center gap-1">
                        <Copy size={12} /> Copy
                      </button>
                    </div>
                  </div>
                </div>

                <div className="flex gap-3 pt-4 border-t border-zinc-800 text-xs">
                  <a href={selectedFile.url} target="_blank" className="text-red-500 hover:underline flex items-center gap-1"><ExternalLink size={12} /> View file</a>
                  <button onClick={() => handleDelete(selectedFile.name)} className="text-red-400 hover:underline flex items-center gap-1"><Trash2 size={12} /> Delete permanently</button>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

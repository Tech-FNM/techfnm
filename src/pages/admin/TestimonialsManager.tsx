import { useEffect, useState } from 'react';
import { Plus, Trash, Edit, Check, X, Quote } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function TestimonialsManager() {
  const [testimonials, setTestimonials] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentTestimonial, setCurrentTestimonial] = useState<any>({
    name: '',
    role: '',
    content: '',
    image: '',
  });

  useEffect(() => {
    fetchTestimonials();
  }, []);

  const fetchTestimonials = async () => {
    try {
      const { data, error } = await supabase.from('testimonials').select('*');
      if (data) {
        setTestimonials(data);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  const handleSave = async () => {
    if (!currentTestimonial.name || !currentTestimonial.role || !currentTestimonial.content) {
      alert('Please fill in Name, Role, and Content');
      return;
    }

    try {
      let error;
      const payload = {
        name: currentTestimonial.name,
        role: currentTestimonial.role,
        content: currentTestimonial.content,
        image: currentTestimonial.image
      };

      if (isEditing) {
        const { error: updateError } = await supabase.from('testimonials').update(payload).eq('id', currentTestimonial.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from('testimonials').insert([payload]);
        error = insertError;
      }
      
      if (error) {
        console.error('Supabase error:', error);
        alert(`Error saving testimonial: ${error.message}`);
      } else {
        alert(isEditing ? 'Testimonial updated successfully!' : 'Testimonial added successfully!');
        setIsEditing(false);
        setCurrentTestimonial({ name: '', role: '', content: '', image: '' });
        fetchTestimonials();
      }
    } catch (error: any) {
      console.error('Error saving testimonial:', error);
      alert('An unexpected error occurred. Check the console for details.');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      try {
        const { error } = await supabase.from('testimonials').delete().eq('id', id);
        if (!error) {
          fetchTestimonials();
        }
      } catch (error) {
        console.error('Error deleting testimonial:', error);
      }
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Manage Testimonials</h1>

      {/* Form Section */}
      <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 mb-12 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          {isEditing ? <Edit size={20} className="text-blue-500" /> : <Plus size={20} className="text-red-500" />}
          {isEditing ? 'Edit Testimonial' : 'Add New Testimonial'}
        </h2>
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Client Name</label>
              <input
                type="text"
                placeholder="e.g. Sarah Johnson"
                value={currentTestimonial.name}
                onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, name: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Role / Company</label>
              <input
                type="text"
                placeholder="e.g. CEO, TechCorp"
                value={currentTestimonial.role}
                onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, role: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Client Photo URL (Optional)</label>
              <input
                type="text"
                placeholder="https://example.com/photo.jpg"
                value={currentTestimonial.image}
                onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, image: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
              />
              {currentTestimonial.image && (
                <div className="mt-4 w-16 h-16 rounded-full overflow-hidden border border-zinc-700 bg-zinc-800 flex items-center justify-center">
                  <img src={currentTestimonial.image} alt="Preview" className="w-full h-full object-cover" />
                </div>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-400 mb-1">Testimonial Content</label>
              <textarea
                placeholder="What did the client say?"
                rows={3}
                value={currentTestimonial.content}
                onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, content: e.target.value })}
                className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all resize-none"
              />
            </div>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button 
            onClick={handleSave} 
            className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
          >
            <Check size={20} /> {isEditing ? 'Update Testimonial' : 'Add Testimonial'}
          </button>
          {isEditing && (
            <button 
              onClick={() => { setIsEditing(false); setCurrentTestimonial({ name: '', role: '', content: '', image: '' }); }} 
              className="bg-zinc-800 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-700 transition-all"
            >
              <X size={20} /> Cancel
            </button>
          )}
        </div>
      </div>

      {/* List Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white mb-4">Client Feedback</h2>
        <div className="grid grid-cols-1 gap-4">
          {testimonials.length === 0 ? (
            <div className="text-center py-12 bg-zinc-900 rounded-2xl border border-zinc-800 text-gray-500">
              No testimonials found. Add your first testimonial above.
            </div>
          ) : (
            testimonials.map((testimonial) => (
              <div key={testimonial.id} className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 flex flex-col md:flex-row md:items-center justify-between gap-6 group hover:border-zinc-700 transition-all">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-zinc-800 flex-shrink-0 flex items-center justify-center overflow-hidden border border-zinc-700">
                    {testimonial.image ? (
                      <img src={testimonial.image} alt="" className="w-full h-full object-cover" />
                    ) : (
                      <Quote className="text-zinc-600" size={20} />
                    )}
                  </div>
                  <div>
                    <h3 className="text-white font-bold">{testimonial.name}</h3>
                    <p className="text-red-500 text-xs font-semibold uppercase mb-2">{testimonial.role}</p>
                    <p className="text-gray-400 text-sm italic">"{testimonial.content}"</p>
                  </div>
                </div>
                
                <div className="flex gap-2 self-end md:self-center">
                  <button 
                    onClick={() => { setIsEditing(true); setCurrentTestimonial(testimonial); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                    className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                    title="Edit"
                  >
                    <Edit size={18} />
                  </button>
                  <button 
                    onClick={() => handleDelete(testimonial.id)} 
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                    title="Delete"
                  >
                    <Trash size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

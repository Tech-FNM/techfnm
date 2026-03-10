import { useEffect, useState } from 'react';
import { Plus, Trash, Edit, Check, X } from 'lucide-react';
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
      const response = await fetch('/api/testimonials');
      if (response.ok) {
        const data = await response.json();
        setTestimonials(data);
      }
    } catch (error) {
      console.error('Error fetching testimonials:', error);
    }
  };

  const handleSave = async () => {
    try {
      const method = isEditing ? 'PUT' : 'POST';
      const url = isEditing ? `/api/testimonials/${currentTestimonial.id}` : '/api/testimonials';
      
      const response = await fetch(url, {
        method,
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(currentTestimonial),
      });

      if (response.ok) {
        setIsEditing(false);
        setCurrentTestimonial({ name: '', role: '', content: '', image: '' });
        fetchTestimonials();
      }
    } catch (error) {
      console.error('Error saving testimonial:', error);
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      try {
        const response = await fetch(`/api/testimonials/${id}`, { method: 'DELETE' });
        if (response.ok) {
          fetchTestimonials();
        }
      } catch (error) {
        console.error('Error deleting testimonial:', error);
      }
    }
  };

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-white mb-8">Manage Testimonials</h1>

      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 mb-8">
        <h2 className="text-xl font-bold text-white mb-4">{isEditing ? 'Edit Testimonial' : 'Add New Testimonial'}</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <input
            type="text"
            placeholder="Name"
            value={currentTestimonial.name}
            onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, name: e.target.value })}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
          />
          <input
            type="text"
            placeholder="Role"
            value={currentTestimonial.role}
            onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, role: e.target.value })}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white"
          />
          <input
            type="text"
            placeholder="Image URL"
            value={currentTestimonial.image}
            onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, image: e.target.value })}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white col-span-2"
          />
          <textarea
            placeholder="Content"
            value={currentTestimonial.content}
            onChange={(e) => setCurrentTestimonial({ ...currentTestimonial, content: e.target.value })}
            className="bg-zinc-800 border border-zinc-700 rounded-lg px-4 py-2 text-white col-span-2"
          />
        </div>
        <div className="mt-4 flex gap-2">
          <button onClick={handleSave} className="bg-red-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-red-700">
            <Check size={18} /> Save
          </button>
          {isEditing && (
            <button onClick={() => { setIsEditing(false); setCurrentTestimonial({ name: '', role: '', content: '', image: '' }); }} className="bg-gray-600 text-white px-4 py-2 rounded-lg flex items-center gap-2 hover:bg-gray-700">
              <X size={18} /> Cancel
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {testimonials.map((testimonial) => (
          <div key={testimonial.id} className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 relative group">
            <div className="flex items-center gap-4 mb-4">
              <img src={testimonial.image} alt={testimonial.name} className="w-12 h-12 rounded-full object-cover" />
              <div>
                <h3 className="text-lg font-bold text-white">{testimonial.name}</h3>
                <p className="text-gray-400 text-sm">{testimonial.role}</p>
              </div>
            </div>
            <p className="text-gray-400 italic">"{testimonial.content}"</p>
            <div className="flex gap-2 absolute top-4 right-4 opacity-0 group-hover:opacity-100 transition-opacity">
              <button onClick={() => { setIsEditing(true); setCurrentTestimonial(testimonial); }} className="bg-blue-600 p-2 rounded-lg text-white hover:bg-blue-700">
                <Edit size={16} />
              </button>
              <button onClick={() => handleDelete(testimonial.id)} className="bg-red-600 p-2 rounded-lg text-white hover:bg-red-700">
                <Trash size={16} />
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

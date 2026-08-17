import { useEffect, useState } from 'react';
import { Plus, Trash, Edit, Check, X, HelpCircle } from 'lucide-react';
import { supabase } from '../../lib/supabase';

export default function FAQManager() {
  const [faqs, setFaqs] = useState<any[]>([]);
  const [isEditing, setIsEditing] = useState(false);
  const [currentFaq, setCurrentFaq] = useState<any>({
    question: '',
    answer: '',
    category: 'General',
  });

  useEffect(() => {
    fetchFaqs();
  }, []);

  const fetchFaqs = async () => {
    try {
      const { data, error } = await supabase.from('faqs').select('*').order('created_at', { ascending: true });
      if (data) {
        setFaqs(data);
      }
    } catch (error) {
      console.error('Error fetching FAQs:', error);
    }
  };

  const handleSave = async () => {
    if (!currentFaq.question || !currentFaq.answer) {
      alert('Please fill in both Question and Answer');
      return;
    }

    try {
      let error;
      const payload = {
        question: currentFaq.question,
        answer: currentFaq.answer,
        category: currentFaq.category,
      };

      if (isEditing) {
        const { error: updateError } = await supabase.from('faqs').update(payload).eq('id', currentFaq.id);
        error = updateError;
      } else {
        const { error: insertError } = await supabase.from('faqs').insert([payload]);
        error = insertError;
      }
      
      if (error) {
        console.error('Supabase error:', error);
        alert(`Error saving FAQ: ${error.message}`);
      } else {
        alert(isEditing ? 'FAQ updated successfully!' : 'FAQ added successfully!');
        setIsEditing(false);
        setCurrentFaq({ question: '', answer: '', category: 'General' });
        fetchFaqs();
      }
    } catch (error: any) {
      console.error('Error saving FAQ:', error);
      alert('An unexpected error occurred.');
    }
  };

  const handleDelete = async (id: number) => {
    if (confirm('Are you sure?')) {
      try {
        const { error } = await supabase.from('faqs').delete().eq('id', id);
        if (!error) {
          fetchFaqs();
        }
      } catch (error) {
        console.error('Error deleting FAQ:', error);
      }
    }
  };

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold text-white mb-8">Manage FAQs</h1>

      {/* Form Section */}
      <div className="bg-zinc-900 p-8 rounded-2xl border border-zinc-800 mb-12 shadow-xl">
        <h2 className="text-xl font-bold text-white mb-6 flex items-center gap-2">
          {isEditing ? <Edit size={20} className="text-blue-500" /> : <Plus size={20} className="text-red-500" />}
          {isEditing ? 'Edit FAQ' : 'Add New FAQ'}
        </h2>
        
        <div className="space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Question</label>
            <input
              type="text"
              placeholder="e.g. What services do you offer?"
              value={currentFaq.question}
              onChange={(e) => setCurrentFaq({ ...currentFaq, question: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Answer</label>
            <textarea
              placeholder="Provide a detailed answer..."
              rows={4}
              value={currentFaq.answer}
              onChange={(e) => setCurrentFaq({ ...currentFaq, answer: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all resize-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-400 mb-1">Category</label>
            <select
              value={currentFaq.category}
              onChange={(e) => setCurrentFaq({ ...currentFaq, category: e.target.value })}
              className="w-full bg-zinc-800 border border-zinc-700 rounded-xl px-4 py-3 text-white focus:outline-none focus:ring-2 focus:ring-red-500/50 transition-all"
            >
              <option value="General">General</option>
              <option value="Services">Services</option>
              <option value="Pricing">Pricing</option>
              <option value="Support">Support</option>
            </select>
          </div>
        </div>

        <div className="mt-8 flex gap-3">
          <button 
            onClick={handleSave} 
            className="bg-red-600 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-red-700 transition-all shadow-lg shadow-red-600/20"
          >
            <Check size={20} /> {isEditing ? 'Update FAQ' : 'Create FAQ'}
          </button>
          {isEditing && (
            <button 
              onClick={() => { setIsEditing(false); setCurrentFaq({ question: '', answer: '', category: 'General' }); }} 
              className="bg-zinc-800 text-white px-8 py-3 rounded-xl font-bold flex items-center gap-2 hover:bg-zinc-700 transition-all"
            >
              <X size={20} /> Cancel
            </button>
          )}
        </div>
      </div>

      {/* List Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-bold text-white mb-4">Existing FAQs</h2>
        <div className="space-y-4">
          {faqs.length === 0 ? (
            <div className="text-center py-12 bg-zinc-900 rounded-2xl border border-zinc-800 text-gray-500">
              No FAQs found. Add your first FAQ above.
            </div>
          ) : (
            faqs.map((faq) => (
              <div key={faq.id} className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 group hover:border-zinc-700 transition-all">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex gap-4">
                    <div className="mt-1 p-2 bg-red-500/10 rounded-lg text-red-500">
                      <HelpCircle size={20} />
                    </div>
                    <div>
                      <h3 className="text-white font-bold text-lg mb-2">{faq.question}</h3>
                      <p className="text-gray-400 text-sm leading-relaxed">{faq.answer}</p>
                      <span className="inline-block mt-3 px-3 py-1 bg-zinc-800 text-zinc-500 text-[10px] font-bold uppercase rounded-full tracking-wider">
                        {faq.category}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex gap-2 shrink-0">
                    <button 
                      onClick={() => { setIsEditing(true); setCurrentFaq(faq); window.scrollTo({ top: 0, behavior: 'smooth' }); }} 
                      className="p-2 text-gray-400 hover:text-blue-500 hover:bg-blue-500/10 rounded-lg transition-all"
                      title="Edit"
                    >
                      <Edit size={18} />
                    </button>
                    <button 
                      onClick={() => handleDelete(faq.id)} 
                      className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-500/10 rounded-lg transition-all"
                      title="Delete"
                    >
                      <Trash size={18} />
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}

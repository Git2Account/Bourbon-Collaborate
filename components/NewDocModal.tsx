
import React, { useState } from 'react';
import { MOCK_USERS } from '../constants';

interface NewDocModalProps {
  onClose: () => void;
  onCreate: (title: string, category: string, collaborators: string[]) => void;
}

const NewDocModal: React.FC<NewDocModalProps> = ({ onClose, onCreate }) => {
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState('Work');
  const [selectedCollabs, setSelectedCollabs] = useState<string[]>(['ai-gemini']);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (title.trim()) {
      onCreate(title, category, selectedCollabs);
    }
  };

  const toggleCollab = (id: string) => {
    if (id === 'ai-gemini') return;
    setSelectedCollabs(prev => 
      prev.includes(id) ? prev.filter(i => i !== id) : [...prev, id]
    );
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-black/80 backdrop-blur-md">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="relative w-full max-w-xl bg-[#0A0A0A] border border-white/5 rounded-[3rem] p-12 shadow-[0_0_100px_rgba(0,0,0,1)] animate-vault">
        <h2 className="text-3xl font-playfair font-bold text-white mb-2">New Asset</h2>
        <p className="text-[9px] uppercase tracking-[0.4em] text-[#D4AF37] font-bold mb-10">Initialize Reserve Inventory</p>
        
        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-[9px] font-bold text-white/20 uppercase tracking-widest mb-3 ml-1">Asset Title</label>
            <input 
              autoFocus
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="The Grand Reserve..."
              className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-5 text-sm focus:border-[#D4AF37] outline-none text-white transition-all"
              required
            />
          </div>

          <div className="grid grid-cols-2 gap-8">
            <div>
              <label className="block text-[9px] font-bold text-white/20 uppercase tracking-widest mb-3 ml-1">Classification</label>
              <div className="flex flex-col gap-2">
                {['Work', 'Personal', 'Archives'].map(cat => (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setCategory(cat)}
                    className={`text-left px-5 py-3 rounded-xl border text-[10px] font-bold uppercase tracking-widest transition-all ${
                      category === cat ? 'bg-[#D4AF37] text-black border-[#D4AF37]' : 'border-white/5 text-white/30 hover:bg-white/5'
                    }`}
                  >
                    {cat} Stock
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-[9px] font-bold text-white/20 uppercase tracking-widest mb-3 ml-1">Access Rights</label>
              <div className="space-y-2 max-h-40 overflow-y-auto pr-2 custom-scrollbar">
                {MOCK_USERS.map(user => (
                  <button
                    key={user.id}
                    type="button"
                    onClick={() => toggleCollab(user.id)}
                    className={`w-full flex items-center gap-3 p-3 rounded-xl border transition-all ${
                      selectedCollabs.includes(user.id) ? 'bg-white/5 border-[#D4AF37]/50 opacity-100' : 'bg-transparent border-transparent opacity-30 hover:opacity-50'
                    }`}
                  >
                    <img src={user.avatar} className="w-6 h-6 rounded-full" />
                    <span className="text-[10px] font-medium text-white/80 truncate">{user.username}</span>
                  </button>
                ))}
              </div>
            </div>
          </div>

          <div className="flex gap-4 pt-6">
            <button type="button" onClick={onClose} className="flex-1 py-4 text-[10px] font-bold uppercase tracking-widest text-white/20 hover:text-white transition-all">Cancel</button>
            <button type="submit" className="flex-[2] bg-[#D4AF37] text-black py-5 rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-lg hover:scale-[1.02] transition-all">Initialize Reserve</button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default NewDocModal;

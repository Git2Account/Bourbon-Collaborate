
import React, { useState } from 'react';
import { MOCK_USERS, ICONS } from '../constants';

interface UserManagementModalProps {
  onClose: () => void;
}

const UserManagementModal: React.FC<UserManagementModalProps> = ({ onClose }) => {
  const [inviteEmail, setInviteEmail] = useState('');

  const handleInvite = (e: React.FormEvent) => {
    e.preventDefault();
    alert(`Authorized invite sent to ${inviteEmail}`);
    setInviteEmail('');
  };

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-6 bg-black/90 backdrop-blur-xl animate-fade-in">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="relative w-full max-w-2xl bg-[#0A0A0A] border border-white/10 rounded-[4rem] p-16 shadow-[0_0_100px_rgba(0,0,0,1)] animate-vault">
        <div className="flex items-center justify-between mb-12">
          <div>
            <h2 className="text-4xl font-playfair font-bold text-white mb-2">Registry</h2>
            <p className="text-[10px] uppercase tracking-[0.5em] text-[#D4AF37] font-bold">Workspace Authorized Access</p>
          </div>
          <button onClick={onClose} className="text-white/20 hover:text-white transition-all">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <form onSubmit={handleInvite} className="mb-16">
          <div className="relative flex gap-4">
            <input 
              autoFocus
              value={inviteEmail}
              onChange={(e) => setInviteEmail(e.target.value)}
              placeholder="Enter Access Key (Email)..."
              className="flex-1 bg-black/50 border border-white/10 rounded-2xl px-8 py-5 text-sm focus:border-[#D4AF37] outline-none text-white transition-all placeholder:text-white/10"
              required
            />
            <button type="submit" className="bg-[#D4AF37] text-black px-10 py-5 rounded-2xl font-bold uppercase tracking-widest text-[11px] shadow-lg flex items-center gap-4">
              <ICONS.UserPlus /> Invite
            </button>
          </div>
        </form>

        <div className="space-y-6 max-h-[400px] overflow-y-auto pr-6 custom-scrollbar">
          {MOCK_USERS.map(user => (
            <div key={user.id} className="flex items-center justify-between p-6 bg-white/[0.02] border border-white/5 rounded-3xl group hover:border-[#D4AF37]/30 transition-all">
              <div className="flex items-center gap-6">
                <img src={user.avatar} className="w-12 h-12 rounded-full border-2 border-black" />
                <div className="flex flex-col">
                  <span className="text-sm font-bold text-white">{user.username}</span>
                  <span className="text-[10px] text-white/30 uppercase tracking-widest">{user.isAI ? 'Synthetic Entity' : 'Master Distiller'}</span>
                </div>
              </div>
              <div className="flex items-center gap-6">
                 <span className={`text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${user.isAI ? 'bg-[#D4AF37]/20 border-[#D4AF37]/40 text-[#D4AF37]' : 'bg-white/5 border-white/10 text-white/40'}`}>
                    {user.isAI ? 'The Oracle' : 'Active'}
                 </span>
                 <button className="text-white/10 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-all">
                    <ICONS.Trash />
                 </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default UserManagementModal;

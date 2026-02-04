
import React, { useState } from 'react';
import { User } from '../types';
import { MOCK_USERS } from '../constants';

interface AuthProps {
  onLogin: (user: User) => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (email === 'testuser1@gmail.com' && password === '123456789') {
      onLogin(MOCK_USERS[0]);
    } else {
      setError('Invalid Vault Credentials');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-[#050505] p-6 relative">
      <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,_var(--vault-gold)_0%,_transparent_70%)] opacity-5 pointer-events-none"></div>
      
      <div className="w-full max-w-md animate-vault">
        <div className="text-center mb-12">
          <div className="inline-block p-4 border-2 border-[#D4AF37] rounded-full mb-6 shadow-[0_0_30px_rgba(212,175,55,0.2)]">
            <span className="text-4xl font-playfair font-bold text-[#D4AF37]">BC</span>
          </div>
          <h1 className="text-4xl font-playfair font-bold text-white mb-2 tracking-tighter">Bourbon-Collaborate</h1>
          <p className="text-[10px] uppercase tracking-[0.6em] text-[#D4AF37] font-bold">Secure Distilled Workspace</p>
        </div>

        <div className="glass-panel p-10 rounded-[2.5rem] shadow-2xl relative overflow-hidden">
          <form onSubmit={handleSubmit} className="space-y-8">
            <div>
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3 ml-1">Access Key</label>
              <input 
                type="email" 
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="testuser1@gmail.com"
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all placeholder:text-white/10"
                required
              />
            </div>
            <div>
              <label className="block text-[10px] font-bold text-white/40 uppercase tracking-widest mb-3 ml-1">Cipher</label>
              <input 
                type="password" 
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-black/50 border border-white/10 rounded-2xl px-6 py-4 text-sm focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] outline-none transition-all placeholder:text-white/10"
                required
              />
            </div>

            {error && <p className="text-red-500 text-[10px] text-center font-bold uppercase tracking-widest">{error}</p>}

            <button 
              type="submit"
              className="w-full bg-[#D4AF37] text-black font-bold py-5 rounded-2xl uppercase tracking-[0.3em] text-[11px] shadow-xl hover:scale-[1.02] active:scale-[0.98] transition-all"
            >
              Authorize Access
            </button>
          </form>
        </div>
        
        <p className="mt-8 text-center text-white/20 text-[10px] uppercase tracking-[0.2em]">
          Restricted access for authorized distillers only
        </p>
      </div>
    </div>
  );
};

export default Auth;


import React, { useState } from 'react';
import { User, Document } from '../types';
import { ICONS, MOCK_USERS } from '../constants';
import NewDocModal from './NewDocModal';
import UserManagementModal from './UserManagementModal';
import ProjectTimelineModal from './ProjectTimelineModal';
import { dbService } from '../services/mockBackend';

interface DashboardProps {
  documents: Document[];
  currentUser: User;
  onSelectDoc: (id: string) => void;
  onCreateDoc: (title: string, category: string, collaborators: string[]) => void;
  onLogout: () => void;
  onRefresh: () => void;
}

const Dashboard: React.FC<DashboardProps> = ({ 
  documents, 
  currentUser, 
  onSelectDoc, 
  onCreateDoc, 
  onLogout,
  onRefresh
}) => {
  const [activeTab, setActiveTab] = useState<'All' | 'Work' | 'Personal' | 'Archives'>('All');
  const [showNewDocModal, setShowNewDocModal] = useState(false);
  const [showUserModal, setShowUserModal] = useState(false);
  const [selectedProjectForTimeline, setSelectedProjectForTimeline] = useState<Document | null>(null);

  const filteredDocs = activeTab === 'All' 
    ? documents 
    : documents.filter(doc => doc.category === activeTab);

  const handleDeleteDoc = async (e: React.MouseEvent, id: string) => {
    e.stopPropagation();
    if (confirm("Permanently incinerate this asset?")) {
      await dbService.deleteDocument(id);
      onRefresh();
    }
  };

  return (
    <div className="flex flex-col h-screen bg-[#050505] overflow-hidden text-white">
      {/* Premium Header */}
      <header className="h-24 border-b border-white/5 flex items-center justify-between px-10 glass-panel z-50">
        <div className="flex items-center gap-6">
          <div className="w-12 h-12 border-2 border-[#D4AF37] rounded-2xl flex items-center justify-center shadow-[0_0_20px_rgba(212,175,55,0.2)]">
            <span className="text-[#D4AF37] font-playfair font-bold text-2xl">B</span>
          </div>
          <div className="flex flex-col">
            <h1 className="text-xl font-playfair font-bold tracking-widest uppercase">Collaborate</h1>
            <span className="text-[8px] font-bold text-[#D4AF37] tracking-[0.4em] uppercase">The Vault Core</span>
          </div>
        </div>

        <div className="flex items-center gap-10">
          <button 
            onClick={() => setShowUserModal(true)}
            className="flex items-center gap-3 px-6 py-2.5 bg-white/5 border border-white/10 rounded-xl text-[10px] font-bold uppercase tracking-widest hover:border-[#D4AF37]/50 transition-all"
          >
            <ICONS.Users />
            Registry
          </button>
          
          <div className="flex items-center gap-4 pl-8 border-l border-white/10">
             <div className="flex flex-col items-end">
                <span className="text-[10px] font-bold uppercase tracking-widest text-white/80">{currentUser.username}</span>
                <button onClick={onLogout} className="text-[8px] font-bold uppercase tracking-widest text-red-500/60 hover:text-red-500 transition-all mt-1">Disconnect</button>
             </div>
             <img src={currentUser.avatar} className="w-10 h-10 rounded-full border border-[#D4AF37] p-0.5" />
          </div>
        </div>
      </header>

      <main className="flex-1 flex overflow-hidden">
        {/* Navigation Sidebar */}
        <aside className="w-72 border-r border-white/5 p-10 hidden md:flex flex-col">
          <button 
            onClick={() => setShowNewDocModal(true)}
            className="w-full bg-[#D4AF37] text-black py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-[10px] mb-12 shadow-[0_10px_30px_rgba(212,175,55,0.2)] hover:scale-105 transition-all"
          >
            + Distill Asset
          </button>

          <div className="space-y-8 flex-1">
            <div className="flex flex-col gap-2">
              <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] mb-4 ml-4">Reserves</span>
              {['All', 'Work', 'Personal', 'Archives'].map(tab => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab as any)}
                  className={`w-full text-left px-6 py-4 rounded-2xl text-[10px] font-bold uppercase tracking-widest transition-all ${
                    activeTab === tab ? 'bg-white/5 text-[#D4AF37] border border-[#D4AF37]/20 shadow-[0_0_15px_rgba(212,175,55,0.05)]' : 'text-white/20 hover:text-white hover:bg-white/5'
                  }`}
                >
                  {tab}
                </button>
              ))}
            </div>

            <div className="pt-8 border-t border-white/5">
              <span className="text-[9px] font-bold text-white/20 uppercase tracking-[0.4em] mb-4 ml-4">Vitality</span>
              <div className="px-6 py-4 space-y-4">
                 <div className="flex justify-between text-[8px] font-bold uppercase tracking-widest">
                    <span className="text-white/40">Efficiency</span>
                    <span className="text-[#D4AF37]">92%</span>
                 </div>
                 <div className="h-1 bg-white/5 rounded-full overflow-hidden">
                    <div className="h-full bg-[#D4AF37] w-[92%]"></div>
                 </div>
              </div>
            </div>
          </div>
        </aside>

        {/* Assets Repository */}
        <div className="flex-1 overflow-y-auto p-12 custom-scrollbar bg-[radial-gradient(circle_at_top_right,_rgba(212,175,55,0.03)_0%,_transparent_50%)]">
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4 gap-10">
            {filteredDocs.map((doc, i) => (
              <div 
                key={doc.id}
                onClick={() => onSelectDoc(doc.id)}
                className="group relative glass-panel rounded-[3rem] p-10 shadow-2xl hover:border-[#D4AF37]/50 transition-all duration-700 cursor-pointer animate-vault"
                style={{ animationDelay: `${i * 100}ms` }}
              >
                {/* Status Indicator */}
                <div className="absolute top-8 right-8 flex gap-2">
                  <div className="w-2 h-2 rounded-full bg-green-500 animate-pulse"></div>
                </div>

                <div className="mb-10 flex justify-between items-center">
                  <span className="text-[8px] font-bold uppercase tracking-[0.3em] px-4 py-2 bg-white/5 border border-white/10 rounded-full text-[#D4AF37]">
                    {doc.category}
                  </span>
                  <div className="flex gap-4">
                    <button 
                      onClick={(e) => { e.stopPropagation(); setSelectedProjectForTimeline(doc); }}
                      className="p-2 text-white/20 hover:text-[#D4AF37] transition-all"
                      title="Timeline"
                    >
                      <ICONS.Timeline />
                    </button>
                    <button 
                      onClick={(e) => handleDeleteDoc(e, doc.id)}
                      className="p-2 text-white/20 hover:text-red-500 transition-all"
                    >
                      <ICONS.Trash />
                    </button>
                  </div>
                </div>
                
                <h3 className="text-2xl font-playfair font-bold text-white mb-6 group-hover:text-gold-gradient transition-all leading-snug">
                  {doc.title}
                </h3>

                {/* Design Preview Section */}
                <div className="flex gap-2 mb-10 overflow-hidden">
                  <div className="w-1/3 h-12 bg-white/5 rounded-xl border border-white/5 group-hover:bg-[#D4AF37]/10 transition-colors"></div>
                  <div className="w-1/3 h-12 bg-white/5 rounded-xl border border-white/5"></div>
                  <div className="w-1/3 h-12 bg-white/5 rounded-xl border border-white/5"></div>
                </div>
                
                <div className="mt-auto pt-10 border-t border-white/5 flex items-center justify-between">
                   <div className="flex flex-col gap-1">
                      <span className="text-[7px] text-white/20 uppercase font-bold tracking-[0.4em]">Last Distilled</span>
                      <span className="text-[10px] text-white/60 font-medium">{new Date(doc.lastModified).toLocaleDateString()}</span>
                   </div>
                   <div className="flex -space-x-3">
                      {doc.collaborators.slice(0, 4).map((id, idx) => (
                        <img 
                          key={idx} 
                          src={MOCK_USERS.find(u => u.id === id)?.avatar} 
                          className="w-8 h-8 rounded-full border-2 border-[#050505] bg-black shadow-xl" 
                        />
                      ))}
                      {doc.collaborators.length > 4 && (
                        <div className="w-8 h-8 rounded-full bg-white/5 border-2 border-[#050505] flex items-center justify-center text-[8px] font-bold text-white/40">
                          +{doc.collaborators.length - 4}
                        </div>
                      )}
                   </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </main>

      {showNewDocModal && (
        <NewDocModal 
          onClose={() => setShowNewDocModal(false)}
          onCreate={(title, cat, collabs) => {
            onCreateDoc(title, cat, collabs);
            setShowNewDocModal(false);
          }}
        />
      )}

      {showUserModal && (
        <UserManagementModal onClose={() => setShowUserModal(false)} />
      )}

      {selectedProjectForTimeline && (
        <ProjectTimelineModal 
          doc={selectedProjectForTimeline} 
          onClose={() => setSelectedProjectForTimeline(null)} 
        />
      )}
    </div>
  );
};

export default Dashboard;

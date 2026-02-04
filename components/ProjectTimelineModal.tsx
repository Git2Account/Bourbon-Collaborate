
import React from 'react';
import { Document } from '../types';
import { MOCK_USERS, ICONS } from '../constants';

interface ProjectTimelineModalProps {
  doc: Document;
  onClose: () => void;
}

const ProjectTimelineModal: React.FC<ProjectTimelineModalProps> = ({ doc, onClose }) => {
  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-6 bg-black/95 backdrop-blur-2xl">
      <div className="absolute inset-0" onClick={onClose}></div>
      <div className="relative w-full max-w-3xl bg-[#080808] border border-white/10 rounded-[4rem] p-16 shadow-2xl animate-vault">
        <div className="mb-16 flex items-center justify-between">
          <div>
            <h2 className="text-4xl font-playfair font-bold text-white mb-2">{doc.title}</h2>
            <p className="text-[10px] uppercase tracking-[0.5em] text-[#D4AF37] font-bold">Reserve Maturity Timeline</p>
          </div>
          <button onClick={onClose} className="text-white/20 hover:text-white transition-all">
             <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/></svg>
          </button>
        </div>

        <div className="relative pl-12 border-l border-white/10 space-y-16 py-4 max-h-[500px] overflow-y-auto custom-scrollbar">
          {doc.timeline.sort((a, b) => b.timestamp - a.timestamp).map((event, idx) => {
            const user = MOCK_USERS.find(u => u.id === event.userId);
            return (
              <div key={event.id} className="relative">
                {/* Connector Dot */}
                <div className="absolute -left-[54px] top-2 w-4 h-4 rounded-full bg-black border-2 border-[#D4AF37] shadow-[0_0_15px_rgba(212,175,55,0.4)] z-10"></div>
                
                <div className="flex flex-col gap-4 group">
                  <div className="flex items-center gap-6">
                    <span className="text-[10px] font-bold text-white/30 tracking-widest uppercase">{new Date(event.timestamp).toLocaleString()}</span>
                    <span className={`text-[8px] font-bold uppercase tracking-widest px-3 py-1 rounded-full border ${
                      event.type === 'creation' ? 'bg-green-500/10 border-green-500/30 text-green-500' :
                      event.type === 'ai_insight' ? 'bg-[#D4AF37]/10 border-[#D4AF37]/30 text-[#D4AF37]' :
                      'bg-white/5 border-white/10 text-white/60'
                    }`}>
                      {event.type}
                    </span>
                  </div>
                  
                  <div className="flex items-center gap-5 p-6 bg-white/[0.02] border border-white/5 rounded-3xl group-hover:border-[#D4AF37]/20 transition-all">
                    <img src={user?.avatar} className="w-10 h-10 rounded-full border border-black" />
                    <div>
                      <p className="text-white text-sm font-medium">{event.label}</p>
                      <p className="text-[10px] text-white/20 uppercase tracking-widest mt-1">Initiated by {user?.username}</p>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}

          {doc.timeline.length === 0 && (
             <p className="text-white/20 text-center uppercase tracking-widest font-bold text-[10px] py-20">No maturity events logged</p>
          )}
        </div>

        <div className="mt-16 pt-10 border-t border-white/5 flex justify-between items-center">
           <div className="flex items-center gap-8">
              <div className="flex flex-col gap-1">
                 <span className="text-[8px] text-white/20 uppercase font-bold tracking-widest">Collaborators</span>
                 <div className="flex -space-x-2">
                    {doc.collaborators.map(id => (
                      <img key={id} src={MOCK_USERS.find(u => u.id === id)?.avatar} className="w-7 h-7 rounded-full border-2 border-[#080808]" />
                    ))}
                 </div>
              </div>
           </div>
           <button className="text-[10px] font-bold uppercase tracking-widest text-[#D4AF37] border-b border-transparent hover:border-[#D4AF37] transition-all">Export Asset Summary</button>
        </div>
      </div>
    </div>
  );
};

export default ProjectTimelineModal;

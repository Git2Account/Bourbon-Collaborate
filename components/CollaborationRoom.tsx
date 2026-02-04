
import React, { useState, useEffect } from 'react';
import { User, Document, CursorPosition } from '../types';
import { MOCK_USERS, ICONS } from '../constants';
import { dbService, socket } from '../services/mockBackend';
import Editor from './Editor';
import ChatSidebar from './ChatSidebar';
import Cursor from './Cursor';
import TaskBoard from './TaskBoard';

interface RoomProps {
  docId: string;
  currentUser: User;
  onBack: () => void;
}

const CollaborationRoom: React.FC<RoomProps> = ({ docId, currentUser, onBack }) => {
  const [doc, setDoc] = useState<Document | null>(null);
  const [cursors, setCursors] = useState<CursorPosition[]>([]);
  const [rightPanel, setRightPanel] = useState<'NONE' | 'TASKS' | 'CHAT'>('CHAT');

  useEffect(() => {
    const loadData = async () => {
      const data = await dbService.getDocument(docId);
      if (data) setDoc(data);
    };
    loadData();

    socket.on('cursor-move', (pos: CursorPosition) => {
      setCursors(prev => {
        const next = prev.filter(p => p.userId !== pos.userId);
        return [...next, pos];
      });
    });

    socket.on('doc-update', (newContent: string) => {
      setDoc(prev => prev ? { ...prev, content: newContent } : null);
    });
  }, [docId]);

  const handleDocChange = (content: string) => {
    if (!doc) return;
    setDoc({ ...doc, content });
    socket.broadcast('doc-update', content);
    dbService.saveDocument(docId, content);
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    socket.broadcast('cursor-move', { userId: currentUser.id, x: e.clientX, y: e.clientY });
  };

  if (!doc) return null;

  return (
    <div className="flex h-screen bg-[#050505]" onMouseMove={handleMouseMove}>
      
      {/* Editor Center (Full Width) */}
      <div className="flex-1 flex flex-col relative overflow-hidden">
        <header className="h-16 border-b border-white/5 flex items-center justify-between px-8 glass-panel z-40">
          <div className="flex items-center gap-6">
            <button onClick={onBack} className="p-2 hover:bg-white/5 rounded-full transition-all text-[#D4AF37]">
              <ICONS.ChevronLeft />
            </button>
            <input 
              value={doc.title} 
              onChange={(e) => setDoc({...doc, title: e.target.value})}
              className="bg-transparent border-none text-white font-playfair font-bold text-lg outline-none w-auto min-w-[300px]"
            />
          </div>

          <div className="flex items-center gap-6">
             <div className="flex -space-x-2">
                {MOCK_USERS.filter(u => doc.collaborators.includes(u.id)).map(u => (
                  <img key={u.id} src={u.avatar} className="w-7 h-7 rounded-full border-2 border-[#050505]" title={u.username} />
                ))}
             </div>
             <div className="w-px h-6 bg-white/10 mx-2"></div>
             <div className="flex items-center gap-2 p-1 bg-black rounded-xl border border-white/5">
                <NavBtn active={rightPanel === 'TASKS'} onClick={() => setRightPanel(rightPanel === 'TASKS' ? 'NONE' : 'TASKS')} label="Tasks" />
                <NavBtn active={rightPanel === 'CHAT'} onClick={() => setRightPanel(rightPanel === 'CHAT' ? 'NONE' : 'CHAT')} label="Vault Chat" />
             </div>
          </div>
        </header>

        <main className="flex-1 overflow-y-auto p-8 custom-scrollbar relative flex justify-center">
          <div className="w-full max-w-5xl animate-vault">
            <Editor content={doc.content} onChange={handleDocChange} />
          </div>
          
          {/* Real-time cursors */}
          <div className="absolute inset-0 pointer-events-none overflow-hidden">
            {cursors.filter(c => c.userId !== currentUser.id).map(c => {
              const u = MOCK_USERS.find(usr => usr.id === c.userId);
              return u ? <Cursor key={c.userId} cursor={c} user={u} /> : null;
            })}
          </div>
        </main>
      </div>

      {/* Right Intelligence Panel */}
      <aside 
        className={`sidebar-transition h-full border-l border-white/5 bg-[#080808] z-50 overflow-hidden ${
          rightPanel === 'NONE' ? 'w-0' : 'w-[380px]'
        }`}
      >
        <div className="w-[380px] h-full flex flex-col">
          {rightPanel === 'TASKS' && <TaskBoard docId={docId} />}
          {rightPanel === 'CHAT' && <ChatSidebar docId={docId} currentUser={currentUser} docContent={doc.content} />}
        </div>
      </aside>
    </div>
  );
};

const NavBtn = ({ active, onClick, label }: any) => (
  <button 
    onClick={onClick}
    className={`px-4 py-1.5 rounded-lg text-[10px] font-bold uppercase tracking-widest transition-all ${
      active ? 'bg-[#D4AF37] text-black shadow-lg' : 'text-white/40 hover:text-white'
    }`}
  >
    {label}
  </button>
);

export default CollaborationRoom;

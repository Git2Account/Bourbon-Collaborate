
import React, { useState, useEffect, useRef } from 'react';
import { User, ChatMessage } from '../types';
import { ICONS, MOCK_USERS } from '../constants';
import { dbService, socket } from '../services/mockBackend';
import { chatWithGemini } from '../services/geminiService';

interface ChatProps {
  docId: string;
  currentUser: User;
  docContent: string;
}

const ChatSidebar: React.FC<ChatProps> = ({ docId, currentUser, docContent }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadMessages = async () => {
      const msgs = await dbService.getMessages(docId);
      setMessages(msgs);
    };
    loadMessages();

    const handleNewMessage = (payload: { docId: string, msg: ChatMessage }) => {
      if (payload.docId === docId) {
        setMessages(prev => [...prev, payload.msg]);
      }
    };

    socket.on('new-message', handleNewMessage);
  }, [docId]);

  useEffect(() => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  const sendMessage = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim()) return;

    const text = input;
    setInput('');
    await dbService.addMessage(docId, currentUser.id, text);

    if (text.toLowerCase().includes('oracle') || text.toLowerCase().includes('ai') || text.startsWith('/')) {
      setIsTyping(true);
      const aiReply = await chatWithGemini(text, docContent);
      setIsTyping(false);
      await dbService.addMessage(docId, 'ai-gemini', aiReply || "Signal received. Processing...");
    }
  };

  return (
    <div className="flex flex-col h-full bg-[#0A0A0A] border-l border-white/5">
      <div className="p-8 border-b border-white/5 flex items-center justify-between">
        <div className="flex flex-col">
          <h3 className="text-[10px] font-bold text-[#D4AF37] uppercase tracking-[0.3em]">
            Vault Comms
          </h3>
        </div>
        <div className="flex items-center gap-2 text-[8px] text-white/40 uppercase font-bold tracking-widest">
          <span className="w-1.5 h-1.5 bg-green-500 rounded-full"></span>
          Synchronized
        </div>
      </div>

      <div ref={scrollRef} className="flex-1 overflow-y-auto p-8 space-y-6 custom-scrollbar">
        {messages.map((msg) => {
          const sender = MOCK_USERS.find(u => u.id === msg.senderId);
          const isSelf = msg.senderId === currentUser.id;
          
          return (
            <div key={msg.id} className={`flex flex-col ${isSelf ? 'items-end' : 'items-start'} animate-fade-up`}>
              <span className="text-[8px] font-bold text-white/20 uppercase tracking-widest mb-1.5 px-2">
                {sender?.username}
              </span>
              <div 
                className={`max-w-[85%] px-5 py-3.5 rounded-2xl text-[12px] leading-relaxed border ${
                  isSelf 
                    ? 'bg-white/5 border-white/10 text-white rounded-tr-none' 
                    : sender?.isAI 
                      ? 'bg-[#D4AF37] border-[#D4AF37] text-black font-medium rounded-tl-none shadow-[0_0_20px_rgba(212,175,55,0.2)]'
                      : 'bg-black border-white/5 text-white/60 rounded-tl-none'
                }`}
              >
                {msg.text}
              </div>
            </div>
          );
        })}
        {isTyping && (
          <div className="flex items-center gap-3 animate-pulse">
            <div className="w-2 h-2 bg-[#D4AF37] rounded-full"></div>
            <span className="text-[8px] font-bold text-[#D4AF37] uppercase tracking-widest">Oracle Thinking</span>
          </div>
        )}
      </div>

      <form onSubmit={sendMessage} className="p-8 border-t border-white/5">
        <div className="relative">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder="Relay message..."
            className="w-full bg-black border border-white/10 rounded-2xl px-6 py-4 text-xs focus:ring-1 focus:ring-[#D4AF37] outline-none text-white transition-all"
          />
          <button type="submit" className="absolute right-3 top-1/2 -translate-y-1/2 text-[#D4AF37] hover:scale-110 transition-all p-2">
            <ICONS.Send />
          </button>
        </div>
      </form>
    </div>
  );
};

export default ChatSidebar;

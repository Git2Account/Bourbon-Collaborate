
import React, { useRef, useEffect } from 'react';
import { ICONS } from '../constants';
import { generateAIImage } from '../services/geminiService';

interface EditorProps {
  content: string;
  onChange: (content: string) => void;
}

const Editor: React.FC<EditorProps> = ({ content, onChange }) => {
  const editorRef = useRef<HTMLDivElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== content) {
      editorRef.current.innerHTML = content;
    }
  }, [content]);

  const execCommand = (command: string, value?: string) => {
    document.execCommand(command, false, value);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = (ev) => {
        const b64 = ev.target?.result as string;
        execCommand('insertHTML', `<img src="${b64}" class="w-full rounded-3xl my-8 border border-white/10 shadow-2xl" />`);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleAIImage = async () => {
    const prompt = window.prompt("The Oracle visualizes your thought:");
    if (!prompt) return;
    
    const placeholder = `<div class="ai-loading p-12 bg-black border border-[#D4AF37]/20 rounded-3xl animate-pulse text-center my-8 text-[10px] uppercase font-bold text-[#D4AF37] tracking-[0.4em]">Synthesizing Reality...</div>`;
    execCommand('insertHTML', placeholder);

    try {
      const url = await generateAIImage(prompt);
      if (editorRef.current && url) {
        const current = editorRef.current.innerHTML;
        editorRef.current.innerHTML = current.replace(placeholder, `<img src="${url}" class="w-full rounded-3xl my-8 border border-[#D4AF37]/40 shadow-[0_0_50px_rgba(212,175,55,0.1)]" />`);
        onChange(editorRef.current.innerHTML);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="flex flex-col gap-10 py-10">
      <input type="file" ref={fileInputRef} className="hidden" accept="image/*" onChange={handleImageUpload} />
      
      {/* Precision Toolbar */}
      <div className="flex flex-wrap items-center gap-2 p-2 glass-panel rounded-2xl w-fit sticky top-4 mx-auto z-40 border-white/5 shadow-2xl">
        <ToolGroup>
          <ToolBtn onClick={() => execCommand('bold')} icon={<ICONS.Bold />} title="Bold" />
          <ToolBtn onClick={() => execCommand('italic')} icon={<ICONS.Italic />} title="Italic" />
          <ToolBtn onClick={() => execCommand('underline')} icon={<ICONS.Underline />} title="Underline" />
        </ToolGroup>
        
        <div className="w-px h-6 bg-white/10 mx-1"></div>
        
        <ToolGroup>
          <ToolBtn onClick={() => execCommand('formatBlock', 'H1')} icon={<span className="font-playfair font-bold">H1</span>} title="H1" />
          <ToolBtn onClick={() => execCommand('formatBlock', 'H2')} icon={<span className="font-playfair font-bold">H2</span>} title="H2" />
          <ToolBtn onClick={() => execCommand('formatBlock', 'P')} icon={<span className="font-playfair text-xs italic">p</span>} title="Text" />
        </ToolGroup>

        <div className="w-px h-6 bg-white/10 mx-1"></div>

        <ToolGroup>
          <ToolBtn onClick={() => execCommand('insertUnorderedList')} icon={<span className="text-xl leading-none">•</span>} title="List" />
          <ToolBtn onClick={() => fileInputRef.current?.click()} icon={<ICONS.Image />} title="Upload Vessel" />
          <ToolBtn onClick={handleAIImage} icon={<span className="text-lg">✨</span>} title="AI Manifest" />
        </ToolGroup>
      </div>

      <div 
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="flex-1 w-full min-h-[800px] outline-none text-white/90 text-xl font-serif leading-relaxed prose prose-invert max-w-none px-4 selection:bg-[#D4AF37]/30"
        placeholder="Start documenting the process..."
        spellCheck={false}
      />
    </div>
  );
};

const ToolGroup = ({ children }: any) => <div className="flex items-center gap-1">{children}</div>;
const ToolBtn = ({ onClick, icon, title }: any) => (
  <button 
    onClick={onClick}
    className="w-10 h-10 flex items-center justify-center rounded-xl text-white/40 hover:text-white hover:bg-white/5 transition-all"
    title={title}
  >
    {icon}
  </button>
);

export default Editor;

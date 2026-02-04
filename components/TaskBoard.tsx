
import React, { useState, useEffect } from 'react';
import { Task } from '../types';
import { dbService, socket } from '../services/mockBackend';
import { ICONS } from '../constants';

interface TaskBoardProps {
  docId: string;
}

const TaskBoard: React.FC<TaskBoardProps> = ({ docId }) => {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [newTaskText, setNewTaskText] = useState('');

  const loadTasks = async () => {
    const data = await dbService.getTasks(docId);
    setTasks(data);
  };

  useEffect(() => {
    loadTasks();
    socket.on('task-update', (updatedDocId: string) => {
      if (updatedDocId === docId) loadTasks();
    });
  }, [docId]);

  const handleAddTask = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTaskText.trim()) return;

    await dbService.addTask({
      id: Math.random().toString(36).substr(2, 9),
      text: newTaskText,
      completed: false,
      docId
    });
    setNewTaskText('');
  };

  const toggleTask = async (id: string) => {
    await dbService.toggleTask(id);
  };

  const deleteTask = async (id: string) => {
    await dbService.deleteTask(id);
  };

  return (
    <div className="flex flex-col h-full bg-[#080808] p-10">
      <div className="mb-12">
        <h3 className="text-xl font-playfair font-bold text-white mb-2">The Barrel Log</h3>
        <p className="text-[9px] uppercase tracking-[0.4em] text-[#D4AF37] font-bold">Standard Yield Objectives</p>
      </div>

      <form onSubmit={handleAddTask} className="mb-10">
        <div className="relative">
          <input 
            value={newTaskText}
            onChange={(e) => setNewTaskText(e.target.value)}
            placeholder="+ Distill objective..."
            className="w-full bg-black border border-white/5 rounded-2xl px-8 py-5 text-[11px] focus:ring-1 focus:ring-[#D4AF37] outline-none text-white placeholder:text-white/10 transition-all font-medium"
          />
        </div>
      </form>

      <div className="space-y-4 overflow-y-auto custom-scrollbar flex-1 pr-2">
        {tasks.map(task => (
          <div 
            key={task.id} 
            className={`group flex items-center gap-5 p-5 rounded-2xl glass-panel border border-white/5 transition-all duration-500 ${task.completed ? 'opacity-25' : 'hover:border-[#D4AF37]/20'}`}
          >
            <button 
              onClick={() => toggleTask(task.id)}
              className={`w-6 h-6 rounded-lg border flex items-center justify-center transition-all duration-300 ${task.completed ? 'bg-[#D4AF37] border-[#D4AF37]' : 'border-white/10 hover:border-[#D4AF37]'}`}
            >
              {task.completed && <ICONS.Check />}
            </button>
            <span className={`text-[12px] flex-1 text-white/80 tracking-wide font-medium ${task.completed ? 'line-through' : ''}`}>{task.text}</span>
            <button 
              onClick={() => deleteTask(task.id)}
              className="opacity-0 group-hover:opacity-100 p-2 text-white/10 hover:text-red-500 transition-all"
            >
              <ICONS.Trash />
            </button>
          </div>
        ))}
        {tasks.length === 0 && (
          <div className="py-20 flex flex-col items-center justify-center opacity-10">
             <div className="w-16 h-16 border-2 border-dashed border-white rounded-full mb-6"></div>
             <p className="text-[9px] font-bold uppercase tracking-[0.3em]">Vault Log Empty</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default TaskBoard;

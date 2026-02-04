
import { User, Document, ChatMessage, Task, TimelineEvent } from '../types';
import { MOCK_USERS } from '../constants';

const STORAGE_KEYS = {
  DOCS: 'bourbon_docs_v3',
  MESSAGES: 'bourbon_msgs_v3',
  TASKS: 'bourbon_tasks_v2'
};

const INITIAL_DOCS: Document[] = [
  {
    id: 'doc-1',
    title: 'Small Batch Reserve 2025',
    content: '<h1>Vintage Strategy</h1><p>Welcome to <b>Bourbon-Collaborate</b>. This vault contains the recipe for success.</p>',
    ownerId: '1',
    collaborators: ['1', '2', '3', 'ai-gemini'],
    lastModified: Date.now(),
    category: 'Work',
    status: 'Distilling',
    timeline: [
      { id: 'e1', type: 'creation', label: 'Cask Initialized', timestamp: Date.now() - 86400000, userId: '2' },
      { id: 'e2', type: 'collaboration', label: 'Blend Parameters Set', timestamp: Date.now() - 43200000, userId: '1' }
    ]
  }
];

const getStored = <T>(key: string, fallback: T): T => {
  const data = localStorage.getItem(key);
  try {
    return data ? JSON.parse(data) : fallback;
  } catch (e) {
    return fallback;
  }
};

const saveStored = (key: string, data: any) => {
  localStorage.setItem(key, JSON.stringify(data));
};

let documents: Document[] = getStored(STORAGE_KEYS.DOCS, INITIAL_DOCS);
let messagesStore: { [docId: string]: ChatMessage[] } = getStored(STORAGE_KEYS.MESSAGES, {});
let tasksStore: Task[] = getStored(STORAGE_KEYS.TASKS, []);

type EventCallback = (data: any) => void;

class MockSocketServer {
  private listeners: { [event: string]: EventCallback[] } = {};
  
  on(event: string, callback: EventCallback) {
    if (!this.listeners[event]) this.listeners[event] = [];
    this.listeners[event].push(callback);
  }

  emit(event: string, data: any) {
    if (this.listeners[event]) {
      this.listeners[event].forEach(cb => cb(data));
    }
  }

  broadcast(event: string, data: any) {
    setTimeout(() => {
      this.emit(event, data);
    }, 50);
  }
}

export const socket = new MockSocketServer();

export const dbService = {
  getDocuments: async () => {
    return [...documents];
  },
  getDocument: async (id: string) => {
    return documents.find(d => d.id === id);
  },
  saveDocument: async (id: string, content: string) => {
    const idx = documents.findIndex(d => d.id === id);
    if (idx !== -1) {
      documents[idx].content = content;
      documents[idx].lastModified = Date.now();
      
      // Add timeline event for significant edit if none recently
      const lastEvent = documents[idx].timeline[documents[idx].timeline.length - 1];
      if (!lastEvent || (Date.now() - lastEvent.timestamp > 3600000)) {
         documents[idx].timeline.push({
           id: Math.random().toString(36).substr(2, 9),
           type: 'edit',
           label: 'Reserve Body Refined',
           timestamp: Date.now(),
           userId: '1'
         });
      }

      saveStored(STORAGE_KEYS.DOCS, documents);
    }
    return documents[idx];
  },
  createDocument: async (doc: Document) => {
    documents = [doc, ...documents];
    saveStored(STORAGE_KEYS.DOCS, documents);
    return doc;
  },
  deleteDocument: async (id: string) => {
    documents = documents.filter(d => d.id !== id);
    saveStored(STORAGE_KEYS.DOCS, documents);
    delete messagesStore[id];
    saveStored(STORAGE_KEYS.MESSAGES, messagesStore);
    tasksStore = tasksStore.filter(t => t.docId !== id);
    saveStored(STORAGE_KEYS.TASKS, tasksStore);
  },
  getMessages: async (docId: string) => {
    return messagesStore[docId] || [];
  },
  addMessage: async (docId: string, senderId: string, text: string) => {
    const msg: ChatMessage = {
      id: Math.random().toString(36).substr(2, 9),
      senderId,
      text,
      timestamp: Date.now()
    };
    if (!messagesStore[docId]) messagesStore[docId] = [];
    messagesStore[docId].push(msg);
    saveStored(STORAGE_KEYS.MESSAGES, messagesStore);
    socket.broadcast('new-message', { docId, msg });
    return msg;
  },
  getTasks: async (docId: string) => {
    return tasksStore.filter(t => t.docId === docId);
  },
  addTask: async (task: Task) => {
    tasksStore.push(task);
    saveStored(STORAGE_KEYS.TASKS, tasksStore);
    socket.broadcast('task-update', task.docId);
    return task;
  },
  toggleTask: async (taskId: string) => {
    const idx = tasksStore.findIndex(t => t.id === taskId);
    if (idx !== -1) {
      tasksStore[idx].completed = !tasksStore[idx].completed;
      saveStored(STORAGE_KEYS.TASKS, tasksStore);
      socket.broadcast('task-update', tasksStore[idx].docId);
    }
  },
  deleteTask: async (taskId: string) => {
    const task = tasksStore.find(t => t.id === taskId);
    tasksStore = tasksStore.filter(t => t.id !== taskId);
    saveStored(STORAGE_KEYS.TASKS, tasksStore);
    if (task) socket.broadcast('task-update', task.docId);
  }
};

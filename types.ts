
export interface User {
  id: string;
  username: string;
  email?: string;
  avatar: string;
  color: string;
  isAI?: boolean;
}

export interface CursorPosition {
  userId: string;
  x: number;
  y: number;
}

export interface ChatMessage {
  id: string;
  senderId: string;
  text: string;
  timestamp: number;
}

export interface Task {
  id: string;
  text: string;
  completed: boolean;
  docId: string;
}

export interface TimelineEvent {
  id: string;
  type: 'creation' | 'edit' | 'collaboration' | 'ai_insight';
  label: string;
  timestamp: number;
  userId: string;
}

export interface Document {
  id: string;
  title: string;
  content: string; 
  ownerId: string;
  collaborators: string[];
  lastModified: number;
  category: 'Personal' | 'Work' | 'Private' | 'Archives';
  status: 'Distilling' | 'Aged' | 'Bottled';
  timeline: TimelineEvent[];
  designAssets?: string[]; // URLs or base64 of associated design references
}

export type AppView = 'AUTH' | 'DASHBOARD' | 'EDITOR';

export enum ConnectionStatus {
  CONNECTED = 'CONNECTED',
  CONNECTING = 'CONNECTING',
  DISCONNECTED = 'DISCONNECTED'
}


import React, { useState, useEffect } from 'react';
import { User, Document, AppView } from './types';
import { MOCK_USERS } from './constants';
import { dbService } from './services/mockBackend';
import Auth from './components/Auth';
import Dashboard from './components/Dashboard';
import CollaborationRoom from './components/CollaborationRoom';

const App: React.FC = () => {
  const [view, setView] = useState<AppView>('AUTH');
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [activeDocumentId, setActiveDocumentId] = useState<string | null>(null);
  const [documents, setDocuments] = useState<Document[]>([]);
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  useEffect(() => {
    const loadDocs = async () => {
      const docs = await dbService.getDocuments();
      setDocuments(docs);
    };
    loadDocs();
  }, [view, refreshTrigger]);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
    setView('DASHBOARD');
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setView('AUTH');
    setActiveDocumentId(null);
  };

  const handleCreateDocument = async (title: string, category: string, collaborators: string[]) => {
    if (!currentUser) return;
    const newDoc: Document = {
      id: `doc-${Date.now()}`,
      title: title || 'Aged Spirit Reserve',
      content: '<h1>New Reserve</h1><p>Start documenting the blend here...</p>',
      ownerId: currentUser.id,
      collaborators: collaborators.length > 0 ? collaborators : [currentUser.id, 'ai-gemini'],
      lastModified: Date.now(),
      category: category as any || 'Work',
      status: 'Distilling',
      timeline: [
        { 
          id: Math.random().toString(36).substr(2, 9), 
          type: 'creation', 
          label: 'Cask Initialized', 
          timestamp: Date.now(), 
          userId: currentUser.id 
        }
      ]
    };
    await dbService.createDocument(newDoc);
    setDocuments(prev => [newDoc, ...prev]);
    setActiveDocumentId(newDoc.id);
    setView('EDITOR');
  };

  const handleSelectDoc = (id: string) => {
    setActiveDocumentId(id);
    setView('EDITOR');
  };

  const handleBackToDashboard = () => {
    setView('DASHBOARD');
    setActiveDocumentId(null);
    setRefreshTrigger(prev => prev + 1);
  };

  return (
    <div className="h-screen w-full flex flex-col bg-[#1A0A05] overflow-hidden selection:bg-amber-600/40 selection:text-white">
      {view === 'AUTH' && (
        <Auth onLogin={handleLogin} />
      )}
      
      {view === 'DASHBOARD' && currentUser && (
        <Dashboard 
          documents={documents} 
          currentUser={currentUser}
          onSelectDoc={handleSelectDoc}
          onCreateDoc={handleCreateDocument}
          onLogout={handleLogout}
          onRefresh={() => setRefreshTrigger(prev => prev + 1)}
        />
      )}

      {view === 'EDITOR' && currentUser && activeDocumentId && (
        <CollaborationRoom 
          docId={activeDocumentId} 
          currentUser={currentUser}
          onBack={handleBackToDashboard}
        />
      )}
    </div>
  );
};

export default App;

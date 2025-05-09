
import React, { useState, useEffect } from 'react';
import { ChatInterface } from '@/components/ChatInterface';
import { CommandMenu } from '@/components/CommandMenu';
import { Sidebar } from '@/components/Sidebar';
import { useHotkeys } from '@/hooks/use-hotkeys';
import { ChatSession } from '@/types';

const Index = () => {
  const [isCommandOpen, setIsCommandOpen] = useState(false);
  const [sessions, setSessions] = useState<ChatSession[]>([]);
  const [currentSession, setCurrentSession] = useState<ChatSession | null>(null);

  useHotkeys("ctrl+k", () => {
    setIsCommandOpen(true);
  });

  // Here you would fetch chat sessions from your database
  useEffect(() => {
    // This is a placeholder for actual database fetch logic
    const fetchChats = async () => {
      try {
        // In a real implementation, this would be replaced by a database query
        const dummySessions: ChatSession[] = [];
        setSessions(dummySessions);
      } catch (error) {
        console.error('Error fetching chat sessions:', error);
      }
    };
    
    fetchChats();
  }, []);

  return (
    <div className="min-h-screen flex flex-col bg-neutral-900 text-neutral-100">
      <div className="flex flex-1">
        <Sidebar
          sessions={sessions}
          currentSessionId={currentSession?.id}
          onSessionSelect={(sessionId) => {
            const selected = sessions.find(s => s.id === sessionId);
            if (selected) setCurrentSession(selected);
          }}
          onNewChat={() => {
            // Logic to create a new chat session
          }}
        />
        <div className="flex-1 container mx-auto p-4">
          <div className="bg-neutral-800 border border-neutral-700 rounded-lg shadow-sm overflow-hidden h-[calc(100vh-2rem)]">
            <ChatInterface />
          </div>
        </div>
      </div>
      
      <CommandMenu
        isOpen={isCommandOpen}
        onClose={() => setIsCommandOpen(false)}
        sessions={sessions}
      />
    </div>
  );
};

export default Index;

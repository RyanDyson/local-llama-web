
import React from 'react';
import { ChatSession } from '@/types';
import { PlusCircle } from 'lucide-react';
import { ScrollArea } from '@/components/ui/scroll-area';

interface SidebarProps {
  sessions: ChatSession[];
  currentSessionId?: string;
  onSessionSelect: (sessionId: string) => void;
  onNewChat: () => void;
}

export const Sidebar = ({ 
  sessions, 
  currentSessionId, 
  onSessionSelect, 
  onNewChat 
}: SidebarProps) => {
  return (
    <div className="w-64 border-r border-neutral-700 h-screen bg-neutral-800 p-4">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Chats</h2>
        <button 
          onClick={onNewChat}
          className="p-1 rounded hover:bg-neutral-700 transition-colors"
          aria-label="New Chat"
        >
          <PlusCircle size={20} />
        </button>
      </div>
      
      <ScrollArea className="h-[calc(100vh-4rem)]">
        <div className="space-y-1">
          {sessions.length > 0 ? (
            sessions.map((session) => (
              <button
                key={session.id}
                className={`w-full text-left px-3 py-2 rounded-md text-sm ${
                  session.id === currentSessionId 
                    ? 'bg-neutral-700 text-white' 
                    : 'hover:bg-neutral-700/50'
                }`}
                onClick={() => onSessionSelect(session.id)}
              >
                {session.title}
              </button>
            ))
          ) : (
            <div className="text-neutral-400 text-sm text-center py-4">
              No chat history
            </div>
          )}
        </div>
      </ScrollArea>
    </div>
  );
};


import React from 'react';
import { ChatInterface } from '@/components/ChatInterface';

const Index = () => {
  return (
    <div className="min-h-screen flex flex-col bg-background text-foreground">
      <div className="flex-1 container mx-auto p-4">
        <div className="bg-card border rounded-lg shadow-sm overflow-hidden h-[calc(100vh-2rem)]">
          <ChatInterface />
        </div>
      </div>
    </div>
  );
};

export default Index;

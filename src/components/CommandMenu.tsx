
import React from 'react';
import { 
  CommandDialog, 
  CommandInput, 
  CommandList, 
  CommandEmpty, 
  CommandGroup, 
  CommandItem 
} from '@/components/ui/command';
import { ChatSession } from '@/types';
import { Search, MessageSquare, Plus } from 'lucide-react';

interface CommandMenuProps {
  isOpen: boolean;
  onClose: () => void;
  sessions: ChatSession[];
}

export const CommandMenu = ({ isOpen, onClose, sessions }: CommandMenuProps) => {
  return (
    <CommandDialog open={isOpen} onOpenChange={onClose}>
      <CommandInput placeholder="Search chats..." />
      <CommandList>
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Actions">
          <CommandItem onSelect={() => {
            // Create new chat logic
            onClose();
          }}>
            <Plus className="mr-2 h-4 w-4" />
            <span>New Chat</span>
          </CommandItem>
        </CommandGroup>
        
        {sessions.length > 0 && (
          <CommandGroup heading="Recent Chats">
            {sessions.map((session) => (
              <CommandItem
                key={session.id}
                onSelect={() => {
                  // Select chat logic
                  onClose();
                }}
              >
                <MessageSquare className="mr-2 h-4 w-4" />
                <span>{session.title}</span>
              </CommandItem>
            ))}
          </CommandGroup>
        )}
      </CommandList>
    </CommandDialog>
  );
};

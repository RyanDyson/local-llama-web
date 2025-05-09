
import React from 'react';
import { Message as MessageType } from '@/types';
import { Avatar } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { User } from 'lucide-react';

interface MessageProps {
  message: MessageType;
  isLatest: boolean;
}

export const Message: React.FC<MessageProps> = ({ message, isLatest }) => {
  const { role, content, timestamp } = message;
  
  const formattedTime = new Intl.DateTimeFormat('en-US', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(timestamp);

  const isUser = role === 'user';
  const isSystem = role === 'system';

  if (isSystem) {
    return (
      <div className="px-4 py-2 text-center text-sm text-muted-foreground">
        <div className="italic">{content}</div>
      </div>
    );
  }

  return (
    <div
      className={cn(
        "flex gap-3 p-4",
        isUser ? "bg-muted/50" : "bg-background",
        isLatest && "message-appear"
      )}
    >
      <Avatar className={cn(
        "h-8 w-8 rounded-md",
        isUser ? "bg-primary" : "bg-accent"
      )}>
        {isUser ? (
          <User className="h-4 w-4 text-primary-foreground" />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-accent-foreground font-semibold">
            AI
          </div>
        )}
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <div className="font-medium">
            {isUser ? 'You' : 'Assistant'}
          </div>
          <div className="text-xs text-muted-foreground">
            {formattedTime}
          </div>
        </div>
        <div className="mt-1 whitespace-pre-wrap">{content}</div>
      </div>
    </div>
  );
};

export const TypingIndicator: React.FC = () => {
  return (
    <div className="flex gap-3 p-4">
      <Avatar className="h-8 w-8 rounded-md bg-accent">
        <div className="flex h-full w-full items-center justify-center text-accent-foreground font-semibold">
          AI
        </div>
      </Avatar>
      <div className="flex-1">
        <div className="flex items-center gap-2">
          <div className="font-medium">Assistant</div>
        </div>
        <div className="mt-1">
          <div className="typing-indicator">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
};

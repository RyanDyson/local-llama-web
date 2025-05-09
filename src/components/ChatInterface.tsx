
import React, { useState, useRef, useEffect } from 'react';
import { Textarea } from '@/components/ui/textarea';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { toast } from 'sonner';
import { Message as MessageType, GenerationSettings } from '@/types';
import { Message, TypingIndicator } from '@/components/Message';
import { ModelSelector } from '@/components/ModelSelector';
import { ConnectionStatus } from '@/components/ConnectionStatus';
import { SettingsDialog } from '@/components/SettingsDialog';
import ollamaClient from '@/lib/ollamaClient';
import { Send } from 'lucide-react';

export const ChatInterface: React.FC = () => {
  const [messages, setMessages] = useState<MessageType[]>([
    {
      role: 'system',
      content: 'This is a conversation with your AI assistant. You can ask questions or have a discussion.',
      timestamp: new Date(),
    }
  ]);
  const [input, setInput] = useState('');
  const [model, setModel] = useState('');
  const [isGenerating, setIsGenerating] = useState(false);
  const [settings, setSettings] = useState<GenerationSettings>({
    temperature: 0.7,
    top_p: 0.9,
    top_k: 40,
    max_tokens: 2048,
    presence_penalty: 0,
    frequency_penalty: 0,
    stop: [],
  });

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  const handleSendMessage = async () => {
    if (!input.trim() || isGenerating || !model) {
      if (!model) {
        toast.error('Please select a model first');
      }
      return;
    }

    const userMessage: MessageType = {
      role: 'user',
      content: input.trim(),
      timestamp: new Date(),
    };

    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsGenerating(true);

    try {
      let fullResponse = '';

      // Start with an empty assistant message
      const assistantMessage: MessageType = {
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      };
      
      setMessages(prev => [...prev, assistantMessage]);
      
      fullResponse = await ollamaClient.generateCompletion(
        messages.concat(userMessage),
        model,
        settings,
        (chunk) => {
          setMessages(prev => {
            const updatedMessages = [...prev];
            // Find the last message (which should be the assistant message)
            const lastMessage = updatedMessages[updatedMessages.length - 1];
            if (lastMessage.role === 'assistant') {
              lastMessage.content += chunk;
            }
            return updatedMessages;
          });
        }
      );

    } catch (error) {
      console.error('Error generating response:', error);
      toast.error('Error generating response. Check console for details.');
      
      // Add an error message
      setMessages(prev => [
        ...prev, 
        {
          role: 'system',
          content: 'Failed to generate a response. Please check if Ollama is running correctly.',
          timestamp: new Date(),
        }
      ]);
    } finally {
      setIsGenerating(false);
      if (textareaRef.current) {
        textareaRef.current.focus();
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col h-full">
      <div className="p-4 border-b flex items-center justify-between gap-4">
        <div className="flex-1">
          <h1 className="text-xl font-bold">Ollama Chat</h1>
          <ConnectionStatus />
        </div>
        <div className="flex items-center gap-2">
          <div className="w-48">
            <ModelSelector 
              value={model} 
              onValueChange={setModel} 
              disabled={isGenerating} 
            />
          </div>
          <SettingsDialog 
            settings={settings} 
            onSettingsChange={setSettings} 
          />
        </div>
      </div>
      
      <ScrollArea className="flex-1 px-4">
        <div className="py-4 space-y-0.5">
          {messages.map((message, index) => (
            <Message 
              key={index} 
              message={message} 
              isLatest={index === messages.length - 1} 
            />
          ))}
          {isGenerating && <TypingIndicator />}
          <div ref={messagesEndRef} />
        </div>
      </ScrollArea>
      
      <div className="p-4 border-t">
        <div className="flex gap-2">
          <Textarea
            ref={textareaRef}
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Send a message..."
            className="resize-none min-h-[60px]"
            disabled={isGenerating}
          />
          <Button 
            onClick={handleSendMessage} 
            disabled={isGenerating || !input.trim() || !model} 
            className="self-end"
          >
            <Send className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

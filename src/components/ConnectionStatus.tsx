
import React, { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import ollamaClient from '@/lib/ollamaClient';

export const ConnectionStatus = () => {
  const [isConnected, setIsConnected] = useState<boolean | null>(null);
  const [checking, setChecking] = useState(false);

  const checkConnection = async () => {
    setChecking(true);
    try {
      const connected = await ollamaClient.checkConnection();
      setIsConnected(connected);
    } catch (error) {
      console.error('Error checking connection:', error);
      setIsConnected(false);
    } finally {
      setChecking(false);
    }
  };

  useEffect(() => {
    checkConnection();
    
    // Check connection every 30 seconds
    const interval = setInterval(checkConnection, 30000);
    
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-2">
      <div
        className={cn(
          "h-3 w-3 rounded-full",
          isConnected === null ? "bg-gray-400" : 
          isConnected ? "bg-green-500" : "bg-red-500"
        )}
      />
      <span className="text-sm">
        {isConnected === null 
          ? "Checking connection..." 
          : isConnected 
            ? "Connected to Ollama" 
            : "Disconnected"}
      </span>
      {!isConnected && (
        <button 
          onClick={checkConnection}
          disabled={checking}
          className="text-xs underline hover:text-primary ml-2"
        >
          {checking ? "Checking..." : "Retry"}
        </button>
      )}
    </div>
  );
};

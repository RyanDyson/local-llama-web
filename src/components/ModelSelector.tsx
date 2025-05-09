
import React, { useEffect, useState } from 'react';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import ollamaClient from '@/lib/ollamaClient';
import { Model } from '@/types';
import { toast } from 'sonner';

interface ModelSelectorProps {
  value: string;
  onValueChange: (value: string) => void;
  disabled?: boolean;
}

export const ModelSelector: React.FC<ModelSelectorProps> = ({
  value,
  onValueChange,
  disabled = false,
}) => {
  const [models, setModels] = useState<Model[]>([]);
  const [loading, setLoading] = useState(false);

  const loadModels = async () => {
    setLoading(true);
    try {
      const modelList = await ollamaClient.listModels();
      setModels(modelList);
      
      // If we have models but none selected, select the first one
      if (modelList.length > 0 && (!value || !modelList.find(m => m.name === value))) {
        onValueChange(modelList[0].name);
      }
    } catch (error) {
      console.error('Failed to load models:', error);
      toast.error('Failed to load models. Make sure Ollama is running.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadModels();
  }, []);

  return (
    <div className="flex flex-col">
      <div className="flex items-center justify-between mb-1">
        <label className="text-sm font-medium">Model</label>
        <button
          onClick={loadModels}
          disabled={loading}
          className="text-xs text-muted-foreground hover:text-foreground"
        >
          {loading ? 'Loading...' : 'Refresh'}
        </button>
      </div>
      <Select
        value={value}
        onValueChange={onValueChange}
        disabled={disabled || loading}
      >
        <SelectTrigger>
          <SelectValue placeholder="Select model" />
        </SelectTrigger>
        <SelectContent>
          {models.length === 0 ? (
            <SelectItem value="no-models" disabled>
              No models found
            </SelectItem>
          ) : (
            models.map((model) => (
              <SelectItem key={model.name} value={model.name}>
                {model.name}
              </SelectItem>
            ))
          )}
        </SelectContent>
      </Select>
    </div>
  );
};

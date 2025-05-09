export interface Message {
  role: 'user' | 'assistant' | 'system';
  content: string;
  timestamp: Date;
}

export interface Model {
  name: string;
  modified_at: string;
  size: number;
  digest: string;
  details: {
    parameter_count: string;
    family: string;
    // Other model details
  };
}

export interface GenerationSettings {
  temperature: number;
  top_p: number;
  top_k: number;
  max_tokens: number;
  presence_penalty: number;
  frequency_penalty: number;
  stop: string[];
}

export interface ChatSession {
  id: string;
  title: string;
  messages: Message[];
  model: string;
  settings: GenerationSettings;
}


import { Message, Model, GenerationSettings } from '../types';

const DEFAULT_API_URL = 'http://localhost:11434';

export class OllamaClient {
  private apiUrl: string;
  
  constructor(apiUrl: string = DEFAULT_API_URL) {
    this.apiUrl = apiUrl;
  }

  public async listModels(): Promise<Model[]> {
    try {
      const response = await fetch(`${this.apiUrl}/api/tags`);
      
      if (!response.ok) {
        throw new Error(`Failed to fetch models: ${response.statusText}`);
      }
      
      const data = await response.json();
      return data.models || [];
    } catch (error) {
      console.error('Error fetching models:', error);
      throw error;
    }
  }

  public async checkConnection(): Promise<boolean> {
    try {
      const response = await fetch(`${this.apiUrl}/api/version`);
      return response.ok;
    } catch (error) {
      console.error('Error connecting to Ollama:', error);
      return false;
    }
  }

  public async generateCompletion(
    messages: Message[],
    model: string,
    settings: GenerationSettings,
    onChunk?: (chunk: string) => void
  ): Promise<string> {
    try {
      const formattedMessages = messages.map(msg => ({
        role: msg.role,
        content: msg.content
      }));

      const response = await fetch(`${this.apiUrl}/api/chat`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          model,
          messages: formattedMessages,
          stream: !!onChunk,
          options: {
            temperature: settings.temperature,
            top_p: settings.top_p,
            top_k: settings.top_k,
            num_predict: settings.max_tokens,
            presence_penalty: settings.presence_penalty,
            frequency_penalty: settings.frequency_penalty,
            stop: settings.stop,
          }
        }),
      });

      if (!response.ok) {
        throw new Error(`Failed to generate completion: ${response.statusText}`);
      }

      if (onChunk) {
        let fullResponse = '';
        const reader = response.body?.getReader();
        
        if (!reader) {
          throw new Error('Failed to get response reader');
        }
        
        while (true) {
          const { done, value } = await reader.read();
          
          if (done) {
            break;
          }
          
          const chunk = new TextDecoder().decode(value);
          try {
            const jsonChunks = chunk.split('\n').filter(Boolean);
            
            for (const jsonChunk of jsonChunks) {
              const parsedChunk = JSON.parse(jsonChunk);
              if (parsedChunk.message?.content) {
                fullResponse += parsedChunk.message.content;
                onChunk(parsedChunk.message.content);
              }
            }
          } catch (error) {
            console.error('Error parsing chunk:', error);
          }
        }
        
        return fullResponse;
      } else {
        const data = await response.json();
        return data.message?.content || '';
      }
    } catch (error) {
      console.error('Error generating completion:', error);
      throw error;
    }
  }
}

// Create a default instance for easier imports
const ollamaClient = new OllamaClient();
export default ollamaClient;

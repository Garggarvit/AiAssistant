import { WebLLM } from 'webllm';

export class LLMService {
  private llm: any;
  private initialized: boolean = false;

  async initialize() {
    if (!this.initialized) {
      this.llm = new WebLLM({
        model: 'llama-2-7b-chat',
        modelPath: '~/assets/models',
        useGPU: true
      });
      await this.llm.load();
      this.initialized = true;
    }
  }

  async processQuery(text: string): Promise<string> {
    if (!this.initialized) {
      await this.initialize();
    }

    try {
      const response = await this.llm.chat([
        {
          role: 'user',
          content: text
        }
      ]);
      return response.content;
    } catch (error) {
      console.error('LLM processing error:', error);
      return "I'm sorry, I couldn't process that request offline.";
    }
  }
}
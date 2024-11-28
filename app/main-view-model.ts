import { Observable } from '@nativescript/core';
import { SpeechRecognitionService } from './services/speech-recognition.service';
import { CommandProcessorService } from './services/command-processor.service';
import { LLMService } from './services/llm.service';
import { WakeWordService } from './services/wake-word.service';

export class AssistantViewModel extends Observable {
  private speechService: SpeechRecognitionService;
  private commandProcessor: CommandProcessorService;
  private llmService: LLMService;
  private wakeWordService: WakeWordService;
  private _isListening: boolean = false;
  private _response: string = '';
  private _isWakeWordActive: boolean = true;

  constructor() {
    super();
    this.speechService = new SpeechRecognitionService();
    this.commandProcessor = new CommandProcessorService();
    this.llmService = new LLMService();
    this.wakeWordService = new WakeWordService();
    
    this.llmService.initialize();
    this.initializeWakeWordDetection();
  }

  private initializeWakeWordDetection() {
    this.wakeWordService.startListening(() => {
      // Wake word detected, start listening for commands
      this.startListening();
    });
  }

  get isListening(): boolean {
    return this._isListening;
  }

  set isListening(value: boolean) {
    if (this._isListening !== value) {
      this._isListening = value;
      this.notifyPropertyChange('isListening', value);
    }
  }

  get response(): string {
    return this._response;
  }

  set response(value: string) {
    if (this._response !== value) {
      this._response = value;
      this.notifyPropertyChange('response', value);
    }
  }

  get isWakeWordActive(): boolean {
    return this._isWakeWordActive;
  }

  set isWakeWordActive(value: boolean) {
    if (this._isWakeWordActive !== value) {
      this._isWakeWordActive = value;
      this.notifyPropertyChange('isWakeWordActive', value);
      
      if (value) {
        this.wakeWordService.startListening(() => this.startListening());
      } else {
        this.wakeWordService.stopListening();
      }
    }
  }

  async startListening() {
    this.isListening = true;
    try {
      const speech = await this.speechService.startListening();
      this.processCommand(speech);
    } catch (error) {
      console.error('Speech recognition error:', error);
      this.response = "Sorry, I couldn't hear that properly.";
    } finally {
      this.isListening = false;
      // Resume wake word detection after command processing
      if (this.isWakeWordActive) {
        this.wakeWordService.startListening(() => this.startListening());
      }
    }
  }

  async processCommand(speech: string) {
    try {
      // First try to process as a system command
      const commandResponse = await this.commandProcessor.processCommand(speech);
      if (commandResponse !== "I'm sorry, I didn't understand that command.") {
        this.response = commandResponse;
        return;
      }

      // If not a system command, use LLM for general conversation
      const llmResponse = await this.llmService.processQuery(speech);
      this.response = llmResponse;
    } catch (error) {
      console.error('Command processing error:', error);
      this.response = "Sorry, I couldn't process that command.";
    }
  }

  toggleWakeWordDetection() {
    this.isWakeWordActive = !this.isWakeWordActive;
  }
}
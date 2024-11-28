import { Observable } from '@nativescript/core';
import { Porcupine, BuiltInKeyword } from '@picovoice/porcupine-nativescript';

export class WakeWordService extends Observable {
  private porcupine: Porcupine;
  private isListening: boolean = false;
  private readonly WAKE_WORD = BuiltInKeyword.HEY_GOOGLE; // We'll use this as a placeholder
  
  constructor() {
    super();
    this.initializePorcupine();
  }

  private async initializePorcupine() {
    try {
      this.porcupine = await Porcupine.create([this.WAKE_WORD]);
    } catch (error) {
      console.error('Failed to initialize wake word detection:', error);
    }
  }

  public startListening(onWakeWordDetected: () => void) {
    if (this.isListening) return;
    
    this.isListening = true;
    this.porcupine.start((keywordIndex: number) => {
      if (keywordIndex === 0) { // Wake word detected
        onWakeWordDetected();
      }
    });
  }

  public stopListening() {
    if (!this.isListening) return;
    
    this.isListening = false;
    this.porcupine.stop();
  }

  public isWakeWordDetectionActive(): boolean {
    return this.isListening;
  }

  public destroy() {
    if (this.porcupine) {
      this.porcupine.delete();
    }
  }
}
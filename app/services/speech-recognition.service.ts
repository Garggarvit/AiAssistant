import { Application } from '@nativescript/core';

export class SpeechRecognitionService {
  private recognizer: any;

  constructor() {
    // Initialize speech recognition
    if (global.isAndroid) {
      const SpeechRecognizer = android.speech.SpeechRecognizer;
      this.recognizer = SpeechRecognizer.createSpeechRecognizer(Application.android.context);
    } else if (global.isIOS) {
      // iOS Speech Recognition initialization
      this.recognizer = SFSpeechRecognizer.alloc().init();
    }
  }

  async startListening(): Promise<string> {
    return new Promise((resolve, reject) => {
      if (global.isAndroid) {
        // Android implementation
        const intent = new android.content.Intent(android.speech.RecognizerIntent.ACTION_RECOGNIZE_SPEECH);
        intent.putExtra(android.speech.RecognizerIntent.EXTRA_LANGUAGE_MODEL,
                       android.speech.RecognizerIntent.LANGUAGE_MODEL_FREE_FORM);
        
        // Start listening
        this.recognizer.startListening(intent);
      } else if (global.isIOS) {
        // iOS implementation
        const audioEngine = AVAudioEngine.new();
        const request = SFSpeechAudioBufferRecognitionRequest.new();
        
        this.recognizer.recognitionTaskWithRequestResultHandler(request, (result, error) => {
          if (error) {
            reject(error);
          } else {
            resolve(result.bestTranscription.formattedString);
          }
        });
      }
    });
  }

  stopListening() {
    if (global.isAndroid) {
      this.recognizer.stopListening();
    } else if (global.isIOS) {
      // Stop iOS recognition
    }
  }
}
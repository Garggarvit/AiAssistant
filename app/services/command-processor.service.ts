import { Injectable } from '@nativescript/core';
import { LocalNotifications } from '@nativescript/local-notifications';
import { Phone } from '@nativescript/phone';
import { Contacts } from '@nativescript/contacts';
import { MediaPlayer } from '@nativescript/media';

@Injectable()
export class CommandProcessorService {
  private mediaPlayer: MediaPlayer;

  constructor() {
    this.mediaPlayer = new MediaPlayer();
  }

  async processCommand(command: string): Promise<string> {
    command = command.toLowerCase();

    // Message commands
    if (command.includes('send a text message')) {
      return this.handleMessageCommand(command);
    }

    // Call commands
    if (command.includes('call')) {
      return this.handleCallCommand(command);
    }

    // Timer and alarm commands
    if (command.includes('set a timer') || command.includes('set an alarm')) {
      return this.handleTimeCommand(command);
    }

    // Music commands
    if (command.includes('play') || command.includes('pause') || command.includes('stop')) {
      return this.handleMusicCommand(command);
    }

    return "I'm sorry, I didn't understand that command.";
  }

  private async handleMessageCommand(command: string): Promise<string> {
    const matches = command.match(/send a text message to (\w+) that (.+)/i);
    if (matches) {
      const [_, recipient, message] = matches;
      const contact = await this.findContact(recipient);
      if (contact) {
        await Phone.sms([contact.phoneNumbers[0]], message);
        return `Message sent to ${recipient}`;
      }
      return `Couldn't find contact ${recipient}`;
    }
    return "Could not process message command";
  }

  private async handleCallCommand(command: string): Promise<string> {
    const matches = command.match(/call (\w+)/i);
    if (matches) {
      const [_, recipient] = matches;
      const contact = await this.findContact(recipient);
      if (contact) {
        const speakerMode = command.includes('on speaker');
        await Phone.dial(contact.phoneNumbers[0], speakerMode);
        return `Calling ${recipient}${speakerMode ? ' on speaker' : ''}`;
      }
      return `Couldn't find contact ${recipient}`;
    }
    return "Could not process call command";
  }

  private async handleTimeCommand(command: string): Promise<string> {
    if (command.includes('timer')) {
      const minutes = parseInt(command.match(/(\d+)/)[0]);
      LocalNotifications.schedule([{
        title: 'Timer',
        body: 'Your timer is complete!',
        at: new Date(Date.now() + minutes * 60000)
      }]);
      return `Timer set for ${minutes} minutes`;
    } else if (command.includes('alarm')) {
      // Parse time and set alarm
      const timeMatch = command.match(/(\d+)(?::(\d+))?\s*(am|pm)?/i);
      if (timeMatch) {
        // Implementation for alarm setting
        return "Alarm has been set";
      }
    }
    return "Could not process time command";
  }

  private async handleMusicCommand(command: string): Promise<string> {
    if (command.includes('play')) {
      if (command.includes('from my spotify')) {
        // Implement Spotify integration
        const songName = command.split('play ')[1].split(' from')[0];
        return `Playing ${songName} from Spotify`;
      }
      this.mediaPlayer.play();
      return "Playing music";
    } else if (command.includes('pause')) {
      this.mediaPlayer.pause();
      return "Music paused";
    } else if (command.includes('stop')) {
      this.mediaPlayer.stop();
      return "Music stopped";
    }
    return "Could not process music command";
  }

  private async findContact(name: string): Promise<any> {
    const contacts = await Contacts.getContact();
    return contacts.find(contact => 
      contact.name.toLowerCase().includes(name.toLowerCase())
    );
  }
}
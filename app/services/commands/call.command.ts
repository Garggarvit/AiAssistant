import { Phone } from '@nativescript/phone';
import { ContactsService } from '../contacts/contacts.service';

export class CallCommand {
  constructor(private contactsService: ContactsService) {}

  async execute(command: string): Promise<string> {
    const matches = command.match(/call (\w+)/i);
    if (!matches) {
      return "Could not understand the call command format";
    }

    const [_, recipient] = matches;
    const contact = await this.contactsService.findContact(recipient);
    
    if (!contact) {
      return `Couldn't find contact ${recipient}`;
    }

    try {
      const speakerMode = command.includes('on speaker');
      await Phone.dial(contact.phoneNumbers[0], speakerMode);
      return `Calling ${recipient}${speakerMode ? ' on speaker' : ''}`;
    } catch (error) {
      console.error('Error making call:', error);
      return "Failed to initiate the call";
    }
  }
}
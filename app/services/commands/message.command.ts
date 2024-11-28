import { Phone } from '@nativescript/phone';
import { ContactsService } from '../contacts/contacts.service';

export class MessageCommand {
  constructor(private contactsService: ContactsService) {}

  async execute(command: string): Promise<string> {
    const matches = command.match(/send a text message to (\w+) that (.+)/i);
    if (!matches) {
      return "Could not understand the message command format";
    }

    const [_, recipient, message] = matches;
    const contact = await this.contactsService.findContact(recipient);
    
    if (!contact) {
      return `Couldn't find contact ${recipient}`;
    }

    try {
      await Phone.sms([contact.phoneNumbers[0]], message);
      return `Message sent to ${recipient}`;
    } catch (error) {
      console.error('Error sending message:', error);
      return "Failed to send the message";
    }
  }
}
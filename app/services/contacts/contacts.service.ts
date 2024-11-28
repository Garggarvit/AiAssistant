import { Contacts } from '@nativescript/contacts';

export class ContactsService {
  async findContact(name: string): Promise<any> {
    try {
      const contacts = await Contacts.getContact();
      return contacts.find(contact => 
        contact.name.toLowerCase().includes(name.toLowerCase())
      );
    } catch (error) {
      console.error('Error finding contact:', error);
      return null;
    }
  }

  async getAllContacts(): Promise<any[]> {
    try {
      return await Contacts.getAllContacts();
    } catch (error) {
      console.error('Error getting all contacts:', error);
      return [];
    }
  }
}
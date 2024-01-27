// contacts.js
import fs from 'fs/promises';
import path from 'path';
import { nanoid } from 'nanoid';

const contactsPath = path.resolve(process.cwd(), 'db', 'contacts.json');

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8');
    const contacts = JSON.parse(data);
    return contacts;
  } catch (error) {
    console.error(error.message);
  }
}
async function getContactById(contactId) {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8');
    const contacts = JSON.parse(data);
    const contact = contacts.find(element => element.id === contactId);
    if (!contact) {
      return null;
    } else {
      return contact;
    }
  } catch (error) {
    console.error('No contact found.', error);
  }
}

async function removeContact(contactId) {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8');
    const contacts = JSON.parse(data);
    const contact = contacts.find(element => element.id === contactId);
    if (!contact) {
      return null;
    } else {
      const updatedContacts = contacts.filter(
        contact => contact.id !== contactId
      );
      await fs.writeFile(contactsPath, JSON.stringify(updatedContacts));

      return contact;
    }
  } catch (error) {
    console.error(null);
  }
}

// add new contact
async function addContact({ name, email, phone }) {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8');
    const contacts = JSON.parse(data);
    const newContact = { id: nanoid(), name, email, phone };

    const updatedContacts = [...contacts, newContact];
    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts));
    return newContact;
  } catch (error) {
    console.error(error.message);
  }
}
//update contact

async function updateContact(id, contact_data) {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8');
    const contacts = JSON.parse(data);
    const contact = contacts.find(element => element.id === id);
    if (!contact) {
      return null;
    }

    const updated_contact = { ...contact, ...contact_data };
    const filtered_contacts = contacts.filter(contact => contact.id !== id);

    await fs.writeFile(
      contactsPath,
      JSON.stringify([...filtered_contacts, updated_contact])
    );
    return updated_contact;
  } catch (error) {
    console.error(error.message);
  }
}

export {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

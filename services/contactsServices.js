// contacts.js
import fs from 'fs/promises';
import path from 'path';
import nanoid from 'nanoid';
const contactsPath = path.resolve(process.cwd(), 'db', 'contacts.json');
console.log(contactsPath);
const id = nanoid();

async function listContacts() {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8');
    const contacts = JSON.parse(data);
    return console.table(contacts);
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
      const removed_contact = contacts.filter(
        contact => contact.id === contactId
      );
      const deleted_contact = removed_contact[0];
      return deleted_contact;
    }
  } catch (error) {
    console.error(null);
  }
}

// add new contact
async function addContact(name, email, phone) {
  try {
    const data = await fs.readFile(contactsPath, 'utf-8');
    const contacts = JSON.parse(data);
    const newContact = { id, name, email, phone };

    const updatedContacts = [...contacts, newContact];
    await fs.writeFile(contactsPath, JSON.stringify(updatedContacts));
    return newContact;
  } catch (error) {
    console.error(error.message);
  }
}

export { listContacts, getContactById, removeContact, addContact };

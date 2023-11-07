const fs = require("node:fs/promises");
const path = require("node:path");
const { randomUUID } = require("node:crypto");

const contactsPath = path.join(__dirname, "contacts.json");

async function readContacts() {
  const data = await fs.readFile(contactsPath, { encoding: "utf-8" });
  return JSON.parse(data);
}

async function writeContacts(contacts) {
  await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
}

const listContacts = async () => {
  const contacts = await readContacts();
  return contacts;
};

const getContactById = async contactId => {
  const contacts = await readContacts();
  const contact = contacts.find(el => el.id === contactId);
  return contact || null;
};

const removeContact = async contactId => {
  const contacts = await readContacts();
  const index = contacts.findIndex(el => el.id === contactId);
  if (index === -1) {
    return null;
  }
  const [deletedContact] = contacts.splice(index, 1);
  await writeContacts(contacts);
  return deletedContact;
};

const addContact = async body => {
  const contacts = await readContacts();
  const newContact = { id: randomUUID(), ...body };
  contacts.push(newContact);
  await writeContacts(contacts);
  return newContact;
};

const updateContact = async (contactId, body) => {
  const contacts = await readContacts();
  const index = contacts.findIndex(el => el.id === contactId);
  if (index === -1) {
    return null;
  }

  const prevContact = contacts[index];
  contacts[index] = {
    ...prevContact,
    ...body,
  };
  const updatedContact = contacts[index];
  await writeContacts(contacts);
  return updatedContact;
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
};

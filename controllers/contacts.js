const contacts = require("../models/contacts");

const { HttpError, ctrlWrapper } = require("../helpers/");

const getAll = async (req, res) => {
  const result = await contacts.listContacts();
  res.status(200).json(result);
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  const result = await contacts.getContactById(contactId);
  if (!result) {
    throw HttpError(404, "Not found!");
  }
  res.status(200).json(result);
};

const add = async (req, res) => {
  const result = await contacts.addContact(req.body);
  res.status(201).json(result);
};

const deleteById = async (req, res) => {
  const { contactId } = req.params;

  const result = await contacts.removeContact(contactId);
  if (!result) {
    throw HttpError(404, "Not found!");
  }
  res.status(200).json({ message: "Contact deleted!" });
};

const updateById = async (req, res) => {
  const { contactId } = req.params;
  if (!contactId || contactId === "%20") {
    throw HttpError(
      404,
      "Unable to update contact, please enter contact ID if you want to delete it!"
    );
  }
  const result = await contacts.updateContact(contactId, req.body);
  if (result === null) {
    throw HttpError(
      404,
      "Not found! You are trying to update a contact with ID that does not exist!"
    );
  }

  if (!result) {
    throw HttpError(404, "Not found!");
  }

  res.status(200).json(result);
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  add: ctrlWrapper(add),
  updateById: ctrlWrapper(updateById),
  deleteById: ctrlWrapper(deleteById),
};

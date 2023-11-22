const Contact = require("../models/contact");

const { HttpError, ctrlWrapper } = require("../helpers/");

const getAll = async (req, res) => {
  const { _id: owner } = req.user;

  const { page = 1, limit = 20, favorite } = req.query;
  const skip = (page - 1) * limit;

  const query = Contact.find({ owner }, "-createdAt -updatedAt", {
    skip,
    limit,
  }).populate("owner", "email subscription");

  if (favorite) {
    query.where("favorite").equals(favorite);
  }
  const result = await query.exec();

  // щоб видавати всі контакти з бази
  // const result = await Contact.find({}, "-createdAt -updatedAt");

  // щоб видавати контакти з бази лише певного власника їх
  // const result = await Contact.find({ owner }, "-createdAt -updatedAt");

  // щоб видати всю інформацію про власника книги можна використати метод populate()
  // const result = await Contact.find(
  //   { owner },
  //   "-createdAt -updatedAt"
  // ).populate("owner", "email subscription");

  res.status(200).json(result);
};

const getById = async (req, res) => {
  const { contactId } = req.params;
  // перший спосіб
  // const result = await Contact.findOne({_id: contactId})
  // другий спосіб
  const result = await Contact.findById(contactId).exec();
  // щоб заборонити доступ до не своїх контактів
  if (result.owner.toString() !== req.user._id.toString()) {
    // return res.status(403).send("Forbidden");
    // return res.status(404).send("Book not found:(");
    throw HttpError(404, "Not found!");
  }

  if (!result) {
    throw HttpError(404, "Not found!");
  }
  res.status(200).json(result);
};

const add = async (req, res) => {
  const { _id: owner } = req.user;
  const result = await Contact.create({ ...req.body, owner });
  res.status(201).json(result);
};

const deleteById = async (req, res) => {
  const { contactId } = req.params;

  const result = await Contact.findByIdAndDelete(contactId);

  // щоб заборонити доступ до не своїх контактів
  if (result.owner.toString() !== req.user._id.toString()) {
    throw HttpError(404, "Not found!");
  }

  if (!result) {
    throw HttpError(404, "Not found!");
  }
  res.status(200).json({ message: "Contact deleted!" });
};

const updateById = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

  // щоб заборонити доступ до не своїх контактів
  if (result.owner.toString() !== req.user._id.toString()) {
    throw HttpError(404, "Not found!");
  }

  if (!result) {
    throw HttpError(404, "Not found!");
  }

  res.status(200).json(result);
};

const updateStatusContact = async (req, res) => {
  const { contactId } = req.params;
  const result = await Contact.findByIdAndUpdate(contactId, req.body, {
    new: true,
  });

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
  updateStatusContact: ctrlWrapper(updateStatusContact),
};

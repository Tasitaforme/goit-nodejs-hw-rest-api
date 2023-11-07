const express = require("express");
const router = express.Router();
const {
  getAll,
  getById,
  add,
  deleteById,
  updateById,
} = require("../../controllers/contacts");

const { validateBody } = require("../../middlewares");
const {
  addContactSchema,
  updateContactSchema,
} = require("../../schemas/contacts");

router.get("/", getAll);

router.get("/:contactId", getById);

router.post("/", validateBody(addContactSchema), add);

router.delete("/:contactId", deleteById);

router.put("/:contactId", validateBody(updateContactSchema), updateById);

module.exports = router;

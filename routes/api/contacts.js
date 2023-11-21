const express = require("express");
const router = express.Router();
const {
  getAll,
  getById,
  add,
  deleteById,
  updateById,
  updateStatusContact,
} = require("../../controllers/contacts");

const { validateBody, isValidId, authenticate } = require("../../middlewares");
const {
  addContactSchema,
  updateContactSchema,
  updateFavoriteSchema,
} = require("../../schemas/contacts");

router.get("/", authenticate, getAll);

router.get("/:contactId", authenticate, isValidId, getById);

router.post("/", authenticate, validateBody(addContactSchema), add);

router.delete("/:contactId", authenticate, isValidId, deleteById);

router.put(
  "/:contactId",
  authenticate,
  isValidId,
  validateBody(updateContactSchema),
  updateById
);

router.patch(
  "/:contactId/favorite",
  authenticate,
  isValidId,
  validateBody(updateFavoriteSchema),
  updateStatusContact
);

module.exports = router;

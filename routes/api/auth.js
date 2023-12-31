const express = require("express");
const {
  validateBody,
  authenticate,
  isValidId,
  uploadAvatar,
} = require("../../middlewares");
const {
  registerJoiSchema,
  loginJoiSchema,
  subscriptionJoiSchema,
  emailSchema,
} = require("../../schemas/users");
const ctrl = require("../../controllers/auth");
const router = express.Router();

// signup
router.post("/register", validateBody(registerJoiSchema), ctrl.register);
// signin
router.post("/login", validateBody(loginJoiSchema), ctrl.login);
// verifyEmail
router.get("/verify/:verificationToken", ctrl.verifyEmail);
router.post("/verify", validateBody(emailSchema), ctrl.resendVerifyEmail);

router.get("/current", authenticate, ctrl.getCurrent);

router.post("/logout", authenticate, ctrl.logout);

router.patch(
  "/avatars",
  authenticate,
  uploadAvatar.single("avatar"),
  ctrl.updateAvatar
);

router.get("/avatars", authenticate, ctrl.getAvatar);

router.patch(
  "/:contactId/subscription",
  isValidId,
  authenticate,
  validateBody(subscriptionJoiSchema),
  ctrl.subscription
);

module.exports = router;

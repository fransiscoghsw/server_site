const express = require("express");
const router = express.Router();
const validate = require("../middleware/validationMiddleware");
const authAdminController = require("../controllers/authAdminController");

const { loginSchema } = require("../validators/authAdminValidation");

const {
    authenticateAdminToken,
    logout,
} = require("../middleware/authenticateAdminToken");

router.post("/login", validate(loginSchema), authAdminController.login);

// Protected route
router.get(
    "/protected",
    authenticateAdminToken(["Super Admin", "Admin"]),
    authAdminController.protected,
);

router.post("/refresh-token", authAdminController.refreshToken);

router.post("/logout", logout);

router.post("/reset-password", authAdminController.resetPassword);
router.post(
    "/request-password-reset",
    authAdminController.requestPasswordReset,
);

module.exports = router;

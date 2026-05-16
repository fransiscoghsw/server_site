const express = require("express");
const router = express.Router();
const kontakFrontpageController = require("../controllers/kontakFrontpageController");

// Auth
const {
    authenticateAdminToken,
} = require("../middleware/authenticateAdminToken");

const { upsertSchema } = require("../validators/kontakFrontpageValidation");
const validate = require("../middleware/validationMiddleware");

router.post(
    "/",
    authenticateAdminToken(["Super Admin", "Admin", "Public Relation"]),
    validate(upsertSchema),
    kontakFrontpageController.upsert,
);
router.get("/", kontakFrontpageController.findData);

module.exports = router;

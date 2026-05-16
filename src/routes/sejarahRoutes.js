// routes/artikelRoutes.js
const express = require("express");
const router = express.Router();
const sejarahController = require("../controllers/sejarahController");
const validate = require("../middleware/validationMiddleware");
const { upsertSchema } = require("../validators/sejarahValidation");

// Auth
const {
    authenticateAdminToken,
} = require("../middleware/authenticateAdminToken");

router.post(
    "/",
    authenticateAdminToken(["Super Admin", "Admin", "Public Relation"]),
    validate(upsertSchema),
    sejarahController.upsert,
);
router.get("/", sejarahController.findData);

module.exports = router;

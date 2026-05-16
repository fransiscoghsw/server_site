const express = require("express");
const router = express.Router();
const validate = require("../middleware/validationMiddleware");
const faqController = require("../controllers/faqController");

const {
    createFaqSchema,
    updateFaqSchema,
} = require("../validators/faqValidation");

// Auth
const {
    authenticateAdminToken,
} = require("../middleware/authenticateAdminToken");

router.post(
    "/",
    authenticateAdminToken(["Super Admin", "Admin", "Public Relation"]),
    validate(createFaqSchema),
    faqController.create,
);
router.get("/", faqController.getAll);
router.get("/:id", faqController.getOne);
router.put(
    "/:id",
    authenticateAdminToken(["Super Admin", "Admin", "Public Relation"]),
    validate(updateFaqSchema),
    faqController.update,
);
router.delete(
    "/:id",
    authenticateAdminToken(["Super Admin", "Admin", "Public Relation"]),
    faqController.delete,
);

module.exports = router;

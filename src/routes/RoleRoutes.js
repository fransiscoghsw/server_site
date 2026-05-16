const express = require("express");
const router = express.Router();
const validate = require("../middleware/validationMiddleware");
const roleController = require("../controllers/roleController");

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
    authenticateAdminToken("Super Admin"),
    validate(createFaqSchema),
    roleController.create,
);
router.get("/", roleController.getAll);
router.get("/:id", roleController.getOne);
router.put(
    "/:id",
    authenticateAdminToken("Super Admin"),
    validate(updateFaqSchema),
    roleController.update,
);
router.delete(
    "/:id",
    authenticateAdminToken("Super Admin"),
    roleController.delete,
);

module.exports = router;

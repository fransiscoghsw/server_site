const express = require("express");
const router = express.Router();

// Controller
const eCommerceProductController = require("../controllers/eCommerceProductController");

// Validation
const validate = require("../middleware/validationMiddleware");
const {
    createSchema,
    updateSchema,
} = require("../validators/eCommerceProductValidation");

// auth
const {
    authenticateAdminToken,
} = require("../middleware/authenticateAdminToken");

router.post(
    "/",
    authenticateAdminToken(["Super Admin", "Admin"]),
    validate(createSchema),
    eCommerceProductController.create,
);
router.put(
    "/:id",
    authenticateAdminToken(["Super Admin", "Admin"]),
    validate(updateSchema),
    eCommerceProductController.update,
);
router.get(
    "/",
    authenticateAdminToken(["Super Admin", "Admin"]),
    eCommerceProductController.findAll,
);
router.get(
    "/:id",
    authenticateAdminToken(["Super Admin", "Admin"]),
    eCommerceProductController.findOne,
);
router.delete(
    "/:id",
    authenticateAdminToken(["Super Admin", "Admin"]),
    eCommerceProductController.delete,
);

module.exports = router;

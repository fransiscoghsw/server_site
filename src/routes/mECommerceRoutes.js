const express = require("express");
const router = express.Router();

// Controller
const mECommerceController = require("../controllers/mECommerceController");

// Validation
const validate = require("../middleware/validationMiddleware");
const {
    createSchema,
    updateSchema,
} = require("../validators/mECommerceValidation");

// Validate Image
const upload = require("../middleware/uploadFileMiddleware");
const {
    validateUploadFile,
} = require("../middleware/validationUploadFileMiddleware");

// auth
const {
    authenticateAdminToken,
} = require("../middleware/authenticateAdminToken");

router.post(
    "/",
    authenticateAdminToken(["Super Admin", "Admin"]),
    upload.single("icon"),
    validateUploadFile({
        fieldName: "icon",
    }),
    validate(createSchema),
    mECommerceController.create,
);
router.put(
    "/:id",
    authenticateAdminToken(["Super Admin", "Admin"]),
    upload.single("icon"),
    validateUploadFile({
        fieldName: "icon",
        required: false,
    }),
    validate(updateSchema),
    mECommerceController.update,
);
router.get("/", mECommerceController.findAll);
router.get("/:id", mECommerceController.findOne);
router.delete(
    "/:id",
    authenticateAdminToken(["Super Admin", "Admin"]),
    mECommerceController.delete,
);
router.get("/image/:icon", mECommerceController.getImageByName);

module.exports = router;

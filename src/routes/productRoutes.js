const express = require("express");
const router = express.Router();

// Controller
const productController = require("../controllers/productController");

// Validation
const validate = require("../middleware/validationMiddleware");
const {
    createSchema,
    updateSchema,
} = require("../validators/productValidation");

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
    upload.single("image"),
    validateUploadFile({
        fieldName: "image",
    }),
    validate(createSchema),
    productController.create,
);
router.put(
    "/:id",
    authenticateAdminToken(["Super Admin", "Admin"]),
    upload.single("image"),
    validateUploadFile({
        fieldName: "image",
        required: false,
    }),
    validate(updateSchema),
    productController.update,
);
router.get("/", productController.findAll);
router.get("/:id", productController.findOne);
router.delete(
    "/:id",
    authenticateAdminToken(["Super Admin", "Admin"]),
    productController.delete,
);
router.get("/image/:image", productController.getImageByName);

module.exports = router;

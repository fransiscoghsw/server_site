const express = require("express");
const router = express.Router();
const customerControlller = require("../controllers/customerController");
const upload = require("../middleware/uploadFileMiddleware");
const {
    validateUploadFile,
} = require("../middleware/validationUploadFileMiddleware");

const validate = require("../middleware/validationMiddleware");
const {
    createSchema,
    updateSchema,
} = require("../validators/customerValidation");

// Auth
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
    customerControlller.create,
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
    customerControlller.update,
);
router.get("/", customerControlller.findAll);
router.get("/:id", customerControlller.findOne);
router.delete(
    "/:id",
    authenticateAdminToken(["Super Admin", "Admin"]),
    customerControlller.delete,
);
router.get("/image/:gambar", customerControlller.getImageByName);

module.exports = router;

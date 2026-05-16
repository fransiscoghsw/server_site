const express = require("express");
const router = express.Router();
const partnerControlller = require("../controllers/partnerController");
const upload = require("../middleware/uploadFileMiddleware");
const {
    validateUploadFile,
} = require("../middleware/validationUploadFileMiddleware");

const validate = require("../middleware/validationMiddleware");
const {
    createSchema,
    updateSchema,
} = require("../validators/partnerValidation");

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
    partnerControlller.create,
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
    partnerControlller.update,
);
router.get("/", partnerControlller.findAll);
router.get("/:id", partnerControlller.findOne);
router.delete(
    "/:id",
    authenticateAdminToken(["Super Admin", "Admin"]),
    partnerControlller.delete,
);
router.get("/image/:gambar", partnerControlller.getImageByName);

module.exports = router;

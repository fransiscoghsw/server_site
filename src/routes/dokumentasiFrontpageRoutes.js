const express = require("express");
const router = express.Router();
const dokumentasiControlller = require("../controllers/dokumentasiFrontapageController");
const upload = require("../middleware/uploadFileMiddleware");
const {
    validateUploadFile,
} = require("../middleware/validationUploadFileMiddleware");

const validate = require("../middleware/validationMiddleware");
const {
    createSchema,
    updateSchema,
} = require("../validators/dokumentasiValidation");

// Auth
const {
    authenticateAdminToken,
} = require("../middleware/authenticateAdminToken");
router.post(
    "/",
    authenticateAdminToken(["Super Admin", "Admin", "Public Relation"]),
    upload.single("image"),
    validateUploadFile({
        fieldName: "image",
    }),
    validate(createSchema),
    dokumentasiControlller.create,
);
router.put(
    "/:id",
    authenticateAdminToken(["Super Admin", "Admin", "Public Relation"]),
    upload.single("image"),
    validateUploadFile({
        fieldName: "image",
        required: false,
    }),
    validate(updateSchema),
    dokumentasiControlller.update,
);
router.get("/", dokumentasiControlller.findAll);
router.get("/:id", dokumentasiControlller.findOne);
router.delete(
    "/:id",
    authenticateAdminToken(["Super Admin", "Admin", "Public Relation"]),
    dokumentasiControlller.delete,
);
router.get("/image/:gambar", dokumentasiControlller.getImageByName);

module.exports = router;

const express = require("express");
const router = express.Router();
const founderController = require("../controllers/founderController");

// Start Validasi
const validate = require("../middleware/validationMiddleware");
const {
    createSchema,
    updateSchema,
} = require("../validators/founderValidation");

const upload = require("../middleware/uploadFileMiddleware");
const {
    validateUploadFile,
} = require("../middleware/validationUploadFileMiddleware");

// Auth
const {
    authenticateAdminToken,
} = require("../middleware/authenticateAdminToken");

router.post(
    "/",
    authenticateAdminToken(["Super Admin", "Admin", "Public Relation"]),
    upload.single("gambar"),
    validateUploadFile({
        fieldName: "gambar",
    }),
    validate(createSchema),
    founderController.create,
);
router.put(
    "/:id",
    authenticateAdminToken(["Super Admin", "Admin", "Public Relation"]),
    upload.single("gambar"),
    validate(updateSchema),
    validateUploadFile({
        fieldName: "gambar",
        required: false,
    }),
    founderController.update,
);
router.get("/", founderController.findAll);
router.get("/:id", founderController.findOne);
router.delete(
    "/:id",
    authenticateAdminToken(["Super Admin", "Admin", "Public Relation"]),
    founderController.delete,
);
router.get("/image/:gambar", founderController.getImageByName);

module.exports = router;

const express = require("express");
const router = express.Router();
const nilaiNilaiPerusahaanController = require("../controllers/nilaiNilaiPerusahaanController");
const upload = require("../middleware/uploadFileMiddleware");
const {
    validateUploadFile,
} = require("../middleware/validationUploadFileMiddleware");

const validate = require("../middleware/validationMiddleware");
const {
    createSchema,
    updateSchema,
} = require("../validators/nilaiNilaiPerusahaanValidation");

// Auth
const {
    authenticateAdminToken,
} = require("../middleware/authenticateAdminToken");

router.post(
    "/",
    upload.single("gambar"),
    authenticateAdminToken(["Super Admin", "Admin", "Public Relation"]),
    validateUploadFile({
        fieldName: "gambar",
    }),
    validate(createSchema),
    nilaiNilaiPerusahaanController.create,
);
router.get("/", nilaiNilaiPerusahaanController.findAll);
router.get("/:id", nilaiNilaiPerusahaanController.findOne);
router.put(
    "/:id",
    authenticateAdminToken(["Super Admin", "Admin", "Public Relation"]),
    upload.single("gambar"),
    validateUploadFile({
        fieldName: "gambar",
        required: false,
    }),
    validate(updateSchema),
    nilaiNilaiPerusahaanController.update,
);
router.delete(
    "/:id",
    authenticateAdminToken(["Super Admin", "Admin", "Public Relation"]),
    nilaiNilaiPerusahaanController.delete,
);
router.get("/image/:gambar", nilaiNilaiPerusahaanController.getImageByName);

module.exports = router;

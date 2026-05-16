// routes/artikelRoutes.js
const express = require("express");
const router = express.Router();
const tentangKamiContoller = require("../controllers/tentangKamiContoller");
const validate = require("../middleware/validationMiddleware");
const { upsertSchema } = require("../validators/tantangKamiValidation");

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
    upload.single("image_background"),
    validateUploadFile({
        fieldName: "image_background",
        required: false,
    }),
    validate(upsertSchema),
    tentangKamiContoller.upsert,
);
router.get("/", tentangKamiContoller.findData);
router.get("/image/:gambar", tentangKamiContoller.getImageByName);

module.exports = router;

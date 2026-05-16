const express = require("express");
const router = express.Router();

// Controller
const homepageController = require("../controllers/homepageController");

// Upload file
const upload = require("../middleware/uploadFileMiddleware");
const {
    validateUploadFile,
} = require("../middleware/validationUploadFileMiddleware");

// Validate data http
const validate = require("../middleware/validationMiddleware");
const { upsertSchema } = require("../validators/homepageValidation");

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
        required: false,
    }),
    validate(upsertSchema),
    homepageController.upsert,
);

router.get("/", homepageController.findData);

router.get("/image/:imageName", homepageController.getImageByName);

module.exports = router;

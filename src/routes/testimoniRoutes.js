const express = require("express");
const router = express.Router();
const testimoniController = require("../controllers/testimoniController");
const upload = require("../middleware/uploadFileMiddleware");
const {
    validateUploadFile,
} = require("../middleware/validationUploadFileMiddleware");

const validate = require("../middleware/validationMiddleware");
const {
    createSchema,
    updateSchema,
} = require("../validators/testimoniValidation");

// Auth
const { authenticateToken } = require("../middleware/authenticateToken");

router.post(
    "/",
    upload.single("foto"),
    authenticateToken("admin"),
    validateUploadFile({
        fieldName: "foto",
    }),
    validate(createSchema),
    testimoniController.create
);
router.put(
    "/:id",
    authenticateToken("admin"),
    upload.single("foto"),
    validateUploadFile({
        fieldName: "foto",
        required: false,
    }),
    validate(updateSchema),
    testimoniController.update
);
router.get("/", testimoniController.findAll);
router.get("/:id", testimoniController.findOne);
router.delete("/:id", authenticateToken("admin"), testimoniController.delete);
router.get("/image/:gambar", testimoniController.getImageByName);

module.exports = router;

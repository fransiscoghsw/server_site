const express = require("express");
const router = express.Router();

//* START Controller
const adminController = require("../controllers/adminController");
//* END Controller

// Auth
const {
    authenticateAdminToken,
} = require("../middleware/authenticateAdminToken");

//* START Validation
const validate = require("../middleware/validationMiddleware");
const upload = require("../middleware/uploadFileMiddleware");
const {
    validateUploadMultipleFile,
} = require("../middleware/validationUploadMultipleFileMiddleware");
const {
    validateUploadFile,
} = require("../middleware/validationUploadFileMiddleware");

const {
    createAdminSchema,
    updateAdminSchema,
} = require("../validators/adminValidation");

//* END Validation

// START CRUD ADMIN
router.post(
    "/create",
    authenticateAdminToken(["Super Admin"]),
    validate(createAdminSchema),
    adminController.createUser,
);

router.get(
    "/admins",
    authenticateAdminToken(["Super Admin"]),
    adminController.getAdmins,
);

router.get(
    "/admins/:adminId",
    authenticateAdminToken(["Super Admin"]),
    adminController.getDetailAdmin,
);

router.put(
    "/admins/:adminId",
    authenticateAdminToken(["Super Admin"]),
    validate(updateAdminSchema),
    adminController.updateAdmin,
);

router.delete(
    "/admins/:adminId",
    authenticateAdminToken(["Super Admin"]),
    adminController.deleteAdmin,
);
// START CRUD ADMIN

router.get(
    "/",
    authenticateAdminToken(["Super Admin", "Admin"]),
    adminController.findAdminByAuth,
);

router.post(
    "/ubah-password",
    authenticateAdminToken(["Super Admin", "Admin"]),
    adminController.ubahPassword,
);

module.exports = router;

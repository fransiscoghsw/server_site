const express = require("express");
const router = express.Router();
const tagControlller = require("../controllers/tagControlller");

// auth
const {
    authenticateAdminToken,
} = require("../middleware/authenticateAdminToken");

router.post(
    "/",
    authenticateAdminToken(["Super Admin", "Admin", "Public Relation"]),
    tagControlller.create,
);
router.put(
    "/:id",
    authenticateAdminToken(["Super Admin", "Admin", "Public Relation"]),
    tagControlller.update,
);
router.get("/", tagControlller.findAll);
router.get("/:id", tagControlller.findOne);
router.delete(
    "/:id",
    authenticateAdminToken(["Super Admin", "Admin", "Public Relation"]),
    tagControlller.delete,
);

module.exports = router;

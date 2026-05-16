const express = require("express");
const router = express.Router();

// START CONTROLLERS
const homepageController = require("../controllers/homepageController");
const productController = require("../controllers/productController");
const tentangKamiContoller = require("../controllers/tentangKamiContoller");
const sejarahController = require("../controllers/sejarahController");
const faqController = require("../controllers/faqController");
const dokumentasiFrontapageController = require("../controllers/dokumentasiFrontapageController");
const kontakFrontpageController = require("../controllers/kontakFrontpageController");
const sosialMediaController = require("../controllers/sosialMediaController");
// END CONTROLLERS

// START ROUTES

//* Homepage
router.get("/header", homepageController.getAllPublic);
router.get("/header/image/:imageName", homepageController.getImageByNamePublic);

//* Products
router.get("/products", productController.getAllPublic);
router.get("/product/:id", productController.getOnePublic);
router.get("/product/image/:imageName", productController.getImageByNamePublic);

//* About Us
router.get("/aboutUs", tentangKamiContoller.getAllPublic);
router.get(
    "/aboutUs/image/:imageName",
    tentangKamiContoller.getImageByNamePublic,
);

//* History
router.get("/history", sejarahController.getAllPublic);

//* FAQ
router.get("/faqs", faqController.getAllPublic);
router.get("/faq/:id", faqController.getOnePublic);

//* Documentation
router.get("/documentations", dokumentasiFrontapageController.getAllPublic);
router.get("/documentation/:id", dokumentasiFrontapageController.getOnePublic);
router.get(
    "/documentation/image/:imageName",
    dokumentasiFrontapageController.getImageByNamePublic,
);

//* History
router.get("/contact", kontakFrontpageController.getOnePublic);

//* Social Media
router.get("/socialMedias", sosialMediaController.getAllPublic);
router.get("/socialMedia/:id", sosialMediaController.getOnePublic);
router.get(
    "/socialMedia/image/:imageName",
    sosialMediaController.getImageByNamePublic,
);

// END ROUTES

module.exports = router;

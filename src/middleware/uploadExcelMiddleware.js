// middlewares/uploadExcel.js
const multer = require("multer");
const path = require("path");

const storage = multer.memoryStorage();
const fileFilter = (req, file, cb) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".xlsx" && ext !== ".xls") {
        return cb(new Error("Only Excel files are allowed"), false);
    }
    cb(null, true);
};

const uploadExcel = multer({ storage, fileFilter });

module.exports = uploadExcel;

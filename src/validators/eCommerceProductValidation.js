const { check } = require("express-validator");

const createSchema = [
    check("eCommerceId")
        .trim()
        .notEmpty()
        .withMessage("Nama Tidak Boleh Kosong!")
        .isNumeric()
        .withMessage("Nama harus berupa angka!"),
    check("url")
        .trim()
        .notEmpty()
        .withMessage("Nama Tidak Boleh Kosong!")
        .isString()
        .withMessage("Nama harus berupa string!"),
    check("productId")
        .trim()
        .notEmpty()
        .withMessage("Nama Tidak Boleh Kosong!")
        .isNumeric()
        .withMessage("Nama harus berupa angka!"),
];

const updateSchema = [
    check("eCommerceId")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Nama Tidak Boleh Kosong!")
        .isNumeric()
        .withMessage("Nama harus berupa angka!"),
    check("url")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Nama Tidak Boleh Kosong!")
        .isString()
        .withMessage("Nama harus berupa string!"),
    check("productId")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Nama Tidak Boleh Kosong!")
        .isNumeric()
        .withMessage("Nama harus berupa angka!"),
];

module.exports = {
    createSchema,
    updateSchema,
};

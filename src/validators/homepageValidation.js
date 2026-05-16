const { check } = require("express-validator");

const upsertSchema = [
    check("title")
        .trim()
        .notEmpty()
        .withMessage("Judul tidak boleh kosong!")
        .isString()
        .withMessage("Judul harus berupa string!")
        .isLength({ max: 255 })
        .withMessage("Judul tidak boleh lebih dari 255 karakter!"),

    check("subTitle")
        .trim()
        .notEmpty()
        .withMessage("Sub Judul tidak boleh kosong!")
        .isString()
        .withMessage("Sub Judul harus berupa string!")
        .isLength({ max: 255 })
        .withMessage("Sub Judul tidak boleh lebih dari 255 karakter!"),
];

module.exports = {
    upsertSchema,
};

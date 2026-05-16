const { check } = require("express-validator");

const upsertSchema = [
    check("judul")
        .trim()
        .notEmpty()
        .withMessage("Judul tidak boleh kosong!")
        .isString()
        .withMessage("Judul harus berupa string!"),
    check("deskripsi")
        .trim()
        .notEmpty()
        .withMessage("Deskripsi tidak boleh kosong!")
        .isString()
        .withMessage("Deskripsi harus berupa string!"),
];

module.exports = {
    upsertSchema,
};

const { check } = require("express-validator");

const createSchema = [
    check("nama")
        .trim()
        .notEmpty()
        .withMessage("Nama tidak boleh kosong!")
        .isString()
        .withMessage("Nama harus berupa string!"),
    check("jabatan")
        .trim()
        .notEmpty()
        .withMessage("Jabatan tidak boleh kosong!")
        .isString()
        .withMessage("Jabatan harus berupa string!"),
    check("deskripsi")
        .trim()
        .notEmpty()
        .withMessage("Deskripsi tidak boleh kosong!")
        .isString()
        .withMessage("Deskripsi harus berupa string!"),
];

const updateSchema = [
    check("nama")
        .optional()
        .trim()
        .isString()
        .withMessage("Nama harus berupa string!"),
    check("jabatan")
        .optional()
        .trim()
        .isString()
        .withMessage("Jabatan harus berupa string!"),
    check("deskripsi")
        .optional()
        .trim()
        .isString()
        .withMessage("Deskripsi harus berupa string!"),
];

module.exports = {
    createSchema,
    updateSchema,
};

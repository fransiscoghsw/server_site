const { check } = require("express-validator");

const createSchema = [
    check("nama")
        .notEmpty()
        .withMessage("Nama tidak boleh kosong!")
        .isString()
        .withMessage("Nama harus berupa string!"),
    check("pekerjaan")
        .notEmpty()
        .withMessage("Pekerjaan tidak boleh kosong!")
        .isString()
        .withMessage("Pekerjaan harus berupa string!"),
    check("pesan")
        .notEmpty()
        .withMessage("Pesan tidak boleh kosong!")
        .isString()
        .withMessage("Pesan harus berupa string!"),
];

const updateSchema = [
    check("nama")
        .optional()
        .isString()
        .withMessage("Nama harus berupa string!"),
    check("pekerjaan")
        .optional()
        .isString()
        .withMessage("Pekerjaan harus berupa string!"),
    check("pesan")
        .optional()
        .isString()
        .withMessage("Pesan harus berupa string!"),
];

module.exports = {
    createSchema,
    updateSchema,
};

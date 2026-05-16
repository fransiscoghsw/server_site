const { check } = require("express-validator");

const createSchema = [
  check("judul")
    .notEmpty()
    .withMessage("Judul tidak boleh kosong!")
    .isString()
    .withMessage("Judul harus berupa string!"),
];

const updateSchema = [
  check("judul")
    .optional()
    .isString()
    .withMessage("Judul harus berupa string!"),
];

module.exports = {
  createSchema,
  updateSchema,
};

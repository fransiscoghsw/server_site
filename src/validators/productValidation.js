const { check } = require("express-validator");
const { Product } = require("../models");
const { Op } = require("sequelize");

const createSchema = [
    check("name")
        .trim()
        .notEmpty()
        .withMessage("Nama Tidak Boleh Kosong!")
        .isString()
        .withMessage("Nama harus berupa string!")
        .isLength({ min: 1, max: 255 })
        .withMessage("Nama harus diantara 1 dan 255 karakter!")
        .custom(async (value) => {
            const name = await Product.findOne({
                where: { name: value },
            });
            if (name) {
                throw new Error("Nama sudah digunakan!");
            }
        }),
    check("description")
        .trim()
        .notEmpty()
        .withMessage("Deskripsi Tidak Boleh Kosong!")
        .isString()
        .withMessage("Deskripsi harus berupa string!"),
    check("price")
        .trim()
        .notEmpty()
        .withMessage("Price Tidak Boleh Kosong!")
        .isNumeric()
        .withMessage("Price harus berupa angka!"),
    check("quantity")
        .trim()
        .notEmpty()
        .withMessage("Qty Tidak Boleh Kosong!")
        .isNumeric()
        .withMessage("Qty harus berupa angkat!"),
];

const updateSchema = [
    check("name")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Nama Tidak Boleh Kosong!")
        .isString()
        .withMessage("Nama harus berupa string!")
        .isLength({ min: 1, max: 255 })
        .withMessage("Nama harus diantara 3 dan 255 karakter!")
        .custom(async (value, { req }) => {
            const existingUnit = await Product.findOne({
                where: {
                    name: value,
                    id: { [Op.ne]: req.params.id },
                },
            });
            if (existingUnit) {
                throw new Error("Nama sudah digunakan!");
            }
        }),
    check("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Deskripsi Tidak Boleh Kosong!")
        .isString()
        .withMessage("Deskripsi harus berupa string!"),
    check("price")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Harga Tidak Boleh Kosong!")
        .isNumeric()
        .withMessage("Harga harus berupa angka!"),
    check("quantity")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Qty Tidak Boleh Kosong!")
        .isNumeric()
        .withMessage("Qty harus berupa angkat!"),
];

module.exports = {
    createSchema,
    updateSchema,
};

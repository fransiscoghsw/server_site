const { check } = require("express-validator");
const { MECommerce } = require("../models");
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
            const name = await MECommerce.findOne({
                where: { name: value },
            });
            if (name) {
                throw new Error("Nama sudah digunakan!");
            }
        }),
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
            const existingUnit = await MECommerce.findOne({
                where: {
                    name: value,
                    id: { [Op.ne]: req.params.id },
                },
            });
            if (existingUnit) {
                throw new Error("Nama sudah digunakan!");
            }
        }),
];

module.exports = {
    createSchema,
    updateSchema,
};

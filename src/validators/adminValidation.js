const { check } = require("express-validator");
const { Admin } = require("../models");
const { Op } = require("sequelize");

const createAdminSchema = [
    check("username")
        .trim()
        .notEmpty()
        .withMessage("Username Tidak Boleh Kosong!")
        .isString()
        .withMessage("Username harus berupa string!")
        .isLength({ min: 1, max: 255 })
        .withMessage("Username harus di antara 1 dan 255 karakter!")
        .custom(async (value) => {
            const username = await Admin.findOne({
                where: { username: value },
            });
            if (username) {
                throw new Error("username sudah digunakan!");
            }
        }),
    ,
    check("email")
        .trim()
        .notEmpty()
        .withMessage("Email Tidak Boleh Kosong!")
        .isString()
        .withMessage("Email harus berupa string!")
        .isLength({ min: 1, max: 255 })
        .withMessage("Email harus di antara 1 dan 255 karakter!")
        .isEmail()
        .withMessage("Email harus berupa email yang valid!")
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        .withMessage("Email mengandung karakter tidak valid!")
        .custom(async (value) => {
            const email = await Admin.findOne({
                where: { email: value },
            });
            if (email) {
                throw new Error("Email sudah digunakan!");
            }
        }),
    ,
    check("password")
        .trim()
        .notEmpty()
        .withMessage("Password Tidak Boleh Kosong!")
        .isLength({ min: 1, max: 255 })
        .withMessage("Password harus di antara 1 dan 255 karakter!")
        .isLength({ min: 8 })
        .withMessage("Password minimal 8 karakter"),
    check("roleId")
        .trim()
        .notEmpty()
        .withMessage("Role Tidak Boleh Kosong!")
        .isNumeric()
        .withMessage("Role harus berupa angka!"),
];

const updateAdminSchema = [
    check("username")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Username Tidak Boleh Kosong!")
        .isString()
        .withMessage("Username harus berupa string!")
        .isLength({ min: 1, max: 255 })
        .withMessage("Username harus di antara 1 dan 255 karakter!")
        .custom(async (value, { req }) => {
            const adminId = req.params.adminId;
            const username = await Admin.findOne({
                where: { username: value, id: { [Op.ne]: adminId } },
            });
            if (username) {
                throw new Error("username sudah digunakan!");
            }
        }),
    ,
    check("email")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Email Tidak Boleh Kosong!")
        .isString()
        .withMessage("Email harus berupa string!")
        .isLength({ min: 1, max: 255 })
        .withMessage("Email harus di antara 1 dan 255 karakter!")
        .isEmail()
        .withMessage("Email harus berupa email yang valid!")
        .matches(/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/)
        .withMessage("Email mengandung karakter tidak valid!")
        .custom(async (value, { req }) => {
            const adminId = req.params.adminId;
            const email = await Admin.findOne({
                where: { email: value, id: { [Op.ne]: adminId } },
            });
            if (email) {
                throw new Error("Email sudah digunakan!");
            }
        }),
    ,
    check("password")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Password Tidak Boleh Kosong!")
        .isLength({ min: 1, max: 255 })
        .withMessage("Password harus di antara 1 dan 255 karakter!")
        .isLength({ min: 8 })
        .withMessage("Password minimal 8 karakter"),
    check("roleId")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Role Tidak Boleh Kosong!")
        .isNumeric()
        .withMessage("Role harus berupa angka!"),
];

module.exports = {
    createAdminSchema,
    updateAdminSchema,
};

const { check } = require("express-validator");
const { FarmAddress } = require("../models");
const { Op } = require("sequelize");
const { decrypt } = require("../utils/encryption");
const createSchema = [
    check("title")
        .trim()
        .notEmpty()
        .withMessage("Judul Tidak Boleh Kosong!")
        .isString()
        .withMessage("Judul harus berupa string!")
        .isLength({ min: 3, max: 255 })
        .withMessage("Judul harus diantara 3 dan 255 karakter!")
        .custom(async (value) => {
            const title = await FarmAddress.findOne({
                where: { title: value },
            });
            if (title) {
                throw new Error("Judul sudah digunakan!");
            }
        }),
    check("description")
        .trim()
        .notEmpty()
        .withMessage("Alamat Tidak Boleh Kosong!")
        .isString()
        .withMessage("Alamat harus berupa string!"),
    check("address")
        .trim()
        .notEmpty()
        .withMessage("Alamat Tidak Boleh Kosong!")
        .isString()
        .withMessage("Alamat harus berupa string!"),
    check("provinceId")
        .trim()
        .notEmpty()
        .withMessage("Provinsi Tidak Boleh Kosong!")
        .isNumeric()
        .withMessage("Provinsi harus berupa number!"),
    check("cityId")
        .trim()
        .notEmpty()
        .withMessage("Kota Tidak Boleh Kosong!")
        .isNumeric()
        .withMessage("Kota harus berupa number!"),
    check("kecamatanId")
        .trim()
        .notEmpty()
        .withMessage("Kecamatan Tidak Boleh Kosong!")
        .isNumeric()
        .withMessage("Kecamatan harus berupa number!"),
    check("kelurahanId")
        .trim()
        .notEmpty()
        .withMessage("Kelurahan Tidak Boleh Kosong!")
        .isNumeric()
        .withMessage("Kelurahan harus berupa number!"),
    check("postalCode")
        .trim()
        .notEmpty()
        .withMessage("Kode pos Tidak Boleh Kosong!")
        .isString()
        .withMessage("Kode pos harus berupa string!")
        .isLength({ min: 3, max: 255 })
        .withMessage("Kode pos harus diantara 3 dan 255 karakter!"),
    check("urlMap")
        .trim()
        .notEmpty()
        .withMessage("Url map Tidak Boleh Kosong!")
        .isString()
        .withMessage("Url map harus berupa string!"),
    check("farmArea")
        .trim()
        .notEmpty()
        .withMessage("Luas peternakan Tidak Boleh Kosong!")
        .isString()
        .withMessage("Luas peternakan harus berupa string!")
        .isLength({ min: 1, max: 255 })
        .withMessage("Luas peternakan harus diantara 1 dan 255 karakter!"),
    check("yearBuilded")
        .trim()
        .notEmpty()
        .withMessage("Tahun didirikan tidak boleh kosong!")
        .isDate()
        .withMessage("Tahun didirikan harus berupa tanggal!"),
    check("capacity")
        .trim()
        .notEmpty()
        .withMessage("Kapasitas Tidak Boleh Kosong!")
        .isString()
        .withMessage("Kapasitas harus berupa string!")
        .isLength({ min: 1, max: 255 })
        .withMessage("Kapasitas harus diantara 1 dan 255 karakter!"),
    check("contactName")
        .trim()
        .notEmpty()
        .withMessage("Nama kontak Tidak Boleh Kosong!")
        .isString()
        .withMessage("Nama kontak harus berupa string!")
        .isLength({ min: 1, max: 255 })
        .withMessage("Nama kontak harus diantara 1 dan 255 karakter!"),
    check("contactNumber")
        .trim()
        .notEmpty()
        .withMessage("Nomor kontak Tidak Boleh Kosong!")
        .isString()
        .withMessage("Nomor kontak harus berupa string!")
        .isLength({ min: 1, max: 255 })
        .withMessage("Nomor kontak harus diantara 1 dan 255 karakter!"),
];

const updateSchema = [
    check("title")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Judul Tidak Boleh Kosong!")
        .isString()
        .withMessage("Judul harus berupa string!")
        .isLength({ min: 3, max: 255 })
        .withMessage("Judul harus diantara 3 dan 255 karakter!")
        .custom(async (value, { req }) => {
            const farmAddressId = req.params.id;
            const decryptedId = decrypt(farmAddressId);
            const existingFarmAddress = await FarmAddress.findOne({
                where: {
                    title: value,
                    id: { [Op.ne]: decryptedId },
                },
            });
            if (existingFarmAddress) {
                throw new Error("Judul sudah digunakan!");
            }
        }),
    check("description")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Deskripsi Tidak Boleh Kosong!")
        .isString()
        .withMessage("Deskripsi harus berupa string!"),
    check("address")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Alamat Tidak Boleh Kosong!")
        .isString()
        .withMessage("Alamat harus berupa string!"),
    check("provinceId")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Provinsi Tidak Boleh Kosong!")
        .isNumeric()
        .withMessage("Provinsi harus berupa number!"),
    check("cityId")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Kota Tidak Boleh Kosong!")
        .isNumeric()
        .withMessage("Kota harus berupa number!"),
    check("kecamatanId")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Kecamatan Tidak Boleh Kosong!")
        .isNumeric()
        .withMessage("Kecamatan harus berupa number!"),
    check("kelurahanId")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Kelurahan Tidak Boleh Kosong!")
        .isNumeric()
        .withMessage("Kelurahan harus berupa number!"),
    check("postalCode")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Kode pos Tidak Boleh Kosong!")
        .isString()
        .withMessage("Kode pos harus berupa string!")
        .isLength({ min: 3, max: 255 })
        .withMessage("Kode pos harus diantara 3 dan 255 karakter!"),
    check("urlMap")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Url map Tidak Boleh Kosong!")
        .isString()
        .withMessage("Url map harus berupa string!"),
    check("farmArea")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Luas Peternakan Tidak Boleh Kosong!")
        .isString()
        .withMessage("Luas Peternakan harus berupa string!")
        .isLength({ min: 3, max: 255 })
        .withMessage("Luas Peternakan harus diantara 3 dan 255 karakter!"),
    check("yearBuilded")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Tahun didirikan tidak boleh kosong!")
        .isDate()
        .withMessage("Tahun didirikan harus berupa tanggal!"),
    check("capacity")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Capacity Tidak Boleh Kosong!")
        .isString()
        .withMessage("Capacity harus berupa string!")
        .isLength({ min: 3, max: 255 })
        .withMessage("Capacity harus diantara 3 dan 255 karakter!"),
    check("contactName")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Nama kontak Tidak Boleh Kosong!")
        .isString()
        .withMessage("Nama kontak harus berupa string!")
        .isLength({ min: 1, max: 255 })
        .withMessage("Nama kontak harus diantara 1 dan 255 karakter!"),
    check("contactNumber")
        .optional()
        .trim()
        .notEmpty()
        .withMessage("Nomor kontak Tidak Boleh Kosong!")
        .isString()
        .withMessage("Nomor kontak harus berupa string!")
        .isLength({ min: 1, max: 255 })
        .withMessage("Nomor kontak harus diantara 1 dan 255 karakter!"),
];

module.exports = {
    createSchema,
    updateSchema,
};

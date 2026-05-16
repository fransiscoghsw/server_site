const { Op, where } = require("sequelize");
const { ECommerceProduct, Product, MECommerce } = require("../models");
const { exit } = require("process");

// Create
exports.create = async (req, res, next) => {
    try {
        const { eCommerceId, url, productId } = req.body;

        const product = await Product.findByPk(productId);
        const eCommerce = await MECommerce.findByPk(eCommerceId);

        if (!product) {
            return res.status(404).json({ message: "Product tidak ada!" });
        }

        if (!eCommerce) {
            return res.status(404).json({ message: "ECommerce tidak ada!" });
        }

        const existingData = await ECommerceProduct.findOne({
            where: {
                [Op.and]: [{ eCommerceId }, { productId }],
            },
        });

        if (existingData) {
            return res.status(400).json({
                message: "Data Sudah Digunakan!",
            });
        }

        const eCommerceProduct = await ECommerceProduct.create(
            {
                eCommerceId,
                url,
                productId,
            },
            {
                user: req.user.username,
            },
        );

        res.status(201).json({
            message: "ECommerce Product berhasil Ditambahkan!",
        });
    } catch (error) {
        next(error);
    }
};

// Read all
exports.findAll = async (req, res, next) => {
    try {
        const eCommerceProducts = await ECommerceProduct.findAll();
        res.status(200).json({
            message: "Semua data ECommerce Product berhasil didapat!",
            data: eCommerceProducts,
        });
    } catch (error) {
        next(error);
    }
};

// Read one
exports.findOne = async (req, res, next) => {
    try {
        const eCommerceProduct = await ECommerceProduct.findByPk(req.params.id);
        if (!eCommerceProduct) {
            return res
                .status(404)
                .json({ message: "ECommerce Product tidak ada!" });
        }
        res.status(200).json({
            message: "Data ECommerce Product berhasil didapat!",
            data: eCommerceProduct,
        });
    } catch (error) {
        next(error);
    }
};

// Update
exports.update = async (req, res, next) => {
    try {
        const eCommerceProductId = req.params.id;

        const { eCommerceId, url, productId } = req.body;

        const eCommerceProduct = await ECommerceProduct.findOne({
            where: { id: eCommerceProductId },
        });

        if (!eCommerceProduct) {
            return res
                .status(404)
                .json({ message: "ECommerce Product tidak ada!" });
        }

        const product = await Product.findByPk(productId);
        const eCommerce = await MECommerce.findByPk(eCommerceId);

        if (!product) {
            return res.status(404).json({ message: "Product tidak ada!" });
        }

        if (!eCommerce) {
            return res.status(404).json({ message: "ECommerce tidak ada!" });
        }

        const existingData = await ECommerceProduct.findOne({
            where: {
                [Op.and]: [{ eCommerceId }, { productId }],
                id: { [Op.ne]: eCommerceProductId },
            },
        });

        if (existingData) {
            return res.status(400).json({
                message: "Data Sudah Digunakan!",
            });
        }

        await eCommerceProduct.update(
            {
                eCommerceId,
                url,
                productId,
            },
            {
                where: { id: req.params.id },
                user: req.user.username,
            },
        );

        res.status(200).json({
            message: "ECommerce Product berhasil Diupdate!",
        });
    } catch (error) {
        next(error);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const eCommerceProduct = await ECommerceProduct.findOne({
            where: { id: req.params.id },
        });
        if (!eCommerceProduct) {
            return res
                .status(404)
                .json({ message: "ECommerce Product tidak ada!" });
        }

        await eCommerceProduct.destroy();

        res.status(200).json({
            message: "ECommerce Product berhasil Dihapus!",
        });
    } catch (error) {
        next(error);
    }
};

const { sequelize, Product } = require("../models");
const fs = require("fs");
const path = require("path");
const { exit } = require("process");
const {
    ensureDir,
    saveImage,
    deleteOldImage,
    deleteImage,
} = require("../utils/fileHandler");

// Create
exports.create = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const {
            name,
            nameEn,
            description,
            descriptionEn,
            price,
            quantity,
            unitId,
            urls,
        } = req.body;

        const dir = "public/assets/images/products/";
        const image = req.file ? req.file.buffer : null;
        let imageName = null;

        if (image) {
            ensureDir(dir);
            imageName = saveImage(image, req.file.originalname, dir);
        }

        // Buat produk
        const product = await Product.create(
            {
                name,
                nameEn,
                description,
                descriptionEn,
                price,
                quantity,
                unitId,
                image: imageName,
            },
            {
                user: req.user.username,
                transaction: t,
            },
        );
        await t.commit();

        // Berhasil
        res.status(201).json({
            message: "Product Berhasil Ditambahkan!",
        });
    } catch (error) {
        await t.rollback();
        // Error handling
        next(error);
    }
};

exports.findAll = async (req, res, next) => {
    try {
        const { lang } = req.query;
        const products = await Product.findAll();

        let data;

        if (lang === "id") {
            // Jika lang = "id", hanya ambil versi Indonesia
            data = products.map((product) => ({
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                quantity: product.quantity,
                unitId: product.unitId,
                image: product.image,
            }));
        } else if (lang === "en") {
            // Jika lang = "en", hanya ambil versi Inggris
            data = products.map((product) => ({
                id: product.id,
                name: product.nameEn,
                description: product.descriptionEn,
                price: product.price,
                quantity: product.quantity,
                unitId: product.unitId,
                image: product.image,
            }));
        } else {
            // Jika lang tidak ada, kembalikan semua kolom
            data = products.map((product) => ({
                id: product.id,
                name: product.name,
                nameEn: product.nameEn,
                description: product.description,
                descriptionEn: product.descriptionEn,
                price: product.price,
                quantity: product.quantity,
                unitId: product.unitId,
                image: product.image,
            }));
        }

        res.status(200).json({
            message: "Semua data Product berhasil didapat!",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

// Read one
exports.findOne = async (req, res, next) => {
    try {
        const { lang } = req.query; // Ambil bahasa dari query parameter
        const productId = req.params.id;
        const product = await Product.findOne({
            where: { id: productId },
        });

        if (!product) {
            return res.status(404).json({ message: "Product tidak ada!" });
        }

        let data;

        if (lang === "id") {
            // Jika lang = "id", hanya ambil versi Indonesia
            data = {
                id: product.id,
                name: product.name,
                description: product.description,
                price: product.price,
                quantity: product.quantity,
                unitId: product.unitId,
                image: product.image,
            };
        } else if (lang === "en") {
            // Jika lang = "en", hanya ambil versi Inggris
            data = {
                id: product.id,
                name: product.nameEn,
                description: product.descriptionEn,
                price: product.price,
                quantity: product.quantity,
                unitId: product.unitId,
                image: product.image,
            };
        } else {
            // Jika lang tidak ada, kembalikan semua kolom
            data = {
                id: product.id,
                name: product.name,
                nameEn: product.nameEn,
                description: product.description,
                descriptionEn: product.descriptionEn,
                price: product.price,
                quantity: product.quantity,
                unitId: product.unitId,
                image: product.image,
            };
        }

        res.status(200).json({
            message: "Data Product berhasil didapat!",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

// Update Product
exports.update = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const {
            name,
            nameEn, // Tambahkan nameEn
            description,
            descriptionEn, // Tambahkan descriptionEn
            price,
            quantity,
            unitId,
            urls,
        } = req.body;
        const image = req.file ? req.file.buffer : null;

        // Cari produk berdasarkan ID
        const product = await Product.findByPk(req.params.id);

        if (!product) {
            return res.status(404).json({ message: "Product tidak ada!" });
        }

        let imageName = product.image;
        if (image) {
            const dir = "public/assets/images/products/";
            ensureDir(dir);
            imageName = saveImage(image, req.file.originalname, dir);

            if (product.image) {
                deleteOldImage(path.join(dir, product.image));
            }
        }

        // Perbarui data produk
        await product.update(
            {
                name,
                nameEn,
                description,
                descriptionEn,
                price,
                quantity,
                unitId,
                image: imageName,
            },
            {
                user: req.user.username,
                transaction: t,
            },
        );

        await t.commit();
        res.status(200).json({
            message: "Product Berhasil Diupdate!",
        });
    } catch (error) {
        await t.rollback();
        next(error);
    }
};

exports.delete = async (req, res, next) => {
    const t = await sequelize.transaction();
    try {
        const product = await Product.findByPk(req.params.id);
        if (!product) {
            return res.status(404).json({ message: "Product tidak ada!" });
        }

        // Hapus Gambar jika ada
        if (product.image) {
            const imagePath = path.resolve(
                `public/assets/images/products/${product.image}`,
            );
            await deleteImage(imagePath);
        }

        await product.destroy({ transaction: t });

        await t.commit();

        res.status(200).json({
            message: "Product Berhasil Dihapus!",
        });
    } catch (error) {
        await t.rollback();
        next(error);
    }
};

exports.getImageByName = (req, res) => {
    const { image } = req.params;
    const dir = "public/assets/images/products/";
    const imagePath = path.join(dir, image);

    if (fs.existsSync(imagePath)) {
        res.sendFile(path.resolve(imagePath));
    } else {
        res.status(404).json({
            message: "Gambar tidak ditemukan",
        });
    }
};

//* START FUNCTION FOR PUBLIC
// Read all
exports.getAllPublic = async (req, res, next) => {
    try {
        const { lang } = req.query;
        const products = await Product.findAll({});
        const formattedProducts = products.map((product) => ({
            id: product.id,
            name: lang === "en" ? product.nameEn : product.name,
            description:
                lang === "en" ? product.descriptionEn : product.description,
            price: product.price,
            quantity: product.quantity,
            unitId: product.unitId,
            image: product.image,
        }));
        res.status(200).json({
            message: "Semua data Product berhasil didapat!",
            data: formattedProducts,
        });
    } catch (error) {
        next(error);
    }
};

// Read one
exports.getOnePublic = async (req, res, next) => {
    try {
        const { lang } = req.query; // Ambil bahasa dari query parameter
        const productId = req.params.id;
        const product = await Product.findOne({
            where: { id: productId },
        });

        if (!product) {
            return res.status(404).json({ message: "Product tidak ada!" });
        }

        res.status(200).json({
            message: "Data Product berhasil didapat!",
            data: {
                id: product.id,
                name: lang === "en" ? product.nameEn : product.name,
                description:
                    lang === "en" ? product.descriptionEn : product.description,
                price: product.price,
                quantity: product.quantity,
                unitId: product.unitId,
                image: product.image,
            },
        });
    } catch (error) {
        next(error);
    }
};

exports.getImageByNamePublic = (req, res) => {
    const { imageName } = req.params;
    const dir = "public/assets/images/products/";
    const imagePath = path.join(dir, imageName);

    if (fs.existsSync(imagePath)) {
        res.sendFile(path.resolve(imagePath));
    } else {
        res.status(404).json({
            message: "Gambar tidak ditemukan",
        });
    }
};

//* END FUNCTION FOR PUBLIC

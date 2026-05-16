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
        const { name, description } = req.body;

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
                description,
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
        const products = await Product.findAll();

        let data;

        data = products.map((product) => ({
            id: product.id,
            name: product.name,
            description: product.description,
            image: product.image,
        }));

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
        // Ambil bahasa dari query parameter
        const productId = req.params.id;
        const product = await Product.findOne({
            where: { id: productId },
        });

        if (!product) {
            return res.status(404).json({ message: "Product tidak ada!" });
        }

        let data;
        data = {
            id: product.id,
            name: product.name,
            description: product.description,
            image: product.image,
        };

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
        const { name, description } = req.body;
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
                description,
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
        const products = await Product.findAll({});
        const formattedProducts = products.map((product) => ({
            id: product.id,
            name: product.name,
            description: product.description,
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
        // Ambil bahasa dari query parameter
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
                name: product.name,
                description: product.description,
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

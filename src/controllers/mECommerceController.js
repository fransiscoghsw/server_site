const { MECommerce } = require("../models");
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
    try {
        const { name } = req.body;
        const dir = "public/assets/icons/eCommerce";
        const icon = req.file ? req.file.buffer : null;

        if (icon) {
            ensureDir(dir);
            imageName = saveImage(icon, req.file.originalname, dir);
        }

        const eCommerce = await MECommerce.create(
            {
                name,
                icon: imageName,
            },
            {
                user: req.user.username,
            },
        );

        res.status(201).json({
            message: "E-Commerce Berhasil Ditambahkan!",
        });
    } catch (error) {
        next(error);
    }
};

// Read all
exports.findAll = async (req, res, next) => {
    try {
        const eCommerces = await MECommerce.findAll();
        res.status(200).json({
            message: "Semua data e-commerce berhasil didapat!",
            data: eCommerces,
        });
    } catch (error) {
        next(error);
    }
};

// Read one
exports.findOne = async (req, res, next) => {
    try {
        const eCommerce = await MECommerce.findByPk(req.params.id);
        if (!eCommerce) {
            return res.status(404).json({ message: "E-Commerce tidak ada!" });
        }
        res.status(200).json({
            message: "Data eCommerce berhasil didapat!",
            data: eCommerce,
        });
    } catch (error) {
        next(error);
    }
};

// Update
exports.update = async (req, res, next) => {
    try {
        const { name } = req.body;
        const icon = req.file ? req.file.buffer : null;

        const eCommerce = await MECommerce.findByPk(req.params.id);
        if (!eCommerce) {
            return res.status(404).json({ message: "E-Commerce tidak ada!" });
        }

        let imageName = eCommerce ? eCommerce.icon : null;
        if (icon) {
            const dir = "public/assets/icons/eCommerce";
            ensureDir(dir);
            imageName = saveImage(icon, req.file.originalname, dir);

            if (eCommerce) {
                deleteOldImage(path.join(dir, eCommerce.icon));
            }
        }

        await eCommerce.update(
            {
                name,
                icon: imageName,
            },
            {
                where: { id: req.params.id },
                user: req.user.username,
            },
        );

        res.status(200).json({
            message: "E-Commerce Berhasil Diupdate!",
        });
    } catch (error) {
        next(error);
    }
};

exports.delete = async (req, res, next) => {
    try {
        const eCommerce = await MECommerce.findByPk(req.params.id);
        if (!eCommerce) {
            return res.status(404).json({ message: "E-Commerce tidak ada!" });
        }

        // Hapus Gambar jika ada
        if (eCommerce.icon) {
            const imagePath = path.resolve(
                `public/assets/icons/eCommerce/${eCommerce.icon}`,
            );
            await deleteImage(imagePath);
        }

        await eCommerce.destroy();

        res.status(200).json({
            message: "E-Commerce Berhasil Dihapus!",
        });
    } catch (error) {
        next(error);
    }
};

exports.getImageByName = (req, res) => {
    const { icon } = req.params;
    const dir = "public/assets/icons/eCommerce";
    const imagePath = path.join(dir, icon);

    if (fs.existsSync(imagePath)) {
        res.sendFile(path.resolve(imagePath));
    } else {
        res.status(404).json({
            message: "Gambar tidak ditemukan",
        });
    }
};

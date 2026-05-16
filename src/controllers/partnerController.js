const { Partner } = require("../models");
const fs = require("fs");
const path = require("path");

const ensureDir = (dir) => {
    if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir, { recursive: true });
    }
};

// Create
exports.create = async (req, res) => {
    try {
        const { nama } = req.body;
        const image = req.file ? req.file.buffer : null;

        if (image && nama) {
            const dir = "public/images/partner";
            ensureDir(dir);
            image_name = `${Date.now()}-${req.file.originalname}`;
            fs.writeFileSync(path.join(dir, image_name), image);
        }

        const partner = await Partner.create(
            {
                nama,
                image: image_name,
            },
            {
                user: req.user.username,
            },
        );

        res.status(201).json({
            message: "Partner Berhasil ditambahkan!",
            data: partner,
        });
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            const messages = error.errors.map((err) => err.message);
            res.status(400).json({
                message: "Validation error",
                errors: messages,
            });
        } else {
            res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        }
    }
};

// Read All
exports.findAll = async (req, res) => {
    try {
        const partner = await Partner.findAll();
        res.status(200).json({
            message: "Partner berhasil diambil!",
            data: partner,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Read One
exports.findOne = async (req, res) => {
    try {
        const partner = await Partner.findByPk(req.params.id);
        if (!partner) {
            return res.status(404).json({ message: "Partner tidak ada!" });
        }
        res.status(200).json({
            message: "Partner berhasil diambil",
            data: partner,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Update
exports.update = async (req, res) => {
    try {
        const { nama } = req.body;
        const image = req.file ? req.file.path : null;

        const partner = await Partner.findByPk(req.params.id);
        if (!partner) {
            return res.status(404).json({ message: "Partner tidak ada" });
        }

        let image_name = partner.image;
        if (req.file) {
            const dir = "public/images/partner";
            ensureDir(dir);
            image_name = `${Date.now()}-${req.file.originalname}`;
            fs.writeFileSync(path.join(dir, image_name), req.file.buffer);

            if (partner.image) {
                const oldImagePath = path.join(dir, partner.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }

        await partner.update(
            {
                nama,
                image: image_name,
            },
            {
                where: { id: req.params.id },
                user: req.user.username,
            },
        );

        res.status(200).json({
            message: "Partner berhasil diperbaharui!",
            data: partner,
        });
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            const messages = error.errors.map((err) => err.message);
            res.status(400).json({
                message: "Validation error",
                errors: messages,
            });
        } else {
            res.status(500).json({
                message: "Internal server error",
                error: error.message,
            });
        }
    }
};

// Delete
exports.delete = async (req, res) => {
    try {
        const partner = await Partner.findByPk(req.params.id);
        if (!partner) {
            return res.status(404).json({ message: "Partner tidak ada!" });
        }

        // Delete image file
        if (partner.image) {
            const imagePath = path.resolve(
                `public/images/tentang-partner/${partner.image}`,
            );
            if (fs.existsSync(imagePath)) {
                fs.unlink(imagePath, (err) => {
                    if (err) console.error(err);
                });
            }
        }

        await partner.destroy();
        res.status(200).json({
            message: "Partner berhasil dihapus",
            data: partner,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Get Image by Name
exports.getImageByName = (req, res) => {
    const { gambar } = req.params;
    const dir = "public/images/partner";
    const imagePath = path.join(dir, gambar);

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
        const partner = await Partner.findAll({
            attributes: ["id", "nama", "image"],
        });
        res.status(200).json({
            message: "Partner berhasil diambil!",
            data: partner,
        });
    } catch (error) {
        next(error);
    }
};

// Read one
exports.getOnePublic = async (req, res, next) => {
    try {
        const partner = await Partner.findByPk(req.params.id, {
            attributes: ["id", "nama", "image"],
        });
        if (!partner) {
            return res.status(404).json({ message: "Partner tidak ada!" });
        }
        res.status(200).json({
            message: "Partner berhasil diambil",
            data: partner,
        });
    } catch (error) {
        next(error);
    }
};

// Get Image by Name
exports.getImageByNamePublic = (req, res) => {
    const { imageName } = req.params;
    const dir = "public/images/partner";
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

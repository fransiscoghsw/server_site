const { Testimoni } = require("../models");
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
        const { nama, pekerjaan, pesan } = req.body;
        const foto = req.file ? req.file.buffer : null;

        if (foto && nama && pekerjaan && pesan) {
            const dir = "public/images/testimoni";
            ensureDir(dir);
            nama_foto = `${Date.now()}-${req.file.originalname}`;
            fs.writeFileSync(path.join(dir, nama_foto), foto);
        }

        const testimoni = await Testimoni.create(
            {
                nama,
                foto: nama_foto,
                pekerjaan,
                pesan,
            },
            {
                user: req.user.username,
            },
        );

        res.status(201).json({
            message: "Testimoni Berhasil ditambahkan!",
            data: testimoni,
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
        const testimoni = await Testimoni.findAll();
        res.status(200).json({
            message: "Testimoni berhasil diambil!",
            data: testimoni,
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
        const testimoni = await Testimoni.findByPk(req.params.id);
        if (!testimoni) {
            return res.status(404).json({ message: "Testimoni tidak ada!" });
        }
        res.status(200).json({
            message: "Testimoni berhasil diambil",
            data: testimoni,
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
        const { nama, pekerjaan, pesan } = req.body;
        const foto = req.file ? req.file.path : null;

        const testimoni = await Testimoni.findByPk(req.params.id);
        if (!testimoni) {
            return res.status(404).json({ message: "Testimoni tidak ada!" });
        }

        let nama_foto = testimoni.foto;
        if (req.file) {
            const dir = "public/images/testimoni";
            ensureDir(dir);
            nama_foto = `${Date.now()}-${req.file.originalname}`;
            fs.writeFileSync(path.join(dir, nama_foto), req.file.buffer);

            if (testimoni.foto) {
                const oldImagePath = path.join(dir, testimoni.foto);

                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }

        await testimoni.update(
            {
                nama,
                foto: nama_foto,
                pekerjaan,
                pesan,
            },
            {
                where: { id: req.params.id },
                user: req.user.username,
            },
        );

        res.status(200).json({
            message: "Testimoni berhasil diperbaharui!",
            data: testimoni,
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
        const testimoni = await Testimoni.findByPk(req.params.id);
        if (!testimoni) {
            return res.status(404).json({ message: "Testimoni tidak ada!" });
        }

        // Delete image file
        if (testimoni.foto) {
            const imagePath = path.resolve(
                `public/images/testimoni/${testimoni.foto}`,
            );
            if (fs.existsSync(imagePath)) {
                fs.unlink(imagePath, (err) => {
                    if (err) console.error(err);
                });
            }
        }

        await testimoni.destroy();
        res.status(200).json({
            message: "Testimoni berhasil dihapus",
            data: testimoni,
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
    const dir = "public/images/testimoni";
    const imagePath = path.join(dir, gambar);

    if (fs.existsSync(imagePath)) {
        res.sendFile(path.resolve(imagePath));
    } else {
        res.status(404).json({
            message: "Gambar tidak ditemukan",
        });
    }
};

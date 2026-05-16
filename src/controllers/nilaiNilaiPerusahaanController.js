const { NilaiNilaiPerusahaan } = require("../models");
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
        // Cek jumlah data yang sudah ada
        const existingCount = await NilaiNilaiPerusahaan.count();
        if (existingCount >= 3) {
            return res.status(400).json({
                message:
                    "Maksimal 3 nilai-nilai perusahaan yang dapat ditambahkan!",
            });
        }

        const { judul } = req.body;
        const gambar = req.file ? req.file.buffer : null;

        if (gambar && judul) {
            const dir = "public/images/nilai-nilai-perusahaan";
            ensureDir(dir);
            nama_gambar = `${Date.now()}-${req.file.originalname}`;
            fs.writeFileSync(path.join(dir, nama_gambar), gambar);
        }

        const nilaiNilaiPerusahaan = await NilaiNilaiPerusahaan.create(
            {
                gambar: nama_gambar,
                judul,
            },
            {
                user: req.user.username,
            },
        );

        res.status(201).json({
            message: "Nilai perusahaan berhasil ditambahkan!",
            data: nilaiNilaiPerusahaan,
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
        const nilaiNilaiPerusahaan = await NilaiNilaiPerusahaan.findAll();
        res.status(200).json({
            message: "Nilai-nilai perusahaan berhasil diambil!",
            data: nilaiNilaiPerusahaan,
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
        const nilaiNilaiPerusahaan = await NilaiNilaiPerusahaan.findByPk(
            req.params.id,
        );
        if (!nilaiNilaiPerusahaan) {
            return res
                .status(404)
                .json({ message: "Nilai perusahaan tidak ada!" });
        }
        res.status(200).json({
            message: "Nilai perusahaan berhasil diambil",
            data: nilaiNilaiPerusahaan,
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
        const { judul } = req.body;
        const gambar = req.file ? req.file.path : null;

        const nilaiNilaiPerusahaan = await NilaiNilaiPerusahaan.findByPk(
            req.params.id,
        );
        if (!nilaiNilaiPerusahaan) {
            return res
                .status(404)
                .json({ message: "Nilai perusahaan tidak ada!" });
        }

        let nama_gambar = nilaiNilaiPerusahaan.gambar;
        if (req.file) {
            const dir = "public/images/nilai-nilai-perusahaan";
            ensureDir(dir);
            nama_gambar = `${Date.now()}-${req.file.originalname}`;
            fs.writeFileSync(path.join(dir, nama_gambar), req.file.buffer);

            if (nilaiNilaiPerusahaan.gambar) {
                const oldImagePath = path.join(
                    dir,
                    nilaiNilaiPerusahaan.gambar,
                );

                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }

        await nilaiNilaiPerusahaan.update(
            {
                gambar: nama_gambar,
                judul,
            },
            {
                where: { id: req.params.id },
                user: req.user.username,
            },
        );

        res.status(200).json({
            message: "Nilai perusahaan berhasil diperbaharui!",
            data: nilaiNilaiPerusahaan,
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
        const nilaiNilaiPerusahaan = await NilaiNilaiPerusahaan.findByPk(
            req.params.id,
        );
        if (!nilaiNilaiPerusahaan) {
            return res
                .status(404)
                .json({ message: "Nilai perusahaan tidak ada!" });
        }

        // Delete image file
        if (nilaiNilaiPerusahaan.gambar) {
            const imagePath = path.resolve(
                `public/images/nilai-nilai-perusahaan/${nilaiNilaiPerusahaan.gambar}`,
            );
            if (fs.existsSync(imagePath)) {
                fs.unlink(imagePath, (err) => {
                    if (err) console.error(err);
                });
            }
        }

        await nilaiNilaiPerusahaan.destroy();
        res.status(200).json({
            message: "Nilai perusahaan berhasil dihapus",
            data: nilaiNilaiPerusahaan,
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
    const dir = "public/images/nilai-nilai-perusahaan";
    const imagePath = path.join(dir, gambar);

    if (fs.existsSync(imagePath)) {
        res.sendFile(path.resolve(imagePath));
    } else {
        res.status(404).json({
            message: "Gambar tidak ditemukan",
        });
    }
};

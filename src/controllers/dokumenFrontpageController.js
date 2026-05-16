const { DokumenFrontpage } = require("../models");
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
        const { nama, namaEn, status } = req.body;
        // If validation passes, proceed to save the file
        const file = req.file ? req.file.buffer : null;

        if (file && nama && status) {
            const dir = "public/file/dokumenFrontpage";
            ensureDir(dir);
            nama_file = `${Date.now()}-${req.file.originalname}`;
            fs.writeFileSync(path.join(dir, nama_file), file);
        }

        const dokumen = await DokumenFrontpage.create(
            {
                nama,
                namaEn,
                status,
                file: nama_file,
            },
            {
                user: req.user.username,
            },
        );

        res.status(201).json({
            message: "Dokumen Berhasil Ditambahkan!",
            data: dokumen,
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
        const { lang } = req.query;
        const dokumen = await DokumenFrontpage.findAll();
        const formattedDokumen = dokumen.map((dok) => ({
            id: dok.id,
            nama: lang === "en" ? dok.namaEn : dok.nama,
            status: dok.status,
            file: dok.file,
        }));
        res.status(200).json({
            message: "Dokumen berhasi diambil",
            data: formattedDokumen,
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
        const { lang } = req.query;
        const dokumen = await DokumenFrontpage.findByPk(req.params.id);
        if (!dokumen) {
            return res.status(404).json({ message: "Dokumen tidak ada!" });
        }
        res.status(200).json({
            message: "Dokumen berhasi diambil",
            data: {
                id: dokumen.id,
                nama: lang === "en" ? dokumen.namaEn : dokumen.nama,
                status: dokumen.status,
                file: dokumen.file,
            },
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
        const { nama, namaEn, status } = req.body;
        const file = req.file ? req.file.buffer : null;

        const dokumen = await DokumenFrontpage.findByPk(req.params.id);
        if (!dokumen) {
            return res.status(404).json({ message: "Dokumen tidak ada!" });
        }

        let nama_file = dokumen.file;
        if (file) {
            const dir = "public/file/dokumenFrontpage";
            ensureDir(dir);

            nama_file = `${Date.now()}-${req.file.originalname}`;
            fs.writeFileSync(path.join(dir, nama_file), file);

            if (dokumen.file) {
                const oldFilePath = path.join(dir, dokumen.file);
                if (fs.existsSync(oldFilePath)) {
                    fs.unlinkSync(oldFilePath);
                }
            }
        }

        await dokumen.update(
            {
                nama,
                namaEn,
                status,
                file: nama_file,
            },
            {
                where: { id: req.params.id },
                user: req.user.username,
            },
        );

        res.status(200).json({
            message: "Dokumen berhasil diperbaharui!",
            data: dokumen,
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
        const dokumen = await DokumenFrontpage.findByPk(req.params.id);
        if (!dokumen) {
            return res.status(404).json({ message: "Dokumen tidak ada!" });
        }

        // Delete image file
        if (dokumen.file) {
            const filePath = path.resolve(
                `public/file/dokumenFrontpage/${dokumen.file}`,
            );
            if (fs.existsSync(filePath)) {
                fs.unlink(filePath, (err) => {
                    if (err) console.error(err);
                });
            }
        }

        await dokumen.destroy();
        res.status(200).json({
            message: "Dokumen Berhasil Dihapus!",
            data: dokumen,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Get File by Name
exports.getFileByName = (req, res) => {
    const { file } = req.params;
    const dir = "public/file/dokumenFrontpage";
    const filePath = path.join(dir, file);

    if (fs.existsSync(filePath)) {
        res.sendFile(path.resolve(filePath));
    } else {
        res.status(404).json({
            message: "Gambar tidak ditemukan",
        });
    }
};

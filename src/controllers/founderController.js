const { Founder } = require("../models");
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
exports.create = async (req, res) => {
    try {
        const { nama, jabatan, jabatanEn, deskripsi, deskripsiEn } = req.body;

        const dir = "public/images/founders";
        const gambar = req.file ? req.file.buffer : null;

        if (gambar) {
            ensureDir(dir);
            nama_gambar = saveImage(gambar, req.file.originalname, dir);
        }

        const founder = await Founder.create({
            nama,
            jabatan,
            jabatanEn,
            deskripsi,
            deskripsiEn,
            gambar: nama_gambar,
        });

        res.status(201).json({
            message: "Founder Berhasil Ditambahkan!",
            data: founder,
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

// Read all
exports.findAll = async (req, res) => {
    try {
        const { lang } = req.query;
        const founders = await Founder.findAll();

        let data;

        if (lang === "id") {
            // Jika lang = "id", hanya ambil versi Indonesia
            data = founders.map((founder) => ({
                id: founder.id,
                nama: founder.nama,
                jabatan: founder.jabatan,
                deskripsi: founder.deskripsi,
                gambar: founder.gambar,
            }));
        } else if (lang === "en") {
            // Jika lang = "en", hanya ambil versi Inggris
            data = founders.map((founder) => ({
                id: founder.id,
                nama: founder.nama,
                jabatan: founder.jabatanEn,
                deskripsi: founder.deskripsiEn,
                gambar: founder.gambar,
            }));
        } else {
            // Jika lang tidak ada, kembalikan semua kolom
            data = founders.map((founder) => ({
                id: founder.id,
                nama: founder.nama,
                jabatan: founder.jabatan,
                jabatanEn: founder.jabatanEn,
                deskripsi: founder.deskripsi,
                deskripsiEn: founder.deskripsiEn,
                gambar: founder.gambar,
            }));
        }

        res.status(200).json({
            message: "Semua data founder berhasil didapat!",
            data: data,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Read one
exports.findOne = async (req, res) => {
    try {
        const { lang } = req.query;
        const founder = await Founder.findByPk(req.params.id);
        if (!founder) {
            return res.status(404).json({ message: "Founder tidak ada!" });
        }

        let data;

        if (lang === "id") {
            // Jika lang = "id", hanya ambil versi Indonesia
            data = {
                id: founder.id,
                nama: founder.nama,
                jabatan: founder.jabatan,
                deskripsi: founder.deskripsi,
                gambar: founder.gambar,
            };
        } else if (lang === "en") {
            // Jika lang = "en", hanya ambil versi Inggris
            data = {
                id: founder.id,
                nama: founder.nama,
                jabatanEn: founder.jabatanEn,
                deskripsiEn: founder.deskripsiEn,
                gambar: founder.gambar,
            };
        } else {
            // Jika lang tidak ada, kembalikan semua kolom
            data = {
                id: founder.id,
                nama: founder.nama,
                jabatan: founder.jabatan,
                jabatanEn: founder.jabatanEn,
                deskripsi: founder.deskripsi,
                deskripsiEn: founder.deskripsiEn,
                gambar: founder.gambar,
            };
        }

        res.status(200).json({
            message: "Data founder berhasil didapat!",
            data: data,
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
        const { nama, jabatan, jabatanEn, deskripsi, deskripsiEn } = req.body;
        const gambar = req.file ? req.file.buffer : null;

        const founder = await Founder.findByPk(req.params.id);
        if (!founder) {
            return res.status(404).json({ message: "Founder tidak ada!" });
        }

        let nama_gambar = founder ? founder.gambar : null;
        if (gambar) {
            const dir = "public/images/founders";
            ensureDir(dir);
            nama_gambar = saveImage(gambar, req.file.originalname, dir);

            if (founder) {
                deleteOldImage(path.join(dir, founder.gambar));
            }
        }

        await founder.update(
            {
                nama,
                jabatan,
                jabatanEn,
                deskripsi,
                deskripsiEn,
                gambar: nama_gambar,
            },
            {
                where: { id: req.params.id },
                user: req.user.username,
            },
        );

        res.status(200).json({
            message: "Founder Berhasil Diupdate!",
            data: founder,
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

exports.delete = async (req, res) => {
    try {
        const founder = await Founder.findByPk(req.params.id);
        if (!founder) {
            return res.status(404).json({ message: "Founder tidak ada!" });
        }

        // Hapus Gambar jika ada
        if (founder.gambar) {
            const imagePath = path.resolve(
                `public/images/founders/${founder.gambar}`,
            );
            await deleteImage(imagePath);
        }

        await founder.destroy();

        res.status(200).json({
            message: "Founder Berhasil Dihapus!",
            data: founder,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

exports.getImageByName = (req, res) => {
    const { gambar } = req.params;
    const dir = "public/images/founders";
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
        const { lang } = req.query;
        const founders = await Founder.findAll();
        const formattedFounders = founders.map((founder) => {
            return {
                id: founder.id,
                jabatan: lang === "en" ? founder.jabatanEn : founder.jabatan,
                deskripsi:
                    lang === "en" ? founder.deskripsiEn : founder.deskripsi,
                gambar: founder.gambar,
            };
        });
        res.status(200).json({
            message: "Semua data founder berhasil didapat!",
            data: formattedFounders,
        });
    } catch (error) {
        next(error);
    }
};

// Read one
exports.getOnePublic = async (req, res, next) => {
    try {
        const { lang } = req.query;
        const founder = await Founder.findByPk(req.params.id);
        if (!founder) {
            return res.status(404).json({ message: "Founder tidak ada!" });
        }
        res.status(200).json({
            message: "Data founder berhasil didapat!",
            data: {
                id: founder.id,
                nama: founder.nama,
                jabatan: lang === "en" ? founder.jabatanEn : founder.jabatan,
                deskripsi:
                    lang === "en" ? founder.deskripsiEn : founder.deskripsi,
                gambar: founder.gambar,
            },
        });
    } catch (error) {
        next(error);
    }
};

exports.getImageByNamePublic = (req, res) => {
    const { imageName } = req.params;
    const dir = "public/images/founders";
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

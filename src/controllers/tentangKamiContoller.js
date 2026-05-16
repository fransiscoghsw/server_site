const { TentangKami } = require("../models");
const fs = require("fs");
const path = require("path");
const { exit } = require("process");

const {
    ensureDir,
    saveImage,
    deleteOldImage,
} = require("../utils/fileHandler");

// upsert
exports.upsert = async (req, res) => {
    try {
        const { judul, deskripsi } = req.body;

        const image_background = req.file ? req.file.buffer : null;

        const tentangkami = await TentangKami.findOne();

        let nama_gambar = tentangkami ? tentangkami.image_background : null;

        if (image_background) {
            const dir = "public/images/tentang-kami";
            ensureDir(dir);
            nama_gambar = saveImage(
                image_background,
                req.file.originalname,
                dir,
            );

            if (tentangkami) {
                deleteOldImage(path.join(dir, tentangkami.image_background));
            }
        }

        if (!tentangkami) {
            const tentangkami = await TentangKami.create(
                {
                    judul,
                    deskripsi,
                    image_background: nama_gambar,
                },
                {
                    user: req.user.username,
                },
            );

            return res.status(201).json({
                message: "Tentang Kami Berhasil Ditambahkan!",
                data: tentangkami,
            });
        }

        await tentangkami.update(
            {
                judul,
                deskripsi,
                image_background: nama_gambar,
            },
            {
                where: { id: req.params.id },
                user: req.user.username,
            },
        );

        res.status(200).json({
            message: "Tentang Kami Berhasil Diupdate!",
            data: tentangkami,
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
exports.findData = async (req, res) => {
    try {
        const { lang } = req.query;
        const tentangkami = await TentangKami.findOne();

        if (!tentangkami) {
            return res.status(404).json({
                message: "Data tentang kami tidak ditemukan",
            });
        }

        // Default response (semua data jika lang tidak ada)
        let responseData = {
            id: tentangkami.id,
            judul: tentangkami.judul,
            deskripsi: tentangkami.deskripsi,
            image_background: tentangkami.image_background,
        };

        // Jika ada query lang, filter sesuai aturan
        if (lang === "id") {
            responseData = {
                id: tentangkami.id,
                judul: tentangkami.judul,
                deskripsi: tentangkami.deskripsi,
                image_background: tentangkami.image_background,
            };
        } else if (lang === "en") {
            responseData = {
                id: tentangkami.id,
                image_background: tentangkami.image_background,
            };
        }

        res.status(200).json({
            message: "Semua Data Tentang Kami",
            data: responseData,
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
    const dir = "public/images/tentang-kami";
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
        const tentangkami = await TentangKami.findOne();
        const formattedTentangKami = {
            id: tentangkami.id,
            judul: tentangkami.judul,
            deskripsi: tentangkami.deskripsi,
            image_background: tentangkami.image_background,
        };
        res.status(200).json({
            message: "Semua Data Tentang Kami",
            data: tentangkami,
            data: formattedTentangKami,
        });
    } catch (error) {
        next(error);
    }
};

// Get Image by Name
exports.getImageByNamePublic = (req, res) => {
    const { imageName } = req.params;
    const dir = "public/images/tentang-kami";
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

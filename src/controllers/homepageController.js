const { CmsHomepage } = require("../models");
const fs = require("fs");
const path = require("path");
const { exit } = require("process");
const {
    ensureDir,
    saveImage,
    deleteOldImage,
} = require("../utils/fileHandler");

const { encrypt, decrypt } = require("../utils/encryption");

// Upsert
exports.upsert = async (req, res) => {
    try {
        const { title, subTitle, titleEn, subTitleEn } = req.body;
        const image = req.file ? req.file.buffer : null;
        const dir = "public/images/homepage";

        let homepage = await CmsHomepage.findOne();
        let imageName = homepage ? homepage.image : null;

        if (image) {
            ensureDir(dir);
            imageName = saveImage(image, req.file.originalname, dir);
            if (homepage) deleteOldImage(path.join(dir, homepage.image));
        }

        if (!homepage) {
            homepage = await CmsHomepage.create(
                {
                    title,
                    subTitle,
                    titleEn,
                    subTitleEn,
                    image: imageName,
                },
                {
                    user: req.user.username,
                },
            );
            return res.status(201).json({
                message: "Beranda Berhasil Ditambahkan!",
            });
        }

        await homepage.update(
            {
                title,
                subTitle,
                titleEn,
                subTitleEn,
                image: imageName,
            },
            {
                where: { id: req.params.id },
                user: req.user.username,
            },
        );

        res.status(200).json({
            message: "Beranda berhasil diperbaharui!",
        });
    } catch (error) {
        if (error.name === "SequelizeValidationError") {
            const messages = error.errors.map((err) => err.message);
            return res.status(400).json({
                message: "Validation error",
                errors: messages,
            });
        }

        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Read All
exports.findData = async (req, res) => {
    try {
        const { lang } = req.query;
        const homepage = await CmsHomepage.findOne();

        if (!homepage) {
            return res.status(404).json({ message: "Data tidak ditemukan" });
        }

        const encryptedId = encrypt(homepage.id.toString());

        // Default response (semua data jika lang tidak ada)
        let responseData = {
            id: encryptedId,
            title: homepage.title,
            titleEn: homepage.titleEn,
            subTitle: homepage.subTitle,
            subTitleEn: homepage.subTitleEn,
            image: homepage.image,
        };

        // Jika ada query lang, filter sesuai aturan
        if (lang === "id") {
            responseData = {
                id: encryptedId,
                title: homepage.title,
                subTitle: homepage.subTitle,
                image: homepage.image,
            };
        } else if (lang === "en") {
            responseData = {
                id: encryptedId,
                title: homepage.titleEn,
                subTitle: homepage.subTitleEn,
                image: homepage.image,
            };
        }

        res.status(200).json({
            message: "Beranda berhasil diambil",
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
exports.getImageByName = async (req, res) => {
    try {
        const { imageName } = req.params;

        const homepage = await CmsHomepage.findOne();
        if (!homepage) {
            return res.status(404).json({
                message: "Data beranda tidak ditemukan!",
            });
        }

        if (imageName !== homepage.image) {
            return res.status(404).json({
                message: "Gambar tidak ditemukan!",
            });
        }

        const dir = "public/images/homepage";
        const imagePath = path.join(dir, imageName);

        if (fs.existsSync(imagePath)) {
            return res.sendFile(path.resolve(imagePath));
        } else {
            return res.status(404).json({
                message: "Gambar tidak ditemukan!",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};

//* START FUNCTION FOR PUBLIC
// GET All
exports.getAllPublic = async (req, res) => {
    try {
        const { lang } = req.query;
        const homepage = await CmsHomepage.findOne();

        if (!homepage) {
            return res.status(404).json({ message: "Data tidak ditemukan" });
        }

        const encryptedId = encrypt(homepage.id.toString());

        res.status(200).json({
            message: "Beranda berhasil diambil",
            data: {
                id: encryptedId,
                title: lang === "en" ? homepage.titleEn : homepage.title,
                subTitle:
                    lang === "en" ? homepage.subTitleEn : homepage.subTitle,
                image: homepage.image,
            },
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Get Image by Name
exports.getImageByNamePublic = async (req, res) => {
    try {
        const { imageName } = req.params;

        const homepage = await CmsHomepage.findOne();
        if (!homepage) {
            return res.status(404).json({
                message: "Data beranda tidak ditemukan!",
            });
        }

        if (imageName !== homepage.image) {
            return res.status(404).json({
                message: "Gambar tidak ditemukan!",
            });
        }

        const dir = "public/images/homepage";
        const imagePath = path.join(dir, imageName);

        if (fs.existsSync(imagePath)) {
            return res.sendFile(path.resolve(imagePath));
        } else {
            return res.status(404).json({
                message: "Gambar tidak ditemukan!",
            });
        }
    } catch (error) {
        res.status(500).json({
            message: "Internal Server Error",
            error: error.message,
        });
    }
};
//* END FUNCTION FOR PUBLIC

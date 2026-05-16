const { KontakFrontpage } = require("../models");

// Upsert
exports.upsert = async (req, res) => {
    try {
        const { url_map, alamat, email, no_phone } = req.body;

        const kontak = await KontakFrontpage.findOne();

        if (!kontak) {
            const kontak = await KontakFrontpage.create(
                {
                    url_map,
                    alamat,
                    email,
                    no_phone,
                },
                {
                    user: req.user.username,
                },
            );

            return res.status(201).json({
                message: "Kontak Berhasil Ditambahkan!",
                data: kontak,
            });
        }

        await kontak.update(
            {
                url_map,
                alamat,
                email,
                no_phone,
            },
            {
                where: { id: req.params.id },
                user: req.user.username,
            },
        );

        res.status(200).json({
            message: "Kontak berhasil diperbaharui",
            data: kontak,
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

// Read One
exports.findData = async (req, res) => {
    try {
        const kontak = await KontakFrontpage.findOne();
        res.status(200).json({
            message: "Kontak berhasil diambil!",
            data: kontak,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

//* START FUNCTION FOR PUBLIC
// Read One
exports.getOnePublic = async (req, res, next) => {
    try {
        const kontak = await KontakFrontpage.findOne({
            attributes: ["id", "url_map", "alamat", "email", "no_phone"],
        });
        res.status(200).json({
            message: "Kontak berhasil diambil!",
            data: kontak,
        });
    } catch (error) {
        next();
    }
};
//* END FUNCTION FOR PUBLIC

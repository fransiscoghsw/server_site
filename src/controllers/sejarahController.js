const { Sejarah } = require("../models");

// Upsert
exports.upsert = async (req, res) => {
    try {
        const { judul, deskripsi } = req.body;

        const sejarah = await Sejarah.findOne();

        if (!sejarah) {
            const sejarah = await Sejarah.create(
                {
                    judul,
                    deskripsi,
                },
                {
                    user: req.user.username,
                },
            );

            return res.status(201).json({
                message: "Sejarah Berhasil Ditambahkan!",
                data: sejarah,
            });
        }

        await sejarah.update(
            {
                judul,
                deskripsi,
            },
            {
                where: { id: req.params.id },
                user: req.user.username,
            },
        );

        res.status(200).json({
            message: "Tentang Kami Berhasil Diupdate!",
            data: sejarah,
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
        const sejarah = await Sejarah.findOne();
        const formattedSejarah = {
            judul: sejarah.judul,
            deskripsi: sejarah.deskripsi,
        };

        if (!sejarah) {
            return res.status(404).json({
                message: "Data sejarah tidak ada!",
            });
        }

        // Default response (semua data jika lang tidak ada)
        let responseData = {
            id: sejarah.id,
            judul: sejarah.judul,
            deskripsi: sejarah.deskripsi,
        };

        res.status(200).json({
            message: "Semua Data Sejarah",
            data: responseData,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

//* START FUNCTION FOR PUBLIC
// Read all
exports.getAllPublic = async (req, res, next) => {
    try {
        const { lang } = req.query;
        const sejarah = await Sejarah.findOne();

        if (!sejarah) {
            return res.status(404).json({
                message: "Data sejarah tidak ada!",
            });
        }

        const formattedSejarah = {
            judul: sejarah.judul,
            deskripsi: sejarah.deskripsi,
        };

        res.status(200).json({
            message: "Semua Data Sejarah",
            data: formattedSejarah,
        });
    } catch (error) {
        next(error);
    }
};

//* END FUNCTION FOR PUBLIC

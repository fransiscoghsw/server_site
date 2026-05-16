const path = require("path");

exports.validateUploadMultiFile = (options) => {
    return (req, res, next) => {
        const {
            fieldName = "image",
            allowedFileTypes = /jpeg|jpg|png|svg/,
            maxFileSize = 1024 * 1024 * 5, // 5MB
            required = true,
        } = options;

        // Pastikan `req.files` dalam bentuk array (bukan object)
        const files = req.files || [];

        if (required && files.length === 0) {
            return res.status(400).json({
                message: "Validation error",
                errors: [{ msg: `${fieldName} harus diupload` }],
            });
        }

        for (const file of files) {
            const mimetype = allowedFileTypes.test(file.mimetype);
            const extname = allowedFileTypes.test(
                path.extname(file.originalname).toLowerCase(),
            );

            if (!mimetype || !extname) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: [
                        {
                            msg: `Hanya file dengan tipe ${allowedFileTypes.toString()} yang diizinkan!`,
                        },
                    ],
                });
            }

            if (file.size > maxFileSize) {
                return res.status(400).json({
                    message: "Validation error",
                    errors: [
                        {
                            msg: `Ukuran file maksimal ${
                                maxFileSize / (1024 * 1024)
                            }MB!`,
                        },
                    ],
                });
            }
        }

        next();
    };
};

const { Customer } = require("../models");
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
            const dir = "public/images/customer";
            ensureDir(dir);
            image_name = `${Date.now()}-${req.file.originalname}`;
            fs.writeFileSync(path.join(dir, image_name), image);
        }

        const customer = await Customer.create(
            {
                nama,
                image: image_name,
            },
            {
                user: req.user.username,
            },
        );

        res.status(201).json({
            message: "Customer Berhasil ditambahkan!",
            data: customer,
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
        const customer = await Customer.findAll();
        res.status(200).json({
            message: "Customer berhasil diambil!",
            data: customer,
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
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: "Customer tidak ada!" });
        }
        res.status(200).json({
            message: "Customer berhasil diambil",
            data: customer,
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

        const customer = await Customer.findByPk(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: "Customer tidak ada" });
        }

        let image_name = customer.image;
        if (req.file) {
            const dir = "public/images/customer";
            ensureDir(dir);
            image_name = `${Date.now()}-${req.file.originalname}`;
            fs.writeFileSync(path.join(dir, image_name), req.file.buffer);

            if (customer.image) {
                const oldImagePath = path.join(dir, customer.image);
                if (fs.existsSync(oldImagePath)) {
                    fs.unlinkSync(oldImagePath);
                }
            }
        }

        await customer.update(
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
            message: "Customer berhasil diperbaharui!",
            data: customer,
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
        const customer = await Customer.findByPk(req.params.id);
        if (!customer) {
            return res.status(404).json({ message: "Customer tidak ada!" });
        }

        // Delete image file
        if (customer.image) {
            const imagePath = path.resolve(
                `public/images/tentang-customer/${customer.image}`,
            );
            if (fs.existsSync(imagePath)) {
                fs.unlink(imagePath, (err) => {
                    if (err) console.error(err);
                });
            }
        }

        await customer.destroy();
        res.status(200).json({
            message: "Customer berhasil dihapus",
            data: customer,
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
    const dir = "public/images/customer";
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
        const customer = await Customer.findAll({
            attributes: ["id", "nama", "image"],
        });
        res.status(200).json({
            message: "Customer berhasil diambil!",
            data: customer,
        });
    } catch (error) {
        next(error);
    }
};

// Read one
exports.getOnePublic = async (req, res, next) => {
    try {
        const customer = await Customer.findByPk(req.params.id, {
            attributes: ["id", "nama", "image"],
        });
        if (!customer) {
            return res.status(404).json({ message: "Customer tidak ada!" });
        }
        res.status(200).json({
            message: "Customer berhasil diambil",
            data: customer,
        });
    } catch (error) {
        next(error);
    }
};

// Get Image by Name
exports.getImageByNamePublic = (req, res) => {
    const { imageName } = req.params;
    const dir = "public/images/customer";
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

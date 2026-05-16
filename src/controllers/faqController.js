const { validationResult } = require("express-validator");
const { Faq } = require("../models");

// Create Faq
exports.create = async (req, res, next) => {
    try {
        const { pertanyaan, jawaban, status } = req.body;

        const faq = await Faq.create({
            pertanyaan,
            jawaban,
            status,
        });

        res.status(201).json({
            message: "FAQ berhasil ditambahkan!",
            data: faq,
        });
    } catch (error) {
        next(error);
    }
};

// Read all Faqs
exports.getAll = async (req, res, next) => {
    try {
        const faqs = await Faq.findAll();

        let data;

        // Jika lang tidak ada, kembalikan semua kolom
        data = faqs.map(({ id, pertanyaan, jawaban, status }) => ({
            id,
            pertanyaan,
            jawaban,
            status,
        }));

        res.status(200).json({
            message: "FAQ berhasil didapat!",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

// Read one Faq
exports.getOne = async (req, res, next) => {
    try {
        const faq = await Faq.findByPk(req.params.id);

        if (!faq) {
            return res.status(404).json({ message: "FAQ tidak ditemukan" });
        }

        let data;

        data = {
            id: faq.id,
            pertanyaan: faq.pertanyaan,
            jawaban: faq.jawaban,
            status: faq.status,
        };

        res.status(200).json({
            message: "FAQ berhasil didapat!",
            data: data,
        });
    } catch (error) {
        next(error);
    }
};

// Update Faq
exports.update = async (req, res, next) => {
    try {
        const { pertanyaan, jawaban, status } = req.body;

        const faq = await Faq.findByPk(req.params.id);
        if (!faq) {
            return res.status(404).json({ message: "FAQ tidak ditemukan" });
        }

        await faq.update(
            { pertanyaan, jawaban, status },
            {
                where: { id: req.params.id },
                user: req.user.username,
            },
        );

        res.status(200).json({
            message: "FAQ berhasil diupdate!",
            data: faq,
        });
    } catch (error) {
        next(error);
    }
};

// Delete Faq
exports.delete = async (req, res, next) => {
    try {
        const faq = await Faq.findByPk(req.params.id);
        if (!faq) {
            return res.status(404).json({ message: "FAQ tidak ditemukan" });
        }

        await faq.destroy();

        res.status(200).json({ message: "FAQ berhasil dihapus!", data: faq });
    } catch (error) {
        next(error);
    }
};

//* START FUNCTION FOR PUBLIC
// Read all Faqs
exports.getAllPublic = async (req, res, next) => {
    try {
        const faqs = await Faq.findAll();
        const formattedFaqs = faqs.map((faq) => {
            return {
                id: faq.id,
                pertanyaan: faq.pertanyaan,
                jawaban: faq.jawaban,
                status: faq.status,
            };
        });
        res.status(200).json({
            message: "FAQ berhasil Didapat!",
            data: formattedFaqs,
        });
    } catch (error) {
        next(error);
    }
};

// Read one Faq
exports.getOnePublic = async (req, res, next) => {
    try {
        const faq = await Faq.findByPk(req.params.id);
        if (!faq) {
            return res.status(404).json({ message: "FAQ tidak ditemukan" });
        }
        res.status(200).json({
            message: "FAQ berhasil Didapat!",
            data: faq,
            data: {
                id: faq.id,
                pertanyaan: faq.pertanyaan,
                jawaban: faq.jawaban,
                status: faq.status,
            },
        });
    } catch (error) {
        next(error);
    }
};

//* END FUNCTION FOR PUBLIC

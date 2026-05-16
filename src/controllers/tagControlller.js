const { Tag } = require("../models");
const fs = require("fs");
const path = require("path");

// Create
exports.create = async (req, res) => {
    try {
        const { nama, namaEn } = req.body;

        const tag = await Tag.create(
            {
                nama,
                namaEn,
            },
            {
                user: req.user.username,
            },
        );

        res.status(201).json({
            message: "Tag Berhasil ditambahkan!",
            data: tag,
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
        const tag = await Tag.findAll();
        const formattedTag = tag.map((tag) => ({
            id: tag.id,
            nama: lang === "en" ? tag.namaEn : tag.nama,
        }));
        res.status(200).json({
            message: "Tag berhasil diambil!",
            data: formattedTag,
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
        const tag = await Tag.findByPk(req.params.id);
        if (!tag) {
            return res.status(404).json({ message: "Tag tidak ada!" });
        }
        res.status(200).json({
            message: "Tag berhasil diambil",
            data: {
                id: tag.id,
                nama: lang === "en" ? tag.namaEn : tag.nama,
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
        const { nama, namaEn } = req.body;

        const tag = await Tag.findByPk(req.params.id);

        await tag.update(
            {
                nama,
                namaEn,
            },
            {
                where: { id: req.params.id },
                user: req.user.username,
            },
        );

        res.status(200).json({
            message: "Tag berhasil diperbaharui!",
            data: tag,
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
        const tag = await Tag.findByPk(req.params.id);
        if (!tag) {
            return res.status(404).json({ message: "Tag tidak ada!" });
        }

        await tag.destroy();
        res.status(200).json({
            message: "Tag berhasil dihapus",
            data: tag,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

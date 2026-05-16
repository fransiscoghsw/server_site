const { where, Op } = require("sequelize");
const {
    sequelize,
    Admin,
    AdminBiodata,
    Investment,
    Transaction,
    ProfitSharing,
    ProfitSharingTransaction,
    Notification,
    BankAccount,
    Role,
    AgentRegistration,
} = require("../models");
const bcrypt = require("bcrypt");
const { exit } = require("process");
const path = require("path");
const fs = require("fs");
const { ensureDir, saveImage } = require("../utils/fileHandler");

//* START ADMIN
exports.createUser = async (req, res, next) => {
    const { username, email, password, roleId } = req.body;

    try {
        const existingUser = await Admin.findOne({
            where: {
                [Op.or]: [{ username: username }, { email: email }],
            },
        });

        const role = await Role.findOne({ where: { id: roleId } });

        if (existingUser) {
            return res.status(400).json({
                message: "Username atau Email sudah digunakan!",
            });
        }

        if (!role) {
            return res.status(400).json({
                message: "Role tidak ditemukan!",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const admin = await Admin.create({
            username,
            email,
            password: hashedPassword,
            roleId,
        });

        res.status(201).json({
            message: "Registrasi Berhasil!",
        });
    } catch (error) {
        next(error);
    }
};

// Get Admin
exports.getAdmins = async (req, res, next) => {
    try {
        const admins = await Admin.findAll({
            include: { model: Role, as: "role" },
        });

        res.status(200).json({
            message: "Get Admins",
            data: admins,
        });
    } catch (error) {
        next(error);
    }
};

// Get Detail Admin
exports.getDetailAdmin = async (req, res, next) => {
    try {
        const adminId = req.params.adminId;
        const admin = await Admin.findOne({
            where: { id: adminId },
            include: [
                { model: Role, as: "role" },
                { model: AdminBiodata, as: "adminBiodata" },
            ],
        });

        if (!admin) {
            return res.status(404).json({
                message: "Data tidak ada!",
            });
        }

        res.status(200).json({
            message: "Get Detail Admin",
            data: admin,
        });
    } catch (error) {
        next(error);
    }
};

exports.updateAdmin = async (req, res, next) => {
    try {
        const adminId = req.params.adminId;
        const { username, email, password, roleId } = req.body;

        const admin = await Admin.findOne({
            where: { id: adminId },
            include: { model: Role, as: "role" },
        });

        if (!admin) {
            return res.status(404).json({
                message: "Data tidak ada!",
            });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        admin.update({
            username,
            email,
            password: hashedPassword,
            roleId,
        });

        res.status(200).json({
            message: "Data berhasil diubah!",
        });
    } catch (error) {
        next(error);
    }
};

exports.deleteAdmin = async (req, res, next) => {
    try {
        const adminId = req.params.adminId;
        const admin = await Admin.findByPk(adminId);
        const adminBiodata = await AdminBiodata.findOne({ where: { adminId } });
        if (!admin) {
            return res.status(404).json({
                message: "Data tidak ada!",
            });
        }

        if (adminBiodata) {
            await adminBiodata.destroy();
        }
        await admin.destroy();

        res.status(200).json({ message: "Data berhasil dihapus!" });
    } catch (error) {
        next(error);
    }
};

// Read All
exports.findAdminByAuth = async (req, res) => {
    try {
        const admins = await Admin.findOne({
            where: { id: req.user.id },
            include: {
                model: AdminBiodata,
                as: "adminBiodata",
            },
        });
        res.status(200).json({
            message: "Data Admin berhasil diambil!",
            data: admins,
        });
    } catch (error) {
        res.status(500).json({
            message: "Internal server error",
            error: error.message,
        });
    }
};

// Ubah Password Admin
exports.ubahPassword = async (req, res) => {
    try {
        const { oldPassword, newPassword, confirmationNewPassword } = req.body;
        const admin = await Admin.findByPk(req.user.id);

        if (!admin) {
            return res.status(404).json({ message: "Admin tidak ada!" });
        }

        const isPasswordValid = await bcrypt.compare(
            oldPassword,
            admin.password,
        );

        if (isPasswordValid != true) {
            return res
                .status(400)
                .json({ message: "Password Lama Tidak Valid!" });
        }

        if (newPassword !== confirmationNewPassword) {
            return res.status(400).json({ message: "Password Tidak Valid!" });
        }

        const hashedPassword = await bcrypt.hash(newPassword, 10);

        await admin.update(
            {
                password: hashedPassword,
            },
            {
                where: { id: req.params.id },
                user: req.user.username,
            },
        );

        res.status(200).json({
            message: "Password berhasil diperbaharui!",
            data: admin,
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
//* END ADMIN

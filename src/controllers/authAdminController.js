const { Admin, AdminBiodata, Role } = require("../models");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const crypto = require("crypto");
const { Op } = require("sequelize");
require("dotenv").config();

const { generateAccessToken, generateRefreshToken } = require("../utils/token");

const { exit } = require("process");

// Login Admin
exports.login = async (req, res, next) => {
    try {
        const { usernameOrEmail, password } = req.body;

        const admin = await Admin.findOne({
            where: {
                [Op.or]: [
                    { email: usernameOrEmail },
                    { username: usernameOrEmail },
                ],
            },
            attributes: ["id", "username", "email", "password", "refreshToken"],
            include: {
                model: Role,
                as: "role",
                attributes: ["name"],
            },
        });

        if (!admin) {
            return res
                .status(400)
                .json({ message: "Kesalahan Username/Email atau Password!" });
        }

        const validPassword = await bcrypt.compare(password, admin.password);
        if (!validPassword) {
            return res
                .status(400)
                .json({ message: "Kesalahan Username/Email atau Password!" });
        }

        // Periksa refresh token di database
        if (admin.refreshToken) {
            // Verifikasi kadaluarsa refresh token
            try {
                jwt.verify(admin.refreshToken, process.env.REFRESH_SECRET_KEY);
            } catch (err) {
                // Jika kadaluarsa, hapus token dari database
                if (err.name === "TokenExpiredError") {
                    admin.refreshToken = null;
                    await admin.save();
                } else {
                    throw err;
                }
            }
        }

        // Buat token baru jika login diizinkan
        const accessToken = generateAccessToken(admin, admin.role.name);
        const refreshToken = generateRefreshToken(admin, admin.role.name);

        admin.refreshToken = refreshToken;
        await admin.save();

        res.cookie("accessToken", accessToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 15 * 60 * 1000,
        });

        res.cookie("refreshToken", refreshToken, {
            httpOnly: true,
            secure: false,
            sameSite: "lax",
            maxAge: 24 * 60 * 60 * 1000,
        });

        res.status(200).json({ message: "Login Berhasil", accessToken });
    } catch (error) {
        next(error);
    }
};

// Request password reset
exports.requestPasswordReset = async (req, res, next) => {
    try {
        const { email } = req.body;

        const admin = await Admin.findOne({ where: { email } });

        if (!admin) {
            return res.status(404).json({ message: "Admin not found." });
        }

        const resetPasswordToken = crypto.randomBytes(20).toString("hex");
        const resetPasswordTokenExpiry = new Date(Date.now() + 3600000); // Token valid for 1 hour

        admin.resetPasswordToken = resetPasswordToken;
        admin.resetPasswordTokenExpiry = resetPasswordTokenExpiry;
        await admin.save();

        res.status(200).json({
            message: "Password reset email sent! Please check your inbox.",
        });
    } catch (error) {
        next(error);
    }
};

// Reset password
exports.resetPassword = async (req, res, next) => {
    try {
        const { token, newPassword } = req.body;

        const admin = await Admin.findOne({
            where: {
                resetPasswordToken: token,
                resetPasswordTokenExpiry: {
                    [Op.gt]: new Date(),
                },
            },
        });

        if (!admin) {
            return res
                .status(400)
                .json({ message: "Invalid or expired reset token." });
        }

        admin.password = await bcrypt.hash(newPassword, 10);
        admin.resetPasswordToken = null;
        admin.resetPasswordTokenExpiry = null;
        await admin.save();

        const judul = "Reset Password Successfull";

        res.status(200).json({ message: "Password successfully updated!" });
    } catch (error) {
        next(error);
    }
};

exports.protected = async (req, res, next) => {
    try {
        const admin = req.user;

        const adminBiodata = await AdminBiodata.findOne({
            where: { adminId: admin.id },
            attributes: ["foto_profil"],
        });

        // Tambahkan foto_profil ke dalam objek admin
        admin.foto_profil = adminBiodata ? adminBiodata.foto_profil : null;

        res.json({
            message: "This is a protected route",
            data: admin,
        });
    } catch (error) {
        next(error);
    }
};

// Refresh token
exports.refreshToken = async (req, res, next) => {
    const refreshToken = req.cookies.refreshToken;

    if (!refreshToken) {
        return res
            .status(403)
            .json({ message: "Refresh token tidak disediakan" });
    }

    try {
        const storedToken = await Admin.findOne({
            where: { refreshToken: refreshToken },
            attributes: ["id", "username", "email", "refreshToken"],
            include: {
                model: Role,
                as: "role",
                attributes: ["name"],
            },
        });

        if (!storedToken) {
            return res
                .status(403)
                .json({ message: "Refresh token tidak valid" });
        }

        jwt.verify(
            refreshToken,
            process.env.REFRESH_SECRET_KEY,
            async (err, user) => {
                if (err) {
                    console.error("Kesalahan Verifikasi Refresh Token:", err);
                    return res
                        .status(403)
                        .json({ message: "Token tidak valid" });
                }

                const newAccessToken = generateAccessToken(
                    storedToken,
                    storedToken.role.name,
                );

                res.cookie("accessToken", accessToken, {
                    httpOnly: true,
                    secure: false,
                    sameSite: "lax",
                    maxAge: 15 * 60 * 1000,
                });

                res.status(200).json({ accessToken: newAccessToken });
            },
        );
    } catch (error) {
        next(error);
    }
};

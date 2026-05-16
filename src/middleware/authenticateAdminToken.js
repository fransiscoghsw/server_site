const jwt = require("jsonwebtoken");
const { Admin } = require("../models");
const blacklist = new Set();
const dotenv = require("dotenv");
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env";
dotenv.config({ path: envFile });

// Middleware untuk memverifikasi access token dengan daftar role yang valid
const authenticateAdminToken =
    (roles = []) =>
    (req, res, next) => {
        const token = req.cookies.accessToken;

        if (!token) {
            return res
                .status(401)
                .json({ message: "Access denied. No token provided." });
        }

        if (blacklist.has(token)) {
            return res
                .status(403)
                .json({ message: "Token has been blacklisted." });
        }

        jwt.verify(token, process.env.ACCESS_SECRET_KEY, (err, user) => {
            if (err) {
                console.error("Token verification failed:", err);
                return res
                    .status(403)
                    .json({ message: "Invalid or expired token." });
            }

            if (!roles.includes(user.role)) {
                return res.status(403).json({
                    message:
                        "Access denied. You do not have the required role.",
                });
            }

            req.user = user;
            next();
        });
    };

// Fungsi logout untuk admin
const logout = async (req, res) => {
    try {
        const token = req.cookies.accessToken;

        if (!token) {
            return res
                .status(400)
                .json({ message: "Token tidak ada / Anda belum login!" });
        }

        jwt.verify(token, process.env.ACCESS_SECRET_KEY, async (err, user) => {
            if (err) {
                return res.status(400).json({ message: "Token tidak valid." });
            }

            const admin = await Admin.findOne({ where: { id: user.id } });
            if (!admin) {
                return res.status(400).json({
                    message: "Admin tidak ditemukan atau sudah logout.",
                });
            }

            // Set refreshToken admin ke null di database
            admin.refreshToken = null;
            await admin.save();

            // Tambahkan token ke blacklist dan set timeout untuk menghapus setelah kadaluarsa
            blacklist.add(token);
            setTimeout(() => blacklist.delete(token), 15 * 60 * 1000); // Expired setelah 15 menit

            // Hapus cookie accessToken dan refreshToken
            res.clearCookie("accessToken");
            res.clearCookie("refreshToken");

            res.status(200).json({ message: "Logout berhasil." });
        });
    } catch (error) {
        console.error("Logout error:", error);
        res.status(500).json({
            message: "Terjadi kesalahan saat logout.",
            error: error.message,
        });
    }
};

// const logout = async (req, res) => {
//     try {
//         const token = req.cookies.accessToken;

//         if (!token) {
//             return res
//                 .status(400)
//                 .json({ message: "Token tidak ada / Anda belum login!" });
//         }

//         const decoded = jwt.verify(token, process.env.ACCESS_SECRET_KEY);
//         const admin = await Admin.findOne({ where: { id: decoded.id } });

//         if (!admin) {
//             return res.status(400).json({
//                 message: "Admin tidak ditemukan atau sudah logout.",
//             });
//         }

//         // Nullify refreshToken untuk admin di database
//         admin.refreshToken = null;
//         await admin.save();

//         // Blacklist token dan hapus dari memory setelah token expire
//         const expiryDuration = (decoded.exp - Math.floor(Date.now() / 1000)) * 1000;
//         blacklist.add(token);
//         setTimeout(() => blacklist.delete(token), expiryDuration);

//         // Clear cookies
//         res.clearCookie("accessToken");
//         res.clearCookie("refreshToken");

//         res.status(200).json({ message: "Logout berhasil." });
//     } catch (error) {
//         if (error.name === "JsonWebTokenError" || error.name === "TokenExpiredError") {
//             return res.status(400).json({ message: "Token tidak valid atau telah kadaluwarsa." });
//         }

//         console.error("Logout error:", error);
//         res.status(500).json({
//             message: "Terjadi kesalahan saat logout.",
//             error: error.message,
//         });
//     }
// };
module.exports = { authenticateAdminToken, logout };

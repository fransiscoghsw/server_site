const jwt = require("jsonwebtoken");

const dotenv = require("dotenv");
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env";
dotenv.config({ path: envFile });

// Membuat access token
const generateAccessToken = (user, role) => {
    const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: role,
    };
    return jwt.sign(payload, process.env.ACCESS_SECRET_KEY, {
        expiresIn: "15m",
    });
};

// Membuat refresh token
const generateRefreshToken = (user, role) => {
    const payload = {
        id: user.id,
        username: user.username,
        email: user.email,
        role: role,
    };
    return jwt.sign(payload, process.env.REFRESH_SECRET_KEY, {
        expiresIn: "1d",
    });
};

module.exports = {
    generateAccessToken,
    generateRefreshToken,
};

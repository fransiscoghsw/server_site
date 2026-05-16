const crypto = require("crypto");
const dotenv = require("dotenv");
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env";
dotenv.config({ path: envFile });

const secretKey = process.env.ENCRYPTION_SECRET;
const iv = process.env.ENCRYPTION_IV;

if (secretKey.length !== 32) {
    throw new Error("ENCRYPTION_SECRET must be 32 characters long.");
}

if (iv.length !== 16) {
    throw new Error("ENCRYPTION_IV must be 16 characters long.");
}

// Fungsi untuk mengenkripsi
exports.encrypt = (text) => {
    const cipher = crypto.createCipheriv(
        "aes-256-cbc",
        Buffer.from(secretKey),
        Buffer.from(iv),
    );
    let encrypted = cipher.update(text, "utf-8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
};

// Fungsi untuk mendekripsi
exports.decrypt = (encryptedText) => {
    const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        Buffer.from(secretKey),
        Buffer.from(iv),
    );
    let decrypted = decipher.update(encryptedText, "hex", "utf-8");
    decrypted += decipher.final("utf-8");
    return decrypted;
};

// Fungsi untuk mengenkripsi data (objek atau struktur kompleks)
exports.encryptData = (data) => {
    // Jika data adalah objek, ubah menjadi string JSON
    if (typeof data === "object") {
        data = JSON.stringify(data);
    }

    const cipher = crypto.createCipheriv(
        "aes-256-cbc",
        Buffer.from(secretKey),
        Buffer.from(iv),
    );

    let encrypted = cipher.update(data, "utf-8", "hex");
    encrypted += cipher.final("hex");
    return encrypted;
};

// Fungsi untuk mendekripsi data yang telah dienkripsi
exports.decryptData = (encryptedData) => {
    const decipher = crypto.createDecipheriv(
        "aes-256-cbc",
        Buffer.from(secretKey),
        Buffer.from(iv),
    );

    let decrypted = decipher.update(encryptedData, "hex", "utf-8");
    decrypted += decipher.final("utf-8");

    try {
        // Jika hasil decrypted bisa di-parse sebagai JSON, kembalikan sebagai objek
        return JSON.parse(decrypted);
    } catch (e) {
        // Jika gagal parse JSON, kembalikan sebagai string
        return decrypted;
    }
};

const QRCode = require("qrcode");
const path = require("path");
const fs = require("fs/promises");

/**
 * Generate QR Code PNG file.
 * @param {string} data - Data yang akan diencode ke QR code (misal URL).
 * @param {string} fileName - Nama file PNG yang ingin disimpan (misal 'farm_123.png').
 * @param {string} dirPath - Folder path tempat menyimpan file QR (default: 'public/assets/qrcodes').
 * @param {object} options - Opsi tambahan untuk QRCode.toFile (optional).
 * @returns {Promise<string>} - Mengembalikan path file relatif hasil generate.
 */
async function generateQRCode(
    data,
    fileName,
    dirPath = "public/assets/qrcodes",
    options = {},
) {
    try {
        const folderPath = path.resolve(dirPath);
        await fs.mkdir(folderPath, { recursive: true });

        const filePath = path.join(folderPath, fileName);

        const defaultOptions = {
            color: {
                dark: "#000000",
                light: "#FFFFFF",
            },
            width: 300,
            ...options,
        };

        await QRCode.toFile(filePath, data, defaultOptions);

        return path.join(dirPath, fileName);
    } catch (err) {
        throw new Error(`Gagal generate QR Code: ${err.message}`);
    }
}

/**
 * Delete file QR Code PNG.
 * @param {string} fileName - Nama file yang ingin dihapus (misal 'farm_123.png').
 * @param {string} dirPath - Folder tempat file disimpan (default: 'public/assets/qrcodes').
 * @returns {Promise<void>}
 */
async function deleteQRCode(fileName, dirPath = "public/assets/qrcodes") {
    try {
        const filePath = path.resolve(dirPath, fileName);
        await fs.unlink(filePath);
    } catch (err) {
        // Bisa abaikan error jika file tidak ada
        if (err.code !== "ENOENT") {
            throw new Error(`Gagal hapus QR Code: ${err.message}`);
        }
    }
}

/**
 * Generate QR Code dan return hasil dalam bentuk base64 string.
 * @param {string} data - Data untuk encode QR.
 * @param {object} options - Opsi tambahan untuk QRCode.toDataURL.
 * @returns {Promise<string>} - Base64 string QR Code.
 */
async function generateQRCodeBase64(data, options = {}) {
    try {
        const defaultOptions = {
            color: {
                dark: "#000000",
                light: "#FFFFFF",
            },
            width: 300,
            ...options,
        };
        const base64Data = await QRCode.toDataURL(data, defaultOptions);
        return base64Data; // contoh: 'data:image/png;base64,iVBORw0KG...'
    } catch (err) {
        throw new Error(`Gagal generate QR Code base64: ${err.message}`);
    }
}

module.exports = {
    generateQRCode,
    deleteQRCode,
    generateQRCodeBase64,
};

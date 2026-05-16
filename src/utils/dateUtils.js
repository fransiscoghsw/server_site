const { DateTime } = require("luxon");

// Zona waktu default (Asia/Jakarta)
const DEFAULT_ZONE = "Asia/Jakarta";

/**
 * Mendapatkan waktu saat ini dalam zona waktu Indonesia
 * @returns {string} - Format ISO string (YYYY-MM-DDTHH:mm:ss.SSSZ)
 */
const getCurrentDateTime = () => {
    return DateTime.now().setZone(DEFAULT_ZONE).toISO();
};

/**
 * Mendapatkan waktu saat ini dalam format tertentu
 * @param {string} format - Format Luxon (default: "yyyy-MM-dd HH:mm:ss")
 * @returns {string} - String format yang sesuai
 */
const getFormattedDate = (format = "yyyy-MM-dd HH:mm:ss") => {
    return DateTime.now().setZone(DEFAULT_ZONE).toFormat(format);
};

/**
 * Konversi string tanggal ke format lain
 * @param {string} dateString - String tanggal (ISO format atau lainnya)
 * @param {string} format - Format keluaran (default: "yyyy-MM-dd HH:mm:ss")
 * @returns {string} - Tanggal dalam format yang diinginkan
 */
const convertDateFormat = (dateString, format = "yyyy-MM-dd HH:mm:ss") => {
    return DateTime.fromISO(dateString, { zone: DEFAULT_ZONE }).toFormat(
        format,
    );
};

/**
 * Menambah/mengurangi waktu dari tanggal tertentu
 * @param {string} dateString - String tanggal dalam ISO format
 * @param {number} value - Jumlah waktu yang ingin ditambah/kurangi
 * @param {string} unit - Unit waktu ("days", "months", "years", "hours", "minutes", dll.)
 * @returns {string} - Tanggal baru dalam format ISO
 */
const addOrSubtractTime = (dateString, value, unit) => {
    return DateTime.fromISO(dateString, { zone: DEFAULT_ZONE })
        .plus({ [unit]: value })
        .toISO();
};

/**
 * Mengecek apakah tanggal tertentu sudah lewat
 * @param {string} dateString - Tanggal dalam format ISO
 * @returns {boolean} - True jika sudah lewat, False jika masih di masa depan
 */
const isPastDate = (dateString) => {
    return (
        DateTime.fromISO(dateString, { zone: DEFAULT_ZONE }) <
        DateTime.now().setZone(DEFAULT_ZONE)
    );
};

module.exports = {
    getCurrentDateTime,
    getFormattedDate,
    convertDateFormat,
    addOrSubtractTime,
    isPastDate,
};

// const dateUtils = require("./utils/dateUtils");

// // Mendapatkan waktu saat ini dalam zona waktu Indonesia
// console.log("Current DateTime:", dateUtils.getCurrentDateTime());

// // Mendapatkan waktu dalam format "DD-MM-YYYY HH:mm:ss"
// console.log(
//     "Formatted Date:",
//     dateUtils.getFormattedDate("dd-MM-yyyy HH:mm:ss"),
// );

// // Konversi tanggal ISO ke format yang berbeda
// console.log(
//     "Converted Date:",
//     dateUtils.convertDateFormat(
//         "2025-03-07T12:30:00.000Z",
//         "dd LLL yyyy HH:mm",
//     ),
// );

// // Menambahkan 5 hari dari tanggal tertentu
// console.log(
//     "Date +5 days:",
//     dateUtils.addOrSubtractTime("2025-03-07T12:30:00.000Z", 5, "days"),
// );

// // Mengecek apakah tanggal sudah lewat
// console.log("Is Past Date:", dateUtils.isPastDate("2025-01-01T00:00:00.000Z"));

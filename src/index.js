const dotenv = require("dotenv");
const express = require("express");
const bodyParser = require("body-parser");
const { sequelize } = require("./models");
const handleError = require("./middleware/errorMiddleware");
const cors = require("cors");
const session = require("express-session");
const cookieParser = require("cookie-parser");
const applyHelmet = require("./config/helmetConfig");
const morgan = require("morgan");
const rateLimit = require("express-rate-limit");

// Memuat file .env berdasarkan environment
const envFile = process.env.NODE_ENV ? `.env.${process.env.NODE_ENV}` : ".env";
dotenv.config({ path: envFile });

const app = express();

// CORS
// Mendapatkan CORS origins dari environment variable
const allowedOrigins = process.env.CORS_ORIGINS.split(",");

app.use(
    cors({
        origin: allowedOrigins,
        credentials: true,
    }),
);

// Middleware untuk logging request (optional, bisa matikan jika tidak perlu)
app.use(morgan("combined"));

// Gunakan semua middleware Helmet dari config
applyHelmet().forEach((middleware) => app.use(middleware));

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ limit: "20mb", extended: false }));

// parse application/json
app.use(bodyParser.json({ limit: "20mb" }));
app.use(cookieParser());
app.use(
    session({
        secret: process.env.ACCESS_SECRET_KEY,
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false }, // Ubah menjadi true jika menggunakan https
    }),
);

const PORT = process.env.PORT;

const homepageRoutes = require("./routes/homepageRoutes");
const nilaiNilaiPerusahaanRoutes = require("./routes/nilaiNilaiPerusahaanRoutes");
const sosialMediaRoutes = require("./routes/sosialMediaRoutes");
const kontakFrontpageRoutes = require("./routes/kontakFrontpageRoutes");
const dokumentasiFrontpageRoutes = require("./routes/dokumentasiFrontpageRoutes");
const customerRoutes = require("./routes/customerRoutes");
const partnerRoutes = require("./routes/partnerRoutes");
const faqRoutes = require("./routes/faqRoutes");
const tentangKamiRoutes = require("./routes/tentangKamiRoutes");
const sejarahRoutes = require("./routes/sejarahRoutes");
const dokumenFrontpageRoutes = require("./routes/dokumenFrontpageRoutes");
const authAdminRoutes = require("./routes/authAdminRoutes");
const adminBiodataRoutes = require("./routes/adminBiodataRoutes");
const adminRoutes = require("./routes/adminRoutes");
const testimoniRoutes = require("./routes/testimoniRoutes");
const productRoutes = require("./routes/productRoutes");
const roleRoutes = require("./routes/roleRoutes");
const publicRoutes = require("./routes/publicRoutes");

// // Terapkan rate limiter hanya untuk route API
// app.use("/api", apiLimiter);

app.use("/api/homepage", homepageRoutes);
app.use("/api/nilai-nilai-perusahaan", nilaiNilaiPerusahaanRoutes);
app.use("/api/sosial-media", sosialMediaRoutes);
app.use("/api/kontak-frontpage", kontakFrontpageRoutes);
app.use("/api/dokumentasi-frontpage", dokumentasiFrontpageRoutes);
app.use("/api/customer", customerRoutes);
app.use("/api/partner", partnerRoutes);
app.use("/api/faq", faqRoutes);
app.use("/api/tentang-kami", tentangKamiRoutes);
app.use("/api/sejarah", sejarahRoutes);
app.use("/api/dokumen-frontpage", dokumenFrontpageRoutes);
app.use("/api/auth/admin", authAdminRoutes);
app.use("/api/biodata-admin", adminBiodataRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/testimoni", testimoniRoutes);
app.use("/api/product", productRoutes);
app.use("/api/role", roleRoutes);
app.use("/api/v1/public", publicRoutes);

app.use(handleError);

app.listen(PORT, async () => {
    console.log(
        `Server running in ${process.env.NODE_ENV || "development"} mode on port ${PORT}`,
    );
    try {
        await sequelize.authenticate();
        console.log("Database Connected!");
    } catch (error) {
        console.error("Database Connection Failed:", error);
    }
});

module.exports = app;

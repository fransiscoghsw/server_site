const helmet = require("helmet");

module.exports = () => {
    return [
        helmet(), // Base helmet

        // Allow cross-origin image access
        // Allow cross-origin image access
        helmet.crossOriginResourcePolicy({ policy: "cross-origin" }),

        // Cegah clickjacking
        helmet.frameguard({ action: "deny" }),

        // Tambahan proteksi XSS
        helmet.xssFilter(),

        // Hindari MIME sniffing
        helmet.noSniff(),

        // HSTS: paksa HTTPS di semua subdomain (aktifkan hanya jika HTTPS sudah digunakan)
        helmet.hsts({
            maxAge: 31536000, // 1 tahun
            includeSubDomains: true,
            preload: true,
        }),

        // Batasi referrer
        helmet.referrerPolicy({
            policy: "no-referrer",
        }),

        // Batasi fitur browser (contoh: kamera, mic, geo)
        // helmet.permissionsPolicy({
        //     features: {
        //         camera: ["'none'"],
        //         microphone: ["'none'"],
        //         geolocation: ["'none'"],
        //         fullscreen: ["'self'"],
        //     },
        // }),

        // CSP - Sesuaikan ini dengan kebutuhan frontend
        helmet.contentSecurityPolicy({
            directives: {
                defaultSrc: ["'self'"],
                scriptSrc: [
                    "'self'",
                    "'unsafe-inline'", // React DevTools atau inline script
                    "https://cdn.jsdelivr.net", // kalau kamu pakai JS dari CDN
                ],
                styleSrc: [
                    "'self'",
                    "'unsafe-inline'", // inline style di React
                    "https://fonts.googleapis.com", // Google Fonts
                    "https://cdn.jsdelivr.net", // CDN style
                ],
                fontSrc: [
                    "'self'",
                    "https://fonts.gstatic.com", // Font dari Google Fonts
                    "https://cdn.jsdelivr.net", // Font dari CDN
                ],
                imgSrc: [
                    "'self'",
                    "data:", // untuk base64 image (foto profil dsb)
                    "https://api.kembarmedikasafety.web.id", // CDN gambar (ganti jika beda)
                    "https://kembarmedikasafety.web.id", // contoh tambahan
                ],
                connectSrc: [
                    "'self'",
                    "https://api.kembarmedikasafety.web.id", // API kamu
                ],
                objectSrc: ["'none'"],
                baseUri: ["'self'"],
                upgradeInsecureRequests: [],
            },
        }),
    ];
};

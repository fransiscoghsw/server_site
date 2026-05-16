// jest.config.js
process.env.NODE_ENV = "test";
require("dotenv").config({ path: ".env.test" });

module.exports = {
    testEnvironment: "node", // Environment untuk Node.js
    testMatch: ["**/tests/**/*.test.js"], // Mencari file pengujian dengan ekstensi .test.js
    verbose: true, // Menampilkan hasil pengujian dengan lebih detail
    collectCoverage: true, // Mengaktifkan laporan coverage
    coverageDirectory: "coverage", // Folder output laporan coverage
    coverageThreshold: {
        global: {
            branches: 80,
            functions: 80,
            lines: 80,
            statements: 80,
        },
    },
    setupFiles: ["dotenv/config"], // Memastikan dotenv ter-load
    setupFilesAfterEnv: ["<rootDir>/src/tests/jest.setup.js"], // Setup tambahan setelah environment siap
};

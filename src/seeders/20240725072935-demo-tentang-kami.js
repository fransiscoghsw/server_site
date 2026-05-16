"use strict";

const { faker } = require("@faker-js/faker");

/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        /**
         * Add seed commands here.
         *
         * Example:
         * await queryInterface.bulkInsert('People', [{
         *   name: 'John Doe',
         *   isBetaMember: false
         * }], {});
         */
        await queryInterface.bulkInsert(
            "TentangKamis",
            [
                {
                    judul: "SUKAHARJA QUAIL INDONESIA",
                    deskripsi:
                        "Burung puyuh adalah perwujudan kekuatan besar dari ruang kecil. Dengan tubuhnya yang kecil, puyuh bisa menghasilkan sampai 300 butir telur dalam setahun. Ukuran mereka tidak menjadi hambatan untuk menghasilkan sumber nutrisi tinggi dalam jumlah yang banyak. Terkenal karena dagingnya yang ramping dan empuk, burung puyuh menawarkan alternatif yang kaya protein dibandingkan unggas tradisional, kaya akan asam amino esensial yang penting untuk perbaikan dan pertumbuhan otot. Telurnya, meskipun ukurannya kecil, mengandung proporsi vitamin dan mineral yang lebih tinggi dibandingkan telur ayam, menjadikannya tambahan padat nutrisi untuk makanan apa pun. \n\n Potensi pengembangan gizi yang ditawarkan oleh puyuh sangatlah besar. Maka dari itu, PT Sukaharja Quail Indonesia berkomitmen untuk menggerakan industri peternakan puyuh dan pengembangan nutrisi masyarakat Indonesia. PT SQI ingin memenuhi permintaan masyarakat terhadap telur puyuh di rumah tangga dan pasar. Menjadi entitas yang memberdayakan ternak dan gizi masyarakat Indonesia.",
                    judulEn: "SUKAHARJA QUAIL INDONESIA",
                    deskripsiEn:
                        "Quails are the embodiment of great power in a small space. Despite their small size, quails can produce up to 300 eggs a year. Their size is no barrier to producing a high-nutrient source in large quantities. Known for their lean, tender meat, quails offer a protein-rich alternative to traditional poultry, rich in essential amino acids that are essential for muscle repair and growth. Their eggs, despite their small size, contain a higher proportion of vitamins and minerals than chicken eggs, making them a nutrient-dense addition to any diet. \n\n The nutritional development potential offered by quails is enormous. Therefore, PT Sukaharja Quail Indonesia is committed to driving the quail farming industry and developing nutrition for the Indonesian people. PT SQI wants to meet the public demand for quail eggs in households and markets. To become an entity that empowers livestock and nutrition for the Indonesian people.",
                    image_background: faker.image.url(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
            ],
            {},
        );
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete("TentangKamis", null, {});
    },
};

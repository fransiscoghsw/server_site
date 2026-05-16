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
            "Sejarahs",
            [
                {
                    judul: "PROFIL",
                    deskripsi:
                        "Slamet Wuryadi memulai usahanya pada tahun 2002, dengan mendirikan CV Slamet Quail Farm di Desa Cilangkap, Kecamatan Cikembar, Kabupaten Sukabumi. Bisnisnya berfokus pada budidaya burung puyuh, termasuk pembibitan, produksi telur konsumsi, dan pengolahan produk terkait. Seiring waktu, CV Slamet Quail Farm berkembang menjadi pusat pelatihan pertanian dan perdesaan swadaya, memberdayakan masyarakat melalui pelatihan beternak puyuh. \n\n Sementara itu, PT Sukaharja Quail Indonesia berperan aktif dalam pengembangan agribisnis puyuh di Indonesia. Perusahaan ini bekerja sama dengan berbagai institusi, seperti Quail Innovation Center dan Asosiasi Puyuh Indonesia, untuk menyelenggarakan workshop dan pelatihan beternak puyuh, guna meningkatkan peluang ekonomi dan mendukung program makanan bergizi nasional.",
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
        await queryInterface.bulkDelete("Sejarahs", null, {});
    },
};

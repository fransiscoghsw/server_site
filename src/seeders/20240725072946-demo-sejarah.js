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
                    judulEn: "PROFILE",
                    deskripsiEn:
                        "Slamet Wuryadi started his business in 2002, by establishing CV Slamet Quail Farm in Cilangkap Village, Cikembar District, Sukabumi Regency. His business focuses on quail farming, including breeding, production of consumer eggs, and processing of related products. Over time, CV Slamet Quail Farm has developed into a self-reliant agricultural and rural training center, empowering communities through quail farming training. \n\n Meanwhile, PT Sukaharja Quail Indonesia plays an active role in the development of quail agribusiness in Indonesia. The company collaborates with various institutions, such as the Quail Innovation Center and the Indonesian Quail Association, to organize quail farming workshops and training, in order to increase economic opportunities and support the national nutritious food program.",
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

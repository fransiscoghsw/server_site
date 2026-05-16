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

        const founder = [];

        for (let i = 0; i < 3; i++) {
            const data = {
                nama: faker.lorem.word(),
                jabatan: faker.lorem.word(),
                deskripsi: faker.lorem.paragraphs(),
                gambar: faker.image.url(),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            founder.push(data);
        }

        await queryInterface.bulkInsert(
            "Founders",
            [
                {
                    nama: "Dr. (HC) Slamet Wuryadi",
                    jabatan: "Co-Founder, Direktur Utama",
                    deskripsi:
                        "Slamet, alumni IPB angkatan 27, telah menjalankan usaha peternakan telur puyuh sejak 2002 serta mengembangkan agribisnis terpadu, hortikultura, dan perikanan. Sebagai Ketua Umum APPI, ia menekankan pentingnya kemandirian pangan nasional dan melihat peluang besar di industri puyuh karena Indonesia tidak mengimpor puyuh sejak 1979. Usahanya mendapat hak paten sebagai pelestari plasma nutfah puyuh lokal dan penghargaan Adhikarya Pangan Nusantara. \n\n Keunggulan bisnisnya meliputi harga stabil, permintaan tinggi, pembayaran tunai, dukungan UMKM, serta manfaat kotoran puyuh sebagai pupuk dan biogas. Slamet menerapkan prinsip sukses: laku, untung, jujur, berpihak pada konsumen, dan dapat pesan ulang. Ia juga memberdayakan ribuan masyarakat, mendanai pesantren, serta menyediakan pendidikan gratis di pondok wirausahanya. Baginya, usahanya adalah bentuk pengabdian dan sedekah ilmu untuk meningkatkan kesejahteraan masyarakat.",
                    jabatanEn: "Co-Founder, President Director",
                    deskripsiEn:
                        "Slamet, an alumnus of IPB class of 27, has been running a quail egg farm since 2002 and has developed integrated agribusiness, horticulture, and fisheries. As the General Chairperson of APPI, he emphasized the importance of national food independence and saw great opportunities in the quail industry because Indonesia has not imported quail since 1979. His business has received a patent as a preserver of local quail germplasm and the Adhikarya Pangan Nusantara award. \n\n The advantages of his business include stable prices, high demand, cash payments, support for MSMEs, and the benefits of quail droppings as fertilizer and biogas. Slamet applies the principles of success: selling, profit, honesty, siding with consumers, and can be reordered. He also empowers thousands of people, funds Islamic boarding schools, and provides free education at his entrepreneurial boarding school. For him, his business is a form of devotion and alms of knowledge to improve the welfare of society.",
                    gambar: faker.image.url(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    nama: "Prof. Erliza Hambali",
                    jabatan: "Co-Founder, Commisioner",
                    deskripsi:
                        "Prof. Erliza, Guru Besar Departemen Teknologi Pertanian IPB, mendirikan dan memimpin Pusat Penelitian Surfaktan dan Bioenergi (SBRC) dari 2006 hingga 2018. Ia meneliti kelapa sawit sejak 2000 dan mengembangkan inovasi surfaktan berbasis sawit untuk meningkatkan nilai tambah Crude Palm Oil, yang membawanya meraih penghargaan 20 Flagship Technology Work of Nation (2015). \n\n Selain itu, ia menemukan berbagai inovasi, termasuk produksi surfaktan Alkyl Polyglycoside, pemanfaatan lemak tengkawang untuk lipstik, dan produksi gelatin dari kulit sapi. Dengan 9 inovasi dan 13 paten terdaftar, ia juga mendirikan PT. Eliza Chocolate Factory dan PT. Liza Herbal Internasional. Atas dedikasinya, Prof. Erliza menerima berbagai penghargaan, seperti Anugerah Kekayaan Intelektual Luar Biasa (2012), 12 World Class Innovators: Surfactant Technology (2015), dan Hak Kekayaan Intelektual dari Kemenristekdikti (2018).",
                    jabatanEn: "Co-Founder, Commisioner",
                    deskripsiEn:
                        "Prof. Erliza, Professor of the Department of Agricultural Technology, IPB, founded and led the Surfactant and Bioenergy Research Center (SBRC) from 2006 to 2018. He has been researching palm oil since 2000 and developed palm-based surfactant innovations to increase the added value of Crude Palm Oil, which led him to win the 20 Flagship Technology Work of Nation award (2015). \n\n In addition, he discovered various innovations, including the production of Alkyl Polyglycoside surfactants, the use of tengkawang fat for lipstick, and the production of gelatin from cowhide. With 9 innovations and 13 registered patents, he also founded PT. Eliza Chocolate Factory and PT. Liza Herbal Internasional. For his dedication, Prof. Erliza received various awards, such as the Extraordinary Intellectual Property Award (2012), 12 World Class Innovators: Surfactant Technology (2015), and Intellectual Property Rights from the Ministry of Research, Technology and Higher Education (2018).",
                    gambar: faker.image.url(),
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    nama: "Ir. Erdayeni",
                    jabatan: "Co-Founder, Finance Director",
                    deskripsi:
                        "Ir. Erdayeni adalah Direktur Keuangan di PT Sukaharja Quail Indonesia. Beliau merupakan lulusan Sarjana Peternakan dari Universitas Andalas (1988). Dengan pengalaman lebih dari dua dekade, Ir. Erdayeni pernah menjabat sebagai Direktur Utama di PT Ayam Goreng Fatmawati Indonesia dari tahun 2000 hingga 2023. Saat ini, beliau juga menjabat sebagai Direktur di PT Wirausaha Sahabat Serantau (2023–sekarang) dan aktif sebagai mompreneur. Keahlian beliau dalam mengelola keuangan dan strategi bisnis semakin memperkuat kontribusinya dalam kemajuan perusahaan.",
                    jabatanEn: "Co-Founder, Finance Director",
                    deskripsiEn:
                        "Ir. Erdayeni is the Finance Director at PT Sukaharja Quail Indonesia. She is a graduate of Animal Husbandry from Andalas University (1988). With more than two decades of experience, Ir. Erdayeni served as President Director at PT Ayam Goreng Fatmawati Indonesia from 2000 to 2023. Currently, she also serves as Director at PT Wirausaha Sahabat Serantau (2023–present) and is active as a mompreneur. Her expertise in managing finances and business strategies further strengthens her contribution to the company's progress.",
                    gambar: faker.image.url(),
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
        await queryInterface.bulkDelete("Founders", null, {});
    },
};

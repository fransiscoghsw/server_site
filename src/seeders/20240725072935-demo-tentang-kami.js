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
                    judul: "PT. KEMBAR MEDIKA SAFETY",
                    deskripsi:
                        "PT. Kembar Medika Safety is a distributor and supplier of industrial agricultural machinery, household appliances, wholesalers of computers and computer equipment, as well as wholesalers of other software.",
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

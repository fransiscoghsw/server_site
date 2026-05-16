"use strict";

const { faker, da } = require("@faker-js/faker");

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

        const testimonis = [];

        for (let i = 0; i < 3; i++) {
            const testimoni = {
                nama: faker.person.fullName(),
                foto: faker.image.avatarGitHub(),
                pekerjaan: faker.person.jobTitle(),
                pesan: faker.lorem.sentences(),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            testimonis.push(testimoni);
        }

        await queryInterface.bulkInsert("Testimonis", testimonis, {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete("Testimonis", null, {});
    },
};

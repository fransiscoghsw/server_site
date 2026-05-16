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

        const faqs = [];

        for (let i = 0; i < 3; i++) {
            const tag = {
                pertanyaan: faker.lorem.words({ min: 3, max: 10 }),
                jawaban: faker.lorem.sentence(),
                status: faker.helpers.arrayElement(["aktif", "tidak-aktif"]),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            faqs.push(tag);
        }

        await queryInterface.bulkInsert("Faqs", faqs, {});
    },

    async down(queryInterface, Sequelize) {
        /**
         * Add commands to revert seed here.
         *
         * Example:
         * await queryInterface.bulkDelete('People', null, {});
         */
        await queryInterface.bulkDelete("Faqs", null, {});
    },
};

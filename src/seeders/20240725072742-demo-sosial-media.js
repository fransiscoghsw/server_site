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

        const sosialMedia = [];

        for (let i = 0; i < 3; i++) {
            const data = {
                nama: faker.lorem.word(),
                icon: faker.image.avatar(),
                url: faker.internet.url({ appendSlash: true }),
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            sosialMedia.push(data);
        }

        await queryInterface.bulkInsert(
            "SosialMedia",
            [
                {
                    nama: "Instagram",
                    icon: "instagram.png",
                    url: "https://www.instagram.com/sukaquail",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    nama: "TikTok",
                    icon: "tiktok.png",
                    url: "https://www.tiktok.com/@sukaquail.id",
                    createdAt: new Date(),
                    updatedAt: new Date(),
                },
                {
                    nama: "Linkedln",
                    icon: "linkedln.png",
                    url: "https://www.linkedin.com/company/pt-sukaharja-quail-indonesia/posts",
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
        await queryInterface.bulkDelete("SosialMedia", null, {});
    },
};

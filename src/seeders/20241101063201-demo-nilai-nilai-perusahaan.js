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

    const nilaiNilaiPerusahaans = [];

    for (let i = 0; i < 3; i++) {
      const nilaiNilaiPerusahaan = {
        gambar: faker.image.url(),
        judul: faker.lorem.words({ min: 4, max: 8 }),
        createdAt: new Date(),
        updatedAt: new Date(),
      };
      nilaiNilaiPerusahaans.push(nilaiNilaiPerusahaan);
    }

    await queryInterface.bulkInsert("NilaiNilaiPerusahaans", nilaiNilaiPerusahaans, {});
  },

  async down(queryInterface, Sequelize) {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
    await queryInterface.bulkDelete("NilaiNilaiPerusahaans", null, {});
  },
};

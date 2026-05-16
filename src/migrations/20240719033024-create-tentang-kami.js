"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("TentangKamis", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            judul: {
                type: Sequelize.STRING,
            },
            image_background: {
                type: Sequelize.STRING,
            },
            deskripsi: {
                type: Sequelize.TEXT,
            },
            createdAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            updatedAt: {
                allowNull: false,
                type: Sequelize.DATE,
            },
            createdBy: {
                type: Sequelize.STRING,
                allowNull: false,
                defaultValue: "system",
            },
            updatedBy: {
                type: Sequelize.STRING,
                allowNull: true,
            },
        });
    },
    async down(queryInterface, Sequelize) {
        await queryInterface.dropTable("TentangKamis");
    },
};

"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("SubArtikels", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            judul: {
                type: Sequelize.STRING,
            },
            gambarId: {
                type: Sequelize.INTEGER,
                references: {
                    model: "GambarArtikels",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "SET NULL", // disarankan
            },
            deskripsi: {
                type: Sequelize.TEXT,
            },
            artikelId: {
                type: Sequelize.INTEGER,
                references: {
                    model: "Artikels",
                    key: "id",
                },
                onUpdate: "CASCADE",
                onDelete: "CASCADE", // kalau artikel dihapus, subartikel ikut dihapus
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
        await queryInterface.dropTable("SubArtikels");
    },
};

"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Artikels", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            penulis: {
                type: Sequelize.STRING,
            },
            jumlah_penglihat: {
                type: Sequelize.INTEGER,
                defaultValue: 0,
            },
            slug: {
                type: Sequelize.STRING,
            },
            judul: {
                type: Sequelize.STRING,
            },
            judulEn: {
                type: Sequelize.STRING,
                allowNull: true,
            },
            gambar: {
                type: Sequelize.STRING,
            },
            gambarId: {
                type: Sequelize.INTEGER,
                references: {
                    model: "GambarArtikels",
                    key: "id",
                },
            },
            deskripsi: {
                type: Sequelize.TEXT,
            },
            deskripsiEn: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            tanggal: {
                type: Sequelize.DATEONLY,
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
        await queryInterface.dropTable("Artikels");
    },
};

"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("CmsHomepages", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            title: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            subTitle: {
                allowNull: false,
                type: Sequelize.STRING,
            },
            titleEn: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            subTitleEn: {
                allowNull: true,
                type: Sequelize.STRING,
            },
            image: {
                allowNull: false,
                type: Sequelize.STRING,
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
        await queryInterface.dropTable("CmsHomepages");
    },
};

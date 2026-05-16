"use strict";
/** @type {import('sequelize-cli').Migration} */
module.exports = {
    async up(queryInterface, Sequelize) {
        await queryInterface.createTable("Admins", {
            id: {
                allowNull: false,
                autoIncrement: true,
                primaryKey: true,
                type: Sequelize.INTEGER,
            },
            username: {
                type: Sequelize.STRING,
                unique: true,
            },
            email: {
                type: Sequelize.STRING,
                unique: true,
            },
            password: {
                type: Sequelize.STRING,
            },
            roleId: {
                type: Sequelize.INTEGER,
                allowNull: false,
                defaultValue: 1,
                references: {
                    model: "Roles",
                    key: "id",
                },
            },
            refreshToken: {
                type: Sequelize.TEXT,
            },
            resetPasswordToken: {
                type: Sequelize.TEXT,
                allowNull: true,
            },
            resetPasswordTokenExpiry: {
                type: Sequelize.DATE,
                allowNull: true,
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
        await queryInterface.dropTable("Admins");
    },
};

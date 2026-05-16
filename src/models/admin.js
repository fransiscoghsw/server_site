"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Admin extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Admin.hasOne(models.AdminBiodata, {
                foreignKey: "adminId",
                as: "adminBiodata",
            });
            Admin.belongsTo(models.Role, {
                foreignKey: "roleId",
                as: "role",
            });
        }
    }
    Admin.init(
        {
            username: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: "Username tidak boleh null!" },
                    notEmpty: { msg: "Username tidak boleh kosong!" },
                },
            },
            email: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: "Email tidak boleh null!" },
                    isEmail: { msg: "Email harus berformat email!" },
                    notEmpty: { msg: "Email tidak boleh kosong!" },
                },
            },
            password: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: "Password tidak boleh null!" },
                    notEmpty: { msg: "Password tidak boleh kosong!" },
                },
            },
            roleId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                defaultValue: 1,
            },
            refreshToken: {
                type: DataTypes.TEXT,
            },
            resetPasswordToken: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            resetPasswordTokenExpiry: {
                type: DataTypes.DATE,
                allowNull: true,
            },
            createdBy: {
                type: DataTypes.STRING,
                allowNull: false,
                defaultValue: "system",
            },
            updatedBy: {
                type: DataTypes.STRING,
                allowNull: true,
            },
        },
        {
            sequelize,
            modelName: "Admin",
            // tableName: "admins",
            // timestamps: true,
            hooks: {
                // Before create hook
                beforeCreate(instance, options) {
                    instance.createdBy = options.user || "system";
                },
                // Before update hook
                beforeUpdate(instance, options) {
                    instance.updatedBy = options.user || "system";
                },
            },
        },
    );
    return Admin;
};

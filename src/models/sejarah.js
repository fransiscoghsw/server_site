"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Sejarah extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Sejarah.init(
        {
            judul: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: "Judul tidak boleh null!" },
                    notEmpty: { msg: "Judul tidak boleh kosong!" },
                },
            },
            judulEn: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            deskripsi: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notNull: { msg: "Deskripsi tidak boleh null!" },
                    notEmpty: { msg: "Deskripsi tidak boleh kosong!" },
                },
            },
            deskripsiEn: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            createdAt: DataTypes.DATE,
            updatedAt: DataTypes.DATE,
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
            modelName: "Sejarah",
            // tableName: "sejarahs",
            timestamps: true,
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
    return Sejarah;
};

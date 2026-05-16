"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Founder extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Founder.init(
        {
            nama: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: "Nama tidak boleh null!" },
                    notEmpty: { msg: "Nama tidak boleh kosong!" },
                },
            },
            jabatan: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: "Jabatan tidak boleh null!" },
                    notEmpty: { msg: "Jabatan tidak boleh kosong!" },
                },
            },
            jabatanEn: {
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
            gambar: DataTypes.STRING,
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
            modelName: "Founder",
            // tableName: "founders",
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
    return Founder;
};

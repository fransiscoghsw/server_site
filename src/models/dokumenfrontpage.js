"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class DokumenFrontpage extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    DokumenFrontpage.init(
        {
            nama: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: "Nama tidak boleh null!" },
                    notEmpty: { msg: "Nama tidak boleh kosong!" },
                },
            },
            file: {
                type: DataTypes.STRING,
            },
            status: {
                type: DataTypes.ENUM("aktif", "tidak-aktif"),
                allowNull: false,
                validate: {
                    notNull: { msg: "Status tidak boleh null!" },
                    isIn: {
                        args: [["aktif", "tidak-aktif"]],
                        msg: "Status harus salah satu dari 'aktif' atau 'tidak-aktif'",
                    },
                },
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
            modelName: "DokumenFrontpage",
            // tableName: "dokumenFrontpages",
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
    return DokumenFrontpage;
};

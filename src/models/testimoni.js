"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Testimoni extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    Testimoni.init(
        {
            nama: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: "Nama tidak boleh null!" },
                    notEmpty: { msg: "Nama tidak boleh kosong!" },
                },
            },
            foto: {
                type: DataTypes.STRING,
                allowNull: false,
            },
            pekerjaan: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: "Pekerjaan tidak boleh null!" },
                    notEmpty: { msg: "Pekerjaan tidak boleh kosong!" },
                },
            },
            pesan: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notNull: { msg: "Pekerjaan tidak boleh null!" },
                    notEmpty: { msg: "Pekerjaan tidak boleh kosong!" },
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
            modelName: "Testimoni",
            // tableName: "testimonis",
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
    return Testimoni;
};

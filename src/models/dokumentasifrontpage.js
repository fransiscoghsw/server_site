"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class DokumentasiFrontpage extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    DokumentasiFrontpage.init(
        {
            nama: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notEmpty: { msg: "Nama tidak boleh kosong!" },
                    notNull: { msg: "Nama tidak boleh null!" },
                },
            },
            image: {
                type: DataTypes.STRING,
                // allowNull: false,
                // validate: {
                //     notNull: { msg: "Gambar tidak boleh null!" },
                // },
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
            modelName: "DokumentasiFrontpage",
            // tableName: "dokumentasiFrontpages",
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
    return DokumentasiFrontpage;
};

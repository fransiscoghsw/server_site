"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Product extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {}
    }
    Product.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                unique: { name: "name", msg: "Nama sudah digunakan!" },
                validate: {
                    notNull: { msg: "Data tidak boleh null!" },
                    notEmpty: { msg: "Data tidal boleh kosong!" },
                },
            },
            description: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notNull: { msg: "Data tidak boleh null!" },
                    notEmpty: { msg: "Data tidal boleh kosong!" },
                },
            },
            image: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: "Data tidak boleh null!" },
                    notEmpty: { msg: "Data tidal boleh kosong!" },
                },
            },
            price: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notNull: { msg: "Data tidak boleh null!" },
                    notEmpty: { msg: "Data tidal boleh kosong!" },
                },
            },
            quantity: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notNull: { msg: "Data tidak boleh null!" },
                    notEmpty: { msg: "Data tidal boleh kosong!" },
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
            modelName: "Product",
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
    return Product;
};

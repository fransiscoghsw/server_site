"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class ECommerceProduct extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    ECommerceProduct.init(
        {
            eCommerceId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notNull: { msg: "eCommerceId tidak boleh null!" },
                    isInt: { msg: "eCommerceId harus berupa angka!" },
                },
            },
            url: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: "URL tidak boleh kosong!" },
                    notEmpty: { msg: "URL tidak boleh kosong!" },
                    isUrl: { msg: "URL harus dalam format yang valid!" },
                },
            },
            productId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                validate: {
                    notNull: { msg: "productId tidak boleh null!" },
                    isInt: { msg: "productId harus berupa angka!" },
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
            modelName: "ECommerceProduct",
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
    return ECommerceProduct;
};

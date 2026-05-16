"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class MECommerce extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            MECommerce.belongsToMany(models.Product, {
                through: models.ECommerceProduct,
                foreignKey: "eCommerceId",
            });
        }
    }
    MECommerce.init(
        {
            name: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: "Nama tidak boleh null!" },
                    notEmpty: { msg: "Nama tidak boleh kosong!" },
                },
                len: {
                    args: [1, 255],
                    msg: "Panjang nama diantara 1 dan 255 karakter!",
                },
                isString(value) {
                    if (typeof value !== "string") {
                        throw new Error("Nama harus berupa string!");
                    }
                },
                async isUnique(value) {
                    const name = await MECommerce.findOne({
                        where: { name: value },
                    });
                    if (name) {
                        throw new Error("Nama sudah digunakan!");
                    }
                },
            },
            icon: DataTypes.STRING,
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
            modelName: "MECommerce",
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
    return MECommerce;
};

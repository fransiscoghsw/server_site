"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class ArtikelTag extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    ArtikelTag.init(
        {
            artikelId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Artikels",
                    key: "id",
                },
            },
            tagId: {
                type: DataTypes.INTEGER,
                allowNull: false,
                references: {
                    model: "Tags",
                    // model: "Tagz",
                    key: "id",
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
            modelName: "ArtikelTag",
            // tableName: "artikelTag",
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
    return ArtikelTag;
};

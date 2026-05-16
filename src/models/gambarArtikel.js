"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class GambarArtikel extends Model {
        static associate(models) {
            // GambarArtikel ↔ Artikel (One-to-Many)
            GambarArtikel.hasMany(models.Artikel, {
                foreignKey: "gambarId",
                as: "artikels",
            });

            // GambarArtikel ↔ SubArtikel (One-to-Many)
            GambarArtikel.hasMany(models.SubArtikel, {
                foreignKey: "gambarId",
                as: "subArtikels",
            });
        }
    }

    GambarArtikel.init(
        {
            nama: DataTypes.STRING,
            keterangan: DataTypes.STRING,
            tautan: DataTypes.STRING,
            alt: DataTypes.STRING,
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
            modelName: "GambarArtikel",
            hooks: {
                beforeCreate(instance, options) {
                    instance.createdBy = options.user || "system";
                },
                beforeUpdate(instance, options) {
                    instance.updatedBy = options.user || "system";
                },
            },
        },
    );

    return GambarArtikel;
};

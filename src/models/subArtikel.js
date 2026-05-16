"use strict";
const { Model } = require("sequelize");

module.exports = (sequelize, DataTypes) => {
    class SubArtikel extends Model {
        static associate(models) {
            // SubArtikel ↔ Artikel (Many-to-One)
            SubArtikel.belongsTo(models.Artikel, {
                foreignKey: "artikelId",
                as: "artikel",
            });

            // SubArtikel ↔ GambarArtikel (Many-to-One)
            SubArtikel.belongsTo(models.GambarArtikel, {
                foreignKey: "gambarId",
                as: "gambarArtikel",
            });
        }
    }

    SubArtikel.init(
        {
            judul: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: "Judul tidak boleh null!" },
                    notEmpty: { msg: "Judul tidak boleh kosong!" },
                },
            },
            gambarId: {
                type: DataTypes.INTEGER,
                references: {
                    model: "GambarArtikels",
                    key: "id",
                },
            },
            deskripsi: {
                type: DataTypes.TEXT,
                allowNull: false,
                validate: {
                    notNull: { msg: "Deskripsi tidak boleh null!" },
                    notEmpty: { msg: "Deskripsi tidak boleh kosong!" },
                },
            },
            artikelId: {
                type: DataTypes.INTEGER,
                references: {
                    model: "Artikels",
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
            modelName: "SubArtikel",
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

    return SubArtikel;
};

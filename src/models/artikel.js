"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class Artikel extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
            Artikel.belongsToMany(models.Tag, {
                through: models.ArtikelTag,
                as: "tags", // ← alias huruf besar
                foreignKey: "artikelId",
            });

            // Artikel ↔ GambarArtikel (Many-to-One)
            Artikel.belongsTo(models.GambarArtikel, {
                foreignKey: "gambarId",
                as: "gambarArtikel",
            });

            // Artikel ↔ SubArtikel (One-to-Many)
            Artikel.hasMany(models.SubArtikel, {
                foreignKey: "artikelId",
                as: "subArtikels",
                onDelete: "CASCADE",
                onUpdate: "CASCADE",
            });
        }
    }
    Artikel.init(
        {
            penulis: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: "Penulis tidak boleh null!" },
                    notEmpty: { msg: "Penulis tidak boleh kosong!" },
                },
            },
            jumlah_penglihat: DataTypes.INTEGER,
            slug: DataTypes.STRING,
            judul: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: "Judul tidak boleh null!" },
                    notEmpty: { msg: "Judul tidak boleh kosong!" },
                },
            },
            judulEn: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            gambar: DataTypes.STRING,
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
            deskripsiEn: {
                type: DataTypes.TEXT,
                allowNull: true,
            },
            tanggal: {
                type: DataTypes.DATEONLY,
                allowNull: false,
                validate: {
                    notNull: { msg: "Tanggal tidak boleh null!" },
                    notEmpty: { msg: "Tanggal tidak boleh kosong!" },
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
            modelName: "Artikel",
            // tableName: "artikels",
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
    return Artikel;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
    class CmsHomepage extends Model {
        /**
         * Helper method for defining associations.
         * This method is not a part of Sequelize lifecycle.
         * The `models/index` file will call this method automatically.
         */
        static associate(models) {
            // define association here
        }
    }
    CmsHomepage.init(
        {
            title: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: "Title harus diisi" },
                    notEmpty: { msg: "Title tidak boleh kosong" },
                    len: {
                        args: [1, 255],
                        msg: "Title harus memiliki panjang antara 1 hingga 255 karakter!",
                    },
                },
            },
            subTitle: {
                type: DataTypes.STRING,
                allowNull: false,
                validate: {
                    notNull: { msg: "Sub title harus diisi" },
                    notEmpty: { msg: "Sub title tidak boleh kosong" },
                    len: {
                        args: [1, 255],
                        msg: "Sub title harus memiliki panjang antara 1 hingga 255 karakter!",
                    },
                },
            },
            titleEn: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            subTitleEn: {
                type: DataTypes.STRING,
                allowNull: true,
            },
            image: DataTypes.STRING,
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
            modelName: "CmsHomepage",
            // tableName: "cmsHomepages",
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
    return CmsHomepage;
};

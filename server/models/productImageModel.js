const { DataTypes } = require('sequelize');
const sequelize = require("../config/database");

const ProductImage = sequelize.define("ProductImage", {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: true,
        },
        product_variant_id: {
            type: DataTypes.INTEGER,
            foreignKey: 'product_variant_id',
        },
        is_primary: {
            type: DataTypes.TINYINT,
        },
        image_url: {
            type: DataTypes.STRING,
        }
    },
{
    tableName: "product_images",
    timestamps: false,
    underscored: true,
    }
)
module.exports = ProductImage;
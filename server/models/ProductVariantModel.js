const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ProductImage = require('./productImageModel');

const ProductVariantModel = sequelize.define('ProductVariant', {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        product_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: 'product_id',
        },
        color: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        size: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        stock_quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        price: {
            type: DataTypes.DECIMAL(10,2),
        },
        created_at: {
            type: DataTypes.DATE,
        }
    },
{
    tableName: 'product_variants',
    timestamps: true,
    updatedAt: false,
    underscored: true,

    // For soft deletes
    paranoid: true,
    deletedAt: 'deleted_at',
    
    }
)

// Define relationships
ProductVariantModel.hasMany(ProductImage, {
    foreignKey: "product_variant_id",
    as: "images"
})

module.exports = ProductVariantModel
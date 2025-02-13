const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

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
    },
{
    tableName: 'product_variants',

    // Database table has created_at but no updated_at??
    // Its causing problems so timestamps is temporarily set to false
    timestamps: false,
    underscored: true,
    }
)

module.exports = ProductVariantModel
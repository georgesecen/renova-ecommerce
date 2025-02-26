const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ProductVariant = require('../models/productVariantModel');

const Product = sequelize.define(
    'Product',
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        description: {
            type: DataTypes.TEXT,
        },
        price: {
            type: DataTypes.DECIMAL(10, 2),
            allowNull: false,
        },
    },
{
    tableName: 'products',
    timestamps: true,
    underscored: true,
    }
)
//Make sure image is loaded after products are grabbed
const Image = require('./productImageModel');
//Define relationships
Product.hasMany(Image,{foreignKey:'product_id', as: 'image', onDelete: 'CASCADE'});
Image.belongsTo(Product, {foreignKey:'product_id', as: 'productVariant'});
ProductVariant.belongsTo(Product, {foreignKey:'product_id', as: 'product'});


module.exports = Product;
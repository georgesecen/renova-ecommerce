const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const ProductVariant = require('../models/productVariantModel');

// Why are the timestamps snake case and the category id is camel case in database?? 

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
        categoryId: {
            type: DataTypes.INTEGER,
            allowNull: false,
            underscored: false
        },
        gender: {
            type: DataTypes.ENUM(
                'men',
                'women',
                'unisex'
            ),
        },

        // Work around because time stamps are snake case and category id is camel case
        createdAt: {
            type: DataTypes.DATE,
            field: 'created_at',
        },
        updatedAt: {
            type: DataTypes.DATE,
            field: 'updated_at',
        },
    },
{
    tableName: 'products',

    timestamps: true,
    // underscored: true,
    }
)
//Make sure image is loaded after products are grabbed
const Image = require('./productImageModel');

//Define relationships
Product.hasMany(Image,{foreignKey:'product_id', as: 'image', onDelete: 'CASCADE'});
Image.belongsTo(Product, {foreignKey:'product_id', as: 'productVariant'});
ProductVariant.belongsTo(Product, {foreignKey:'product_id', as: 'product'});

Product.hasMany(ProductVariant, {
    foreignKey: "product_id",
    as: "product_variants"
})


module.exports = Product;
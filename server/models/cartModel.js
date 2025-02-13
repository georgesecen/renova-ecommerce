const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');
const User = require('./userModel');
const ProductVariant = require('./productVariantModel');

const Cart = sequelize.define('cart',
        {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        user_id: {
            type: DataTypes.INTEGER,
            foreignKey: 'user_id',
        },
        guest_user_id: {
            type: DataTypes.INTEGER,
            foreignKey: 'guest_user_id',
        },
        product_variant_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: 'product_variant_id',
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
            defaultValue: 1,
        },
        },
        {
            tableName: 'cart_items',
            timestamps: true,
            underscored: true,
        }
    )
//Define relationships
Cart.belongsTo(User, {foreignKey: 'user_id', as: 'user'})
User.hasMany(Cart, {foreignKey: 'user_id', as: 'cart'})
Cart.belongsTo(ProductVariant, {foreignKey: 'product_variant_id', as: 'productVariant'})
ProductVariant.hasMany(Cart, {foreignKey: 'product_variant_id', as: 'productVariant'})

module.exports = Cart;


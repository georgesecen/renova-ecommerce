const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const Order = sequelize.define('order',
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
        total_price: {
            type: DataTypes.DOUBLE,
            allowNull: false,
        },
        status: {
            type: DataTypes.ENUM(
                'pending',
                'completed',
                'canceled',
                'shipped'
            ),
            allowNull: false,
        },
        stripe_id: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        tableName: 'orders',
        timestamps: true,
        underscored: true,
    }
);

// Define relationships
const OrderItem = require("./orderItemModel");
const ShippingAddress = require("./ShippingAddressModel");

Order.hasMany(OrderItem, {
    foreignKey: "order_id",
    as: "order_items"
})
Order.hasOne(ShippingAddress, {
    foreignKey: "order_id",
    as: "shipping_address"
})

module.exports = Order;


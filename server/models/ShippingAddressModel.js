const { DataTypes } = require('sequelize');
const sequelize = require('../config/database')

const ShippingAddress = sequelize.define('ShippingAddress', {
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
        order_id: {
            type: DataTypes.INTEGER,
            foreignKey: 'order_id',
        },
        recipient_name: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        phone_number: {
            type: DataTypes.STRING,
        },
        address_line1: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        address_line2: {
            type: DataTypes.STRING,
        },
        city: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        state: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        postal_code: {
            type: DataTypes.STRING,
            allowNull: false,
        },
        country: {
            type: DataTypes.STRING,
            allowNull: false,
        }
    },
    {
        tableName: 'shipping_addresses',
        underscored: true,
        timestamps: true,
    }
)

module.exports = ShippingAddress;
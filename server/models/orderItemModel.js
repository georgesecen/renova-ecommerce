const { DataTypes } = require('sequelize');
const sequelize = require('../config/database');

const OrderItem = sequelize.define('orderItem',
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        order_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: 'order_id',
        },
        product_variant_id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            foreignKey: 'product_variant_id',
        },
        quantity: {
            type: DataTypes.INTEGER,
            allowNull: false,
        },
        price_at_purchase: {
            type: DataTypes.DECIMAL(10,2),
            allowNull: false,
        },
        created_at: {
            type: DataTypes.DATE,
        }
    },
{
    tableName: 'order_items',
    underscored: true,
    updatedAt: false
    }
)

module.exports = OrderItem;
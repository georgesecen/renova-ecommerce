const { DataTypes } = require('sequelize');
const sequelize = require('../config/database')

const ProductCategory = sequelize.define(
    'productCategory', 
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
    },
    {
        tableName: 'product_categories',
        // underscored: true,
        timestamps: true,
    }
)

module.exports = ProductCategory;
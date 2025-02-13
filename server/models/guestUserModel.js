const { DataTypes } = require('sequelize');
const sequelize = require("../config/database");

const GuestUser = sequelize.define(
    "GuestUser",
    {
        id: {
            type: DataTypes.INTEGER,
            allowNull: false,
            autoIncrement: true,
            primaryKey: true,
        },
        session_token: {
            type: DataTypes.STRING,
            allowNull: false,
            unique: true,
        },
        created_at: {
            type: DataTypes.DATE,
        }

    },
{
    tableName: 'guest_users',
    timestamps: true,
    underscored: true,
    updatedAt: false,
    }
)

module.exports = GuestUser;
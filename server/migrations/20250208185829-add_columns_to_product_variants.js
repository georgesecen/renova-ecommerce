'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  up: async (queryInterface, Sequelize) => {
    // Create the product_categories table
    await queryInterface.createTable('product_categories', {
      id: {
        type: Sequelize.INTEGER,
        primaryKey: true,
        autoIncrement: true,
        allowNull: false,
      },
      name: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP'),
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.literal('CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP'),
      },
    });

    // Add categoryId column to products table
    await queryInterface.addColumn('products', 'categoryId', {
      type: Sequelize.INTEGER,
      references: {
        model: 'product_categories', // Matches the table name in createTable()
        key: 'id',
      },
      onUpdate: 'CASCADE',
      onDelete: 'SET NULL',
      allowNull: true,
    });

    // Add gender column to products table
    await queryInterface.addColumn('products', 'gender', {
      type: Sequelize.ENUM('men', 'women', 'unisex'),
      allowNull: false, // Enforce that every product must have a gender
    });
  },

  down: async (queryInterface, Sequelize) => {
    // Remove gender column from products table
    await queryInterface.removeColumn('products', 'gender');

    // Remove categoryId column from products table
    await queryInterface.removeColumn('products', 'categoryId');

    // Drop product_categories table
    await queryInterface.dropTable('product_categories');
  }
};

//TODO add to product_category model
// Category.hasMany(Product, { foreignKey: 'categoryId' });
// Product.belongsTo(Category, { foreignKey: 'categoryId' });
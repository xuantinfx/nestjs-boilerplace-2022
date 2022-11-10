'use strict';

module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('users', {
      id: {
        type: Sequelize.STRING,
        allowNull: false,
        primaryKey: true,
      },
      email: {
        type: Sequelize.STRING(120),
        allowNull: false,
        unique: true,
      },
      firstName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      lastName: {
        type: Sequelize.STRING,
        allowNull: true,
      },
      status: {
        type: Sequelize.ENUM,
        values: ['ACTIVE', 'INACTIVE', 'DELETED'],
        defaultValue: 'ACTIVE',
        allowNull: false,
      },
      source: {
        type: Sequelize.ENUM,
        values: ['GOOGLE'],
        defaultValue: 'GOOGLE',
        allowNull: false,
      },
      createdAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
      },
      createdBy: {
        type: Sequelize.STRING(120),
        allowNull: true,
      },
      updatedBy: {
        type: Sequelize.STRING(120),
        allowNull: true,
      },
    });

    await queryInterface.addIndex('users', ['email']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeIndex('users', ['email']);

    await queryInterface.dropTable('users');
  },
};

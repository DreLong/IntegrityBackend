'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.createTable('Transactions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        primaryKey: true,
        allowNull: false,
      },
      uuid: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
      },
      senderAccountUuid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Accounts', // This assumes the Accounts table exists
          key: 'uuid',
        },
      },
      receiverAccountUuid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Accounts', // This assumes the Accounts table exists
          key: 'uuid',
        },
      },
      senderFirstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      senderLastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      receiverFirstName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      receiverLastName: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      amount: {
        type: Sequelize.FLOAT,
        allowNull: false,
      },
      transactionType: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      description: {
        type: Sequelize.STRING,
        allowNull: false,
      },
      transactionNumber: {
        type: Sequelize.STRING,
        allowNull: false,
        unique: true,
      },
      timestamp: {
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      createdAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        type: Sequelize.DATE,
        allowNull: false,
        defaultValue: Sequelize.NOW,
      },
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Transactions');
  }
};

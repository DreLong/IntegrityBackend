'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Transactions'); // Drop table if it exists to start fresh
    await queryInterface.createTable('Transactions', {
      id: {
        type: Sequelize.UUID,
        defaultValue: Sequelize.UUIDV4,
        allowNull: false,
        primaryKey: true,
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
          model: 'Accounts',
          key: 'uuid', // Reference the primary key explicitly
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      receiverAccountUuid: {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Accounts',
          key: 'uuid', // Reference the primary key explicitly
        },
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
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
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      },
      updatedAt: {
        allowNull: false,
        type: Sequelize.DATE,
        defaultValue: Sequelize.NOW,
      }
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.dropTable('Transactions');
  }
};

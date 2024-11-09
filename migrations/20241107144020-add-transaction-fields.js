'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const columns = await queryInterface.describeTable('Transactions');
    
    if (!columns.transactionNumber) {
      await queryInterface.addColumn('Transactions', 'transactionNumber', {
        type: Sequelize.STRING(24),
        allowNull: false,
        unique: true,
      });
    }

    if (!columns.senderFirstName) {
      await queryInterface.addColumn('Transactions', 'senderFirstName', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!columns.senderLastName) {
      await queryInterface.addColumn('Transactions', 'senderLastName', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!columns.receiverFirstName) {
      await queryInterface.addColumn('Transactions', 'receiverFirstName', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }

    if (!columns.receiverLastName) {
      await queryInterface.addColumn('Transactions', 'receiverLastName', {
        type: Sequelize.STRING,
        allowNull: true,
      });
    }
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Transactions', 'transactionNumber');
    await queryInterface.removeColumn('Transactions', 'senderFirstName');
    await queryInterface.removeColumn('Transactions', 'senderLastName');
    await queryInterface.removeColumn('Transactions', 'receiverFirstName');
    await queryInterface.removeColumn('Transactions', 'receiverLastName');
  }
};

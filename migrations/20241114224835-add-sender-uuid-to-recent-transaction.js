'use strict';

/** @type {import('sequelize-cli').Migration} */
// migrations/XXXXXX-add-sender-uuid-to-recent-transaction.js

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('RecentTransactions', 'senderUuid', {
      type: Sequelize.UUID,
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('RecentTransactions', 'senderUuid');
  }
};


'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    const tableDescription = await queryInterface.describeTable('Transactions');

    if (!tableDescription.senderAccountUuid) {
      await queryInterface.addColumn('Transactions', 'senderAccountUuid', {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Accounts',
          key: 'uuid',
        },
      });
    }

    if (!tableDescription.receiverAccountUuid) {
      await queryInterface.addColumn('Transactions', 'receiverAccountUuid', {
        type: Sequelize.UUID,
        allowNull: false,
        references: {
          model: 'Accounts',
          key: 'uuid',
        },
      });
    }
    // Add other columns if needed, following the same pattern
  },

  down: async (queryInterface, Sequelize) => {
    // Remove columns if necessary
    await queryInterface.removeColumn('Transactions', 'senderAccountUuid');
    await queryInterface.removeColumn('Transactions', 'receiverAccountUuid');
  },
};

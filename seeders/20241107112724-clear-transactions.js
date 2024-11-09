'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.bulkDelete('Transactions', null, {}); // Deletes all rows
  },

  down: async (queryInterface, Sequelize) => {
    // Optionally, define what should happen if you want to restore data, or leave empty
  }
};

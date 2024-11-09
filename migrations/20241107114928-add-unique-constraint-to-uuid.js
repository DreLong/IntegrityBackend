'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addConstraint('Accounts', {
      fields: ['uuid'],
      type: 'unique',
      name: 'unique_uuid_constraint', // name of the constraint
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeConstraint('Accounts', 'unique_uuid_constraint');
  }
};

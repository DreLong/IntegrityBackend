'use strict';

/** @type {import('sequelize-cli').Migration} */

module.exports = {
  up: async (queryInterface, Sequelize) => {
    await queryInterface.addColumn('Users', 'uuid', {
      type: Sequelize.UUID,
      defaultValue: Sequelize.literal('uuid_generate_v4()'), // Automatically generate UUID
      primaryKey: true, // Make uuid the primary key
      allowNull: false,
    });
  },

  down: async (queryInterface, Sequelize) => {
    await queryInterface.removeColumn('Users', 'uuid');
  },
};

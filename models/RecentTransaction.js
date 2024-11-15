// models/recentTransaction.js

module.exports = (sequelize, DataTypes) => {
    const RecentTransaction = sequelize.define('RecentTransaction', {
      uuid: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true,
      },
      accountNumber: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      firstName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      lastName: {
        type: DataTypes.STRING,
        allowNull: false,
      },
      transactionDate: {
        type: DataTypes.DATE,
        defaultValue: DataTypes.NOW,
      },
      senderUuid: { // Add senderUuid to track ownership
        type: DataTypes.UUID,
        allowNull: false,
      },
    });
  
    return RecentTransaction;
  };
  
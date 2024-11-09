const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Transaction = sequelize.define('Transaction', {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
    },
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
    },
    senderAccountUuid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    receiverAccountUuid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    senderFirstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    senderLastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    receiverFirstName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    receiverLastName: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    amount: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
    transactionType: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    description: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    transactionNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    timestamp: {
      type: DataTypes.DATE,
      defaultValue: DataTypes.NOW,
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  });

  // Define associations
  Transaction.associate = (models) => {
    Transaction.belongsTo(models.Account, { foreignKey: 'senderAccountUuid', as: 'SenderAccount' });
    Transaction.belongsTo(models.Account, { foreignKey: 'receiverAccountUuid', as: 'ReceiverAccount' });
  };

  return Transaction;
};

const { DataTypes } = require("sequelize");

module.exports = (sequelize) => {
  const Account = sequelize.define('Account', {
    uuid: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      allowNull: false,
      primaryKey: true,
    },
    userUuid: {
      type: DataTypes.UUID,
      allowNull: false,
    },
    accountNumber: {
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
    accountTypeId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    balance: {
      type: DataTypes.FLOAT,
      allowNull: false,
    },
  });

  Account.associate = (models) => {
    Account.belongsTo(models.User, { as: "user", foreignKey: "userUuid" });
    Account.hasMany(models.Transaction, { foreignKey: "accountUuid" });
  };

  return Account;
};

const { DataTypes } = require('sequelize');
const bcrypt = require('bcrypt');

module.exports = (sequelize) => {
  const User = sequelize.define('User', {
    uuid: { 
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true 
    },
    phoneNumber: { type: DataTypes.STRING, allowNull: false, unique: true },
    otp: { type: DataTypes.STRING },
    otpExpiresAt: { type: DataTypes.DATE },
    accountNumber: { type: DataTypes.STRING },
    firstName: { type: DataTypes.STRING },
    lastName: { type: DataTypes.STRING },
    email: { type: DataTypes.STRING, unique: true },
    password: { type: DataTypes.STRING },
  }, {
    hooks: {
      beforeSave: async (user) => {
        if (user.password) {
          user.password = await bcrypt.hash(user.password, 10);
        }
      },
    },
  });

  User.associate = (models) => {
    User.hasOne(models.Account, { as: "account", foreignKey: "userUuid" });
  };

  return User;
};

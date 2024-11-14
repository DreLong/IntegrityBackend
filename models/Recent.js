// models/Recent.js
module.exports = (sequelize, DataTypes) => {
    const Recent = sequelize.define("Recent", {
      userUuid: {
        type: DataTypes.UUID,
        allowNull: false,
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
    });
  
    Recent.associate = (models) => {
      Recent.belongsTo(models.User, { foreignKey: "userUuid" });
    };
  
    return Recent;
  };
  
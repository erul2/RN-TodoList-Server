"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Users extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Users.hasMany(models.Tasks, {
        as: "tasks",
        foreignKey: "idUser",
      });
    }
  }
  Users.init(
    {
      email: DataTypes.STRING,
      password: DataTypes.STRING,
      fullName: DataTypes.STRING,
    },
    {
      sequelize,
      modelName: "Users",
    }
  );
  return Users;
};

"use strict";
const { Model } = require("sequelize");
module.exports = (sequelize, DataTypes) => {
  class Tasks extends Model {
    /**
     * Helper method for defining associations.
     * This method is not a part of Sequelize lifecycle.
     * The `models/index` file will call this method automatically.
     */
    static associate(models) {
      // define association here
      Tasks.belongsTo(models.Users, {
        as: "user",
        foreignKey: "idUser",
      });
    }
  }
  Tasks.init(
    {
      idUser: DataTypes.INTEGER,
      title: DataTypes.STRING,
      isDone: DataTypes.BOOLEAN,
      date: DataTypes.DATE,
    },
    {
      sequelize,
      modelName: "Tasks",
    }
  );
  return Tasks;
};

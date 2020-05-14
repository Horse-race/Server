'use strict';
module.exports = (sequelize, DataTypes) => {

  const {Model} = sequelize.Sequelize

  class User extends Model {}

  User.init({
    username: DataTypes.STRING,
    move: DataTypes.INTEGER
  }, {sequelize});
  User.associate = function(models) {
    // associations can be defined here
  };
  return User;
};
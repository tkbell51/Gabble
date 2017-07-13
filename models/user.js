'use strict';
module.exports = function(sequelize, DataTypes) {
  var User = sequelize.define('User', {
    username: DataTypes.STRING,
    password: DataTypes.STRING
  }, {});
  User.associate = function(models) {
    User.hasMany(models.Gab, {as: 'gabs', foreignKey: 'userId'});
    User.belongsToMany(models.Gab, {as: 'userLikes', through: 'userGabs',  foreignKey: 'userId', otherKey: 'gabId'});
  };

  return User;
};

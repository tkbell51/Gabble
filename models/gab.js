'use strict';
module.exports = function(sequelize, DataTypes) {
  var Gab = sequelize.define('Gab', {
    gab: DataTypes.STRING,



  }, {});
  Gab.associate = function(models) {

    Gab.belongsTo(models.User, {as: 'users', foreignKey: 'userId'});
    Gab.belongsToMany(models.User, {as: 'Likes', through: "userGabs",  foreignKey: 'gabId', otherKey: 'userId'});
  };

  return Gab;
};

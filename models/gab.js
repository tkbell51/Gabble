'use strict';
module.exports = function(sequelize, DataTypes) {
  var Gab = sequelize.define('Gab', {
    gab: DataTypes.STRING,
    userId: DataTypes.INTEGER



  }, {});
  Gab.associate = function(models) {

    Gab.belongsTo(models.User, {as: 'users', foreignKey: 'userId', onDelete: 'cascade', hooks: true});
    Gab.belongsToMany(models.User, {as: 'UserLikes', through: "userGabs",  foreignKey: 'gabId', otherKey: 'userId', onDelete: 'cascade', hooks: true});
  };

  return Gab;
};

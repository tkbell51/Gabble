'use strict';
module.exports = function(sequelize, DataTypes) {
  var Gab = sequelize.define('Gab', {
    gab: DataTypes.STRING,
    

  }, {});
  Gab.associate = function(models) {
    Gab.belongsToMany(models.User, {through: "Likes", as: 'gabLikes', foreignKey: 'gabId', otherKey: 'userId'});
    Gab.belongsTo(models.User, {as: 'users', foreignKey: 'userId'});
  };

  return Gab;
};

'use strict';
module.exports = function(sequelize, DataTypes) {
  var Gab = sequelize.define('Gab', {
    gab: DataTypes.STRING,


  }, {});
  Gab.associate = function(models) {

    Gab.belongsTo(models.User, {as: 'users', foreignKey: 'userId'});

    Gab.belongsToMany(models.User, {through: "Likes", as: 'gabLikes', foreignKey: 'gabId', otherKey: 'userId'});
  };

  return Gab;
};

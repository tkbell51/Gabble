'use strict';
module.exports = function(sequelize, DataTypes) {
  var Like = sequelize.define('Like', {
    userId: DataTypes.INTEGER,
    gabId: DataTypes.INTEGER
  }, {});
  Like.associate = function(models) {
    Like.belongsTo(models.Gab, {as: 'gabLikes', foreignKey: 'id'});
    Like.belongsTo(models.User, {as: 'userLikes', foreignKey: 'id'});
  };
  return Like;
};

'use strict';
module.exports = function(sequelize, DataTypes) {
  var Like = sequelize.define('Like', {
    userId: DataTypes.INTEGER,
    gabId: DataTypes.INTEGER
  }, {});
  Like.associate = function(models) {
    Like.belongsToMany(models.Gab, {as: 'gabLikes', through: 'Likes', foreignKey: 'likeId'});
    Like.belongsTo(models.User, {as: 'userLikes', foreignKey: 'likeId'});
  };
  return Like;
};

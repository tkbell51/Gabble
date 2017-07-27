'use strict';
module.exports = function(sequelize, DataTypes) {
  var Gab = sequelize.define('Gab', {
    gab: DataTypes.STRING,
    userId: DataTypes.INTEGER



  }, {});
  Gab.associate = function(models) {
    Gab.belongsToMany(models.User, {as: 'UserLikes', through: "userGabs",  foreignKey: 'gabId', otherKey: 'userId', onDelete: 'cascade', hooks: true});
    Gab.belongsTo(models.User, {as: 'users', foreignKey: 'userId', onDelete: 'cascade', hooks: true});

  };
  Gab.prototype.showDeleteIfOwner = function() {
      return function (val, render) {
        const id = render(val);
        if (id == this.userId) {
          // render the delete button
        return render(` <form class="delete" action="/gabble/delete/{{id}}" method="post">
          <button class="btn-floating btn-large waves-effect waves-light orange" name="delete"><i class="material-icons">delete</i></button>
        </form>`);
              }
      };
    };

  return Gab;
};

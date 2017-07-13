const express = require('express');
const gabbleController = require('./controllers/gabbleController');

module.exports = function(app){
  app.get("/gabble/user/signup/", gabbleController.signUp);
  app.post("/gabble/user/signup/", gabbleController.signValidation);
  app.get("/gabble/user/login/", gabbleController.loginPage);
  app.post("/gabble/user/login/", gabbleController.login);
  app.get("/gabble/", gabbleController.home);
  app.post('/gabble/', gabbleController.newGabPost);
  app.post('/gabble/like/:id', gabbleController.createLike)
  app.get('/gabble/like', gabbleController.likePage);
  // app.patch('/gabble/:id', gabbleController.updateGab)
  app.delete('/gabble/delete/{{id}}', gabbleController.delete)

  // app.get('/gabble/likes/', gabbleController.likes);


};

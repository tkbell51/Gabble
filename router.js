const express = require('express');
const gabbleController = require('./controllers/gabbleController');

module.exports = function(app){
  app.get("/gabble/signup/", gabbleController.signUp);
  app.post("/gabble/signup/", gabbleController.signValidation);
  app.get("/gabble/login", gabbleController.loginPage);
  app.post("/gabble/login", gabbleController.login);
  app.get("/gabble/", gabbleController.home);
  app.get('/gabble/newgab/', gabbleController.newGab);
  app.post('/gabble/newgab', gabbleController.newGabPost);
  app.get('/gabble/:id', gabbleController.oneGab)
  // app.patch('/gabble/:id', gabbleController.updateGab)
  app.delete('/gabbe/:id', gabbleController.delete)

  // app.get('/gabble/likes/', gabbleController.likes);


};

const express = require('express');
const gabbleController = require('./controllers/gabbleController');

module.exports = function(app){

  
//create new user
  app.post("/gabble/user/signup/", gabbleController.signValidation);
  //render login page
  app.get("/gabble/user/login/", gabbleController.loginPage);
  //submit login creds
  app.post("/gabble/user/login/", gabbleController.login);
  //render home page
  app.get("/gabble/", gabbleController.home);
  //create new gab post
  app.post('/gabble/', gabbleController.newGabPost);
  //like button
  app.post('/gabble/like/:id', gabbleController.createLike);
  //render like page for one gab
  app.get('/gabble/:id', gabbleController.showLikes);
  //submit signout
  app.post('/gabble/signout', gabbleController.signOut);
  //delete gab post
  app.post('/gabble/delete/:id', gabbleController.delete);




};

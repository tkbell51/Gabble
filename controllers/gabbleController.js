
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const models = require('../models');
const Sequelize = require('sequelize');

module.exports={

  //------login render
  loginPage: (req, res, next)=>{
    res.render('login')
  },
  signupPage: (req, res)=>{
    res.render('signup')
  },
//------signup up create and validation -----
  signValidation: function (req, res, next){

    const username = req.body.username;
    const password = req.body.password;

    const confPassword = req.body.confPassword;
    req.checkBody('username', "Please fill in Username").notEmpty()
    req.checkBody('password', "Please fill in password").notEmpty()
    req.checkBody('password', "Password is at least 6 characters").isLength({min:6, max:100})
    req.checkBody('confPassword', "Please fill in the Confirm Password").notEmpty()
    req.checkBody('confPassword', "Passwords do not match").equals(password);

    let errors = req.validationErrors();

    if (errors){
      req.body['errors'] = errors;
      res.render('signup', req.body);
    } else {
      models.User.create({
        username: req.body.username,
        password: req.body.password,
        first_name: req.body.firstName,
        last_name: req.body.lastName,

      }).then(function (newUser){

        console.log(newUser);
        req.session.name = newUser.first_name;
        req.session.userId = newUser.id
        req.session.user = newUser.username

        console.log(req.session.user);

        res.redirect('/gabble/');
      }).catch(Sequelize.UniqueConstraintError, function (err) {
        console.log("Username not unique!");
      }).catch(Sequelize.ValidationError, function (err) {
        console.log("Not valid!", err);
      }).catch(function (err) {
        // handle all other errors
        console.log("Oh no!", err);
      });
    }
  },
//----------------login--------------
  login: (req, res, next)=>{

    models.User.findOne({
      where: {
        username: req.body.username,
        password: req.body.password
      }
    }).then((user)=>{
      console.log(user);
      req.session.user = user.username
      console.log("session.user ", req.session.user);
      req.session.userId = user.id
      console.log("session.id ", req.session.userId);
      req.session.name = user.first_name;


      if(req.session.user){
        res.redirect('/gabble/');
      }else{
        res.redirect('gabble/user/login');
      }
    })
  },
  //-----------home---------
  home: function(req, res) {
    context = {
      welcomeName: req.session.name,
      signedInUser: "@" + req.session.user,
      loggedInUser: req.session.userId
    }
    models.Gab.findAll({
      include: [
      {
        model: models.User,
        as: 'users'
      }, 'UserLikes'],
      order: [['createdAt', 'DESC']]
    }).then(function(gabs) {
        context.model = gabs;
      res.render('home', context);
    });
  },
//-------create new gab-----------
  newGabPost: (req, res)=>{
    models.Gab.create({gab:req.body.newPost, userId: req.session.userId}).then((gabs)=>{
      console.log(gabs);
      res.redirect("/gabble/");
    });
  },
//-------like button--------
  createLike: (req, res)=>{

    models.Gab.findOne({
      where: {id: req.params.id},
      include: [{
        model: models.User,
        as: 'users'
      }],
    }).then(gab=>{
      console.log('gab', gab);
      gab.addUserLikes(req.session.userId)
      res.redirect('/gabble/');
    })
  },
  showLikes: function(req, res) {
     models.Gab.findOne({
       where: {
         id: req.params.id
       },
       include: [{
         model: models.User,
         as: 'users'
       }]
     }).then(gab=> {
       console.log(gab);
       gab.getUserLikes().then(function(result) {
         var context = {

           model: gab,
           name: req.session.user,
           likes: [],
           welcomeName: req.session.name,
           signedInUser: "@" + req.session.user,
           loggedInUser: req.session.userId
         };
         for (var i = 0; i < result.length; i++) {
           console.log(result[i].username);
           context.likes.push(result[i].username);
           console.log("LIKES ", context.likes);
         }
         res.render('likes', context);
       });
     });
   },

  delete: (req, res)=>{
      models.Gab.destroy({where: {id: req.params.id, userId: req.session.userId}
      }).then(()=>{
        res.redirect("/gabble/");
      })


  },
  signOut: (req, res)=>{
    delete req.session.name;
    delete req.session.userId;
    delete req.session.user;
    res.redirect('/gabble/user/login')
  },


 };

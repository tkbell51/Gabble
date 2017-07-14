
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const models = require('../models');
const Sequelize = require('sequelize');

module.exports={
  //---------signup render
  signUp: (req, res,next)=>{
    res.render('signup')
  },
  //------login render
  loginPage: (req, res, next)=>{
    res.render('login')
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
      console.log("session.id ", req.session.id);
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
      signedInUser: "@" + req.session.user
    }
    models.Gab.findAll({
      include: [
      {
        model: models.User,
        as: 'users'
      },],
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

  createLike: (req, res)=>{
    var likesArray = []
    models.Like.create({userId: req.session.userId, gabId: req.params.id, gabLikes: req.session.userId}).then((likes)=>{
      console.log('likes', likes);
      likesArray.push(likes.userId);
      console.log(likesArray);
      var likesNumber = likesArray.length
      console.log("NUMBER OF LIKES", likesNumber);
      context.likesNumber = likesNumber
      // console.log(context.likesNumber);
      // console.log(gabs);
      res.redirect('/gabble/');
    })
  },
  updateGab: (req, res)=>{
    models.Gab.findOne({
      include: [{model: models.User, as: 'users'}],
      where: {id: req.params.id}
  }).then((gab)=>{
      context.model = gab;
      res.render('')
    })
  },

  delete: (req, res)=>{
    var context = {
      message: '',
    }
    if(req.session.user===users.username){
      models.Gab.destroy({where: {id: req.params.id, userId: req.session.id}}).then(()=>{
        res.redirect("/gabble/");
      });
    } else{
      context.message = 'You are not the owner of this Gab.'
      res.redirect('/gabble')
    }

  },
  likePage: (req, res)=>{
    models.Gab.findOne({
      where: {id: req.params.id},

      include: [{
         model: models.like,
        as: 'gabLikes'
      }],

    }).then((gab)=>{
      gab.getgabLikes().then(likes=>{
        console.log(likes);
      })
      // console.log(results);
      // console.log("THEEEE GABBBBB", gabLikes)
      //
      // console.log("AALLLLLLL THE LIKES", results);
      res.render('likes', results);
    })
  },
  signOut: (req, res)=>{
    delete req.session.userId
    delete req.session.user
    res.redirect('/google/user/login')
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
     }).then(function(gab) {
       console.log(gab);
       gab.getUserLikes().then(function(result) {
         // console.log(result, result.length);
         var context = {
           model: gab,
           name: req.session.user,

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
 };

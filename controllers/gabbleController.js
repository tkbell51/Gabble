
const expressValidator = require('express-validator');
const bodyParser = require('body-parser');
const models = require('../models');
const Sequelize = require('sequelize');

module.exports={
  signUp: (req, res,next)=>{
    res.render('signup')
  },
  loginPage: (req, res, next)=>{
    res.render('login')
  },

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

      }).then(function (newUser){

        console.log(newUser);
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
      req.session.id = user.id
      console.log("session.id ", req.session.id);


      if(req.session.user){
        res.redirect('/gabble/');
      }else{
        res.redirect('gabble/login');
      }
    })
  },
  home: function(req, res) {
    context = {
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
      console.log(gabs);

        context.model = gabs;
        // console.log(context.model);


      res.render('home', context);
    });
  },
  newGab: (req, res)=>{
    res.render('newGab', {})
  },
  newGabPost: (req, res)=>{
    models.Gab.create({gab: req.body.gab, users: req.session.user}).save().then((gabs)=>{
      res.redirect("/gabble/");
    });
  },
  oneGab: (req, res)=>{
    models.Gab.findOne({
      include: [{model: models.User, as: 'users'}],
    where: {id: req.params.id}
  }).then((gab)=>{
      console.log(gab);

      context.model = gab;
      res.render('oneGab', context)
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
  // likes: (req, res)=>{
  //   models.Gab.findOne({
  //     where: {id: req.params.id},
  //     include: [{
  //        model: models.Gab,
  //       as: 'gabs'
  //     }],
  //     order: [['createdAt', 'DESC']]
  //   }).then((likes)=>{
  //     console.log(likes);
  //     context.model = likes;
  //     res.render('likes', context);
  //   })
  // }

}

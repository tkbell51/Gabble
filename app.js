const express = require('express');
const mustacheExpress = require('mustache-express');
const bodyParser = require('body-parser');
const path = require('path');
const parseurl = require('parseurl');
const session = require('express-session');
const expressValidator = require('express-validator');
const routes = require('./router');
const models = require('./models');
const app = express();


app.engine('mustache', mustacheExpress());
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'mustache');


app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use(express.static(path.join(__dirname, 'public')));



app.use(expressValidator({
  additionalValidtaors: 'equals'
}));

app.use(session({
  secret: "secret123",
  resave: false,
  saveUninitialized: false
}));

app.use(function(req, res, next){
  var pathname = parseurl(req).pathname;
  if(!req.session.user && !pathname.includes('/gabble/user')){
    res.redirect('/gabble/user/login');
  } else {
    next();
  }

});
// app.use(function (req, res, next){
//   const sess

routes(app);















    app.listen(3000, (req, res)=>{
      console.log('Gabble Something');
    });

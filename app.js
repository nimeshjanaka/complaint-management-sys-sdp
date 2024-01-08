const express = require('express');
const path = require('path');
const bodyParser = require('body-parser');
const expressValidator = require('express-validator');
const flash = require('connect-flash');
const session = require('express-session');
const passport = require('passport');
const mongoose = require('mongoose');
const nodemailer = require('nodemailer');
const expressHandlebars = require('express-handlebars');
const Handlebars = require('handlebars');
const {allowInsecurePrototypeAccess} = require('@handlebars/allow-prototype-access');

// server.js
const dbconnect = require('./db');

// Connect to the database
dbconnect();

const app = express();

const port = process.env.PORT || 3000;

const index = require('./routes/index');

// Create an instance of express-handlebars
const hbs = expressHandlebars.create({
  defaultLayout: 'main',
  handlebars: allowInsecurePrototypeAccess(Handlebars)
});

app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

app.use(express.static(path.join(__dirname, 'public')));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));


app.use(session({
    secret: 'secret',
    saveUninitialized: true,
    resave: true,
    maxAge: null,
    cookie : { httpOnly: true, maxAge: 2419200000 } 
}));



app.use(passport.initialize());
app.use(passport.session());


app.use(flash());
app.use((req, res, next) => {
  res.locals.success_msg = req.flash('success_msg');
  res.locals.error_msg = req.flash('error_msg');
  res.locals.error = req.flash('error');
  res.locals.user = req.user || null;
  next();
});


app.use(expressValidator({
  errorFormatter: (param, msg, value) => {
      let namespace = param.split('.')
      , root    = namespace.shift()
      , formParam = root;

    while(namespace.length) {
      formParam += '[' + namespace.shift() + ']';
    }
    return {
      param : formParam,
      msg   : msg,
      value : value
    };
  }
}));

app.use('/', index);



app.listen(port, () => {
  console.log('Server started on port '+port);
});

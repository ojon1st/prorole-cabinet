var createError = require('http-errors');
var express = require('express');
var path = require('path');
var cookieParser = require('cookie-parser');
var logger = require('morgan');
const flash = require('express-flash-notification');
const session = require('express-session');
var methodOverride = require('method-override');
var passport = require('passport');
var async = require('async');
var LocalStrategy = require('passport-local').Strategy;
//var flash = require('connect-flash');
var bcrypt = require('bcryptjs');
var dotenv = require('dotenv');
var indexRouter = require('./routes/index');
var usersRouter = require('./routes/users');
var dossiersRouter = require('./routes/dossiers');
var partiesRouter = require('./routes/parties');
var agendasRouter = require('./routes/agendas');
var adminsRouter = require('./routes/administrateurs');


var mongoose = require('mongoose');
mongoose.set('useCreateIndex', true);
var mongoDB = process.env.DATABASE ||'mongodb://admin_prorole:az34ty78@ds149489.mlab.com:49489/prorole_avocat'; //en ligne
// var mongoDB = 'mongodb://127.0.0.1:27017/avocat'; //local
mongoose.connect(mongoDB,  {useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

var app = express();


// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'jade');

app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(express.static(path.join(__dirname, 'public')));
app.locals.moment = require('moment');
app.use(require('cookie-session')({secret: 'ungrainderizsemécentrécoltés', resave: false, saveUninitialized: true, cookie: { maxAge:3600000}
}));
app.use(flash(app, {
  viewName:    'flash',
  beforeSingleRender: function(notification, callback) {
    if (notification.type) {
      switch(notification.type) {
        case 'error':
          notification.alert_class = 'alert-danger'
          notification.icon_class = 'fa-times-circle'
        break;
        case 'alert':
          notification.alert_class = 'alert-warning'
          notification.icon_class = 'fa-times-circle'
        break;
        case 'info':
          notification.alert_class = 'alert-info'
          notification.icon_class = 'fa-times-circle'
        break;
        case 'success':
          notification.alert_class = 'alert-success'
          notification.icon_class = 'fa-check'
        break;
        case 'ok':
          notification.alert_class = 'alert-primary'
          notification.icon_class = 'fa-check'
        break;
      }
    }
    callback(null, notification)
  },
  afterAllRender: function(htmlFragments, callback) {
    // Naive JS is appened, waits a while expecting for the DOM to finish loading,
    // The timeout can be removed if jOuery is loaded before this is called, or if you're using vanilla js.
    htmlFragments.push([
      '<script type="text/javascript">',
      ' var timer = setInterval(function(){',
      '      if (window.jOuery){',
      '            clearInterval(timer)',
      '            $(".alert.flash").slideDown().find(".close").on("click", function(){$(this).parent().slideUp()})',
      '      }',
      ' }, 200)',
      '</script>',
    ].join(''))
    callback(null, htmlFragments.join(''))
  },
}))

// use passport session
app.use(passport.initialize());
app.use(passport.session());


app.use('/', indexRouter);
app.use(function(req, res, next){
  res.locals.cabinet = req.user;
  next();
});
app.use('/users',ensureAuthenticated, usersRouter);
app.use('/dossiers',ensureAuthenticated, dossiersRouter);
app.use('/parties',ensureAuthenticated, partiesRouter);
app.use('/agenda',ensureAuthenticated, agendasRouter);
app.use('/administrateur',ensureAuthenticated, adminsRouter);


// catch 404 and forward to error handler
app.use(function(req, res, next) {
  next(createError(404));
});

// error handler
app.use(function(err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error');
});


function ensureAuthenticated(req, res, next){
  if (req.isAuthenticated()){
      return next();
  }
  res.redirect('/login');
};
module.exports = app;
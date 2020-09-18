var Configuration = require('../models/configuration');

var Utilisateur = require('../models/utilisateur');

var async = require('async');
var moment = require('moment');
const flash = require('express-flash-notification');
var bcrypt = require('bcryptjs');
//var flash = require('connect-flash');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;


const {
  body,
  validationResult
} = require('express-validator/check');
const {
  sanitizeBody
} = require('express-validator/filter');

exports.home_get = function(req, res, next){
  if(req.user){
    async.parallel({
      configuration: function (callback) {
        Configuration.findOne({}, 'denomination')
          .exec(callback);
      },
      
    }, function (err, results) {
      if (err) {
        return next(err);
      }
      // res.locals.others
      console.log(results.configuration.denomination);
      res.redirect('/agenda/audiencier');
    });
    
  }else{
    res.redirect('/login')
  }
}

// L'index de la page des dossiers nous redirige vers la liste des dossiers
exports.login_get = function(req, res, next) {
  
  res.render('login', {title:'Page de connexion'});
};

exports.login_post = [
  
  body('password', 'Veuillez renseigner votre pseudo').isLength({ min: 1 }).trim(),
  passport.authenticate('local', {
      failureRedirect: '/login',
      //failureFlash: 'Votre Pseudo ou mot de passe est incorrect.'
  }),
  (req, res, next) => {
      //req.flash('success', 'Vous êtes maintenant connecté');
      console.log('Vous êtes maintenant connecté');
      res.redirect('/');
  }
];

exports.user_logout_get = function (req, res, next) {
    req.logout();
    //req.flash('success', 'Vous êtes maintenant déconnecté. Renseigner les infos pour vous connecter à nouveau.');
    res.redirect('/login');
};


passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    Utilisateur.findById(id, function (err, user) {
        done(err, user);
    });
});
passport.use(new LocalStrategy({
    usernameField: 'username',
    passwordField: 'password'

}, function (username, password, done) {
    console.log(username)
    Utilisateur.findOne({'pseudo': username})
        .exec(function (err, found_user) {
            if (err) throw err;
            if (!found_user) {
              console.log('not found')
                return done(null, false, {
                    message: 'L\'utilisateur ' + username + ' est inconnu'
                });
            }
            /*console.log(hashpsw(password))
            console.log(found_user.pswd)
            return*/
      
            // User found and compare password.
            found_user.comparePassword(password, found_user.pswd, function (err, isMatch) {
                if (err) return done(err);
                if (isMatch) {
                    return done(null, found_user);
                } else {
                    return done(null, false, {
                        message: 'Le mot de passe est invalide'
                    });
                }
            });
        })
}));

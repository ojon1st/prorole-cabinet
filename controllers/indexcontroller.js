var Configuration = require('../models/configuration');
var passport = require('passport');
var LocalStrategy = require('passport-local').Strategy;

const {
  body,
  validationResult
} = require('express-validator/check');
const {
  sanitizeBody
} = require('express-validator/filter');

// Rendu de l'accueil
exports.home_get = function(req, res, next){
  if(req.user){
    res.redirect('/agenda/audiencier');
  }else{
    res.redirect('/login');
  }
}

// Vue, page de connexion
exports.login_get = function(req, res, next) {
  res.render('login', {title:'Page de connexion'});
};

// Verication des identifiants
exports.login_post = [
  body('password', 'Veuillez renseigner votre pseudo').isLength({ min: 8 }).trim(),
  passport.authenticate('local', {
    failureRedirect: '/login?error'
  }),
  (req, res, next) => {
    console.log('Vous êtes maintenant connecté');
    res.redirect('/');
  }
];

// Deconnexion
exports.user_logout_get = function (req, res, next) {
  req.logout();
  res.redirect('/login');
};


passport.serializeUser(function (user, done) {
  done(null, user.id);
});

passport.deserializeUser(function (id, done) {
  Configuration.findById(id, function (err, user) {
    done(err, user);
  });
});
passport.use(new LocalStrategy({
  usernameField: 'username',
  passwordField: 'password'

}, function (username, password, done) {
  Configuration.findOne({'identifiant': username})
    .exec(function (err, compte) {
      if (err) throw err;
      if (!compte) {
        console.log('compte not found')
        return done(null, false, {
          message: 'Le compte ' + username + ' est inconnu'
        });
      }
      // User found and compare password.
      compte.comparePassword(password, compte.pswd, function (err, isMatch) {
        if (err) return done(err);
        if (isMatch) {
          return done(null, compte);
        } else {
          console.log(compte._id)
          return done(null, false, {
            message: 'Le mot de passe est invalide'
          });
        }
      });
    })
}));

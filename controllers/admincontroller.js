var Configuration = require('../models/configuration');

const {
  body,
  validationResult
} = require('express-validator/check');
const {
  sanitizeBody
} = require('express-validator/filter');

// L'index de la page des dossiers nous redirige vers la liste des dossiers
exports.index = function(req, res, next) {
  res.redirect('/administrateur/configuration_du_cabinet');
};


exports.configuration_du_cabinet = function (req, res, next){
  // Get all dossier for form
  res.render('administrateur/configuration', {title:' Configuration du compte du Cabinet'});
  
};



exports.configuration_du_cabinet_update = [
   (req, res, next) => {
    
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    
    // Create a genre object with escaped and trimmed data.
    
    if (!errors.isEmpty()) {
      console.log(errors)
      return;
    } else {
      Configuration.findOne({}, function (err, doc) {
        if (err) {return next(err);}

        if (req.body.password){
          doc.pswd = req.body.password;
        }
        doc.save(function (err) {
            if (err) { console.log(err); return next(err); }
            res.redirect('/administrateur/configuration_du_cabinet');
        });
      });
    }
  }
];

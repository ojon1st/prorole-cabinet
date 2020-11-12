var Dossier = require('../models/dossier');
var Pour = require('../models/pour');
var Contre = require('../models/contre');
var Juridiction = require('../models/juridiction');
var Instruction = require('../models/instruction');

var async = require('async');

const {
  body,
  validationResult
} = require('express-validator/check');
const {
  sanitizeBody
} = require('express-validator/filter');

// Recuperation de dossiers.
exports.dossier_list = function (req, res, next) {

  // Get all dossier for form
  async.parallel({
    dossiers: function (callback) {
      Dossier.find({})
        .select({ "_id": 1, "ref_d": 1, "ref_d_p": 1, "pour":1, "contre":1, "ref_d_p": 1})
        .populate('pour')
        .populate('contre')
        .sort({ ref_d: 1 })
        .exec(callback);
    }
  }, function (err, results) {
    if (err) {
      return next(err);
    }
    res.render('dossiers/dossier_list', {
      title: 'Liste de dossiers',
      list_dossiers: results.dossiers
    });
  });

};

// Visualisation du dossier
exports.dossier_detail = function (req, res, next) {

  async.parallel({
    dossier: function (callback) {
      Dossier.findById(req.params.id)
        .populate('pour')
        .populate('contre')
        .exec(callback);
    },
    juridictions: function (callback) {
      Juridiction.find()
        .sort({nom:1})
        .exec(callback);
    },
    instructions: function (callback){
      Instruction.find({dossier:req.params.id})
        .populate('juridiction')
        .sort({i_update: -1})
        .exec(callback);
    },
  }, function (err, results) { 
    if (err) {
      return next(err);
    }
    
    if (results.dossier == null) { // No results.
      var err = new Error('Dossier not found');
      err.status = 404;
      return next(err);
    }
    
    var j_instance = [];
    var j_appel = [];
    var j_cour = [];
    
    results.juridictions.forEach(function(j){
      if(j.division == 'instance'){
        j_instance.push(j);
      }else if(j.division == 'appel'){
        j_appel.push(j);
      }else if(j.division == 'cour'){
        j_cour.push(j);
      }
    })
    
    var i_instance = [];
    var i_appel = [];
    var i_cour = [];
    
    results.instructions.forEach(function(i){
      if(i.juridiction.division == 'instance'){
        i_instance.push(i);
      }else if(i.juridiction.division == 'appel'){
        i_appel.push(i);
      }else if(i.juridiction.division == 'cour'){
        i_cour.push(i);
      }
    })
    
    res.render('dossiers/dossier_detail', {
      title: 'Gestionnaire de Dossier',
      dossier: results.dossier, juridictions: results.juridictions, instructions:results.instructions,  j_instance:j_instance, j_appel:j_appel, j_cour:j_cour, i_instance:i_instance, i_appel:i_appel, i_cour:i_cour
    });
  });

};

// Vue, creation de dossier
exports.dossier_create_get = function (req, res, next) {
  res.render('dossiers/dossier_form', { title: 'Creation de dossier'});
};

// Verification ref physique
exports.remove_duplicate_ref = function (req, res, next) {

  // Get all dossier for form
  async.parallel({
    dossier_physique: function (callback) {
      Dossier.findOne({ref_d_p: req.params.ref}).exec(callback);
    },
    
  }, function (err, results) {
    if (err) { return next(err); }
    if(results.dossier_physique && results.dossier_physique.ref_d_p != null){
      res.send({
        type_of_response: 'warning',
        al_title: 'Reference physique',
        al_msg : `Attention la reference ${req.params.ref} exite deja, veuillez verifier la reference`
      });
    }
    else{
      res.send({type_of_response: 'success'});
    }
  });
};

// Creation du dossier
exports.dossier_create_post = [

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request .
    const errors = validationResult(req);
    
    let pour = new Pour({
      p_nom: req.body[0]['p_nom'],
      p_tel: req.body[0]['p_tel'],
      p_email: req.body[0]['p_email']
    });

    let contre = new Contre({
      c_nom: req.body[0]['c_nom'],
      c_tel: req.body[0]['c_tel'],
      c_email: req.body[0]['c_email']
    });

    let dossier = new Dossier({
      ref_d_p: req.body[0]['ref_d_p'],
      pour: pour,
      contre: contre
    });

    dossier.pour = pour;
    dossier.contre = contre;
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('dossiers/dossier_form', {
        title: 'Create Dossier',
        dossier: dossier,
        pour: pour,
        contre: contre,
        errors: errors.array()
      });
      return;
    } else {
      pour.save(function (err) {
        if (err) { return next(err); }
      });
      contre.save(function (err) {
        if (err) { return next(err); }
      });
      dossier.hookEnabled = true;
      dossier.save(function (err) {
        if (err) { return next(err); }
        res.send({
          type_of_response: 'success',
          al_title: 'Création du dossier!',
          al_msg : 'Le dossier a été crée avec succès!'
        });
        return;
      });
    }
  }
];

// Mise a jour du dossier
exports.dossier_update_post = [
    // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request .
    const errors = validationResult(req);
    // Create a dossier object with escaped and trimmed data (and the old id!)
    Dossier.findById(req.params.id)
      .exec(function(err, the_dossier){
        if (err) return next(err);
        the_dossier.updateOne({
          ref_d_p : req.body.ref_d_p,
          nature : req.body.nature,
          qualite : req.body.qualite,
          resume : req.body.resume,
          c_avocat : req.body.avocat
        }, function(err) {
          if(err) {console.log(err)}
          res.send({
            type_of_response: 'success', update: true,
            al_title: 'Mise à jour du dossier!',
            al_msg : 'La mise à jour du dossier a été fait avec succès!'
          });
        })
        .catch(console.log);
    });
  }
];
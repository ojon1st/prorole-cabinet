var Dossier = require('../models/dossier');
var Instruction = require('../models/instruction');
var Juridiction = require('../models/juridiction');

var async = require('async');
var moment = require('moment');

const {
  body,
  validationResult
} = require('express-validator/check');
const {
  sanitizeBody
} = require('express-validator/filter');

exports.instruction_create_post = [

    // Validate that the name field is not empty.
    //body('dossiername', 'Dossier name required').isLength({ min: 1 }).trim(),
    //body('dossiercode', 'Dossier code required').isLength({ min: 1 }).trim(),

    // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);
    /*
    3 cas: 1er cas - on crée une nouvelle 2e cas on modifie la juridiction d'une instruction existante 3e cas on interdit la modification
    */
    
    // Il s'agit dune nouvelle instruction
    
    if(!req.body.instruction){ // création de l'instruction || condition : juridiction valide
      if(req.body.juridiction && req.body.juridiction != 'null'){ // on a une juridiction valide
        var new_instruction = new Instruction({
          dossier:req.body.dossier,
          juridiction : req.body.juridiction
        })
        
        new_instruction.save(function(err){
          if(err) return next(err)
          res.send({type_of_response: 'success',creation: true,
                    al_title: 'Nouvelle Juridiction!',
                    al_msg : 'L\'instruction a été créée avec succès ...'})
        })
      } else{ // on a pas de juridiction valide
        res.send({type_of_response: 'success',creation: false,
                    al_title: 'Changement de Juridiction!',
                    al_msg : 'Veuillez choisir une juridiction valide!'})
      }
    } else{ // Il s'agit d'une instruction à modifier : on vérifie si il n'y pas eu de renvois ou de décision
      
      Instruction.findById(req.body.instruction, function(err, the_instruction){
        if (err) return next(err);
        
        if((!the_instruction.renvois || the_instruction.renvois.length == 0) && (!the_instruction.decision || the_instruction.decision != '')){ // On a ni renvoi ni décision: on permet un changement de juridiction
          the_instruction.juridiction = req.body.juridiction;
          the_instruction.save(function (err) {
            if (err) {return next(err);}
            res.send({type_of_response: 'success',creation: true,
                    al_title: 'Changement de Juridiction!',
                    al_msg : 'Vous venez de changer de juridiction pour ce dossier'})
          })
        }else{ // pas de création de l'instruction
          res.send({type_of_response: 'success',creation: false,
                    al_title: 'Changement de Juridiction!',
                    al_msg : 'L\'instruction ne peut plus être modifiée à ce stade!'})
        }  
    })
    }
  }
];

exports.renvoi_create_post = [
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);
    async.parallel({
      theinstruction: function (callback) {
        Instruction.findOne({
            dossier: req.params.id
          })
          .sort({
            i_update: -1
          })
          .exec(callback);
      },

    }, function (err, results) {
      if (err) {
        return next(err);
      }

      results.theinstruction.renvois.push({
        r_date: moment(req.body.date_renvoi, "DD-MM-YYYY"),
        r_motif: req.body.motif_renvoi
      });
      var date_last_renvoi = req.body.date_renvoi;
      results.theinstruction.save(function (err) {
        if (err) {
          return next(err);
        }
        res.send({
          type_of_response: 'success',
          renvois_list: results.theinstruction.renvois,
          date_last_renvoi: date_last_renvoi
        });

      });

    });
    }
];


exports.mise_en_etat_create_post = [
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);
    async.parallel({
      theinstruction: function (callback) {
        Instruction.findOne({
            dossier: req.params.id,
            juridiction: req.params.id_ins
          })
          .sort({
            i_update: -1
          })
          .exec(callback);
      },
    }, function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.theinstruction) {
        req.body.forEach(function (doc) {
          /*console.log(doc)
          return;*/
          results.theinstruction.calendrier.push({
            c_debut: moment(doc.du, "DD-MM-YYYY"),
            c_fin: moment(doc.au, "DD-MM-YYYY"),
            c_heure: doc.h,
            c_commentaire: doc.com_name
          });


        });
        results.theinstruction.save(function (err) {
          if (err) {
            next(err);
          }

          res.send({
            type_of_response: 'success',
            mee_list: results.theinstruction.calendrier
          });
          return;
        });
      } else {
        res.send({
          type_of_response: 'echec'
        });
        return;
      }


    });
    }
];


exports.diligence_create_post = [
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);
    async.parallel({
      theinstruction: function (callback) {
        Instruction.findOne({
            dossier: req.params.id,
            juridiction: req.params.id_ins
          })
          .sort({
            i_update: -1
          })
          .exec(callback);
      },
    }, function (err, results) {
      if (err) {
        return next(err);
      }
      if (results.theinstruction) {
        req.body.forEach(function (doc) {

          results.theinstruction.diligence.push({
            d_debut: moment(doc.du, "DD-MM-YYYY"),
            d_fin: moment(doc.au, "DD-MM-YYYY"),
            d_heure: doc.h,
            d_commentaire: doc.com_name
          });

        });
        results.theinstruction.save(function (err) {
          if (err) {
            return next(err);
          }

          res.send({
            type_of_response: 'success',
            dil_list: results.theinstruction.diligence
          });
          return;
        });
      } else {
        res.send({
          type_of_response: 'echec'
        });
        return;
      }


    });
    }
];


exports.mise_en_etat_get = function (req, res, next) {

  async.parallel({
    instruction: function (callback) {
      Instruction.findById(req.params.id_ins)
        .exec(callback);
    },

  }, function (err, results) {
    if (err) {
      return next(err);
    }
    if (results.instruction == null) {
      res.send({
        type_of_response: 'echec'
      })
    } else {
      res.send({
        type_of_response: 'success',
        mee_list: results.instruction.calendrier
      });
    }

  });

};

exports.diligence_get = function (req, res, next) {

  async.parallel({
    instruction: function (callback) {
      Instruction.findById(req.params.id_ins)
        .exec(callback);
    },

  }, function (err, results) {
    if (err) {
      return next(err);
    }
    if (results.instruction == null) {
      res.send({
        type_of_response: 'echec'
      })
    } else {
      res.send({
        type_of_response: 'success',
        dil_list: results.instruction.diligence
      });
    }

  });

};

exports.is_decision = [
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);
    async.parallel({
      theinstruction: function (callback) {
        Instruction.findById(req.params.id_instruction)
          .exec(callback);
      },
    }, function (err, results) {

      if (err) {
        return next(err);
      }
      if (results.theinstruction) {
        if (results.theinstruction.decision && results.theinstruction.decision != 'undefined' && results.theinstruction.decision != '') {

        } else {

        }

        results.theinstruction.decision = req.body.decision;
        results.theinstruction.save(function (err) {
          if (err) {
            return next(err);
          }

          res.send({
            type_of_response: 'success',
            decision: req.body.decision
          });
          return;
        });
      } else {
        res.send({
          type_of_response: 'echec'
        });
        return;
      }

    });
    }
];

exports.decision_save = [
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);
    async.parallel({
      theinstruction: function (callback) {
        Instruction.findOne({
            dossier: req.params.id,
            _id: req.params.id_ins
          })
          .sort({
            i_update: -1
          })
          .exec(callback);
      },
    }, function (err, results) {

      if (err) {
        return next(err);
      }
      if (results.theinstruction) {

        results.theinstruction.decision = req.body.decision;
        results.theinstruction.save(function (err) {
          if (err) {
            return next(err);
          }

          res.send({
            type_of_response: 'success',
            decision: req.body.decision
          });
          return;
        });
      } else {
        res.send({
          type_of_response: 'echec'
        });
        return;
      }

    });
    }
];

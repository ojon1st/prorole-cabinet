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
      // Ou d'un changement de degré
      
      Instruction.findById(req.body.instruction)
                  .populate('juridiction')
                  .exec(function(err, the_instruction){
        if (err) return next(err);
        
        if(the_instruction.juridiction.division != req.body.division){ // il s'agit d'un changement de degré d'instruction
          
          
          /*
          
          //on vérifie l'état de l'instruction actuelle
          if((the_instruction.renvois && the_instruction.renvois.length > 0) || (the_instruction.decision && the_instruction.decision != '') ){ // Si il y a eu renvoi ou décision rendue
            
            
          }else{//
            //
            
            
          }
          
          */
          // on empêche de revenir à une juridiction inférieure
          if( (the_instruction.juridiction.division == 'instance' && (req.body.division == 'appel' || req.body.division == 'cour')) || (the_instruction.juridiction.division == 'appel' && req.body.division == 'cour') ){
            
            // on vérifie si l'ancienne instruction est cloturée par une décision rendue
            if( the_instruction.decision && the_instruction.decision != ''){
              // on crée une nouvelle instruction dans la nouvelle juridiction et division
              
              var new_instruction = new Instruction({
                dossier:req.body.dossier,
                juridiction : req.body.juridiction
              })

              new_instruction.save(function(err){
                if(err) return next(err)
                res.send({type_of_response: 'success',creation: true,
                          al_title: 'Nouvelle Juridiction!',
                          al_msg : 'L\'instruction a été créée avec succès ...'})
                return;
              })
            }else{ // Pas de décision : message d'erreur nécessite la clôture de l'ancien dossier
              
              res.send({type_of_response: 'success',creation: false,
                      al_title: 'Changement de Juridiction!',
                      al_msg : 'Veuillez d\'abord saisir la décision rendue en ' + the_instruction.juridiction.division + '!'})
            }
            
            
          }else{ // message d'erreur car juridiction inférieure
            
            res.send({type_of_response: 'success',creation: false,
                      al_title: 'Changement de Juridiction!',
                      al_msg : 'Le dossier ne peut plus passer en ' + req.body.division})
          }
          
          
        }else{ // On reste dans le meme degré d'intruction
          // le front-end empeche de modifier l'instruction lorqu'un renvoi est dréé ou qu'une décision ets rendue
          
          // on peut autoriser la modification de l'intruction en cours direcetement
          
          the_instruction.juridiction = req.body.juridiction;
            the_instruction.save(function (err) {
              if (err) {return next(err);}
              res.send({type_of_response: 'success',creation: true,
                      al_title: 'Changement de Juridiction!',
                      al_msg : 'Vous venez de changer de juridiction pour ce dossier'})
            })
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
        Instruction.findOne({ dossier: req.params.id, juridiction:req.body.juridiction })
          .exec(callback);
      },

    }, function (err, results) {
      if (err) {
        return next(err);
      }
      
      results.theinstruction.renvois.push({
        r_date: moment(req.body.date_renvoi, "DD-MM-YYYY"),
        r_type: req.body.type_renvoi,
        r_motif: req.body.motif_renvoi
      });
      var date_last_renvoi = req.body.date_renvoi;
      results.theinstruction.save(function (err) {
        if (err) {
          return next(err);
        }
        res.send({
          type_of_response:'success',
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
        Instruction.findById(req.params.id_ins).populate('juridiction').exec(callback);
      },
    }, function (err, results) {
      if (err) {
        return next(err);
      }
      if (!results.theinstruction || results.theinstruction.juridiction.division != req.params.juridiction){
        res.send({type_of_response:'echec', al_title:'', al_msg:''})
      }else {
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
        Instruction.findById(req.params.id_ins).populate('juridiction').exec(callback);
      },
    }, function (err, results) {
      if (err) {
        return next(err);
      }
      if (!results.theinstruction || results.theinstruction.juridiction.division != req.params.juridiction){
        res.send({type_of_response:'echec', al_title:'', al_msg:''})
      }else {
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
        });
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


exports.get_manques = function(req, res, next){
  
  async.parallel({
    
    last_renvois: function(callback){
      Instruction.find({}, {'renvois':{'$slice':-1},'_id':1,'decision':1, 'dossier':1, 'juridiction':1})
          .populate({ path: 'dossier', model: 'Dossier', populate: { path: 'pour contre'} })
          .populate('juridiction')
          .exec(callback);
    },
    }, function (err, results) {
      if (err) { return next(err); }
     
      var dossiers_retards = [];
      results.last_renvois.forEach(function(last_renvoi){
        if(last_renvoi.renvois.length > 0 && moment().diff(moment(last_renvoi.renvois[0].r_date), 'days') > 0){
          if(!last_renvoi.decision || last_renvoi.decision == ""){
            //console.log(last_renvoi);
            dossiers_retards.push(last_renvoi)
          }
        }
      });
      //console.log(dossiers_retards)
      
      res.render('dossiers/dossier_tri_instruction', { title:'dossiers sans date de renvoi', list_dossiers: dossiers_retards});
      
  });
};


exports.get_renvoi_role_general = function(req, res, next){
  async.parallel({
    
    renvois_rgs: function(callback){
      Instruction.find({}, {'renvois':{'$slice':-1},'_id':1,'decision':1, 'dossier':1, 'juridiction':1})
          .populate({ path: 'dossier', model: 'Dossier', populate: { path: 'pour contre'} })
          .populate('juridiction')
          .exec(callback);
    },
    }, function (err, results) {
      if (err) { return next(err); }
     
      var renvoi_role_general = [];
      results.renvois_rgs.forEach(function(renvois_rg){
        if(renvois_rg.renvois.length > 0 && renvois_rg.renvois[0].r_type == 'renvoi au role general'){
          //console.log(last_renvoi);
          renvoi_role_general.push(renvois_rg)
        }
      });
      //console.log(renvoi_role_general)
      
      res.render('dossiers/dossier_tri_instruction', { title:'renvois au rôle général', list_dossiers: renvoi_role_general});
      
  });
};
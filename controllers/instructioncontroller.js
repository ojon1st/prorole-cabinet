var Instruction = require('../models/instruction');

var async = require('async');
var moment = require('moment');

const {
  body,
  validationResult
} = require('express-validator/check');
const {
  sanitizeBody
} = require('express-validator/filter');

var cloudinary = require('cloudinary');

cloudinary.config({ 
  cloud_name: 'prorole', 
  api_key: '675842782989895', 
  api_secret: 'Lc5kh5dKKKla8Brcci87Jf8BOL0' 
});

exports.instruction_create_post = [
  // Process request after validation and sanitization.
  (req, res, next) => {
    if(!req.body.instruction || (req.body.instruction && req.body.decision == true)){
      var new_instruction = new Instruction({
        dossier:req.body.dossier,
        juridiction : req.body.juridiction,
        division : req.body.juridiction,
      });
      
      new_instruction.save(function(err){
        if(err) return next(err);
        res.send(
          {
            type_of_response: 'success',creation: true,
            al_title: 'Nouvelle Juridiction!',
            al_msg : 'L\'instruction a été créée avec succès'
          }
        );
      });
    }
    else{
      Instruction.findById(req.body.instruction)
                  .select({ "_id": 1, "renvois": 1, "decision": 1})
                  .populate('juridiction')
                  .exec(function(err, the_instruction){
        if (err) return next(err);
        the_instruction.updateOne({
          juridiction : req.body.juridiction,
          division : req.body.juridiction,
        }, function(err) {
          if(err) {
            console.log(err)
          }
          res.send(
            {
              type_of_response: 'success', update: true,
              al_title: 'Changement de Juridiction!',
              al_msg : 'Veuillez choisir une juridiction valide!'
            }
          );
        })
        .catch(console.log);
      });
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
      req.body.date_renvoi = (req.body.date_renvoi != '' ? moment(req.body.date_renvoi, "DD-MM-YYYY") : '');
      if(req.body.type_renvoi == 'renvoi au role general' || req.body.type_renvoi == 'delibere vide' || req.body.type_renvoi == 'non appele'){
        var last_renvoi = results.theinstruction.renvois;
        if(last_renvoi.length > 0){
          results.theinstruction.renvois.push({
            r_date: moment(last_renvoi[parseInt(last_renvoi.length -1)].r_date, "DD-MM-YYYY"),
            r_type: req.body.type_renvoi,
            r_motif: req.body.motif_renvoi
          });
        }
        else{
          return res.send({type_of_response:'warning'});
        }
      }
      else{
        results.theinstruction.renvois.push({
          r_date: req.body.date_renvoi,
          r_type: req.body.type_renvoi,
          r_motif: req.body.motif_renvoi
        });
      }
      results.theinstruction.save(function (err) {
        if (err) { next(err);}
        res.send({
          type_of_response:'success',
          date_last_renvoi: moment(results.theinstruction.renvois[parseInt(results.theinstruction.renvois.length -1)].r_date, "DD-MM-YYYY")
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
            c_conclusion: doc.con,
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
            al_title: 'Sauvegarde de la decison',
            al_msg: 'La decision a été enregistrée avec success'
          });
          return;
        });
      } else {
        res.send({
          type_of_response: 'warning',
          al_title: 'Sauvegarde de la decison',
            al_msg: 'La sauvegarde de la decison a echoué'
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

exports.del_conclusion = function (req, res, next) {
  async.parallel({
    instruction: function (callback) {
      Instruction.findById(req.params.id, {'renvois':{'$slice':-1},'calendrier':{'$slice':-1}})
        .exec(callback);
    },

  }, function (err, results) {
    if (err) {
      return next(err);
    }
    if((results.instruction.calendrier && results.instruction.calendrier.length > 0 && results.instruction.calendrier[0]._id == req.params.id_conclusion) || (results.instruction.renvois && results.instruction.renvois.length > 0 && results.instruction.renvois[0]._id == req.params.id_conclusion)){
      (results.instruction.calendrier && results.instruction.calendrier.length > 0 ? results.instruction.calendrier[0].c_operate.push({origine: 'Calendrier', operate: 1}) : results.instruction.renvois[0].r_operate.push({origine: 'Calendrier', operate: 1}))
      results.instruction.save(function (err) {
        if (err) { next(err);}
        res.send({
          type_of_response : 'success',
          al_title: 'Suppression du dossier au repertoire',
          al_msg : 'Le dossier a été supprimé avec succès!'
        });
      });
    }
  });

};

exports.get_manques = function(req, res, next){
  
  async.parallel({
    
    last_renvois: function(callback){
      Instruction.find({}, {'renvois':{'$slice':-1},'_id':1, 'dossier':1, 'juridiction':1})
          .populate({ path: 'dossier', model: 'Dossier', populate: { path: 'pour contre'} })
          .populate('juridiction')
          .exec(callback);
    },
    }, function (err, results) {
      if (err) { return next(err); }
     
      var dossiers_retards = [];
      results.last_renvois.forEach(function(last_renvoi){
        if(last_renvoi.renvois.length > 0 && moment().diff(moment(last_renvoi.renvois[0].r_date), 'days') > 0 && last_renvoi.renvois[0].r_type !="delibere vide"){
          if(last_renvoi.decision == null || last_renvoi.decision == ''){
            dossiers_retards.push(last_renvoi);
          }
        }
      });
      
      res.render('dossiers/dossier_tri_instruction', { title:'defaut de renvoi', list_dossiers: dossiers_retards});
      
  });
};

exports.get_renvoi_role_general = function(req, res, next){
  async.parallel({
    
    renvois_rgs: function(callback){
      Instruction.find({}, {'renvois':{'$slice':-1},'_id':1, 'dossier':1, 'juridiction':1})
          .populate({ path: 'dossier', model: 'Dossier', populate: { path: 'pour contre'} })
          .populate('juridiction')
          .exec(callback);
    },
    }, function (err, results) {
      if (err) { return next(err); }
     
      var renvoi_role_general = [];
      results.renvois_rgs.forEach(function(renvois_rg){
        if(renvois_rg.renvois.length > 0 && renvois_rg.renvois[0].r_type == 'renvoi au role general' && renvois_rg.renvois[0].r_type != "delibere vide"){
          renvoi_role_general.push(renvois_rg)
        }
      });res.render('dossiers/dossier_tri_instruction', { title:'renvois au rôle général', list_dossiers: renvoi_role_general});
      
  });
};

exports.conclusion_prendre = function(req, res, next){
  async.parallel({
    conclusions: function(callback){
      Instruction.find({}, {'renvois':1,'_id':1, 'dossier':1, 'juridiction':1, 'calendrier':1})
                 .populate({ path: 'dossier', model: 'Dossier', populate: { path: 'pour contre'} })
                 .populate('juridiction')
                 .exec(callback);
    },
  }, 
  function (err, results) {
    if (err) { return next(err); }
    var conclusion_a_prende = [];
    results.conclusions.forEach(function(conclusion){
      var tab_class = {};
      let del_conclsion_renvoi = del_conclsion_calendrier = false;
      if((conclusion.renvois && conclusion.renvois.length > 0 && conclusion.renvois[parseInt(conclusion.renvois.length - 1, 10)].r_type == 'nos conclusions') || (conclusion.calendrier && conclusion.calendrier.length > 0 && conclusion.calendrier[parseInt(conclusion.calendrier.length - 1, 10)].c_conclusion == 'nous') && conclusion.decision == null){
        if(conclusion.renvois && conclusion.renvois.length > 0 && conclusion.renvois[parseInt(conclusion.renvois.length - 1, 10)].r_type == "delibere vide"){return}
        var date_check = (conclusion.renvois[parseInt(conclusion.renvois.length - 1, 10)] ? conclusion.renvois[parseInt(conclusion.renvois.length - 1, 10)].r_date : conclusion.calendrier[parseInt(conclusion.calendrier.length - 1, 10)].c_fin);
        var diff = moment().diff(moment(date_check), 'days')
        if(diff <= 0){
          (diff >= -3 ? tab_class.clsDif = 'r-3' : (diff >= -7 ? tab_class.clsDif = 'r-7' : tab_class.clsDif = 'r-x'));
        }
        else{tab_class.clsDif = 'r-3';}

        if(conclusion.renvois && conclusion.renvois.length > 0 && conclusion.renvois[parseInt(conclusion.renvois.length - 1, 10)].r_operate && conclusion.renvois[parseInt(conclusion.renvois.length - 1, 10)].r_operate.length > 0){
          conclusion.renvois[parseInt(conclusion.renvois.length - 1, 10)].r_operate.forEach(function (renvoi){
            if(renvois.origine == 'Calendrier'){
              return del_conclsion_renvoi = true;
            }
          });
        }

        if(conclusion.calendrier && conclusion.calendrier.length > 0 && conclusion.calendrier[parseInt(conclusion.calendrier.length - 1, 10)].c_operate && conclusion.calendrier[parseInt(conclusion.calendrier.length - 1, 10)].c_operate.length > 0){
          conclusion.calendrier[parseInt(conclusion.calendrier.length - 1, 10)].c_operate.forEach(function (calendrier){
            if(calendrier.origine == 'Calendrier'){
              return del_conclsion_calendrier = true;
            }
          });
        }
        if(del_conclsion_renvoi == false &&  del_conclsion_calendrier == false ){
          conclusion_a_prende.push({
            conclusion : conclusion,
            etat : tab_class
          });
        }
      }
    });
    res.render('dossiers/dossier_tri_instruction', { title:'conclusions à prendre', list_dossiers: conclusion_a_prende});
  });
};

exports.get_decision_a_lever = function(req, res, next){
  async.parallel({
    
    decision : function(callback){
      Instruction.find({}, {'decision':1, 'isDecision':1, 'renvois':{'$slice':-1}, '_id':1, 'dossier':1, 'juridiction':1})
          .populate({ path: 'dossier', model: 'Dossier', populate: { path: 'pour contre'} })
          .populate('juridiction')
          .exec(callback);
    },
    }, function (err, results) {
      if (err) { return next(err); }
      var decision = [];
      results.decision.forEach(function(dossier){
        if((dossier.decision != null && dossier.decision != '') || (dossier.renvois.length > 0 && dossier.renvois[0].r_type == "delibere vide")){
          if(dossier.isDecision == null){
            decision.push(dossier);
          }
        }
      });
      res.render('dossiers/dossier_tri_instruction', { title:'décision à lever', list_dossiers: decision});
  });
};

exports.del_decision = function (req, res, next) {
  async.parallel({
    theinstruction: function (callback) {
      Instruction.findOne({
          _id: req.params.id
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
      results.theinstruction.isDecision = true;
      results.theinstruction.save(function (err) {
        if (err) {
          return next(err);
        }
        res.send({
          type_of_response : 'success',
          al_title: 'Suppression du dossier au repertoire',
          al_msg : 'Le dossier a été supprimé avec succès!'
        });
        return;
      });
    } else {
      res.send({
        type_of_response: 'warning',
        al_title: 'Suppression du dossier au repertoire',
        al_msg : 'Echec de la suppression du dossier!'
      });
      return;
    }
  });
};
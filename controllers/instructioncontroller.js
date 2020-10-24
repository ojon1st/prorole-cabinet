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

//const NotifySend = require('node-notifier').NotifySend;
//var notifier = new NotifySend();
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
        juridiction : req.body.juridiction
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
          juridiction : req.body.juridiction
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
        if(last_renvoi.renvois.length > 0 && moment().diff(moment(last_renvoi.renvois[0].r_date), 'days') > 0){
          if(!last_renvoi.decision || last_renvoi.decision == "" || last_renvoi.renvois[0].r_type !="delibere vide"){
            //console.log(last_renvoi);
            dossiers_retards.push(last_renvoi)
          }
        }
      });
      //console.log(dossiers_retards)
      
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

exports.get_renvoi_general = function(req, res, next){
  async.parallel({
    
    renvois_rgs: function(callback){
      Instruction.find({}, {'renvois':{'$slice':-1},'_id':1, 'dossier':1, 'juridiction':1, 'calendrier':1})
          .populate({ path: 'dossier', model: 'Dossier', populate: { path: 'pour contre'} })
          .populate('juridiction')
          .exec(callback);
    },
    }, function (err, results) {
      if (err) { return next(err); }
      var renvoi_general = [];
      results.renvois_rgs.forEach(function(renvois_rg){
        if(((renvois_rg.renvois.length > 0 && renvois_rg.renvois[0].r_type == 'nos conclusions') || (renvois_rg.calendrier.length > 0 && renvois_rg.calendrier[0].c_conclusion == 'nous')) && renvois_rg.renvois[0].r_type != "delibere vide"){
          renvoi_general.push(renvois_rg) 
        }
      });
      res.render('dossiers/dossier_tri_instruction', { title:'conclusions à prendre', list_dossiers: renvoi_general});
      
  });
};

exports.get_decision_a_lever = function(req, res, next){
  async.parallel({
    
    decision : function(callback){
      Instruction.find({}, {'decision':1, 'renvois':{'$slice':-1}, '_id':1, 'dossier':1, 'juridiction':1})
          .populate({ path: 'dossier', model: 'Dossier', populate: { path: 'pour contre'} })
          .populate('juridiction')
          .exec(callback);
    },
    }, function (err, results) {
      if (err) { return next(err); }
      var decision = [];
      results.decision.forEach(function(dossier){
        if((dossier.decision != null && dossier.decision != '') || (dossier.renvois.length > 0 && dossier.renvois[0].r_type == "delibere vide")){
          decision.push(dossier)
        }
      });
      
      res.render('dossiers/dossier_tri_instruction', { title:'décision à prendre', list_dossiers: decision});
      
  });
};
var Dossier = require('../models/dossier');
var Instruction = require('../models/instruction');
var Juridiction = require('../models/juridiction');

var async = require('async');
var moment = require('moment');

const {body, validationResult} = require('express-validator/check');
const {sanitizeBody} = require('express-validator/filter');

exports.instruction_create_post = [

    // Validate that the name field is not empty.
    //body('dossiername', 'Dossier name required').isLength({ min: 1 }).trim(),
    //body('dossiercode', 'Dossier code required').isLength({ min: 1 }).trim(),


    // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);
    async.parallel({
        thedossier: function (callback) {
          Dossier.findById(req.params.id)
            .exec(callback);
      },
      thejuridiction: function(callback) {
          Juridiction.findById(req.body.juridiction)
            .exec(callback);
      }
    }, function (err, results) {
      if (err) { return next(err); }
      
      var instruction= new Instruction({
        dossier: results.thedossier,
        juridiction: results.thejuridiction,
        i_update: moment().local().format("DD-MM-YYYY HH:mm:ss")
      });
      
      instruction.save(function (err) {
        if (err) { return next(err); }
        res.send({type_of_response: 'success',nom_juridiction:results.thejuridiction.nom, instruction:instruction._id});
      });
    });
    }
];

exports.renvoi_create_post = [
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);
    async.parallel({
        theinstruction: function (callback) {
          Instruction.findOne({dossier:req.params.id})
            .sort({i_update: -1})
            .exec(callback);
      },
     
    }, function (err, results) {
      if (err) { return next(err); }
      
      results.theinstruction.renvois.push({r_date:moment(req.body.date_renvoi,"DD-MM-YYYY"),r_motif:req.body.motif_renvoi});
      var date_last_renvoi = req.body.date_renvoi;
      results.theinstruction.save(function (err) {
        if (err) { return next(err); }
          res.send({type_of_response: 'success',renvois_list:results.theinstruction.renvois, date_last_renvoi:date_last_renvoi});
          
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
          Instruction.findOne({dossier:req.params.id,juridiction:req.params.id_ins})
            .sort({i_update: -1})
            .exec(callback);
      },  
    }, function (err, results) {
      if (err) { return next(err); }
      if (results.theinstruction){
        req.body.forEach(function (doc) {
            /*console.log(doc)
            return;*/
            results.theinstruction.calendrier.push({c_debut:moment(doc.du,"DD-MM-YYYY"), c_fin:moment(doc.au,"DD-MM-YYYY"), c_heure: doc.h, c_commentaire:doc.com_name});
          
            results.theinstruction.save(function (err) {
          if (err) { next(err); }
              
          res.send({type_of_response: 'success',mee_list:results.theinstruction.calendrier});
              return;
        });
        
      });
      } else{
        res.send({type_of_response: 'echec'}); 
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
          Instruction.findOne({dossier:req.params.id,juridiction:req.params.id_ins})
            .sort({i_update: -1})
            .exec(callback);
      },  
    }, function (err, results) {
      if (err) { return next(err); }
      if (results.theinstruction){
        req.body.forEach(function (doc) {
            
            results.theinstruction.diligence.push({d_debut:moment(doc.du,"DD-MM-YYYY"), d_fin:moment(doc.au,"DD-MM-YYYY"), d_heure: doc.h, d_commentaire:doc.com_name});
          
            results.theinstruction.save(function (err) {
          if (err) {return next(err); }
              
            res.send({type_of_response: 'success',dil_list:results.theinstruction.diligence}); 
            return;
        });
      });
      } else{
        res.send({type_of_response: 'echec'}); 
        return;
      }
      
      
    });
    }
];


exports.mise_en_etat_get = function (req, res,next){
  
  async.parallel({
    instruction: function (callback) {
      Instruction.findById(req.params.id_ins)
        .exec(callback);
    },
    
  }, function (err, results) {
    if (err) {
      return next(err);
    }
    if (results.instruction == null){
      res.send({type_of_response:'echec'})
    } else {
      res.send({type_of_response:'success',mee_list: results.instruction.calendrier });
    }
    
  });
  
};

exports.diligence_get = function (req, res,next){
  
  async.parallel({
    instruction: function (callback) {
      Instruction.findById(req.params.id_ins)
        .exec(callback);
    },
    
  }, function (err, results) {
    if (err) {
      return next(err);
    }
    if (results.instruction == null){
      res.send({type_of_response:'echec'})
    } else {
      res.send({type_of_response:'success',dil_list: results.instruction.diligence });
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
      
      if (err) { return next(err); }
      if (results.theinstruction){
        if(results.theinstruction.decision && results.theinstruction.decision != 'undefined' && results.theinstruction.decision != ''){
          
        }else{
          
        }
        
        results.theinstruction.decision = req.body.decision;
        results.theinstruction.save(function (err) {
          if (err) { return next(err); }
              
          res.send({type_of_response: 'success', decision:req.body.decision}); 
          return;
        });
      } else{
        res.send({type_of_response: 'echec'}); 
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
          Instruction.findOne({dossier:req.params.id,_id:req.params.id_ins})
            .sort({i_update: -1})
            .exec(callback);
      },  
    }, function (err, results) {
      
      if (err) { return next(err); }
      if (results.theinstruction){
        
        results.theinstruction.decision = req.body.decision;
        results.theinstruction.save(function (err) {
          if (err) { return next(err); }
              
          res.send({type_of_response: 'success', decision:req.body.decision}); 
          return;
        });
      } else{
        res.send({type_of_response: 'echec'}); 
        return;
      }
      
    });
    }
];
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
                    al_msg : 'L\'instruction a été créée avec succès ...'
                  })
        })
      } else{ // on a pas de juridiction valide
        res.send({type_of_response: 'success',creation: false,
                    al_title: 'Changement de Juridiction!',
                    al_msg : 'Veuillez choisir une juridiction valide!'
                  })
      }
    } else{ // Il s'agit d'une instruction à modifier : on vérifie si il n'y pas eu de renvois ou de décision
      // Ou d'un changement de degré
      
      Instruction.findById(req.body.instruction)
                  .select({ "_id": 1, "renvois": 1, "decision": 1})
                  .populate('juridiction')
                  .exec(function(err, the_instruction){
        if (err) return next(err);
        //console.log(the_instruction);
        if(the_instruction.juridiction.division != req.body.division){ // il s'agit d'un changement de degré d'instruction
          // on empêche de revenir à une juridiction inférieure
          if( (the_instruction.juridiction.division == 'instance' && (req.body.division == 'appel' || req.body.division == 'cour')) || (the_instruction.juridiction.division == 'appel' && req.body.division == 'cour') ){
            
            // on vérifie si l'ancienne instruction est cloturée par une décision rendue
            if(((!the_instruction.decision) && (the_instruction.renvois && the_instruction.renvois.length == 0)) || the_instruction.decision){
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
            }
            else{ // Pas de décision : message d'erreur nécessite la clôture de l'ancien dossier
              
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

exports.get_dossier_dil = function(req, res, next){
  
  async.parallel({
    
    dil_dossiers: function(callback){
      Instruction.find({}, {'diligence':{'$slice':-1},'_id':1,'decision':1, 'dossier':1, 'juridiction':1})
          .populate({ path: 'dossier', model: 'Dossier', populate: { path: 'pour contre utilisateur'} })
          .populate('juridiction') 
          .exec(callback);
    },
    }, function (err, results) {
      if (err) { return next(err); }
     
      var dossiers_dills = [];
      results.dil_dossiers.forEach(function(dil_dossier){
        if(dil_dossier.diligence.length > 0 && moment().diff(moment(dil_dossier.diligence[0].d_fin), 'days') > 0){
          if(!dil_dossier.decision || dil_dossier.decision == ""){
            dossiers_dills.push(dil_dossier);
          }
        }
      });
      
      res.render('dossiers/dilligence', { title:'dossiers à dilligences', list_dossiers: dossiers_dills});
      
  });
};

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
        if(renvois_rg.renvois.length > 0 && renvois_rg.renvois[0].r_type == 'renvoi au role general' && renvois_rg.decision == null){
          //console.log(renvois_rg);
          renvoi_role_general.push(renvois_rg)
        }
      });
      //console.log(renvoi_role_general)
      
      res.render('dossiers/dossier_tri_instruction', { title:'renvois au rôle général', list_dossiers: renvoi_role_general});
      
  });
};

exports.get_renvoi_general = function(req, res, next){
  async.parallel({
    
    renvois_rgs: function(callback){
      Instruction.find({}, {'renvois':{'$slice':-1},'_id':1,'decision':1, 'dossier':1, 'juridiction':1, 'calendrier':1})
          .populate({ path: 'dossier', model: 'Dossier', populate: { path: 'pour contre'} })
          .populate('juridiction')
          .exec(callback);
    },
    }, function (err, results) {
      if (err) { return next(err); }
      var renvoi_general = [];
      results.renvois_rgs.forEach(function(renvois_rg){
        if(renvois_rg.renvois.length > 0 && renvois_rg.renvois[0].r_type == 'nos conclusions' && renvois_rg.calendrier.length > 0 && renvois_rg.calendrier[0].c_conclusion == 'nous' && renvois_rg.decision == null ){
          renvoi_general.push(renvois_rg) 
        }
      });
     // console.log(renvoi_general)
      
      res.render('dossiers/dossier_tri_instruction', { title:'conclusions à prendre', list_dossiers: renvoi_general});
      
  });
};

exports.get_decision_a_lever = function(req, res, next){
  async.parallel({
    
    decision_uploads : function(callback){
      Instruction.find({}, {'decision':1, '_id':1, 'dossier':1, 'juridiction':1, 'deliberer_file':{'$slice':-1}})
          .populate({ path: 'dossier', model: 'Dossier', populate: { path: 'pour contre'} })
          .populate('juridiction')
          .exec(callback);
    },
    }, function (err, results) {
      if (err) { return next(err); }
      var no_upload = [];
      //console.log( results.decision_uploads)
      results.decision_uploads.forEach(function(decision_upload){
        if(decision_upload.decision != null && decision_upload.decision_file == null){
          no_upload.push(decision_upload)
        }
      });
      //console.log(no_upload)
      
      res.render('dossiers/dossier_tri_instruction', { title:'décision à prendre', list_dossiers: no_upload});
      
  });
};

exports.save_decision_file = [
  
  /*[ { fieldname: 'decision_file',
    originalname: 'api_new.pdf',
    encoding: '7bit',
    mimetype: 'application/pdf',
    destination: 'C:\\Users\\agarb\\AppData\\Local\\Temp',
    filename: 'f67c681a8510e0e4efb46b972f354453',
    path: 'C:\\Users\\agarb\\AppData\\Local\\Temp\\f67c681a8510e0e4efb46b972f354453',
    size: 132618 } ]*/
  async (req, res, next) => { 
        
    
    
    // Is there any file?
    if(!(req.files && (req.files[0].fieldname == 'decision_file'))) return next(new Error('No decision_file to upload'));
    //console.log('No error! File is processing ... ')
    
    //console.log('Saving file process ... !!!!! START ...')
    //return;
    // Upload to Cloudinary
  try {
    var result = await cloudinary.v2.uploader.upload(req.files[0].path, {folder:'decisions/id_cabinet/id_dossier'}); // rajouter la var nom du cabinet
    //console.log(result.secure_url.toString());
    Instruction.findByIdAndUpdate(req.params.id, {decision_file: result.secure_url.toString()}, (err) => {
        if(err) return next(err);
        
        res.send(result);
    });
  } catch(error) {
    //console.log(error)
    return next(new Error('Failed to upload decision_file'));
  }
}
];
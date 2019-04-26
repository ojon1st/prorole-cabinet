var Pour = require('../models/pour');
var Contre = require('../models/contre');
var Dossier = require('../models/dossier');
var Instruction = require('../models/instruction');
var Juridiction = require('../models/juridiction');
var Utilisateur = require('../models/utilisateur');

var async = require('async');
var moment = require('moment');


const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// L'index de la page des parties doit regrouper dans un tab la liste de tous nos clients puis la liste de tous nos adversaires
exports.index = function(req, res, next){res.redirect('/audiencier')};

// Affichier l'audiencier de l'utilisateur
exports.audiencier_get = function(req, res, next) {
  res.render('agenda/audiencier', { title: 'Audiencier'});
};


exports.renvois_events_get = function(req, res, next){
  
  async.parallel({
    instructions: function (callback) {
        Instruction.find({}, 'dossier juridiction renvois')
          .populate({ path: 'dossier', model: 'Dossier', populate: { path: 'pour contre'} })
          .populate('juridiction')
          .exec(callback);
      },
    last_renvois: function(callback){
      Instruction.find({}, {'renvois':{'$slice':-1},'_id':1,decision:1})
          .exec(callback);
    }
    }, async function (err, results) {
      if (err) { return next(err); }
      if (results.instructions == null) { // No results.
        // gestion erreur
        var err = new Error('Aucune instruction');
        err.status = 404;
        return next(err);
      }
      var events_retards = [];
      results.last_renvois.forEach(function(last_renvoi){
        //console.log(last_renvoi);
        if(last_renvoi.renvois.length > 0 && moment().diff(moment(last_renvoi.renvois[0].r_date), 'days') > 0){
          if( !last_renvoi.decision || last_renvoi.decision == ""){
            
            events_retards.push(last_renvoi.renvois[0]._id.toString())
          }
        }
      });
      
      var events_doc = [];
      var juridictions_date_array = [];
      results.instructions.forEach(function(instruction){ // Pour chaque instruction
        //console.log(instruction)
        if (instruction.renvois.length > 0){ // Si renvoi il y a
          var nom_de_classe_tribunal = '';
          var nom_de_classe_affaire = '';
          instruction.renvois.forEach(function(renvoi){ // pour chaque renvoi
            
          if(events_retards.includes(renvoi._id.toString())){
            nom_de_classe_tribunal = 'text-upper-retard';
            nom_de_classe_affaire = 'event-bg-affaire-retard';
            //console.log('ok');
          } else{
            nom_de_classe_tribunal = 'text-upper';
            nom_de_classe_affaire = 'event-bg-affaire';
          }
          if (!juridictions_date_array.includes(instruction.juridiction._id.toString()+ '_' +moment(renvoi.r_date).format('YYYY-MM-DD'))){ //on vérifie si la juridiction fait partie tu tableau des juridictions avant de l'ajouter comme nex event
            var new_tribunal = { // On crée l'event Tribunal
              title: instruction.juridiction.nom,
              start: moment(renvoi.r_date).format('YYYY-MM-DD'),
              viewableIn: ["basicWeek", "basicDay", "month"],
              tribunalId: instruction.juridiction._id.toString(),
              eventId:renvoi._id.toString(),
              className: nom_de_classe_tribunal
            }
            events_doc.push(new_tribunal); // On ajoute l'event Tribunal
            juridictions_date_array.push(instruction.juridiction._id.toString()+ '_' +moment(renvoi.r_date).format('YYYY-MM-DD')) // on ajoute le tribunal aux juridictions existantes
          }
          
          var label_pour = '';
          var label_contre = '';
            if (instruction.dossier.pour.p_type == 'pp'){
              label_pour = instruction.dossier.pour.pp.p_prenom+ ' ' +instruction.dossier.pour.pp.p_nom;
            } else if (instruction.dossier.pour.p_type == 'pm'){
              label_pour = instruction.dossier.pour.pm.p_denomination;
            }
            if (instruction.dossier.contre.c_type == 'pp'){
              label_contre = instruction.dossier.contre.pp.c_prenom + ' '+instruction.dossier.contre.pp.c_nom;
            } else if (instruction.dossier.contre.c_type == 'pm'){
              label_contre = instruction.dossier.contre.pm.c_denomination;
            }
          var new_affaire_hid = { // On ajoute l'event Affaire | Version desktop
            title: label_pour + ' /c ' + label_contre,
            start: moment(renvoi.r_date).format('YYYY-MM-DD'),
            viewableIn: ["basicDay"],
            url: '/dossiers/dossier/'+instruction.dossier._id.toString(),
            tribunalId: instruction.juridiction._id.toString(),
            eventId:renvoi._id.toString(),
            className: [ 'hidden-xs', nom_de_classe_affaire]
          }

          var new_affaire_vis = { // On ajoute l'event Affaire | version mobile
            title: label_pour + ' /c ' + label_contre,
            start: moment(renvoi.r_date).format('YYYY-MM-DD'),
            end:  moment(renvoi.r_date).format('YYYY-MM-DD'),
            content: renvoi.r_motif,
            viewableIn: ["basicDay"],
            tribunalId: instruction.juridiction._id.toString(),
            eventId:renvoi._id.toString(),
            className: [ 'visible-xs', 'show-calendar', nom_de_classe_affaire],
            content: renvoi.r_motif
          }
          //events_doc.push(new_tribunal);
          events_doc.push(new_affaire_hid,new_affaire_vis);
        });
        }
        
      });
      //console.log(events_doc)
      res.send({events_doc:events_doc});
  });
};

// Affichier l'audiencier de l'utilisateur
exports.tableau_diligences_get = function(req, res, next) {
  res.render('agenda/diligences', { title: 'Agenda des diligences'});
};


exports.tableau_diligences_events_get = function(req, res, next){
  
  async.parallel({
    instructions: function (callback) {
        Instruction.find({}, 'dossier juridiction diligence')
          .populate({ path: 'dossier', model: 'Dossier', populate: { path: 'pour contre'} })
          .populate('juridiction')
          .exec(callback);
      },
    }, function (err, results) {
      if (err) { return next(err); }
      if (results.instructions == null) { // No results.
        // gestion erreur
        var err = new Error('Aucune instruction');
        err.status = 404;
        return next(err);
      }
    
      var events_doc = [];
      var juridictions_date_array = [];
      results.instructions.forEach(function(instruction){ // Pour chaque instruction
        //console.log(instruction)
        if (instruction.diligence && instruction.diligence.length > 0){ // Si renvoi il y a
          instruction.diligence.forEach(function(diligence){ // pour chaque diligence
          if (!juridictions_date_array.includes(instruction.juridiction._id.toString()+ '_' +moment(diligence.d_fin).format('YYYY-MM-DD'))){ //on vérifie si la juridiction fait partie tu tableau des juridictions avant de l'ajouter comme next event
            var new_tribunal = { // On crée l'event Tribunal
              title: instruction.juridiction.nom,
              start: moment(diligence.d_fin).format('YYYY-MM-DD'),
              viewableIn: ["basicWeek", "basicDay", "month"],
              tribunalId: instruction.juridiction._id.toString(),
              className:'text-upper'
            }
            events_doc.push(new_tribunal); // On ajoute l'event Tribunal
            juridictions_date_array.push(instruction.juridiction._id.toString()+ '_' +moment(diligence.d_fin).format('YYYY-MM-DD')) // on ajoute le tribunal aux juridictions existantes
          }
          
          var label_pour = '';
          var label_contre = '';
            if (instruction.dossier.pour.p_type == 'pp'){
              label_pour = instruction.dossier.pour.pp.p_prenom+ ' ' +instruction.dossier.pour.pp.p_nom;
            } else if (instruction.dossier.pour.p_type == 'pm'){
              label_pour = instruction.dossier.pour.pm.p_denomination;
            }
            if (instruction.dossier.contre.c_type == 'pp'){
              label_contre = instruction.dossier.contre.pp.c_prenom + ' '+instruction.dossier.contre.pp.c_nom;
            } else if (instruction.dossier.contre.c_type == 'pm'){
              label_contre = instruction.dossier.contre.pm.c_denomination;
            }
          var new_affaire = { // On ajoute l'event Affaire
            title: label_pour + ' /c ' + label_contre + ' À ' + diligence.d_heure + ' pour objet : ' + diligence.d_commentaire,
            start: moment(diligence.d_fin).format('YYYY-MM-DD'),
            viewableIn: ["basicDay"],
            url: '/dossiers/dossier/'+instruction.dossier._id.toString(),
            tribunalId: instruction.juridiction._id.toString(),
            className: 'event-bg-affaire'
          }
          //events_doc.push(new_tribunal);
          events_doc.push(new_affaire);
        });
        }
        
      });
      
      res.send({events_doc:events_doc});
  });
};


exports.annuaire_get = function(req, res, next){
  
  async.parallel({
    pours: function (callback) {
        Pour.find({})
          .exec(callback);
      },
    contres: function(callback){
      Contre.find({})
          .exec(callback);
    },
    utilisateurs: function(callback){
      Utilisateur.find({})
          .exec(callback);
    }
    
    }, async function (err, results) {
      if (err) { return next(err); }
    
    var carnet = [];
    
    results.pours.forEach(function(p){
      //console.log(p)
      if(p.p_type == 'pp'){
        carnet.push({"prenom_nom":p.pp.p_prenom + ' ' + p.pp.p_nom, "email":p.pp.pp_email, "tel":p.pp.pp_tel});
      }else if(p.p_type = 'pm'){
        carnet.push({"prenom_nom":p.pm.p_denomination, "email":p.pm.pm_email, "tel":p.pm.pm_tel});
      }
    });
    
    results.contres.forEach(function(c){
      if(c.c_type == 'pp'){
        carnet.push({"prenom_nom":c.pp.c_prenom + ' ' + c.pp.c_nom, "email":c.pp.cp_email, "tel":c.pp.cp_tel});
      }else if(c.c_type = 'pm'){
        carnet.push({"prenom_nom":c.pm.c_denomination, "email":c.pm.cm_email, "tel":c.pm.cm_tel});
      }
    });
    
    results.utilisateurs.forEach(function(u){
      //carnet.push(u);
    })
    
    console.log(carnet)
    res.render('agenda/annuaire',{carnet:carnet})
  })
};
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
        if(last_renvoi.renvois.length > 0 && moment().diff(moment(last_renvoi.renvois[0].r_date), 'days') > 0){
          if( !last_renvoi.decision || last_renvoi.decision == ""){
            events_retards.push(last_renvoi.renvois[0]._id.toString())
          }
        }
      });
      
      var events_doc = [];
      var juridictions_date_array = [];
      results.instructions.forEach(function(instruction){ // Pour chaque instruction
        if (instruction.renvois.length > 0){ // Si renvoi il y a
          var nom_de_classe_tribunal = '';
          var nom_de_classe_affaire = '';
          instruction.renvois.forEach(function(renvoi){ // pour chaque renvoi
            
          if(events_retards.includes(renvoi._id.toString())){
            nom_de_classe_tribunal = 'text-upper-retard';
            nom_de_classe_affaire = 'event-bg-affaire-retard';
          } else{
            nom_de_classe_tribunal = 'text-upper';
            nom_de_classe_affaire = 'event-bg-affaire';
          }
          if (!juridictions_date_array.includes(instruction.dossier.nature+'_'+instruction.juridiction._id.toString()+ '_' +moment(renvoi.r_date).format('YYYY-MM-DD'))){ //on vérifie si la juridiction fait partie tu tableau des juridictions avant de l'ajouter comme nex event
            var new_tribunal = { // On crée l'event Tribunal
              title: instruction.juridiction.nom + " - " + instruction.dossier.nature,
              start: moment(renvoi.r_date).format('YYYY-MM-DD'),
              viewableIn: ["basicWeek", "basicDay", "month"],
              tribunalId: instruction.juridiction._id.toString(),
              eventId:renvoi._id.toString(),
              className: nom_de_classe_tribunal
            }
            events_doc.push(new_tribunal); // On ajoute l'event Tribunal
            juridictions_date_array.push(instruction.dossier.nature+'_'+instruction.juridiction._id.toString()+ '_' +moment(renvoi.r_date).format('YYYY-MM-DD')) // on ajoute le tribunal aux juridictions existantes
          }
          
          var label_pour = instruction.dossier.pour.p_nom;
          var label_contre = instruction.dossier.contre.c_nom;
          var new_affaire = { // On ajoute l'event Affaire
            title: label_pour + ' c/ ' + label_contre + ' pour : ' + renvoi.r_motif,
            start: moment(renvoi.r_date).format('YYYY-MM-DD'),
            viewableIn: ["basicDay"],
            url: '/dossiers/dossier/'+instruction.dossier._id.toString(),
            tribunalId: instruction.juridiction._id.toString(),
            eventId:renvoi._id.toString(),
            className: nom_de_classe_affaire
          }
          events_doc.push(new_affaire);
        });
        }
        
      });
      console.log(res.locals.others);
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
      if(p.p_tel != '' || p.p_email != ''){
        carnet.push({"prenom_nom":p.p_nom, "email":p.p_email, "tel":p.p_tel});
      }
    });
    
    results.contres.forEach(function(c){
      if(c.c_tel != '' || c.c_email != ''){
        carnet.push({"prenom_nom":c.c_nom, "email":c.c_email, "tel":c.c_tel});
      }
    });
    
    // results.utilisateurs.forEach(function(u){
    //   carnet.push({"prenom_nom":u.prenom + ' ' + u.nom, "email":u.email, "tel":u.telephone});
    // })
    
    res.render('agenda/annuaire',{carnet:carnet})
  })
};
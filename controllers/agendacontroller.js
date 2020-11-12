var Pour = require('../models/pour');
var Contre = require('../models/contre');
var Dossier = require('../models/dossier');
var Instruction = require('../models/instruction');
var Juridiction = require('../models/juridiction');

var async = require('async');
var moment = require('moment');


const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

// Vue Agenga
exports.audiencier_get = function(req, res, next) {
  res.render('agenda/audiencier', { title: 'Audiencier'});
};

// Recuperation de donnees de l'agenda
exports.renvois_events_get = function(req, res, next){
  async.parallel({
    instructions: function (callback) {
      Instruction.find({}, 'dossier juridiction renvois calendrier')
        .populate({ path: 'dossier', model: 'Dossier', populate: { path: 'pour contre'} })
        .populate('juridiction')
        .exec(callback);
    },
    last_renvois: function(callback){
      Instruction.find({}, {'renvois':{'$slice':-1},'_id':1})
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
        if(last_renvoi.renvois.length > 0 && moment().diff(moment(last_renvoi.renvois[0].r_date), 'days') > 0 && last_renvoi.renvois[0].r_type !="delibere vide" && last_renvoi.decision == null){
          events_retards.push(last_renvoi.renvois[0]._id.toString());
        }
      });
      
      var events_doc = [];
      var juridictions_date_array = [];
      results.instructions.forEach(function(instruction){ // Pour chaque instruction
        var nom_de_classe_tribunal = nom_de_classe_renvoi = nom_de_classe_calendrier = '';
        if(instruction.dossier.nature && instruction.dossier.nature == 'Difficultés d\'exécution'){
          instruction.dossier.nature = 'Référé';
        }
        if (instruction.renvois.length > 0){ // Si renvoi il y a
          instruction.renvois.forEach(function(renvoi){ // pour chaque renvoi
            if(events_retards.includes(renvoi._id.toString())){
              nom_de_classe_tribunal = 'text-upper-retard';
              nom_de_classe_renvoi = 'event-bg-renvoi-retard';
            } else{
              nom_de_classe_tribunal = 'text-upper';
              nom_de_classe_renvoi = 'event-bg-renvoi';
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
            var new_renvoi = { // On ajoute l'event renvoi
              title: 'Renvoi - ' + label_pour + ' c/ ' + label_contre + ' : ' + renvoi.r_motif,
              start: moment(renvoi.r_date).format('YYYY-MM-DD'),
              viewableIn: ["basicDay"],
              url: '/dossiers/dossier/'+instruction.dossier._id.toString(),
              tribunalId: instruction.juridiction._id.toString(),
              eventId:renvoi._id.toString(),
              className: nom_de_classe_renvoi
            }
            events_doc.push(new_renvoi);
          });
        }
        if (instruction.calendrier.length > 0){ // Si calendrier il y a
          instruction.calendrier.forEach(function(calendrier){ // pour chaque calendrier
            nom_de_classe_tribunal = 'text-upper';
            nom_de_classe_calendrier = 'event-bg-calendrier';
            if (!juridictions_date_array.includes(instruction.dossier.nature+'_'+instruction.juridiction._id.toString()+ '_' +moment(calendrier.c_fin).format('YYYY-MM-DD'))){ //on vérifie si la juridiction fait partie tu tableau des juridictions avant de l'ajouter comme nex event
              let appel = (instruction.juridiction.division == 'appel'? 'Cour d\'appel de ': '');
              var new_tribunal = { // On crée l'event Tribunal
                title: appel  + "" +  instruction.juridiction.nom + " - " + instruction.dossier.nature,
                start: moment(calendrier.c_fin).format('YYYY-MM-DD'),
                viewableIn: ["basicWeek", "basicDay", "month"],
                tribunalId: instruction.juridiction._id.toString(),
                eventId:calendrier._id.toString(),
                className: nom_de_classe_tribunal
              }
              events_doc.push(new_tribunal); // On ajoute l'event Tribunal
              juridictions_date_array.push(instruction.dossier.nature+'_'+instruction.juridiction._id.toString()+ '_' +moment(calendrier.c_fin).format('YYYY-MM-DD')) // on ajoute le tribunal aux juridictions existantes
            }
            
            var label_pour = instruction.dossier.pour.p_nom;
            var label_contre = instruction.dossier.contre.c_nom;
            var new_calendrier = { // On ajoute l'event mise a l'etat
              title: 'MEE - ' + label_pour + ' c/ ' + label_contre + ' : ' + calendrier.c_commentaire,
              start: moment(calendrier.c_fin).format('YYYY-MM-DD'),
              viewableIn: ["basicDay"],
              url: '/dossiers/dossier/'+instruction.dossier._id.toString(),
              tribunalId: instruction.juridiction._id.toString(),
              eventId:calendrier._id.toString(),
              className: nom_de_classe_calendrier
            }
            events_doc.push(new_calendrier);
          });
        }
         
      });
      res.send({events_doc:events_doc});
  });
};

// Recuperations de parties contenant un email ou telephone
exports.annuaire_get = function(req, res, next){
  
  async.parallel({
    pours: function (callback) {
        Pour.find({})
          .exec(callback);
      },
    contres: function(callback){
      Contre.find({})
          .exec(callback);
    }
    
    }, async function (err, results) {
      if (err) { return next(err); }
    var carnet = [];
    results.pours.forEach(function(pour){
      if((pour.p_email && pour.p_email.trim() != '') || (pour.p_tel && pour.p_tel.trim() != '')){
        carnet.push({"prenom_nom":pour.p_nom, "email":pour.p_email, "tel":pour.p_tel});
      }
    });
    
    results.contres.forEach(function(contre){
      if((contre.c_email && contre.c_email.trim() != '') || (contre.c_tel && contre.c_tel.trim() != '')){
        carnet.push({"prenom_nom":contre.c_nom, "email":contre.c_email, "tel":contre.c_tel});
      }
    });
    res.render('agenda/annuaire',{carnet:carnet, title: 'Carnet d\'adresses'})
  })
};
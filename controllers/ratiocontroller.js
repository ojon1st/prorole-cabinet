var Dossier = require('../models/dossier');
var Pour = require('../models/pour');
var Contre = require('../models/contre');
var Juridiction = require('../models/juridiction');
var Instruction = require('../models/instruction');
var Utilisateur = require('../models/utilisateur');
var Profil = require('../models/profil');

//Show duration of dispute resolution
exports.indicateur = function(req, res, next) {
  res.render('ratios/indicateur', { title: 'Indicateur'});
};

/*// Show duration of dispute resolution
exports.time_to_resolve = function(req, res, next) {
  res.render('ratios/time_resolve', { title: 'Duree de resolution du litige'});
};

// Show likely duration of dispute resolution
exports.time_likely_to_resolve = function(req, res, next) {
  res.render('ratios/likely_time_resolve', { title: 'Duree probable de resolution du litige'});
};

// Show loss incurred
exports.loss_incurred = function(req, res, next) {
  res.render('ratios/loss', { title: 'Perte encourue'});
};

// Show possible gain
exports.possible_gain = function(req, res, next) {
  res.render('ratios/gain', { title: 'Gain possible'});
};*/
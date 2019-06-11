var Pour = require('../models/pour');
var Contre = require('../models/contre');

var async = require('async');


const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

//GET parties
exports.get_parties = function(req, res, next){
  async.parallel({
    clients: function (callback) {
      Pour.find().exec(callback);
    },
    adverses: function(callback){
      Contre.find().exec(callback);
    }
  }, async function (err, results) {
    if (err) { return next(err); }
    if (results.clients == null) { // No results.
      var err = new Error('Clients not found');
      err.status = 404;
      return next(err);
    }

    if (results.adverses == null) { // No results.
      var err = new Error('Adverses not found');
      err.status = 404;
      return next(err);
    }
    var tab_client = [];
    var tab_adverse = [];

    tab_client = results.clients;
    tab_adverse = results.adverses;
    res.send({tab_client:tab_client,tab_adverse:tab_adverse});
  });

};

// L'index de la page des parties doit regrouper dans un tab la liste de tous nos clients puis la liste de tous nos adversaires
exports.index = function(req, res, next){res.redirect('/')}; 
exports.partie_pour_create_get = function(req, res, next){res.redirect('/')};
exports.partie_pour_create_post = [(req, res, next) => {res.redirect('/')}];
exports.partie_pour_delete_get = function(req, res, next){res.redirect('/')};
exports.partie_pour_delete_post = [(req, res, next) => {res.redirect('/')}];
exports.partie_pour_update_get = function(req, res, next){res.redirect('/')};
exports.partie_pour_update_post = function(req, res, next){res.redirect('/')};
exports.partie_pour_detail = function(req, res, next){res.redirect('/')};
exports.partie_contre_create_get = function(req, res, next){res.redirect('/')};
exports.partie_contre_create_post = [(req, res, next) => {res.redirect('/')}];
exports.partie_contre_delete_get = function(req, res, next){res.redirect('/')};
exports.partie_contre_delete_post = [(req, res, next) => {res.redirect('/')}];
exports.partie_contre_update_get = function(req, res, next){res.redirect('/')};
exports.partie_contre_update_post = [(req, res, next) => {res.redirect('/')}];
exports.partie_contre_detail = function(req, res, next){res.redirect('/')};
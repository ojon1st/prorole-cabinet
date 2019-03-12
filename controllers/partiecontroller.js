var Pour = require('../models/pour');
var Contre = require('../models/contre');

var async = require('async');


const { body,validationResult } = require('express-validator/check');
const { sanitizeBody } = require('express-validator/filter');

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
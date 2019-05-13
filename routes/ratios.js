var express = require('express');
var router = express.Router();

// Require our controllers.
var ratio_controller = require('../controllers/ratiocontroller'); 

/// dossier ROUTES ///

// GET ratio home page.
router.get('/indicateur', ratio_controller.indicateur); 

/*// GET ratio - duration of dispute resolution page.
router.get('/time/time_resolve', ratio_controller.time_to_resolve); 

// GET ratio - likely duration of dispute resolution page.
router.get('/time/time_likely_resolve', ratio_controller.time_likely_to_resolve);

// GET ratio - loss incurred page.
router.get('/loss', ratio_controller.loss_incurred);

// GET ratio - possible gain page.
router.get('/gain', ratio_controller.possible_gain);*/



module.exports = router;
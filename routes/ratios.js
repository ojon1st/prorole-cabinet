var express = require('express');
var router = express.Router();

// Require our controllers.
var ratio_controller = require('../controllers/ratiocontroller'); 

/// dossier ROUTES ///

// GET ratio home page.
router.get('/indicateur', ratio_controller.indicateur); 

module.exports = router;
var Pour = require('../models/pour');
var Contre = require('../models/contre');
var express = require('express');
var router = express.Router();


// Require our controllers.
var partie_controller = require('../controllers/partiecontroller'); 

// REQUIRE OUR MODELS
var Pour = require('../models/pour');
var Contre = require('../models/contre');

router.post('/pour/update', [
    function(req, res, next) {
      if (('_id' in req.body) && req.body._id != ''){
        Pour.findById(req.body._id).exec(function(err, pour) {
          if(err) {
            console.log(err);
            return res.end();
          }
          req.client = pour;
          return next();
        });
      }
    },
    ...partie_controller.pour_update
]);

/// partie CONTRE ROUTES ///
router.post('/contre/update', [
    function(req, res, next) {
      if (('_id' in req.body) && req.body._id != ''){
        Contre.findById(req.body._id).exec(function(err, contre) {
          if(err) {
            console.log(err);
            return res.end();
          }
          req.contre = contre;
          return next();
        });
      }
    },
    ...partie_controller.contre_update
]);

module.exports = router;
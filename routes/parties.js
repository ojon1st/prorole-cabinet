var express = require('express');
var router = express.Router();


// Require our controllers.
var partie_controller = require('../controllers/partiecontroller'); 

// GET partie home page.
router.get('/', partie_controller.index); 

/// partie POUR ROUTES ///

// GET request for creating a partie. NOTE This must come before routes that display partie (uses id).
router.get('/partie/pour/create', partie_controller.partie_pour_create_get);

// POST request for creating partie.
router.post('/partie/pour/create', partie_controller.partie_pour_create_post);

// GET request to delete partie.
router.get('/partie/pour/:id/delete', partie_controller.partie_pour_delete_get);

// POST request to delete partie.
router.post('/partie/pour/:id/delete', partie_controller.partie_pour_delete_post);

// GET request to update partie.
router.get('/partie/pour/:id/update', partie_controller.partie_pour_update_get);

// POST request to update partie.
router.post('/partie/pour/:id/update', partie_controller.partie_pour_update_post);

// GET request for one partie.
router.get('/partie/pour/:id', partie_controller.partie_pour_detail);

// GET request for list of all partie.
//router.get('/parties', partie_controller.partie_list); //on peut afficher la liste des pour dans l'index combiné à la liste des contres

/// partie CONTRE ROUTES ///
  
// GET request for creating a partie. NOTE This must come before routes that display partie (uses id).
router.get('/partie/contre/create', partie_controller.partie_contre_create_get);

// POST request for creating partie.
router.post('/partie/contre/create', partie_controller.partie_contre_create_post);

// GET request to delete partie.
router.get('/partie/contre/:id/delete', partie_controller.partie_contre_delete_get);

// POST request to delete partie.
router.post('/partie/contre/:id/delete', partie_controller.partie_contre_delete_post);

// GET request to update partie.
router.get('/partie/contre/:id/update', partie_controller.partie_contre_update_get);

// POST request to update partie.
router.post('/partie/contre/:id/update', partie_controller.partie_contre_update_post);

// GET request for one partie.
router.get('/partie/contre/:id', partie_controller.partie_contre_detail);

module.exports = router;
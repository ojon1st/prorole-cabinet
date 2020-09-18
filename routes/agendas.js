var express = require('express');
var router = express.Router();

var agenda_controller = require('../controllers/agendacontroller');

/// GESTIONNAIRE ROUTES ///

router.get('/audiencier', agenda_controller.audiencier_get);

router.get('/audiencier/get_events', agenda_controller.renvois_events_get);

router.get('/carnet_adresses', agenda_controller.annuaire_get);

// POST request for creating dossier.
//router.post('/dossier/create', g_controller.dossier_create_post);

// GET request to delete dossier.
//router.get('/dossier/:id/delete', g_controller.dossier_delete_get);

// POST request to delete dossier.
//router.post('/dossier/:id/delete', g_controller.dossier_delete_post);

// GET request to update dossier.
//router.get('/dossier/:id/update', g_controller.dossier_update_get);

// POST request to update dossier.
//router.post('/dossier/:id/update', g_controller.dossier_update_post);

// GET request for one dossier.
//router.get('/dossier/:id', g_controller.dossier_detail);

// GET request for list of all dossier.
//router.get('/dossiers', g_controller.dossier_list);

module.exports = router;

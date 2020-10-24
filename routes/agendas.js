var express = require('express');
var router = express.Router();

var agenda_controller = require('../controllers/agendacontroller');

/// GESTIONNAIRE ROUTES ///

router.get('/audiencier', agenda_controller.audiencier_get);

router.get('/audiencier/get_events', agenda_controller.renvois_events_get);

module.exports = router;

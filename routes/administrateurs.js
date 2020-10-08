var express = require('express');
var path = require('path');
var upload = require(path.join(__dirname, '/../middles/upload'));
var router = express.Router();

var admin_controller = require('../controllers/admincontroller');

/// GESTIONNAIRE ROUTES ///

// GET catalog home page.
router.get('/', admin_controller.index);

router.get('/configuration_du_cabinet', admin_controller.configuration_du_cabinet);

router.post('/configuration_du_cabinet/',  admin_controller.configuration_du_cabinet_update);


module.exports = router;
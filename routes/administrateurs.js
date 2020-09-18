var express = require('express');
var path = require('path');
var upload = require(path.join(__dirname, '/../middles/upload'));
var router = express.Router();

var admin_controller = require('../controllers/admincontroller');

/// GESTIONNAIRE ROUTES ///

// GET catalog home page.
router.get('/', admin_controller.index); 

router.post('/utilisateurs/utilisateur_create', admin_controller.utilisateur_create);

router.get('/page_utilisateur/:id', admin_controller.utilisateur_page_get);

// Modifier les informations de l'utilisateur
router.post('/utilisateur/utilisateur_update/:id', admin_controller.update_utilisateur_post);

router.get('/configuration_du_cabinet', admin_controller.configuration_du_cabinet);

router.get('/configuration_du_cabinet/page_de_modification', admin_controller.modification_configuration_du_cabinet_get);

router.post('/configuration_du_cabinet/page_de_modification/:id_cabinet', admin_controller.modification_configuration_du_cabinet_post);


module.exports = router;
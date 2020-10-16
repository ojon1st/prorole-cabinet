var express = require('express');
var router = express.Router();
var path = require('path');

// Require our controllers.
var dossier_controller = require('../controllers/dossiercontroller'); 
var instruction_controller = require('../controllers/instructioncontroller');

/// dossier ROUTES ///

// GET catalog home page.
router.get('/', dossier_controller.dossier_list);  

// GET request for creating a dossier. NOTE This must come before routes that display dossier (uses id).
router.get('/dossier/create', dossier_controller.dossier_create_get);

// POST request for creating dossier.
router.post('/dossier/create', dossier_controller.dossier_create_post);

// POST request to update dossier.
router.post('/dossier/:id/update', dossier_controller.dossier_update_post);

// GET request for one dossier (DOSSIER DETAILS).
router.get('/dossier/:id', dossier_controller.dossier_detail);

// Rechercher la reference physique du dossier
router.get('/dossier/is_ref_d_p/:ref', dossier_controller.found_client_get);

/// Instructions ROUTES ///

// Créer une nouvelle instruction
router.post('/dossier/:id/instruction/create', instruction_controller.instruction_create_post); 

// Créer un nouveau renvoi du dossier
router.post('/dossier/:id/instruction/renvoi/create', instruction_controller.renvoi_create_post);

// Créer un calendrier de mise en état
router.post('/dossier/:id/instruction/:id_ins/:juridiction/mise_en_etat/add', instruction_controller.mise_en_etat_create_post);

//Afficher un calendrier de mise en état
router.post('/dossier/:id/instruction/:id_ins/mise_en_etat/get', instruction_controller.mise_en_etat_get);

// Recuperation de dossiers avec defaut de renvoi
router.get('/manques', instruction_controller.get_manques)

// Recuperation de dossiers renvoyes au role general
router.get('/role_general', instruction_controller.get_renvoi_role_general)

// Recuperation de dossiers dont le type renvoi est nos conclusion ou la conclusion dans le calendrier est nous
router.get('/conclusion_a_prendre', instruction_controller.get_renvoi_general)

// Recuperation de dossiers dont la decision n'est pas telechargee
router.get('/decision_a_lever', instruction_controller.get_decision_a_lever)

// Vérifier la décision
router.post('/dossier/:id/instruction/:id_instruction/is_decision', instruction_controller.is_decision)

// Sauvegarger la décision
router.post('/dossier/:id/instruction/:id_ins/decision/save', instruction_controller.decision_save)

module.exports = router;
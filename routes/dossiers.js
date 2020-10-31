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

// GET request for check ref physique
router.get('/dossier/is_ref_d_p/:ref', dossier_controller.remove_duplicate_ref)

// POST request to update dossier.
router.post('/dossier/:id/update', dossier_controller.dossier_update_post);

// GET request for one dossier (DOSSIER DETAILS).
router.get('/dossier/:id', dossier_controller.dossier_detail);

/// Instructions ROUTES ///

// Créer une nouvelle instruction
router.post('/dossier/:id/instruction/create', instruction_controller.instruction_create_post); 

// Créer un nouveau renvoi du dossier
router.post('/dossier/:id/instruction/renvoi/create', instruction_controller.renvoi_create_post);

// Créer un calendrier de mise en état
router.post('/dossier/:id/instruction/:id_ins/:juridiction/mise_en_etat/add', instruction_controller.mise_en_etat_create_post);

//Afficher un calendrier de mise en état
router.post('/dossier/:id/instruction/:id_ins/mise_en_etat/get', instruction_controller.mise_en_etat_get);

// Sauvegarger la décision
router.post('/dossier/:id/instruction/:id_ins/decision/save', instruction_controller.decision_save);

// Recuperation de dossiers avec defaut de renvoi
router.get('/manques', instruction_controller.get_manques);

// Recuperation de dossiers renvoyes au role general
router.get('/role_general', instruction_controller.get_renvoi_role_general);

// Recuperation de dossiers dont le type renvoi est nos conclusion ou la conclusion dans le calendrier est nous
router.get('/conclusion_a_prendre', instruction_controller.conclusion_prendre);

// supprimer un operation de conclusion a prendre
router.get('/instruction/:id/conclusion/:id_conclusion', instruction_controller.del_conclusion);

// Recuperation de dossiers dont la decision n'est pas telechargee
router.get('/decision_a_lever', instruction_controller.get_decision_a_lever);

// supprimer un operation de decision a lever
router.post('/instruction/:id/decision', instruction_controller.del_decision);

module.exports = router;
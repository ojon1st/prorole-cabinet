var express = require('express');
var router = express.Router();
var path = require('path');

// Require our controllers.
var dossier_controller = require('../controllers/dossiercontroller'); 
var instruction_controller = require('../controllers/instructioncontroller');
var upload = require(path.join(__dirname, '/../middles/upload'));

/// dossier ROUTES ///

// GET catalog home page.
router.get('/', dossier_controller.dossier_list);  

// GET request for creating a dossier. NOTE This must come before routes that display dossier (uses id).
router.get('/dossier/create', dossier_controller.dossier_create_get);

// POST request for creating dossier.
router.post('/dossier/create', dossier_controller.dossier_create_post);

// GET request to delete dossier.
//router.get('/dossier/:id/delete', dossier_controller.dossier_delete_get);

// POST request to delete dossier.
//router.post('/dossier/:id/delete', dossier_controller.dossier_delete_post);

// GET request to update dossier.
router.get('/dossier/:id/update', dossier_controller.dossier_update_get);

// POST request to update dossier.
router.post('/dossier/:id/update', dossier_controller.dossier_update_post); 

// POST request to update dossier instruction.
/*router.post('/dossier/:id/update_infos', dossier_controller.dossier_update_instruction_post);*/

// GET request for one dossier.
router.get('/dossier/:id', dossier_controller.dossier_detail);

// GET list of current dossiers
router.get('/en_cours', dossier_controller.dossiers_en_cours);

// GET list of current dossiers
router.get('/repartition', dossier_controller.repartition);

// Rechercher client pour tableau synoptique
router.get('/dossier/:id/found', dossier_controller.found_client_get); 

// Recuperation de dossiers sans date de renvoi
router.get('/manques', instruction_controller.get_manques)

// Recuperation de dossiers dont le type renvoi est role general
router.get('/role_general', instruction_controller.get_renvoi_role_general)

// SAVE DOCUMENTS RELATIVE TO DOSSIER
router.post('/dossier/:id/save_pieces/:type_piece',upload.any() , dossier_controller.save_pieces);

// DELETE DOCUMENTS RELATIVE TO DOSSIER
router.post('/dossier/:id/type_piece/:type_piece/delete_pieces/:id_piece', dossier_controller.delete_pieces);


/// Instructions ROUTES ///

// GET request for list of all dossier.
//router.get('/dossiers', dossier_controller.dossier_list);

// Créer une nouvelle instruction
router.post('/dossier/:id/instruction/create', instruction_controller.instruction_create_post); 

// Créer un nouveau renvoi du dossier
router.post('/dossier/:id/instruction/renvoi/create', instruction_controller.renvoi_create_post);

// Créer un calendrier de mise en état
router.post('/dossier/:id/instruction/:id_ins/:juridiction/mise_en_etat/add', instruction_controller.mise_en_etat_create_post);

// Créer un calendrier des diligences
router.post('/dossier/:id/instruction/:id_ins/:juridiction/diligence/add', instruction_controller.diligence_create_post);

//Afficher un calendrier de mise en état
router.post('/dossier/:id/instruction/:id_ins/mise_en_etat/get', instruction_controller.mise_en_etat_get);

//Afficher une nouvelle instruction
router.post('/dossier/:id/instruction/:id_ins/diligence/get', instruction_controller.diligence_get);

// Vérifier la décision
router.post('/dossier/:id/instruction/:id_instruction/is_decision', instruction_controller.is_decision)

// Sauvegarger la décision
router.post('/dossier/:id/instruction/:id_ins/decision/save', instruction_controller.decision_save)




module.exports = router;
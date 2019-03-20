var Dossier = require('../models/dossier');

var Counter = require('../models/counter');
var Pour = require('../models/pour');
var Contre = require('../models/contre');
var Juridiction = require('../models/juridiction');
var Instruction = require('../models/instruction');
var Utilisateur = require('../models/utilisateur');
var Profil = require('../models/profil');

var async = require('async');
var moment = require('moment');
const flash = require('express-flash-notification');
var cloudinary = require('cloudinary');

//const NotifySend = require('node-notifier').NotifySend;
//var notifier = new NotifySend();
cloudinary.config({ 
    cloud_name: 'prorole', 
    api_key: '675842782989895', 
    api_secret: 'Lc5kh5dKKKla8Brcci87Jf8BOL0' 
});

const {
  body,
  validationResult
} = require('express-validator/check');
const {
  sanitizeBody
} = require('express-validator/filter');

// L'index de la page des dossiers nous redirige vers la liste des dossiers
/*exports.index = function(req, res, next) {
  res.redirect('/dossiers');
};*/
// Display list of all Dossier.
exports.dossier_list = function (req, res, next) {

  // Get all dossier for form
  async.parallel({
    dossiers: function (callback) {
      Dossier.find()
        .populate('pour')
        .populate('contre')
        .populate('utilisateur')
        .sort({ _id: 1 })
        .exec(callback);
    },
    
  }, function (err, results) {
    if (err) {
      return next(err);
    }

    res.render('dossiers/dossier_list', {
      list_dossiers: results.dossiers
    });
  });

};

function cleanArray(array) {
  var i, j, len = array.length,
    out = [],
    obj = {};
  for (i = 0; i < len; i++) {
    obj[array[i]] = 0;
  }
  for (j in obj) {
    out.push(j);
  }
  return out;
}

// Display detail page for a specific Dossier.
exports.dossier_detail = function (req, res, next) {

  async.parallel({
    dossier: function (callback) {
      Dossier.findById(req.params.id)
        .populate('pour')
        .populate('contre')
        .populate('utilisateur')
        .exec(callback);
    },
    juridictions: function (callback) {
      Juridiction.find()
        .exec(callback);
    },
    utilisateurs:function (callback) {
      Utilisateur.find()
        .exec(callback);
    },
    last_instruction: function (callback){
      Instruction.findOne({dossier:req.params.id})
        .sort({i_update: -1})
        .exec(callback);
    },
  }, function (err, results) { 
    if (err) {
      return next(err);
    }
    if (results.dossier == null) { // No results.
      var err = new Error('Dossier not found');
      err.status = 404;
      return next(err);
    }
    
    // Successful, so render.
    res.render('dossiers/dossier_detail', {
      title: 'Gestionnaire de Dossier',
      dossier: results.dossier, juridictions: results.juridictions, instruction:results.last_instruction, utilisateurs:results.utilisateurs
    });
  });

};

// Display Dossier create form on GET.
exports.dossier_create_get = function (req, res, next) {
  
  async.parallel({
    utilisateurs: function (callback) {
      Utilisateur.find({})
        .populate('profil')
        .exec(callback);
    },
  }, function (err, results) {
    if (err) {
      return next(err);
    }
    if (results.utilisateurs == null) { // No results.
      var err = new Error('Utilisateurs not found');
      err.status = 404;
      return next(err);
    }
    
    // Successful, so render.
    res.render('dossiers/dossier_form', { title: 'Creation de Dossier', utilisateurs:results.utilisateurs });
  });
  
  
};

// Handle Dossier create on POST.
exports.dossier_create_post = [

  // Process request after validation and sanitization.
  (req, res, next) => {

    // Extract the validation errors from a request.
    const errors = validationResult(req);

    // Create a genre object with escaped and trimmed data.
    var dossier = new Dossier({
      titulaire: req.body.titulaire
    });
    
    // creation du pour
    var pour = new Pour({
      p_type: req.body.p_type
    });
    // creation du contre
    var contre = new Contre({
      c_type: req.body.c_type
    });

    switch (req.body.p_type) {
      case 'pp':
        // alimentation du pour personne physique

        pour.pp.p_prenom = req.body.p_prenom;
        pour.pp.p_nom = req.body.p_nom;
        pour.pp.p_profession = req.body.p_profession;
        pour.pp.p_nationalite = req.body.p_nationalite;
        pour.pp.p_dob = moment(req.body.p_dob, "DD-MM-YYYY");
        pour.pp.p_pob = req.body.p_pob;
        pour.pp.p_domicile = req.body.p_domicile;
        pour.pp.pp_tel = req.body.pp_tel.trim();
        pour.pp.pp_email = req.body.pp_email;
        if (Number(req.body.nb_other_client_pour) > 0) {
          for (i = 1; i <= Number(req.body.nb_other_client_pour); i++) {
            dossier.autres_pour.push({
              prenom_nom: req.body["autres_pour_" + i]
            });
          }
        };
        if (Number(req.body.nb_other_avocat_pour) > 0) {
          for (i = 1; i <= Number(req.body.nb_other_avocat_pour); i++) {
            dossier.autres_avocats_pour.push({
              prenom_nom: req.body["autres_avocats_pour_prenom_nom_" + i],
              tel: req.body["autres_avocats_pour_tel_" + i],
              email: req.body["autres_avocats_pour_email_" + i]
            });
          }
        };
        break;
      case 'pm':
        // alimentation du pour personne morale

        pour.pm.p_denomination = req.body.p_denomination;
        pour.pm.p_rs = req.body.p_rs;
        pour.pm.p_capital = req.body.p_capital.trim();
        pour.pm.p_devise = req.body.p_devise;
        pour.pm.p_siege = req.body.p_siege;
        pour.pm.p_rccm = req.body.p_rccm;
        pour.pm.p_nif = req.body.p_nif;
        pour.pm.p_representant = req.body.p_representant;
        pour.pm.pm_tel = req.body.pm_tel.trim();
        pour.pm.pm_email = req.body.pm_email;
        if (Number(req.body.nb_other_client_pour) > 0) {
          for (i = 1; i <= Number(req.body.nb_other_client_pour); i++) {
            dossier.autres_pour.push({
              rs: req.body["autres_pour_" + i]
            });
          }
        };
        if (Number(req.body.nb_other_avocat_pour) > 0) {
          for (i = 1; i <= Number(req.body.nb_other_avocat_pour); i++) {
            dossier.autres_avocats_pour.push({
              prenom_nom: req.body["autres_avocats_pour_prenom_nom_" + i],
              tel: req.body["autres_avocats_pour_tel_" + i],
              email: req.body["autres_avocats_pour_email_" + i]
            });
          }
        };
        break;
      default:
        // code block
    }
    switch (req.body.c_type) {
      case 'pp':

        contre.pp.c_prenom = req.body.c_prenom;
        contre.pp.c_nom = req.body.c_nom;
        contre.pp.c_profession = req.body.c_profession;
        contre.pp.c_nationalite = req.body.c_nationalite;
        contre.pp.c_dob = moment(req.body.c_dob, "DD-MM-YYYY");
        contre.pp.c_pob = req.body.c_pob;
        contre.pp.c_domicile = req.body.c_domicile;
        contre.pp.cp_tel = req.body.cp_tel.trim();
        contre.pp.cp_email = req.body.cp_email;
        if (Number(req.body.nb_other_client_contre) > 0) {
          for (i = 1; i <= Number(req.body.nb_other_client_contre); i++) {
            dossier.autres_contre.push({
              prenom_nom: req.body["autres_contre_" + i]
            });
          }
        };
        if (Number(req.body.nb_other_avocat_contre) > 0) {
          for (i = 1; i <= Number(req.body.nb_other_avocat_contre); i++) {
            dossier.autres_avocats_contre.push({
              prenom_nom: req.body["autres_avocats_contre_prenom_nom_" + i],
              tel: req.body["autres_avocats_contre_tel_" + i],
              email: req.body["autres_avocats_contre_email_" + i]
            });
          }
        };
        break;
      case 'pm':
        // creation du contre

        contre.pm.c_denomination = req.body.c_denomination;
        contre.pm.c_rs = req.body.c_rs;
        contre.pm.c_capital = req.body.c_capital.trim();
        contre.pm.c_devise = req.body.c_devise;
        contre.pm.c_siege = req.body.c_siege;
        contre.pm.c_rccm = req.body.c_rccm;
        contre.pm.c_nif = req.body.c_nif;
        contre.pm.c_representant = req.body.c_representant;
        contre.pm.cm_tel = req.body.cm_tel.trim();
        contre.pm.cm_email = req.body.cm_email;
        break;
        if (Number(req.body.nb_other_client_contre) > 0) {
          for (i = 1; i <= Number(req.body.nb_other_client_contre); i++) {
            dossier.autres_contre.push({
              rs: req.body["autres_contre_" + i]
            });
          }
        };
        if (Number(req.body.nb_other_avocat_contre) > 0) {
          for (i = 1; i <= Number(req.body.nb_other_avocat_contre); i++) {
            dossier.autres_avocats_contre.push({
              prenom_nom: req.body["autres_avocats_contre_prenom_nom_" + i],
              tel: req.body["autres_avocats_contre_tel_" + i],
              email: req.body["autres_avocats_contre_email_" + i]
            });
          }
        };
      default:
        // code block
    }

    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('dossiers/dossier_form', {
        title: 'Create Dossier',
        dossier: dossier,
        pour: pour,
        contre: contre,
        errors: errors.array()
      });
      return;
    } else {
      // Data from form is valid.
      // Check if Dossier with same name already exists.
      dossier.pour = pour;
      dossier.contre = contre;

      async.parallel([
        function (callback) {
          pour.save(function (err) {
            if (err) { return next(err); }
          });
          callback(null);
        },
        function (callback) {
          contre.save(function (err) {
            if (err) { return next(err); }
          });
          callback(null);
            
        } ],
        // optional callback
        function (err) {
          if (err) { return next(err); }
          dossier.hookEnabled = true;
          
          dossier.save(function (err) {
            if (err) { return next(err); }
            res.redirect('/dossiers');
          });
        });
    }
    }
];


// Display Dossier delete form on GET.
/*exports.dossier_delete_get = function(req, res, next) {

    async.parallel({
        dossier: function(callback) {
            Dossier.findById(req.params.id).exec(callback);
        },
        dossier_sousdossier: function(callback) {
            Book.find({ 'dossier': req.params.id }).exec(callback);
        },
    }, function(err, results) {
        if (err) { return next(err); }
        if (results.dossier==null) { // No results.
            res.redirect('/admin/dossiers');
        }
        // Successful, so render.
        res.render('admin/dossier/supprimer_dossier', { title: 'Delete Dossier', dossier: results.dossier } );
    });

};*/

// Handle Dossier delete on POST.
/*exports.dossier_delete_post = function(req, res, next) {

    async.parallel({
        dossier: function(callback) {
            Dossier.findById(req.params.id).exec(callback);
        },
        
    }, function(err, results) {
        if (err) { return next(err); }
        
            // Dossier has no books. Delete object and redirect to the list of dossiers.
            Dossier.findByIdAndRemove(req.body.id, function deleteDossier(err) {
                if (err) { return next(err); }
                // Success - go to dossiers list.
                res.redirect('/admin/dossiers');
            }
                                   );
    });

};*/

// Display Dossier update form on GET.
exports.dossier_update_get = function (req, res, next) {

  Dossier.
  findOne({
    _id: req.params.id
  }).
  populate('pour').
  populate('contre').
  exec(function (err, dossier) {
    if (err) {
      return next(err);
    }
    if (dossier == null) { // No results.
      var err = new Error('Dossier not found');
      err.status = 404;
      return next(err);
    }
    // Success.
    res.render('dossier/dossier_form', {
      title: 'Update Dossier',
      dossier: dossier
    });
  });

};

// Handle Dossier update on POST.
exports.dossier_update_post = [

    // Process request after validation and sanitization.
  (req, res, next) => {
   
    // Extract the validation errors from a request .
    const errors = validationResult(req);

    // Create a dossier object with escaped and trimmed data (and the old id!)
    var dossier = new Dossier({
      _id: req.params.id
    });
    
    if (req.body.attributaire && req.body.attributaire != ""){dossier.attributaire = req.body.attributaire}
    if (req.body.nature && req.body.nature != ""){dossier.nature = req.body.nature}
    if (req.body.resume && req.body.resume != ""){dossier.resume = req.body.resume}
    if (req.body.montant && req.body.montant != ""){dossier.montant = req.body.montant}
    
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values and error messages.
      res.render('/dossier/dossier_detail', {title: 'Gestionnaire de Dossier', dossier: dossier, errors: errors.array() });
      return;
    } else {
      // Data from form is valid. Update the record.
      Dossier.findOneAndUpdate({_id:req.params.id}, dossier, {upsert: true}, function (err, thedossier) {
        if (err) { next(err); }

        // Successful - redirect to dossier detail page.
        res.send({type_of_response: 'success'});
        return;
        
      });
    }
    }
];


exports.dossiers_en_cours = function (req, res, next) {
    async.parallel({
    dossier: function (callback) {
      Dossier.findById(req.params.id)
        .populate('pour')
        .populate('contre')
        .exec(callback);
    },
  }, function (err, results) {
    if (err) {
      return next(err);
    }
    if (results.dossier == null) { // No results.
      var err = new Error('Dossier not found');
      err.status = 404;
      return next(err);
    }

    // Successful, so render.
    res.render('dossiers/dossier_detail', {
      title: 'Gestionnaire de Dossier',
      dossier: results.dossier
    });
  });
};

exports.repartition = function (req, res, next) { 
  async.parallel({
    dossier: function (callback) {
      Dossier.findById(req.params.id)
        .populate('pour')
        .populate('contre')
        .exec(callback);
    },
  }, function (err, results) {
    if (err) {
      return next(err);
    }
    if (results.dossier == null) { // No results.
      var err = new Error('Dossier not found');
      err.status = 404;
      return next(err);
    }

    // Successful, so render.
    res.render('dossiers/dossier_detail', {
      title: 'Gestionnaire de Dossier',
      dossier: results.dossier
    });
  });
};

exports.save_pieces = [
    async (req, res, next) => {
        var dossier_piece = '';
        var tableau_piece = '';
        
        switch (req.params.type_piece) {
          case 'pieces-formes':
            dossier_piece = 'documents/pieces_formes';
            tableau_piece = 'pieces_formes';
            break;
          case 'pieces-fonds':
            dossier_piece = 'documents/pieces_fonds';
            tableau_piece = 'pieces_fonds';
            break;
          case 'ecritures-recues':
            dossier_piece = 'documents/ecritures_recues';
            tableau_piece = 'ecritures_recues';
            break;
          case 'ecritures-envoyees':
            dossier_piece = 'documents/ecritures_envoyees';
            tableau_piece = 'ecritures_envoyees';
            break;
          case 'courriers-divers':
            dossier_piece = 'documents/courriers_divers';
            tableau_piece = 'courriers_divers';
            break;
          
          default:
            // code block
        };
        //console.log(req.files[0].path)
        
        // Upload to Cloudinary
      try {
        var result = await cloudinary.v2.uploader.upload(req.files[0].path, {folder:dossier_piece}); // rajouter la var nom du cabinet
        //console.log(result)
        
        Dossier.findById(req.params.id, function (err, thedossier) {
            if(err) return next(err);
            
            var piece = {doa:moment(), originalname:req.files[0].originalname, classeur:dossier_piece, piece_url:result.secure_url, size:req.files[0].size, public_id:result.public_id};
            var new_piece;
            if(tableau_piece == 'pieces_formes'){
              
              new_piece = thedossier.pieces.pieces_formes.create(piece);
              var url_delete = '/dossiers/dossier/'+req.params.id+'/type_piece/'+req.params.type_piece+'/delete_pieces/'+new_piece._id.toString();
              new_piece.deleteUrl = url_delete;
              thedossier.pieces.pieces_formes.push(new_piece);
            }else if(tableau_piece == 'pieces_fonds'){
              new_piece = thedossier.pieces.pieces_fonds.create(piece);
              var url_delete = '/dossiers/dossier/'+req.params.id+'/type_piece/'+req.params.type_piece+'/delete_pieces/'+new_piece._id.toString();
              new_piece.deleteUrl = url_delete;
              thedossier.pieces.pieces_fonds.push(new_piece);
            }else if(tableau_piece == 'ecritures_recues'){
              new_piece = thedossier.pieces.ecritures_recues.create(piece);
              var url_delete = '/dossiers/dossier/'+req.params.id+'/type_piece/'+req.params.type_piece+'/delete_pieces/'+new_piece._id.toString();
              new_piece.deleteUrl = url_delete;
              thedossier.pieces.ecritures_recues.push(new_piece);
            
            }else if(tableau_piece == 'ecritures_envoyees'){
              new_piece = thedossier.pieces.ecritures_envoyees.create(piece);
              var url_delete = '/dossiers/dossier/'+req.params.id+'/type_piece/'+req.params.type_piece+'/delete_pieces/'+new_piece._id.toString();
              new_piece.deleteUrl = url_delete;
              thedossier.pieces.ecritures_envoyees.push(new_piece);
            
            }else if(tableau_piece == 'courriers_divers'){
              new_piece = thedossier.pieces.courriers_divers.create(piece);
              var url_delete = '/dossiers/dossier/'+req.params.id+'/type_piece/'+req.params.type_piece+'/delete_pieces/'+new_piece._id.toString();
              new_piece.deleteUrl = url_delete;
              thedossier.pieces.courriers_divers.push(new_piece);
            }else{
              return next();
            };
            
            thedossier.save();
            var tab_images_renvoi = [];
            
            var image_renvoi = {name:req.files[0].originalname,url:result.secure_url, size:req.files[0].size,thumbnailUrl:result.secure_url, deleteUrl:url_delete, deleteType:'POST'};
            tab_images_renvoi.push(image_renvoi);
            var renvoi = {files:tab_images_renvoi};
            
            res.send(renvoi);
        });
      } catch(error) {
        //console.log(error)
        return next(new Error('Failed to upload file'));
      }
    }
];

exports.delete_pieces = [
  (req, res, next) => {
      var tableau_piece = '';

      switch (req.params.type_piece) {
        case 'pieces-formes':
          tableau_piece = 'pieces_formes';
          break;
        case 'pieces-fonds':
          tableau_piece = 'pieces_fonds';
          break;
        case 'ecritures-recues':
          tableau_piece = 'ecritures_recues';
          break;
        case 'ecritures-envoyees':
          tableau_piece = 'ecritures_envoyees';
          break;
        case 'courriers-divers':
          tableau_piece = 'courriers_divers';
          break;

        default:
          // code block
      } 
    
    Dossier.findOne({_id: req.params.id})
      .exec(function (err, dossier) {
        if (err) { return next(err); }
        if (dossier == null) { // No results.
          var err = new Error('Dossier not found');
          err.status = 404;
          return next(err);
        }
        dossier.pieces[tableau_piece].forEach(function(lapiece){
          if(lapiece._id.toString() == req.params.id_piece.toString()){
            cloudinary.uploader.destroy(lapiece.public_id, function(result) { 
              if (result.result == 'ok'){
                if(tableau_piece == 'pieces_formes'){
                  dossier.pieces.pieces_formes.id(lapiece._id).remove();
                };
                if(tableau_piece == 'pieces_fonds'){
                  dossier.pieces.pieces_fonds.id(lapiece._id).remove();
                };
                if(tableau_piece == 'ecritures_recues'){
                  dossier.pieces.ecritures_recues.id(lapiece._id).remove();
                };
                if(tableau_piece == 'ecritures_envoyees'){
                  dossier.pieces.ecritures_envoyees.id(lapiece._id).remove();
                };
                if(tableau_piece == 'courriers_divers'){
                  dossier.pieces.courriers_divers.id(lapiece._id).remove();
                };
                
                dossier.save(function (err) {
                  if (err) return handleError(err);
                  console.log('the sub-doc was removed')
                });
              }
              return;
            });
            
          }
        })
        
        next();
      });
  }
];
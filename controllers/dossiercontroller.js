var Dossier = require('../models/dossier');

var Counter = require('../models/counter');
var Pour = require('../models/pour');
var Contre = require('../models/contre');
var Juridiction = require('../models/juridiction');
var Instruction = require('../models/instruction');
var Utilisateur = require('../models/utilisateur');
var Nature = require('../models/nature');

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

// Display list of all Dossier.
exports.dossier_list = function (req, res, next) {

  // Get all dossier for form
  async.parallel({
    dossiers: function (callback) {
      Dossier.find({})
        .select({ "_id": 1, "ref_d": 1, "ref_d_p": 1, "pour":1, "contre":1, "ref_d_p": 1})
        .populate('pour')
        .populate('contre')
        .populate('utilisateur')
        .sort({ ref_d: 1 })
        .exec(callback);
    }
  }, function (err, results) {
    if (err) {
      return next(err);
    }
    res.render('dossiers/dossier_list', {
      title: 'Liste de dossiers',
      list_dossiers: results.dossiers
    });
  });

};

exports.found_client_get = function (req, res, next) {

  // Get all dossier for form
  async.parallel({
    dossiers: function (callback) {
      Dossier.find({pour: req.params.id})
        .select({ "_id": 1, "ref_d": 1, "litige": 1,"nature": 1, "resume": 1, "montant": 1,  "pour":1, "contre":1})
        .populate('pour')
        .populate('contre')
        .populate('utilisateur')
        .sort({ _id: -1 })
        .exec(callback);
    },
    
  }, function (err, results) {
    if (err) { return next(err); }

    res.render('dossiers/dossier_found', {
      title: 'Liste de dossiers',
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
        .exec(callback);
    },
    juridictions: function (callback) {
      Juridiction.find()
        .sort({nom:1})
        .exec(callback);
    },
    utilisateurs:function (callback) {
      Utilisateur.find()
        .exec(callback);
    },
    instructions: function (callback){
      Instruction.find({dossier:req.params.id})
        .populate('juridiction')
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
    
    var j_instance = [];
    var j_appel = [];
    var j_cour = [];
    
    results.juridictions.forEach(function(j){
      if(j.division == 'instance'){
        j_instance.push(j);
      }else if(j.division == 'appel'){
        j_appel.push(j);
      }else if(j.division == 'cour'){
        j_cour.push(j);
      }
    })
    
    var i_instance = [];
    var i_appel = [];
    var i_cour = [];
    
    results.instructions.forEach(function(i){
      if(i.juridiction.division == 'instance'){
        i_instance.push(i);
      }else if(i.juridiction.division == 'appel'){
        i_appel.push(i);
      }else if(i.juridiction.division == 'cour'){
        i_cour.push(i);
      }
    })
    
    res.render('dossiers/dossier_detail', {
      title: 'Gestionnaire de Dossier',
      dossier: results.dossier, juridictions: results.juridictions, instructions:results.instructions, utilisateurs:results.utilisateurs, j_instance:j_instance, j_appel:j_appel, j_cour:j_cour, i_instance:i_instance, i_appel:i_appel, i_cour:i_cour
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
    pours: function (callback) {
      Pour.find({})
        .exec(callback);
    },
    contres: function (callback) {
      Contre.find({})
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
    res.render('dossiers/dossier_form', { title: 'Creation de dossier', utilisateurs:results.utilisateurs});
  });
};

// Handle Dossier create on POST.
exports.dossier_create_post = [

  // Process request after validation and sanitization.
  (req, res, next) => {
    // Extract the validation errors from a request .
    const errors = validationResult(req);
    
    let pour = new Pour({
      p_nom: req.body[0]['p_nom'],
      p_tel: req.body[0]['p_tel'],
      p_email: req.body[0]['p_email']
    });

    let contre = new Contre({
      c_nom: req.body[0]['c_nom'],
      c_tel: req.body[0]['c_tel'],
      c_email: req.body[0]['c_email']
    });

    let dossier = new Dossier({
      ref_d_p: req.body[0]['ref_d_p'],
      pour: pour,
      contre: contre
    });

    dossier.pour = pour;
    dossier.contre = contre;
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
      pour.save(function (err) {
        if (err) { return next(err); }
      });
      contre.save(function (err) {
        if (err) { return next(err); }
      });
      dossier.hookEnabled = true;
      dossier.save(function (err) {
        if (err) { return next(err); }
        res.send({type_of_response: 'success'});
        return;
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
    console.log(req.body.ref_d_p);
    if (req.body.ref_d_p && req.body.ref_d_p != ""){dossier.ref_d_p = req.body.ref_d_p}
    if (req.body.attributaire && req.body.attributaire != ""){dossier.attributaire = req.body.attributaire}
    if (req.body.qualite && req.body.qualite != ""){dossier.qualite = req.body.qualite}
    if (req.body.nature && req.body.nature != ""){dossier.nature = req.body.nature}
    if (req.body.gain_perte && req.body.gain_perte != ""){dossier.gain_perte = req.body.gain_perte}
    if (req.body.resume && req.body.resume != ""){dossier.resume = req.body.resume}
    if (req.body.montant && req.body.montant != ""){dossier.montant = req.body.montant}
    
    if (!errors.isEmpty()) {
      // There are errors. Render the form again with sanitized values and error messages.
      res.render('/dossier/dossier_detail', {title: 'Gestionnaire de Dossier', dossier: dossier, errors: errors.array() });
      return;
    } else {
      // Data from form is valid. Update the record.
      Dossier.findOneAndUpdate({_id:req.params.id}, dossier, {upsert: true}, function (err) {
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

exports.get_list_pieces = function (req, res, next){
  
  async.parallel({
      dossier: function (callback) {
          Dossier.findById(req.params.id, 'pieces')
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
        
        
        //console.log(results.dossier.pieces[req.params.type_piece])
        res.send(results.dossier.pieces[req.params.type_piece])
    
        // Successful, so render.
        /*res.render('dossiers/dossier_detail', {
          title: 'Gestionnaire de Dossier',
          dossier: results.dossier
        });*/
      });
  
};

exports.save_pieces = [
    async (req, res, next) => {
      
              
        var dossier_piece = '';
        var tableau_piece = '';
        
        switch (req.params.type_piece) {
          case 'pieces_formes':
            dossier_piece = 'documents/pieces_formes';
            tableau_piece = 'pieces_formes';
            break;
          case 'pieces_fonds':
            dossier_piece = 'documents/pieces_fonds';
            tableau_piece = 'pieces_fonds';
            break;
          case 'ecritures_recues':
            dossier_piece = 'documents/ecritures_recues';
            tableau_piece = 'ecritures_recues';
            break;
          case 'ecritures_envoyees':
            dossier_piece = 'documents/ecritures_envoyees';
            tableau_piece = 'ecritures_envoyees';
            break;
          case 'courriers_divers':
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
                  //console.log('the sub-doc was removed')
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

function get_initiales(titulaire_comp) {
  // var str = "";
  // var reference = "";

  //on découpe le prénom puis le nom
  var titulaire_comp_tab = titulaire_comp.split("/");

  // on crée la variable des initiales et on y ajoute nos initiales
  var initiales = '';
  titulaire_comp_tab.forEach(function(element) {
    initiales += element.charAt(0);
  });

  return initiales.replace(/[^a-zA-Z0-9]+/g, "");
};
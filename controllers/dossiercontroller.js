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

var encryption = require('../middles/encryption.js');
var encrypt = encryption.encrypt;
var decrypt = encryption.decrypt;



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
      Dossier.find({})
        .select({ "_id": 1, "ref_d": 1, "pour":1, "contre":1})
        .populate('pour')
        .populate('contre')
        .populate('utilisateur')
        .sort({ _id: -1 })
        .exec(callback);
    },
    
  }, function (err, results) {
    if (err) {
      return next(err);
    }
        
    /*results.dossiers.forEach(function(dos){
      if(dos.pour._id == '5cfc2896fef9175a40e1d47d' || dos.pour._id == '5cfbd642077717192410d6f9'){
        //return
        //dos.pour.pp.p_prenom = decrypt(JSON.parse(dos.pour.pp.p_prenom))
        //dos.pour.pp.p_nom = decrypt(JSON.parse(dos.pour.pp.p_nom))
        console.log(dos)
      }
    })*/
    res.render('dossiers/dossier_list', {
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
    if (err) {
      return next(err);
    }
    
    res.render('dossiers/dossier_found', {
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
    /*last_instruction_appel: function (callback){
      Instruction.findOne({dossier:req.params.id})
        .populate({path:'juridiction', match:{'division':'appel'}})
        .sort({i_update: -1})
        .exec(callback);
    },
    last_instruction_cour: function (callback){
      Instruction.findOne({dossier:req.params.id})
        .populate({path:'juridiction', match:{'division':'cour'}})
        .sort({i_update: -1})
        .exec(callback);
    },*/
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
    
    // Successful, so render.
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

    if (results.pours == null) { // No results.
      var err = new Error('Pours not found');
      err.status = 404;
      return next(err);
    }

    if (results.contres == null) { // No results.
      var err = new Error('Contres not found');
      err.status = 404;
      return next(err);
    }
    
    // Successful, so render.
    res.render('dossiers/dossier_form', { title: 'Creation de Dossier', utilisateurs:results.utilisateurs, pours:results.pours, contres:results.contres });
  });
  
  
};

// Handle Dossier create on POST.
exports.dossier_create_post = [

  // Process request after validation and sanitization.
  (req, res, next) => {
    
    /*console.log(encrypt(req.body.p_prenom));
    console.log(encrypt(req.body.p_nom));
    return;*/
        
    var boolClt = boolContre = 0
    //console.log('okkkkk')
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    /*if(req.body.titulaire == 'null'){
      req.flash('Erreur','Veuillez saisir le Titulaire du dossier à créer')
    }
    if(req.body.p_type == ''){
      req.flash('Erreur','Veuillez Choisir le Type de Client')
    }else if(req.body.c_type == ''){
      req.flash('Erreur','Veuillez Choisir le Type de la Partie Adverse')
    }else if(req.body.p_type == 'pp' && (req.body.p_prenom || req.body.p_nom)){
      req.flash('Erreur','Veuillez Saisir les Nom et Prénom(s) du Client')
    }else if(req.body.p_type == 'pm' && (req.body.p_denomination)){
      req.flash('Erreur','Veuillez Saisir la Dénomination du Client')
    }else if(req.body.c_type == 'pp' && (req.body.c_prenom || req.body.c_nom)){
      req.flash('Erreur','Veuillez Saisir les Nom et Prénom(s) de la Partie Adverse')
    }else if(req.body.c_type == 'pm' && (req.body.c_denomination)){
      req.flash('Erreur','Veuillez Saisir la Dénomination de la Partie Adverse')
    }*/
    // Create a genre object with escaped and trimmed data.
    var dossier = new Dossier({
      titulaire: req.body.titulaire
    });
    
    // creation du pour
    if(req.body.clientP === undefined && req.body.clientM === undefined)
    {
      var pour = new Pour({
        p_type: req.body.p_type
      });
    }
    else if(req.body.clientP != undefined && req.body.clientM === undefined)
    {
      boolClt = 1
      var pour = req.body.clientP
    }
    else
    {
      boolClt = 1
      var pour = req.body.clientM
    }

    // creation du contre
    if(req.body.adverseP === undefined && req.body.adverseM === undefined)
    {
      var contre = new Contre({
        c_type: req.body.c_type
      });
    }
    else if(req.body.adverseP != undefined && req.body.adverseM === undefined)
    {
      boolContre = 1
      var contre = req.body.adverseP
    }
    else
    {
      boolContre = 1
      var contre = req.body.adverseM
    }

    if(req.body.clientP === undefined && req.body.clientM === undefined)
    {
      switch (req.body.p_type) {
        case 'pp':
          // alimentation du pour personne physique

          pour.pp.p_prenom = encrypt(req.body.p_prenom);
          pour.pp.p_nom = encrypt(req.body.p_nom);
          pour.pp.p_profession = req.body.p_profession;
          pour.pp.p_nationalite = req.body.p_nationalite;
          if(req.body.p_dob != '') pour.pp.p_dob = moment(req.body.p_dob, "DD-MM-YYYY");
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
    }
    if(req.body.adverseP === undefined && req.body.adverseM === undefined)
    {
      switch (req.body.c_type) {
        case 'pp':

          contre.pp.c_prenom = req.body.c_prenom;
          contre.pp.c_nom = req.body.c_nom;
          contre.pp.c_profession = req.body.c_profession;
          contre.pp.c_nationalite = req.body.c_nationalite;
          if(req.body.c_dob != '') contre.pp.c_dob = moment(req.body.c_dob, "DD-MM-YYYY");
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
          // creation du contre morale

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
      
      if ( boolClt == 0){
        pour.save(function (err) {
          if (err) { return next(err); }
        })
      }

      if (boolContre == 0){
        contre.save(function (err) {
          if (err) { return next(err); }
        })
      }  

      dossier.hookEnabled = true;
          
      dossier.save(function (err) {
        if (err) { return next(err); }
        res.redirect('/dossiers');
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
    
    if (req.body.attributaire && req.body.attributaire != ""){dossier.attributaire = req.body.attributaire}
    if (req.body.litige && req.body.litige != ""){dossier.litige = req.body.litige}
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
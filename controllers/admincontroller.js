var Dossier = require('../models/dossier');
var Configuration = require('../models/configuration');

var Profil = require('../models/profil');
var Utilisateur = require('../models/utilisateur');
var Instruction = require('../models/instruction');

var async = require('async');
var moment = require('moment');
const flash = require('express-flash-notification');

//mongoose.Promise = require('bluebird');

var cloudinary = require('cloudinary');

cloudinary.config({ 
    cloud_name: 'prorole', 
    api_key: '675842782989895', 
    api_secret: 'Lc5kh5dKKKla8Brcci87Jf8BOL0' 
});

//const NotifySend = require('node-notifier').NotifySend;
//var notifier = new NotifySend();

const {
  body,
  validationResult
} = require('express-validator/check');
const {
  sanitizeBody
} = require('express-validator/filter');

// L'index de la page des dossiers nous redirige vers la liste des dossiers
exports.index = function(req, res, next) {
  res.redirect('/administrateur/utilisateurs');
};
// Display list of all Dossier.
exports.utilisateurs_list = function (req, res, next) {

  // Get all dossier for form
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

    res.render('administrateur/personnel_list', {title:' Table des utilisateurs', list_utilisateurs: results.utilisateurs });
  });

};


exports.profils_list = function (req, res, next){
  
  // Get all dossier for form
  async.parallel({
    profils: function (callback) {
      Profil.find()
        .exec(callback);
    },
  }, function (err, results) {
    if (err) {
      return next(err);
    }
    if (results.profils != null){
      res.send( {list_profils: results.profils });
    }
    
  });
  
}


exports.utilisateur_create = [

    // Process request after validation and sanitization.
  (req, res, next) => {
    
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    
    Utilisateur.findOne({ $or:[ {'pseudo':req.body.u_pseudo},{'telephone':req.body.u_telephone}, {'email':req.body.u_email}]}, 'telephone email pseudo' ,
      function(err, exist_user){
        if (err) return next(err);
        if(exist_user && exist_user.pseudo == req.body.u_pseudo) {
          res.send({type_of_response: 'echec', msg:'L\'identifiant saisi existe déjà! Veuillez utiliser un autre identifiant!' });
          res.end;
        }
        if(exist_user && exist_user.email == req.body.u_email && exist_user.telephone == req.body.u_telephone) {
          res.send({type_of_response: 'echec', msg:'Veuillez changer de numéro de Téléphone et d\'adresse Email!' });
          res.end;
        }
        if(exist_user && exist_user.telephone == req.body.u_telephone) {
          res.send({type_of_response: 'echec', msg:'Le Numéro de Téléphone existe déjà! Veuillez changer de numéro de Téléphone!' });
          res.end;
        }
        if(exist_user && exist_user.email == req.body.u_email) {
          res.send({type_of_response: 'echec', msg:'L\'Email existe déjà! Veuillez changer d\'adresse Email!' });
          res.end;
        }

        if(!exist_user){// Create a genre object with escaped and trimmed data.
        var utilisateur = new Utilisateur({
          pseudo:req.body.u_pseudo,
          nom:req.body.u_nom,
          prenom:req.body.u_prenom,
          profil:req.body.u_profil,
          telephone:req.body.u_telephone,
          email:req.body.u_email,
          pswd:req.body.u_pwd
        });

        if (!req.body.u_pwd === req.body.u_pwd2) {
                return res.send({type_of_response: 'echec', msg:'Veuillez confirmer le mot de passe' });
            }
        if (!errors.isEmpty()) {
          // There are errors. Render the form again with sanitized values/error messages.
          res.render('administrateur/personnel_list', { title: 'Table des Utilisateurs', errors: errors.array() });
          return;
        } else {

          utilisateur.save(function (err) {
              if (err) { return next(err); }
              // Successful - redirect to new author record.
              res.redirect('/administrateur/utilisateurs');
          });
        }}
      });
    
    
  }
];

exports.utilisateur_page_get = function (req, res, next){
  // Get all dossier for form
  async.parallel({
    utilisateur: function (callback) {
      Utilisateur.findOne(req.user._id) // A modifier et à restreindre la recherche à req.user
        .populate('profil')
        .exec(callback);
    },
    mes_dossiers: function (callback) {
      Dossier.find({$or:[{titulaire:req.params.id},{attributaire:req.params.id}]}) // A modifier et à restreindre la recherche à req.user
        .populate('utilisateur')
        .exec(callback);
    }
  }, async (err, results) => {
    if (err) {
      return next(err);
    }
    
    
   await (async (results) => {
    var mes_instructions_en_cours = [];
    
    //console.log("Mes dossiers", results.mes_dossiers)
    
    var identifiants_dossiers = await results.mes_dossiers.map(dossier => dossier._id.toString() );
    
    //console.log("Identifiants", identifiants_dossiers)
    
    await Promise.all(identifiants_dossiers.map(async id => {
      var data ={};
      var instruction = await Instruction.findOne({dossier: id}).sort({i_update: -1})
      var dossier = await Dossier.findById(id).populate('pour').populate('contre')
      data.dossier = dossier
      data.instruction = instruction
      
      mes_instructions_en_cours.push(data);
    }));
    
     //console.log(mes_instructions_en_cours)
    
    
    if (results.utilisateur != null){
      res.render('administrateur/personnel_detail', {utilisateur: results.utilisateur, nb_dossiers:results.mes_dossiers.length, mes_dossiers:mes_instructions_en_cours});
    }
     
   })(results);
    
  });
};

exports.save_avatar_post = [
  async (req, res, next) => {  
      // Is there any file?
      if(!(req.file && (req.file.fieldname == 'avatar'))) return next(new Error('No avatar to upload'));

      // Upload to Cloudinary
    try {
      var result = await cloudinary.v2.uploader.upload(req.file.path, {folder:'utilisateurs/photos'}); // rajouter la var nom du cabinet
      console.log(result.secure_url.toString());
      Utilisateur.findByIdAndUpdate(req.params.id, {avatar: result.secure_url.toString()}, (err) => {
          if(err) return next(err);
          
          res.send(result);
      });
    } catch(error) {
      console.log(error)
      return next(new Error('Failed to upload avatar'));
    }
  }
];

exports.update_utilisateur_post = [
  // Process request after validation and sanitization.
  (req, res, next) => {
    
    // Extract the validation errors from a request.
    const errors = validationResult(req);
    
    // Create a genre object with escaped and trimmed data.
    
    if (!errors.isEmpty()) {
      console.log(errors)
      return;
      // There are errors. Render the form again with sanitized values/error messages.
      res.render('administrateur/personnel_detail', { title: 'Détail des Utilisateurs', errors: errors.array() });
      return;
    } else {
      Utilisateur.findById(req.params.id, function (err, doc) {
        if (err) {return next(err);}
        
        if (req.body.email){
          doc.email = req.body.email;
        }

        if (req.body.telephone){
          doc.telephone = req.body.telephone;
        }
        if (req.body.pswd){
          doc.pswd = req.body.pswd;
        }
        doc.save(function (err) {
            if (err) { console.log(err); return next(err); }
            // Successful - redirect to new author record.
            res.send({'type_of_response':'success'});
        });
      });
      
    }
  }
];

exports.configuration_du_cabinet = function (req, res, next){
  
  // Get all dossier for form
  async.parallel({
    configuration: function (callback) {
      Configuration.findOne({})
        .exec(callback);
    },
    
  }, function (err, results) {
    if (err) {
      return next(err);
    }

    res.render('administrateur/configuration', {title:' Configuration du compte du Cabinet', configuration:results.configuration});
  });
};

exports.modification_configuration_du_cabinet_get = function (req, res, next){
  //console.log('ok');
  //return;
  // Get all dossier for form
  async.parallel({
    configuration: function (callback) {
      Configuration.findOne({})
        .exec(callback);
    },
    
  }, function (err, results) {
    if (err) {
      return next(err);
    }
    if(!results.configuration){
      var configuration = {};
    }else{
      
      var configuration = results.configuration;
    }
    //console.log(configuration)
    res.render('administrateur/page_de_modification', {title:' Modification du compte du Cabinet', configuration:configuration});
  });
};

exports.modification_configuration_du_cabinet_post = [
   (req, res, next) => {
     
     if (req.body.password != req.body.confirm_password && req.body.length < 8){
       var error = 'Mot de passe non confirmé';
       return next(error);
     }
     
     var configuration = new Configuration ({
        _id:req.params.id_cabinet,
        identifiant:req.body.identifiant,
        denomination:req.body.denomination,
        siege_social:req.body.siege_social,
        adresse:req.body.adresse,
        telephone:req.body.telephone,
        email:req.body.email,
        password:req.body.password
     })
   // Extract the validation errors from a request.
    const errors = validationResult(req);
    async.parallel({
        theconfiguration: function (callback) {
          Configuration.findOne({})
            .exec(callback);
      },  
    }, function (err, results) {
      if (err) { return next(err); }
      if (results.theconfiguration){
          Configuration.findOneAndUpdate({_id:results.theconfiguration._id},configuration,{upsert: true}, function(err){
                  if(err){ console.log(err); return next(err) }
                  res.redirect('/administrateur/configuration_du_cabinet/page_de_modification');
              });
      }else {
        configuration.save( function(err){
          if (err) { return next(err); }
            res.redirect('/administrateur/configuration_du_cabinet/page_de_modification');
        })
      };      
    });
  }
];

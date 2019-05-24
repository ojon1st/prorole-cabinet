var Counter = require('../models/counter');
var Utilisateur = require('../models/utilisateur');
var mongoose = require('mongoose');
var moment = require('moment');
var async = require('async');
var Schema = mongoose.Schema;

var DossierSchema = new Schema({ 
  ref_d: {type: String, unique:true},
  titulaire: {type: Schema.ObjectId, ref: 'Utilisateur'}, //ref liste des utilisateurs
  attributaire: {type: Schema.ObjectId, ref: 'Utilisateur'}, //ref liste des utilisateurs
  litige: {type: String},
  nature: {type: String}, //ref liste des natures du litige
  resume: {type: String}, 
  montant: {type: Number},
  doc:{type: Date, default:moment()}, //doc: date of creation -- now
  pour:{type: Schema.ObjectId, ref: 'Pour'},
  contre:{type: Schema.ObjectId, ref: 'Contre'},
  autres_pour:[{prenom_nom:String, rs:String}],
  autres_avocats_pour:[{prenom_nom:String, tel:String, email:String}],
  autres_contre:[{prenom:String, nom:String, rs:String}],
  autres_avocats_contre:[{prenom_nom:String, tel:String, email:String}],
  d_update:{type:Date, default:moment()},
  pieces:{deliberer_piece:[{doa:Date, originalname:String, classeur:String, size:Number, piece_url:String, public_id:String, deleteUrl:String}],
         pieces_formes:[{doa:Date, originalname:String, classeur:String, size:Number, piece_url:String, public_id:String, deleteUrl:String}],
         pieces_fonds:[{doa:Date, originalname:String, classeur:String, size:Number, piece_url:String, public_id:String, deleteUrl:String}],
         ecritures_recues:[{doa:Date, originalname:String, classeur:String, size:Number, piece_url:String, public_id:String, deleteUrl:String}],
         ecritures_envoyees:[{doa:Date, originalname:String, classeur:String, size:Number, piece_url:String, public_id:String, deleteUrl:String}],
         courriers_divers:[{doa:Date, originalname:String, classeur:String, size:Number, piece_url:String, public_id:String, deleteUrl:String}]},
  hookEnabled:{ type: Boolean, required: false, default: false }
});

// ref_c: {type: String}, //Référence convention à modifier en faisant ref à la convention
// cas:{type: String}, // à modifier en faisant ref à un cas
// juridiction:{type:String},


  DossierSchema.pre('save', function(next){
    var doc = this;
    if (this.hookEnabled){
      async.parallel({
        seq: function (callback) {
          Counter.findOneAndUpdate({_id: 'dossierid' }, {$inc : {sequence_value : 1} }, { new : true }).exec(callback);
        },
        le_titulaire: function (callback) {
          Utilisateur.findById(doc.titulaire)
            .populate('profil')
            .exec(callback);
        },
      }, function (err, results) {
        if (err) {
          return next(err);
        }
        if (results.le_titulaire == null) { // No results.
          var err = new Error('Utilisateurs not found');
          err.status = 404;
          return next(err);
        }

        // Successful, so render.
        doc.ref_d = results.seq.sequence_value + get_initiales(results.le_titulaire.prenom.toString()+' '+results.le_titulaire.nom.toString()) + moment().format('YYYYMMDD');
        next();
      });
    } else{
      next();
    }
   });
 
function get_initiales(titulaire_comp) {
  // var str = "";
  // var reference = "";

  //on découpe le prénom puis le nom
  var titulaire_comp_tab = titulaire_comp.split(" ");

  // on crée la variable des initiales et on y ajoute nos initiales
  var initiales = '';
  titulaire_comp_tab.forEach(function(element) {
    initiales += element.charAt(0);
  });

  return initiales.replace(/[^a-zA-Z0-9]+/g, "");
};

// Virtual for this genre instance URL.
DossierSchema
.virtual('url')
.get(function () {
  return '/dossier/'+this._id;
});

// Export model.
module.exports = mongoose.model('Dossier', DossierSchema);
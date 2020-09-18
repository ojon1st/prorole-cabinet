var Counter = require('../models/counter');
var Utilisateur = require('../models/utilisateur');
var mongoose = require('mongoose');
var moment = require('moment');
var async = require('async');
var Schema = mongoose.Schema;

var DossierSchema = new Schema({ 
  ref_d: {type: String},
  ref_d_p: {type: String},
  qualite: {type: String},
  nature: {type: String},
  resume: {type: String},
  montant: {type: Number},
  doc:{type: Date, default:moment()}, //doc: date of creation -- now
  pour:{type: Schema.ObjectId, ref: 'Pour'},
  correspondance:[{dossier_id:String, ref:String}],
  contre:{type: Schema.ObjectId, ref: 'Contre'},
  d_update:{type:Date, default:moment()},
  hookEnabled:{ type: Boolean, required: false, default: false }
});

DossierSchema.pre('save', function(next){
  var doc = this;
  if (this.hookEnabled){
    async.parallel({
      seq: function (callback) {
        Counter.findOneAndUpdate({_id: 'dossierid' }, {$inc : {sequence_value : 1} }, { new : true }).exec(callback);
      },
    }, function (err, results) {
      if (err) {
        return next(err);
      }
      // Successful, so render.
      let zero = '0000';
      let num = zero + results.seq.sequence_value;
      doc.ref_d = num.slice(parseInt(num.length - zero.length),num.length);
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
  var titulaire_comp_tab = titulaire_comp.split("/");

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
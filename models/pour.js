//var Counter = require('../models/counter');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PourSchema = new Schema({
  p_type:{type:String, required:true}, //Pour type (pp personne physique ou pm personne morale)
  pp:{
    p_civilite:{type:String},
    p_prenom:{type:String},
    p_nom:{type:String},
    p_profession:{type:String},
    p_nationalite:{type:String},
    p_dob:{type:Date},
    p_pob:{type:String},
    p_domicile:{type:String},
    pp_tel:{type:Number},
    pp_email:{type:String}
  },
  pm:{
    p_denomination:{type:String},
    p_rs:{type:String}, //rs: raison sociale ----- on peut stocker toutes les rs ds une table à part
    p_capital:{type:Number},
    p_devise:{type:String}, //on doit rajouter une devise à coté du capital dans un selectbox
    p_siege:{type:String},
    p_rccm:{type:String},
    p_nif:{type:String},
    p_representant:{type:String}, // le representant légal
    pm_tel:{type:Number},
    pm_email:{type:String}
  }
  // on peut rajouter dans un tableau tous les dossiers ouverts au nom de ce client ???
  // doit on rajouter des infos sur le client tel que numero de tel, e-mail etc.
                            
  // dans notre formulaire on doit vider les champs à chaque changement de type de form et faire une verif jquery des champs vides surtout les premiers prenom & nom / raison sociale
});

// Virtual for this genre instance URL.
PourSchema
.virtual('url')
.get(function () {
  return '/partie/pour/'+this._id;
});

// Export model.
module.exports = mongoose.model('Pour', PourSchema);
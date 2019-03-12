//var Counter = require('../models/counter');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ContreSchema = new Schema({ 
  c_type:{type:String, required:true}, //Contre type (pp personne physique ou pm personne morale)
  pp:{
    c_prenom:{type:String},
    c_nom:{type:String},
    c_profession:{type:String},
    c_nationalite:{type:String},
    c_dob:{type:Date},
    c_pob:{type:String},
    c_domicile:{type:String},
    cp_tel:{type:Number},
    cp_email:{type:String}
  },
  pm:{
    c_denomination:{type:String},
    c_rs:{type:String}, //rs: raison sociale ----- on peut stocker toutes les rs ds une table à part
    c_capital:{type:Number},
    c_devise:{type:String, default:'F CFA'}, //on doit rajouter une devise à coté du capital dans un selectbox
    c_siege:{type:String},
    c_rccm:{type:String},
    c_nif:{type:String},
    c_representant:{type:String}, // le representant légal
    cm_tel:{type:Number},
    cm_email:{type:String}
  }
  // on peut rajouter dans un tableau tous les dossiers ouverts au nom de ce client ???
  // doit on rajouter des infos sur le client tel que numero de tel, e-mail etc.
                            
  // dans notre formulaire on doit vider les champs à chaque changement de type de form et faire une verif jquery des champs vides surtout les premiers prenom & nom / raison sociale
});

// Virtual for this genre instance URL.
ContreSchema
.virtual('url')
.get(function () {
  return '/partie/contre/'+this._id;
});

// Export model.
module.exports = mongoose.model('Contre', ContreSchema);
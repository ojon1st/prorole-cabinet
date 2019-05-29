var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var InstructionSchema = new Schema({
  dossier:{type: Schema.ObjectId, ref: 'Dossier', required:true},
  phase:{type: Schema.ObjectId, ref: 'Phase'},
  degre_instruction:{type:String},
  juridiction:{type: Schema.ObjectId, ref: 'Juridiction'},
  calendrier:[{c_conclusion:String,c_debut:Date,c_fin:Date,c_heure:String,c_commentaire:String}],
  diligence:[{d_debut:Date,d_fin:Date,d_heure:String,d_commentaire:String}],
  renvois:[{r_date:Date, r_motif:String,r_type:String}],
  decision:{type:String},
  decision_file:{type: String },
  i_update:{type:Date}
  //type: Date, default:moment() 
});

// Export model.
module.exports = mongoose.model('Instruction', InstructionSchema);
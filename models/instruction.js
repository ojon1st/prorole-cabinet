var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var InstructionSchema = new Schema({
  dossier:{type: Schema.ObjectId, ref: 'Dossier', required:true},
  degre_instruction:{type:String},
  juridiction:{type: Schema.ObjectId, ref: 'Juridiction'},
  calendrier:[{c_conclusion:String,c_debut:Date,c_fin:Date,c_heure:String,c_commentaire:String}],
  renvois:[{r_date:Date, r_motif:String,r_type:String}],
  i_update:{type:Date}
});

// Export model.
module.exports = mongoose.model('Instruction', InstructionSchema);
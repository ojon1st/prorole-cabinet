var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var ConfigurationSchema = new Schema({
  identifiant: {type: String, unique:true},
  denomination: {type: String},
  siege_social:{type: String},
  adresse:{type: String},
  telephone:{type: Number},
  email:{type: String},
  id_admin:{type: String, default:'admin'},
  password:{type:String}
});


// Export model.
module.exports = mongoose.model('Configuration', ConfigurationSchema);
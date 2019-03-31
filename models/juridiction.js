var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var JuridictionSchema = new Schema({
  division:{type:String},
  nom:{type:String}
});

// Export model.
module.exports = mongoose.model('Juridiction', JuridictionSchema);
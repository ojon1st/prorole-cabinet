var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var PhaseSchema = new Schema({
  //division:{type:String},
  nom:{type:String}
});

// Export model.
module.exports = mongoose.model('Phase', PhaseSchema);
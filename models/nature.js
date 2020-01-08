var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var NatureSchema = new Schema({
  division:{type:String},
  nom:{type:String}
});

// Export model.
module.exports = mongoose.model('Nature', NatureSchema);
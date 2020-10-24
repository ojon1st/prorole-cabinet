//var Counter = require('../models/counter');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var ContreSchema = new Schema({ 
  c_nom:{type:String}
});

// Virtual for this genre instance URL.
ContreSchema
.virtual('url')
.get(function () {
  return '/partie/contre/'+this._id;
});

// Export model.
module.exports = mongoose.model('Contre', ContreSchema);
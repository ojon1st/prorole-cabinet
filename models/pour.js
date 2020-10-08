//var Counter = require('../models/counter');
var mongoose = require('mongoose');

var Schema = mongoose.Schema;

var PourSchema = new Schema({
  p_nom:{type:String},
  p_tel:{type:Number, default:null},
  p_email:{type:String}
});

// Virtual for this genre instance URL.
PourSchema
.virtual('url')
.get(function () {
  return '/partie/pour/'+this._id;
});

// Export model.
module.exports = mongoose.model('Pour', PourSchema);
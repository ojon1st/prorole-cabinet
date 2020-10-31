var Counter = require('../models/counter');
var mongoose = require('mongoose');
var moment = require('moment');
var async = require('async');
var Schema = mongoose.Schema;

var DossierSchema = new Schema({ 
  ref_d: {type: String},
  ref_d_p: {type: String},
  nature: {type: String},
  qualite: {type: String},
  resume: {type: String},
  c_avocat: {type: String, default: ''},
  doc:{type: Date, default:moment()}, //doc: date of creation -- now
  pour:{type: Schema.ObjectId, ref: 'Pour'},
  correspondance:[{dossier_id:String, ref:String}],
  contre:{type: Schema.ObjectId, ref: 'Contre'},
  d_update:{type:Date, default:moment()},
  hookEnabled:{ type: Boolean, required: false, default: false }
});

DossierSchema.pre('save', function(next){
  var doc = this;
  if (this.hookEnabled){
    async.parallel({
      seq: function (callback) {
        Counter.findOneAndUpdate({_id: 'dossierid' }, {$inc : {sequence_value : 1} }, { new : true }).exec(callback);
      },
    }, function (err, results) {
      if (err) {
        return next(err);
      }
      // Successful, so render.
      let zero = '0000';
      let num = zero + results.seq.sequence_value;
      doc.ref_d = num.slice(parseInt(num.length - zero.length),num.length);
      next();
    });
  } else{
    next();
  }
});

// Virtual for this genre instance URL.
DossierSchema
.virtual('url')
.get(function () {
  return '/dossier/'+this._id;
});

// Export model.
module.exports = mongoose.model('Dossier', DossierSchema);
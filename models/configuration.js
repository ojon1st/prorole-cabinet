var mongoose = require('mongoose');
var bcrypt = require('bcryptjs');
var SALT_WORK_FACTOR = 10;

var Schema = mongoose.Schema;

var ConfigurationSchema = new Schema({
  identifiant: {type: String, unique:true},
  denomination: {type: String},
  siege_social:{type: String},
  adresse:{type: String},
  telephone:{type: Number},
  email:{type: String},
  pswd:{type:String}
});

ConfigurationSchema.pre('save', function(next){
  var doc = this;
  // only hash the password if it has been modified (or is new)
  if (!doc.isModified('pswd')){
      return next();
  } else{
      // generate a salt
      bcrypt.genSalt(SALT_WORK_FACTOR, function(err, salt) {
          if (err) return next(err);

          // hash the password using our new salt
          bcrypt.hash(doc.pswd, salt, function(err, hash) {
              if (err) return next(err);

              // override the cleartext password with the hashed one
              doc.pswd = hash;
              next();
          });
      });
  }
});

// Virtual for this genre instance URL.
ConfigurationSchema.virtual('url').get(function () {});

ConfigurationSchema.methods.comparePassword = function(candidatePassword, hash, cb) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
      cb(null, isMatch);
  });
};


// Export model.
module.exports = mongoose.model('Configuration', ConfigurationSchema);
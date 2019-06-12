var Counter = require('../models/counter');

var mongoose = require('mongoose');
var moment = require('moment');
var bcrypt = require('bcryptjs');
const passportLocalMongoose = require('passport-local-mongoose');
var SALT_WORK_FACTOR = 10;

var Schema = mongoose.Schema;

var UtilisateurSchema = new Schema({
  pseudo:{type: String, unique:true},
  nom:{type: String},
  prenom:{type: String},
  profil:{type: Schema.ObjectId, ref: 'Profil'},
  telephone:{type:Number},
  email:{type: String},
  taux_horaire:{type:Number},
  retro_commission:{type:Number},
  avatar:{type: String },
  pswd:{type: String}
});

// ref_c: {type: String}, //Référence convention à modifier en faisant ref à la convention
// cas:{type: String}, // à modifier en faisant ref à un cas
// juridiction:{type:String},


UtilisateurSchema.pre('save', function(next){
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
UtilisateurSchema
.virtual('url')
.get(function () {
  // return '/dossier/'+this._id;
});

UtilisateurSchema.methods.comparePassword = function(candidatePassword, hash, cb) {
  bcrypt.compare(candidatePassword, hash, function(err, isMatch) {
      //if (err) return cb(err);
      cb(null, isMatch);
  });
};



// Export model.
module.exports = mongoose.model('Utilisateur', UtilisateurSchema);
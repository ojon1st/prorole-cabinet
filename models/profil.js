
var mongoose = require('mongoose');
var moment = require('moment');

var Schema = mongoose.Schema;

var ProfilSchema = new Schema({
  
  nom_profil:{type: String}
  
});


// Virtual for this genre instance URL.
/*UtilisateurSchema
.virtual('url')
.get(function () {
  //return '/dossier/'+this._id;
});*/

// Export model.
module.exports = mongoose.model('Profil', ProfilSchema);
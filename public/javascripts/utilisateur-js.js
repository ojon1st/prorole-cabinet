
function get_profil_list(){
  var la_route = '/administrateur/utilisateurs/profils_list'; 
  var data = {};
  
  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: la_route,
    success: function (data) {
      $('#profil').html('');
      $('#profil').append(new Option("", null));
      data.list_profils.forEach( function(profil){
        $('#profil').append(new Option(profil.nom_profil, profil._id));
      });
      
      return;
    }
  });
  
}


function create_new_utilisateur(){
  /*alert('ok');
  return*/
  var la_route = '/administrateur/utilisateurs/utilisateur_create'; 
  
  
var u_pseudo = $('input[name=u_pseudo]').val();
var u_nom = $('input[name=u_nom]').val();
var u_prenom = $('input[name=u_prenom]').val();
var u_profil = $('select[name=u_profil]').val();
var u_telephone = $('input[name=u_telephone]').val();
var u_email = $('input[name=u_email]').val();
//var u_taux_horaire = $('input[name=u_taux_horaire]').val();
//var u_retro_commission = $('input[name=u_retro_commission]').val();
var u_pwd = $('input[name=u_pwd]').val();
var u_pwd2 = $('input[name=u_pwd2]').val();
  
if(u_nom == '' || u_prenom == '' || u_profil == 'null' || u_telephone == '' || u_email == '' || u_pwd == '' || u_pwd2 == ''){
  //Gérer les flash pour chaque variable invalide
  alert('invalid ');
  return;
}

if (u_pwd.length < 8 ){
  alert('Le mot de passe doit contenir au moins 8 caracteurs')
  return;
}
 if (u_pwd2 != u_pwd){
  alert('Le mot de passe n\'est pas confirmé')
   return;
} 

  
  var data = {};
  data.u_pseudo= u_pseudo;
  data.u_nom= u_nom;
  data.u_prenom= u_prenom;
  data.u_profil= u_profil;
  data.u_telephone= u_telephone;
  data.u_email= u_email;
  data.u_pwd = u_pwd;
  data.u_pwd2 = u_pwd2;
  
  $.ajax({
    type: 'POST',
    data: JSON.stringify(data),
    contentType: 'application/json',
    url: la_route,
    success: function (data) {
      if(data.type_of_response == 'echec'){
        // afficher les messages d'erreurs
        
        alert(data.msg)
        return;
      }
      //location.reload();
      window.location.href="/administrateur/utilisateurs";
      return;
    }
  });
  
}